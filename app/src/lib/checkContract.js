const bs58 = require('bs58');
const connect = require('./connect');

/**
 * @param {object} message - Objects contains target address that will be checked
 * @returns {promise} - Resolves when there is no smart contract data or when smart contract params are succesfully adjusted according to the SmartContractDataGet
 */

function checkContract(message) {
  let returnmsg;
  return new Promise(async function(resolve, reject) {
    // Check if message object contains any 'smart contract' data
    if(Object.prototype.hasOwnProperty.call(message.data, "smart")) {
      // Check if message.smart does not contain code (new contract), but does contain a method that's being called
      if((!Object.prototype.hasOwnProperty.call(message.data.smart, "code")) && (Object.prototype.hasOwnProperty.call(message.data.smart, "method"))) {
        let contractAddress;
        try {
          contractAddress = bs58.decode(message.data.target);
        } catch (e) {
          reject("Invalid target address");
        }
        if(contractAddress !== undefined) {
          /**
           * Request SmartContractData via thrift
           * @param {array} - Decode target address using Base58
           * @returns {object} - Smart contract data
           */
          await connect().SmartContractDataGet(bs58.decode(message.data.target), function(err, r) {
            if(r.status.code === 1) {
              reject("Target address is not a contract");
            } else {
              let params = [];
              let found = false;
                for(let i = 0; i < r.methods.length; i++) {
                    // Check if requested method is a method in the smart contract.
                    if (r.methods[i].name == message.data.smart.method) {
                        found = true;
                        if(message.data.smart.params !== undefined && r.methods[i].arguments.length > 0) {
                          // Compare given contract params to required params.
                          if(message.data.smart.params.length !== r.methods[i].arguments.length) {
                            reject(message.data.smart.params.length + " params given, only " + r.methods[i].arguments.length + " params allowed.");
                          } else {
                            for(let p = 0; p < r.methods[i].arguments.length; p++) {
                              /**
                               * Convert params to be used in signature.js
                               * @param {K: "STRING",V: "Value"}
                               */
                              switch(r.methods[i].arguments[p].type) {
                                case "boolean":
                                if(message.data.smart.params[p] !== true && message.data.smart.params[p] !== false) {
                                  reject("boolean can only be set to true or false");
                                }
                                params.push({K: "BOOL", V: message.data.smart.params[p]});
                                break;
                                case "int":
                                if(!isInt(message.data.smart.params[p])) {
                                  reject("invalid integer");
                                }
                                params.push({K: "INT", V: message.data.smart.params[p]});
                                break;
                                case "java.lang.String":
                                params.push({K: "STRING", V: message.data.smart.params[p].toString()});
                                break;
                                default:
                                reject(r.methods[i].arguments[p].type + " is currently not supported");
                              }
                            }
                            resolve(params);
                          }
                        } else if(r.methods[i].arguments.length > 0 && message.data.smart.params === undefined) {
                          reject("No params added to request, " + r.methods[i].arguments.length + " params needed.");
                        }
                        break;
                    }
                }
              if(!found) {
                reject("Method not found");
              } else {
                resolve(true);
              }
            }
          });
        }
      } else if(Object.prototype.hasOwnProperty.call(message.data.smart, "code")) {
        resolve(true);
      }
    } else {
      resolve(true);
    }
  });
}

/**
 * @param {integer} value - Check is value is an integer
 */

function isInt(value) {
  return !isNaN(value) &&
         parseInt(Number(value)) == value &&
         !isNaN(parseInt(value, 10));
}

module.exports = checkContract;

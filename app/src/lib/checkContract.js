const bs58 = require('bs58');
const connect = require('./connect');

function checkContract(message, sender) {
  let returnmsg;
  return new Promise(async function(resolve, reject) {
    if(Object.prototype.hasOwnProperty.call(message.data, "smart")) {
      if((!Object.prototype.hasOwnProperty.call(message.data.smart, "code")) && (Object.prototype.hasOwnProperty.call(message.data.smart, "method"))) {
        await connect().SmartContractDataGet(bs58.decode(message.data.target), function(err, r) {
          if(r.status.code === 1) {
            reject("Target address is not a contract");
          } else {
            let found = false;
          //  let methodNum = 0;
              for(var i = 0; i < r.methods.length; i++) {
                  if (r.methods[i].name == message.data.smart.method) {
                      found = true;
                    //  methodNum = i;
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
      } else if(Object.prototype.hasOwnProperty.call(message.data.smart, "code")) { // new smart contract
        resolve(true);
      }
    } else {
      resolve(true);
    }
  });
}

module.exports = checkContract;

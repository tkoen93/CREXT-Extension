const connect = require('./connect');
const contractResult = require('./contractResult');
const CreateTransaction = require('./signature');
const nacl = require('tweetnacl');

/**
 * @param {object} params - Object with required parameters
 * @returns {promise} - Returns either the requested value (resolve) or a failed message (reject)
 */

async function contractState(params) {
  return new Promise(function(resolve, reject) {
    // Generate a random keypair to sign this request, no balance needed as NewState is set to true
    let keyPair = nacl.sign.keyPair();
    CreateTransaction({
          Fee: "0.1",
          Source: keyPair.publicKey,
          PrivateKey: keyPair.secretKey,
          Target: params.data.target,
            SmartContract: {
                Method: params.data.method,
                Params: params.data.params,
                NewState: true
            }
    }).then(function(r) {
        if(r.error) {
          console.error(r.message);
        } else {
          connect().TransactionFlow(r.Result, function(err, r) {
            console.log(r);
          //  if(r.status.code === 0 && r.smart_contract_result.v_string !== "Cannot find a method by name and parameters specified") {
          if(r.status.code === 0) {
              resolve(contractResult(r));
            } else {
              reject('failed');
            }
          });
        }
      });
  });
}

module.exports = contractState;

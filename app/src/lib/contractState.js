const connect = require('./connect');
const contractResult = require('./contractResult');
const CreateTransaction = require('./signature');
const nacl = require('tweetnacl');

function contractState(params) {
  return new Promise(function(resolve, reject) {
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
            if(r.status.code === 0 && r.smart_contract_result.v_string !== "Cannot find a method by name and parameters specified") {
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

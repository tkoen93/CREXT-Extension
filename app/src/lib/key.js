const SecureLS = require('secure-ls');
const nacl = require('tweetnacl');
const bs58 = require('bs58');
const CW = require('./CW');

let ls;

chrome.storage.local.get(function(result) {
  	ls = new SecureLS({encodingType: 'aes', encryptionSecret: result.encryption});
});

function exportPublic(v = 0) {
  if(v.toString().substring(0,1) === "c") {
      let n = v.toString().substring(1,v.length);
      let PublicKey = nacl.sign.keyPair.fromSecretKey(Buffer.from(ls.get('seed').custom[n])).publicKey;
      PublicKey = bs58.encode(Buffer.from(PublicKey));
    return PublicKey;
  } else {
      const seed = CW.fromSeed(ls.get('seed').seedHex);
      let PublicKey = bs58.encode(Buffer.from(seed.getKeypair(v)._publicKey));
    return PublicKey;
  }
}

function exportPrivate(v = 0) {
  if(v.toString().substring(0,1) === "c") {
      let n = v.toString().substring(1,v.length);
      let PrivateKey = bs58.encode(Buffer.from(ls.get('seed').custom[n]));
    return PrivateKey;
  } else {
      const seed = CW.fromSeed(ls.get('seed').seedHex);
      let PrivateKey = bs58.encode(Buffer.from(seed.getKeypair(v)._secretKey));
    return PrivateKey;
  }
}

module.exports = {
  exportPublic,
  exportPrivate
};

const SecureLS = require('secure-ls');
const nacl = require('tweetnacl');
const bs58 = require('bs58');

let ls;

chrome.storage.local.get(function(result) {
  	ls = new SecureLS({encodingType: 'aes', encryptionSecret: result.encryption});
});

function concatTypedArrays(a, b) {
    let c = new (Uint8Array.prototype.constructor)(a.length + b.length);
    c.set(a, 0);
    c.set(b, a.length);
    return c;
}

function exportPublic(v = 0) {
    let s = Buffer.from(ls.get('seed'));
    s = concatTypedArrays(s, s);
    min = 0 + v;
    max = 32 + v;
    let pair = nacl.sign.keyPair.fromSeed(s.slice(min, max));
    let PublicKey = bs58.encode(Buffer.from(pair.publicKey));
  return PublicKey;
}

function exportPrivate(v = 0) {
    let s = Buffer.from(ls.get('seed'));
    s = concatTypedArrays(s, s);
    min = 0 + v;
    max = 32 + v;
    let pair = nacl.sign.keyPair.fromSeed(s.slice(min, max));
    let PrivateKey = bs58.encode(Buffer.from(pair.secretKey));
  return PrivateKey;
}

module.exports = {
  exportPublic,
  exportPrivate
};

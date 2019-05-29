const has = require("lodash/has");
const bip39 = require("bip39");
const derivePath = require("./hd-key");
const nacl = require("tweetnacl");
const bs58 = require("bs58");

const ENTROPY_BITS = 256; // = 24 word mnemonic

const INVALID_SEED = "Invalid seed (must be a Buffer or hex string)";
const INVALID_MNEMONIC = "Invalid mnemonic (see bip39)";

class CW {
  /**
   * Instance from a BIP39 mnemonic string.
   * @param {string} mnemonic A BIP39 mnemonic
   * @param {string} [password] Optional mnemonic password
   * @param {string} [language='english'] Optional language of mnemonic
   * @throws {Error} Invalid Mnemonic
   */
  static fromMnemonic(mnemonic, password = undefined, language = "english") {
    if (!CW.validateMnemonic(mnemonic, language)) {
      throw new Error(INVALID_MNEMONIC);
    }
    return new CW(bip39.mnemonicToSeedHex(mnemonic, password));
  }

  /**
   * Instance from a seed
   * @param {(string|Buffer)} binary seed
   * @throws {TypeError} Invalid seed
   */
  static fromSeed(seed) {
    let seedHex;

    if (Buffer.isBuffer(seed)) seedHex = seed.toString("hex");
    else if (typeof seed === "string") seedHex = seed;
    else throw new TypeError(INVALID_SEED);

    return new CW(seedHex);
  }

  /**
   * Generate a mnemonic using BIP39
   * @param {Object} props Properties defining how to generate the mnemonic
   * @param {Number} [props.entropyBits=256] Entropy bits
   * @param {string} [props.language='english'] name of a language wordlist as
   *          defined in the 'bip39' npm module. See module.exports.wordlists:
   *          here https://github.com/bitcoinjs/bip39/blob/master/index.js
   * @param {function} [props.rng] RNG function (default is crypto.randomBytes)
   * @throws {TypeError} Langauge not supported by bip39 module
   * @throws {TypeError} Invalid entropy
   */
  static generateMnemonic({
    entropyBits = ENTROPY_BITS,
    language = "english",
    rngFn = undefined
  } = {}) {
    if (language && !has(bip39.wordlists, language))
      throw new TypeError(
        `Language ${language} does not have a wordlist in the bip39 module`
      );
    const wordlist = bip39.wordlists[language];
    return bip39.generateMnemonic(entropyBits, rngFn, wordlist);
  }

  /**
   * Validate a mnemonic using BIP39
   * @param {string} mnemonic A BIP39 mnemonic
   * @param {string} [language='english'] name of a language wordlist as
   *          defined in the 'bip39' npm module. See module.exports.wordlists:
   *          here https://github.com/bitcoinjs/bip39/blob/master/index.js
   * @throws {TypeError} Langauge not supported by bip39 module
   */
  static validateMnemonic(mnemonic, language = "english") {
    if (language && !has(bip39.wordlists, language))
      throw new TypeError(
        `Language ${language} does not have a wordlist in the bip39 module`
      );
    const wordlist = bip39.wordlists[language];
    return bip39.validateMnemonic(mnemonic, wordlist);
  }

  /**
   * New instance from seed hex string
   * @param {string} seedHex Hex string
   */
  constructor(seedHex) {
    this.seedHex = seedHex;
  }

  /**
   * Derive key given a full BIP44 path
   * @param {string} path BIP44 path string (eg. m/44'/148'/8')
   * @return {Buffer} Key binary as Buffer
   */
  derive(path) {
    const data = derivePath(path, this.seedHex);
    return data.key;
  }


  getKeypair(index) {
    const key = Buffer.from(this.derive(`m/44'/1'/0'/${index}'`));
    return Keypair.fromRawEd25519Seed(key);
  }

  /**
   * Get public key for account at index
   * @param {Number} index Account index into path m/44'/148'/{index}
   * @return {string} Public key
   */
  getPublicKey(index) {
    return this.getKeypair(index).publicKey();
  }

  /**
   * Get secret for account at index
   * @param {Number} index Account index into path m/44'/148'/{index}
   * @return {string} Secret
   */
  getSecret(index) {
    return this.getKeypair(index).secret();
  }
}

function generate(secretKey) {
    const secretKeyUint8 = new Uint8Array(secretKey);
    const naclKeys = nacl.sign.keyPair.fromSeed(secretKeyUint8);
  return Buffer.from(naclKeys.publicKey);
}


class Keypair {
  constructor(keys) {
    if (keys.type !== 'ed25519') {
      throw new Error('Invalid keys type');
    }

    this.type = keys.type;

    if (keys.secretKey) {
      keys.secretKey = Buffer.from(keys.secretKey);

      if (keys.secretKey.length !== 32) {
        throw new Error('secretKey length is invalid');
      }

      this._secretSeed = keys.secretKey;
      this._publicKey = generate(keys.secretKey);
      this._secretKey = Buffer.concat([keys.secretKey, this._publicKey]);

      if (
        keys.publicKey &&
        !this._publicKey.equals(Buffer.from(keys.publicKey))
      ) {
        throw new Error('secretKey does not match publicKey');
      }
    } else {
      this._publicKey = Buffer.from(keys.publicKey);

      if (this._publicKey.length !== 32) {
        throw new Error('publicKey length is invalid');
      }
    }
  }

  /**
   * Creates a new `Keypair` instance from secret. This can either be secret key or secret seed depending
   * on underlying public-key signature system. Currently `Keypair` only supports ed25519.
   * @param {string} secret secret key (ex. `SDAKFNYEIAORZKKCYRILFQKLLOCNPL5SWJ3YY5NM3ZH6GJSZGXHZEPQS`)
   * @returns {Keypair}
   */
  static fromSecret(secret) {
    //const rawSecret = StrKey.decodeEd25519SecretSeed(secret);
    const rawSecret = bs58.decode(secret);
    return this.fromRawEd25519Seed(rawSecret);
  }

  /**
   * Creates a new `Keypair` object from ed25519 secret key seed raw bytes.
   *
   * @param {Buffer} rawSeed Raw 32-byte ed25519 secret key seed
   * @returns {Keypair}
   */
  static fromRawEd25519Seed(rawSeed) {
    return new this({ type: 'ed25519', secretKey: rawSeed });
  }

  /**
   * Returns public key associated with this `Keypair` object.
   * @returns {string}
   */
  publicKey() {
    return bs58.encode(Buffer.from(this._publicKey));
  }

  /**
   * Returns secret key associated with this `Keypair` object
   * @returns {string}
   */
  secret() {
    if (!this._secretSeed) {
      throw new Error('no secret key available');
    }

    if (this.type === 'ed25519') {
      return bs58.encode(Buffer.from(this._secretSeed));
    }

    throw new Error('Invalid Keypair type');
  }

  /**
   * Returns raw secret key.
   * @returns {Buffer}
   */
  rawSecretKey() {
    return this._secretSeed;
  }

}

module.exports = CW;

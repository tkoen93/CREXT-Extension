/**
 * Converts from Uint8Array to integer
 * @param {Uint8Array} Uint8Arr
 * @returns {integer} - Returns integer
 */

function convert(Uint8Arr) {
    var length = Uint8Arr.length;

    let buffer = Buffer.from(Uint8Arr);
    var result = buffer.readUIntBE(0, length);

    return result;
}

module.exports = convert;

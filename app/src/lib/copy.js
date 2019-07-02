const $ = require('jquery');

/**
 * Function that copies text to clipboard
 * @param {string} txt - Text that needs to be copied to clipboard
 */

function copy(txt) {
  let $temp = $("<input>");
  $("body").append($temp);
  $temp.val(txt).select();
  document.execCommand("copy");
  $temp.remove();
}

module.exports = copy;

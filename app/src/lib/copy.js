const $ = require('jquery');

function copy(txt) {
  let $temp = $("<input>");
  $("body").append($temp);
  $temp.val(txt).select();
  document.execCommand("copy");
  $temp.remove();
}

module.exports = copy;

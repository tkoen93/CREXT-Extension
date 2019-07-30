const extension = require('extensionizer');

(function() {

  var s = document.createElement('script');

s.src = extension.runtime.getURL('src/CreditsExtension.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);


})();

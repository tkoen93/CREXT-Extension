chrome.runtime.sendMessage('Inject');

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if(typeof event.data.CStype != 'undefined') {

    chrome.runtime.sendMessage({ org: event.origin, data: event.data.text, CStype: event.data.CStype, CSID: event.data.CSID });

  }

}, false);

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  //message = {CSreturn: true, data: message};
  window.postMessage(message, window);
});

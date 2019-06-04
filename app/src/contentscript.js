/**
 * Only inject CreditsExtension.js when a website uses https.
 */

if (location.protocol === 'https:') {
  chrome.runtime.sendMessage('Inject');
}

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if(location.protocol !== 'https:')
    return;

  if(typeof event.data.CStype != 'undefined') {

    chrome.runtime.sendMessage({ org: event.origin, data: event.data.text, CStype: event.data.CStype, CSID: event.data.CSID });

  }

}, false);

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  window.postMessage(message, window);
});

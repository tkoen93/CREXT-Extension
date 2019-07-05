const bs58 = require('bs58');
const thrift = require('thrift');
const API = require('./gen-nodejs/API');
const selectNode = require('./lib/selectNode');
const nodeTest = require('./lib/nodeTest');
const convert = require('./lib/convert');
const connect = require('./lib/connect');
const contractState = require('./lib/contractState');
const checkContract = require('./lib/checkContract');

global.nodeIP;
global.nodePORT;
let keyPublic;
let access;
let blocked;

chrome.runtime.onInstalled.addListener((details) => {
  console.log(details);
	if (details.reason === 'install') {
    console.log("install message");
	} else if (details.reason === 'update') {
		const thisVersion = chrome.runtime.getManifest().version;
    if(thisVersion !== details.previousVersion) {
  		const statusMsg = `CREXT updated from ${details.previousVersion} to ${thisVersion}`;
  		console.info(statusMsg);
    }
	}
});



window.onload = function(e) {

  chrome.storage.local.get(function(result) {
     global.nodeIP = result.ip;
     global.nodePORT = result.port;
     keyPublic = result.PublicKey;
     access = result.access;
     blocked = result.blocked;

     if(global.nodeIP === undefined) {
			 selectNode()
			 .then(function(r) {
				 global.nodeIP = r;
				 global.nodePORT = 8081;
         chrome.storage.local.set({
           'ip': r,
           'port': 8081
         });
			 });
		 }

   });

}


    chrome.runtime.onMessage.addListener( function(message, sender, callback) {

        let returnmsg;

      if(message == 'Inject') {
        chrome.tabs.executeScript({
          file: 'src/inject.js'
        });

        chrome.storage.local.get(function(result) {
  				let loginTime = result.loginTime;
          if(loginTime > 1) {
  				    let timeNow = new Date().getTime();
  				    if((timeNow-loginTime > 1800000) || result.encryption == '') {
  					     chrome.storage.local.set({
  						      'encryption': ''
  					     });
              }
          }
        });

      } else if(message == 'Logout') {
        access = new Array();
        blocked = new Array();
        global.nodeIP = '';
        global.nodePORT = '';
        keyPublic = '';
      } else if(message == 'Login' || message == 'update') {
        chrome.storage.local.get(function(result) {
           global.nodeIP = result.ip;
           global.nodePORT = result.port;
           keyPublic = result.PublicKey;
           access = result.access;
           blocked = result.blocked;
         });
      } else if(message.CStype != null) {


        let contentMessage = {CStype: message.CStype, CSID: message.CSID, data: message.data, id: sender.tab.id, org: message.org};

        if(typeof keyPublic == 'undefined' || keyPublic == '') {
          returnmsg = {CREXTreturn: message.CStype, CSID: message.CSID, data:{success: false, message: "User not logged in", id: message.data.id}};
          sendMSG(sender.tab.id, returnmsg);
        } else {
          checkAccess(message.org, contentMessage, function(r) {
            if(r) {
              switch(message.CStype) {
                case "version":
                    returnmsg = {CREXTreturn: message.CStype, CSID: message.CSID, data:{success: true, result: {version: chrome.runtime.getManifest().version}}};
                    setTimeout(function() {
                      chrome.tabs.sendMessage(sender.tab.id, returnmsg);
                    }, 150);
                break;
                case "TX":
                  if(keyPublic === message.data.target) {
                    returnmsg = {CREXTreturn: message.CStype, CSID: message.CSID, data:{success: false, message: "Target is equal to sender", id: message.data.id}};
                    sendMSG(sender.tab.id, returnmsg);
                  } else if(isNaN(message.data.fee)) {
                    returnmsg = {CREXTreturn: message.CStype, CSID: message.CSID, data:{success: false, message: "Invalid fee", id: message.data.id}};
                    sendMSG(sender.tab.id, returnmsg);
                  } else {
                    if(!Object.prototype.hasOwnProperty.call(message.data, "amount")) {
                      checkContract(message)
                      .then(
                        function(r) {
                          if(r !== true) {
                            contentMessage.data.smart.params = r;
                          }
                          PopupCenter("src/popup.html?t=tx", "extension_popup", "500", "636");
                            setTimeout(
                            function() {
                              var port = chrome.runtime.connect({name: "sendData"});
                              port.postMessage(contentMessage);
                            }, 1000);
                      })
                      .catch(function(r) {
                        returnmsg = {CREXTreturn: message.CStype, CSID: message.CSID, data:{success: false, message: r, id: message.data.id}};
                        sendMSG(sender.tab.id, returnmsg);
                      });
                    } else {
                      message.data.amount = String(message.data.amount).replace(',', '.');
                      if(isNaN(message.data.amount)) {
                        returnmsg = {CREXTreturn: message.CStype, CSID: message.CSID, data:{success: false, message: "Invalid amount", id: message.data.id}};
                        sendMSG(sender.tab.id, returnmsg);
                      } else {
                        checkContract(message)
                        .then(
                          function(r) {
                            if(r !== true) {
                              contentMessage.data.smart.params = r;
                            }
                            PopupCenter("src/popup.html?t=tx", "extension_popup", "500", "636");
                              setTimeout(
                              function() {
                                var port = chrome.runtime.connect({name: "sendData"});
                                port.postMessage(contentMessage);
                              }, 1000);
                        })
                        .catch(function(r) {
                          returnmsg = {CREXTreturn: message.CStype, CSID: message.CSID, data:{success: false, message: r, id: message.data.id}};
                          sendMSG(sender.tab.id, returnmsg);
                        });
                      }
                    }
                  }
                  break;
                  case "balanceGet":
                  let balanceKey;
                  try {
                    balanceKey = bs58.decode(message.data.key);
                  } catch(e) {
                    returnmsg = {CREXTreturn: "balanceGet", CSID: message.CSID, data:{success: false, id: message.data.id, message: "Invalid key"}};
                    sendMSG(sender.tab.id, returnmsg);
                  }

                  if(balanceKey !== undefined) {
                      nodeTest().then(function(r) {
                        connect().WalletBalanceGet(balanceKey, function(err, response) {
                          let balance = response;

                        if(balance.status.message == 'Success') {

                          let fraction = convert(balance.balance.fraction.buffer);
                          if (fraction == 0) {
                              fraction = 0;
                          }	else {
                            if(fraction.toString().length != 18) {
                              let mLeadingZeros = 18 - fraction.toString().length;
                              for(let i=0;i<mLeadingZeros;i++) {
                                fraction = "0" + fraction;
                              }
                            }
                              fraction = "0." + fraction;
                              fraction = (fraction * 1).toString().split(".")[1];
                          }

                          let totalBalance = balance.balance.integral + "." + fraction;
                          returnmsg = {CREXTreturn: "balanceGet", CSID: message.CSID, data:{success: true, id: message.data.id, result: {integral: balance.balance.integral, fraction: fraction, balance: totalBalance}}};
                          sendMSG(sender.tab.id, returnmsg);
                        } else {
                          returnmsg = {CREXTreturn: "balanceGet", CSID: message.CSID, data:{success: false, id: message.data.id, message: balance.status.message}};
                          sendMSG(sender.tab.id, returnmsg);
                        }
                      });
                    });
                  }
                  break;
                  case "getKey":
                    returnmsg = {CREXTreturn: "getKey", CSID: message.CSID, data:{success: true, id: message.data.id, result: {publicKey: keyPublic}}};
                      setTimeout(function() {
                        chrome.tabs.sendMessage(sender.tab.id, returnmsg);
                      }, 150);
                  break;
                  case "walletDataGet":
                  let walletdata;
                    if(message.data.key == '') {
                      returnmsg = {CREXTreturn: "walletDataGet", CSID: message.CSID, data:{success: false, id: message.data.id, message: "Not found"}};
                      sendMSG(sender.tab.id, returnmsg);
                    } else {
                      let walletDataKey;
                      try {
                        walletDataKey = bs58.decode(message.data.key);
                      } catch(e) {
                        returnmsg = {CREXTreturn: "walletDataGet", CSID: message.CSID, data:{success: false, id: message.data.id, message: "Invalid key"}};
                        sendMSG(sender.tab.id, returnmsg);
                      }
                      if(walletDataKey !== undefined) {
                        nodeTest().then(function(r) {
                  				connect().WalletDataGet(walletDataKey, function(err, response) {
                            walletdata = response;

                            let fraction = convert(walletdata.walletData.balance.fraction.buffer);
                            if (fraction == 0) {
                  			        fraction = 0;
                  					}	else {
                							if(fraction.toString().length != 18) {
                								let mLeadingZeros = 18 - fraction.toString().length;
                								for(let i=0;i<mLeadingZeros;i++) {
                									fraction = "0" + fraction;
                								}
                							}
                						    fraction = "0." + fraction;
                								fraction = (fraction * 1).toString().split(".")[1];
                  					}

                            let txid = convert(walletdata.walletData.lastTransactionId.buffer);
                            let totalBalance = walletdata.walletData.balance.integral + "." + fraction;

                            if(walletdata.status.message == 'Success') {
                              let walletdatat = {
                                  "balance": {"integral": walletdata.walletData.balance.integral, "fraction": fraction, "balance": totalBalance},
                                  "lastTransactionId": txid,
                                  "walletId": walletdata.walletData.walletId
                              };
                              returnmsg = {CREXTreturn: "walletDataGet", CSID: message.CSID, data:{success: true, id: message.data.id, result: walletdatat}};
                              sendMSG(sender.tab.id, returnmsg);
                            } else {
                              returnmsg = {CREXTreturn: "walletDataGet", CSID: message.CSID, data:{success: false, id: message.data.id, message: walletdata.status.message}};
                              sendMSG(sender.tab.id, returnmsg);
                            }
                          });
                        });
                      }
                    }
                  break;
                  case "contractState":
                  let messageState = {CStype: message.CStype, CSID: message.CSID, data: {target: message.data.target, smart: {method: message.data.method, params: message.data.params}}};
                  checkContract(messageState).then(function(r) {
                    if(r !== true) {
                      message.data.params = r;
                    }
                      contractState(message).then(function(contractStateValue) {
                        let retmsg = {CREXTreturn: "contractState", CSID: message.CSID, data:{success: true, result: contractStateValue, id: message.data.id}};
                        setTimeout(function() {
                          chrome.tabs.sendMessage(sender.tab.id, retmsg);
                        }, 150);
                      })
                      .catch(function(r) {
                        let retmsg = {CREXTreturn: "contractState", CSID: message.CSID, data:{success: false, id: message.data.id}};
                        setTimeout(function() {
                          chrome.tabs.sendMessage(sender.tab.id, retmsg);
                        }, 150);
                      });
                  }).catch(function(r) {
                    returnmsg = {CREXTreturn: message.CStype, CSID: message.CSID, data:{success: false, message: r, id: message.data.id}};
                    setTimeout(function() {
                      chrome.tabs.sendMessage(sender.tab.id, returnmsg);
                    }, 150);
                  });
                  break;
              }
            }
          });
        }
      }
    });

function sendMSG(tab, msg) {
  setTimeout(function() {
    chrome.tabs.sendMessage(tab, msg);
  }, 250);
}

function PopupCenter(url, title, w, h) {
    // Fixes dual-screen position                         Most browsers      Firefox
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var systemZoom = width / window.screen.availWidth;
    var left = (width - w) / 2 / systemZoom + dualScreenLeft
    var top = (height - h) / 2 / systemZoom + dualScreenTop
    var newWindow = window.open(url, title, 'status=no,scrollbars=no,resizable=no, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);

    // Puts focus on the newWindow
    if (window.focus) newWindow.focus();
}

    function checkAccess(url, contentmessage, callback) {
      let returnmsg;
      if(blocked.includes(url)) {
        returnmsg = {CREXTreturn: contentmessage.CStype, CSID: contentmessage.CSID, data:{success: false, message: "Access denied"}};
        sendMSG(contentmessage.id, returnmsg);
        callback(false);
      } else if(access.includes(url)) {
        callback(true);
      } else {
        PopupCenter("src/popup.html?t=tx", "extension_popup", "500", "636");
          setTimeout(
          function() {

            var port = chrome.runtime.connect({name: "sendData"});
          port.postMessage({CStype: "confirm", id: contentmessage.id, data: contentmessage});
            port.onMessage.addListener(function(msg) {
            });
          }, 1000);

          let promise1 = new Promise(function(resolve, reject) {
            chrome.runtime.onConnect.addListener(function(port) {
              port.onMessage.addListener(function(msg) {
                resolve(msg);
              });
            });
          });

          promise1.then(function(val) {
            if(val.CStype == 'confirm') {
              access.push(val.org);
              callback(true);
            } else if(val.CStype == 'confirmTX') {
              access.push(val.org);
              callback(false);
            } else if(val.CStype == 'blockPermanent') {
              blocked.push(val.org);
              callback(false);
            }
          });

      }
    }

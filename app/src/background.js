//var bip39 = require('bip39');
const bs58 = require('bs58');
const thrift = require('thrift');
const API = require('./gen-nodejs/API');
const selectNode = require('./lib/selectNode');
const nodeTest = require('./lib/nodeTest');
const convert = require('./lib/convert');

global.nodeIP;
global.nodePORT;
let keyPublic;
let keyPrivate;
let access;



window.onload = function(e) {

  chrome.storage.local.get(function(result) {
     global.nodeIP = result.ip;
     global.nodePORT = result.port;
     keyPublic = result.PublicKey;
     keyPrivate = result.PrivateKey;
     access = result.access;

     if(global.nodeIP === undefined) {
			 var sendDate = (new Date()).getTime();
			 selectNode()
			 .then(function(r) {
				 var receiveDate = (new Date()).getTime();
				 var responseTimeMs = receiveDate - sendDate;
				 console.log("background.js selected node: " + r);
				 console.log("Took " + responseTimeMs + "ms to select node");
				 global.nodeIP = r;
				 global.nodePORT = 8081;
			 });
		 }

   });

}


    chrome.runtime.onMessage.addListener( function(message, sender, callback) {

      console.log(message);

    // for the current tab, inject the "inject.js" file & execute it
        let returnmsg;

      if(message == 'Inject') {
        chrome.tabs.executeScript({
          file: 'src/inject.js'
        });
      } else if(message == 'Logout') {
        access = new Array();
        global.nodeIP = '';
        global.nodePORT = '';
        keyPublic = '';
        keyPrivate = '';
      } else if(message == 'Login') {
        chrome.storage.local.get(function(result) {
           global.nodeIP = result.ip;
           global.nodePORT = result.port;
           keyPublic = result.PublicKey;
           keyPrivate = result.PrivateKey;
           access = result.access;
           console.log(result);
         });
      } else if(message.CStype != null) {

        let contentMessage = {CStype: message.CStype, CSID: message.CSID, data: message.data, id: sender.tab.id, org: message.org};

        if(typeof keyPublic == 'undefined' || keyPublic == '') {
          returnmsg = {CREXTreturn: message.CStype, CSID: message.CSID, data:{success: false, message: "User not logged in"}};
          sendMSG(sender.tab.id, returnmsg);
        } else {

          if(checkAccess(message.org, contentMessage, function(r) {
            console.log(r);
            if(r) {

              let Client = Connect();

              switch(message.CStype) {
                case "TX":
                  if(keyPublic === message.data.target) {
                    returnmsg = {CREXTreturn: message.CStype, CSID: message.CSID, data:{success: false, message: "Target is equal to sender"}};
                    sendMSG(sender.tab.id, returnmsg);
                  } else {
                    //var popup = window.open("src/tx.html", "extension_popup", "width=500,height=600,status=no,scrollbars=no,resizable=no");
                    PopupCenter("src/tx2.html", "extension_popup", "500", "636");
                      setTimeout(
                      function() {
                        var port = chrome.runtime.connect({name: "sendData"});
                        port.postMessage(contentMessage);
                      }, 1000);
                  }
                  break;
                  case "balanceGet":
                  nodeTest().then(function(r) {
                    Connect().WalletBalanceGet(bs58.decode(message.data.key), function(err, response) {
                      let balance = response;

                    if(balance.status.message == 'Success') {

                      let fraction = convert(balance.balance.fraction.buffer);
                      if (fraction == 0) {
                          fraction = 0;
                      }	else {
                        if(fraction.toString().length != 18) {
                          mLeadingZeros = 18 - fraction.toString().length;
                          for(i=0;i<mLeadingZeros;i++) {
                            fraction = "0" + fraction;
                          }
                        }
                          fraction = "0." + fraction;
                          fraction = (fraction * 1).toString().split(".")[1];
                      }

                      totalBalance = balance.balance.integral + "." + fraction;
                      returnmsg = {CREXTreturn: "balanceGet", CSID: message.CSID, data:{success: true, id: message.data.id, result: {integral: balance.balance.integral, fraction: fraction, balance: totalBalance}}};
                      sendMSG(sender.tab.id, returnmsg);
                    } else {
                      returnmsg = {CREXTreturn: "balanceGet", CSID: message.CSID, data:{success: false, id: message.data.id, message: balance.status.message}};
                      sendMSG(sender.tab.id, returnmsg);
                    }
                  });
                });
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
                      nodeTest().then(function(r) {
                				Connect().WalletDataGet(bs58.decode(message.data.key), function(err, response) {
                          walletdata = response;

                          let fraction = convert(walletdata.walletData.balance.fraction.buffer);
                          if (fraction == 0) {
                			        fraction = 0;
                					}	else {
              							if(fraction.toString().length != 18) {
              								mLeadingZeros = 18 - fraction.toString().length;
              								for(i=0;i<mLeadingZeros;i++) {
              									fraction = "0" + fraction;
              								}
              							}
              						    fraction = "0." + fraction;
              								fraction = (fraction * 1).toString().split(".")[1];
                					}

                          let txid = convert(walletdata.walletData.lastTransactionId.buffer);
                          let totalBalance = walletdata.walletData.balance.integral + "." + fraction;

                          if(walletdata.status.message == 'Success') {
                            walletdatat = {
                                "balance": {"integral": walletdata.walletData.balance.integral, "fraction": fraction, "balance": totalBalance},
                                "lastTransactionId": txid,
                                "walletId": walletdata.walletData.walletId
                            };
                            returnmsg = {CREXTreturn: "walletDataGet", CSID: message.CSID, data:{success: true, id: message.data.id, result: walletdatat}};
                            sendMSG(sender.tab.id, returnmsg);
                            console.log(returnmsg);
                          } else {
                            returnmsg = {CREXTreturn: "walletDataGet", CSID: message.CSID, data:{success: false, id: message.data.id, message: walletdata.status.message}};
                            sendMSG(sender.tab.id, returnmsg);
                          }

                        });
                      });
                    }
                  break;


              }

            }
          }));
        }
      }

    });

function sendMSG(tab, msg) {
//  setTimeout(function() {
    chrome.tabs.sendMessage(tab, msg);
//  }, 800);
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

function Connect() {

let options = {
  transport: thrift.TBufferedTransport,
  protocol: thrift.TJSONProtocol,
  path: "/thrift/service/Api",
  https: false
};

  let connection = thrift.createHttpConnection(global.nodeIP, global.nodePORT, options);

  connection.on("error", function(err) {
    console.log(err);
  });

  let client = thrift.createHttpClient(API, connection);

  return client;

}

    function checkAccess(url, contentmessage = NULL, callback) {
      if(access.includes(url)) {
        callback(true);
      } else {
        PopupCenter("src/tx2.html", "extension_popup", "500", "636");
          setTimeout(
          function() {

            var port = chrome.runtime.connect({name: "sendData"});
          port.postMessage({CStype: "confirm", id: contentmessage.id, data: contentmessage});
          port.onMessage.addListener(function(msg) {
            console.log(msg);
          });

          }, 1000);

          let promise1 = new Promise(function(resolve, reject) {
            chrome.runtime.onConnect.addListener(function(port) {
              port.onMessage.addListener(function(msg) {
                console.log(msg);
                resolve(msg);
              });
            });
          });

          promise1.then(function(val) {
            console.log(val);
            if(val.CStype == 'confirm') {
              access.push(val.org);
              callback(true);
            } else if(val.CStype == 'confirmTX') {
              access.push(val.org);
              callback(false);
            }
          });

      }
    }

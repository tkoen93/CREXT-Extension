const connectrequest = require("../html/inject/connect");
const deploytx = require("../html/inject/deploy");
const executetx = require("../html/inject/execute");
const normaltx = require("../html/inject/normal");
const $ = require('jquery');
const connect = require('./connect');
const key = require('./key');
const CreateTransaction = require('./signature');

let n;
let receivedMessage;
let tabID;

CREXTdApp = {
  reject: function() {
  	returnmsg = {CREXTreturn: "TX", CSID: receivedMessage.CSID, data:{success: false, message: "Transaction rejected by user", id: receivedMessage.data.id}};
  	chrome.tabs.sendMessage(tabID, returnmsg);
  	window.close();
  },
  confirmnormal: async function() {
    let to = $('#to').text();
    let amount = $('#amount').text();
    let fee = $('#fee').text();

    $('#transactionfrom2').text(key.exportPublic());
    $('#transactionto2').text(to);
    $('#tosendto2').text(amount);
    $('#maxfeeto2').text(fee);

    $('#confirmTXinfo').slideUp(250);
    $("#confirmTXButtons").slideUp(250, function () {
      $('#confirmedTX').slideDown(250);
  });

      var Trans = await CreateTransaction({
            Amount: amount,
            Fee: fee,
            Source: key.exportPublic(n),
            PrivateKey: key.exportPrivate(n),
            Target: to,
        }).then(function(r) {
          console.log(r);
          if(r.error) {
            console.error(r.message);
          } else {
              connect().TransactionFlow(r.Result, function(err, r) {
                let res = r;
                console.log(r);
                if(r.status.code === 0) {
                  $('#closeButton').slideDown(250);
                  $('#txLoader').hide();
                  $('#completed').show();
                  let retmsg = {CREXTreturn: "TX", CSID: receivedMessage.CSID, data:{success: true, result:res, id: receivedMessage.data.id}};
                  chrome.tabs.sendMessage(tabID, retmsg);
                  console.log('tx send');
                } else {
                  $('#failButton').slideDown(250);
                  $('#txLoader').hide();
                  $('#failed').show();
                  let retmsg = {CREXTreturn: "TX", CSID: receivedMessage.CSID, data:{success: false, result:res}};
                  chrome.tabs.sendMessage(tabID, retmsg);
                  console.log('error');
                }
              });
          }
        });
  },
  confirmdeploy: async function() {
    $('#confirmTXinfo').slideUp(250);
    $("#confirmTXButtons").slideUp(250, function () {
      $('#confirmedTX').slideDown(250);
  });

      var Trans = await CreateTransaction({
            Fee: receivedMessage.data.fee,
            Source: key.exportPublic(n),
            PrivateKey: key.exportPrivate(n),
              SmartContract: {
                  Code: receivedMessage.data.smart.code
              }
        }).then(function(r) {
          console.log(r);
          if(r.error) {
            console.error(r.message);
          } else {
              connect().TransactionFlow(r.Result, function(err, r) {
                let res = r;
                console.log(r);
                if(r.status.code === 0) {
                  $('#closeButton').slideDown(250);
                  $('#txLoader').hide();
                  $('#completed').show();
                  let retmsg = {CREXTreturn: "TX", CSID: receivedMessage.CSID, data:{success: true, result:res, id: receivedMessage.data.id}};
                  chrome.tabs.sendMessage(tabID, retmsg);
                  console.log('tx send');
                } else {
                  $('#failButton').slideDown(250);
                  $('#txLoader').hide();
                  $('#failed').show();
                  let retmsg = {CREXTreturn: "TX", CSID: receivedMessage.CSID, data:{success: false, result:res}};
                  chrome.tabs.sendMessage(tabID, retmsg);
                  console.log('error');
                }
              });
          }
        });
  },
  confirmexecute: async function() {
    $('#confirmTXinfo').slideUp(250);
    $("#confirmTXButtons").slideUp(250, function () {
      $('#confirmedTX').slideDown(250);
  });

      var Trans = await CreateTransaction({
            Amount: receivedMessage.data.amount,
            Fee: receivedMessage.data.fee,
            Source: key.exportPublic(n),
            PrivateKey: key.exportPrivate(n),
            Target: receivedMessage.data.target,
              SmartContract: {
                  Method: receivedMessage.data.smart.method,
                  Params: receivedMessage.data.smart.params
              }
        }).then(function(r) {
          console.log(r);
          if(r.error) {
            console.error(r.message);
          } else {
              connect().TransactionFlow(r.Result, function(err, r) {
                let res = r;
                console.log(r);
                if(r.status.code === 0) {
                  $('#closeButton').slideDown(250);
                  $('#txLoader').hide();
                  $('#completed').show();
                  let retmsg = {CREXTreturn: "TX", CSID: receivedMessage.CSID, data:{success: true, result:res, id: receivedMessage.data.id}};
                  chrome.tabs.sendMessage(tabID, retmsg);
                  console.log('tx send');
                } else {
                  $('#failButton').slideDown(250);
                  $('#txLoader').hide();
                  $('#failed').show();
                  let retmsg = {CREXTreturn: "TX", CSID: receivedMessage.CSID, data:{success: false, result:res}};
                  chrome.tabs.sendMessage(tabID, retmsg);
                  console.log('error');
                }
              });
          }
        });
  },
  connect: function() {
    $("#connect").attr("disabled", true);

    chrome.storage.local.get(function(result) {
      access = result.access;
      access.push(receivedMessage.data.org);
      chrome.storage.local.set({
        'access': access
      });
    });

  //	if(typeof receivedMessage.data.amount === 'undefined') {
  if(!Object.prototype.hasOwnProperty.call(receivedMessage.data.data, "fee")) {
  		var port = chrome.runtime.connect({name: "returnAccess"});
  		port.postMessage({CStype: "confirm", org: receivedMessage.data.org});
  		setTimeout(function() {
  			window.close();
  		}, 250);
  	} else {

  		var port = chrome.runtime.connect({name: "returnAccess"});
  		port.postMessage({CStype: "confirmTX", org: receivedMessage.data.org});

  			dAppTX(receivedMessage.data);
  	}
  },
  cancel: function() {
    returnmsg = {CREXTreturn: receivedMessage.data.CStype, CSID: receivedMessage.data.CSID, data:{success: false, message: "Access denied", id: receivedMessage.data.data.id}};
  	chrome.tabs.sendMessage(tabID, returnmsg);
  	window.close();
  },
  closewindow: function() {
    window.close();
  }
}

async function content(page) {

  $("#ext").slideUp(250);
  $('#menu').hide();
  document.getElementById('container').innerHTML = "";

  switch(page) {
    case "connectrequest":
      console.log(receivedMessage);
      returnValue = await connectrequest();
      document.getElementById('container').insertAdjacentHTML('beforeend', returnValue);
      $("#siteAddress").html("<p>"+receivedMessage.data.org+"</p>");
			$('#connectButtons').slideDown(250);
			let imgUrl = receivedMessage.data.org + "/logo.png";
			imageExists(imgUrl, function(exists) {
				if(exists) {
					$('#logo').html("<img src=" + imgUrl + " width='70' height='70'>");
				} else {
					$('#logo').html("<p>No logo<br />available</p>");
				}
			});
      document.getElementById('cancel').addEventListener('click', CREXTdApp.cancel);
      document.getElementById('connect').addEventListener('click', CREXTdApp.connect);
    break;
    case "deploytx":
      returnValue = await deploytx();
      document.getElementById('container').insertAdjacentHTML('beforeend', returnValue);
      document.getElementById('reject').addEventListener('click', CREXTdApp.reject);
      document.getElementById('confirm').addEventListener('click', CREXTdApp.confirmdeploy);
    break;
    case "executetx":
    console.log(receivedMessage);
      returnValue = await executetx();
      document.getElementById('container').insertAdjacentHTML('beforeend', returnValue);
      document.getElementById('reject').addEventListener('click', CREXTdApp.reject);
      document.getElementById('confirm').addEventListener('click', CREXTdApp.confirmexecute);
    break;
    case "normaltx":
      returnValue = await normaltx();
      document.getElementById('container').insertAdjacentHTML('beforeend', returnValue);
      document.getElementById('reject').addEventListener('click', CREXTdApp.reject);
      document.getElementById('confirm').addEventListener('click', CREXTdApp.confirmnormal);
      document.getElementById('closewindow').addEventListener('click', CREXTdApp.closewindow);
      document.getElementById('failMainPage').addEventListener('click', CREXTdApp.closewindow);
      let amcs = Number(receivedMessage.data.amount).noExponents();
      let feecs = Number(receivedMessage.data.fee).noExponents();
      $('#from').text(key.exportPublic(n));
      $('#to').text(receivedMessage.data.target);
      $('#amount').text(amcs);
      $('#fee').text(feecs);
    break;
  }

    $("#ext").slideDown(250);

}

Number.prototype.noExponents= function(){
    var data= String(this).split(/[eE]/);
    if(data.length== 1) return data[0];

    var  z= '', sign= this<0? '-':'',
    str= data[0].replace('.', ''),
    mag= Number(data[1])+ 1;

    if(mag<0){
        z= sign + '0.';
        while(mag++) z += '0';
        return z + str.replace(/^\-/,'');
    }
    mag -= str.length;
    while(mag--) z += '0';
    return str + z;
}

function dAppTX(msg, n=0) {
  n=n;
		tabID = msg.id;

    receivedMessage = msg;

    if(msg.CStype == "confirm") {
      content("connectrequest");
    } else if (msg.CStype == "TX") {
      let typetx;
      if(!Object.prototype.hasOwnProperty.call(msg.data, "smart")) {
        content("normaltx");
      } else if((!Object.prototype.hasOwnProperty.call(msg.data.smart, "code")) && (Object.prototype.hasOwnProperty.call(msg.data.smart, "method"))) {
        content("executetx");
      } else if((Object.prototype.hasOwnProperty.call(msg.data.smart, "code")) && (!Object.prototype.hasOwnProperty.call(msg.data.smart, "method"))) {
        content("deploytx");
      } else {
        returnmsg = {CREXTreturn: receivedMessage.CStype, CSID: receivedMessage.CSID, data:{success: false, message: "CREXT does not recognize this request", id: receivedMessage.data.id}};
				chrome.tabs.sendMessage(tabID, returnmsg);
      }
    }
}

function imageExists(url, callback) {
  var img = new Image();
  img.onload = function() { callback(true); };
  img.onerror = function() { callback(false); };
  img.src = url;
}

window.onbeforeunload = WindowCloseHanlder;
function WindowCloseHanlder()
{
returnmsg = {CREXTreturn: receivedMessage.CStype, CSID: receivedMessage.CSID, data:{success: false, message: "Window closed by user", id: receivedMessage.data.id}};
chrome.tabs.sendMessage(tabID, returnmsg);
}

module.exports = dAppTX;

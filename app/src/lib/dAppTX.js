const connectrequest = require("../html/inject/connect");
const deploytx = require("../html/inject/deploy");
const executetx = require("../html/inject/execute");
const normaltx = require("../html/inject/normal");
const $ = require('jquery');
const connect = require('./connect');
const key = require('./key');
const CreateTransaction = require('./signature');
const bs58 = require('bs58');
const LS = require('./ls');

const store = new LS('CREXT');
const currentSelected = store.getState().s;

let n;
let receivedMessage;
let tabID;
let feecs;
let amcs;

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

    $('#transactionfrom2').text(key.exportPublic(currentSelected));
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
            Source: key.exportPublic(currentSelected),
            PrivateKey: key.exportPrivate(currentSelected),
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

    $('#transactionfrom2').text(key.exportPublic(currentSelected));
    $('#maxfeeto2').text($('#fee').text());

    $('#confirmTXinfo').slideUp(250);
    $("#confirmTXButtons").slideUp(250, function () {
      $('#confirmedTX').slideDown(250);
  });

      var Trans = await CreateTransaction({
            Fee: receivedMessage.data.fee,
            Source: key.exportPublic(currentSelected),
            PrivateKey: key.exportPrivate(currentSelected),
              SmartContract: {
                  Code: receivedMessage.data.smart.code
              }
        }).then(function(txres) {
          console.log(txres);
          if(txres.error) {
            console.error(txres.message);
          } else {
              connect().TransactionFlow(txres.Result, function(err, r) {
                let res = r;
                console.log(r);
                if(r.status.code === 0) {
                  //transactionto2
                  $('#transactionto2').text(bs58.encode(Buffer.from(txres.Result.target)));
                  $('#closeButton').slideDown(250);
                  $('#txLoader').hide();
                  $('#completed').show();
                  res.contractAddress = bs58.encode(Buffer.from(txres.Result.target));
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

    let to = $('#to').text();
    let amount = $('#amount').text();
    let fee = $('#fee').text();

    $('#transactionfrom2').text(key.exportPublic(currentSelected));
    $('#transactionto2').text(to);
    $('#tosendto2').text(amount);
    $('#maxfeeto2').text(fee);
    $('#method2').text(receivedMessage.data.smart.method);

    $('#confirmTXinfo').slideUp(250);
    $("#confirmTXButtons").slideUp(250, function () {
      $('#confirmedTX').slideDown(250);
  });

      var Trans = await CreateTransaction({
            Amount: receivedMessage.data.amount,
            Fee: receivedMessage.data.fee,
            Source: key.exportPublic(currentSelected),
            PrivateKey: key.exportPrivate(currentSelected),
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
  },
  block: function() {

    chrome.storage.local.get(function(result) {
      blocked = result.blocked;
      blocked.push(receivedMessage.data.org);
      chrome.storage.local.set({
        'blocked': blocked
      });
    });

    returnmsg = {CREXTreturn: receivedMessage.data.CStype, CSID: receivedMessage.data.CSID, data:{success: false, message: "Access denied", id: receivedMessage.data.data.id}};
  	chrome.tabs.sendMessage(tabID, returnmsg);
    var port = chrome.runtime.connect({name: "returnAccess"});
    port.postMessage({CStype: "blockPermanent", org: receivedMessage.data.org});
    setTimeout(function() {
      window.close();
    }, 250);
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
      document.getElementById('blockPermanent').addEventListener('click', CREXTdApp.block);
    break;
    case "deploytx":
      returnValue = await deploytx();
      document.getElementById('container').insertAdjacentHTML('beforeend', returnValue);
      document.getElementById('reject').addEventListener('click', CREXTdApp.reject);
      document.getElementById('confirm').addEventListener('click', CREXTdApp.confirmdeploy);
      document.getElementById('closewindow').addEventListener('click', CREXTdApp.closewindow);
      document.getElementById('failMainPage').addEventListener('click', CREXTdApp.closewindow);
      feecs = Number(receivedMessage.data.fee).noExponents();
      $('#from').text(key.exportPublic(currentSelected));
      $('#fee').text(feecs);
    break;
    case "executetx":
    console.log(receivedMessage);
      returnValue = await executetx();
      document.getElementById('container').insertAdjacentHTML('beforeend', returnValue);
      document.getElementById('reject').addEventListener('click', CREXTdApp.reject);
      document.getElementById('confirm').addEventListener('click', CREXTdApp.confirmexecute);
      document.getElementById('closewindow').addEventListener('click', CREXTdApp.closewindow);
      document.getElementById('failMainPage').addEventListener('click', CREXTdApp.closewindow);
      amcs = Number(receivedMessage.data.amount).noExponents();
      feecs = Number(receivedMessage.data.fee).noExponents();
      $('#from').text(key.exportPublic(currentSelected));
      $('#to').text(receivedMessage.data.target);
      $('#amount').text(amcs);
      $('#fee').text(feecs);
      $('#method').text(receivedMessage.data.smart.method);
    break;
    case "normaltx":
      returnValue = await normaltx();
      document.getElementById('container').insertAdjacentHTML('beforeend', returnValue);
      document.getElementById('reject').addEventListener('click', CREXTdApp.reject);
      document.getElementById('confirm').addEventListener('click', CREXTdApp.confirmnormal);
      document.getElementById('closewindow').addEventListener('click', CREXTdApp.closewindow);
      document.getElementById('failMainPage').addEventListener('click', CREXTdApp.closewindow);
      amcs = Number(receivedMessage.data.amount).noExponents();
      feecs = Number(receivedMessage.data.fee).noExponents();
      $('#from').text(key.exportPublic(currentSelected));
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

  console.log(msg);

  n=n;
		tabID = msg.id;

    receivedMessage = msg;

    if(msg.CStype == "confirm") {
      content("connectrequest");
    } else if (msg.CStype == "TX") {
      receivedMessage.data.fee = receivedMessage.data.fee.replace(/,/, '.');
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

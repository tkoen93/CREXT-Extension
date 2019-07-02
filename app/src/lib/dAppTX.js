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
const contractResult = require('./contractResult');

const store = new LS('CREXT');
const currentSelected = store.getState().s;

let p;
let n;
let receivedMessage;
let tabID;
let feecs;
let amcs;
let returnmsg;

let CREXTdApp = {
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

      await CreateTransaction({
            Amount: amount,
            Fee: fee,
            Target: to,
            UserData: receivedMessage.data.UserData
        }).then(function(r) {
          if(r.error) {
            console.error(r.message);
          } else {
              connect().TransactionFlow(r.Result, function(err, r) {
                let res = r;
                if(r.status.code === 0) {
                  $('#closeButton').slideDown(250);
                  $('#txLoader').hide();
                  $('#completed').show();
                  let retmsg = {CREXTreturn: "TX", CSID: receivedMessage.CSID, data:{success: true, result:res, id: receivedMessage.data.id}};
                  chrome.tabs.sendMessage(tabID, retmsg);
                } else {
                  $('#failButton').slideDown(250);
                  $('#txLoader').hide();
                  $('#failed').show();
                  let retmsg = {CREXTreturn: "TX", CSID: receivedMessage.CSID, data:{success: false, result:res}};
                  chrome.tabs.sendMessage(tabID, retmsg);
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

      await CreateTransaction({
            Fee: receivedMessage.data.fee,
            SmartContract: {
                  Code: receivedMessage.data.smart.code,
                  forgetNewState: true
              },
              UserData: receivedMessage.data.UserData
        }).then(function(txres) {
          if(txres.message !== null && txres.message !== undefined) {
            console.error(txres.message);
          } else {
              connect().TransactionFlow(txres.Result, function(err, r) {
                let res = r;
                if(r.status.code === 0) {
                  $('#transactionto2').text(bs58.encode(Buffer.from(txres.Result.target)));
                  $('#closeButton').slideDown(250);
                  $('#txLoader').hide();
                  $('#completed').show();
                  res.contractAddress = bs58.encode(Buffer.from(txres.Result.target));
                  let retmsg = {CREXTreturn: "TX", CSID: receivedMessage.CSID, data:{success: true, result:res, id: receivedMessage.data.id}};
                  chrome.tabs.sendMessage(tabID, retmsg);
                } else {
                  $('#failButton').slideDown(250);
                  $('#txLoader').hide();
                  $('#failed').show();
                  let retmsg = {CREXTreturn: "TX", CSID: receivedMessage.CSID, data:{success: false, result:res}};
                  chrome.tabs.sendMessage(tabID, retmsg);
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

      await CreateTransaction({
            Amount: receivedMessage.data.amount,
            Fee: receivedMessage.data.fee,
            Target: receivedMessage.data.target,
              SmartContract: {
                  Method: receivedMessage.data.smart.method,
                  Params: receivedMessage.data.smart.params,
                  NewState: false
              },
              UserData: receivedMessage.data.UserData
        }).then(function(r) {
          if(r.error) {
            console.error(r.message);
          } else {
              connect().TransactionFlow(r.Result, function(err, r) {
                let res = r;
                if(r.status.code === 0) {
                  $('#closeButton').slideDown(250);
                  $('#txLoader').hide();
                  $('#completed').show();
                  let retmsg = {CREXTreturn: "TX", CSID: receivedMessage.CSID, data:{success: true, result:{roundNum: res.roundNum, smart_contract_result: contractResult(res), status:{code: res.status.code, message: res.status.message}}, id: receivedMessage.data.id}};
                  chrome.tabs.sendMessage(tabID, retmsg);
                } else {
                  $('#failButton').slideDown(250);
                  $('#txLoader').hide();
                  $('#failed').show();
                  let retmsg = {CREXTreturn: "TX", CSID: receivedMessage.CSID, data:{success: false, result:res}};
                  chrome.tabs.sendMessage(tabID, retmsg);
                }
              });
          }
        });
  },
  connect: function() {
    $("#connect").attr("disabled", true);

    chrome.storage.local.get(function(result) {
      let access = result.access;
      access.push(receivedMessage.org);
      chrome.storage.local.set({
        'access': access
      });
    });

  let port;
  if(!Object.prototype.hasOwnProperty.call(receivedMessage.data, "fee")) {
  		port = chrome.runtime.connect({name: "returnAccess"});
  		port.postMessage({CStype: "confirm", org: receivedMessage.org});
  		setTimeout(function() {
  			window.close();
  		}, 250);
  	} else {

  		port = chrome.runtime.connect({name: "returnAccess"});
  		port.postMessage({CStype: "confirmTX", org: receivedMessage.org});

  			dAppTX(receivedMessage);
  	}
  },
  cancel: function() {
    returnmsg = {CREXTreturn: receivedMessage.CStype, CSID: receivedMessage.CSID, data:{success: false, message: "Access denied", id: receivedMessage.data.id}};
  	chrome.tabs.sendMessage(tabID, returnmsg);
  	window.close();
  },
  closewindow: function() {
    window.close();
  },
  block: function() {

    chrome.storage.local.get(function(result) {
      let blocked = result.blocked;
      blocked.push(receivedMessage.org);
      chrome.storage.local.set({
        'blocked': blocked
      });
    });

    returnmsg = {CREXTreturn: receivedMessage.CStype, CSID: receivedMessage.CSID, data:{success: false, message: "Access denied", id: receivedMessage.data.id}};
  	chrome.tabs.sendMessage(tabID, returnmsg);
    var port = chrome.runtime.connect({name: "returnAccess"});
    port.postMessage({CStype: "blockPermanent", org: receivedMessage.org});
    setTimeout(function() {
      window.close();
    }, 250);
  }
}

async function content(page) {

  $("#ext").slideUp(250);
  $('#menu').hide();
  document.getElementById('container').innerHTML = "";

  let returnValue;

  switch(page) {
    case "connectrequest":
      returnValue = await connectrequest();
      document.getElementById('container').insertAdjacentHTML('beforeend', returnValue);
      $("#siteAddress").html("<p>"+receivedMessage.org+"</p>");
			$('#connectButtons').slideDown(250);
			let imgUrl = receivedMessage.org + "/logo.png";
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
      p = store.getState().p;
      if(p !== undefined) {
        $('#showPhising').text(p);
      }
    break;
    case "executetx":
      returnValue = await executetx();
      document.getElementById('container').insertAdjacentHTML('beforeend', returnValue);
      document.getElementById('reject').addEventListener('click', CREXTdApp.reject);
      document.getElementById('confirm').addEventListener('click', CREXTdApp.confirmexecute);
      document.getElementById('closewindow').addEventListener('click', CREXTdApp.closewindow);
      document.getElementById('failMainPage').addEventListener('click', CREXTdApp.closewindow);
      if(!receivedMessage.data.amount) {
        receivedMessage.data.amount = 0;
      }
      amcs = Number(receivedMessage.data.amount).noExponents();
      feecs = Number(receivedMessage.data.fee).noExponents();
      $('#from').text(key.exportPublic(currentSelected));
      $('#to').text(receivedMessage.data.target);
      $('#amount').text(amcs);
      $('#fee').text(feecs);
      $('#method').text(receivedMessage.data.smart.method);
      p = store.getState().p;
      if(p !== undefined) {
        $('#showPhising').text(p);
      }
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
      p = store.getState().p;
      if(p !== undefined) {
        $('#showPhising').text(p);
      }
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

		tabID = msg.id;
    receivedMessage = msg;

    if(msg.CStype == "confirm") {
      content("connectrequest");
      receivedMessage = msg.data;
    } else if (msg.CStype == "TX") {
      receivedMessage.data.fee = receivedMessage.data.fee.replace(/,/, '.');
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

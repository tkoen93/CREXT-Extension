const $ = require('jquery');
const thrift = require('thrift');
const API = require('./gen-nodejs/API');
const APIT = require('./gen-nodejs/api_types');
const GENT = require('./gen-nodejs/general_types');
const bs58 = require('bs58');
const convert = require('./lib/convert');
const ConstructTransaction = require('./lib/signature');
const selectNode = require('./lib/selectNode');
const nodeTest = require('./lib/nodeTest');

global.nodeIP;
global.nodePORT;
let keyPublic;
let keyPrivate;
let access;
let tabID;
let receivedMessage;

$(document).ready(function(){

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

});

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

chrome.runtime.onConnect.addListener(function(port) {
	console.log(port);
  console.assert(port.name == "sendData");
  port.onMessage.addListener(function(msg) {
    console.log(msg);
		tabID = msg.id;
    if (msg.CStype == "TX") {
			let amcs = Number(msg.data.amount).noExponents();
			let feecs = Number(msg.data.fee).noExponents();
			receivedMessage = msg;

			if(keyPublic === msg.data.target) {
				returnmsg = {CREXTreturn: receivedMessage.CStype, CSID: receivedMessage.CSID, data:{success: false, message: "Target is equal to sender", id: receivedMessage.data.id}};
				chrome.tabs.sendMessage(tabID, returnmsg);

				setTimeout(function() {
					window.close();
				}, 500);

			} else {
				$('#from').text(keyPublic);
				$('#to').text(msg.data.target);
				$('#amount').text(amcs);
				$('#fee').text(feecs);
				$('#confirmLoader').hide();
				$('#logoSmall').hide();
				$('#confirmTX').slideDown(250);
				$('#confirmTXButtons').slideDown(250);
			}

		} else if(msg.CStype == "confirm") {
			receivedMessage = msg.data;
			$("#siteAddress").html("<p>"+msg.data.org+"</p>");
			$('#confirmLoader').hide();
			$('#confirmAccess').slideDown(250);
			$('#connectButtons').slideDown(250);

			let imgUrl = msg.data.org + "/logo.png";
			imageExists(imgUrl, function(exists) {
				if(exists) {
					$('#logo').html("<img src=" + imgUrl + " width='70' height='70'>");
				} else {
					$('#logo').html("<p>No logo<br />available</p>");
				}
			});

		}
  });
});

function imageExists(url, callback) {
  var img = new Image();
  img.onload = function() { callback(true); };
  img.onerror = function() { callback(false); };
  img.src = url;
}

$(document).on('click', '#connect', function(event){

	console.log('clickconnect');

	$("#connect").attr("disabled", true);

	access.push(receivedMessage.org);

	chrome.storage.local.set({
		'access': access
	});

	console.log(receivedMessage);

//	if(typeof receivedMessage.data.amount === 'undefined') {
if(!Object.prototype.hasOwnProperty.call(receivedMessage.data, "amount")) {
		var port = chrome.runtime.connect({name: "returnAccess"});
		port.postMessage({CStype: "confirm", org: receivedMessage.org});
		setTimeout(function() {
			window.close();
		}, 250);
	} else {

		var port = chrome.runtime.connect({name: "returnAccess"});
		port.postMessage({CStype: "confirmTX", org: receivedMessage.org});

		let amcs = Number(receivedMessage.data.amount).noExponents();
		let feecs = Number(receivedMessage.data.fee).noExponents();

			$('#confirmAccess').slideUp(250);
			$('#connectButtons').slideUp(250);
			$('#from').text(keyPublic);
			$('#to').text(receivedMessage.data.target);
			$('#amount').text(amcs);
			$('#fee').text(feecs);
			$('#confirmLoader').hide();
			$('#logoSmall').slideUp(250);
			$('#confirmTX').slideDown(250);
			$('#confirmTXButtons').slideDown(250);
	}

});

$(document).on('click', '#cancel', function(event){
	returnmsg = {CREXTreturn: receivedMessage.CStype, CSID: receivedMessage.CSID, data:{success: false, message: "Access denied", id: receivedMessage.data.id}};
	chrome.tabs.sendMessage(tabID, returnmsg);
	window.close();
});

$(document).on('click', '#reject', function(event){
	console.log(tabID);
	returnmsg = {CREXTreturn: "TX", CSID: receivedMessage.CSID, data:{success: false, message: "Transaction rejected by user", id: receivedMessage.data.id}};
	chrome.tabs.sendMessage(tabID, returnmsg, function(response) {
    console.log(response);
  });
	window.close();
});

$(document).on('click', '#confirm', async function(event){

	let from = $('#from').text();
	let to = $('#to').text();
	let amount = $('#amount').text();
	let fee = $('#fee').text();

	$('#transactionfrom2').text(from);
	$('#transactionto2').text(to);
	$('#tosendto2').text(amount);
	$('#maxfeeto2').text(fee);

	$('#confirmTXinfo').slideUp(250);
	$("#confirmTXButtons").slideUp(250, function () {
		$('#confirmedTX').slideDown(250);
		$('#closeButton').slideDown(250);
		$('#completed').slideDown(1000);
});

		var Trans = await ConstructTransaction(Connect(), {
  				amount: amount,
  				currency: 1,
  				fee: fee,
  				source: keyPublic,
  				Priv: keyPrivate,
  				target: to,
  		})
      .then(function(r) {
        console.log(r);
        if(r.error) {
          console.error(r.message);
        } else {
					nodeTest().then(function(nr) {
	          Connect().TransactionFlow(r, function(err, r) {
							let res = r;
							console.log(r);
							if ("Success" === res.status.message.split(" ")[0]) {

								let retmsg = {CREXTreturn: "TX", CSID: receivedMessage.CSID, data:{success: true, result:res, id: receivedMessage.data.id}};

							chrome.tabs.sendMessage(tabID, retmsg, function(response) {
						    console.log(response);
						  });

								console.log('tx send');
							} else {
								let retmsg = {CREXTreturn: "TX", data:{success: false, result:res}};

							chrome.tabs.sendMessage(tabID, retmsg, function(response) {
						    console.log(response);
						  });
								console.log('error');
							}
	          });
					});
        }
      });



/*	SignCS.Connect().TransactionFlow(Trans, function (res) {
		console.log(res);
	if ("Success" === res.status.message.split(" ")[0]) {
    $('#confirmLoader').text("Transaction succesfully sent to the node");

		let retmsg = {CREXTreturn: "TX", CSID: receivedMessage.CSID, data:{success: true, result:res, id: receivedMessage.data.id}};

	chrome.tabs.sendMessage(tabID, retmsg, function(response) {
    console.log(response);
  });

		console.log('tx send');
	} else {
		let retmsg = {CREXTreturn: "TX", data:{success: false, result:res}};

	chrome.tabs.sendMessage(tabID, retmsg, function(response) {
    console.log(response);
  });
		console.log('error');
	}
});*/

});

$(document).on('click', '#closewindow', function(event){
	window.close();
});


window.onbeforeunload = WindowCloseHanlder;
function WindowCloseHanlder()
{
returnmsg = {CREXTreturn: receivedMessage.CStype, CSID: receivedMessage.CSID, data:{success: false, message: "Window closed by user", id: receivedMessage.data.id}};
chrome.tabs.sendMessage(tabID, returnmsg);
}

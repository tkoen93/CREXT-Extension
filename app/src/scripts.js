const $ = require('jquery');
const API = require('./gen-nodejs/API');
const APIT = require('./gen-nodejs/api_types');
const GENT = require('./gen-nodejs/general_types');
const bs58 = require('bs58');
const convert = require('./lib/convert');
const ConstructTransaction = require('./lib/signature');
const thrift = require('thrift');
const tippy = require('tippy.js');
const txPages = require('./lib/txpage');
const selectNode = require('./lib/selectNode');
const nodeTest = require('./lib/nodeTest');
const menu = require('./lib/menu');
const libhtml = require('./lib/html');
const html = libhtml.content;
const CREXT = libhtml.CREXT;

global.nodeIP;
global.nodePORT;
let keyPublic;
let keyPrivate;
let access;
let keySize = 256;
let ivSize = 128;
let iterations = 100;
let monitorUrl = 'https://monitor.credits.com/testnet-r4_2/';

document.addEventListener("DOMContentLoaded", function(){


	chrome.storage.local.get(function(result) {

		 global.nodeIP = undefined;
		 //global.nodeIP = "1.1.1.1";
		 global.nodePORT = result.port;
		 keyPublic = result.PublicKey;
		 keyPrivate = result.PrivateKey;
		 access = result.Access;

		 //ls.set('version', 1);
  /*   ls.set('port', result.port);
     ls.set('pub', result.PublicKey);
     ls.set('pri', result.PrivateKey);
     ls.set('access', result.access);*/

		 if(global.nodeIP === undefined) {
			 var sendDate = (new Date()).getTime();
			 selectNode()
			 .then(function(r) {
				 var receiveDate = (new Date()).getTime();
				 var responseTimeMs = receiveDate - sendDate;
				 console.log("scripts.js selected node: " + r);
				 console.log("Took " + responseTimeMs + "ms to select node");
				 global.nodeIP = r;
				 global.nodePORT = 8081;
			 });
		 }

	 });

				var open = $('.open-nav'),
        close = $('.close'),
				closeItem = $('.closeItem'),
        overlay = $('.overlay');

    open.click(function() {
        overlay.show();
        $('#wrapper').addClass('toggled');
    });

    close.click(function() {
        overlay.hide();
        $('#wrapper').removeClass('toggled');
    });

		closeItem.click(function() {
        overlay.hide();
        $('#wrapper').removeClass('toggled');
    });

		overlay.click(function() {
			overlay.hide();
			$('#wrapper').removeClass('toggled');
		})


});


$(document).on('click', '#getstarted', function(event){
	$('#firstpanel').fadeOut(250);
	$("#firstpanel").fadeOut(250, function () {
		$('#secondpanel').fadeIn(250);
});
});

/*function createVault() {
	alert($("#pass1").val());
}*/

$(document).on('click', '#logout', function(event){
	chrome.storage.local.clear(function() {
	    var error = chrome.runtime.lastError;
	    if (error) {
	        console.error(error);
	    }
		});

chrome.runtime.sendMessage('Logout');

		document.getElementById("puk").value = '';
		document.getElementById("prk").value = '';

		$('#openwallet').slideUp(250);
		$('#newwallet').slideUp(250);;
		$('#extensionindex').slideUp(250);
		$('#txhis').slideUp(250);
		$('#logout').slideUp(250);
		$('#selecttoken').slideUp(250);
		$('#extensionlogin').slideDown(250);
		$('#menu').slideUp(250);
		$('#logoSmall').slideUp(250);
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


  /*$(document).on('click', '#createTX', function(event){

  	$('input[type="text"]').css({"border" : "", "box-shadow" : ""});
  	$('#tokeyError').hide();
		$('#tosendError').hide();
		$('#maxfeeError').hide();

  	let regexp = /^\d+(\.\d{1,18})?$/;
  	cont = true;

  	to = $('#tokey').val();
  	amount = $('#tosend').val();
  	amount = amount.replace(/,/, '.');
  	maxfee = $('#maxfee').val();
  	maxfee = maxfee.replace(/,/, '.');

  	if(amount.charAt(0) == '.') {
  		amount = "0" + amount;
  	}

		if(maxfee.charAt(0) == '.') {
  		maxfee = "0" + maxfee;
  	}

  	if(to == keyPublic) {
      $('#tokey').css("border","2px solid red");
      $('#tokey').css("box-shadow","0 0 3px red");
		$('#tippytoKey').attr("data-tippy-content", "<p style=\"font-size:12px;\">You can't send a transaction to yourself</p>");
		$('#tokeyError').show();
  		cont = false;
  	}

  	if(to == '' || to.length < 43 || to.length > 45) {
  		$('#tokey').css("border","2px solid red");
      $('#tokey').css("box-shadow","0 0 3px red");
		$('#tippytoKey').attr("data-tippy-content", "<p style=\"font-size:12px;\">Please enter a valid public key</p>");
		$('#tokeyError').show();
  		cont = false;
  	}

  	if(amount == '') {
  		$('#tosend').css("border","2px solid red");
      $('#tosend').css("box-shadow","0 0 3px red");
		$('#tippytoSend').attr("data-tippy-content", "<p style=\"font-size:12px;\">Please enter an amount</p>");
		$('#tosendError').show();
  		cont = false;
  	} else {
  			if(regexp.test(amount) != true) {
  				$('#tosend').css("border","2px solid red");
  		    $('#tosend').css("box-shadow","0 0 3px red");
					$('#tippytoSend').attr("data-tippy-content", "<p style=\"font-size:12px;\">Please enter a valid amount</p>");
					$('#tosendError').show();
  				cont = false;
  			}
  		}

  	if(maxfee == '') {
			$('#maxfee').css("border","2px solid red");
      $('#maxfee').css("box-shadow","0 0 3px red");
			$('#tippymaxfee').attr("data-tippy-content", "<p style=\"font-size:12px;\">Please enter an amount</p>");
			$('#maxfeeError').show();
  		cont = false;
  	} else {
  			if(regexp.test(maxfee) != true) {
  				$('#maxfee').css("border","2px solid red");
  		    $('#maxfee').css("box-shadow","0 0 3px red");
					$('#tippymaxfee').attr("data-tippy-content", "<p style=\"font-size:12px;\">Please enter a valid amount</p>");
					$('#maxfeeError').show();
  				cont = false;
  			}
  		}

  	if(!cont) { // Show error if one of the checks failed.
	tippy('.txerrortippy', {
		interactive: true,
		arrow: true,
		arrowType: 'round',
	});
    }


  	if(cont) {
  	//	$('#initialTX').hide();
  	//	$('#confirmTX').show();
  	if(amount.length > 8) {
  		$('.confirmsize').css("font-size","18px");
  	} else {
  		$('.confirmsize').css("font-size","24px");
  	}
		$('#tokeyError').hide();
  		$('#transactionto').text(to);
  		$('#tosendto').text(amount);
  		$('#tosend').text(amount);
  		$('#maxfeeto').text(maxfee);
  		$('#transactionto2').text(to);
  		$('#tosendto2').text(amount);
  		$('#maxfeeto2').text(maxfee);
  		$('#initialTX').slideUp(250);
  		$("#createTX").slideUp(250, function () {
  			$("#confirmTX").slideDown(250);
  			$("#confirmTXinfo").slideDown(250);
  			$("#confirmButtons").slideDown(250);
  	});
  	}

  });*/

	$(document).on('click', '#exportkeyfile', function(event){

		let str = {
					key: {
						public: keyPublic,
						private: keyPrivate
					}
		};

		fileName = 'RawWalletCS ' + new Date() + '.json';
		DownloadFile(fileName, JSON.stringify(str));

	});

	function DownloadFile(filename, text) { // Download keyfile upon generating a new keypair.
	  let element = document.createElement('a');
	  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	  element.setAttribute('download', filename);

	  element.style.display = 'none';
	  document.body.appendChild(element);

	  element.click();
	  document.body.removeChild(element);
	}

/* TX HISTORY */
$(document).on('click', '#txhistory', function(event){
	$('input[type="text"]').css({"border" : "", "box-shadow" : ""});
	$('#extensionindex').slideUp(250);
	$('#tentx').slideUp(250);
	$('#selecttoken').slideUp(250);
	$('#txhis').slideDown(250);
	//$('#txLoader').html('<img src="../img/loader.svg">');
	$('#showtx').empty();
	$('#tentx').slideDown(250);

	getTransactions(keyPublic, 0, 7);
});

function getTransactions(key, start, amount) {
	$('#showtx').fadeOut(250);
	$('#showtx').empty();
	$('#txPaging').fadeOut(250);
	$('#txPaging').empty();
	$('#txLoader').html('<img src="../img/loader.svg">');
		nodeTest().then(function(r) {
			Connect().TransactionsGet(bs58.decode(key), start, amount, function (err, r) {

				let total_tx = 99;

				console.log(r);

				$('#txLoader').empty();

				for(let index in r.transactions) {
					let from = bs58.encode(Buffer.from(r.transactions[index].trxn.source));
					let to = bs58.encode(Buffer.from(r.transactions[index].trxn.target));
					let poolHash = Buffer.from(r.transactions[index].id.poolHash).toString('hex');

					let fraction = convert(r.transactions[index].trxn.amount.fraction.buffer);

					if (fraction == 0) {
							fraction = '00';
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

					let amount = r.transactions[index].trxn.amount.integral + "." + fraction.toString().substring(0,2);
					let fullAmount = r.transactions[index].trxn.amount.integral + "." + fraction + " CS";

					let url = monitorUrl + 'transaction/' + poolHash + '.' + (r.transactions[index].id.index + 1);

					if(key == from) {
						account = to.substring(0, 16);
						$('#showtx').append("<tr class='txhisrow'><td width='30'>&nbsp;</td><td width='120'><img src=\"/img/sent.png\"/><p class=\"txSent\">Sent</p></td><td width='160' class='flex' id=\"copyTX\" data-content='" + to + "'><a href='#'><p class=\"txHisr\" id=\"tippy\" data-tippy-content='<p style=\"font-size:12px;\">" + to + "</p>'>" + account + " ...</p></a></td><td width='85'><p class=\"txHisr\" id=\"tippy\" data-tippy-content='<p style=\"font-size:12px;\">" + fullAmount + "</p>'>" + amount + " CS</p></td><td data-toggle='popover' data-content='View on monitor' data-placement='left'><a href=\"" + url + "\" target=\"_blank\"><i class=\"fas fa-external-link-alt\" style=\"color:#5cacf6;\"></i></a></td></tr>");
					} else if(key == to){
						account = from.substring(0, 16);
						$('#showtx').append("<tr class='txhisrow'><td width='30'>&nbsp;</td><td width='120'><img src=\"/img/received.png\"/><p class=\"txReceived\">Received</p></td><td width='160' class='flex' id=\"copyTX\" data-content='" + from + "'><a href='#'><p class=\"txHisr\" id=\"tippy\" data-tippy-content='<p style=\"font-size:12px;\">" + from + "</p>'>" + account + " ...</p></a></td><td width='85'><p class=\"txHisr\" id=\"tippy\" data-tippy-content='<p style=\"font-size:12px;\">" + fullAmount + "</p>'>" + amount + " CS</p></td><td data-toggle='popover' data-content='View on monitor' data-placement='left'><a href=\"" + url + "\" target=\"_blank\"><i class=\"fas fa-external-link-alt\" style=\"color:#5cacf6;\"></i></a></td></tr>");
					}

				}

				let pageNumber = (start / 7)+1;
				let pageNumberSelect;

				let maxPages = Math.ceil((total_tx / 7));

				if(pageNumber < 3) {
					pageNumberSelect = 3;
				} else if(pageNumber > (maxPages-2)){
					pageNumberSelect = maxPages-2;
				} else {
					pageNumberSelect = pageNumber;
				}

				txPages(pageNumber, pageNumberSelect, maxPages);


				$('#showtx').fadeIn(250);
				$('#txPaging').fadeIn(250);

				tippy('#tippy', {
					interactive: true,
					arrow: true,
					arrowType: 'round',
				});


			});
		});

}

$(document).on('click', '#copyTX', function(event){
		let copyKey = $(this).attr("data-content");
		let $temp = $("<input>");
	  $("body").append($temp);
	  $temp.val($(this).attr("data-content")).select();
	  document.execCommand("copy");
	  $temp.remove();

		$('#copyAddressSpan').html("Address copied to clipboard");
		showCopyAlert();
});

function showCopyAlert() { // Show result for a few seconds before message disappears.
        $("#copyAddress").fadeTo(3500, 600).slideUp(400, function () {
          $("#copyAddress").slideUp(600);
      });
}

$(document).on('click', '#selectPage', function(event) {
	let selectedPage = $(this).attr("page");
	let start = (selectedPage-1) * 7;
	getTransactions(keyPublic, start, 7);
});

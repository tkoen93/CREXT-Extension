const main = require("../html/main");
const mnemonicpass = require("../html/mnemonicpass");
const mnemonicphrase = require("../html/mnemonicphrase");
const mnemonicverify = require("../html/mnemonicverify");
const importwallet = require("../html/importwallet");
const addWallet = require("../html/addwallet");
const index = require("../html/index");
const unlock = require("../html/unlock");
const txhistory = require('../html/txhistory');
const inject = require('../html/inject');
const settings = require('../html/settings');
const $ = require('jquery');
const menu = require('./menu');
const check_field = require('./check_field');
const check_import = require('./check_import');
const SecureLS = require('secure-ls');
const sha512 = require('js-sha512').sha512;
const CW = require('./CW');
const nacl = require('tweetnacl');
const bs58 = require('bs58');
const download = require('./download');
const walletBalance = require('./walletBalance');
const key = require('./key');
const copy = require('./copy');
const tx = require('./tx');
const getTransactions = require('./getTransactions');
const dAppTX = require('./dAppTX');
const selectNode = require('./selectNode');
const sw = require('./selectWallet');
const LS = require('./ls');

const store = new LS('CREXT');
let currentSelected = store.getState().s;

let ls;
let p;
global.keyPublic;
let verifyArray = new Array();
let seed;
let msgInject = undefined;
let t = undefined;

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "sendData");
  port.onMessage.addListener(function(msg) {
		msgInject = msg;
	});
});

function checkAndContinue(data) {
    if(data === undefined) {
        setTimeout(checkAndContinue, 500, msgInject);
    } else {
      dAppTX(data);
    }
}

CREXT = {
		start: function() {
			menu();
			document.getElementById('openaccount').addEventListener('click', CREXT.openaccount);
			document.getElementById('txhistory').addEventListener('click', CREXT.txhistory);
      document.getElementById('settings').addEventListener('click', CREXT.settings);

			let url_string = window.location.href;
			let url = new URL(url_string);
			t = url.searchParams.get("t");

			chrome.storage.local.get(function(result) {
				loginTime = result.loginTime;
				timeNow = new Date().getTime();
				global.keyPublic = result.PublicKey;

				if(((timeNow-loginTime > 1800000) || result.encryption == '') && global.keyPublic != '') {
					chrome.storage.local.set({
						'encryption': ''
					});
					content("unlock");
				} else {
					chrome.storage.local.set({
						'loginTime': new Date().getTime()
					});

					ls = new SecureLS({encodingType: 'aes', encryptionSecret: result.encryption});

						if(ls.getAllKeys().length === 0) {
							chrome.storage.local.clear();
							content("main");
							selectNode();
						}	else if(t === null) {
							chrome.storage.local.get(function(result) {
							global.keyPublic = result.PublicKey;
					    if(result.encryption != undefined) {
					        let pr = ls.get('initiate');

									 if(pr === 1) {
										 content("mnemonicphrase");
									 } else if(pr === 2) {
										 content('index');
									 } else {
										 content('main');
									 }

					    } else {
								content('main');
							}
					   });
					 } else { // if t contains data
						 content("inject");
             checkAndContinue(msgInject);
					 }
				}
			})
		},
    importwallet: function() {
      content("importwallet");
    },
    createwallet: function() {
      content("mnemonicpass");
    },
    openaccount: function() {
      content('index');
    },
    txhistory: function() {
      content("txhistory");
    },
    createvault: function() {
			let pass1 = $('#pass1').val();
			let pass2 = $('#pass2').val();
      let encryption = sha512(pass1);
			if(pass1.length < 8) {
				$('#pass1error').text('Password not long enough');
			} else if(pass1 != pass2) {
				$('#pass2error').text('Password don\'t match');
			} else {
	      chrome.storage.local.set({
	    		'encryption': encryption,
	        'loginTime': new Date().getTime(),
					'access': new Array(),
          'blocked': new Array()
	    	});
	       ls = new SecureLS({encodingType: 'aes', encryptionSecret: encryption});
	      //alert($("#pass1").val());
	      ls.set('version', {v: 1, n: 1});
				ls.set('initiate', 1);
	      content("mnemonicphrase");
	    }
		},
		importvault: function() {
			$('#seederror').empty();
			let p = $('#seedphrase').val();
			let pass1 = $('#pass1').val();
			let pass2 = $('#pass2').val();
      let encryption = sha512(pass1);
			if(pass1.length < 8) {
				$('#pass1error').text('Password not long enough');
			} else if(pass1 != pass2) {
				$('#pass2error').text('Password don\'t match');
			} else if(p.trim().split(/\s+/g).length !== 12){
				$('#seederror').text('Phrase does not exist');
			} else if(CW.validateMnemonic(p) === false) { //Mnemonic not generated through CREXT. Ask user to proceed
				$('#hideImportButton').slideUp(250);
				$('#showImportButtons').slideDown(250);
				$('#seederror').text('This phrase was not generated by CREXT. Are you sure you want to continue?');
			} else {
				var bseed = CW.fromMnemonic(p);
				global.keyPublic = bs58.encode(bseed.getKeypair(0)._publicKey);
	      chrome.storage.local.set({
	    		'encryption': encryption,
	        'loginTime': new Date().getTime(),
					'access': new Array(),
          'blocked': new Array(),
					'PublicKey': global.keyPublic
	    	});
       	ls = new SecureLS({encodingType: 'aes', encryptionSecret: encryption});
				ls.removeAll();
	      ls.set('version', 1);
				ls.set('initiate', 2);
        bseed.custom = new Array();
				ls.set('seed', bseed);
				chrome.runtime.sendMessage('Login');
				content("index");
			}
		},
		continueImport: function () {
			$('#seederror').empty();
			let p = $('#seedphrase').val();
			let pass1 = $('#pass1').val();
			let pass2 = $('#pass2').val();
      let encryption = sha512(pass1);
			if(pass1.length < 8) {
				$('#pass1error').text('Password not long enough');
			} else if(pass1 != pass2) {
				$('#pass2error').text('Password don\'t match');
			} else if(p.trim().split(/\s+/g).length !== 12){
				$('#seederror').text('Phrase does not exist');
			} else {
				var bseed = CW.fromMnemonic(p);
				global.keyPublic = bs58.encode(wallet.getKeypair(0)._publicKey);
	      chrome.storage.local.set({
	    		'encryption': encryption,
	        'loginTime': new Date().getTime(),
					'access': new Array(),
          'blocked': new Array(),
					'PublicKey': global.keyPublic
	    	});
       	ls = new SecureLS({encodingType: 'aes', encryptionSecret: encryption});
				ls.removeAll();
	      ls.set('version', 1);
				ls.set('initiate', 2);
        bseed.custom = new Array();
				ls.set('seed', bseed);
				chrome.runtime.sendMessage('Login');
				content("index");
			}
		},
		continuePhrase: function() {
			content("mnemonicverify");
		},
		dlPhrase: function() {
			let phrase = ls.get('phrase');
			phrase = phrase.join(" ");
			let fileName = 'CREXTphrase ' + new Date() + '.txt';
			download(fileName, phrase);
		},
		verify: function() {
			$('input[type="text"]').css({"border" : "", "box-shadow" : ""});
			let word1 = $("#w1").val();
			let word2 = $("#w2").val();
			let word3 = $("#w3").val();
			let word4 = $("#w4").val();

			let cont=0;

      let seedPhrase = ls.get('phrase');

      if(word1 !== seedPhrase[verifyArray[0]]) {
				$('#w1').css("border","2px solid red");
		    $('#w1').css("box-shadow","0 0 3px red");
				$('#w1').val('');
			} else {
				cont++;
			}

			if(word2 !== seedPhrase[verifyArray[1]]) {
				$('#w2').css("border","2px solid red");
		    $('#w2').css("box-shadow","0 0 3px red");
				$('#w2').val('');
			} else {
				cont++;
			}

			if(word3 !== seedPhrase[verifyArray[2]]) {
				$('#w3').css("border","2px solid red");
		    $('#w3').css("box-shadow","0 0 3px red");
				$('#w3').val('');
			} else {
				cont++;
			}

			if(word4 !== seedPhrase[verifyArray[3]]) {
				$('#w4').css("border","2px solid red");
		    $('#w4').css("box-shadow","0 0 3px red");
				$('#w4').val('');
			} else {
				cont++;
			}

			if(cont === 4) {
				ls.set('initiate', 2);
				ls.remove('phrase');
				chrome.runtime.sendMessage('Login');
				content("index");
			}
		},
		refreshBalance: function() {
			walletBalance(global.keyPublic);
		},
		copyKey: function() {
			copy(global.keyPublic);
			$('#copyKey').text("Public key copied to clipboard");

			setTimeout(function(){
				$('#copyKey').text(global.keyPublic);
			}, 2500);
		},
		createTX: function() {
			tx.create();
		},
		sendTX: function() {
			tx.send(0);
			$('#balanceresult').html('<img src="../img/loader.svg" width="104" height="104">');
			setTimeout(function(){
				walletBalance(global.keyPublic);
			}, 2500);
		},
		resetTX: function() {
			content("index");
		},
		unlock: function() {
			let unlockPass = sha512($('#unlockpass').val());
			let initiate = 0;
			try {
				ls = new SecureLS({encodingType: 'aes', encryptionSecret: unlockPass});
				initiate = ls.get('initiate');
			} catch(e) {
				$("#unlocktext").text('Incorrect password! Please try again!');
				$("#unlockpass").val('');
			}

			if(initiate === 2) {
				chrome.storage.local.set({
					'encryption': unlockPass,
					'loginTime': new Date().getTime()
				});

				$("#loader").html('<img src="../img/loader.svg">');
				if(t !== undefined && msgInject !== undefined) { //Received inject MSG
			//		content("inject");
			//		setTimeout(function(){
						dAppTX(msgInject);
				//	}, 500);
				} else {
					content("index");
				}
			} else if(ls.getAllKeys().length === 0) {
				chrome.storage.local.clear();
				content("main");
				selectNode();
			}

		},
    addWallet: function () {
      content("addWallet");
    },
    addMnemonic: function () {
      let totalWallets = store.getState().a + 1;
      currentSelected = store.getState().a;
      store.putState({a: totalWallets, s: currentSelected});
      content("index");
    },
    addPrivate: function () {
      let pkey = $('#addWalletPrivate').val();
      if(pkey.length < 87 || pkey.length > 89) {
        $('#addWalletPrivateError').text("Incorrect length!");
      } else {
        let lsSeed = ls.get('seed');
        try {
          lsSeed.custom.push(bs58.decode(pkey));
          let curSelect = "c" + (lsSeed.custom.length - 1);
          ls.set('seed', lsSeed);
          let totalCustomWallets = store.getState().c + 1;
          store.putState({s: curSelect, c: totalCustomWallets});
          content("index");
        } catch(e) {
          $('#addWalletPrivateError').text("Invalid character detected!");
        }
      }
    },
    settings: function () {
      content("settings");
    },
    changePhising: function() {
      let phisingCode = $('#newPhising').val();
      if(phisingCode.length < 4 || phisingCode.length > 16) {
        $('#mesPhising').text("Incorrect length!");
      } else {
        store.putState({p: phisingCode});
        $('#curPhising').text(phisingCode);
        $('#mesPhising').text('Code succesfully changed!');
      }
    }
}

async function content(page) {

  $("#ext").slideUp(250);
  document.getElementById('container').innerHTML = "";

  switch(page) {
    case "main":
    	$('#menu').hide();
      returnValue = await main();
      document.getElementById('container').insertAdjacentHTML('beforeend', returnValue);
      document.getElementById('importwallet').addEventListener('click', CREXT.importwallet);
      document.getElementById('createwallet').addEventListener('click', CREXT.createwallet);
    break;
		case "importwallet":
			$('#menu').hide();
			returnValue = await importwallet();
			document.getElementById('container').insertAdjacentHTML('beforeend', returnValue);
			document.getElementById('importvault').addEventListener('click', CREXT.importvault);
			document.getElementById('continueImport').addEventListener('click', CREXT.continueImport);
			document.getElementById('cancelImport').addEventListener('click', CREXT.importwallet);
			$("#importvault").prop( "disabled", true);
      $(".text_field").bind("change keyup", check_import);
		break;
    case "mnemonicpass":
    	$('#menu').hide();
      returnValue = await mnemonicpass();
      document.getElementById('container').insertAdjacentHTML('beforeend', returnValue);
      $("#createvault").prop( "disabled", true);
      $(".text_field").bind("change keyup", check_field);
      document.getElementById('createvault').addEventListener('click', CREXT.createvault);
    break;
    case "mnemonicphrase":
		  $('#menu').hide();
      returnValue = await mnemonicphrase();
      document.getElementById('container').insertAdjacentHTML('beforeend', returnValue);
			document.getElementById('verifyseed').addEventListener('click', CREXT.continuePhrase);
			document.getElementById('dl').addEventListener('click', CREXT.dlPhrase);
			if(ls.get('phrase') === '') {
	      var mnemonic = CW.generateMnemonic({entropyBits: 128});
	      var bseed = CW.fromMnemonic(mnemonic);
	      $('#seedphrase').text(mnemonic);
				seed = mnemonic.split(" ");
				ls.set('phrase', mnemonic.split(" "));
        bseed.custom = new Array();
	      ls.set('seed', bseed);

        global.keyPublic = bs58.encode(bseed.getKeypair(0)._publicKey);

				chrome.storage.local.set({
	    		'PublicKey': global.keyPublic
	    	});

			} else {
				let phrase = ls.get('phrase');
				phrase = phrase.join(" ");
				$('#seedphrase').text(phrase);
			}
    break;
    case "unlock":
      $('#menu').hide();
      returnValue = await unlock();
      document.getElementById('container').insertAdjacentHTML('beforeend', returnValue);
      p = store.getState().p;
      if(p !== undefined) {
        $('#showPhising').text(p);
      }
			document.getElementById('unlock').addEventListener('click', CREXT.unlock);
    break;
		case "mnemonicverify":
		  $('#menu').hide();
			returnValue = await mnemonicverify();
			document.getElementById('container').insertAdjacentHTML('beforeend', returnValue);
			document.getElementById('verify').addEventListener('click', CREXT.verify);
			w1 = randomNo(1,3);
			w2 = randomNo(4,6);
			w3 = randomNo(7,9);
			w4 = randomNo(10,12);
			verifyArray.push((w1-1), (w2-1), (w3-1), (w4-1));
			$("#w1").attr("placeholder","Word " + w1);
			$("#w2").attr("placeholder","Word " + w2);
			$("#w3").attr("placeholder","Word " + w3);
			$("#w4").attr("placeholder","Word " + w4);
		break;
		case "index":
      currentSelected = store.getState().s;
      let currentNet = store.getState().n;
			$('#menu').show();
			returnValue = await index();
			document.getElementById('container').insertAdjacentHTML('beforeend', returnValue);
      global.keyPublic = key.exportPublic(currentSelected);
			$('#copyKey').text(global.keyPublic);
			await walletBalance(global.keyPublic);
      chrome.storage.local.set({
        'PublicKey': global.keyPublic
      });
			document.getElementById('refreshBalance').addEventListener('click', CREXT.refreshBalance);
			document.getElementById('copy').addEventListener('click', CREXT.copyKey);
			document.getElementById('createTX').addEventListener('click', CREXT.createTX);
			document.getElementById('sendTX').addEventListener('click', CREXT.sendTX);
			document.getElementById('resetTX').addEventListener('click', CREXT.resetTX);
			document.getElementById('mainPage').addEventListener('click', CREXT.resetTX);
			document.getElementById('failMainPage').addEventListener('click', CREXT.resetTX);
      document.getElementById('addnewwallet').addEventListener('click', CREXT.addWallet);
      if(currentNet === 1) {
        $('#selectedNet').text("MainNet");
      } else {
        $('#selectedNet').text("TestNet");
      }
		break;
		case "txhistory":
			$('#menu').show();
			returnValue = await txhistory();
			document.getElementById('container').insertAdjacentHTML('beforeend', returnValue);
			getTransactions(global.keyPublic, 0, 7);
		break;
		case "inject":
			$('#menu').hide();
			returnValue = await inject();
			document.getElementById('container').insertAdjacentHTML('beforeend', returnValue);
		break;
    case "addWallet":
      $('#menu').show();
      returnValue = await addWallet();
      document.getElementById('container').insertAdjacentHTML('beforeend', returnValue);
      document.getElementById('addMnemonic').addEventListener('click', CREXT.addMnemonic);
      document.getElementById('addPrivateKey').addEventListener('click', CREXT.addPrivate);
    break;
    case "settings":
    	$('#menu').show();
      returnValue = await settings();
      document.getElementById('container').insertAdjacentHTML('beforeend', returnValue);
      p = store.getState().p;
      if(p === undefined) {
        $('#curPhising').text("No code set");
      } else {
        $('#curPhising').text(p);
      }
      document.getElementById('changePhising').addEventListener('click', CREXT.changePhising);
    break;
  }

  $("#ext").slideDown(250);

}

function randomNo(x,y){
  return Math.floor(Math.random() * ((y-x)+1) + x);
}

$(document).on('click', '#getstarted', function(event){
	$('#firstpanel').fadeOut(250);
	$("#firstpanel").fadeOut(250, function () {
		$('#secondpanel').fadeIn(250);
});
});

$(document).on('click', '#dropdownnet', async function(event){
        if($('ul.dropdownSelectNet').is(':visible')) {
          $('ul.dropdownSelectNet').slideUp(500);
        } else {
          $('ul.dropdownSelectNet').slideDown(500);
        }
    });

    $(document).on('click', '#openSetting', async function(event){
      let set = $(this).attr("data-content");
      if($('#' + set).is(':visible')) {
        $('#' + set).slideUp(250);
        $('#' + set + 'Badge').html('<i class="fas fa-angle-down"></i>');
      } else {
        $('#' + set).slideDown(250);
        $('#' + set + 'Badge').html('<i class="fas fa-angle-up"></i>');
        sw();
      }
    });

$(document).on('click', '#dropdownkey', async function(event){
        if($('ul.dropdown').is(':visible')) {
          $('#addwallet').fadeOut(250);
          $('ul.dropdown').slideUp(500);
          $('#dropdownkey').html('<i class="fas fa-angle-double-down" style="color:#ECF2FF;"></i>');
        } else {
          $('#addwallet').fadeIn(250);
          $('#dropdownSelect').html('<li style="text-align: center"><img src="../img/loader.svg" style="width:80px;height:80px;"></li>');
          $('ul.dropdown').slideDown(500);
          $('#dropdownkey').html('<i class="fas fa-angle-double-up" style="color:#ECF2FF;"></i>');
          sw();
        }
    });

$(document).on('click', '#selectNet', function(event){
    let net = $(this).attr("data-content");
    if(net === "MainNet") {
      $('#selectedNet').text("MainNet");
      store.putState({n: 1});
      selectNode().then(
        function(val) {
          walletBalance(global.keyPublic);
      });
    } else {
      $('#selectedNet').text("TestNet");
      store.putState({n: 0});
      selectNode().then(
        function(val) {
          walletBalance(global.keyPublic);
      });
    }
});


module.exports = {
  content,
  CREXT
}

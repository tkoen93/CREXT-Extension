const main = require("../html/main");
const mnemonicpass = require("../html/mnemonicpass");
const mnemonicphrase = require("../html/mnemonicphrase");
const mnemonicverify = require("../html/mnemonicverify");
const index = require("../html/index");
const unlock = require("../html/unlock");
const $ = require('jquery');
const menu = require('./menu');
const check_field = require('./check_field');
const SecureLS = require('secure-ls');
const sha512 = require('js-sha512').sha512;
const bip39 = require('bip39');
const nacl = require('tweetnacl');
const bs58 = require('bs58');
const download = require('./download');
const walletBalance = require('./walletBalance');
const key = require('./key');
const copy = require('./copy');
const tx = require('./tx');

let ls;
let keyPublic;

document.addEventListener("DOMContentLoaded", function(){
	menu('hide');
	document.getElementById('openaccount').addEventListener('click', CREXT.openaccount);
	document.getElementById('txhistory').addEventListener('click', CREXT.txhistory);

	chrome.storage.local.get(function(result) {
    console.log(result);
		keyPublic = result.PublicKey;
    if(result.encryption != undefined) {
      ls = new SecureLS({encodingType: 'aes', encryptionSecret: result.encryption});
        let s = Buffer.from(ls.get('seed'));
         console.log(s);
				 if(s != '') {
					 console.log(ls.get('phrase'));

	         var pair = nacl.sign.keyPair.fromSeed(s.slice(0, 32));

	         //console.log(pair);

	         let PublicKey = bs58.encode(Buffer.from(pair.publicKey));
	         let PrivateKey = bs58.encode(Buffer.from(pair.secretKey));

	         let str = {
	                 public: PublicKey,
	                 private: PrivateKey
	         };

	         console.log(str);
				 }

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
 });


CREXT = {

    testalert: function() {
      alert("YAY");
      console.log("YES");
      ls.set('test', 1);
      console.log(global.ls);
    },
    createwallet: function() {
      content("mnemonicpass");
    },
    openaccount: function() {
      console.log('openaccount');
    },
    txhistory: function() {
      console.log('txhistory');
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
	        'loginTime': new Date().getTime()
	    	});
	       ls = new SecureLS({encodingType: 'aes', encryptionSecret: encryption});
	      //alert($("#pass1").val());
	      ls.set('version', 1);
				ls.set('initiate', 1);
	      content("mnemonicphrase");
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
			ls.set('initiate', 2);
			content("index");
		},
		refreshBalance: function() {
			walletBalance(keyPublic);
		},
		copyKey: function() {
			copy(keyPublic);
			$('#copyKey').text("Public key copied to clipboard");

			setTimeout(function(){
				$('#copyKey').text(keyPublic);
			}, 2500);
		},
		createTX: function() {
			tx.create(keyPublic);
		},
		sendTX: function() {
			tx.send(0);
			$('#balanceresult').html('<img src="../img/loader.svg" width="104" height="104">');
			setTimeout(function(){
				walletBalance(keyPublic);
			}, 2500);
		},
		resetTX: function() {
			content("index");
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
      document.getElementById('importwallet').addEventListener('click', CREXT.testalert);
      document.getElementById('createwallet').addEventListener('click', CREXT.createwallet);
    break;
    case "mnemonicpass":
    $('#menu').hide();
      document.getElementById('openaccount').addEventListener('click', CREXT.openaccount);
      document.getElementById('txhistory').addEventListener('click', CREXT.txhistory);
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
//			document.getElementById('dl').addEventListener('click', CREXT.dlPhrase);
			document.getElementById('verifyseed').addEventListener('click', CREXT.continuePhrase);
			document.getElementById('dl').addEventListener('click', CREXT.dlPhrase);
			console.log(ls.get('phrase'));
			if(ls.get('phrase') === '') {
	      var mnemonic = bip39.generateMnemonic();
	      console.log(mnemonic);
	      var bseed = bip39.mnemonicToSeed(mnemonic);

	      $('#seedphrase').text(mnemonic);

	      console.log(bseed);

				ls.set('phrase', mnemonic.split(" "));

	      ls.set('seed', bseed);

				var pair = nacl.sign.keyPair.fromSeed(bseed.slice(0, 32));
				keyPublic = bs58.encode(Buffer.from(pair.publicKey));

				chrome.storage.local.set({
	    		'PublicKey': keyPublic
	    	});

	      console.log(Buffer.from(ls.get('seed')));

	      var hxseed = bseed.toString('hex');
	      console.log(hxseed);

	      var bseed1 = hxseed.toString('binary');
	      console.log(bseed1);
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
    break;
		case "mnemonicverify":
		  $('#menu').hide();
			returnValue = await mnemonicverify();
			document.getElementById('container').insertAdjacentHTML('beforeend', returnValue);
			document.getElementById('verify').addEventListener('click', CREXT.verify);
		break;
		case "index":
			$('#menu').show();
			returnValue = await index();
			document.getElementById('container').insertAdjacentHTML('beforeend', returnValue);
			$('#copyKey').text(keyPublic);
			await walletBalance(keyPublic);
			document.getElementById('refreshBalance').addEventListener('click', CREXT.refreshBalance);
			document.getElementById('copy').addEventListener('click', CREXT.copyKey);
			document.getElementById('createTX').addEventListener('click', CREXT.createTX);
			document.getElementById('sendTX').addEventListener('click', CREXT.sendTX);
			document.getElementById('resetTX').addEventListener('click', CREXT.resetTX);
			document.getElementById('mainPage').addEventListener('click', CREXT.resetTX);
		break;
  }

  $("#ext").slideDown(250);

}

module.exports = {
  content,
  CREXT
}

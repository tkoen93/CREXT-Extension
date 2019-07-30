const $ = require('jquery');
const extension = require('extensionizer');
const selectNode = require('./lib/selectNode');
const nodeTest = require('./lib/nodeTest');
const CREXT = require('./lib/html').CREXT;
const bs58 = require('bs58');
const CW = require('./lib/CW');

global.nodeIP;
global.nodePORT;

document.addEventListener("DOMContentLoaded", async function(){

	$('#wrapper').html('<div class="init"><img src="../img/loader.svg"></div>');

	await extension.storage.local.get(async function(result) {
	  global.nodeIP = result.ip;
	  global.nodePORT = result.port;

		await nodeTest();
	});

	CREXT.start();

	let open = $('.open-nav'),
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

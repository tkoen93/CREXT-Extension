const $ = require('jquery');
const selectNode = require('./lib/selectNode');
const CREXT = require('./lib/html').CREXT;

document.addEventListener("DOMContentLoaded", function(){

	let sendDate = (new Date()).getTime();
	selectNode()
	.then(function(r) {
	 let receiveDate = (new Date()).getTime();
	 let responseTimeMs = receiveDate - sendDate;
	 console.log("scripts.js selected node: " + r);
	 console.log("Took " + responseTimeMs + "ms to select node");
	 global.nodeIP = r;
	 global.nodePORT = 8081;
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

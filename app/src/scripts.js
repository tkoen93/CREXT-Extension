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

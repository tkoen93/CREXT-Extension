const $ = require('jquery');
const nodeTest = require('./nodeTest');
const connect = require('./connect');
const API = require('../gen-nodejs/API');
const bs58 = require('bs58');
const convert = require('./convert');
const tippy = require('tippy.js');
const copy = require('./copy');
const txPages = require('./txpage');
const LS = require('./ls');
const store = new LS('CREXT');

let keyPublic;
let account;


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

function getTransactions(key, start, amount) { // Get transactions history

  let currentNet = store.getState() != undefined ? store.getState().n : 1;
  let monitorUrl = currentNet == 0 ? 'https://monitor.credits.com/testnet-r4_2/' : 'https://monitor.credits.com/CreditsNetwork/';

  keyPublic = key;
  $('#showtx').fadeOut(250);
  $('#showtx').empty();
  $('#txPaging').fadeOut(250);
  $('#txPaging').empty();
  $('#txLoader').html('<img src="../img/loader.svg">');
//    nodeTest().then(function(r) {
//      connect().TransactionsGet(bs58.decode(key), start, amount, function (err, r) {
//url: monitorUrl + 'API/AccountTransactions?id=' + key + '&page=' + start + '&limit=' + amount,
$.ajax({
  type: "GET",
  url: monitorUrl + 'API/AccountTransactions',
  dataType: 'json',
  data: { id : key, page: start, limit: amount },
  success: function(r) {
    console.log(r);

      //  let total_tx = 99; // Fixed amount as total_trxns_count always returns 0

      let total_tx = r.txCount;

        $('#txLoader').empty();

        for(let index in r.transactions) {
      /*    let from = bs58.encode(Buffer.from(r.transactions[index].trxn.source));
          let to = bs58.encode(Buffer.from(r.transactions[index].trxn.target));
          let poolHash = Buffer.from(r.transactions[index].id.poolHash).toString('hex');

          let fraction = convert(r.transactions[index].trxn.amount.fraction.buffer);

          if (fraction === 0) {
              fraction = '00';
          }	else {
            if(fraction.toString().length != 18) {
              mLeadingZeros = 18 - fraction.toString().length;
              for(i=0;i<mLeadingZeros;i++) {
                fraction = "0" + fraction;
              }
            }
              fraction = "0." + fraction;
              fraction = Number(fraction*1).noExponents().toString().split(".")[1];
          }

          let amount = r.transactions[index].trxn.amount.integral + "." + fraction.toString().substring(0,2);
          let fullAmount = r.transactions[index].trxn.amount.integral + "." + fraction + " CS";

          let url = monitorUrl + 'transaction/' + poolHash + '.' + (r.transactions[index].id.index + 1);*/

          let from = r.transactions[index].fromAccount;
          let to = r.transactions[index].toAccount;
          let url = monitorUrl + 'transaction/' + r.transactions[index].id;
          let value = r.transactions[index].value + ".";
          let frac = value.split(".");
          let fraction;
          if(frac[1].length === 0) {
            fraction = '00';
          } else if(frac[1].length === 1) {
            fraction = frac[1] + "0";
          } else {
            fraction = frac[1].toString().substring(0,2);
          }
          let amount = frac[0] + "." + fraction + " " + r.transactions[index].currency;
          let fullAmount = r.transactions[index].value + " " + r.transactions[index].currency;

          if(key == from) {
            account = to.substring(0, 16);
            $('#showtx').append("<tr class='txhisrow'><td width='30'>&nbsp;</td><td width='120'><img src=\"/img/sent.png\"/><p class=\"txSent\">Sent</p></td><td width='160' class='flex' id=\"copyTX\" data-content='" + to + "'><a href='#'><p class=\"txHisr\" id=\"tippy\" data-tippy-content='<p style=\"font-size:12px;\">" + to + "</p>'>" + account + " ...</p></a></td><td width='85'><p class=\"txHisr\" id=\"tippy\" data-tippy-content='<p style=\"font-size:12px;\">" + fullAmount + "</p>'>" + amount + "</p></td><td data-toggle='popover' data-content='View on monitor' data-placement='left'><a href=\"" + url + "\" target=\"_blank\"><i class=\"fas fa-external-link-alt\" style=\"color:#5cacf6;\"></i></a></td></tr>");
          } else if(key == to){
            account = from.substring(0, 16);
            $('#showtx').append("<tr class='txhisrow'><td width='30'>&nbsp;</td><td width='120'><img src=\"/img/received.png\"/><p class=\"txReceived\">Received</p></td><td width='160' class='flex' id=\"copyTX\" data-content='" + from + "'><a href='#'><p class=\"txHisr\" id=\"tippy\" data-tippy-content='<p style=\"font-size:12px;\">" + from + "</p>'>" + account + " ...</p></a></td><td width='85'><p class=\"txHisr\" id=\"tippy\" data-tippy-content='<p style=\"font-size:12px;\">" + fullAmount + "</p>'>" + amount + "</p></td><td data-toggle='popover' data-content='View on monitor' data-placement='left'><a href=\"" + url + "\" target=\"_blank\"><i class=\"fas fa-external-link-alt\" style=\"color:#5cacf6;\"></i></a></td></tr>");
          }

        }

      //  let pageNumber = (start / 7)+1;
      let pageNumber = start;
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
      }


      });
//    }); end nodetest
}

$(document).on('click', '#copyTX', function(event){
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
//	let start = (selectedPage-1) * 7;
//	getTransactions(keyPublic, start, 7);
	getTransactions(keyPublic, selectedPage, 7);
});

module.exports = getTransactions;

const $ = require('jquery');
const LS = require('./ls');
const nodeTest = require('./nodeTest');
const connect = require('./connect');
const API = require('../gen-nodejs/API');
const bs58 = require('bs58');
const convert = require('./convert');
const key = require('./key');
const walletBalance = require('./walletBalance');

const store = new LS('CREXT');

let totalWallets;
let currentSelected;

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

async function selectWallet() {

  totalWallets = store.getState().a;
  currentSelected = store.getState().s;

  let html = '';

  //for(let i=0; i<totalWallets; i++) {
  for(let i = totalWallets-1; i > -1; i--) {

    let response = await addWallet(i);

    html = response + html;

      if(i === 0)
        break;

  }
  $('#dropdownSelect').html(html);
}

async function addWallet(n) {
  let keyex = await key.exportPublic(n);
  let response = await connect().WalletBalanceGet(bs58.decode(keyex));
    let fraction = await convert(response.balance.fraction.buffer);

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
        fraction = Number(fraction*1).noExponents().toString().split(".")[1].substring(0,6);
    }

    let integral = response.balance.integral.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    let totalBalance = integral + "." + fraction;

    if(currentSelected === n) {
      return `<li id="selectWallet" data-content="`+keyex+`" data-id="` +n+ `"><a href="#"><div style="height:40px;"><div class="pull-left"><p class="small">` + keyex + `<br />` + totalBalance + ` CS</p></div><div class="pull-right"><i class="far fa-check-circle"></i></div></div></a></li>`;
    } else {
      return `<li id="selectWallet" data-content="`+keyex+`" data-id="` +n+ `"><a href="#"><div><p class="small">` + keyex + `<br />` + totalBalance + ` CS</p></div></a></li>`;
    }
}

$(document).on('click', '#selectWallet', function(event){
		let newSelectedKey = $(this).attr("data-content");
    let id = $(this).attr("data-id");

    chrome.storage.local.set({
      'PublicKey': newSelectedKey
    });

    global.keyPublic = newSelectedKey;

    chrome.runtime.sendMessage('update');

    store.putState({s: Number(id)});

    walletBalance(newSelectedKey);
    	$('#copyKey').text(newSelectedKey);

      $('#addwallet').fadeOut(250);
      $('ul.dropdown').slideUp(500);
      $('#dropdownkey').html('<i class="fas fa-angle-double-down" style="color:#ECF2FF;"></i>');

    /*setTimeout(function() {
      location.reload();
    },250);*/
  });

module.exports = selectWallet;

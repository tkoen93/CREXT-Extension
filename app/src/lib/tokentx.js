const $ = require('jquery');
const tippy = require('tippy.js');
const key = require('./key');
const connect = require('./connect');
const nodeTest = require('./nodeTest');
const CreateTransaction = require('./signature');
const bs58 = require('bs58');
const contractState = require('./contractState');

const LS = require('./ls');

const store = new LS('CREXT');

let currentSelected;
let maximumfee;
let target;
let ticker;

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

function create() {

  currentSelected = store.getState() === undefined ? '0' : store.getState().s;
  global.keyPublic = key.exportPublic(currentSelected);

  $('input[type="text"]').css({"border" : "", "box-shadow" : ""});
  $('#tokeyError').hide();
  $('#tosendError').hide();
  $('#maxfeeError').hide();

  let decimals = $('#decimal').val();
  ticker = $('#ticker').val();
  let balance = $('#balance').val();
  target = $('#hidTokenAddress').val();

  console.log(target);

  let regexp = /^\d+(\.\d{1,18})?$/;
  let cont = true;

  let to = $('#tokey').val();
  let amount = $('#tosend').val();
  amount = amount.replace(/,/, '.');
  let maxfee = $('#maxfee').val();
  maxfee = maxfee.replace(/,/, '.');

  if(amount.charAt(0) == '.') {
    amount = "0" + amount;
  }

  if(maxfee.charAt(0) == '.') {
    maxfee = "0" + maxfee;
  }

  if(to == global.keyPublic) {
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

  try {
    bs58.decode(to);
  } catch(e) {
    console.log(e);
    $('#tokey').css("border","2px solid red");
    $('#tokey').css("box-shadow","0 0 3px red");
    $('#tippytoKey').attr("data-tippy-content", "<p style=\"font-size:12px;\">Please enter a valid public key</p>");
    $('#tokeyError').show();
  }

  let amountDec = amount.split(".");

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
      } else if(amountDec.length > 1 && amountDec[1].length > decimals) {
        $('#tosend').css("border","2px solid red");
        $('#tosend').css("box-shadow","0 0 3px red");
        $('#tippytoSend').attr("data-tippy-content", "<p style=\"font-size:12px;\">Only " + decimals + " decimals allowed</p>");
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
    maximumfee = maxfee;
  if(amount.length > 8) {
    $('.confirmsize').css("font-size","18px");
  } else {
    $('.confirmsize').css("font-size","24px");
  }
  $('#tokeyError').hide();
    $('#confirmTicker').text(ticker);
    $('#confirmTicker2').text(ticker);
    $('#transactionto').text(to);
    $('#tosendto').text(amount);
    $('#tosend').text(amount);
    $('#maxfeeto').text(maxfee);
    $('#transactionto2').text(to);
    $('#tosendto2').text(amount);
    $('#maxfeeto2').text(maxfee);
    $('#dropdownToken').hide();
    $("#initialTX").slideUp(250, function () {
      $("#confirmTX").slideDown(250);
  });
  }
}

async function send(n = 0) {
  $('#txerror').empty();
  $('#txerror').removeClass();

  $("#confirmTX").slideUp(250, function () {
    $('#confirmedTX').slideDown(250);
    $('#selectedTokenBalance').html('Balance: <img src="../img/loader.svg" width="28" height="28" style="margin-top:-5px;"/> ' + ticker);
});

  let to = $('#tokey').val();
  let amount = $('#tosend').val();


  CreateTransaction({
    Fee: maximumfee,
    Target: target,
    SmartContract: {
        Method: "transfer",
        Params: [
            {K: "STRING",V: to},
            {K: "STRING",V: amount.toString()}
        ]
    }
  }).then(function(r) {
    console.log(r);
      if(r.Message != undefined) {
        console.error(r.Message);
        $('#failButton').slideDown(250);
        $('#txLoader').hide();
        $('#failed').show();
        $('#sigError').html("<div class=\"confirmTitle\">FAILED</div><div class=\"confirmText\">" + r.Message + "</div></div>");
      } else {
        nodeTest().then(function(nr) {
          connect().TransactionFlow(r.Result, function(err, re) {
            console.log(re);
            if(re.status.code === 0) {
              $('#completeButtons').slideDown(250);
              $('#txLoader').hide();
              $('#completed').show();
              let params = {data: {target: target, method: "balanceOf", params: [{ K: "STRING", V: global.keyPublic}]}};
              contractState(params)
              .then(function(r) {
                r = Number(r).noExponents();
                let showBalance = r.split(".");
                let balance;
                if(showBalance.length > 1) {
                  balance = showBalance[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + "." + showBalance[1];
                } else {
                  balance = r.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                }
                $('#selectedTokenBalance').text(`Balance: ` + balance + ` ` + ticker);
              })
              .catch(r => console.warn(r));
            } else {
              $('#failButton').slideDown(250);
              $('#txLoader').hide();
              $('#failed').show();
              $('#sigError').html("<div class=\"confirmTitle\">FAILED</div><div class=\"confirmText\">" + r.status.message + "</div></div>");
            }
          });
        });
      }
    });
}

module.exports = {
  create,
  send
};

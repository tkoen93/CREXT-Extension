const $ = require('jquery');
const tippy = require('tippy.js');
const key = require('./key');
const connect = require('./connect');
const nodeTest = require('./nodeTest');
const CreateTransaction = require('./signature');
const bs58 = require('bs58');

const LS = require('./ls');

const store = new LS('CREXT');

let currentSelected;
let maximumfee;

function create() {

  currentSelected = store.getState() === undefined ? '0' : store.getState().s;
  global.keyPublic = key.exportPublic(currentSelected);

  $('input[type="text"]').css({"border" : "", "box-shadow" : ""});
  $('#tokeyError').hide();
  $('#tosendError').hide();
  $('#maxfeeError').hide();

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
    maximumfee = maxfee;
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
}

async function send(n = 0) {
  $('#txerror').empty();
  $('#txerror').removeClass();

  $('#confirmTXinfo').slideUp(250);
  $("#confirmButtons").slideUp(250, function () {
    $('#confirmedTX').slideDown(250);
/*    $('#completeButtons').slideDown(250);
    $('#completed').slideDown(1000);*/
});

  let to = $('#tokey').val();
  let amount = $('#tosend').val();


  CreateTransaction({
    Amount: amount,
    Fee: maximumfee,
    Target: to
  }).then(function(r) {
      if(r.Message != undefined) {
        console.error(r.Message);
        $('#failButton').slideDown(250);
        $('#txLoader').hide();
        $('#failed').show();
        $('#sigError').html("<div class=\"confirmTitle\">FAILED</div><div class=\"confirmText\">" + r.Message + "</div></div>");
      } else {
        nodeTest().then(function(nr) {
          connect().TransactionFlow(r.Result, function(err, re) {
            if(re.status.code === 0) {
              $('#completeButtons').slideDown(250);
              $('#txLoader').hide();
              $('#completed').show();
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

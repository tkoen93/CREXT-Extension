const $ = require('jquery');
const nodeTest = require('./nodeTest');
const connect = require('./connect');
const API = require('../gen-nodejs/API');
const bs58 = require('bs58');
const convert = require('./convert');
const tippy = require('tippy.js');

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

function walletBalance(key) { // Function to show balance of public key.

$('#balanceresult').html('<img src="../img/loader.svg" width="104" height="104">');
    nodeTest().then(function(r) {
      connect().WalletBalanceGet(bs58.decode(key), function(err, response) {
          let fraction = convert(response.balance.fraction.buffer);
          let fullfrac;

          if (fraction === 0) {
              fraction = '00';
          }	else {
            if(fraction.toString().length != 18) {
              let mLeadingZeros = 18 - fraction.toString().length;
              for(let i=0;i<mLeadingZeros;i++) {
                fraction = "0" + fraction;
              }
            }
              fraction = "0." + fraction;
              fullfrac = Number(fraction*1).noExponents().toString().split(".")[1];
              fraction = Number(fraction*1).noExponents().toString().split(".")[1].substring(0,2);
          }

          let totalBalance = response.balance.integral + "." + fraction;
          let integral = response.balance.integral.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");


          $.ajax({
            url: 'https://api.coinmarketcap.com/v1/ticker/credits/?ref=widget&convert=ETH',
            success: function(res) {
              let data = res[0];

              let totalValue = totalBalance * data.price_usd;
              totalValue = totalValue.toFixed(2);

              totalValue = totalValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

              let changeLabel;

              if(data.percent_change_24h < 0) {
                changeLabel = "<span class=\"label label-danger pchange\"><p class=\"shadow tchange\">" + data.percent_change_24h + "%</p></span>";
              } else if(data.percent_change_24h > 0) {
                changeLabel = "<span class=\"label label-success pchange\"><p class=\"shadow tchange\">+" + data.percent_change_24h + "%</p></span>";
              } else {
                changeLabel = "<span class=\"label label-secondary pchange\"><p class=\"shadow tchange\">" + data.percent_change_24h + "%</p></span>";
              }

              $('#balanceresult').html("<div id=\"balancetippy\" style=\"padding:0;margin:0;display:inline-block\"><p class=\"shadow\" style=\"color:white;font-size:16px;\">CS</p> <p class=\"shadow light\" style=\"font-size:55px;color:white;\">" + integral + "</p><p class=\"shadow light\" style=\"color:white;font-size:18px;\">." + fraction + "</p></div><br /><p style=\"color:#8EE1F1;font-size:18px;\">$ " + totalValue + "</p> " + changeLabel);

              $('#balancetippy').attr("data-tippy-content", "<p style=\"font-size:12px;\">" + integral + "." + fullfrac + " CS</p>");

              tippy('#balancetippy', {
                placement: 'top',
                delay: 500,
                interactive: true,
                offset: '0, -15',
                arrow: true,
                arrowType: 'round',
                a11y: false,
                flip: false
              });

            }
          });

    });

  });

}

module.exports = walletBalance;

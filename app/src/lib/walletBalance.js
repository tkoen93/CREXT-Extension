const $ = require('jquery');
const nodeTest = require('./nodeTest');
const connect = require('./connect');
const API = require('../gen-nodejs/API');
const bs58 = require('bs58');
const convert = require('./convert');

function walletBalance(key) { // Function to show balance of public key.
$('#balanceresult').html('<img src="../img/loader.svg" width="104" height="104">');
    nodeTest().then(function(r) {
      connect().WalletBalanceGet(bs58.decode(key), function(err, response) {
        console.log(response);
          let fraction = convert(response.balance.fraction.buffer);

          if (fraction == 0) {
              fraction = 0;
          }	else {
            if(fraction.toString().length != 18) {
              mLeadingZeros = 18 - fraction.toString().length;
              for(i=0;i<mLeadingZeros;i++) {
                fraction = "0" + fraction;
              }
            }
              fraction = "0." + fraction;
              fraction = (fraction * 1).toString().split(".")[1];
              fraction = fraction.toString().substring(0,2);
          }

          totalBalance = response.balance.integral + "." + fraction;

          let integral = response.balance.integral.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");


          $.ajax({
            url: 'https://api.coinmarketcap.com/v1/ticker/credits/?ref=widget&convert=ETH',
            success: function(res) {
              data = res[0];

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

              $('#balanceresult').html("<p class=\"shadow\" style=\"color:white;font-size:16px;\">CS</p> <p class=\"shadow light\" style=\"font-size:55px;color:white;\">" + integral + "</p><p class=\"shadow light\" style=\"color:white;font-size:18px;\">." + fraction + "</p><br /><p style=\"color:#8EE1F1;font-size:18px;\">$ " + totalValue + "</p> " + changeLabel);
            }
          });

    });

  });
}

module.exports = walletBalance;

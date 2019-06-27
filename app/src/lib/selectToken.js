const $ = require('jquery');
const SecureLS = require('secure-ls');
const LS = require('./ls');
const store = new LS('CREXT');
const connect = require('./connect');
let currentNet = store.getState().n;
const contractState = require('./contractState');

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

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function selectToken(data, network) {
  if(network === 1) {
    readTextFile("tokens.json", function(text){
      let dataJSON = JSON.parse(text);

      if(Object.size(data) === 0) {
        $('#dropdownSelectToken').html('<li style="text-align: center">Please add tokens via the settings page.</li>');
      } else {
        let html = '';
        let i = 0;
        for (const [key, value] of Object.entries(data)) {
          let params = {data: {target: key, method: "balanceOf", params: [{ K: "STRING", V: global.keyPublic}]}};
          contractState(params)
          .then(function(r) {
            if(dataJSON.hasOwnProperty(key)) {
              let addHTML = `<li id="selectToken" style="text-align: right" data-address="`+key+`" data-balance="` +Number(r).noExponents()+ `" data-ticker="` +value+ `" data-img="` + dataJSON[key]["icon"] + `"><a href="#"><div class="pull-left"><img width="35" height="35" src="` + dataJSON[key]["icon"] + `" /></div><div><p class="small">` + key + `<br />` + Number(r).noExponents() + ` ` + value + `</p></div></a></li>`;
              html = html + addHTML;
            } else {
              let addHTML = `<li id="selectToken" style="text-align: right" data-address="`+key+`" data-balance="` +Number(r).noExponents()+ `" data-ticker="` +value+ `" data-img="../img/tokenimg.png"><a href="#"><div class="pull-left"><img width="35" height="35" src="../img/tokenimg.png" /></div><div><p class="small">` + key + `<br />` + Number(r).noExponents() + ` ` + value + `</p></div></a></li>`;
              html = html + addHTML;
            }

            i++;
            if(i === Object.size(data)) {
              $('#dropdownSelectToken').html(html);
            }
          })
          .catch(r => console.warn(r));
        }
      }

    });
  } else {
    if(Object.size(data) === 0) {
      $('#dropdownSelectToken').html('<li style="text-align: center">Please add tokens via the settings page.</li>');
    } else {
      let html = '';
      let i = 0;
      for (const [key, value] of Object.entries(data)) {
        let params = {data: {target: key, method: "balanceOf", params: [{ K: "STRING", V: global.keyPublic}]}};
        contractState(params)
        .then(function(r) {
          let addHTML = `<li id="selectToken" style="text-align: right" data-address="`+key+`" data-balance="` +Number(r).noExponents()+ `" data-ticker="` +value+ `" data-img="../img/tokenimg.png"><a href="#"><div class="pull-left"><img width="35" height="35" src="../img/tokenimg.png" /></div><div><p class="small">` + key + `<br />` + Number(r).noExponents() + ` ` + value + `</p></div></a></li>`;
          html = html + addHTML;
          i++;
          if(i === Object.size(data)) {
            $('#dropdownSelectToken').html(html);
          }
        })
        .catch(r => console.warn(r));
      }
    }
  }
}

function checkContract(address) {
  return new Promise(async function(resolve, reject) {
    await connect().SmartContractDataGet(address, function(err, r) {
      if(r.status.code === 1) {
        reject("Target address is not a contract");
      } else {
          let found = 0;
          for(var i = 0; i < r.methods.length; i++) {
              if (r.methods[i].name == "getSymbol" || r.methods[i].name == "getDecimal" || r.methods[i].name == "transfer")
                found++;

              if(found > 2)
                break;
          }
          if(found > 2) {
            resolve();
          } else {
            reject("Target address is not a token");
          }
      }
    });
  });
}

$(document).on('click', '#selectToken', function(event){
		let tokenAddress = $(this).attr("data-address");
    let balance = $(this).attr("data-balance");
    let ticker = $(this).attr("data-ticker");
    let img = $(this).attr("data-img");

    $('#tokenInformation').html(`<div class="pull-left" style="margin-top:-18px;"><img width="35" height="35" src="` + img + `" /></div><div style="margin-top:-10px;"><p class="small" style="font-size:14px;">Balance: ` + Number(balance).noExponents() + ` ` + ticker + `</p></div>`);
    $("input").prop("disabled", false);
    $("button").prop("disabled", false);
  	$('#selectedToken').text(tokenAddress);
    $('ul.dropdown').slideUp(500);
    $('#dropdownToken').html('<i class="fas fa-angle-double-down" style="color:#ECF2FF;"></i>');
});


module.exports = {
  selectToken,
  checkContract
};

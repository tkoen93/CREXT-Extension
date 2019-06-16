const LS = require('./ls');
const tokenData = new LS('CREXT-TOKEN');
const contractState = require('./contractState');


function tokens() {
  console.log(global.keyPublic);

  let params = {data: {target: "M8twKnbo5WLe53RTBRqxMHZF2qcm3ygFXj3dj5bTtks", method: "balanceOf", params: [{K: "STRING",V: global.keyPublic}]}};

  contractState(params).then(function(r){
    console.log(r);
  }).catch(function(r) { console.log(r) ; });

}

module.exports = tokens;

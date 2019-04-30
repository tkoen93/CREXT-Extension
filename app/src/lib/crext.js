

CREXTENSION = {

    testalert: function() {
      alert("YAY");
      console.log("YES");
    },
    createwallet: function() {
      content("bip39");
    },
    openaccount: function() {
      console.log('openaccount');
    },
    txhistory: function() {
      console.log('txhistory');
    }

}

module.exports = CREXTENSION;

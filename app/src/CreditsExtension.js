(function () {
  window.CREXT = {

      getKey: function(params) {
        let identifier = genIdentifier(16);
        if(params == null)
          params = {};
        sendMsg(identifier, "getKey", params);
        return returnPromise(identifier, "getKey", 100);
      },
      sendTransaction: function(params) {
        if(checkTransaction(params)) {
          params.fee = String(params.fee).replace(',', '.');
          console.log(params);
          let identifier = genIdentifier(16);
          sendMsg(identifier, "TX", params);
          return returnPromise(identifier, "TX", 200);
        } else {
          throw "One or multiple parameters is incorrect or missing!";
        }

      },
      contractState: function(params) {
        let identifier = genIdentifier(16);
        sendMsg(identifier, "contractState", params);
        return returnPromise(identifier, "contractState", 100);
      },
      balanceGet: function(params) {
        let identifier = genIdentifier(16);
        sendMsg(identifier, "balanceGet", params);
        return returnPromise(identifier, "balanceGet", 100);
      },
      walletDataGet: function(params) {
        let identifier = genIdentifier(16);
        sendMsg(identifier, "walletDataGet", params);
        return returnPromise(identifier, "walletDataGet", 100);
      }

  }

  function returnPromise(identifier, type, timeOut) {
    return new Promise(function(resolve, reject) {
    setTimeout(function() {
      window.addEventListener("message", function(event) {
        if (event.source == window && event.data.CREXTreturn == type && event.data.CSID == identifier) {
          if(event.data.data.success) {
            resolve(event.data.data);
          } else {
            reject(event.data.data);
          }
        }
      })
    }, timeOut);
    });
  }

  function sendMsg(identifier, type, msg) {
    postMessage({ CStype: type, CSID: identifier, text: msg }, window.location.origin);
  }

  function checkTransaction(params) {

    if(!Object.prototype.hasOwnProperty.call(params, "fee")) {
      return false;
    } else {
      let regexp = /^\d+(\.\d{1,18})?$/;
      let fee = params.fee;
      fee = fee.replace(/,/, '.');
      return (fee == '' || regexp.test(fee) != true) ? false : true;
      /*if(fee == '' || regexp.test(fee) != true) {
        return false;
      } else {
        return true;
      }*/
    }
  }

  function genIdentifier(length) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
}());

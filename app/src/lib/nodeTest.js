const AbortController = require('abort-controller');
const selectNode = require('./selectNode');

let ip;
let port;

chrome.storage.local.get(function(result) {
  ip = result.ip;
  port = result.port;
});

function nodeTest() {

  const controller = new AbortController();

  const timeout = setTimeout(
    () => { controller.abort(); },
    500,
  );

  return new Promise(function(resolve, reject) {
  const promise = fetch(
    "http://"+ip+":"+port+"/thrift/service/Api",
    {
      headers: {"Content-Type":"application/x-thrift"},
      body: "[1,\"SyncStateGet\",1,1,{}]",
      method: 'POST',
      signal: controller.signal
    })
    .then(function(res) {
			resolve(res);
		})
    .catch(function(err) {
      console.log(err);
      console.log(global.nodeIP + " unreachable, selecting new node");
			selectNode()
			.then(function(r) {
				console.log("nodeTest.js selected node: " + r);
				global.nodeIP = r;
        global.nodePORT = 8081;
				resolve(r);
			});
		})
    .finally(() => {
       clearTimeout(timeout);
    });
  });

}


module.exports = nodeTest;

const AbortController = require('abort-controller');
const selectNode = require('./selectNode');
const thrift = require('thrift');
const API = require('../gen-nodejs/API');
const convert = require("./convert");

let ip;
let port;

chrome.storage.local.get(function(result) {
  ip = result.ip;
  port = result.port;
});

function Connect(ip, port) {

let options = {
	transport: thrift.TBufferedTransport,
	protocol: thrift.TJSONProtocol,
	path: "/thrift/service/Api",
	https: false
};

	let connection = thrift.createHttpConnection(ip, port, options);

	connection.on("error", function(err) {
		console.log(err);
	});

	let client = thrift.createHttpClient(API, connection);

  return client;

}

function nodeTest() {

  if(global.nodeIP !== "undefined") {
    ip = global.nodeIP;
    port = global.nodePORT;
  }

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
    .then(async function(res) { // Node responds, check if synced, otherwise select different node via selectNode()
      let response = await Connect(ip, port).SyncStateGet();
      let curRound = convert(response.currRound.buffer);
      let lastBlock = convert(response.lastBlock.buffer);

      if((curRound-lastBlock) < 10 && curRound != 0) {
			  resolve(res);
      } else {
        console.log(ip + " not synchronized");
        selectNode()
        .then(function(r) {
          console.log("nodeTest.js selected node: " + r);
          global.nodeIP = r;
          global.nodePORT = 8081;
          chrome.storage.local.set({
            'ip': r,
            'port': 8081
          });
          resolve(r);
        });
      }
		})
    .catch(function(err) {
      console.log(err);
      console.log(ip + " unreachable, selecting new node");
			selectNode()
			.then(function(r) {
				console.log("nodeTest.js selected node: " + r);
				global.nodeIP = r;
        global.nodePORT = 8081;
        chrome.storage.local.set({
          'ip': r,
          'port': 8081
        });
				resolve(r);
			});
		})
    .finally(() => {
       clearTimeout(timeout);
    });
  });

}


module.exports = nodeTest;

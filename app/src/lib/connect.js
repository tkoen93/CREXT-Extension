const thrift = require('thrift');
const API = require('../gen-nodejs/API');

let ip;
let port;

chrome.storage.local.get(function(result) {
  ip = result.ip;
  port = result.port;
});

function Connect() {

let options = {
	transport: thrift.TBufferedTransport,
	protocol: thrift.TJSONProtocol,
	path: "/thrift/service/Api",
	https: false
};

if(global.nodeIP !== undefined) {
  ip = global.nodeIP;
  port = 8081;
}

	let connection = thrift.createHttpConnection(ip, port, options);

	connection.on("error", function(err) {
		console.log(err);
	});

	let client = thrift.createHttpClient(API, connection);

  return client;

}

module.exports = Connect;

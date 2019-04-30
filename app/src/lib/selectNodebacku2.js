const $ = require('jquery');
const AbortController = require('abort-controller');
const thrift = require('thrift');
const API = require('../gen-nodejs/API');
const convert = require("./convert");

let activeNodes = new Array();

async function selectNode() {

  let fetchResult;
  let promises = [];

	const result = await $.ajax({
		url: 'node.json',
		success: function(res) {
		//	console.log(res);
			for(let index in res) {
        var sendDate = (new Date()).getTime();
			  fetchResult = fetchAsync("http://"+res[index].ip+":8081/thrift/service/Api")
        .then(function(val) {
          var receiveDate = (new Date()).getTime();
          var responseTimeMs = receiveDate - sendDate;
          activeNodes.push([res[index].ip, responseTimeMs]);
        })
        .catch(function(val) {
        });
        promises.push(fetchResult);
			}
		}
	});

  Promise.all(promises).then(function(){
    return new Promise(function(resolve, reject) {
      syncState(activeNodes)
      .then(function(r) {
        console.log("YAY " + r);
        resolve(r);
      });
    })
    /*await syncState(activeNodes)
    .then(function(r) {
      console.log("RESULT " + r);
      console.log(r);
      return r;
    });*/
  });

}

function fetchAsync(url) {
		const controller = new AbortController();

		const timeout = setTimeout(
  		() => { controller.abort(); },
  		500,
		);

  return new Promise(function(resolve, reject) {
		const promise = fetch(
		  url,
		  {
				headers: {"Content-Type":"application/x-thrift"},
        body: "[1,\"SyncStateGet\",1,1,{}]",
		    method: 'POST',
		    signal: controller.signal
		  })
			.then(res => resolve(res))
		  .catch(err => reject(err.name + " " + url))
  	  .finally(() => {
    	   clearTimeout(timeout);
  	  });
	});

}

async function syncState(selectedNodes) {

  let options = {
    transport: thrift.TBufferedTransport,
    protocol: thrift.TJSONProtocol,
    path: "/thrift/service/Api",
    https: false
  };

  let syncedNodes = new Array();
  let completed = 0;
  let len = selectedNodes.length;
  let highestRound = 0;

  for(i=0;i<len;i++) {

    let ipNode = selectedNodes[i][0];
    let responseTime = selectedNodes[i][1];

    let connection = await thrift.createHttpConnection(ipNode, 8081, options);

    connection.on("error", function(err) {
       console.log("Error: " + err);
    });

    let client = await thrift.createHttpClient(API, connection);

    let response = await client.SyncStateGet();
      completed++;
      let curRound = convert(response.currRound.buffer);
      let lastBlock = convert(response.lastBlock.buffer);

      if(lastBlock > highestRound) {
        highestRound = curRound;
      }

      if((curRound-lastBlock) < 10 && curRound != 0) {
        syncedNodes.push([ipNode, responseTime, curRound, (curRound-lastBlock)]);
        console.log(ipNode + " is synced (" + (curRound-lastBlock) + ") MS: " + responseTime);
      } else {
        syncedNodes.push([ipNode, responseTime, lastBlock, (curRound-lastBlock)]);
        if(curRound === 0) {
          console.log(ipNode + " returns block 0, MS: " + responseTime);
        } else {
          console.log(ipNode + " is NOT synced (" + (curRound-lastBlock) + " blocks behind) MS: " + responseTime);
        }
      }

      if(completed === len) {
        let syncedNode = new Array();
        let complete = 0;
        let leng = syncedNodes.length;

        for(i=0;i<leng;i++) {
          let roundDif = highestRound-syncedNodes[i][2];

          if(roundDif < 10) {
            syncedNode.push([syncedNodes[i][0], syncedNodes[i][1], syncedNodes[i][3]]);
            console.log("accept " + syncedNodes[i][0]);
            complete++;
          } else {
            console.log("reject " + syncedNodes[i][0]);
            complete++;
          }

          if(complete === leng) {
            console.log(syncedNode);
        /*    chrome.storage.local.set({
      	  		'ip': syncedNode[0][0],
      				'port': 8081
      			});*/

        //    global.nodeIP = syncedNode[0][0];
        //    global.nodePORT = 8081;

            return syncedNode[0][0];

          }

        }

      }


  }



}

module.exports = selectNode;

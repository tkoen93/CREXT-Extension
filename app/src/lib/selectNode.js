const $ = require('jquery');
const extension = require('extensionizer');
const AbortController = require('abort-controller');
const thrift = require('thrift');
const API = require('../gen-nodejs/API');
const convert = require("./convert");
const LS = require('./ls');
const store = new LS('CREXT');

function selectNode(net = null) {

  $('.overlayNode').show();
  $('.overlayNodeContent').html("<img src=\"../img/loader.svg\"><br /><p style=\"color:white;\">Selecting node...</p>");

  let currentNet = store.getState() != undefined ? store.getState().n : 1;

  let publicFile;
  let localFile;

  if((net === null && currentNet === 0) || net === 0) { // TestNet
    publicFile = 'https://crext.io/nodetestnet.json?nocache=' + (new Date()).getTime();
    localFile = './node.json';
  } else if((net === null && currentNet === 1) || net === 1) { // CreditsNetwork
    publicFile = 'https://crext.io/nodemainnet.json?nocache=' + (new Date()).getTime();
    localFile = './nodemainnet.json';
  }

  if(net === null) {
    net = currentNet;
  }

  let activeNodes = new Array();

  return new Promise(async function(resolve, reject) {

    let completeRes = 0;
    let resultdata;

    try { // Try to access latest .json file on the internet first (actual node list)
      await $.ajax({
    		url: publicFile,
        timeout: 1000,
        success: function(result) {
          resultdata = result;
        }
      });
    } catch(e) { // If fails, use .json file included in extension as backup
      await $.ajax({
        url: localFile,
        success: function(result) {
          console.log(result);
          resultdata = result;
        }
      });
    }

    for(let index in resultdata) {
      var sendDate = (new Date()).getTime();
      fetchAsync("http://"+resultdata[index].ip+":8081/thrift/service/Api", 1000)
      .then(function(val) {
        var receiveDate = (new Date()).getTime();
        var responseTimeMs = receiveDate - sendDate;
        activeNodes.push([resultdata[index].ip, responseTimeMs]);
        completeRes++;
        if(completeRes === resultdata.length) {
          syncState(activeNodes, net)
          .then(function(r) {
            if(r === undefined) {
              global.nodeIP = undefined;
              extension.storage.local.set({
                'ip': ''
              });
              extension.runtime.sendMessage('update');
              $('.overlayNodeContent').html('<p style="color:white;">No active node found.</p><br />');
              if(currentNet === 0) {
                $('.overlayNodeContent').append('<p style="color:white;" id="selectNet" data-content="CreditsNetwork">Switch to <a href="#" style="color:white;text-decoration:underline;">CreditsNetwork</a></p>');
              } else {
                $('.overlayNodeContent').append('<p style="color:white;" id="selectNet" data-content="TestNet">Switch to <a href="#" style="color:white;text-decoration:underline;">TestNet</a></p>');
              }
            } else {
            extension.storage.local.set({
              'ip': r,
              'port': 8081
            });
            extension.runtime.sendMessage('update');
            global.nodeIP = r;
            $('.overlayNode').hide();
            resolve(r);
          }
          });
        }
      })
      .catch(function(val) {
        completeRes++;
        if(completeRes === resultdata.length) {
          syncState(activeNodes, net)
          .then(function(r) {
            if(r === undefined) {
              global.nodeIP = undefined;
              extension.storage.local.set({
                'ip': ''
              });
              extension.runtime.sendMessage('update');
              $('.overlayNodeContent').html('<p style="color:white;">No active node found.</p><br />');
              if(currentNet === 0) {
                $('.overlayNodeContent').append('<p style="color:white;" id="selectNet" data-content="CreditsNetwork">Switch to <a href="#" style="color:white;text-decoration:underline;">CreditsNetwork</a></p>');
              } else {
                $('.overlayNodeContent').append('<p style="color:white;" id="selectNet" data-content="TestNet">Switch to <a href="#" style="color:white;text-decoration:underline;">TestNet</a></p>');
              }
            } else {
            extension.storage.local.set({
              'ip': r,
              'port': 8081
            });
            extension.runtime.sendMessage('update');
            global.nodeIP = r;
            $('.overlayNode').hide();
            resolve(r);
          }
          });
        }
      });
    }

  });
}

async function fetchAsync(url, abortTime) {
  const controller = new AbortController();

  setTimeout(
  	() => { controller.abort(); },
  	abortTime,
  );

  return await fetch(
    url,
    {
  		headers: {"Content-Type":"application/x-thrift"},
      body: "[1,\"SyncStateGet\",1,1,{}]",
      method: 'POST',
      signal: controller.signal
    });
}

async function syncState(selectedNodes, net = null) {

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

  for(let i=0;i<len;i++) {

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

    let latestRoundData = (net === 1 && store.getState().m !== undefined) ? store.getState().m : (net === 0 && store.getState().t !== undefined) ? store.getState().t : 0;

    console.log(latestRoundData);


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
        console.log(ipNode + " is NOT synced (" + (curRound-lastBlock) + " blocks remaining) MS: " + responseTime);
      }
    }

    if(completed === len) {
      let syncedNode = new Array();
      let complete = 0;
      let leng = syncedNodes.length;

      for(i=0;i<leng;i++) {
        let roundDif = highestRound-syncedNodes[i][2];

        /* add latestrounddata compared to current round. when selecting testnet, never higher then latestrounddata mainnet */

        let difMainTest = 5000000;

        if(roundDif < 10 && syncedNodes[i][2] != 0) {
          syncedNode.push([syncedNodes[i][0], syncedNodes[i][1], syncedNodes[i][3]]);
          console.log("accept " + syncedNodes[i][0]);
          complete++;
        } else {
          console.log("reject " + syncedNodes[i][0]);
          complete++;
        }

        if(complete === leng) {
          if(syncedNode.length == 0) {
            //alert('No node found');
            return undefined;
          } else {
            if(net === 0) {
              store.putState({t: highestRound});
            } else if(net === 1) {
              store.putState({m: highestRound});
            }
            return syncedNode[0][0];
          }
        }
      }
    }
  }
}

module.exports = selectNode;

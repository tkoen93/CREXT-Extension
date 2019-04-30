function html() {
  let html = `<div id="ext" style="display:none">
      <div class="logo" id="logoSmall"><img src='../img/crext.png' /></div>
        <div id="balance" align="center" class="balance">
          <div id="balanceresult"></div>
          <div style="position:absolute;top:0px;left:290px;"><img src="../img/refresh.png" id="refreshBalance" alt="Refresh Balance" /></div>
        </div>
        <div class="keyLine row">
          <div class="pull-left" style="margin-left:20px;">Your public key</div>
          <div class="pull-right">
            <a href="#" data-toggle="popover" data-content="Export unencrypted keyfile" data-placement="right" name="exportkeyfile" id="exportkeyfile" style="margin-right:20px;color:#8EE1F1;border-bottom: 1px solid rgba(142, 225, 241, 0.4);">
                Export raw keyfile
            </a>
          </div>
        </div>
        <div class="form-group keyCopy">
          <div class="input-group" style="height:45px;margin-left:5px;">
            <a href="#" class="input-group-addon copyAddress" id="copy" style="width:40px;"><i class="far fa-clone fa-flip-vertical" style="color:#ECF2FF;"></i></a>
            <span id="copyKey" name="copyKey" class="input-group-addon inputPublicKey" style="width:395px;text-align:center;padding:0px;"></span>
          </div>
        </div>
      <div class="panel panel-default rounded80 txpanel" align="center" id="initialTX">
      <div class="panel-body" id="account">
      <div id="txerror"></div>
        <div class="form-group" style="height:75px;">
          <p class="header">Create transaction</p>
          <hr style="margin-top:25px;"/>
        </div>
        <div class="form-group" style="margin-top:-5px;">
             <input type="text" id="tokey" name="tokey" class="form-control createInput" placeholder="RECEIVER'S ADDRESS" style="height:50px;width:395px;margin-left:-1px;" required />
             <div id="tokeyError" style="display:none;position:absolute;top:340px;left:390px;">
               <p class="txerrortippy" id="tippytoKey" data-tippy-content=""><i class="fas fa-question-circle fa-2x" style="color:red;"></i></p>
             </div>
        </div>
        <div class="form-group" style="margin-top:20px;">
          <div style="float:left;width:187.5px;margin-left:4px;">
            <input type="text" id="tosend" name="tosend" class="form-control" placeholder="AMOUNT" style="height:50px;" required />
            <div id="tosendError" style="display:none;position:absolute;top:410px;left:187px;">
              <p class="txerrortippy" id="tippytoSend" data-tippy-content=""><i class="fas fa-question-circle fa-2x" style="color:red;"></i></p>
            </div>
          </div>
          <div style="float:left;width:187.5px;margin-left:20px;">
            <input type="text" id="maxfee" name="maxfee" class="form-control" placeholder="MAX FEE (IN CS)" style="height:50px;" required />
            <div id="maxfeeError" style="display:none;position:absolute;top:410px;left:390px;">
              <p class="txerrortippy" id="tippymaxfee" data-tippy-content=""><i class="fas fa-question-circle fa-2x" style="color:red;"></i></p>
            </div>
          </div>
        </div>
      </div>
      </div>
      <div class="form-group">
      <button type="button" name="createTX" id="createTX" class="btn btn-block btn-huge btn-tx btn-lg">CREATE TRANSACTION</button>
      </div>
      <!-- confirmtx -->
      <div class="panel panel-default rounded80 txpanel" align="center" id="confirmTX" style="display:none">
      <!-- confirmationtx -->
      <div class="panel-body" id="confirmTXinfo">
        <div class="form-group">
          <p class="header" style="margin-bottom:15px;">Confirm transaction</p>
          <hr />
        </div>
        <div class="row">
          <div class="confirmTitle">
            RECEIVER'S ADDRESS
          </div>
          <div class="confirmText" id="transactionto" style="margin-top:10px;">
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-xs-6">
            <div class="col-xs-12 confirmTitle left">
              AMOUNT
            </div>
            <div class="col-xs-12 left" style="margin-top:10px;">
              <p class="medium confirmsize" style="font-size:24px;color:#5e6368;" id="tosendto"></p> <p class="medium confirmsize" style="font-size:24px;color:#5e6368;">CS</p>
            </div>
          </div>
          <div class="col-xs-6">
            <div class="col-xs-12 confirmTitle left">
              MAX CS FEE
            </div>
            <div class="col-xs-12 left" style="margin-top:10px;">
              <p class="medium confirmsize" style="font-size:24px;color:#5e6368;" id="maxfeeto"></p> <p class="medium confirmsize" style="font-size:24px;color:#5e6368;">CS</p>
            </div>
          </div>
        </div>
      </div>
      <!-- /.confirmationtx -->
      <!-- confirmedtx -->
      <div class="panel-body" id="confirmedTX" style="display:none;">
        <div class="form-group" id="completed">
          <p class="complete" style="margin-bottom:15px;"><img src="../img/complete.png" /><br />Success</p>
          <hr />
        </div>
        <div class="row">
          <div class="confirmTitle">
            RECEIVER'S ADDRESS
          </div>
          <div class="confirmText" id="transactionto2" style="margin-top:0px;">
          </div>
        </div>
        <div class="row" style="margin-top:10px;">
          <div class="col-xs-6">
            <div class="col-xs-12 confirmTitle left">
              AMOUNT <p class="medium" style="font-size:12px;color:#5e6368;" id="tosendto2"></p> <p class="medium" style="font-size:12px;color:#5e6368;">CS</p>
            </div>
          </div>
          <div class="col-xs-6">
            <div class="col-xs-12 confirmTitle left">
              MAX CS FEE <p class="medium" style="font-size:12px;color:#5e6368;" id="maxfeeto2"></p> <p class="medium" style="font-size:12px;color:#5e6368;">CS</p>
            </div>
          </div>
        </div>
      </div>
      <!-- /.confirmedTX -->
      </div>
      <div class="form-group" id="confirmButtons" style="display:none">
      <div style="float:left;">
        <button type="button" name="resetTX" id="resetTX" class="btn btn-block btn-huge btn-resettx btn-lg" style="width:207.5px;"><p class="medium" style="font-size:14px;">RESET</p></button>
      </div>
      <div style="float:left;margin-left:15px;">
        <button type="button" name="sendTX" id="sendTX" class="btn btn-block btn-huge btn-tx btn-lg" style="width:207.5px;"><p class="medium" style="font-size:14px;">SEND TRANSACTION</p></button>
      </div>
      </div>
      <div class="form-group" id="completeButtons" style="display:none">
      <div style="float:left;">
        <button type="button" name="mainPage" id="mainPage" class="btn btn-block btn-huge btn-resettx btn-lg" style="width:207.5px;"><p class="medium" style="font-size:14px;">BACK TO MAIN PAGE</p></button>
      </div>
      <div style="float:left;margin-left:15px;">
        <button type="button" name="checkMonitor" id="checkMonitor" class="btn btn-block btn-huge btn-tx btn-lg" style="width:207.5px;"><p class="medium" style="font-size:14px;">CHECK ON MONITOR</p></button>
      </div>
      </div>
      <!-- /.confirmtx -->
	</div>`;
  return html;
}

module.exports = html;

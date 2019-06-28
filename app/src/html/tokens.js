function html() {
  let html = `<div id="ext" style="display:none">
  <div class="logo" id="logoSmall"><img src='../img/crext.png' /></div>
  <div class="panel panel-default rounded80 txhispanel" align="center" style="margin-top:-14px;margin-left:5px;">
    <div class="panel-body">

      <div class="form-group" style="height:75px;">
        <p class="header">Tokens</p>
        <hr style="margin-top:10px;"/>
      </div>

      <div class="form-group keyCopy">
        <div class="input-group" style="height:45px;width:391px;margin-left:-1px;margin-top:-30px;">
          <span class="input-group-addon inputPublicKey" style="width:358px;text-align:center;padding:0px;" id="selectedTokenAddress"><p id="selectedTokenAddress">Select token</p></span>
          <a href="#" class="input-group-addon copyAddress" id="dropdownToken" style="width:20px;"><i class="fas fa-angle-double-down" style="color:#ECF2FF;"></i></a>
        <ul class="dropdown" id="dropdownSelectToken" style="width:391px!important;max-height:260px!important;">
        </ul>
        </div>
      </div>

      <div class="form-group">
        <div class="jumbotron" id="tokenInformation" style="width:391px;height:60px;">
          <div style="margin-top:-11px;"><p class="small">Select a token first</p></div>
        </div>
      </div>

      <div id="initialTX">

        <div class="form-group" style="margin-top:-10px;">
          <p class="headerSmall">Create transaction</p>
          <hr style="margin-top:15px;"/>
        </div>

        <div class="form-group" style="margin-top:-5px;">
             <input type="text" id="tokey" name="tokey" class="form-control createInput" tabindex="1" placeholder="RECEIVER'S ADDRESS" style="height:50px;width:395px;margin-left:-1px;" required disabled/>
             <input type="hidden" value="" name="decimal" id="decimal"/>
             <input type="hidden" value="" name="ticker" id="ticker"/>
             <input type="hidden" value="" name="balance" id="balance"/>
             <input type="hidden" value="" name="hidTokenAddress" id="hidTokenAddress"/>
             <div id="tokeyError" style="display:none;position:absolute;top:342px;left:390px;">
               <p class="txerrortippy" id="tippytoKey" data-tippy-content=""><i class="fas fa-question-circle fa-2x" style="color:red;"></i></p>
             </div>
        </div>

        <div class="form-group" style="margin-top:10px;">
          <div style="float:left;width:187.5px;margin-left:4px;">
            <input type="text" id="tosend" name="tosend" class="form-control" tabindex="2" placeholder="AMOUNT" style="height:50px;" required disabled/>
            <div id="tosendError" style="display:none;position:absolute;top:407px;left:187px;">
              <p class="txerrortippy" id="tippytoSend" data-tippy-content=""><i class="fas fa-question-circle fa-2x" style="color:red;"></i></p>
            </div>
          </div>
          <div style="float:left;width:187.5px;margin-left:20px;">
            <input type="text" id="maxfee" name="maxfee" class="form-control" tabindex="3" placeholder="MAX FEE (IN CS)" style="height:50px;" required disabled/>
            <div id="maxfeeError" style="display:none;position:absolute;top:407px;left:390px;">
              <p class="txerrortippy" id="tippymaxfee" data-tippy-content=""><i class="fas fa-question-circle fa-2x" style="color:red;"></i></p>
            </div>
          </div>
        </div>

        <div class="form-group" style="margin-top:80px;margin-left:-5px;">
          <button type="button" name="createTX" id="createTX" class="btn btn-block btn-huge btn-tx btn-lg" style="width:395px!important" disabled>CREATE TRANSACTION</button>
        </div>

      </div>
      <div id="confirmTX" style="display:none">

        <div class="form-group" style="margin-top:-10px;">
          <p class="headerSmall">Confirm transaction</p>
          <hr style="margin-top:15px;"/>
        </div>

        <div class="row">
          <div class="confirmTitle">
            RECEIVER'S ADDRESS
          </div>
          <div class="confirmText" id="transactionto" style="margin-top:10px;">
          </div>
        </div>

        <hr style="margin-top:11px;"/>

        <div class="row">
          <div class="col-xs-6">
            <div class="col-xs-12 confirmTitle left">
              AMOUNT
            </div>
            <div class="col-xs-12 left" style="margin-top:10px;">
              <p class="medium confirmsize" style="font-size:24px;color:#5e6368;" id="tosendto"></p> <p class="medium confirmsize" id="confirmTicker" style="font-size:24px;color:#5e6368;"></p>
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

        <div class="form-group">
          <div style="float:left;">
            <button type="button" name="resetTX" id="resetTX" class="btn btn-block btn-huge btn-resettx btn-lg" style="width:185.5px;"><p class="medium" style="font-size:14px;">RESET</p></button>
          </div>
          <div style="float:left;margin-left:15px;">
            <button type="button" name="sendTX" id="sendTX" class="btn btn-block btn-huge btn-tx btn-lg" style="width:185.5px;"><p class="medium" style="font-size:14px;">SEND TRANSACTION</p></button>
          </div>
        </div>

      </div>
      <div id="confirmedTX" style="display:none">

        <div class="form-group" id="completed" style="margin-top:-32px;display:none">
          <svg class="checkIcon" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
          <circle class="path circle" fill="none" stroke="#2ac966" stroke-width="3" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1" />
            <polyline class="path check" fill="none" stroke="#2ac966" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 " />
          </svg>
          <p class="complete" style="margin-bottom:15px;">Success</p>
          <hr style="margin-top:7px;" />
        </div>

        <div class="form-group" id="failed" style="margin-top:-32px;display:none">
          <svg class="checkIcon" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
            <circle class="path circle" fill="none" stroke="#ec4652" stroke-width="3" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1" />
            <line class="path line" fill="none" stroke="#ec4652" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3" />
            <line class="path line" fill="none" stroke="#ec4652" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2" />
          </svg>
          <p class="failed" style="margin-bottom:15px;">Failed</p>
          <hr style="margin-top:7px;"/>
        </div>

        <div class="form-group" id="txLoader">
          <img src="../img/loader.svg" width="70" height="70" style="margin-top:-15px;">
          <hr />
        </div>

        <div id="sigError">
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
                AMOUNT <p class="medium" style="font-size:12px;color:#5e6368;" id="tosendto2"></p> <p class="medium" id="confirmTicker2" style="font-size:12px;color:#5e6368;"></p>
              </div>
            </div>
            <div class="col-xs-6">
              <div class="col-xs-12 confirmTitle left">
                MAX CS FEE <p class="medium" style="font-size:12px;color:#5e6368;" id="maxfeeto2"></p> <p class="medium" style="font-size:12px;color:#5e6368;">CS</p>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group" id="completeButtons" style="margin-top:10px;display:none">
          <div style="float:left;">
            <button type="button" name="mainPage" id="mainPage" class="btn btn-block btn-huge btn-resettx btn-lg" style="width:185.5px;"><p class="medium" style="font-size:14px;">BACK TO MAIN PAGE</p></button>
          </div>
          <div style="float:left;margin-left:15px;">
            <button type="button" name="checkMonitor" id="checkMonitor" class="btn btn-block btn-huge btn-tx btn-lg" style="width:185.5px;"><p class="medium" style="font-size:14px;">CHECK ON MONITOR</p></button>
          </div>
        </div>

        <div class="form-group" id="failButton" style="margin-top:10px;display:none">
        <div style="float:left;">
          <button type="button" name="failMainPage" id="failMainPage" class="btn btn-block btn-huge btn-resettx btn-lg" style="width:395px;"><p class="medium" style="font-size:14px;">RETURN</p></button>
        </div>
        </div>

      </div>

    </div>
  </div>
	</div>`;
  return html;
}

module.exports = html;

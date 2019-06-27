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
        <div class="input-group" style="height:45px;margin-left:4px;margin-top:-30px;">
          <span class="input-group-addon inputPublicKey" style="width:358px;text-align:center;padding:0px;"><p id="selectedToken">Select token</p></span>
          <a href="#" class="input-group-addon copyAddress" id="dropdownToken" style="width:20px;"><i class="fas fa-angle-double-down" style="color:#ECF2FF;"></i></a>
        <ul class="dropdown" id="dropdownSelectToken" style="width:391px!important">
        </ul>
        </div>
      </div>

      <div class="form-group">
        <div class="jumbotron" id="tokenInformation" style="width:391px;height:60px;">
          <div style="margin-top:-11px;"><p class="small">Select a token first</p></div>
        </div>
      </div>

      <div class="form-group" style="margin-top:-10px;">
        <p class="headerSmall">Create transaction</p>
        <hr style="margin-top:15px;"/>
      </div>

      <div class="form-group" style="margin-top:-5px;">
           <input type="text" id="tokey" name="tokey" class="form-control createInput" tabindex="1" placeholder="RECEIVER'S ADDRESS" style="height:50px;width:395px;margin-left:-1px;" required disabled/>
           <div id="tokeyError" style="display:none;position:absolute;top:340px;left:390px;">
             <p class="txerrortippy" id="tippytoKey" data-tippy-content=""><i class="fas fa-question-circle fa-2x" style="color:red;"></i></p>
           </div>
      </div>

      <div class="form-group" style="margin-top:10px;">
        <div style="float:left;width:187.5px;margin-left:4px;">
          <input type="text" id="tosend" name="tosend" class="form-control" tabindex="2" placeholder="AMOUNT" style="height:50px;" required disabled/>
          <div id="tosendError" style="display:none;position:absolute;top:410px;left:187px;">
            <p class="txerrortippy" id="tippytoSend" data-tippy-content=""><i class="fas fa-question-circle fa-2x" style="color:red;"></i></p>
          </div>
        </div>
        <div style="float:left;width:187.5px;margin-left:20px;">
          <input type="text" id="maxfee" name="maxfee" class="form-control" tabindex="3" placeholder="MAX FEE (IN CS)" style="height:50px;" required disabled/>
          <div id="maxfeeError" style="display:none;position:absolute;top:410px;left:390px;">
            <p class="txerrortippy" id="tippymaxfee" data-tippy-content=""><i class="fas fa-question-circle fa-2x" style="color:red;"></i></p>
          </div>
        </div>
      </div>

      <div class="form-group" style="margin-top:80px;margin-left:-5px;">
        <button type="button" name="createTX" id="createTX" class="btn btn-block btn-huge btn-tx btn-lg" style="width:395px!important" disabled>CREATE TRANSACTION</button>
      </div>

    </div>
  </div>
	</div>`;
  return html;
}

module.exports = html;

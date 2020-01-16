function html() {
  let html = `<div id="ext" style="display:none">
      <!-- confirmTX -->
      <span id="selectedNetTopInject" style="position:absolute;top:192px;left:192px;" class="label label-primary"></span>
      <div id="confirmTX">
        <div class="logoBigDapp" id="logoBigDapp" align="center"><img src="../img/crextl.png" /></div>
          <div class="panel panel-default rounded80 txdapp" align="center">
            <!-- txinfo -->
            <div class="panel-body" id="confirmTXinfo">
            <div class="divPhising" style="position:absolute;top:129px;left:330px;height:71px;width:125px;border-left: 1px solid #DDEBFA;">
              <p class="phising" id="showPhising"></p>
            </div>
                <div class="form-group" style="width:310px;float:left;margin-left:-16px;">
                  <p class="header" style="margin-bottom:15px;;">Create contract</p>
                </div>
                <hr style="margin-top:54px;"/>
                <div class="row">
                  <div class="confirmTitle left30" style="margin-right:20px;">
                    FROM
                  </div>
                  <div class="confirmText left30" id="from" style="margin-top:10px;">
                  </div>
                </div>
                <hr />
                <div class="row">
                  <div class="confirmTitle left30" style="margin-right:250px;">
                    TO
                  </div>
                  <div class="confirmText left30" id="to" style="margin-top:10px;">
                    Smart contract creation
                  </div>
                </div>
                <hr />
                <div class="row">
                  <div class="col-xs-6">
                    <div class="col-xs-12 confirmTitle left" align="left">
                      MAX CS FEE
                    </div>
                    <div class="col-xs-12 left" style="margin-top:10px;" align="left">
                      <p class="medium confirmsize" style="font-size:24px;color:#5e6368;" id="fee"></p> <p class="medium confirmsize" style="font-size:24px;color:#5e6368;">CS</p>
                    </div>
                  </div>
                </div>
              </div>
              <!-- ./txinfo -->
              <!-- txconfirm -->
              <div class="panel-body" id="confirmedTX" style="display:none;">
                <div class="form-group" id="completed" style="margin-top:-30px;display:none">
                <svg class="checkIcon" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                <circle class="path circle" fill="none" stroke="#2ac966" stroke-width="3" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1" />
                <polyline class="path check" fill="none" stroke="#2ac966" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 " />
                </svg>
                  <p class="complete" style="margin-bottom:15px;">Success</p>
                  <hr />
                </div>
                <div class="form-group" id="failed" style="margin-top:-30px;display:none">
                <svg class="checkIcon" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                <circle class="path circle" fill="none" stroke="#ec4652" stroke-width="3" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1" />
                <line class="path line" fill="none" stroke="#ec4652" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3" />
                <line class="path line" fill="none" stroke="#ec4652" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2" />
                </svg>
                  <p class="failed" style="margin-bottom:15px;">Failed</p>
                  <hr />
                </div>
                <div class="form-group" id="txLoader">
                <img src="../img/loader.svg" width="98" height="98">
                <hr />
                </div>
                <div class="row">
                  <div class="confirmTitle">
                    FROM
                  </div>
                  <div class="confirmText" id="transactionfrom2" style="margin-top:0px;">
                  </div>
                </div>
                <hr />
                <div class="row">
                  <div class="confirmTitle">
                    CONTRACT ADDRESS
                  </div>
                  <div class="confirmText" id="transactionto2" style="margin-top:0px;">
                    <img src="../img/loader.svg" width="16" height="16"> Generating contract address...
                  </div>
                </div>
                <hr />
                <div class="row" style="margin-top:10px;">
                  <div class="col-xs-12">
                    <div class="col-xs-12 confirmTitle left">
                      MAX CS FEE <p class="medium" style="font-size:12px;color:#5e6368;" id="maxfeeto2"></p> <p class="medium" style="font-size:12px;color:#5e6368;">CS</p>
                    </div>
                  </div>
                </div>
              </div>
              <!-- ./txconfirm -->
            </div>
        </div>
        <div class="form-group" id="confirmTXButtons" style="margin-top:0px;">
          <div style="float:left;">
            <button type="button" name="reject" id="reject" class="btn btn-block btn-huge btn-resettx btn-lg" style="width:207.5px;"><p class="medium" style="font-size:14px;">REJECT</p></button>
          </div>
          <div style="float:left;margin-left:15px;">
            <button type="button" name="confirm" id="confirm" class="btn btn-block btn-huge btn-tx btn-lg" style="width:207.5px;"><p class="medium" style="font-size:14px;">CONFIRM</p></button>
          </div>
        </div>
        <div class="form-group" id="closeButton" style="margin-top:0px;margin-left:0px;display:none;">
          <div style="float:left;">
            <button type="button" name="closewindow" id="closewindow" class="btn btn-block btn-huge btn-genkey btn-lg" style="width:435px;"><p class="medium" style="font-size:14px;">Close window</p></button>
          </div>
        </div>
        <div class="form-group" id="failButton" style="display:none">
        <div style="float:left;">
          <button type="button" name="failMainPage" id="failMainPage" class="btn btn-block btn-huge btn-resettx btn-lg" style="width:435px;"><p class="medium" style="font-size:14px;">Close window</p></button>
        </div>
        </div>
      <!-- /.confirmTX -->
	</div>`;
  return html;
}

module.exports = html;

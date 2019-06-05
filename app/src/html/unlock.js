function html() {
  let html = `<div id="ext" style="display:none">
		<div class="logoBig" id="logoBig" align="center"><img src="../img/crextl.png" /></div>
		<div id="firstpanel">
			<div class="panel panel-default rounded80 loginpanel" align="center">
				<div class="panel-body" id="loader">
        <div class="divPhising" style="position:absolute;top:279px;left:330px;height:71px;width:125px;border-left: 1px solid #DDEBFA;">
          <p class="phising" id="showPhising"></p>
        </div>
          <div class="form-group" style="width:310px;float:left;margin-left:-16px;">
            <p class="header" style="margin-bottom:15px;;">Unlock CREXT</p>
          </div>
          <hr style="margin-top:54px;"/>
						<div class="form-group" style="margin-top:10px;">
							<p style="color:#5e6368;" id="unlocktext">CREXT is locked due to inactivity. Please enter your password below to open the extension.</p>
						</div>
            <div class="form-group" style="margin-top:10px;">
              <input type="password" id="unlockpass" name="unlockpass" class="form-control createInput" placeholder="PASSWORD" style="height:40px;width:395px;margin-left:-1px;" required />
						</div>
					</div>
				</div>
				<div class="form-group">
					<button type="button" name="unlock" id="unlock" class="btn btn-block btn-huge btn-tx btn-lg">UNLOCK</button>
				</div>
		</div>
	</div>`;
  return html;
}

module.exports = html;

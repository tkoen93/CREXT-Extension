function html() {
  let html = `<div id="ext" style="display:none">
		<div class="logoBig" id="logoBig" align="center"><img src="../img/crextl.png" /></div>
		<div id="firstpanel">
			<div class="panel panel-default rounded80 loginpanel" align="center">
				<div class="panel-body">
					<div class="form-group">
						<p class="header" style="margin-bottom:15px;">Welcome!</p>
						<hr />
					</div>
						<div class="form-group" style="margin-top:20px;">
							<p style="color:#5e6368;">CREXT is a browser extension for the <a href="https://credits.com">Credits</a> blockchain.<br />
							CREXT is an easy way to store your Credits and <i>tokens</i> online. Easy dApp connection.<br />
							Press the button below to start setting up your wallet!</p>
						</div>
					</div>
				</div>
				<div class="form-group">
					<button type="button" name="getstarted" id="getstarted" class="btn btn-block btn-huge btn-tx btn-lg">GET STARTED</button>
				</div>
		</div>
		<div id="secondpanel" style="display:none">
			<div class="panel panel-default rounded80 loginpanel" style="height:277px;">
				<div class="form-group" style="margin-top:20px;margin-left:22px;">
					<div style="float:left;">
						<button type="button" name="importwallet" id="importwallet" class="btn btn-block btn-huge btn-genkey btn-lg" style="width:177.5px;height:235px;"><p class="medium" style="font-size:14px;">IMPORT WALLET</p></button>
					</div>
					<div style="float:left;margin-left:15px;">
						<button type="button" name="createwallet" id="createwallet" class="btn btn-block btn-huge btn-genkey btn-lg" style="width:177.5px;height:235px;"><p class="medium" style="font-size:14px;">CREATE WALLET</p></button>
					</div>
				</div>
			</div>
		</div>
	</div>`;
  return html;
}

module.exports = html;

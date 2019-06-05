function html() {
  let html = `<div id="ext" style="display:none">
      <div class="logo" id="logoSmall"><img src='../img/crext.png' /></div>
      <!-- confirmAccess -->
      <div class="panel-body" id="confirmAccess">
          <div class="panel panel-default rounded80 confirmAccessPanel" align="center">
            <div class="form-group" style="height:70px;">
              <p class="header" style="position:relative;top:17px;">Connect request</p>
            </div>
          <div class="row" style="position:relative;top:-15px;">
            <div style="float:left;margin-left:15px;" class="logoCustom" id="logo">
              <p>No logo<br>available</p>
            </div>
            <div style="float:left;" id="siteAddress" class="siteAddress">
              <p>https://credits.com</p>
            </div>
          </div>
          <div class="row">
            <p class="warning">This website will be able to see your public data </p>
          </div>
          <div class="row warningMessage">
            <p>This connection request aims to protect you from malicious websites.
              This site is requesting access to view public data on the Credits blockchain and to see your public key. Make sure you trust the sites you interact with.
            Your private key will always remain safe inside the extension.</p>
          </div>
          <div class="row" style="margin-top:52px;">
            <hr style="margin-left:15px;" />
            <p class="warning" style="text-decoration:underline;position:relative;top:-10px;">
              <a href="#" id="blockPermanent" style="color:red;"><i class="fas fa-ban fa-flip-horizontal"></i> Block this website from getting access permanently</a>
            </p>
          </div>
          <div class="row">
            <p class="revoke">You can always revoke access to this website on the settings page</p>
          </div>
        </div>
        </div>
        <div class="form-group" id="connectButtons" style="margin-top:-14px;display:none;">
          <div style="float:left;">
            <button type="button" name="cancel" id="cancel" class="btn btn-block btn-huge btn-resettx btn-lg" style="width:207.5px;"><p class="medium" style="font-size:14px;">CANCEL</p></button>
          </div>
          <div style="float:left;margin-left:15px;">
            <button type="button" name="connect" id="connect" class="btn btn-block btn-huge btn-tx btn-lg" style="width:207.5px;"><p class="medium" style="font-size:14px;">CONNECT</p></button>
          </div>
        </div>
      <!-- /.confirmAccess -->
	</div>`;
  return html;
}

module.exports = html;

function html() {
  let html = `<div id="ext" style="display:none">
  <div class="logo" id="logoSmall"><img src='../img/crext.png' /></div>
  <div class="panel panel-default rounded80 txhispanel" align="center" style="margin-top:-14px;margin-left:5px;">
    <div class="panel-body">
      <div class="form-group" style="height:75px;">
        <p class="header">Add wallet</p>
        <hr style="margin-top:25px;"/>
      </div>
      <div class="form-group" style="margin-left:-6px;">
        <button type="button" name="addMnemonic" id="addMnemonic" class="btn btn-block btn-huge btn-tx btn-lg" style="width:395px;"><p class="medium" style="font-size:14px;">USE MNEMONIC PHRASE</p></button>
      </div>
      <div class="strike">
        <span>OR</span>
      </div>
      <div class="form-group" style="margin-top:20px;"><p style="color:#5e6368;">Add wallet with plain private key. (Not recommended!)</p></div>
      <div class="form-group">
        <input type="text" id="addWalletPrivate" name="addWalletPrivate" class="form-control" placeholder="PRIVATE KEY" style="height:40px;width:395px;margin-left:-1px;" required />
        <p class="error" id="addWalletPrivateError"></p>
      </div>
      <div class="form-group" style="margin-left:-6px;">
        <button type="button" name="addPrivateKey" id="addPrivateKey" class="btn btn-block btn-huge btn-tx btn-lg" style="width:395px;"><p class="medium" style="font-size:14px;">USE PRIVATE KEY</p></button>
      </div>
  </div>
</div>
	</div>`;
  return html;
}

module.exports = html;

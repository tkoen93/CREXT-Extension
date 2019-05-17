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
  </div>
</div>
	</div>`;
  return html;
}

module.exports = html;

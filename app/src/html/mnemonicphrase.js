function html() {
  let html = `<div id="ext" style="display:none">
  <div class="logo" id="logoSmall"><img src='../img/crext.png' /></div>
  <div class="panel panel-default rounded80 txhispanel" align="center" style="height:420px;margin-top:-14px;margin-left:5px;overflow:hidden">
    <div class="panel-body">
      <div class="form-group" style="height:75px;">
        <p class="header">Secret Backup Phrase</p>
        <hr style="margin-top:25px;"/>
      </div>
      <div class="form-group" style="margin-top:5px;">
        <p align="left">Your secret backup phrase makes it easy to back up and restore your account.</p>
      </div>
      <div class="form-group">
        <p class="error" align="left">WARNING</p><p>: Never disclose your backup phrase. Anyone with this phrase can take your Credits forever.</p>
      </div>
      <div class="form-group">
        <p>Write this phrase on a piece of paper and store it in a secure location. If you want even more security, write it down on multiple pieces of paper and store each in different locations.</p>
      </div>
      <div class="form-group">
        <div class="jumbotron" id="seedphrase">
        </div>
      </div>
  </div>
</div>
<div class="form-group" style="margin-top:-1px;">
  <div style="float:left;">
    <button type="button" name="dl" id="dl" class="btn btn-block btn-huge btn-genkey btn-lg" style="width:202.5px;"><p class="medium" style="font-size:14px;">DOWNLOAD PHRASE</p></button>
  </div>
  <div style="float:left;margin-left:20px;">
    <button type="button" name="verifyseed" id="verifyseed" class="btn btn-block btn-huge btn-tx btn-lg" style="width:202.5px;"><p class="medium" style="font-size:14px;">NEXT</p></button>
  </div>
</div>
	</div>`;
  return html;
}

module.exports = html;

function html() {
  let html = `<div id="ext" style="display:none">
  <div class="logo" id="logoSmall"><img src='../img/crext.png' /></div>
  <div class="panel panel-default rounded80 txhispanel" align="center" style="margin-top:-14px;margin-left:5px;">
    <div class="panel-body">
      <div class="form-group" style="height:75px;">
        <p class="header">Confirm Backup Phrase</p>
        <hr style="margin-top:25px;"/>
      </div>
      <div class="form-group" style="margin-top:20px;">
        <p align="left">Please enter the requested phrase for verification</p>
      </div>
      <div class="form-group">
        <p class="error" align="left">WARNING</p><p>: Never disclose your backup phrase. Anyone with this phrase can take your Credits forever.</p>
      </div>
      <div class="form-group">
        <p>Write this phrase on a piece of paper and store it in a secure location. If you want even more security, write it down on multiple pieces of paper and store each in different locations.</p>
      </div>
      <div class="form-group jumbotron" id="seedphrase">
      </div>
      <div class="form-group" style="margin-top:-15px;">
        <button type="button" name="verify" id="verify" class="btn btn-block btn-huge btn-tx btn-lg" style="width:207.5px;"><p class="medium" style="font-size:14px;">VERIFY</p></button>
      </div>
  </div>
</div>
	</div>`;
  return html;
}

module.exports = html;

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
        <div style="float:left;width:187.5px;margin-left:4px;">
          <input type="text" id="w1" name="w1" class="form-control" placeholder="" style="height:50px;" required />
        </div>
        <div style="float:left;width:187.5px;margin-left:20px;">
          <input type="text" id="w2" name="w2" class="form-control" placeholder="" style="height:50px;" required />
        </div>
      </div>
      <div class="form-group" style="height:25px;">&nbsp;</div>
      <div class="form-group" style="margin-top:40px;">
        <div style="float:left;width:187.5px;margin-left:4px;">
          <input type="text" id="w3" name="w3" class="form-control" placeholder="" style="height:50px;" required />
        </div>
        <div style="float:left;width:187.5px;margin-left:20px;">
          <input type="text" id="w4" name="w4" class="form-control" placeholder="" style="height:50px;" required />
        </div>
      </div>
      <div class="form-group" style="height:40px;">&nbsp;</div>
      <div class="form-group" style="margin-top:50px;">
        <button type="button" name="verify" id="verify" class="btn btn-block btn-huge btn-tx btn-lg" style="width:395px;"><p class="medium" style="font-size:14px;">VERIFY</p></button>
      </div>
  </div>
</div>
	</div>`;
  return html;
}

module.exports = html;

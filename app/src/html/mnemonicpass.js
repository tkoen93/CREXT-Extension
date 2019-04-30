function html() {
  let html = `<div id="ext" style="display:none">
  <div class="logo" id="logoSmall"><img src='../img/crext.png' /></div>
  <div class="panel panel-default rounded80 txhispanel" align="center" style="margin-top:-14px;margin-left:5px;">
    <div class="panel-body">
      <div class="form-group" style="height:75px;">
        <p class="header">Create password</p>
        <hr style="margin-top:25px;"/>
      </div>
      <div class="form-group" style="margin-top:20px;">
        <input type="password" id="pass1" name="pass1" class="form-control text_field" placeholder="PASSWORD" style="height:50px;" required />
        <p class="error" id="pass1error"></p>
      </div>
      <div class="form-group">
        <input type="password" id="pass2" name="pass2" class="form-control text_field" placeholder="CONFIRM PASSWORD" style="height:50px;" required />
        <p class="error" id="pass2error"></p>
      </div>
      <div class="form-group">
        <input type="checkbox" id="cbx" style="display: none;" class="text_field">
        <label for="cbx" class="check">
          <svg width="18px" height="18px" viewBox="0 0 18 18">
            <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
            <polyline points="1 9 7 14 15 4"></polyline>
          </svg>
        </label>
        <label for="cbx" style="font-weight: normal"><p>I have read and agree to the Terms of Use</p></label>
      </div>
      <div class="form-group">
        <button type="button" name="createvault" id="createvault" class="btn btn-block btn-huge btn-tx btn-lg" style="width:207.5px;"><p class="medium" style="font-size:14px;">NEXT</p></button>
      </div>
      <div class="form-group">
        <p>Warning! Store this password somewhere safe. Without this password you will lose access to the extension.
        </p>
      </div>
  </div>
</div>
	</div>`;
  return html;
}

module.exports = html;

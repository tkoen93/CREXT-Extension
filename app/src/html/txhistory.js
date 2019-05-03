function html() {
  let html = `<div id="ext" style="display:none">
      <div class="logo" id="logoSmall"><img src='../img/crext.png' /></div>
      <div class="panel-body" id="txhis">
          <div class="panel panel-default rounded80 txhispanel" align="center">
          <div class="panel-body" id="tentx">
            <p class="header" style="position:relative;top:5px;">Transaction history</p>
            <div id="copyAddress" style="display:none;position:fixed;right:0;left:0;margin-right:auto;margin-left:auto;">
              <span class="label label-success" id="copyAddressSpan"></span>
            </div>
            <div id="txLoader" align="center" style="margin-top:100px;"></div>
            <table style="width:435px;margin-left:-16px;margin-top:-75px;">
              <tbody id="showtx">
              </tbody>
            </table>
          </div>
          <div id="txPaging" style="margin-top:6px;"></div>
        </div>

        </div>
	</div>`;
  return html;
}

module.exports = html;

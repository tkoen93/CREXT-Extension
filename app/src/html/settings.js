function html() {
  let html = `<div id="ext" style="display:none">
      <div class="logo" id="logoSmall"><img src='../img/crext.png' /></div>
      <div class="panel-body" id="txhis">
          <div class="panel panel-default rounded80 txhispanel settingsScroll" align="center">
          <div class="panel-body" id="settings">
            <p class="header" style="position:relative;top:5px;">Settings</p>
            <ul class="list-group" style="margin-top:20px;">
              <a href="#" class="list-group-item" id="openSetting" data-content="phising"><span class="badge" id="phisingBadge"><i class="fas fa-angle-down"></i></span>Anti phising</a>
              <li class="list-group-item" id="phising" style="display:none">Anti phising</li>
              <a href="#" class="list-group-item" id="openSetting" data-content="access"><span class="badge" id="accessBadge"><i class="fas fa-angle-down"></i></span>Access</a>
              <li class="list-group-item" id="access" style="display:none">Access</li>
              <a href="#" class="list-group-item" id="openSetting" data-content="exportData"><span class="badge" id="exportDataBadge"><i class="fas fa-angle-down"></i></span>Export data</a>
              <li class="list-group-item" id="exportData" style="display:none">Export data</li>
              <a href="#" class="list-group-item" id="openSetting" data-content="importData"><span class="badge" id="importDataBadge"><i class="fas fa-angle-down"></i></span>Import data</a>
              <li class="list-group-item" id="importData" style="display:none">Import data</li>
            </ul>
        </div>
        </div>
	</div>`;
  return html;
}

module.exports = html;

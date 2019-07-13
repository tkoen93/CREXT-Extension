function html() {
  let html = `<div id="ext" style="display:none">
      <div class="logo" id="logoSmall"><img src='../img/crext.png' /></div>
      <div class="panel-body" id="txhis">
          <div class="panel panel-default rounded80 txhispanel settingsScroll" align="center">
          <div class="panel-body" id="settings">
            <p class="header" style="position:relative;top:5px;">Settings</p>
            <ul class="list-group" style="margin-top:20px;">
              <a href="#" class="list-group-item" id="openSetting" data-content="phising"><span class="badge" id="phisingBadge"><i class="fas fa-angle-down"></i></span>Anti-Phishing code</a>
              <li class="list-group-item" id="phising" style="display:none">
                <div id="mesPhising"></div>
                <p>Current code: <div id="curPhising" style="display:inline;"></div></p>
                <div class="input-group">
                 <input type="text" id="newPhising" class="form-control" placeholder="Change Anti-Phishing code" style="z-index:0;">
                 <span class="input-group-btn">
                   <button class="btn btn-default" type="button" id="changePhising" style="z-index:0;">Change</button>
                 </span>
                </div>
                <p class="small">Please enter 4-16 non-special characters.</p>
              </li>
              <a href="#" class="list-group-item" id="openSetting" data-content="access"><span class="badge" id="accessBadge"><i class="fas fa-angle-down"></i></span>Approved websites</a>
              <li class="list-group-item" id="access" style="display:none"><ul class="list-group" id="accessList"></ul></li>
              <a href="#" class="list-group-item" id="openSetting" data-content="blockedData"><span class="badge" id="blockedBadge"><i class="fas fa-angle-down"></i></span>Blocked websites</a>
              <li class="list-group-item" id="blockedData" style="display:none"><ul class="list-group" id="blockedList"></ul></li>
              <a href="#" class="list-group-item" id="openSetting" data-content="ctokens"><span class="badge" id="ctokensBadge"><i class="fas fa-angle-down"></i></span>Tokens</a>
              <li class="list-group-item" id="ctokens" style="display:none">
              <div id="mesTokenContract"></div>
              <div class="input-group">
               <input type="text" id="addNewToken" class="form-control" placeholder="Contract address" style="z-index:0;">
               <span class="input-group-btn">
                 <button class="btn btn-default" type="button" id="addToken" style="z-index:0;">Add</button>
               </span>
              </div>
              <div>&nbsp;</div>
              <ul class="list-group" id="tokenList"></ul>
              </li>
            </ul>
        </div>
        </div>
	</div>`;
  return html;
}

module.exports = html;

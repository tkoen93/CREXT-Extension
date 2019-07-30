const extension = require('extensionizer');

function menu(n) {

  let thisVersion = extension.runtime.getManifest().version;

    document.getElementById('wrapper').innerHTML = '';

    let menuHTML = `<div class="overlay" id="overlay"></div><div class="overlayNode" id="overlayNode"><div class="overlayNodeContent"></div></div>
    <span id="selectedNetTop" style="display:none;position:absolute;top:28px;left:70px;" class="label label-primary"></span>

  	<!-- Sidebar -->
  	<nav class="navbar navbar-inverse navbar-fixed-top" id="sidebar-wrapper" role="navigation">
  			<ul class="nav sidebar-nav">
  					<li>
  							<a href="#" class="close">
  								 <i class="fas fa-times" style="font-size: 2rem;"></i>
  							</a>
                <div class="pull-right" style="margin-top:6px;margin-right:6px;" id="dropdownnet"><a href="#"><p id="selectedNet"></p> <i class="fas fa-caret-down"></i></a>
              <ul class="dropdownSelectNet">
              <li id="selectNet" data-content="CreditsNetwork"><a href="#">CreditsNetwork</a></li>
              <li id="selectNet" data-content="TestNet"><a href="#">TestNet</a></li>
              </ul></div>
  					</li>
  					<li id="openaccount" class="closeItem" style="margin-top:40px;">
  							<a href="#"><p>Account</p></a>
  					</li>
  					<li id="tokensIndex" class="closeItem">
  							<a href="#"><p>Tokens</p></a>
  					</li>
  					<li id="txhistory" class="closeItem">
  							<a href="#"><p>TX history</p></a>
  					</li>
  					<li id="settings" class="closeItem">
  							<a href="#"><p>Settings</p></a>
  					</li>
  					<li>
  						&nbsp;
  					</li>
            <li style="text-align:center;">
  							<button type="button" name="lockCrext" id="lockCrext" class="btn btn-warning" style="width:120px;"><p><i class="fas fa-lock"></i> Lock</p></button>
  					</li>
  					<li id="logout" style="text-align:center;margin-top:5px;">
  							<button type="button" name="logout" id="logout" class="btn btn-danger" style="width:120px;"><p><i class="fas fa-sign-out-alt"></i> Logout</p></button>
  					</li>
  			</ul>
  			<p class="navfooter">
  				<a href="https://www.credits.com" target="_blank">www.credits.com</a><br />
          <a href="https://crext.io" target="_blank">www.crext.io</a><br />
          v` + thisVersion + ` Beta
  			</p>
  	</nav><!-- /#sidebar-wrapper -->

  	<div id="page-content-wrapper">
  <button type="button" class="hamburger open-nav is-closed animated fadeInLeft" id="menu" style="display:none">
  	<span class="hamb-top"></span>
  	<span class="hamb-middle"></span>
  	<span class="hamb-bottom"></span>
  </button>
  			<div class="container" id="container">
  			</div><!-- /.container -->
  	</div><!-- /#page-content-wrapper -->

    <!-- The Modal -->
    <div id="myModal" class="modal">

      <!-- Modal content -->
      <div class="modal-content">
        <div class="modal-header">
          <span class="closeModal">&times;</span>
          <h3>Logout</h3>
        </div>
        <div class="modal-body">
          <p>Logging out of CREXT will destroy all data. You'll need your phrase to get access to your wallet.</p>
        </div>
        <div class="modal-footer" style="text-align:center;">
          <button type="button" name="goBackModal" id="goBackModal" class="btn btn-success" style="width:100px;"><p><i class="fas fa-undo-alt"></i> Go back</p></button>
          <button type="button" name="lockCrextModal" id="lockCrextModal" class="btn btn-warning" style="width:100px;"><p><i class="fas fa-lock"></i> Lock</p></button>
          <button type="button" name="logoutModal" id="logoutModal" class="btn btn-danger" style="width:100px;"><p><i class="fas fa-sign-out-alt"></i> Logout</p></button>
        </div>
      </div>

    </div>`;

    document.getElementById('wrapper').insertAdjacentHTML('beforeend', menuHTML);

}

module.exports = menu;

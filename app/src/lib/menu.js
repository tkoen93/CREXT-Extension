function menu(n) {

  if(n === 'show') {

    let menuHTML = `<div class="overlay" id="overlay"></div>

  	<!-- Sidebar -->
  	<nav class="navbar navbar-inverse navbar-fixed-top" id="sidebar-wrapper" role="navigation">
  			<ul class="nav sidebar-nav">
  					<li>
  							<a href="#" class="close">
  								 <i class="fas fa-times" style="font-size: 2rem;"></i>
  							</a>
  					</li>
  					<li id="openaccount" class="closeItem">
  							<a href="#"><p>Account</p></a>
  					</li>
  					<li id="tokens" class="closeItem">
  							<a href="#"><p style="text-decoration:line-through;">Tokens</p></a>
  					</li>
  					<li id="txhistory" class="closeItem">
  							<a href="#"><p>TX history</p></a>
  					</li>
  					<li id="settings" class="closeItem">
  							<a href="#"><p style="text-decoration:line-through;">Settings</p></a>
  					</li>
  					<li>
  						&nbsp;
  					</li>
  					<li id="logout" style="display:none" class="closeItem">
  							<button type="button" name="logout" id="logout" class="btn btn-danger" style="width:120px;"><p>Logout</p></button>
  					</li>
  			</ul>
  			<p class="navfooter">
  				<a href="https://www.credits.com" target="_blank">www.credits.com</a>
  			</p>
  	</nav><!-- /#sidebar-wrapper -->

  	<div id="page-content-wrapper">
  <button type="button" class="hamburger open-nav is-closed animated fadeInLeft" id="menu">
  	<span class="hamb-top"></span>
  	<span class="hamb-middle"></span>
  	<span class="hamb-bottom"></span>
  </button>
  			<div class="container" id="container">
  			</div><!-- /.container -->
  	</div><!-- /#page-content-wrapper -->`;

    document.getElementById('wrapper').insertAdjacentHTML('beforeend', menuHTML);

//    return menuHTML;


  } else {

    let menuHTML = `<div class="overlay" id="overlay"></div>

  	<!-- Sidebar -->
  	<nav class="navbar navbar-inverse navbar-fixed-top" id="sidebar-wrapper" role="navigation">
  			<ul class="nav sidebar-nav">
  					<li>
  							<a href="#" class="close">
  								 <i class="fas fa-times" style="font-size: 2rem;"></i>
  							</a>
  					</li>
  					<li id="openaccount" class="closeItem">
  							<a href="#"><p>Account</p></a>
  					</li>
  					<li id="tokens" class="closeItem">
  							<a href="#"><p style="text-decoration:line-through;">Tokens</p></a>
  					</li>
  					<li id="txhistory" class="closeItem">
  							<a href="#"><p>TX history</p></a>
  					</li>
  					<li id="settings" class="closeItem">
  							<a href="#"><p style="text-decoration:line-through;">Settings</p></a>
  					</li>
  					<li>
  						&nbsp;
  					</li>
  					<li id="logout" style="display:none" class="closeItem">
  							<button type="button" name="logout" id="logout" class="btn btn-danger" style="width:120px;"><p>Logout</p></button>
  					</li>
  			</ul>
  			<p class="navfooter">
  				<a href="https://www.credits.com" target="_blank">www.credits.com</a>
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
  	</div><!-- /#page-content-wrapper -->`;

    document.getElementById('wrapper').insertAdjacentHTML('beforeend', menuHTML);

//    return menuHTML;

  }

}

module.exports = menu;

const $ = require('jquery');

function check_field()
{
	var seed=$('#seedphrase').val();
	var pass1=$("#pass1").val();
	var pass2=$("#pass2").val();
	var checked=$('#cbx').is(':checked')
	var cont = false;


	if(pass1!= '' && pass1.length < 8) {
		$('#pass1error').text('Password not long enough');
	} else {
		if(pass2!= '' && pass1 != pass2) {
			$('#pass2error').text('Password don\'t match');
		} else {
			$('#pass2error').empty();
			cont = true;
		}
		$('#pass1error').empty();
	}



	if(seed!="" && pass1!="" && pass2!="" && checked==true && cont==true)
	{
		$("#importvault").prop( "disabled", false);
		return true;
	}
	else
	{
		$("#importvault").prop( "disabled", true);
		return false;
	}
}

module.exports = check_field;

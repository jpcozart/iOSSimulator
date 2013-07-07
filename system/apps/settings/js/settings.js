/****************************************
 *
 * settings.js
 * 
 * Created By Scott Robinson on 7/6/2013.
 *
 * Version: 1.1.0
 ****************************************
 * Javascript for the Settings app
 ****************************************/
$(document).ready(function () {
	Settings.Init();
});

var Settings = {
	Init: function () {
		$('a[href="#options"]').off('click').on('click', function () {Settings.GetSettings();});
	},
	GetSettings: function () {
		$.get('../../../config.xml', function (data) { //Open the config.xml file
			$(data).find('settings').each(function () {
				$('#option-background-color').val($(this).find('background > color').text());
				$('#option-background-image').val($(this).find('background > image').text());
				if($(this).find('startup > enabled').text() === "true") {
					$('#option-startup-enabled').prop("checked", true).checkboxradio('refresh');
				}
				if($(this).find('startup > splash > enabled').text() === "true") {
					$('#option-splash-enabled').prop('checked', true).checkboxradio('refresh');
				}
				$('#option-splash-image').val($(this).find('startup > splash > image').text());
				$('#option-password').val($(this).find('security > password').text());
				//$('#simulator-options-form').ajaxForm({success: function () {
				//	alert("Succes");
				//}, error: function () {
				//	alert("Error");
				//}});
				//$('#simulator-options-form').on('submit', function () {
				//	$.post("http://localhost:8000", {background : "green"});
				//	return false;
				//});
			});
		});
	},
	SetSettings: function () {

	},
	GetApps: function () {
		
	},
	SetApps: function () {
		
	}
};
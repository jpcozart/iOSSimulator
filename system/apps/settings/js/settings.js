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
$(document).bind('pageinit', function () {
	Settings.Init();
});

var Settings = {
	Init: function () {
		$('a[href="#options"]').off('click').on('click', function () {Settings.GetSettings();});
		$('a[href="#manage-apps"]').off('click').on('click', function () {Settings.GetApps();});
		//$('#manage-apps').bind('pageinit', function () {$('#manage-apps-list').listview('refresh');});
	},
	GetSettings: function () {
		$.get('../../../config.xml', function (data) { //Open the config.xml file
			$(data).find('settings').each(function () {
				var $this = $(this);
				$('#option-background-color').val($this.find('background > color').text());
				$('#option-background-image').val($this.find('background > image').text());
				if($this.find('startup > enabled').text() === "true") {
					$('#option-startup-enabled').prop("checked", true).checkboxradio('refresh');
				}
				if($this.find('startup > splash > enabled').text() === "true") {
					$('#option-splash-enabled').prop('checked', true).checkboxradio('refresh');
				}
				$('#option-splash-image').val($this.find('startup > splash > image').text());
				$('#option-password').val($this.find('security > password').text());
				$('#simulator-options-form').ajaxForm({success: function () {
					alert("Your options have been saved.");
					$.mobile.changePage('#settings');
				}, error: function () {
					alert("There was an error saving your changes.");
				}});
			});
		});
	},
	GetApps: function () {
		$('#manage-apps-list').empty();
		$.get('../../../config.xml', function (data) {
			$(data).find('app').each(function () {
				var $this = {}; 
				$this = $(this);
				$('#manage-apps-list').append(
					$('<li/>').append(
						$('<a/>').attr('href', "#app-settings").attr('data-id', $this.find('id').text()).html($this.find('title').text()).off('click').on('click', function () {GetAppDetail($(this).attr('data-id'));})
					)
				);
			});
		});
		$('#manage-apps-list').listview('refresh');
	},
	GetAppDetail: function (id) {
		
	}
};
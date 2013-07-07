//
// Mobile Simulator
//
// @author Scott Robinson
//
// Created April 19th 2013
//
///////////////////////////////////////

$(document).ready(function () {
	Simulator.Init();
});

var Simulator = {
	Init: function () {
		$('#home-button').off('click').on('click', function () {Simulator.Home();});
		Simulator.Home();
	},
	Home: function () {
		Simulator.ShowHomeScreen();
		Simulator.LoadBackground();
		var $apps = Simulator.LoadApps();
		$('#home-screen').empty().append($apps);
	},
	LoadBackground: function () {
		$.get('config.xml', function (data) {
			var $bg = $(data).find('background');
			if($bg.find('image').text() !== "") {
				$('#home-screen').css('background-image', "url('" + $bg.find('image').text() + "')");
			} else {
				$('#home-screen').css('background-color', $bg.find('color').text());
			}
		});
	},
	LoadApps: function () {
		var $apps = $('<ul/>').addClass('app-list');
		$.get('config.xml', function (data) { //Open the config.xml file
			$(data).find('app').each(function () { //find all apps
				if($(this).find('enabled').text() === "true") { //Only show apps if marked as enabled
					$apps.append(
						$('<li/>').addClass('app-item').append(
							$('<a/>').attr('data-loc', $(this).find('index').text()).append(
								$('<img/>').attr('src', $(this).find('icon').text()).addClass('app-icon'),
								$('<p/>').html($(this).find('title').text()).addClass('app-title')
							).off('click').on('click', function () {Simulator.StartApp($(this).attr('data-loc'));})
						)
					);
				}
			});
		});
		return $apps;
	},
	ShowHomeScreen: function () {
		$('#home-screen').removeClass('hidden');
		$('#simulator-screen').addClass('hidden').attr('src', "");
	},
	StartApp: function (url) {
			$('#simulator-screen').removeClass('hidden').attr('src', url);
			$('#home-screen').addClass('hidden');
	}
};
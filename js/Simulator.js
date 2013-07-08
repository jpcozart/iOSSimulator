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
		window.setInterval(function () {Simulator.LoadTopBar();}, 5000);
		var $apps = Simulator.LoadApps();
		$('#home-screen').remove('.app-list').append($apps);
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
		$.get('config.xml', function (data) {
			$(data).find('app').each(function () {
				$apps.append(
					$('<li/>').addClass('app-item').append(
						$('<a/>').attr('data-loc', $(this).find('index').text()).append(
							$('<img/>').attr('src', $(this).find('icon').text()).addClass('app-icon'),
							$('<p/>').html($(this).find('title').text()).addClass('app-title')
						).off('click').on('click', function () {Simulator.StartApp($(this).attr('data-loc'));})
					)
				);
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
	},
	LoadTopBar: function () {
		var d = new Date();
		var hour = d.getHours();
		var ap = "AM";
		if(hour === 0) {
			hour = 12;
		} else if(hour === 12) {
			ap = "PM";
		} else if(hour > 12) {
			hour = hour - 12;
			ap = "PM";
		}
		$('#time').html(hour + ":" + d.getMinutes() + ap);
	}
};
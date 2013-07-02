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
		$('#simulator-home-button').off('click').on('click', Simulator.Home);
		Simulator.Home();
	},
	Home: function () {
		//Load app icons
		alert("Home");
	}
};
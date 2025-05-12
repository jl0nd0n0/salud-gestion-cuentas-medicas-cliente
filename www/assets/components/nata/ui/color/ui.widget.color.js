/* globals  nata */

if (typeof nata.ui == "undefined") nata.ui = {};
if (typeof nata.ui.widget == "undefined") nata.ui.widget = {};

nata.ui.widget.color = {

	claseGet: function () {
		console.log("nata.ui.widget.color.claseGet");
		return "color-rojo";
	},

	strokeGet: function () {
		console.log("nata.ui.widget.color.strokeGet");
		return "stroke-rojo";
	},

	fillGet: function () {
		console.log("nata.ui.widget.color.fillGet");
		return "fill-rojo";
	}

};
/* global doT, nata, app */

nata.ui.template = {
    /* template: name id element string */
    /* data: data for template */
    render: function(template, data, append, ret) {
        //console.log("*** nata.ui.template.render ***");

        const element = this;

        if (typeof data == "undefined") {
            data = {};
        }

        if (typeof append == "undefined") {
            append = false;
        }

        if (typeof ret == "undefined") {
            ret = false;
        }
        //console.log(document.getElementById(template));
        const html = doT.template(document.getElementById(template).innerHTML)(data);

        if (ret) {
            return html;
        }

        if (append) {
            element.innerHTML +=  html;
        }
        else {
            /*
			if (this.getAttribute("id") == "sliderPlanes") {
				console.log(html);
			}
			*/
            element.innerHTML =  html;
        }

    },
    get: function(template, data) {
        if (app.config.dev.verbose.secundario) console.log("nata.ui.template.get");
        if (typeof data == "undefined") data = {};
        return doT.template(document.getElementById(template).innerHTML)(data);
    }
};

HTMLElement.prototype.render = nata.ui.template.render;
/* globals swal, app */

class nataUIMenuDropdown extends HTMLElement {

    constructor() {
        // Always call super first in constructor
        super();
        console.log("*** nataUIMenuDropdown ***");

        const self = this;
        let perfil = self.dataset.idPerfil;
        if (typeof perfil == "undefined") perfil = 0;

        if (self.dataset.idPerfil == "undefined") {
            document.getElementById("loader").style.display = "none";
            swal("Error de parametrización", "No se ha recibido el perfil del usuario", "error");
            return undefined;
        }

        // recuperar el menu
        /*
        let menu = app.config.menu["perfil"  + perfil].perfil.filter(function (record) {
            return record.idPerfil == perfil;
        });
        */
        let menu = app.config.menu["perfil"  + perfil];
        console.log(menu);

        if (menu.length == 0) {
            document.getElementById("loader").style.display = "none";
            swal("Error de parametrización", "No se ha creado en menú para el perfil: " + self.dataset.idPerfil + " en app.config.js", "error");
            return undefined;
        }

        //menu = menu[0].menu;
        //console.log(menu);
        const html = this.get(menu);
        self.innerHTML = html;

    }

    connectedCallback() {
    }

    get(menu) {
        console.trace("menu");
        console.log(menu);

        let i, html = `
			<div class="nata-ui-menu">
				<ul>
		`;

        for (i = 0; i < menu.length; ++i) {
            if (menu[i].type == "menu") {
                html += this.getMenu(menu[i].text, menu[i].icon, menu[i].onclick);
            }
            else {
                if (i == 0)
                    html += this.getSubmenu(menu[i]);
                else {
                    html += this.getSubmenu(menu[i]);
                }
            }
        }


        html += `
				</ul>
			</div>
		`;

        return html;
    }

    getMenu(text, icon, onclick, href) {
        let html = "";
        let anchor = text;

        if (typeof icon != "undefined") {
            anchor = `
				<img class="icon-button" src="assets/images/icons/${icon}" alt="">
			`;
        }
        if (typeof onclick != "undefined") {
            html += `
                    <li class="link" onclick="${onclick}">
                        <a href="javascript:void(0);">${anchor}</a>
                    </li>
            `;
        }
        else if (typeof href != "undefined") {
            html += `
                    <li class="link">
                        <a href="${href}" target="_new">${anchor}</a>
                    </li>
            `;
        }
        return html;
    }

    getSubmenu(menu) {
        //console.log(menu);

        let anchor = menu.text;
        if (typeof menu.icon != "undefined") {
            anchor = `
				<img class="icon-button" src="assets/images/icons/${menu.icon}" alt="">
			`;
        }

        let html = "";

        html += `
				<li>
					${anchor}
					<ul>
		`;

        let i;
        if (Array.isArray(menu.submenu)) {
            for (i = 0; i < menu.submenu.length; ++i) {
                if (menu.submenu[i].type == "menu") {
                    html += this.getMenu(menu.submenu[i].text, menu.submenu[i].icon, menu.submenu[i].onclick);
                }
                else {
                    html += this.getSubmenu(menu.submenu[i]);
                }
            }
        }

        html += `
					</ul>
				</li>
		`;

        return html;
    }
}

// Define the new element
customElements.define("nata-ui-menu-dropdown", nataUIMenuDropdown);
/* globals app, session, doT, nata */

app.usuario = {
    rol: {
        dataGet: function (idRol) {
            console.log("app.usuario.rol.dataGet");
            console.log(session.dataset.roles);

            if (idRol == 13) {
                const params = [
                    {
                        url: "x=soat&y=soportesDescarga",
                        index: "documentacion-soportes-descargar"
                    },
                    {
                        url: "x=soat&y=estadosGet",
                        index: "soat-estados"
                    },
                    {
                        url: "x=auditoria&y=get&z=" + session.user.i,
                        index: "auditoria",
                        callback: function (data) {
                            app.auditoria.index(data);
                        }
                    }
                ];
                nata.localStorage.load(app.config.server.php1, "json", params);
            }
        }
    },

    info: function () {
        if (app.config.dev.verbose.secundario) console.log("app.usuario.info");

        document.querySelectorAll(".user-nombre").forEach(function (element) {
            element.innerHTML = session.user.p + " " + session.user.n;
        });

        document.querySelectorAll(".user-cargo").forEach(function (element) {
            element.innerHTML = session.user.c;
        });

        const template = `
            <div class="w-100 text-center">
                {{? it.f !== ""}}
                <img class="d-inline-block user-info" src="assets/images/users/{{=it.f}}" alt=""><br>
                {{?}}
                <strong>
                    <span class="user-nombre">{{=it.un}}</span><br>
                </strong>
                <small><span class="user-cargo">{{=it.c}}</span></small>
            </div>
        `;

        window.tag = doT.template(template)(session.user);

        const elContainerUserDropDown = document.getElementById("containerDropdownUser");
        if (elContainerUserDropDown !== null) {
            elContainerUserDropDown.innerHTML = `
                <nata-ui-dropdown class="ms-4" 
                    data-animate="true"
                    data-text='<img class="icon-account" src="assets/images/icons/account-circle.svg" alt="">'
                    data-button="btn-white"
                    data-class="btn-circle"
                    data-class-panel="min-width-250px" 
                >
                </nata-ui-dropdown>
            `;
            return false;
        }

    }
};
/* global app, doT, $, nataUIDialog, session, swal, axios, nata */

app.core.busqueda.identificacionNombreV1 = function (title, url, callback) {
    console.log("app.core.busqueda.identificacionNombre");
    
    document.querySelector("#container").innerHTML = "";

    const template = `
        <form id="frmConsultar">
            <fieldset>
                <legend>Identificación Paciente</legend>
                <div class="mb-2">
                    <label for="selectTipoIdentificacion" class="form-label">
                        Tipo Identificación 
                        {{? app.config.dev.mode == true}}
                        <div class="float-end mb-1">
                            <span class="badge text-bg-terciary">CC</span>
                        </div>
                        {{?}}
                    </label>
                    <select id="selectTipoIdentificacion" class="form-select">
                        <option selected value="">Seleccionar Tipo Identificacion</option>
                        {{~ it.detail: d:id}}
                        <option value="{{=d.i}}">{{=d.n}}</option>
                        {{~}}
                    </select>
                </div>
                <div class="mb-2">
                    <label for="txtNumeroIdentificacion" class="form-label">Número Identificación 
                        {{? app.config.dev.mode == true}}
                        <div class="float-end mb-1">
                            <span class="badge text-bg-terciary copy-clipboard">1069052479</span>
                        </div>
                        {{?}}
                    </label>
                    <input id="txtNumeroIdentificacion" class="form-control ui-input-numerico" type="text" 
                        minlength="5" maxlength="20">
                </div>
            </fieldset>

            <fieldset>
                <legend>Nombre Afiliado</legend>
                <div class="mb-2">
                    <label for="txtPrimerNombre" class="form-label">Primer Nombre 
                        {{? app.config.dev.mode == true}}
                        <div class="float-end mb-1">
                            <span class="badge text-bg-terciary copy-clipboard">OMAIRA</span>
                        </div>
                        {{?}}
                    </label>
                    <input id="txtPrimerNombre" class="form-control" type="text" 
                        minlength="5" maxlength="40" >
                </div>
                <div class="mb-2">
                    <label for="txtSegundoNombre" class="form-label">Segundo Nombre 
                        {{? app.config.dev.mode == true}}
                        <div class="float-end mb-1">
                            <span class="badge text-bg-terciary copy-clipboard">MARCELA</span>
                        </div>
                        {{?}}
                    </label>
                    <input id="txtSegundoNombre" class="form-control" type="text" 
                        minlength="5" maxlength="40">
                </div>
                <div class="mb-2">
                    <label for="txtPrimerApellido" class="form-label">Primer Apellido 
                        {{? app.config.dev.mode == true}}
                        <div class="float-end mb-1">
                            <span class="badge text-bg-terciary copy-clipboard">ARIAS</span>
                        </div>
                        {{?}}
                    </label>
                    <input id="txtPrimerApellido" class="form-control" type="text" 
                        minlength="5" maxlength="40">
                </div>
                <div class="mb-2">
                    <label for="txtSegundoApellido" class="form-label">Segundo Apellido 
                        {{? app.config.dev.mode == true}}
                        <div class="float-end mb-1">
                            <span class="badge text-bg-terciary copy-clipboard">TOVAR</span>
                        </div>
                        {{?}}
                    </label>
                    <input id="txtSegundoApellido" class="form-control" type="text" 
                        minlength="5" maxlength="40">
                </div>
            </fieldset>

            <div class="mb-3 text-center">
                <button id="buttonSubmit" type="submit" class="btn btn-primary mb-3">Consultar</button>
            </div>
        </form>
    `;
    const oDialog = new nataUIDialog({
        height: 650,
        width: 425,
        html: doT.template(template)({detail: nata.localStorage.getItem("tipo-identificacion")}),
        title: "Consultar " + title,
        events: {
            render: function () {
            },
            close: function () {}
        }
    });

    const buttonSubmit = document.querySelector("#buttonSubmit");
    buttonSubmit.disabled = true;

    const fxUILogica = function (buttonSubmit) {
        if (
            document.querySelector("#selectTipoIdentificacion").value == "" && 
            document.querySelector("#txtNumeroIdentificacion").value == "" &&
            document.querySelector("#txtPrimerNombre").value == "" &&
            document.querySelector("#txtSegundoNombre").value == "" &&
            document.querySelector("#txtPrimerApellido").value == "" &&
            document.querySelector("#txtSegundoApellido").value == ""

        ) {
            buttonSubmit.disabled = true;
        }
        else if (
            document.querySelector("#selectTipoIdentificacion").value != "" && 
            document.querySelector("#txtNumeroIdentificacion").value != ""

        ) {
            buttonSubmit.disabled = false;
        }
        else {
            if (document.querySelector("#txtPrimerNombre").value != "" ) {
                buttonSubmit.disabled = false;
            }
            if (document.querySelector("#txtSegundoNombre").value != "" ) {
                buttonSubmit.disabled = false;
            }
            if (document.querySelector("#txtPrimerApellido").value != "" ) {
                buttonSubmit.disabled = false;
            }
            if (document.querySelector("#txtSegundoApellido").value != "" ) {
                buttonSubmit.disabled = false;
            }
        }
    };

    $("input.ui-input-numerico").inputfilter(
        {
            allowNumeric: true,
            allowText: false,
            actionLog: false,
            allowCustom: []
        }
    );

    document.querySelector("#selectTipoIdentificacion").addEventListener("change", function () {
        if (this.value !== "") {
            document.querySelector("#txtPrimerNombre").value = "";
            document.querySelector("#txtSegundoNombre").value = "";
            document.querySelector("#txtPrimerApellido").value = "";
            document.querySelector("#txtSegundoApellido").value = "";
        }
        fxUILogica(buttonSubmit);
    });

    document.querySelector("#txtNumeroIdentificacion").addEventListener("change", function () {
        if (this.value !== "") {
            document.querySelector("#txtPrimerNombre").value = "";
            document.querySelector("#txtSegundoNombre").value = "";
            document.querySelector("#txtPrimerApellido").value = "";
            document.querySelector("#txtSegundoApellido").value = "";
        }
        fxUILogica(buttonSubmit);
    });

    document.querySelector("#txtPrimerNombre").addEventListener("change", function () {
        if (this.value !== "") {
            document.querySelector("#selectTipoIdentificacion").value = "";
            document.querySelector("#txtNumeroIdentificacion").value = "";
        }
        fxUILogica(buttonSubmit);
    });

    document.querySelector("#txtSegundoNombre").addEventListener("change", function () {
        if (this.value !== "") {
            document.querySelector("#selectTipoIdentificacion").value = "";
            document.querySelector("#txtNumeroIdentificacion").value = "";
        }
        fxUILogica(buttonSubmit);
    });

    document.querySelector("#txtPrimerApellido").addEventListener("change", function () {
        if (this.value !== "") {
            document.querySelector("#selectTipoIdentificacion").value = "";
            document.querySelector("#txtNumeroIdentificacion").value = "";
        }
        fxUILogica(buttonSubmit);
    });

    document.querySelector("#txtSegundoApellido").addEventListener("change", function () {
        if (this.value !== "") {
            document.querySelector("#selectTipoIdentificacion").value = "";
            document.querySelector("#txtNumeroIdentificacion").value = "";
        }
        fxUILogica(buttonSubmit);
    });

    document.querySelector("#frmConsultar").addEventListener("submit", function (event) {
        event.preventDefault();
        event.stopPropagation();

        buttonSubmit.disabled = true;
        document.querySelector("#loader").style.display = "block";

        setTimeout(() => {
            const tipoIdentificacion = document.querySelector("#selectTipoIdentificacion").value;
            const numeroIdentificacion = document.querySelector("#txtNumeroIdentificacion").value;

            const primerNombre = document.querySelector("#txtPrimerNombre").value;
            const segundoNombre = document.querySelector("#txtSegundoNombre").value;
            const primerApellido = document.querySelector("#txtPrimerApellido").value;
            const segundoApellido = document.querySelector("#txtSegundoApellido").value;

            const dataSend = {};
            if (tipoIdentificacion != "") dataSend.t = tipoIdentificacion;
            if (numeroIdentificacion != "") dataSend.n = numeroIdentificacion;
            if (primerNombre != "") dataSend.pn = primerNombre;
            if (segundoNombre != "") dataSend.sn = segundoNombre;
            if (primerApellido != "") dataSend.pa = primerApellido;
            if (segundoApellido != "") dataSend.sa = segundoApellido;

            session.data = dataSend;

            axios.post(url, dataSend)
                .then(function (response) {
                    console.log(response.data);

                    if (response.data.length == 0) {
                        swal(app.config.title, "No se ha encontrado información de " + title, "success");
                        document.querySelector("#loader").style.display = "none";
                        return false;
                    }

                    callback(response.data, {button: buttonSubmit, dialog: oDialog});
                    document.querySelector("#loader").style.display = "none";
                }).catch(function (error) {
                    console.log(error);
                    document.querySelector("#loader").style.display = "none";
                });

        }, 1 * 1000);

    }, true);
};
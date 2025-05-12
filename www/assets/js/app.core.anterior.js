/* globals app, doT, session, nata, $, swal, localforage, Jets, nataUIFormBasic */

app.core = {
    busqueda: {
        identificacion:{XMLDocument
            index: function (title, url, callback, html = "", dialog = {}, element = {}) {
                console.log("app.core.busqueda.identificacion.index.index");
                
                document.querySelector("#container").innerHTML = "";

                const template = `
                    <form id="frmIdentificacionConsultar">
                        <fieldset>
                            <legend>Identificación Paciente</legend>
                            <div class="mb-2">
                                <label for="selectTipoIdentificacion" class="form-label">
                                    Tipo Identificación
                                </label>
                                <select id="selectTipoIdentificacion" class="form-select">
                                    <option selected value="">Seleccionar Tipo Identificacion</option>
                                    {{~ it.detail: d:id}}
                                    <option value="{{=d.i}}">{{=d.n}}</option>
                                    {{~}}
                                </select>
                            </div>
                            <div class="mb-2">
                                <label for="txtNumeroIdentificacion" class="form-label">Número Identificación</label>
                                <input id="txtNumeroIdentificacion" class="form-control" type="text" 
                                    minlength="5" maxlength="20">
                            </div>
                        </fieldset>

                        ${html}

                        <div class="mb-3 text-center">
                            <button id="buttonContinuar" type="submit" class="btn btn-primary mb-3" disabled>Consultar</button>
                        </div>
                    </form>
                `;
                oDialog = new nataUIDialog({
                    height: dialog.height ? dialog.height: 270,
                    width: 425,
                    html: doT.template(template)({detail: nata.localStorage.getItem("tipo-identificacion")}),
                    title: "Consultar " + title,
                    events: {
                        render: function () {},
                        close: function () {}
                    }
                });

                document.querySelector("#selectTipoIdentificacion").addEventListener("change", function () {
                    self.validator();
                    app.core.busqueda.identificacion.validator();
                    
                    
                });

                document.querySelector("#txtNumeroIdentificacion").addEventListener("change", function () {
                    self.validator();
                    app.core.busqueda.identificacion.validator();
                    
                });

                document.querySelector("#frmIdentificacionConsultar").addEventListener("submit", function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    document.querySelector("#loader").style.display = "block";

                    setTimeout(() => {
                        const tipoIdentificacion = document.querySelector("#selectTipoIdentificacion").value;
                        const numeroIdentificacion = document.querySelector("#txtNumeroIdentificacion").value;

                        oDialog.destroy();

                        const dataSend = {};
                        if (tipoIdentificacion != "") dataSend.t = tipoIdentificacion;
                        if (numeroIdentificacion != "") dataSend.n = numeroIdentificacion;

                        session.data = dataSend;

                        axios.post(url, dataSend)
                            .then(function (response) {
                                console.log(response.data);

                                if (response.data.length == 0) {
                                    document.querySelector("#loader").style.display = "none";
                                    swal(app.config.title, "No se ha encontrado información de " + title, "success");
                                    return false;
                                }

                                callback(response.data);
                                document.querySelector("#loader").style.display = "none";
                            }).catch(function (error) {
                                console.log(error);
                            });

                    }, 1 * 1000);

                }, true);
            }
        },
        identificacionNombre: function (title, url, callback) {
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
            oDialog = new nataUIDialog({
                height: 600,
                width: 425,
                html: doT.template(template)({detail: nata.localStorage.getItem("tipo-identificacion")}),
                title: "Consultar " + title,
                events: {
                    render: function () {
                    },
                    close: function () {}
                }
            });

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
            });

            document.querySelector("#txtNumeroIdentificacion").addEventListener("change", function () {
                if (this.value !== "") {
                    document.querySelector("#txtPrimerNombre").value = "";
                    document.querySelector("#txtSegundoNombre").value = "";
                    document.querySelector("#txtPrimerApellido").value = "";
                    document.querySelector("#txtSegundoApellido").value = "";
                }
            });

            document.querySelector("#txtPrimerNombre").addEventListener("change", function () {
                if (this.value !== "") {
                    document.querySelector("#selectTipoIdentificacion").value = "";
                    document.querySelector("#txtNumeroIdentificacion").value = "";
                }
            });

            document.querySelector("#txtSegundoNombre").addEventListener("change", function () {
                if (this.value !== "") {
                    document.querySelector("#selectTipoIdentificacion").value = "";
                    document.querySelector("#txtNumeroIdentificacion").value = "";
                }
            });

            document.querySelector("#txtPrimerApellido").addEventListener("change", function () {
                if (this.value !== "") {
                    document.querySelector("#selectTipoIdentificacion").value = "";
                    document.querySelector("#txtNumeroIdentificacion").value = "";
                }
            });

            document.querySelector("#txtSegundoApellido").addEventListener("change", function () {
                if (this.value !== "") {
                    document.querySelector("#selectTipoIdentificacion").value = "";
                    document.querySelector("#txtNumeroIdentificacion").value = "";
                }
            });

            document.querySelector("#frmConsultar").addEventListener("submit", function (event) {
                event.preventDefault();
                event.stopPropagation();

                document.querySelector("#loader").style.display = "block";

                setTimeout(() => {
                    //#region validar cliente
                    console.warn("No olvides agregar el condicional para validar el formulario en cliente ...");
                    //console.log("%c app.flujo.paciente.preRegistro.render ", "background: orange; color: #fff;font-size:12px");
                    if (document.querySelector("#selectTipoIdentificacion").value == ""
                        && document.querySelector("#txtNumeroIdentificacion").value == ""
                        && document.querySelector("#txtPrimerNombre").value == ""
                        && document.querySelector("#txtSegundoNombre").value == ""
                        && document.querySelector("#txtPrimerApellido").value == ""
                        && document.querySelector("#txtSegundoApellido").value == ""
                        ) {
                            const element = document.querySelector("#error");
                            element.innerHTML = "Ingresa los datos de consulta";
                            element.classList.remove("hide");
                            document.querySelector("#loader").style.display = "none";
                            return false;
                        }
                    //#endregion validar cliente

                    const tipoIdentificacion = document.querySelector("#selectTipoIdentificacion").value;
                    const numeroIdentificacion = document.querySelector("#txtNumeroIdentificacion").value;

                    const primerNombre = document.querySelector("#txtPrimerNombre").value;
                    const segundoNombre = document.querySelector("#txtSegundoNombre").value;
                    const primerApellido = document.querySelector("#txtPrimerApellido").value;
                    const segundoApellido = document.querySelector("#txtSegundoApellido").value;

                    oDialog.destroy();

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

                            callback(response.data);
                            document.querySelector("#loader").style.display = "none";
                        }).catch(function (error) {
                            console.log(error);
                            document.querySelector("#loader").style.display = "none";
                        });

                }, 1 * 1000);

            }, true);
        },
    
    },

    dialog: {
        close: function () {
            console.log("app.core.dialog.close");
            const elements = document.querySelectorAll(".ui-dialog");
            let i;
            for (i = 0; i < elements.length; i++) {
                elements[i].remove();
            }
        }
    },

    exit: function () {
        console.log("app.core.exit");
        swal({
            title: "Deseas Salir de Artemisa ?",
            text: "",
            icon: "warning",
            buttons: ["NO, cancelar", "SI, Cerrar"],
            dangerMode: true,
        }).then((response) => {
            if (response) {
                sessionStorage.clear();
                localStorage.clear();
                localforage.clear().then(function () {
                    location.reload(true);
                    if (session.width > 768) {
                        const elLayout = document.querySelector(".ui-layout-laptop");
                        if (elLayout !== null) elLayout.style.display = "none";
                    }
                    else {
                        const elLayout = document.querySelector(".ui-layout-mobile");
                        if (elLayout !== null) elLayout.style.display = "none";
                    }
                });
            }
        });
    }
};
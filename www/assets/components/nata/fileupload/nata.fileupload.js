/* globals $, app, session, swal, nata, Dropzone, nataUIDialog, doT */

/* recusos
	https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
	https://www.dropzonejs.com/
*/
// eslint-disable-next-line no-unused-vars
const api = {
    upload: {
        excel: {
            domiciliaria: {
                agendaDisponible: {
                    render: function () {
                        console.log("api.upload.excel.domiciliaria.agendaDisponible.render");

                        const element = document.getElementById("container");
                        element.innerHTML = `
							<form id="upload" class="dropzone" method="post" enctype="multipart/form-data">
								<span class="dz-message">Subir Agenda Disponible -> agenda-domiciliaria-dia.xlsx</span>
								<input type="hidden" name="etl" value="etlAgendaDomiciliariaDisponibleDia">
							</form>
						`;
                        element.style.display = "block";

                        const myDropzone = new Dropzone("#upload", {
                            url: "https://artemis.crescend.software/server/php/index.php/upload/domiciliariaDia",
                            parallelUploads: 12
                        });

                        myDropzone.on("error", function () {
                            swal("Error", "Por favor comunicate con Soporte Crescend", "error");
                            $("#container").empty();
                            document.getElementById("loader").style.display = "none";
                        });

                        myDropzone.on("sending", function () {
                            document.getElementById("loader").style.display = "block";
                        });

                        myDropzone.on("success", function (file, responseText) {
                            console.log(responseText);
                            $("#container").empty();
                            document.getElementById("loader").style.display = "none";
                            //api.upload.excel.callback(responseText, tipoConsulta);
                            console.log(responseText);
                            swal(app.config.title, "Se han cargado 7 registros", "success");
                        });

                        element.style.display = "block";
                    }
                }
            },
            pacientes: {
                sanitas: {
                    render: function (convenio) {
                        console.log("api.upload.excel.pacientes.sanitas.render");

                        session.upload.callback = function () {
                            //app.admin.pacientes.masiva.render();
                        };

                        const labelConvenio = convenio.replace(" ", "-").toLowerCase();
                        console.log(labelConvenio);

                        let url, etl;
                        if (labelConvenio == "sanitas-pqr") {
                            url = "https://artemis.crescend.software/server/php/index.php/upload/covidMasivaPacientes/sanitasPQR";
                            etl = "etlMasivaPaciente_sanitasPQR";
                        }
                        else {
                            url = "https://artemis.crescend.software/server/php/index.php/upload/covidMasivaPacientes/sanitas";
                            etl = "etlMasivaPaciente_" + convenio;
                        }

                        const element = document.getElementById("container");
                        element.innerHTML = `
							<nata-ui-fileupload
								data-title="Subir Masiva Pacientes ** ${convenio.toLowerCase()} ** (masiva-pacientes-${labelConvenio}.xlsx)"
								data-callback="api.upload.excel.callback"
								data-url="${url}"
								data-accept=".xlsx"
								data-etl="${etl}"
								data-param="${session.idConvenio}">
							</nata-ui-fileupload>
						`;
                        element.style.display = "block";
                    }
                }
            },
            teleconsulta: {
                agendaDisponible: {
                    // api.upload.excel.teleconsulta.agendaDisponible.render
                    render: function (tipoConsulta) {
                        console.log("api.upload.excel.teleconsulta.agendaDisponible.render");

                        const options = [
                            {
                                label: "Home",
                            },
                            {
                                label: "Covid - Teleconsulta",
                            },
                            {
                                label: "Agenda Médica"
                            },
                            {
                                label: "Cargar"
                            }
                        ];
                        document.getElementById("breadcrumb").render("templateBreadcrumb", { options: options });

                        //localforage.removeItem("teleconsulta-disponible-maestra");
                        //localforage.removeItem("teleconsulta-disponible");

                        const element = document.getElementById("container");

                        let sabados = 1, domingos = 1, festivos = 1;
                        session.data.sabados = 1;
                        session.data.domingos = 1;
                        session.data.festivos = 1;
                        session.data.param = session.date.d;

                        element.innerHTML = `
							<h6>Cargar Agenda Médica, mes: <span class="badge badge-primary">${session.mes.texto}</span><h6>
							<div class="w-100 container-upload p-3">
								<div class="form-check form-check-inline">
									<input id="checkboxSabados" class="form-check-input" type="checkbox" value="sabados" checked>
									<label class="form-check-label" for="inlineCheckbox1">Sábados</label>
								</div>
								<div class="form-check form-check-inline">
									<input id="checkboxDomingos" class="form-check-input" type="checkbox" value="domingos" checked>
									<label class="form-check-label" for="inlineCheckbox2">Domingos</label>
								</div>
								<div class="form-check form-check-inline">
									<input id="checkboxFestivos" class="form-check-input" type="checkbox" value="festivos" checked>
									<label class="form-check-label" for="inlineCheckbox3">Festivos</label>
								</div>
							</div>
							<form id="upload" class="dropzone" method="post" enctype="multipart/form-data">
								<span class="dz-message">Subir Agenda Disponible -> teleconsulta.xlsx</span>
								<input type="hidden" name="param" value="${session.date.d}">
								<input type="hidden" name="etl" value="etlTeleconsulta">
								<input id="inputHiddenSabados" type="hidden" name="sabados" value="${sabados}">
								<input id="inputHiddenDomingos" type="hidden" name="domingos" value="${domingos}">
								<input id="inputHiddenFestivos" type="hidden" name="festivos" value="${festivos}">
							</form>
						`;
                        element.style.display = "block";

                        $("#checkboxSabados")
                            .off()
                            .change(function () {
                                if (this.checked) {
                                    session.data.sabados = 1;
                                    document.getElementById("inputHiddenSabados").value = 1;
                                }
                                else {
                                    session.data.sabados = 0;
                                    document.getElementById("inputHiddenSabados").value = 0;
                                }
                            });

                        $("#checkboxDomingos")
                            .off()
                            .change(function () {
                                if (this.checked) {
                                    session.data.domingos = 1;
                                    document.getElementById("inputHiddenDomingos").value = 1;
                                }
                                else {
                                    session.data.domingos = 0;
                                    document.getElementById("inputHiddenDomingos").value = 0;
                                }
                            });

                        $("#checkboxFestivos")
                            .off()
                            .change(function () {
                                if (this.checked) {
                                    session.data.festivos = 1;
                                    document.getElementById("inputHiddenFestivos").value = 1;
                                }
                                else {
                                    session.data.festivos = 0;
                                    document.getElementById("inputHiddenFestivos").value = 0;
                                }
                            });

                        const myDropzone = new Dropzone("#upload", {
                            url: "https://artemis.crescend.software/server/php/index.php/upload/teleconsulta",
                            parallelUploads: 12
                        });

                        myDropzone.on("error", function () {
                            swal("Error", "Por favor comunicate con Soporte Crescend", "error");
                            $("#container").empty();
                            document.getElementById("loader").style.display = "none";
                        });

                        myDropzone.on("sending", function () {
                            document.getElementById("loader").style.display = "block";
                        });

                        myDropzone.on("success", function (file, responseText) {
                            console.log(responseText);
                            $("#container").empty();
                            document.getElementById("loader").style.display = "none";
                            api.upload.excel.callback(responseText, tipoConsulta);

                            app.core.ui.toolbar.render();
                            $("#buttonContinuar")
                                .off()
                                .click(function () {
                                    $(this).remove();

                                    const callback = function (response) {
                                        console.log(response);
                                        console.log(response[0].r);

                                        if (!Array.isArray(response)) {
                                            swal("Error 102029", "Por favor comunicate con Soporte Crescend", "error");
                                        }										
                                        else if (typeof response[0].msg != "undefined") {
                                            swal("Error", "Ya ha sido cargada la agenda para este mes", "error");
                                            return false;
                                        }
                                        else if (typeof response[0].r != "undefined") {
                                            swal("Agenda Profesional", "Se ha cargado la agenda", "success");
                                        }
                                        else {
                                            swal("Error 102030", "Por favor comunicate con Soporte Crescend", "error");
                                        }
                                    };
                                    app.agenda.teleconsulta.generar(callback);
                                });

                        });

                        element.style.display = "block";
                    }
                }
            },
            callback: function (data) {
                console.log("api.upload.excel.callback");
                console.log(data);

                if (data.length == 0) {
                    swal("No se han recibido datos !!", "Revisa el parametro etl en el custom element \nCorre el etl en el servidor", "error");
                    document.getElementById("loader").style.display = "none";
                    return false;
                }

                const element = document.getElementById("container");

                element.innerHTML = `
					<style>
						#console {
                            margin-bottom: 250px;
							padding: 10px;
							background: #0c0d0d;
							color: #ccc;
							font-size: 12px;
							font-family: courier;
						}
					</style>
					<div id="console" class="console scroll"></div>
					<br>
					<br>
					<br>
				`;
                element.style.display = "block";

                const elConsole = document.getElementById("console");

                let i;
                for (i = 0; i < data.length; ++i) {
                    elConsole.innerHTML += (data[i].i).replace("<br>", "") + "<br>";
                }
                const elDialog = document.querySelector(".ui-dialog");
                if (elDialog !== null) elDialog.remove();
                $("nata-ui-fileupload").remove();
                document.getElementById("loader").style.display = "none";
                elConsole.style.display = "block";

                if (typeof session.idAgenda == "undefined") session.idAgenda = "";
                if (session.idAgenda != "") {
                    $(".ui-container-toolbar").show();
                    $("#toolbar")
                        .html(`
							<button id="buttonContinuarCarga" type="button" class="btn btn-primary d-inline-block min-width-250px border-radius-30px">
                				Continuar
            				</button>
						`)
                        .show();

                    $("#buttonContinuarCarga")
                        .off()
                        .click(function () {
                            console.log("#buttonContinuarCarga.click");
                            //method, url, data, typeResponse, callback, callbackError
                            const callback = function (data) {
                                if (data[0].c == 0) {
                                    swal("No se han cargado datos de disponibilidad de la agenda", "Revisa el excel o por favor contacta a Soporte", "error");
                                    return false;
                                }
                                nata.ajax("post", app.config.server.php + "agenda/domiciliariaMaestraGenerar/", session.data, "json",
                                    function (data) {
                                        console.log(data);
                                        document.getElementById("container").innerHTML = "";
                                        $(this).remove();
                                        $(".ui-container-toolbar").hide();
                                        app.agenda.domiciliaria.agenda.render(session.idAgenda, undefined, true, false);
                                    },
                                    function (xmlhttp) {
                                        console.log(xmlhttp);
                                        swal("Error", xmlhttp.response, "error");
                                        return false;
                                    }
                                );
                            };
                            let callbackError = function () {
                                swal("102024 - Se ha presentado un error", "Por favor contacta a Soporte", "error");
                                return false;
                            };
                            const json = {
                                idAgenda: session.idAgenda,
                                year: session.year,
                                month: session.month
                            };
                            nata.ajax("post", app.config.server.php + "agenda/agendaDomiciliariaCantidadDisponibleGet/", json, "json", callback, callbackError);
                        });
                }

            },
            render: async function () {
                console.log("api.upload.excel.render");
            }
        },
        festivos: {
            callback: function (data) {
                console.log("api.upload.festivos.callback");
                const element = document.getElementById("container");
                element.innerHTML = `
					<style>
						#console {
                            margin-bottom: 250px;
							padding: 10px;
							background: #0c0d0d;
							color: #ccc;
							font-size: 12px;
							font-family: courier;
						}
					</style>
					<div id="console" class="console scroll"></div>
					<br><br><br>
				`;
                element.style.display = "block";

                const elConsole = document.getElementById("console");

                let i;
                for (i = 0; i < data.length; ++i) {
                    elConsole.innerHTML += (data[i].i).replace("<br>", "") + "<br>";
                }
                $("nata-ui-fileupload").remove();

                document.body.style.overflowY = "hidden";

            },
            render: function () {
                console.log("**** api.upload.festivos.render ****");
                const element = document.getElementById("container");
                element.innerHTML = `
					<nata-ui-fileupload data-callback="api.upload.festivos.callback"
						data-title="Subir festivos.xlsx"
						data-url="https://artemis.crescend.software/server/php/index.php/upload/festivos"
						data-accept=".xlsx"
						data-etl="etlFestivos">
					</nata-ui-fileupload>
				`;
                element.style.display = "block";
            }
        },
        finesSemana: {
            render: function () {
                console.log("**** api.upload.festivos.render ****");
                const element = document.getElementById("container");
                element.innerHTML = `
					<nata-ui-fileupload data-callback="api.upload.festivos.callback"
						data-title="Subir: fines-semana.xlsx"
						data-url="https://artemis.crescend.software/server/php/index.php/upload/finesSemana"
						data-accept=".xlsx"
						data-etl="etlFinesSemana">
					</nata-ui-fileupload>
				`;
                element.style.display = "block";
            }
        },
        product: {
            render: function () {
                console.log("api.upload.product.render");
                const element = document.getElementById("container");
                element.innerHTML = `
					<nata-ui-fileupload data-url="${app.config.shop.admin.upload.imageProducts}"
						data-accept=".png,.webp">
                    </nata-ui-fileupload>
				`;
                element.style.display = "block";
            }
        }
    }
};

class nataFileupload extends HTMLElement {
    constructor() {
        // Siempre llamar primero a super en el constructor
        super();
    }

    connectedCallback() {
        const self = this;
        self.render();
    }

    handleDrop(e) {
        console.log("handleDrop");
        let dt = e.dataTransfer;
        let files = dt.files;
        this.handleFiles(files);
    }

    handleFiles(files) {
        console.log("handleFiles");
        const self = this;

        // sabados
        if (document.getElementById("checkboxSabados") !== null) {
            if (document.getElementById("checkboxSabados").checked) {
                session.data.sabados = 1;
            }
            else {
                session.data.sabados = 0;
            }
        }

        // domingos
        if (document.getElementById("checkboxDomingos") !== null) {
            if (document.getElementById("checkboxDomingos") !== null) {
                if (document.getElementById("checkboxDomingos").checked) {
                    session.data.domingos = 1;
                }
                else {
                    session.data.domingos = 0;
                }
            }
        }

        // festivos
        if (document.getElementById("checkboxFestivos") !== null) {
            if (document.getElementById("checkboxFestivos") !== null) {
                if (document.getElementById("checkboxFestivos").checked) {
                    session.data.festivos = 1;
                }
                else {
                    session.data.festivos = 0;
                }
            }
        }

        session.data.year = session.year;
        session.data.month = session.month;
        session.data.idAgenda = parseInt(session.idAgenda);

        document.getElementById("nata-ui-filelist").innerHTML = "";
        if (document.getElementById("nata-fileupload-label") !== null) document.getElementById("nata-fileupload-label").style.display = "none";
        var i;
        for (i = 0; i < files.length; ++i) {
            self.uploadFile(files[i]);
            //PREVIEW
            //const element = document.getElementById("nata-ui-filelist");
            //this.previewFile(element, files[i]);
        }
        //([...files]).forEach(uploadFile)
    }

    uploadFile(file) {
        console.log("uploadFile");
        const self = this;
        console.log(self.dataset);
        let url = self.dataset.url;
        var xhr = new XMLHttpRequest();
        const formData = new FormData();
        xhr.open("POST", url, true);

        xhr.addEventListener("readystatechange", function () {
            //console.log(xhr.responseText, e);
            if (xhr.readyState == 4 && xhr.status == 200) {
                // Done. Inform the user
                if (typeof session.callback !== "undefined") {
                    if (nata.fx.json.isValid(xhr.responseText)) {
                        eval(session.callback + "(JSON.parse(xhr.responseText))");
                    }
                    document.getElementById("loader").style.display = "none";
                    $(".container-loader").hide();
                }

                console.log(session.upload.callback);
                if (typeof session.upload.callback == "function") {
                    session.upload.callback();
                }
                else {
                    console.log(xhr.responseText);
                    api.upload.excel.callback(JSON.parse(xhr.responseText));
                }
            }
            else if (xhr.readyState == 4 && xhr.status != 200) {
                // Error. Inform the user
                swal("Se ha presentado un error subiendo el archivo", "Por favor contacta a Soporte", "error");
                document.getElementById("loader").style.display = "none";
                console.log("Se ha limpiado #container");
            }
        });

        formData.append("filename", self.dataset.filename);
        formData.append("file", file);
        formData.append("idAgenda", self.dataset.idAgenda);

        if (typeof this.dataset.etl !== "undefined") {
            formData.append("etl", this.dataset.etl);
        }

        if (typeof this.dataset.param !== "undefined") {
            session.data.param = this.dataset.param;
            formData.append("param", this.dataset.param);
        }

        if (typeof this.dataset.ia !== "undefined") {
            session.data.ia = this.dataset.ia;
            formData.append("ia", this.dataset.ia);
        }

        // sabados
        if (document.getElementById("checkboxSabados") !== null) {
            if (document.getElementById("checkboxSabados").checked) {
                formData.append("sabados", 1);
                session.data.sabados = 1;
            }
            else {
                formData.append("sabados", 0);
                session.data.sabados = 0;
            }
        }

        // domingos
        if (document.getElementById("checkboxDomingos") !== null) {
            if (document.getElementById("checkboxDomingos").checked) {
                formData.append("domingos", 1);
                session.data.domingos = 1;
            }
            else {
                formData.append("domingos", 0);
                session.data.domingos = 0;
            }
        }

        // festivos
        if (document.getElementById("checkboxFestivos") !== null) {
            if (document.getElementById("checkboxFestivos").checked) {
                formData.append("festivos", 1);
                session.data.festivos = 1;
            }
            else {
                formData.append("festivos", 0);
                session.data.festivos = 0;
            }
        }

        console.log(session.year);
        console.log(session.month);

        if (typeof session.year !== "undefined") {
            session.data.year = session.year;
            formData.append("year", session.year);
        }
        
        if (typeof session.month !== "undefined") {
            session.data.month = session.month;
            formData.append("month", session.month);
        }

        if (typeof self.dataset.year !== "undefined") {
            formData.append("year", self.dataset.year);
        }

        if (typeof self.dataset.month !== "undefined") {
            formData.append("month", self.dataset.month);
        }

        xhr.send(formData);

    }

    previewFile(element, file) {
        console.log("previewFile", element, file);
        const self = this;

        const divDetail = document.createElement("div");
        divDetail.classList.add("nata-ui-filedetail");

        if (self.dataset.accept.includes(".xlsx")) {
            element.appendChild(divDetail);
            return false;
        }

        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            let img = document.createElement("img");
            img.src = reader.result;
            divDetail.appendChild(img);

            element.appendChild(divDetail);
        };
    }

    render() {
        const self = this;

        let label = "Subir archivo XLSX";

        if (typeof self.dataset.title !== "undefined") label = self.dataset.title;

        if (typeof self.dataset.mes !== "undefined") {
            self.uiMesRender();
        }
        else {

            if (typeof self.dialog !== "undefined") {
                self.dialog.destroy();
            }
            
            const html = `
                <style>
                    nata-ui-fileupload {
                        height: 100%;
                        min-width: 100%;
                        display: flex;
                        flex-direction: column;
                    }

                    .nata-ui-fileupload {
                        /*height: 100%;*/
                        overflow: hidden;
                        position: relative;
                        display: flex;
                        /*flex-direction: column;*/
                        /*border: 1px dashed #CCCCCC;*/
                        /*background-color: rgba(0,0,0,0.1);*/
                        font-size: 40px;
                        font-weight: bolder;
                        /*color: rgba(0,0,0,0.5);*/
                    }

                    .nata-ui-fileupload-label-button {
                        position: relative;
                        z-index: 4;
                        align-self: flex-start;
                        font-size: 14px;
                        font-weight: normal;
                        font-family: verdana;
                        padding: 7px 10px;
                        background: #00ABC7;
                        color: #fff;
                        border-radius: 2px;
                        border: 1px solid #37B7CC;
                        box-shadow: 0 1px 1px rgb(255 255 255 / 37%) inset, 1px 0 1px rgb(255 255 255 / 7%) inset, 0 1px 0 rgb(0 0 0 / 36%), 0 -2px 12px rgb(0 0 0 / 8%) inset;
                        margin: 10px;
                        cursor: pointer;
                    }
                    #nata-fileupload-label {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    input[type="file"] {
                        position: absolute;
                        top: 36px;
                        left: 20px;
                        height: 100%;
                        width: 100%;
                        line-height: 36px;
                        z-index: 3;
                        opacity: 0;
                    }
                    #nata-ui-filelist {
                        display: flex;
                        flex-direction: row;
                        flex-wrap: wrap;
                        flex-grow: 1;
                        padding: 0 5px 10px 5px;
                        overflow-y: auto;
                        position: relative;
                        z-index: 4;
                    }
                    .nata-ui-filedetail {
                        margin: 5px;
                        border: 1px dashed gray;
                        position: relative;
                        z-index: 4;
                        width: 150px;
                        height: 150px;
                        display: flex;
                        justify-content: center;
                    }
                    .nata-ui-filedetail img {
                        max-width: 100%;
                        max-height: 100%;
                    }
                </style>

                <div class="nata-ui-fileupload">
                    <div class="nata-ui-fileupload-label-button" id="btnFileUpload">${label}</div>
                    <form id="frmFileUpload" method="post" enctype="multipart/form-data">
                        <input id="nataFileUpload" title="file input" multiple="" type="file" name="nataFileupload"
                            accept="${self.dataset.accept}">
                    </form>
                    <!--
                    <div id="nata-fileupload-label">
                        Arrastra los archivos aqui
                    </div>
                    !-->
                    <div id="nata-ui-filelist">
                    </div>
                </div>
            `;

            self.innerHTML = html;

            session.callback = this.dataset.callback;
            session.agenda = this.dataset.agenda;
            session.idAgenda = this.dataset.ia;

            self.ondrop = this.handleDrop;
            const nataFileUpload = document.getElementById("nataFileUpload");

            nataFileUpload.onchange = function (event) {
                console.log("nataFileUpload.change", event.target.files);
                document.getElementById("loader").style.display = "block";
                const fileList = event.target.files;
                $(".container-loader").show();
                $("nata-ui-fileupload").hide();
                setTimeout(() => {
                    self.handleFiles(fileList);
                }, 0.1 * 1000);
            };

            document.getElementById("btnFileUpload").onclick = function () {
                console.log("btnFileUpload.click", nataFileUpload, nataFileUpload.onclick);
                nataFileUpload.click();
            };
        }
    }

    uiMesRender () {
        console.log("%c app.agenda.teleconsulta.cargar", "background: orange; color: #fff;");
        const self = this;

        $("#container-header").hide();

        let nextMonth = new Date().getMonth()+2;
        let nextYear = new Date().getFullYear();
        if (nextMonth == 13) {
            nextMonth = 1;
            nextYear += 1;
        }

        const session = {
            year: new Date().getFullYear(),
            month: new Date().getMonth()+1,
            monthText: app.config.calendario.mes[new Date().getMonth()+1]
        };

        const data = {
            idActual: new Date().getMonth(),
            actual: app.config.calendario.mes[new Date().getMonth()+1] + " " + new Date().getFullYear(),
            idSiguiente: nextMonth,
            siguiente: app.config.calendario.mes[nextMonth] + " " + nextYear
        };
        console.log(data);

        const template = `
            <h5>¿En qué mes vas a cargar la agenda?</h5>
            <div class="list-group">
                <label class="list-group-item cursor-pointer" data-id="{{=it.idActual}}" data-mes="{{=it.actual}}">
                    <input id="radioMes1" name="radioMes" class="form-check-input me-1" type="radio" data-id="{{=it.idActual}}" checked>
                    <span class="badge badge-primary-dark min-width-100px">{{=it.actual}}</span> Actual 
                </label>
                <label class="list-group-item cursor-pointer" data-id="{{=it.idSiguiente}}" data-mes="{{=it.siguiente}}">
                    <input id="radioMes2" name="radioMes" class="form-check-input me-1" type="radio" value="" data-id="{{=it.idSiguiente}}">
                    <span class="badge badge-primary-dark min-width-100px">{{=it.siguiente}}</span> Siguiente 
                </label>
            </div>
            <div class="w-100 text-center mt-2">
                <button id="buttonContinuarCarga" type="button" class="btn btn-primary d-inline-block min-width-250px">
                    Continuar
                </button>
            </div>
        `;

        const html = doT.template(template)(data);
        console.log(html);

        self.dialog = new nataUIDialog({
            height: 400,
            html: html,
            width: 360,
            title: "Selecciona el mes a cargar",
            events: {
                render: function () {
                },
                close: function () {}
            }
        });

        delete self.dataset.mes;

        document.querySelector("#buttonContinuarCarga").addEventListener("click", function () {
            swal({
                title: "Cargar Agenda Mes",
                text:  "Vas a cargar la agenda para el mes de " + session.monthText + " " + session.year + " \nDeseas continuar ?",
                icon: "warning",
                buttons: ["NO, voy a revisar", "SI, Continuar"],
                dangerMode: true,
            }).then((response) => {
                if (response) {
                    console.log(session);
                    self.dataset.year = session.year;
                    self.dataset.month = session.month;
                    self.render();
                }
            });
        });
    }
}

customElements.define("nata-ui-fileupload", nataFileupload);
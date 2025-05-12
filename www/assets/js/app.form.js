/* globals app, nata, session, $, localforage, nataUIForm,swal */

app.form = {

    init: function () {
        if (app.config.dev.verbose.core) console.log("%c app.form.init ", "background:blue;color:white;font-weight:bold;font-size:11px");
        session.form.idlocal = undefined;
        app.form.events = {};
        app.form.dataset.respuestas = [];
    },

    dataset: {
        respuestas: []
    },

    data: {
        delete: function (idFormulario) {
            if (app.config.dev.verbose.core) console.log("%c app.form.data.delete ", "background:blue;color:white;font-weight:bold;font-size:11px");

            // recuperar secciones
            const dataSecciones = app.form.secciones.get(idFormulario);
            console.log(dataSecciones);

            //eliminar completamente el formulario del localstorage
            let i;
            for (i = 0; i < dataSecciones.length; ++i) {
                localStorage.removeItem("form-" + idFormulario + (i + 1));
            }
        }
    },
    /*
		options = {
			index: "key localforage",
			attribute: atributo datos a filtrar
			id: valor atributo datos a filtrar,
			template: string template que se usa para hacer render de la lista
		};
	*/
    detail: {
        render: async function (options) {
            if (app.config.dev.verbose.core) console.log("%c app.form.detail.render ", "background:blue;color:white;font-weight:bold;font-size:11px");
            let data = await localforage.getItem(options.index);
            if (data === null) data = [];
            data = data.filter(function (record) {
                return record[options.attribute] == options.id;
            });
            document.getElementById("detail").render(options.template,
                {
                    id: options.id,
                    detail: data
                }
            );
        }
    },

    // events
    events: {},

    field: {

        divipola: {
            departamento: {
                change: function () {
                    console.log("app.form.field.divipola.departamento.change");

                    const this_ = this;
                    const id = this.dataset.id;
                    const value = this.value;

                    const selectMunicipio = document.getElementById("selectMunicipio-" + id);
                    var html = "<option value=\"\">Seleccione Municipio</option>";
                    var i;
                    if (value != "") {
                        const dataMunicipios = app.adapter.divipola.municipio.get(this_.value);
                        console.log(dataMunicipios);
                        for (i = 0; i < dataMunicipios.length; ++i) {
                            html += `<option value="${dataMunicipios[i].i}">${dataMunicipios[i].m}</option>`;
                        }
                    }
                    selectMunicipio.innerHTML = html;

                    if (value == "11") {
                        selectMunicipio.value = "11001";
                        $("#selectMunicipio-" + id).trigger("change");
                    }
                }
            }
        },

        save: function (element, id, value) {
            if (app.config.dev.verbose.core) console.log("%c app.form.field.save ", "background:orange;color:white;font-weight:bold;font-size:11px");
            console.trace("app.form.field.save");
            //console.log(element);
            if (typeof id === "undefined") id = element.dataset.id;
            if (typeof value === "undefined") value = element.value;
            let i;
            for (i = 0; i < session.form.fields.length; ++i) {
                if (session.form.fields[i].c == id) {
                    //console.log(session.form.fields[i].tr.toString().trim());
                    if (session.form.fields[i].tr.toString().trim() == "tension-arterial") {
                        session.form.fields[i].response = {};
                        session.form.fields[i].response.s = document.getElementById("control-" + id + "-1").value;
                        session.form.fields[i].response.d = document.getElementById("control-" + id + "-2").value;
                        console.log(session.form.fields[i].response);

                    }
                    else if (session.form.fields[i].tr.toString().trim() == "altura") {
                        session.form.fields[i].response = {
                            m: document.getElementById("control-" + id + "-1").value,
                            c: document.getElementById("control-" + id + "-2").value
                        };

                    }
                    else if (session.form.fields[i].tr.toString().trim() == "divipola") {
                        session.form.fields[i].response = {};
                        session.form.fields[i].response.d = document.getElementById("selectDepartamento-" + id).value;
                        session.form.fields[i].response.m = document.getElementById("selectMunicipio-" + id).value;
                        console.log(session.form.fields[i].response);
                    }
                    else if (session.form.fields[i].tr.toString().trim() == "texto-divipola") {
                        session.form.fields[i].response = {};
                        session.form.fields[i].response.v = document.getElementById("control-" + id).value;
                        session.form.fields[i].response.d = document.getElementById("selectDepartamento-" + id).value;
                        session.form.fields[i].response.m = document.getElementById("selectMunicipio-" + id).value;
                    }
                    else {
                        session.form.fields[i].response = value;
                        //console.log(session.form.fields);
                    }

                    break;
                }
            }
        },

        validate: {
            minmax: function (element) {
                console.log("app.form.field.validate.minmax");
                console.log(element);
                console.log(element.dataset);

                let label = document.getElementById("control-" + element.dataset.id + "-label");

                console.log(element.getAttribute("required"));
                console.log(element.value.toString().trim());

                let retorno;
                let paso;

                console.log("paso 01");
                if (element.getAttribute("required") == null && element.value.toString().trim().length == 0) {
                    console.log("paso 02");
                    label.classList.add("d-none");
                    element.classList.remove("invalid");
                    return true;
                }

                // inputs type text
                const fxCheck = function (element, label) {
                    if (element.value.toString().length < element.getAttribute("minlength")) {
                        label.innerHTML = "El campo debe contener mínimo " + element.getAttribute("minlength") + " caracteres";
                        retorno = false;
                        paso = 2;
                    }

                    if (element.value.toString().length > parseFloat(element.getAttribute("maxlength"))) {
                        label.innerHTML = "El campo debe contener máximo " + element.getAttribute("maxlength") + " caracteres";
                        retorno = false;
                        paso = 3;
                    }
                };

                if (element.getAttribute("type") == null) {
                    console.log("paso 03");
                    fxCheck(element, label);
                }
                else {
                    console.log("paso 04");
                    if (element.getAttribute("type") == "text") {
                        fxCheck(element, label);
                    }

                    if (element.getAttribute("type") == "number") {
                        if (parseFloat(element.value) < element.getAttribute.min) {
                            console.log("paso 05");
                            label.innerHTML = "El valor mínimo permitido es " + element.getAttribute.min;
                            retorno = false;
                            paso = 4;
                        }

                        if (parseFloat(element.value) > parseFloat(element.getAttribute.max)) {
                            console.log("paso 06");
                            label.innerHTML = "El valor máximo permitido es " + element.getAttribute.min;
                            retorno = false;
                            paso = 5;
                        }
                    }
                }

                if (typeof paso == "undefined") paso = 6;
                if (typeof retorno == "undefined") retorno = true;

                if (retorno) {
                    label.classList.add("d-none");
                    element.classList.remove("invalid");
                }
                else {
                    label.style.display = "block";
                    label.classList.remove("d-none");
                    element.classList.add("invalid");
                    document.getElementById("buttonNext").disabled = true;
                }
                console.log(retorno, paso);	
                return retorno;
            }
        }
    },

    layout: {
        // index: indice con el que se guardó la data en el sessionStorage
        render: function (idForm, idSection, title, subtitle, callback, options = {}, events = {}, class_ = "", respuestas = {}) {
            if (app.config.dev.verbose.core) console.log("%c app.form.layout.render ", "background:blue;color:white;font-weight:bold;font-size:11px");
            if (typeof events !== "undefined") app.form.events = events;
            if (typeof options.toolbar == "undefined") options.toolbar = true;
            if (typeof options.buttonNextLabel == "undefined") options.buttonNextLabel = "";

            console.log(options);

            const dataLayout = {
                formName: title,
                subtitle: subtitle,
                toolbar: options.toolbar,
                buttonNextLabel: options.buttonNextLabel,
                class: class_
            };
            let html = nata.ui.template.get("templateFormLayout", dataLayout);
            // reemplazar variables
            html = app.core.vars.replace(html);
            const element = document.getElementById("container");
            element.innerHTML = html;
            element.style.display = "none";

            let dataSecciones = app.form.secciones.get(idForm);
            //console.log(dataSecciones);
            // cuando es carga de masiva 
            if (idForm == 3 && session.paciente.masiva == 1) {
                dataSecciones = dataSecciones.filter(function (record) {
                    return record.indexOf("Admisión") == -1;
                });
                session.form.sections = dataSecciones;
                session.form.maxSection = dataSecciones.length;
            }
            else {
                session.form.sections = dataSecciones;
                session.form.maxSection = dataSecciones.length;
            }
            //alert(session.form.maxSection);
            let fxCallback;
            if (session.form.maxSection == 1) {
                fxCallback = async function () {
                    if (typeof callback === "function") callback();
                    $("#buttonPrevious").remove();
                    if (options.buttonNextLabel == "") $("#buttonNext").html("Cerrar");
                };
            }
            else {
                fxCallback = async function () {
                    callback();
                };
            }
            app.form.render(idForm, idSection, fxCallback, options, respuestas, events);

        }
    },

    render: function (idForm, idSection, callback, options = {}, respuestas = {}, events = {}) {
        console.trace("%c app.form.render ", "background:orange;color:white;font-weight:bold;font-size:11px");
        session.flujo.push("app.form.render");
        console.trace("app.form.render");
        console.log(idForm, idSection);
        app.form.valid = false;

        if (session.form.section == 1) {
            if (typeof session.form.idlocal == "undefined") {
                session.form.idlocal = new Date().getTime();
            }
        }

        //#region code

        // si ya ha sido guardado el formulario, se trae de localstorage
        if (typeof options.indexLocalStorage !== "undefined") {
            console.log(options.indexLocalStorage);
            session.form.fields = nata.localStorage.getItem(options.indexLocalStorage);
            //console.log(session.form.fields);
        }
        else {
            session.form.fields = nata.localStorage.getItem("form-" + idForm + "-" + idSection);
            //console.log(session.form.fields);
        }

        //console.log(nata.localStorage.getItem("jorge"));
        //console.log(data);
        if (session.form.fields.length == 0) {
            // no habian respuestas
            // TODO: revisar si se elimina el sessionStorage
            session.form.fields = nata.localStorage.getItem("form-" + idForm);
        }

        console.log(respuestas);
        if (Object.keys(respuestas).length > 0) {
            let i, prop;
            for (i = 0; i < session.form.fields.length; ++i) {
                if (session.form.fields[i].atr == "") {
                    continue;
                }
                for (prop in respuestas) {
                    if (Object.prototype.hasOwnProperty.call(respuestas, prop)) {
                        //console.log(session.form.fields[i].atr, prop, session.form.fields[i].atr == prop);
                        if (session.form.fields[i].atr == prop) {
                            //console.log("paso 03");
                            session.form.fields[i].response = respuestas[prop];
                            break;
                        }
                    }
                }
            }
            console.log(session.form.fields);
        }
        session.form.fields = session.form.fields.filter(function (record) {
            return (parseInt(record.is) == parseInt(idSection));
        });
        console.log(session.form.fields);
        
        // asignar respuesta lógica ui
        let temporal = {
            idForm: idForm,
            apuntador: session.form.section,
            fields: session.form.fields
        };
        console.log(temporal);
        //console.log(session.form.fields);
        document.getElementById("containerForm").render("templateForm", temporal, false);
        window.scrollTo(0, 0);
        document.getElementById("container").style.display = "inline-block";

        if (typeof app.form.events.render == "function") {
            app.form.events.render();
        }

        //#endregion code

        //#region EVENTOS 

        // personalizados
        //#region personalizados
        if (idForm >= 96 && idForm <= 99) {
            //#region tensión arterial
            $("#containerForm .tension-arterial")
                .on("change", function () {
                    console.log(".tension-arterial.change");
                    const id = this.dataset.id;
                    const self = this;

                    if (self.classList.contains("tension-arterial-sistolica")) {
                        session.historiaClinica.tensionArterial.s = self.value;
                    }

                    if (self.classList.contains("tension-arterial-diastolica")) {
                        session.historiaClinica.tensionArterial.d = self.value;
                    }

                    if (typeof session.historiaClinica.tensionArterial.s !== "undefined"
						&& typeof session.historiaClinica.tensionArterial.d !== "undefined") {
                        //session.form.fields[0].response = session.historiaClinica.tensionArterial;
                        //asignar el valor a response en la estructura de la fila del formulario
                        let i;
                        for (i = 0; i < session.form.fields.length; ++i) {
                            if (session.form.fields[i].c == id) {
                                session.form.fields[i].response = session.historiaClinica.tensionArterial;
                                break;
                            }
                        }
                        console.error("pendiente validar el formulario ...");
                    }
                });
            //#endregion tensión arterial

            //#region altura
            $("#containerForm .imc")
                .on("change", function () {
                    console.log(".altura.change");
                    const id = this.dataset.id;
                    const self = this;

                    if (self.classList.contains("imc-altura-1")) {
                        session.historiaClinica.altura.m = self.value;
                    }

                    if (self.classList.contains("imc-altura-2")) {
                        session.historiaClinica.altura.c = self.value;
                    }

                    if (typeof session.historiaClinica.tensionArterial.s !== "undefined"
						&& typeof session.historiaClinica.tensionArterial.d !== "undefined") {
                        //session.form.fields[0].response = session.historiaClinica.tensionArterial;
                        //asignar el valor a response en la estructura de la fila del formulario
                        let i;
                        for (i = 0; i < session.form.fields.length; ++i) {
                            if (session.form.fields[i].c == id) {
                                session.form.fields[i].response = session.historiaClinica.altura;
                                break;
                            }
                        }
                        console.error("pendiente validar el formulario ...");
                    }
                });
            //#endregion altura

            //#region escala glasgow
            $("#containerForm .glasgow")
                .on("change", function (event) {
                    event.preventDefault();
                    console.log(".glasgow.change");
                    const id = this.dataset.id;
                    const self = this;
                    if (id == 1) {
                        session.historiaClinica.glasgow.grm = self.value;
                    }
                    else if (id == 2) {
                        session.historiaClinica.glasgow.gao = self.value;
                    }
                    else if (id == 3) {
                        session.historiaClinica.glasgow.grv = self.value;
                    }

                    if (typeof session.historiaClinica.glasgow.grm !== "undefined"
						&& typeof session.historiaClinica.glasgow.gao !== "undefined"
						&& typeof session.historiaClinica.glasgow.grv !== "undefined") {
                        session.form.fields[0].response = session.historiaClinica.glasgow;
                        $("#buttonNext").prop("disabled", false);
                    }

                });
            //#endregion escala glasgow

            //#region escala barthel
            $("#containerForm .barthel")
                .on("change", function (event) {
                    event.preventDefault();
                    console.log(".barthel.change");
                    const id = this.dataset.id;
                    const self = this;
                    if (id == 1) {
                        session.historiaClinica.barthel.co = self.value;
                    }
                    else if (id == 2) {
                        session.historiaClinica.barthel.ba = self.value;
                    }
                    else if (id == 3) {
                        session.historiaClinica.barthel.ve = self.value;
                    }
                    else if (id == 4) {
                        session.historiaClinica.barthel.arr = self.value;
                    }
                    else if (id == 5) {
                        session.historiaClinica.barthel.dep = self.value;
                    }
                    else if (id == 6) {
                        session.historiaClinica.barthel.mi = self.value;
                    }
                    else if (id == 7) {
                        session.historiaClinica.barthel.re = self.value;
                    }
                    else if (id == 8) {
                        session.historiaClinica.barthel.tr = self.value;
                    }
                    else if (id == 9) {
                        session.historiaClinica.barthel.de = self.value;
                    }
                    else if (id == 10) {
                        session.historiaClinica.barthel.es = self.value;
                    }

                    session.form.fields[0].response = session.historiaClinica.barthel;
                    app.historiaClinica.escalas.barthel.validate(0);

                });
            //#endregion escala barthel

            //#region escala karnofsky
            $("#containerForm .karnofsky")
                .on("change", function (event) {
                    event.preventDefault();
                    console.log(".karnofsky.change");
                    const self = this;
                    session.form.fields[0].response = self.value;
                    $("#buttonNext").prop("disabled", false);
                });
            //#endregion escala karnofsky

            //#region escala news
            $("#containerForm .news")
                .on("change", function (event) {
                    event.preventDefault();
                    console.log(".news.change");
                    const id = this.dataset.id;
                    const indice = this.dataset.indice;
                    const self = this;

                    if (typeof session.historiaClinica.news == "undefined") {
                        if (nata.localStorage.getItem("form-" + session.form.id + "-" + session.form.section).length > 0) {
                            session.historiaClinica.news = nata.localStorage.getItem("form-" + session.form.id + "-" + session.form.section)[0].response;
                        }
                        else {
                            session.historiaClinica.news = {};
                        }
                    }

                    if (id == 1) {
                        session.historiaClinica.news.fr = {
                            indice: indice,
                            value: self.dataset.value
                        };
                    }
                    else if (id == 2) {
                        session.historiaClinica.news.sao = {
                            indice: indice,
                            value: self.dataset.value
                        };
                    }
                    else if (id == 3) {
                        session.historiaClinica.news.epoc = {
                            indice: indice,
                            value: self.dataset.value
                        };
                    }
                    else if (id == 4) {
                        session.historiaClinica.news.os = {
                            indice: indice,
                            value: self.dataset.value
                        };
                    }
                    else if (id == 5) {
                        session.historiaClinica.news.pas = {
                            indice: indice,
                            value: self.dataset.value
                        };
                    }
                    else if (id == 6) {
                        session.historiaClinica.news.fc = {
                            indice: indice,
                            value: self.dataset.value
                        };
                    }
                    else if (id == 7) {
                        session.historiaClinica.news.tc = {
                            indice: indice,
                            value: self.dataset.value
                        };
                    }

                    session.form.fields[0].response = session.historiaClinica.news;
                    app.historiaClinica.escalas.news.validate(0);


                });
            //#endregion escala news

            //#region  form personalizado
            if (idForm == 2 && idSection == 3) {
                session.historiaClinica.tensionArterial = {};
                session.historiaClinica.altura = {};
            }

            if (idForm == 2 && idSection == 5) {
                session.barthel = {};

                if (typeof session.form.fields[0].response.co != "undefined"
					&& typeof session.form.fields[0].response.ba != "undefined"

					&& typeof session.form.fields[0].response.ve != "undefined"
					&& typeof session.form.fields[0].response.arr != "undefined"

					&& typeof session.form.fields[0].response.dep != "undefined"
					&& typeof session.form.fields[0].response.mi != "undefined"

					&& typeof session.form.fields[0].response.re != "undefined"
					&& typeof session.form.fields[0].response.tr != "undefined"

					&& typeof session.form.fields[0].response.de != "undefined"
					&& typeof session.form.fields[0].response.es != "undefined") {

                    $("#buttonNext").prop("disabled", false);
                }
                else {
                    $("#buttonNext").prop("disabled", true);
                }

                //#region escala barthel
                $("#containerForm input.barthel")
                    .off()
                    .on("click", function () {
                        console.log("#containerForm.input.barthel.change");
                        const self = this;
                        console.log(self);
                        console.log(self.value);

                        if (typeof session.form.fields[0].response == "undefined") session.form.fields[0].response = {};
                        session.form.fields[0].response[self.dataset.index] = self.value;
                        console.log(session.form.fields[0].response);

                        if (typeof session.form.fields[0].response.co != "undefined"
							&& typeof session.form.fields[0].response.ba != "undefined"

							&& typeof session.form.fields[0].response.ve != "undefined"
							&& typeof session.form.fields[0].response.arr != "undefined"

							&& typeof session.form.fields[0].response.dep != "undefined"
							&& typeof session.form.fields[0].response.mi != "undefined"

							&& typeof session.form.fields[0].response.re != "undefined"
							&& typeof session.form.fields[0].response.tr != "undefined"

							&& typeof session.form.fields[0].response.de != "undefined"
							&& typeof session.form.fields[0].response.es != "undefined"

                        ) {
                            $("#buttonNext").prop("disabled", false);
                        }

                    });
                //#endregion escala barthel
            }

            //#endregion personalizado
        }
        //#endregion personalizados

        //#region eventos

        $("#containerForm .imc, #containerForm .tension-arterial")
        //.off()
            .on("change", function () {
                console.log("#containerForm .imc, #containerForm .tension-arterial - change");
                if (app.form.field.validate.minmax(this)) {
                    app.form.field.save(this);
                }
            });

        const elements = document.querySelectorAll(".form-control");
        for (i = 0; i < elements.length; ++i) {
            elements[i].addEventListener("change", function () {
                if (app.config.dev.verbose.secundario) console.log("%c .form-control.change", "background: red; color: #fff;");
                const self = this;

                // evitar validación de min y max para campos a la medida, ellos incluyen la funcionalidad 
                if (self.classList.contains("widget")) {
                    return false;
                }

                if (app.form.field.validate.minmax(this)) {
                    app.form.field.save(self);
                    app.form.validate();
                }

            }, true);
        }

        $("#buttonPrevious")
            .off()
            .on("click", async function () {
                console.log("#buttonPrevious.click");
                const self = this;
                session.form.section = session.form.section - 1;
                app.form.section.update(idForm, session.form.section);
                console.log(session.form);
                app.form.render(session.form.id, session.form.section, undefined);
                if (session.form.section == 1) {
                    self.disabled = true;
                }
            });

        $("#buttonNext")
            .off()
            .on("click", function () {
                console.log("#buttonNext.click");
                const self = this;

                const form = document.querySelector("#frmSection");

                if (form.checkValidity()) {
                    app.form.save(options, idForm);

                    if (typeof app.form.events.formValid == "function") {
                        app.form.events.formValid(true);
                        if (session.form.section == session.form.sections.length) {
                            self.disabled = true;
                        }
                    }
					
                    /*
                    if (typeof session.forms["diagnostico"] == "undefined") {
						return false;
					}
					if (typeof session.forms["diagnostico"].events == "undefined") session.forms["diagnostico"].events = {};
					if (typeof session.forms["diagnostico"].events.valid == "function") session.forms["diagnostico"].events.valid();
                    */

                    if (typeof app.form.events.send == "function") {
                        app.form.events.send();
                    }
                    else {
                        console.log("no hay evento send");
                    }

                    if (typeof app.form.events.onSend == "function") {
                        app.form.events.onSend();
                    }
                    else {
                        console.log("no hay evento onSend");
                    }

                }
                else {
                    app.form.validate();
                }
            });

        $("#containerForm .form-combo-departamento")
            .off()
            .click(app.form.field.divipola.departamento.change);
        //#endregion EVENTOS

        //#region filter
        $("input.ui-input-latin").inputfilter(
            {
                allowNumeric: true,
                allowText: true,
                actionLog: true,
                allowCustom: ["ñ", "Ñ", "á", "é", "í", "ó", "ú", "Á", "É", "Í", "Ó", "Ú", "ü", "Ü", ".", "-", "&", ",", " ", "#", "@", "_"]
            }
        );

        $("input.ui-input-numerico").inputfilter(
            {
                allowNumeric: true,
                allowText: false,
                actionLog: false,
                allowCustom: []
            }
        );

        $("input.ui-input-decimal").inputfilter(
            {
                allowNumeric: true,
                allowText: false,
                actionLog: false,
                allowCustom: ["."]
            }
        );

        $("input.ui-input-telefono").inputfilter(
            {
                allowNumeric: true,
                allowText: false,
                actionLog: false,
                allowCustom: [" "]
            }
        );
        //#endregion

        /*
		if (typeof options.detail !== "undefined") {
			//session.forms["diagnostico"] = new nataUIForm({ detail: options.detail });
			//session.apuntador.form = session.forms["diagnostico"];
			console.log(session.forms["diagnostico"]);
			//session.forms["diagnostico"].detailRender();
		}
		*/

        if (session.form.sections.length == 1) {
            $("#buttonPrevious").hide();
        }
        else {
            if (session.form.section !== 1 ) {
                $("#buttonPrevious").show();
            }
        }

        app.form.validate();

        if (typeof session.apuntador.form !== "undefined") {
            if (typeof session.apuntador.form.events.valid == "function") {
                console.log(session.apuntador.list);
                if (session.apuntador.list.dataset.list.length == 0) {
                    localforage.getItem(session.apuntador.list.indexLocalForage).then(function (data) {
                        session.apuntador.list.dataset.list = data;
                        session.apuntador.form.events.valid();
                    });
                }
                else {
                    session.apuntador.form.events.valid();
                }
            }
        }

    },

    response: {
        local: {

            remove: function (ip) {
                console.log("* app.documento.respuesta.local.remove * ");

                var respuestas = nata.localStorage.getItem("respuestas").filter(function (record) {
                    return record.ip != ip;
                });

                nata.localStorage.setItem("respuestas", respuestas);
                console.log(nata.localStorage.getItem("respuestas").filter(function (record) {
                    return record.ip == ip;
                }));
                respuestas = null;

            }
        }
    },

    save: function (options, idForm) {
        if (app.config.dev.verbose.core) console.log("%c app.form.save ", "background:blue;color:white;font-weight:bold;font-size:11px");
        session.flujo.push("app.form.save");

        if (session.form.section <= session.form.maxSection) {
            console.log(app.form.dataset.respuestas);
            app.core.ui.form.respuestas.cargar(idForm, session.form.section, app.form.dataset.respuestas, app.core.ui.form.tipo);
        }

        // save fields form
        if (typeof options.indexLocalStorage !== "undefined") {
            nata.localStorage.setItem(options.indexLocalStorage, session.form.fields);
        }
        else {
            nata.localStorage.setItem("form-" + session.form.id + "-" + session.form.section, session.form.fields);
        }

        // recuperar valores para la session
        if ($("#containerForm .paciente-direccion").length > 0) {
            $("#containerForm .paciente-direccion").trigger("change");
        }
    },

    secciones: {
        get: function (idForm) {
            if (app.config.dev.verbose.core) console.log("%c app.form.secciones.get ", "background:blue;color:white;font-weight:bold;font-size:11px");

            const data = nata.localStorage.getItem("form-" + idForm);
            //console.log(data);
            if (data == null) {
                console.error("Debe cargar el formulario: " + idForm);
                return false;
            }
            let i, secciones = [];
            for (i = 0; i < data.length; ++i) {
                if (data[i].s.toString().trim() !== "") {
                    secciones.push(data[i].s.toString().trim());
                }
            }

            return secciones;
        }
    },

    section: {
        update: function (idForm, idSeccion) {
            console.log("app.form.section.update");
            //alert("app.form.section.update");
            console.log(session.form.section);

            if (session.form.section == 0) session.form.section = 1;

            let section = nata.localStorage.getItem("form-" + idForm);
            section = section.filter(function (record) {
                return record.is == idSeccion
					&& record.s.toString().trim() !== "";
            });
            console.log(section);
            section = section[0].s;
            const subtitle = document.getElementById("form-subtitle");
            subtitle.innerHTML = section;
            section = null;
        }
    },

    subsection: {
        validate: function () {
            //https://developer.mozilla.org/es/docs/Learn/HTML/Forms/Validacion_formulario_datos

            setTimeout(function () {
                console.log("%c app.documento.subseccion.validar", "background:red;color:white;font-weight:bold;font-size:11px");
                if (document.getElementById("uiDialog-3") !== null) {
                    const elements = document.getElementById("uiDialog-3").getElementsByClassName("form-control");
                    var i, element; //, isDisabled = false;
                    for (i = 0; i < elements.length; ++i) {

                        element = elements[i];

                        if (element.parentElement.classList.contains("d-none")) {
                            /*
							if (element.dataset.id == 124) {
								alert("entro 01");
							}
							*/
                            continue;
                        }

                        if (element.hasAttribute("disabled")) {
                            /*
							if (element.dataset.id == 124) {
								alert("entro 02");
							}
							*/
                            continue;
                        }

                        if (element.style.display == "none") {
                            /*
							if (element.dataset.id == 124) {
								alert("entro 03");
							}
							*/
                            continue;
                        }

                        if (element.hasAttribute("type") && element.getAttribute("type") == "text") {
                            if (element.value == "") {
                                $("#buttonDialogAceptar").attr("disabled", true);
                                //alert("false 00");
                                return false;
                            }

                            if (element.hasAttribute("minlength")) {
                                console.log(element.getAttribute("minlength"));
                                console.log(element.value.toString().trim().length);
                                if (element.value.toString().trim().length < element.getAttribute("minlength")) {
                                    $("#buttonDialogAceptar").attr("disabled", true);
                                    //alert("false 01");
                                    return false;
                                }
                            }
                        }
                        console.log(!elements[i].checkValidity());
                        console.log(elements[i].validity);

                        if (!elements[i].checkValidity()) {
                            console.log("%c sin respuesta", "background:red;color:white;font-weight:bold;font-size:11px");
                            console.log(element);
                            $("#buttonDialogAceptar").attr("disabled", true);
                            //alert("false 02");
                            return false;
                        }
                    }
                    $("#buttonDialogAceptar").attr("disabled", false);
                }
            }, 0.25 * 1000);

        }
    },

    validate: function () {
        if (app.config.dev.verbose.core) console.log("%c app.form.validate ", "background:blue;color:white;font-weight:bold;font-size:11px");
        console.trace("%c app.form.validate ", "background:red;color:white;font-weight:bold;font-size:12px");

        let i, element, contador = 0, contadorSinValor = 0, contadorAtributos = 0, contadorAtributosSinValor = 0, valid;
        for (i = 0; i < session.form.fields.length; ++i) {

            if (typeof session.form.fields[i].response == "undefined") session.form.fields[i].response = {};

            if (session.form.fields[i].tr != "label") {
                //console.log(session.form.fields[i].dc);
                ++contador;
            }

            if (session.form.fields[i].tr == "news") {
                valid = app.historiaClinica.escalas.news.validate(i);
            }
            else if (session.form.fields[i].tr == "barthel") {
                valid = app.historiaClinica.escalas.barthel.validate(i);
            }
            else if (session.form.fields[i].tr == "glasgow") {
                if (typeof session.form.fields[i].response.grm == "undefined"
					|| typeof session.form.fields[i].response.gao == "undefined"
					|| typeof session.form.fields[i].response.grv == "undefined"
                ) {
                    $("#buttonNext").prop("disabled", true);
                    valid = false;
                }
                else {
                    if (session.form.fields[i].response.grm == 0
						|| session.form.fields[i].response.gao == 0
						|| session.form.fields[i].response.grv == 0
                    ) {
                        $("#buttonNext").prop("disabled", true);
                        valid = false;
                    }
                }
            }
            else if (session.form.fields[i].tr == "karnofsky") {
                if (session.form.fields[i].response.kar == "") {
                    $("#buttonNext").prop("disabled", true);
                    valid = false;
                }
                else {
                    $("#buttonNext").prop("disabled", false);
                    valid = true;
                }
            }
            else {
                if (typeof session.form.fields[i].response == "undefined") {
                    session.form.fields[i].response = "";
                }
                else {
                    if (typeof session.form.fields[i].response.d != "undefined") {
                        if (session.form.fields[i].response.d == "") {
                            session.form.fields[i].response = "";
                        }
                    }
                }

                if (typeof session.form.fields[i].response == "object" && session.form.fields[i].tr != "label") {
                    contadorAtributos = 0;
                    for (var prop in session.form.fields[i].response) {
                        if (Object.prototype.hasOwnProperty.call(session.form.fields[i].response, prop)) {
                            // do stuff
                            ++contadorAtributos;
                            console.log(session.form.fields[i].response[prop]);
                            if (session.form.fields[i].response[prop] == "") {
                                ++contadorAtributosSinValor;
                            }
                        }
                    }
                    console.log(contadorAtributos, contadorAtributosSinValor);
                    if (contadorAtributos == contadorAtributosSinValor) {
                        ++contadorSinValor;
                    }
                }
                else if (session.form.fields[i].response.toString().trim() == "" && session.form.fields[i].tr != "label") {
                    ++contadorSinValor;
                }
                else {
                    //console.log(session.form.fields[i].dc);
                    //console.log(session.form.fields[i].response);
                }

                if (session.form.fields[i].response.toString().trim() == ""
					&& session.form.fields[i].op == ""
					&& session.form.fields[i].tr != "label") {
                    console.log(i, session.form.fields[i]);
                    element = document.getElementById("control-" + session.form.fields[i].c);
                    if (session.form.fields[i].tr == "divipola") {
                        document.getElementById("selectDepartamento-" + session.form.fields[i].c).classList.add("invalid");
                        document.getElementById("selectDepartamento-" + session.form.fields[i].c).classList.add("vibrate-1");

                        document.getElementById("selectMunicipio-" + session.form.fields[i].c).classList.add("invalid");
                        document.getElementById("selectMunicipio-" + session.form.fields[i].c).classList.add("vibrate-1");
                    }

                    // OJO NO QUITAR O DESHABILITAR SIRVE PARA HACER DEBUG A LA VALIDACION DEL FORMULARIO
                    if (app.config.dev.verbose.core) console.log(element);
                    $("#buttonNext").prop("disabled", true);
                    //console.log(false);
                    valid = false;
                }
            }

        }

        if ((contador == contadorSinValor)) {
            console.error("Debe ingresar por lo menos un valor");
            //valid = false;
        }

        const oForm = document.getElementById("frmSection");
        if (oForm.checkValidity()) {
            if (typeof app.form.events.formValid === "function") {
                console.log(app.form.events.formValid);
                if (!app.form.events.formValid()) {
                    app.form.valid = false;
                    return false;
                }
            }
            $("#buttonNext").prop("disabled", false);
            app.form.valid = true;
            return true;
        }
        else {
            //oForm.reportValidity();
            $("#buttonNext").prop("disabled", true);
            app.form.valid = false;
            return false;
        }
    }
};

$(document).on("click", "#form-subtitle", function (event) {
    event.preventDefault();
    event.preventDefault();

    const text = this.innerText;
    navigator.clipboard.writeText(text);

});

$(document).on("change", "#containerForm .paciente-direccion", function () {
    session.dataset.paciente.direccion = this.value;
});
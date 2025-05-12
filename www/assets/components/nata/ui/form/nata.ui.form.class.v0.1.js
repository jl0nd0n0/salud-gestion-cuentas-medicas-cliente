/* globals session, swal, nata, $, app , alasql,  localforage */

session.form = [];

// eslint-disable-next-line no-unused-vars
class nataUIFormBasicV1 {

    constructor( options = {}, dataset, events = {} ) {
        // eslint-disable-next-line no-unused-vars
        const self = this;

        const settings = {
            form: {
                dataset: {},

                attribute: "",
                boolButtons: true,
                buttonNextLabel: `
					Siguiente <img class="icon-button" src="assets/images/icons/chevron-right-white.svg" alt="siguiente" title="siguiente">
				`,
                boolSend: true,
                boolShowDialogMessage: true,
                class: "",
                idForm: 0,
                idRecord: 0,
                idSection: 0,
                idUser: 0,

                title: "title form",

                typeStorage: "",

                index: "",
                indexDetail: "",

                subtitle: "",

                table: "",
                key: {
                    field: "",
                    value: ""
                },
                keys: []
            }
            /*,
            dataset: {
                data: []
            }
            */
        };

        // objetos anidados, profundidad
        const form = Object.assign( settings.form, options.form );
        self.options = Object.assign(settings, options);
        self.options.form = form;
        self.options.form.typeStorage = self.options.form.typeStorage.toString().toLowerCase();

        console.log ( dataset );
        if (typeof dataset !== "undefined") {
            self.dataset = dataset;
        }

        
        self.options.keys = options.keys;

        if (typeof self.options.form.fields === "undefined") {
            self.options.form.fields = nata.localStorage.getItem("form-" + self.options.form.idForm);
        }
        nata.sessionStorage.setItem("debug", self.options.form.fields);
        console.log( nata.sessionStorage.getItem("debug") );
        console.warn(self.options.form.fields);

        if (self.options.form.fields.length == 0) {
            const message = "No se ha recibido el formulario: " + self.options.form.idForm;
            swal("Error Dev", message, "error");
            console.error(message);
        }
        //console.log(self.options.form.fields);

        self.events = events;
        console.log(self.events);
    }

    get data() {
        const self = this;
        console.trace( "%c cambio self.data", "background:red;color:#fff;font-size:11px");
        return self.adapter(self.options.form.fields);
    }

    set data(obj) {
        this.dataset.data = obj;
    }

    adapter	( data ) {
        console.trace( "%c nataUIFormBasic.adapter", "background:red;color:#fff;font-size:11px");
        // adaptar el array a un objeto
        console.log( data );
        let i, objData = [], oRecord = {};
        for (i=0; i<data.length; i++) {
            // si no hay atributo continua
            if (data[i].tr.toString().trim() == "") {
                continue;
            }
            oRecord[data[i].atr] = data[i].response || "";
        }
        objData.push(oRecord);
        return objData;
    }

    adapterDataInput() {
        return this.adapter( this.dataset.data );
    }

    adapterDataFields () {
        return this.adapter( this.options.form.fields );
    }

    async buttonNext () {
        console.log("nataUIFormBasic.buttonNext");
        const self = this;
        if (self.options.form.idSection == self.options.sections.data.length) {
            let idlocal;
            if (typeof self.options.form.idLocal !== "undefined") {
                idlocal = self.options.form.idLocal;
            }
            else {
                idlocal = new Date().getTime();
            }

            if (typeof idlocal == "undefined") {
                const message = "No se ha recibido el idlocal";
                swal("Error Dev", message, "error");
                console.error(message);
                return false;
            }

            self.idlocal = idlocal;

            document.querySelector( "#container" ).innerHTML = "";
            if (self.options.form.boolSend) {
                if (typeof self.events.beforeSend == "function") self.events.beforeSend();
                if ( typeof self.options.config == "undefined" ) self.options.config = {};
                if ( typeof self.options.config.index == "undefined" ) self.options.config.index = {};

                if ( self.options.config.index.adapter == "mysql-nosql" ) {
                    nata.form.adapter( self );
                }
                else {
                    console.log(self.options.keys);
                    if (self.options.form.table == "") {
                        const message = "No se ha recibido la tabla: options.form.table";
                        swal("Error Dev", message, "error");
                        console.error(message);
                        return false;
                    }

                    const url = app.config.server.php + "core/actualizar?ts=" + new Date().getTime();
                    let widget, tipo;

                    const idUser = self.options.form.idUser;
                    if (idUser == 0) {
                        const message = "No se ha recibido el id de usuario";
                        console.error(message);
                        swal("Error Dev", message, "error");
                        return false;
                    }

                    const dataSend = {
                        url: url,
                        table: self.options.form.table,
                        iu: session.user.i,
                        if: self.options.form.idForm,
                        il: idlocal,
                        fields: self.options.fields,
                        json: self.options.form.fields.map(function (record) {
                            if (record.tr == "divipola") widget = "divipola";
                            else widget = "";

                            if (record.se == "custom" || record.se == "numerico") {

                                if (record.response.substr(0, 1) == "0") {
                                    tipo = "texto";
                                }
                                else {
                                    tipo = "numerico";
                                }

                            }
                            else tipo = "";

                            return {
                                atr: record.atr,
                                c: record.c,
                                r: record.response,
                                w: widget,
                                t: tipo,
                                tr: record.tr,
                                f: record.dc,
                                se: record.se,
                                atrs: record.atrs,
                                fls: record.fls
                            };
                        }),
                        keys: self.options.keys
                    };

                    if (self.options.form.boolShowDialogMessage) swal("Registro Exitoso", "Has actualizado la información", "success");

                    app.offline.setItem(idlocal, url, dataSend);

                    // crear documento historia clinica en appwrite
                    //app.appwrite.historiaClinica.actualizar( dataSend );

                    // agregar el registro localmente
                    self.saveRecordLocal(idlocal, self.oper, async function (data) {
                        if (typeof self.events.afterSaveRecordLocal == "function") {
                            self.events.afterSaveRecordLocal(data);
                        }
                    });

                    document.getElementById("container").innerHTML = "";
                    //@audit deprecate;
                    if (typeof self.events.afterSend == "function") self.events.afterSend();

                    const callback = async function () {
                        app.offline.removeItem(idlocal);
                        if (typeof self.events.formSend == "function") self.events.formSend( self.data );
                    };

                    if (app.config.dev.online) {
                        const callbackError = function (xmlhttp) {

                            if (typeof callback == "function") callback();

                            console.error(xmlhttp);
                            console.error("Desconectado de internet (global)");
                            if(xmlhttp.status == 0) {
                                // alert("Desconectado de internet (global)");
                                swal("Error", xmlhttp.response, "error");
                            }
                            return false;
                        };
                        nata.ajax("post", url, dataSend, "json", callback, callbackError);
                    }
                    else {
                        document.getElementById("container").innerHTML = "";
                        console.error("Desconectado de internet (app)");
                    }
                }
            }
            else {
                nata.sessionStorage.setItem("form-" + self.options.form.idForm, self.data);
            }

            if (typeof self.events.end == "function") self.events.end( self.data );

        }
        else {
            ++self.options.form.idSection;
            document.getElementById("buttonPrevious").disabled = false;
            await self.render();
        }
    }

    divipolaDepartamentoChange(event, self) {
        console.log("%c nataUIForm.divipolaDepartamentoChange ", "background:blue;color:white;font-weight:bold;font-size:10px");

        const element = event.target;
        const id = element.dataset.id;
        const value = element.value;

        const selectMunicipio = document.getElementById("selectMunicipio-" + id);
        let dataMunicipios = [], html = "<option value=\"\">Seleccione Municipio</option>";
        if (value != "") {
            dataMunicipios = app.adapter.divipola.municipio.get(element.value);
            console.log(dataMunicipios);
            let i;
            for (i = 0; i < dataMunicipios.length; ++i) {
                html += `<option value="${dataMunicipios[i].i}">${dataMunicipios[i].m}</option>`;
            }
            i = null;
        }
        selectMunicipio.innerHTML = html;
        html = null;

        if (self.oper == "insertar") {
            if (dataMunicipios.length == 1) {
                selectMunicipio.value = dataMunicipios[0].i;
            }
            else {
                selectMunicipio.value = "";
            }
        }
        else {
            const dataFieldMunicipio = self.options.form.fields.filter(function (record) {
                return record.c == element.dataset.id;
            })[0];
            console.log(dataFieldMunicipio);
            selectMunicipio.value = dataFieldMunicipio.response.m;
        }
        self.validateField(document.getElementById("control-" + id), id);
    }

    fieldChange( element ) {
        console.log( "%c .form-control.change", "background: blue; color: #fff;" );
        const self = this;

        // TODO: optimizar esta lógica
        const isValidField = self.validateField(element, element.dataset.id, true);
        console.log(isValidField);
        if (isValidField) {
            self.fieldSave(element);
            self.validateForm();
        }
    }

    fieldSave(element, id, value) {
        console.log("%c nataUIFormBasic.fieldSave ", "background:red;color:white;font-weight:bold;font-size:11px");
        const self = this;
        console.log(element);
        if (typeof id === "undefined") id = element.dataset.id;
        if (typeof value === "undefined") value = element.value;

        let i;
        for (i = 0; i < self.options.form.fields.length; ++i) {
            if (self.options.form.fields[i].se.toString().trim().toLowerCase() == "check") {
                console.log("paso widget check ...");
                if (typeof self.options.form.fields[i].response == "undefined") {
                    self.options.form.fields[i].response = {};
                }

                if (typeof element.dataset.index == "undefined") {
                    const message = "No se ha adicionado el data->index al control";
                    swal("Error Dev", message, "error");
                    console.error(message, element);
                    return false;
                }

                if (typeof element.value == "undefined") {
                    const message = "No se ha adicionado el atributo value al control";
                    swal("Error Dev", message, "error");
                    console.error(message, element);
                    return false;
                }

                self.options.form.fields[i].response[element.dataset.index] = element.value;
                let nameIndice = "";
                if (typeof element.dataset.attrIndice !== "undefined") {
                    nameIndice = element.dataset.attrIndice;
                }
                if (nameIndice !== "") {
                    self.options.form.fields[i].response[nameIndice] = element.dataset.indice;
                }
            }
            else {
                //console.log(self.options.form.fields[i].c, id);
                if (self.options.form.fields[i].c == id) {
                    if (self.options.form.fields[i].tr.toString().trim().toLowerCase() == "radio") {
                        console.log(element.value);
                        self.options.form.fields[i].response = element.value;
                    }
                    else if (self.options.form.fields[i].tr.toString().trim().toLowerCase() == "tension-arterial") {
                        self.options.form.fields[i].response = {};
                        self.options.form.fields[i].response.s = document.getElementById("control-" + id + "-1").value;
                        self.options.form.fields[i].response.d = document.getElementById("control-" + id + "-2").value;
                        console.log(self.options.form.fields[i].response);

                    }
                    else if (self.options.form.fields[i].tr.toString().trim().toLowerCase() == "altura") {
                        self.options.form.fields[i].response = {
                            m: document.getElementById("control-" + id + "-1").value,
                            c: document.getElementById("control-" + id + "-2").value
                        };

                    }
                    else if (self.options.form.fields[i].tr.toString().trim().toLowerCase() == "divipola") {
                        self.options.form.fields[i].response = {};
                        self.options.form.fields[i].response.d = document.getElementById("selectDepartamento-" + id).value;
                        if (self.options.form.fields[i].response.d == "") {
                            self.options.form.fields[i].response.m = "";
                        }
                        else {
                            self.options.form.fields[i].response.m = document.getElementById("selectMunicipio-" + id).value;

                        }
                        console.log(self.options.form.fields[i].response);
                    }
                    else if (self.options.form.fields[i].tr.toString().trim().toLowerCase() == "texto-divipola") {
                        self.options.form.fields[i].response = {};
                        self.options.form.fields[i].response.v = document.getElementById("control-" + id).value;
                        self.options.form.fields[i].response.d = document.getElementById("selectDepartamento-" + id).value;
                        self.options.form.fields[i].response.m = document.getElementById("selectMunicipio-" + id).value;
                    }
                    else {
                        console.log( element, value );
                        self.options.form.fields[i].response = value;
                        console.log(self.options.form.fields);
                    }
                    break;
                }
            }
        }
    }

    fieldSaveMultiselect(element) {
        console.log("%c nataUIFormBasic.fieldSaveMultiselect ", "background:blue;color:white;font-weight:bold;font-size:10px");
        const self = this;

        const name = element.getAttribute("name");
        const id = element.dataset.id;
        const elementsCheckBox = document.getElementsByName(name);
        console.log(elementsCheckBox);
        const selected = [];
        let i;
        for (i=0; i<elementsCheckBox.length; i++) {
            if (elementsCheckBox[i].checked) {
                selected.push(elementsCheckBox[i].value);
                // console.log(selected);
            }
        }

        for (i = 0; i < self.options.form.fields.length; ++i) {
            if (self.options.form.fields[i].c == id) {
                self.options.form.fields[i].response = selected;
                break;
            }
        }
    }

    fieldSaveOptionButtonEscala(element) {
        console.log("%c nataUIFormBasic.fieldSaveOptionButtonEscala ", "background:blue;color:white;font-weight:bold;font-size:10px");
        const self = this;

        if (typeof element.dataset.index == "undefined") {
            const message = "No se ha definido el data->index del  optionbutton";
            swal("Error Dev", message, "error");
            console.error(message, element);
        }

        const index = element.dataset.index;
        const indice = element.dataset.indice;

        let obj;
        if (typeof self.options.form.fields[0].response == "undefined") self.options.form.fields[0].response = {};

        obj = {
            indice: indice || 0,
            value: element.value
        };
        console.log( index, obj );
        self.options.form.fields[0].response[index] = obj;
    }

    // este es el definitivo
    async loadDataAdapter () {
        const self = this;
        let i;

        const data = nata.localStorage.getItem( self.options.form.index );
        console.log( data );

        console.log( self.options );
        const fields = self.options.form.fields;
        for (i = 0; i < fields.length; ++i) {
            if ( fields[i].atr.toString().trim() == "" ) {
                continue;
            }

            if ( typeof fields[i].response == "undefined" ) {
                if ( fields[i].v != "" ) {
                    fields[i].response = fields[i].v;
                }
            }

        }
    }

    renderLayout() {
        console.log("%c nataUIFormBasic.renderLayout ", "background:red;color:white;font-weight:bold;font-size:11px");
        session.flujo.push("nataUIFormBasic.renderLayout");

        // eslint-disable-next-line no-unused-vars
        const self = this;

        const dataLayout = {
            title: self.options.form.title,
            subtitle: self.options.form.subtitle,
            boolButtons: self.options.form.boolButtons,
            buttonNextLabel: self.options.form.buttonNextLabel,
            class: self.options.form.class
        };
        const html = nata.ui.template.get("templateFormLayout", dataLayout);
        const element = document.getElementById("container");
        element.innerHTML = html;
        element.style.display = "block";

        self.options.sections = {};
        self.options.sections.data = self.sectionsGet(self.options.form.idForm);

        if (self.options.sections.data.length == 0) {
            swal("Error Dev", "No se han cargado las secciones del formulario", "error");
            console.error("No se han cargado las secciones del formulario");
            return false;
        }
        //console.log(self.options.sections.data);
        self.render();
    }

    render() {
        console.trace("%c nataUIForm.render ", "background:red;color:white;font-weight:bold;font-size:11px");
        session.flujo.push("nataUIForm.render");

        const self = this;

        if ( typeof self.options.config == "undefined") self.options.config = {};
        if ( typeof self.options.config.index == "undefined") self.options.config.index = {};

        const fields = self.options.form.fields.filter(function (record) {
            return (parseInt(record.is) == parseInt(self.options.form.idSection));
        });

        if (fields.length == 0) {
            const message = "No se ha recibido los campos de la sección del formulario: " + self.options.form.idForm + ", " + self.options.form.idSection;
            console.log();
            swal("Error Dev", message, "error");
            console.error(message);
            return false;
        }

        // asignar respuesta lógica ui
        let temporal = {
            idForm: self.options.form.idForm,
            apuntador: self.options.form.idSection,
            fields: fields
        };
        console.log(temporal);
        //console.log(fields);
        document.getElementById("containerForm").render("templateForm", temporal, false);
        window.scrollTo(0, 0);

        self.validate();

        document.querySelector("#loader").style.display = "none";
        document.body.style.overflowY = "hidden";

        if (typeof self.events.render == "function") self.events.render();
        //#endregion code

        //#region events

        const containerForm = document.getElementById("containerForm");

        //#region evento form control
        let elements = containerForm.querySelectorAll(".form-control");
        let i;
        for (i = 0; i < elements.length; ++i) {
            elements[i].addEventListener("change", function () {
                console.log( "change ..." );
                self.fieldChange( this );
            }, true);
        }
        //#endregion evento form control

        //#region evento form form-input-optionbutton
        elements = containerForm.querySelectorAll(".form-input-optionbutton");
        for (i = 0; i < elements.length; ++i) {
            elements[i].addEventListener("click", function () {
                console.log("%c .form-input-optionbutton", "background: blue; color: #fff; font-size: 10px; font-weight:bold;");
                self.fieldSaveOptionButtonEscala(this);
                self.validateFormRadio();
            }, true);
        }

        elements = containerForm.querySelectorAll(".form-radio-input");
        for (i = 0; i < elements.length; ++i) {
            elements[i].addEventListener("click", function () {
                console.log("%c .form-radio-input", "background: red; color: #fff; font-size: 10px; font-weight:bold;");
                self.fieldSave(this);
                self.validateForm();
            }, true);
        }
        //#endregion evento form-checkbox

        //#region evento form form-checkbox
        elements = containerForm.querySelectorAll(".form-checkbox");
        for (i = 0; i < elements.length; ++i) {
            elements[i].addEventListener("click", function () {
                console.log("%c .form-checkbox", "background: blue; color: #fff;");
                self.fieldSaveMultiselect(this);
            }, true);
        }
        //#endregion evento form-checkbox

        //#region evento combo departamento
        $("#containerForm .form-combo-departamento")
            .off()
            .change(function (event) {
                self.divipolaDepartamentoChange(event, self);
            })
            .trigger("change");
        //#endregion evento combo departamento

        //#region evento buttonPrevious
        $("#buttonPrevious")
            .off()
            .click(async function (event) {
                console.log("buttonPrevious.click");
                const selfButton = this;
                event.stopPropagation();
                event.preventDefault();

                selfButton.disabled = true;

                --self.options.form.idSection;
                document.getElementById("buttonNext").disabled = false;
                await self.render();

                if (self.options.form.idSection == 1) {
                    selfButton.disabled = true;
                }
                else {
                    selfButton.disabled = false;
                }
            });
        //#endregion evento buttonPrevious

        //#region evento buttonNext
        $("#buttonNext")
            .off()
            .click(async function (event) {
                console.trace("buttonNext.click");
                event.stopPropagation();
                event.preventDefault();

                self.save();
                await self.buttonNext();
            });
        //#endregion evento buttonNext

        //#endregion events

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
    }

    save() {
        console.trace("%c nataUIFormBasic.save ", "background:blue;color:white;font-weight:bold;font-size:10px");
        session.flujo.push("nataUIFormBasic.save");
        const self = this;
        // guardar localmente los registros
        console.log(self.options.form.fields);
        nata.localStorage.setItem("form-" + self.options.form.idForm + "-" + self.options.form.idSection, self.options.form.fields);
    }

    async saveRecordLocal (idlocal, oper = "insertar", callback) {
        console.log("saveRecordLocal");
        const self = this;
        const fields = self.options.form.fields;
        console.log(fields);

        //#region  armar registro del formulario
        const dataRecord = {};
        let i, prop;
        for (i = 0; i < fields.length; ++i) {

            if (fields[i].tr.toString().trim().toLowerCase() == "label") continue;

            if (fields[i].atr.toString().trim() == "" && fields[i].se.toString().trim().toLowerCase() != "radio") {
                const message = "No se ha recibido el atributo para este campo";
                swal("Error Dev", message, "error");
                console.error(message, fields[i]);
                return false;
            }

            if (fields[i].se.toString().trim().toLowerCase() == "radio") {
                if (typeof fields[i].response == "undefined") fields[i].response = {};

                if (Object.keys(fields[i].response).length == 0) {
                    const message = "No se recibieron las propiedades del response para un widget tipo radio";
                    swal("Error Dev", message, "error");
                    console.error(message, fields[i]);
                    return false;
                }

                for (prop in fields[i].response) {
                    if (Object.prototype.hasOwnProperty.call(fields[i].response, prop)) {
                        dataRecord[prop] = fields[i].response[prop];
                    }
                }
            }
            else {
                if (typeof fields[i].response == "undefined") fields[i].response = "";
                dataRecord[fields[i].atr] = fields[i].response;
            }

        }
        dataRecord.il = idlocal;

        console.log( self.options );

        let keys;
        if ( app.config.db.adapter == "mysql-nosql" ) {
            keys = self.options.config.index.keys;
        }
        else {
            keys = self.options.keys;
        }

        // se cargan los datos de la session que no muestran como control del formulario
        for (i = 0; i < keys.length; ++i) {
            dataRecord[keys[i].attr] = keys[i].value;
        }

        if (typeof self.events.saveRecord == "function") self.events.saveRecord(dataRecord);
        //#endregion  armar registro del formulario

        if (oper == "insertar") {
            dataRecord.i = idlocal;
        }

        let data;
        if (self.options.form.typeStorage == "localstorage") {
            data = nata.localStorage.getItem(self.options.form.index);
            console.log(data);
        }
        else {
            data = await localforage.getItem(self.options.form.index);
            if (data === null) data = [];
        }


        // el filtro se hace por los campos en keys ...
        /*
		data = data.filter(function (record) {
			return record.il != idlocal;
		});
		*/

        // si la data del formulario ya existe, lo elimina para guardarlo (actualizarlo)
        let strWHERE = "";
        for (i = 0; i < keys.length; ++i) {
            if (keys[i].type == "number") {
                strWHERE += keys[i].attr + "::NUMBER != " + keys[i].value;
            }
            else {
                strWHERE += keys[i].attr + " != " + keys[i].value;
            }
        }
        //console.log(strWHERE);
        const strSQL = "SELECT * FROM ? WHERE " + strWHERE;
        strWHERE = null;
        //console.log(strSQL);
        data = alasql(strSQL, [data]);
        //console.log(data);
        data.push( dataRecord );

        if (self.options.form.typeStorage == "localstorage") {
            nata.localStorage.setItem( self.options.form.index, data );
        }
        else {
            await localforage.setItem( self.options.form.index, data );
            if (typeof callback == "function") await callback(data);
        }
    }

    sectionsGet() {
        console.log("%c nataUIFormBasic.sectionsGet ", "background:blue;color:white;font-weight:bold;font-size:10px");
        const self = this;

        let i, secciones = [];
        for (i = 0; i < self.options.form.fields.length; ++i) {
            if (self.options.form.fields[i].s.toString().trim() !== "") {
                secciones.push(self.options.form.fields[i].s.toString().trim());
            }
        }

        return secciones;
    }

    validate() {
        console.trace("%c nataUIFormBasic.validate ", "background:blue;color:white;font-weight:bold;font-size:10px");
        const self = this;

        let i, element;
        const fields = self.options.form.fields.filter(function (record) {
            return (parseInt(record.is) == parseInt(self.options.form.idSection));
        });

        if (app.config.dev.verbose.core) console.warn("FIELDS: ", fields);

        // si el formulario maneja solo preguntas de tipo radio es una escala ...
        let boolIsFormRadio = false;
        for (i = 0; i < fields.length; ++i) {

            if (fields[i].tr.toString().trim().toLowerCase() == "label") continue;
            if (fields[i].se.toString().trim().toLowerCase() == "radio") {
                // solo tiene una pregunta, como en las escalas ...
                if ( (i+1) == fields.length) {
                    boolIsFormRadio = true;
                }
                continue;
            }

            element = document.getElementById("control-" + fields[i].c);
            //console.log(fields);
            //console.log(fields[i]);
            //console.log(element);
            if (element === null) {
                console.error("No se ha encontrado elemento -> control-" + fields[i].c);
                return false;
            }
            self.validateField(element, fields[i].c);
        }

        if (boolIsFormRadio) {
            self.validateFormRadio();
        }
        else {
            self.validateForm();
        }
    }

    async validateForm() {
        console.log("%c nataUIFormBasic.validateForm ", "background:blue;color:white;font-weight:bold;font-size:10px");
        const self = this;

        const form = document.querySelector("#frmSection");
        console.log("paso 01");
        if (form.checkValidity()) {
            console.log("paso 02");
            console.log(self.events);

            if (typeof self.events.valid == "function") {
                console.log("paso 03");
                let data = await localforage.getItem(self.options.form.indexDetail);
                if (data == null) data = [];
                console.log(data);
                data = data.filter(function (record) {
                    return record[self.options.form.key.field] == self.options.form.key.value;
                });
                //console.log(data);

                const boolValid = await self.events.valid(true, data.length);
                console.log(boolValid);
                if (typeof boolValid == "undefined") {
                    console.error("El evento valid no retorna un valor válido");
                }

                if (boolValid) {
                    document.querySelector("#buttonNext").disabled = false;
                }

                return boolValid;
            }
            console.log("paso 04");
            document.querySelector("#buttonNext").disabled = false;
            console.log(true);
            return true;
        }
        else {
            console.log("paso 05");

            if (typeof self.events.noValid == "function") {
                self.events.noValid();
            }

            document.querySelector("#buttonNext").disabled = true;
            console.log(false);
            return false;
        }
    }

    validateFormRadio () {
        console.trace("%c nataUIFormBasic.validateFormRadio ", "background:blue;color:white;font-weight:bold;font-size:10px");
        const self = this;

        const oFormContainer = document.querySelector("#containerForm");
        const elements = oFormContainer.querySelectorAll(".widget.escala");

        let i, arrIndex = [];
        for(i=0; i<elements.length; i++) {
            if ( arrIndex.indexOf( elements[i].dataset.index ) === -1 ) {
                arrIndex.push( elements[i].dataset.index );
            }
        }

        console.log( arrIndex );
        if (self.options.form.fields.length == 1) {
            const response = self.options.form.fields[0].response;
            let boolIsValid = true;
            for(i=0; i<arrIndex.length; i++) {
                if (typeof response[ arrIndex[i] ] != "object") {
                    console.log( "paso 01" );
                    boolIsValid = false;
                    break;
                }
                else {
                    if ( response[ arrIndex[i] ].value == -1 ) {
                        console.log( "paso 02" );
                        boolIsValid = false;
                        break;
                    }
                }

                console.log( response[ arrIndex[i] ] );
                if ( typeof  response[ arrIndex[i] ].indice == "undefined")  response[ arrIndex[i] ].indice = 0;
                if ( response[ arrIndex[i] ].indice.toString().trim() == "" ) {
                    console.log( "paso 03" );
                    boolIsValid = false;
                    break;
                }
            }
            console.log( !boolIsValid );
            document.querySelector("#buttonNext").disabled = !boolIsValid;
            return boolIsValid;
        }
        else {
            //alert("Es necesario implementar esta lógica ...");
        }
    }

    validateField(element) {
        if (app.config.dev.verbose.core) console.log("%c nataUIFormBasic.validateField ", "background:blue;color:white;font-weight:bold;font-size:10px");
        //console.trace("nataUIFormBasic.validateField");
        const self = this;
        let label, valid = true, value = "";

        //#region code
        if (element.dataset.id === null) {
            console.error("No se ha encontrado el data-id del elemento -> " + element.dataset.id);
            return false;
        }
        const field = self.options.form.fields.filter(function (record) {
            return record.c == element.dataset.id;
        })[0];
        //console.log(field);

        if (element.value !== null) value = element.value;
        if (typeof value == "undefined") value = "";
        value = value.toString().trim();

        label = document.getElementById("control-" + element.dataset.id + "-label");
        if (label === null) {
            console.error("No se ha encontrado el elemento -> control-" + element.dataset.id + "-label");
            return false;
        }
        label.style.display = "none";
        element.classList.remove("invalid");

        //#endregion code

        // TODO: plugin -> extend	er funcionalidad
        if (field.tr == "tension-arterial") {
            //console.log(field);
            const elementSistolica = document.getElementById("control-" + element.dataset.id + "-1");
            const elementDiastolica = document.getElementById("control-" + element.dataset.id + "-2");

            if (typeof field.response == "string") {
                field.response = {};
                field.response.d = "";
                field.response.s = "";
            }
            else {
                if (typeof field.response.d == "undefined") field.response.d = "";
                if (typeof field.response.s == "undefined") field.response.s = "";
            }

            //console.log(parseInt(elementSistolica.value));
            //console.log(parseInt(elementDiastolica.value));

            //#region sistólica
            value = elementSistolica.value;
            label = document.getElementById("labelError-" + element.dataset.id + "-1");
            //element, field, label, value, type = "input"
            if (self.validateFieldRequired(elementSistolica, field, label, value)) {
                self.validateFieldValid(element, label);
            }
            else {
                return false;
            }

            if (self.validateFieldMinValue(elementSistolica, label, value)) {
                self.validateFieldValid(element, label);
            }
            else {
                return false;
            }

            if (self.validateFieldMaxValue(elementSistolica, label, value)) {
                self.validateFieldValid(element, label);
            }
            else {
                return false;
            }
            //#endregion sistolica

            //#region diastolica
            value = elementDiastolica.value;
            label = document.getElementById("labelError-" + element.dataset.id + "-2");
            if (self.validateFieldRequired(elementDiastolica, field, label, value)) {
                self.validateFieldValid(element, label);
            }
            else {
                return false;
            }

            if (self.validateFieldMinValue(elementDiastolica, label, value)) {
                self.validateFieldValid(element, label);
            }
            else {
                return false;
            }

            if (self.validateFieldMaxValue(elementDiastolica, label, value)) {
                self.validateFieldValid(element, label);
            }
            else {
                return false;
            }
            //#endregion diastolica

            if (elementSistolica.value.toString().trim() != "") {
                if (elementDiastolica.value.toString().trim() == "") {
                    label = document.getElementById("control-" + element.dataset.id + "-label");
                    self.validateFieldError(element, label, "", "Debes ingresar la tensión arterial completa");
                    return false;
                }
            }

            if (elementDiastolica.value.toString().trim() != "") {
                if (elementSistolica.value.toString().trim() == "") {
                    label = document.getElementById("control-" + element.dataset.id + "-label");
                    self.validateFieldError(element, label, "", "Debes ingresar la tensión arterial completa");
                    return false;
                }
            }

            if (elementSistolica.value.toString().trim() != "" && elementDiastolica.value.toString().trim() != "") {
                self.validateFieldValid(elementSistolica, document.getElementById("control-" + element.dataset.id + "-label"));
                self.validateFieldValid(elementSistolica, document.getElementById("labelError-" + element.dataset.id + "-1"));
                self.validateFieldValid(elementDiastolica, document.getElementById("labelError-" + element.dataset.id + "-2"));
            }

            if (field.op == 1 && elementSistolica.value.toString().trim() == "") {
                self.validateFieldValid(elementSistolica, document.getElementById("control-" + element.dataset.id + "-label"));
                self.validateFieldValid(elementSistolica, document.getElementById("labelError-" + element.dataset.id + "-1"));
            }

            if (field.op == 1 && elementDiastolica.value.toString().trim() == "") {
                self.validateFieldValid(elementDiastolica, document.getElementById("control-" + element.dataset.id + "-label"));
                self.validateFieldValid(elementDiastolica, document.getElementById("labelError-" + element.dataset.id + "-2"));
            }
        }
        else if (field.tr == "altura") {
            //console.log(field);
            if (app.config.dev.verbose.core) console.warn(field.response, Object.keys(field.response));
            console.log("altura");
            console.warn(typeof field.response, field.response, Object.keys(field.response));

            if (typeof field.response == "undefined") field.response = "";
            if (typeof field.response == "string") {
                field.response = {};
                field.response.m = "";
                field.response.c = "";
            }

            const elementMetros = document.getElementById("control-" + element.dataset.id + "-1");
            const elementCentimetros = document.getElementById("control-" + element.dataset.id + "-2");

            console.log("paso 02");
            console.log(field.response, field.response);
            if (typeof field.response.m == "undefined") field.response.m = "";
            if (typeof field.response.c == "undefined") field.response.c = "";

            if (elementMetros.value.toString().trim() != "") {
                console.log("paso 03");
                console.log(field.response.m, field.response.c);
                if (elementCentimetros.value.toString().trim() == "") {
                    console.log("paso 04");
                    label = document.getElementById("control-" + element.dataset.id + "-label");
                    self.validateFieldError(element, label, "", "Debes ingresar la altura en Metros y Centímetros");
                    return false;
                }
            }

            if (elementCentimetros.value.toString().trim() != "") {
                console.log("paso 05");
                if (elementMetros.value.toString().trim() == "") {
                    console.log("paso 06");
                    label = document.getElementById("control-" + element.dataset.id + "-label");
                    self.validateFieldError(element, label, "", "Debes ingresar la altura en Metros y Centímetros");
                    return false;
                }
            }

            if (elementMetros.value.toString().trim() != "" && elementCentimetros.value.toString().trim() != "") {
                console.log("paso 07");
                self.validateFieldValid(elementMetros, document.getElementById("control-" + element.dataset.id + "-label"));
            }

            if (field.op == 1 && elementMetros.value.toString().trim() == "") {
                console.log("paso 08");
                self.validateFieldValid(elementMetros, document.getElementById("control-" + element.dataset.id + "-label"));
            }

            if (field.op == 1 && elementCentimetros.value.toString().trim() == "") {
                console.log("paso 09");
                self.validateFieldValid(elementCentimetros, document.getElementById("control-" + element.dataset.id + "-label"));
            }
        }
        else if ((field.se == "texto" || field.tr == "textarea") && field.p !== "numerico" && field.p != "decimal") {
            if (app.config.dev.verbose.core) console.log("text");
            //
            if (!self.validateFieldRequired(element, field, label, value)) {
                return false;
            }

            // email
            if (element.value.toString().length > 0 && field.p == "email") {
                console.log(element.validity);
                if (element.validity.typeMismatch) {
                    label.innerHTML = "Debes ingresar un email valido";
                    label.classList.remove("d-none");
                    label.style.display = "block";
                    element.classList.add("invalid");
                    return false;
                }
            }

            if (!self.validateFieldMinLength(element, field, label, value, "text")) {
                return false;
            }
        }
        //field.p -> pattern
        else if (field.se == "numerico" || field.p == "numerico" || field.p == "decimal") {
            if (app.config.dev.verbose.core) console.log("number");
            // requerido
            if (!self.validateFieldRequired(element, field, label, value)) return false;
            if (value != "") {
                //console.log("tiene valor");

                if (!self.validateFieldMinValue(element, label, value)) return false;
                if (!self.validateFieldMaxValue(element, label, value)) return false;

                if (!self.validateFieldMinLength(element, field, label, value, "number")) return false;
            }
        }
        else if (field.tr == "desplegable") {
            //console.log("select", field);
            if (!self.validateFieldRequired(element, field, label, value, "select")) return false;
        }
        else if (field.tr == "date" || field.tr == "date-now") {
            console.log("date");
            //console.log(label);
            // requerido
            //console.log(value);

            //console.log(document.getElementById("control-" + element.dataset.id));
            value = document.getElementById("control-" + element.dataset.id).value;
            if (!self.validateFieldRequired(element, field, label, value, "input", "debug")) {
                return false;
            }
            // fecha convertida a ms para hacer la condicion
            let valueMs = Date.parse(value);
            let fechaActualMs = Date.parse(new Date());

            if (valueMs >= fechaActualMs) {
                label.innerHTML = "Selecciona una fecha menor";
                label.classList.remove("d-none");
                label.style.display = "block";
                return false;
            }
        }
        else if (field.tr == "divipola") {
            const valueDepartamento = document.getElementById("selectDepartamento-" + element.dataset.id).value;
            value = {
                d: valueDepartamento,
                m: (valueDepartamento == "") ? "" : document.getElementById("selectMunicipio-" + element.dataset.id).value
            };

            console.log(value);
            if (field.op == "" && (value.d == "" || value.m == "")) {
                label.innerHTML = "Debes seleccionar el departamento y municipio";
                label.classList.remove("d-none");
                label.style.display = "block";
                return false;
            }
        }
        return valid;
    }

    validateFieldRequired(element, field, label, value, type = "input", debug = "") {
        if (app.config.dev.verbose.core) console.log("validateFieldRequired");

        const self = this;

        if (field.op == 1 && value.toString().trim() == "") {
            return true;
        }

        if (field.op == "" && value.toString().trim() == "") {
            self.validateFieldError(element, label, type);
            return false;
        }

        return true;

    }

    validateFieldError(element, label, type = "input", html = "") {
        if (app.config.dev.verbose.core) console.log("validateFieldError");
        if (html == "") {
            if (type == "input") {
                label.innerHTML = "Debes ingresar esta información";
            }
            else {
                label.innerHTML = "Debes seleccionar esta información";
            }
        }
        else {
            label.innerHTML = html;
        }
        label.classList.remove("d-none");
        label.style.display = "block";
        element.classList.add("invalid");
        document.getElementById("buttonNext").disabled = true;
    }

    validateFieldValid(element, label) {
        if (app.config.dev.verbose.core) console.log("validateFieldValid");
        label.style.display = "none";
        element.classList.remove("invalid");
    }

    validateFieldMinValue(element, label, value) {
        if (app.config.dev.verbose.core) console.log("validateFieldMinValue");
        const self = this;
        if (element.dataset.miv != "" && value.toString().trim() != "") {
            if (parseFloat(element.dataset.miv) > parseFloat(value)) {
                if (app.config.dev.verbose.core) console.log("number - miv");
                const html = "El valor mínimo permitido es " + element.dataset.miv;
                self.validateFieldError(element, label, "", html);
                return false;
            }
        }

        return true;
    }

    validateFieldMaxValue(element, label, value) {
        if (app.config.dev.verbose.core) console.log("validateFieldMaxValue");
        const self = this;
        if (element.dataset.mav != "" && value.toString().trim() != "") {
            if (parseFloat(value) > parseFloat(element.dataset.mav)) {
                if (app.config.dev.verbose.core) console.log("number - mav");
                const html = "El valor máximo permitido es " + element.dataset.mav;
                self.validateFieldError(element, label, "", html);
                return false;
            }
        }
        return true;
    }

    validateFieldMinLength(element, field, label, value, type) {
        if (app.config.dev.verbose.core) console.log("validateFieldMinLength");
        if ((field.op == "" && value.toString().length == 0) || (value.toString().length > 0 && value.toString().length < element.getAttribute("minlength"))) {
            if (app.config.dev.verbose.core) console.log("validateFieldMinLength - invalid");
            const html = "Debes ingresar mínimo: " + element.getAttribute("minlength") + (type == "number" ? " dígitos" : " caracteres");
            label.innerHTML = html;
            label.classList.remove("d-none");
            label.style.display = "block";
            element.classList.add("invalid");
            document.getElementById("buttonNext").disabled = true;
            return false;
        }

        return true;
    }
}
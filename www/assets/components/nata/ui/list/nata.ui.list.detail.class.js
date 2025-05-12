/* globals nata, $, nata, localforage, nata, swal */

// eslint-disable-next-line no-unused-vars
class nataUIListDetail {

    constructor(options = {}) {
        const self = this;

        const settings = {
            idCota: "listClusterize",
            index: "",
            dialog: undefined,
            template: "",
            form: undefined,
            fxRender: undefined,
            key: {},
            listDetail: "listDetail",
            fields: [],
            events: {}
        };

        self.options = Object.assign(settings, options);
    }

    eventDialogList() {
        console.log("%c nataUIListDetail.eventDialogList", "background: red; color: #fff;font-size: 11px");
        const self = this;

        $(document).on("click", "#listClusterize" + self.options.idCota + "  .button-list-create", function () {
            console.log("#listClusterize .button-list-create.click");
            event.preventDefault();
            const codigo = this.dataset.codigo;
            const text = this.dataset.text;

            console.log(self.options);
            self.create(codigo, text);
        });
    }

    async create(codigo, text) {
        console.log("%c nataUIListDetail.create", "background: red; color: #fff;font-size: 11px");
        console.log(codigo, text);

        const self = this;
        console.log(self);

        let data = await localforage.getItem(self.options.index);
        if (data === null) data = [];

        // sacar copia del registro actual
        const oRecordNuevo = data.filter(function (record) {
            return record[self.options.key.field] == self.options.key.value
				&& record.c == codigo;
        });

        const oRecord = {
            c: codigo,
            t: text,
            cp: 1
        };
        
        // cargar los fields del objeto
        let prop;
        for (prop in self.options.fields) {
            if (Object.prototype.hasOwnProperty.call(self.options.fields, prop)) {
                oRecord[prop] = self.options.fields[prop];
            }
        }

        //oRecord[self.options.key.field] = self.options.key.value;
        console.log(oRecord);

        const callback = function () {
            self.options.dialog.hide();

            self.detailRender(async function () {
                if (typeof self.options.form !== "undefined") {
                    if (await self.options.form.validateForm()) {
                        document.getElementById("buttonNext").disabled = false;
                    }
                    else {
                        document.getElementById("buttonNext").disabled = true;
                    }
                }
            });

            let boolTienePrincipal = false;
            let i;
			
            for (i = 0; i < data.length; i++) {
                if (typeof data[i].p == "undefined") {
                    console.log("paso 01");
                    data[i].p = 0;
                }
                if (data[i].p == 1) {
                    console.log("paso 02");
                    boolTienePrincipal = true;
                    break;
                }
            }
            console.log(boolTienePrincipal);
            if (!boolTienePrincipal && data.length > 0) {
                data[0].p = 1;
            }

        };

        console.log(self.events);

        if (typeof self.options.events.detailAdd == "function") {
            self.options.events.detailAdd(data.length, oRecord);
        }

        if (oRecordNuevo.length == 0) {
            await nata.localforage.addItem(self.options.index, oRecord, "c", codigo, callback);
        }
        else {
            callback();
        }
    }

    async delete(codigo) {
        console.log("%c nataUIListDetail.delete", "background: red; color: #fff;font-size: 11px");
        const self = this;

        swal({
            title: "Desea eliminar este registro ?",
            text: "",
            icon: "warning",
            buttons: ["CANCELAR", "SI, continuar"],
            dangerMode: true,
        }).then(async (response) => {
            if (response) {
                let data = await localforage.getItem(self.options.index);
                console.log(self.options.index, self.options.key.field + "-c", self.options.key.value + "-" + codigo);
                data = await nata.localforage.removeItem(self.options.index, self.options.key.field, "c", self.options.key.value, codigo);
                console.log(data);	
                const button = document.getElementById("buttonNext");
                if (data.length == 0) {
                    if (button !== null) button.disabled = true;
                }
                else {
                    if (button !== null) button.disabled = false;
                }

                if (typeof self.options.events.detailDelete == "function") await self.options.events.detailDelete();
                self.detailRender();
            }
        });

    }

    detailRender(callback) {
        console.log("%c nataUIListDetail.detailRender", "background: red; color: #fff;font-size: 11px");
        const self = this;

        console.log(self.options);
        localforage.getItem(self.options.index).then(function (data) {
            if (data === null) data = [];
            console.log(data);
            data = data.filter(function (record) {
                return record[self.options.key.field] == self.options.key.value;
            });
            console.log(self.options);

            document.getElementById(self.options.listDetail).render(self.options.template, { detail: data });

            $(".button-list-dialog")
                .off()
                .click(function () {
                    self.options.fxRender();
                });

            let selector = "";
            if (self.options.idCota !== "") {
                selector = "#list" + self.options.idCota + " .button-list-delete";

            }
            else {
                selector = ".button-list-delete";
            }
            $(selector)
                .off()
                .click(async function () {
                    const codigo = this.dataset.c;
                    await self.delete(codigo);
                });

            if (typeof callback == "function") {
                callback();
            }

            if (typeof self.options.events.detailRender == "function") {
                self.options.events.detailRender(data.length, data);
            }

        });

    }

}
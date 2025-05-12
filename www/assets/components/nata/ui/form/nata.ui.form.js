/* globals localforage, $, app */

// eslint-disable-next-line no-unused-vars
class nataUIForm {
    constructor(options, events = {}) {
        this.options = options;
        this.events = events;

        const self = this;

        if (typeof options.detail == "undefined") options.detail = {};

        if (typeof options.detail.objectList != "undefined") {
            this.events.valid = function () {
                console.log("nataUIForm.events.valid");

                console.log(self.options);
                if (self.options.detail.objectList.dataset.list.length == 0) {
                    console.warn("paso 1: disabled");
                    document.getElementById("buttonNext").disabled = true;
                }
                else if (!app.form.valid) {
                    console.warn("paso 2: disabled");
                    document.getElementById("buttonNext").disabled = true;
                }
                else {
                    console.warn("paso 3: enabled");
                    document.getElementById("buttonNext").disabled = false;
                }
            };
        }
    }

    detailDelete(id) {
        console.log("detailDelete");
        const self = this;
        const objectList = self.options.detail.objectList;
        console.log(objectList.dataset.list);
        console.log(id);
        objectList.dataset.list = objectList.dataset.list.filter(function (record) {
            return record.i !== id;
        });
        console.log(objectList.dataset.list);
        localforage.setItem(self.options.detail.index, objectList.dataset.list).then(function () {
            self.detailRender();
        });

        if (typeof self.events.valid == "function") self.events.valid();
        if (objectList.dataset.list.length == 0) {
            document.getElementById("buttonNext").disabled = true;
        }
    }

}

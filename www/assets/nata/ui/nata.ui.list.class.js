/* globals doT, Clusterize, session, $, localforage */

// eslint-disable-next-line no-unused-vars
class nataUIList {
    constructor(dialog, config, events = {}, index, data, detail = {}, callbacks = {}) {
        this.dialog = dialog;
        this.config = config;
        this.events = events;
        this.index = index;
        this.detail = detail;
        this.data = data;
        console.log(callbacks);
        this.callbacks = callbacks;
        this.clusterize = undefined;
        //console.log(this.dialog);
        this.dataset = {
            list: []
        };
        this.render();
    }

    init() {
        console.log("nataUIList.init");
        const self = this;

        //TODO: adicionar get rows
        //console.log(self.data);

        if (typeof self.html == "undefined") {
            self.rows = self.getRows(self.data);
            //console.log(self.rows);
            //console.log(self.rows);
            self.html = self.htmlGet(self.rows);
        }

        //console.log(self.listHtml);
        //console.log(self.index);

        if (typeof self.clusterize == "undefined") {
            console.warn("montando la lista");
            self.clusterize = new Clusterize({
                rows: self.html,
                scrollId: "scroll-" + self.index,
                contentId: self.index,
                no_data_text: "No se han encontrado datos",
                //rows_in_block: 5,
                callbacks: {
                    clusterWillChange: function () {
                    },
                    clusterChanged: function () {
                        //console.log("clusterChanged");
                        //console.log($("#" + self.index).find(".list-group-item"));
                        /*
						$("#" + self.index)
							.find(".list-group-item")
							.off()
							.click(function () {
								self.click(this.dataset);
							});
						*/
                    },
                    scrollingProgress: function (progress) { }
                }
            });
        }
    }

    click(dataset) {
        console.log("nataUIList.click");
        const self = this;
        console.log(self.events);
        console.log(dataset);

        self.listUpdate(dataset);
        if (typeof self.events.onClick == "function") self.events.onClick(dataset);
    }

    destroy() {
        const self = this;
        $("#uiDialog-" + self.timestamp).remove();
        if (typeof self.clusterize !== "undefined") self.clusterize.destroy();
    }

    getRows (data = []) {
        console.log("nataUIList.getRows");
        //console.log(data);
        const self = this;

        let rows = [], i, tmp;
        if (data.length > 0) {
            rows = data.map(function (record) {
                tmp = "";
                //row.contador = ++contador;
                for (i=0; i<self.config.fieldsFilter.length; ++i) {
                    tmp += record[self.config.fieldsFilter[i]] + " ";
                }
                return {
                    dataset: record,
                    values: tmp,
                    markup: doT.template(self.config.templateRender)(record).toString().trim(),
                    active: true
                };
            });
        }
        //console.log(rows);
        return rows;
    }

    hide() {
        console.log("hide");
        const self = this;
        console.log(self.timestamp);
        $("#uiDialog-" + self.timestamp).hide();
    }

    htmlGet(data) {
        console.log("nataUIList.htmlGet");
        //console.log(data);
        const self = this;
        const results = [];
        var i;
        for (i = 0; i < data.length; i++) {
            if (data[i].active) results.push(data[i].markup);
        }

        const element = document.getElementById("count-" + self.index);
        if (element !== null) element.innerHTML = results.length;

        //console.log(results);

        return results;

    }

    refresh (callback) {
        console.log("nataUIList.refresh");
        const self = this;
        self.clusterize.update(self.getRows(self.data));
        if (typeof callback == "function") callback();
    }

    render() {
        console.log("nataUIList.render");
        console.log(this);
        const self = this;

        setTimeout(function() {
            //#region code

            console.log(self);
            console.log(self.config.element);

            self.config.element.innerHTML = doT.template(self.config.templateLayout)({id: self.index, search: true});
            self.init();

            if (typeof self.data == "undefined") self.data = [];
            if (self.data.length == 0) {
                //swal("No hay agenda", "No se ha encontrado agenda para el día de hoy", "error");
                console.error("No se ha encontrado agenda para el día de hoy");
                return false;
            }

            //#region FIX UI
            if (document.getElementById("txtSearchLayout-" + self.index) !== null) {
                let offsetTop = document.getElementById("txtSearchLayout-" + self.index).offsetTop;
                document.getElementById("scroll-" + self.index).style.maxHeight = session.height - offsetTop - 50 + "px";
            }
            //#endregion

            //#region search
            /*
			* Attach listener to search input tag and filter list on change
			*/
            const search = document.getElementById("txtSearchLayout-" + self.index);
            const buttonClear = document.getElementById("buttonSearchClear-" + self.index);

            const onSearch = function () {
                //console.log(search.value.toString().toLowerCase());
                //console.log(rows);
                const temporal = self.rows.filter(function (record) {
                    return (record.values.toString().toLowerCase().indexOf(search.value.toString().toLowerCase()) !== -1);
                });
                //console.log(temporal);
                //console.log(self.htmlGet(temporal));
                //self.clusterize.update(self.htmlGet(temporal));
                self.update(temporal);
            };
            if (document.getElementById("txtSearchLayout-" + self.index) !== null) {
                search.oninput = onSearch;
            }

            if (document.getElementById("txtSearchLayout-" + self.index) !== null) {
                buttonClear.onclick = function () {
                    search.value = "";
                    self.update(self.rows);
                };
            }
            //#endregion search

            if (typeof self.callbacks.render == "function") self.callbacks.render();

            //#endregion code

        }, 0.25 * 1000);
    }

    show(events = {}) {
        console.log("show");
        const self = this;
        let prop;
        for (prop in events) {
            if (Object.prototype.hasOwnProperty.call(events, prop)) {
                self.events[prop] = events[prop];
            }
        }
        console.log(self.events);
        $("#uiDialog-" + self.timestamp).show();
        $("#buttonDialogClose-uiDialog-" + self.timestamp)
            .off()
            .click(function () {
                $("#uiDialog-" + self.timestamp).hide();
                if (typeof events.formClose == "function") events.formClose();
            });

        $("#" + self.index)
            .find(".list-group-item")
            .off()
            .click(function () {
                self.click(this.dataset);
            });
    }

    timestampGet() {
        return this.timestamp;
    }

    update (data) {
        console.log("nataUIList.update");
        const self = this;
        const temporal = self.htmlGet(data);
        console.log(temporal);
        self.clusterize.update(temporal);
        if (typeof self.callback == "function") self.callback();
    }

    async listUpdate(dataset) {
        console.log("listUpdate");
        const self = this;
        console.log(dataset);

        self.dataset.list = self.dataset.list.filter(function (record) {
            return record.id !== dataset.id;
        });

        self.dataset.list.push({
            i: dataset.id,
            t: dataset.text
        });

        console.log(self.dataset.list);
        await localforage.setItem(self.indexLocalForage, self.dataset.list);
        self.style.display = "none";

        console.log(self.events);

        if (typeof self.events.click == "function") {
            self.events.click();
        }

        if (typeof self.form !== "undefined") self.form.detailRender();

        if (typeof self.events == "undefined") self.events = {};
        //if (typeof self.events.formValid == "function") self.events.formValid();

        if (typeof self.form != "undefined") {
            if (typeof self.form.events.valid == "function") self.form.events.valid();
        }
    }
}
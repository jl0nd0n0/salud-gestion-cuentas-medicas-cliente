/* globals  app, localforage, nataUIDialog, nata, session, Clusterize, dataCie */

app.cie10 = {
    dataset: [],

    export: {
        csv: function () {
            console.log("app.cie10.export.csv");
            const data = dataCie.map(function (record) {
                return {
                    "c": record.c,
                    "d": record.d
                };
            });
            app.core.export.csv(data, "codigo,descripcion");
        }
    },

    //FIX: deprecar, dejar app.cie10.render ..
    //FIX: no se ha corregido
    index: function () {
        console.log("%c app.cie10.index", "background: red; color: #fff;font-size: 11px");
        localforage.getItem("webworker-cie10").then(function (data) {

            if (typeof app.cie10.dialog == "undefined") {
                const html = nata.ui.template.get("templateListClusterize", {});
                app.cie10.dialog = new nataUIDialog({
                    height: "100%",
                    html: html,
                    width: "100%",
                    title: "CIE 10",
                    close: {
                        remove: false
                    }
                });

                //@audit revisar, se puede eliminar ?, quitar el componente hacerlo sencillo a capela
                if (typeof session.detail["CIE"] != "undefined") {
                    session.detail["CIE"].options.dialog = app.cie10.dialog;
                }

                var rows = [],
                    search = document.getElementById("search");

                rows = data.map(function (record) {
                    return {
                        values: record.values,
                        markup: record.markup,
                        active: true
                    };
                });

                // Fetch suitable rows
                const filterRows = function (rows) {
                    var results = [];
                    for (var i = 0, ii = rows.length; i < ii; i++) {
                        if (rows[i].active) results.push(rows[i].markup);
                    }
                    return results;
                };

                // Init clusterize.js
                const clusterize = new Clusterize({
                    rows: filterRows(rows),
                    scrollId: "scrollArea",
                    contentId: "listClusterize"
                });

                // Multi-column search
                const onSearch = function () {
                    console.log("onSearch");
                    for (var i = 0, ii = rows.length; i < ii; i++) {
                        var suitable = false;
                        for (var j = 0, jj = rows[i].values.length; j < jj; j++) {
                            if (rows[i].values[j].toString().toLowerCase().indexOf(search.value.toLowerCase()) + 1)
                                suitable = true;
                        }
                        rows[i].active = suitable;
                    }
                    clusterize.update(filterRows(rows));
                };
                search.oninput = onSearch;

                //@audit revisar, se puede eliminar ?, quitar el componente hacerlo sencillo a capela
                if (typeof session.detail["CIE"] != "undefined") {
                    session.detail["CIE"].eventDialogList();
                }
            }
            else {
                app.cie10.dialog.show();
            }

        });

        //};
    },

    //TODO: este médodo se hace por que el CIE 10 se llama en otro formulario, asi debe funcionar a futuro
    render: function (options, callback) {
        console.log("%c app.cie10.render", "background: red; color: #fff;font-size: 11px");

        const fx = function (data) {
            if ( typeof session.cie10.dialog == "undefined" ) {
                const fxCallback = function () {
                    var rows = [],
                        search = document.getElementById("search");

                    rows = data.map(function (record) {
                        return {
                            values: record.values,
                            markup: record.markup,
                            active: true
                        };
                    });

                    // Fetch suitable rows
                    const filterRows = function (rows) {
                        var results = [];
                        for (var i = 0, ii = rows.length; i < ii; i++) {
                            if (rows[i].active) results.push(rows[i].markup);
                        }
                        return results;
                    };

                    // Init clusterize.js
                    const clusterize = new Clusterize({
                        rows: filterRows(rows),
                        scrollId: "scrollArea",
                        contentId: "listClusterize"
                    });

                    // Multi-column search
                    const onSearch = function () {
                        console.log("onSearch");
                        for (var i = 0, ii = rows.length; i < ii; i++) {
                            var suitable = false;
                            for (var j = 0, jj = rows[i].values.length; j < jj; j++) {
                                if (rows[i].values[j].toString().toLowerCase().indexOf(search.value.toLowerCase()) + 1)
                                    suitable = true;
                            }
                            rows[i].active = suitable;
                        }
                        clusterize.update(filterRows(rows));
                    };
                    search.oninput = onSearch;

                    if (typeof callback == "function") callback();
                };

                const html = nata.ui.template.get("templateListClusterize", {});
                const settings = {
                    height: "100%",
                    html: html,
                    width: "100%",
                    title: "CIE 10",
                    close: {
                        remove: false
                    },
                    callback: fxCallback,
                    events:{}
                };
                if (typeof options.events !== "undefined") {
                    settings.events = options.events;
                }
                session.cie10.dialog = new nataUIDialog(settings);
                session.cie10.dialog.dialog.style.zIndex = "999999";
            }
            else {
                session.cie10.dialog.show();
            }
        };

        if (app.config.webworker) {
            localforage.getItem("webworker-cie10").then(function (data) {
                fx(data);
            });
        }
        else {
            fx(dataCie);
        }
        //};
    },
};

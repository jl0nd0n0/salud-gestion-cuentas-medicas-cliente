/* globals app, nataUIDialog, session, localforage, Clusterize, nata */

app.cums = {

    index: function () {
        console.trace("app.cums.index");
        //const myWorker = new Worker("assets/webworker/ww.cums.js");
        //myWorker.onmessage = function (oEvent) {
        //console.log("Worker said : " + oEvent.data);
        localforage.getItem("webworker-cums").then(function (data) {

            if (typeof app.cums.dialog == "undefined") {
                const html = nata.ui.template.get("templateListClusterizeCUMS", {});
                app.cums.dialog = new nataUIDialog({
                    height: "100%",
                    html: html,
                    width: "100%",
                    title: "CUMS",
                    close: {
                        remove: false
                    }
                });

                session.detail["CUMS"].options.dialog = app.cums.dialog;
                console.log(data);

                let rows = [],
                    search = document.getElementById("searchCUMS");

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
                    scrollId: "scrollAreaCUMS",
                    contentId: "listClusterizeCUMS"
                });

                // Multi-column search
                const onSearch = function () {
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

                session.detail["CUMS"].eventDialogList();
            }
            else {
                app.cums.dialog.show();
            }

        });
    }
};
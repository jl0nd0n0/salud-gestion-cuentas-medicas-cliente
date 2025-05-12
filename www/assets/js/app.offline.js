/* globals app, localforage, nata, session */

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded.app.offline");
    session.flujo.push("app.offline.js DOMContentLoaded");
    setInterval(function () {
        if (app.config.dev.online) {
            app.offline.send_v2();
        }
    }, app.config.offline.time.send * 1000);
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

app.offline = {
    dataset: {
        // app.offline.dataset.switch
        switch: true
    },
    keralty: {
        premium: {
            send: function (json) {
                console.trace("app.offline.keralty.premium.send");
                nata.ajax("post", json.url + "?ts=" + new Date().getTime(),json, "json",
                    function (response) {
                        console.log(response);
                        app.offline.removeItem(response[0].il);
                        if (typeof session.dialog !== "undefined") {
                            if (session.dialog !== null) {
                                session.dialog.destroy();
                            }
                        }
                        app.historiaClinica.core.consulta.cerrar(response[0]);
                    },
                    function (xmlhttp) {
                        console.error(xmlhttp);
                    },
                    60 * 1000
                );
            }
        }
    },
    removeItem: function (idlocal) {
        console.trace("app.offline.removeItem");
        console.log(idlocal);

        localforage.getItem("offline").then(function (data) {
            if (data === null) data = [];
            const temporal =  data.filter(function (record) {
                return record.idlocal != idlocal;
            });
            localforage.removeItem("offline");
            localforage.setItem("offline", temporal);
        });
    },
    setItem: function (idlocal, url, json, options = {}) {
        console.log("app.offline.setItem");

        const dataObject = Object.assign({}, json);
        dataObject.idlocal = idlocal;
        dataObject.url = url;
        if (Object.keys(options).length > 0) {
            dataObject.options = options;
        }
        console.log(dataObject);
        localforage.getItem("offline").then(function (dataRecord) {
            console.log(dataRecord);
            if (dataRecord === null) dataRecord = [];
            dataRecord = dataRecord.filter(function (record) {
                return record.idlocal != idlocal;
            });

            dataRecord.push(
                dataObject
            );

            console.log(dataObject);

            localforage.setItem("offline", dataRecord);
        });
    },
    send_v2: function () {
        console.log("app.offline.send_v2");
        localforage.getItem("offline").then(function (data) {
            if (data === null) data = [];
            console.log(data);
            let i;
            for (i = 0; i < data.length; ++i) {
                if (typeof data[i].m == "undefined") data[i].m = "";
                if (data[i].m == "keralty-premium-consulta") {
                    app.offline.keralty.premium.send(data[i]);
                }
                else {
                    nata.ajax("post", data[i].url + "?ts=" + new Date().getTime(), data[i], "json",
                        function (response) {
                            console.log(response);
                            app.offline.removeItem(response[0].il);
                            if (typeof session.dialog !== "undefined") {
                                if (session.dialog !== null) {
                                    session.dialog.destroy();
                                }
                            }
                            /* recuperar offline callback */
                            const idlocal = response[0].il;
                            const temporal = session.offline.callback.filter(function (record) {
                                return record.idlocal == idlocal;
                            });
                            if (temporal.length == 1) {
                                console.log(temporal[0].fx());
                                temporal[0].fx();
                            }
                        },
                        function (xmlhttp) {
                            console.error(xmlhttp);
                        },
                        60 * 1000
                    );
                }
            }
        });
    }
};
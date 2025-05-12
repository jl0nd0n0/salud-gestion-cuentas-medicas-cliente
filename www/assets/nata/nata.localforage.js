/* global $, nata, localforage, app */

nata.localforage = {

    addItem: async function (index, data, propKey = "", valueKey, callback) {
        console.log("nata.localforage.addItem");
        let temporal = await nata.localforage.getItem(index.toString());
        nata.localStorage.setItem("debug", temporal);
        console.log(nata.localStorage.getItem("debug"));
        // evitar que se duplique el objeto
        temporal = temporal.filter(function (record) {
            return record[propKey] != valueKey;
        });
        nata.localStorage.setItem("debug", temporal);
        console.log(nata.localStorage.getItem("debug"));
        // adicionar el objeto
        temporal.push(data);

        nata.localStorage.setItem("debug", temporal);
        console.log(nata.localStorage.getItem("debug"));

        localforage.setItem(index, temporal).then(function () {
            nata.localStorage.setItem("debug-1", temporal);
            console.log(nata.localStorage.getItem("debug-1"));

            if (typeof callback == "function") callback();
        });

    },

    append: async function (index, json, key) {
        if (app.config.dev.verbose.secundario) console.log("nata.localforage.append");

        let data = await localforage.getItem(index);
        if (data === null) data = [];
        //nata.localStorage.setItem("debug", data);
        //console.log(json);
        data = data.filter(function (record) {
            //console.log(record[key], json[key]);
            //console.log(record[key] != json[key]);
            return record[key] != json[key];
        });
        data.push(json);
        //nata.localStorage.setItem("debug-1", data);
        //console.log(data);
        await localforage.setItem(index, data);
        return data;
    },

    appendUnique: async function (index, json, attr, value) {
        if (app.config.dev.verbose.secundario) console.log("nata.localforage.appendUnique");

        let data = await localforage.getItem(index);
        if (data === null) data = [];
        data = data.filter(function (record) {
            return record[attr] != value;
        });
        console.log(data);
        data.push(json);
        localforage.setItem(index, data);
        return data;
    },

    getItem: async function (index) {
        let data = await localforage.getItem(index);
        if (data === null) data = [];
        return data;
    },

    load: function (pathSufix, dataType, params) {
        try {
            //console.log("nata.localforage.load");

            let asyncLoop = function (o) {
                let i = -1, length = o.length;

                let loop = function () {
                    i++;
                    if (i == length) {
                        o.callback();
                        return;
                    }
                    o.functionToLoop(loop, i);
                };
                loop();//init
            };

            asyncLoop({
                length: params.length,
                functionToLoop: function (loop, i) {
                    setTimeout(function () {

                        localforage.getItem(params[i].index, params[i].profile)
                            .then(function (value) {
                                /*console.log("********************************************************");
                                console.log(value);
                                console.log(dataType);
                                console.log(params[i]);
                                console.log(params[i].callback);
                                console.log("********************************************************");*/

                                if (value === null) {
                                    nata.localforage.loadServer(dataType, params[i]);
                                }
                                else {
                                    if (typeof params[i].callback == "function") params[i].callback(value);
                                }
                            });

                        loop();
                    }, 1000);
                },
                callback: function () {
                    //console.log("done !");
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    },

    loadServer: function (dataType, request) {
        "use strict";
        console.log("loadServer");
        //console.log(request);

        var url = request.url,
            index = request.index,
            beforeCallback = request.beforeCallback,
            //profile = request.profile || "",
            callback = request.callback;

        $.ajax({
            type: "get",
            dataType: dataType.toString(),
            url: url.toString(),
            async: true,
            cache: false,
            beforeSend: function () {
                if (typeof beforeCallback === "function") {
                    beforeCallback();
                }
            }
        }).done(function (data) {
            //nata.localforage.add(index, data);
            console.log(index);
            console.log(data);
            localforage.setItem(index, data).then(function () {

                //app.usuario.perfil.tablas.descarga.validar(index, profile, callback, data);
                if (typeof callback === "function") {
                    callback(data);
                }

            });

        }).fail(function (XHR, status, error) {
            console.log(url.toString());
            console.log(error);
        });

        delete window.url;
        delete window.index;
        delete window.beforeCallback;
        delete window.callback;
    },

    removeItem: async function (index, prop1, prop2 = "", value1, value2 = "") {
        console.log("nata.localforage.removeItem");
        let data = await nata.localforage.getItem(index);
        //console.log(data);
        data = data.filter(function (record) {
            if (prop2 == "") {
                return record[prop1] != value1;
            }
            else {
                return record[prop1] + "-" + record[prop2] != value1 + "-" + value2;
            }
        });
        console.log(data);
        await localforage.setItem(index, data);
        return data;
    },

    update: async function (index, json, attr) {
        if (app.config.dev.verbose.secundario) console.log("nata.localforage.update");

        let data = await localforage.getItem(index);
        if (data === null) data = [];

        let record = data.filter(function (record) {
            return record[attr] == json[attr];
        })[0];

        if (typeof record == "undefined") record = {};

        data = data.filter(function (record) {
            return record[attr] != json[attr];
        });

        for (let prop in json) {
            if (Object.prototype.hasOwnProperty.call(json, prop)) {
                // do stuff
                //console.log(prop);
                record[prop] = json[prop];
            }
        }

        delete record.if;

        console.log(record);
        data.push(record);
        localforage.setItem(index, data);

        console.log(data);
        return data;
    }
};
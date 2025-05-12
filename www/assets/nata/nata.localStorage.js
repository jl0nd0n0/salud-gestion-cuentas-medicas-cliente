/* globals nata, app, CryptoJS */

//console.log(atenea);
nata.localStorage = {
    // member
    addItem: function (index, data, propKey = "", valueKey) {
        try {
            console.log("nata.localStorage.addItem");
            let temporal = nata.localStorage.getItem(index.toString());
            // evitar que se duplique el objeto
            temporal = temporal.filter(function (record) {
                return record[propKey] != valueKey;
            });
            // adicionar el objeto
            temporal.push(data);

            if (propKey !== "") {
                temporal = nata.localStorage.ordenar(temporal, propKey);
            }

            console.log(temporal);

            nata.localStorage.setItem(index, temporal);
            temporal = null;
        }
        catch (err) {
            console.log(err);
        }
    },

    existItem: function ( index ) {
        const data = nata.localStorage.getItem( index );
        if (Array.isArray(data)) {
            if (data.length == 0) return false;
            else return data;
        }
        else {
            if (typeof data == "object") return data;
            else return false;
        }
    },

    getFilter: function (index, name, value, first) {
        "use strict";
        try {
            //console.log("localStorage.getFilter");
            //console.log(value);
            if (typeof first === "undefined") {
                first = false;
            }
            /*console.log(index);
			console.log(localStorage);*/
            var data = JSON.parse(window.localStorage.getItem(index.toString())), result = [], i;
            //console.log(data);

            if (data == null) {
                data = [];
            }

            if (data.length === 0)
                return result;

            for (i = 0; i < data.length; i++) {
                //console.log(data[i]);
                if (typeof data[i][name] === "undefined") {
                    console.error("nata.localStorage -> getFilter: " + index + " - " + name.toString() + " is undefined");
                    return;
                }
                /*console.log(data[i][name].toString());
				console.log(value.toString());*/

                if (data[i][name].toString().trim() == value.toString().trim()) {
                    result.push(data[i]);
                    if (first) {
                        break;
                    }
                }
            }

            delete window.data;
            delete window.i;
            return result;
        }
        catch (error) {
            console.log(value);
            console.log(error);
        }

        delete window.data;
        delete window.i;
        return result;
    },

    getFilterArray: function (data, name, value) {
        "use strict";
        var result = [], i;
        if (data.length === 0)
            return result;

        if (value === null)
            return result;

        for (i = 0; i < data.length; i++) {
            if (typeof data[i][name] === "undefined") {
                console.error("nata.localStorage -> " + name.toString() + " is undefined");
                return;
            }
            if (data[i][name].toString() === value.toString()) {
                result.push(data[i]);
                break;
            }
        }

        delete window.i;
        return result;
    },

    getFilterLike: function (index, name, value, first) {
        "use strict";
        try {
            console.log("localStorage.getFilter");
            //console.log(value);
            if (typeof first === "undefined") {
                first = false;
            }
            /*console.log(index);
			console.log(localStorage);*/
            var data = JSON.parse(window.localStorage.getItem(index.toString())), result = [], i;
            /*console.log(data);*/

            if (data === null) {
                return result;
            }

            if (data.length === 0)
                return result;

            for (i = 0; i < data.length; i++) {
                if (typeof data[i][name] === "undefined") {
                    console.error("nata.localStorage -> getFilter: " + index + " - " + name.toString() + " is undefined");
                    return;
                }
                /*console.log(data[i][name].toString());
				console.log(value.toString());*/

                if (data[i][name].toString().indexOf(value.toString()) !== -1) {
                    result.push(data[i]);
                    if (first) {
                        break;
                    }
                }
            }

            delete window.data;
            delete window.i;

            return result;
        }
        catch (error) {
            console.log(value);
            console.log(error);
        }

        delete window.data;
        delete window.i;
        return result;
    },

    getItem: function ( index ) {
        let data;
        if (app.config.dev.mode) {
            data = window.localStorage.getItem(index);
            //console.log(data);
            if (data === null) return [];
            data = JSON.parse(data);
        }
        else {
            const key = CryptoJS.SHA256(index, app.config.cripto.secretKey).toString();
            data = window.localStorage.getItem(key);
            //console.log(data);
            if (data === null) return [];
            data = CryptoJS.AES.decrypt( data, key );
            data = data.toString(CryptoJS.enc.Utf8);
            //console.log(data);
            data = JSON.parse(data);
        }

        return data;
    },

    getItemObject: function (index) {
        "use strict";
        let data;
        if (app.config.dev.mode) {
            data = window.localStorage.getItem(index);
            //console.log(data);
            if (data === null) return {};
            data = JSON.parse(data);
        }
        else {
            const key = CryptoJS.SHA256(index, app.config.cripto.secretKey).toString();
            data = window.localStorage.getItem(key);
            //console.log(data);
            if (data === null) return {};
            data = CryptoJS.AES.decrypt( data, key );
            data = data.toString(CryptoJS.enc.Utf8);
            //console.log(data);
            data = JSON.parse(data);
        }

        return data;
    },

    load: function (pathSufix, dataType, params) {
        "use strict";
        try {
            if (app.config.dev.verbose.secundario) console.log("*** load ***");
            var i, data, callback;
            for (i = 0; i < params.length; ++i) {
                callback = params[i].callback;
                data =nata.localStorage.getItem(params[i].index);
                if (data === null) {
                    data = [];
                }

                if (data.length > 0) {
                    if (typeof callback === "function") {
                        callback(data);
                    }
                }
                else {
                    nata.localStorage.loadServer(pathSufix, dataType, params[i]);
                }
            }
            delete window.i;
            delete window.callback;
            delete window.data;
        }
        catch (error) {
            console.log(error);
        }
    },

    loadServer: function (pathSufix, dataType, row) {
        "use strict";

        if (typeof row == "undefined") {
            return false;
        }

        if (typeof row.url == "undefined") {
            return false;
        }

        //console.log(row);

        var url = pathSufix + row.url,
            beforeCallback = row.beforeCallback,
            callback = row.callback;

        if (typeof beforeCallback === "function") {
            beforeCallback();
        }

        nata.ajax("get", url.toString(), {}, dataType.toString(), function (data) {
            nata.localStorage.setItem(row.index, data);
            if (typeof callback === "function") {
                callback(data);
            }
        });
    },

    ordenar: function (data, member) {
        try {
            data.sort(function (a, b) {
                var dataA = a[member].toLowerCase(), dataB = b[member].toLowerCase();
                if (dataA < dataB) {
                    return -1;
                }
                if (dataA > dataB) {
                    return 1;
                }
                return 0;
                //default return value (no sorting)
            });
            return data;
        }
        catch (error) {
            console.log(error);
        }

    },

    remove: function (options) {
        if (app.config.dev.verbose.secundario) console.log("nata.localStorage.remove");
        //index, attribute, value
        let data = nata.localStorage.getItem(options.index);
        if (data === null) data = [];
        data = data.filter(function (record) {
            return record[options.attribute] != options.value;
        });
        nata.localStorage.setItem(options.index, data);
        return data;
    },

    removeItem: function (index, prop, value) {
        "use strict";
        console.log("removeItem");
        try {
            let data = nata.localStorage.getItem(index);
            //console.log(data);
            data = data.filter(function (record) {
                return record[prop] != value;
            });
            console.log(data);
            nata.localStorage.setItem(index, data);
            data = null;
        }
        catch (error) {
            console.log("nata.localStorage.removeItem");
            console.log(error);
        }
    },

    removeItemArray: function (json, value, member) {
        for (var i = 0; i < json.length; i++) {
            if (typeof value == "undefined")
                break;

            if (typeof json[i][member] == "undefined") {
                member = "id";
            }

            if (json[i][member].toString() == value.toString()) {
                nata.localStorage.removeItem(json, member, value);
            }
        }
        return json;
    },

    setItem: function (index, data) {
        "use strict";
        //console.trace(data);
        let temporal = JSON.stringify(data);
        //console.log(temporal);
        if (app.config.dev.mode) {
            window.localStorage.setItem(index, temporal);
        }
        else {
            temporal = nata.crypto.encript(index, temporal);
            window.localStorage.setItem(CryptoJS.SHA256(index, app.config.cripto.secretKey).toString(), temporal);
        }
    },

    update: function (index, data) {
        console.log("localStorage.update");
        var dataLocal = nata.localStorage.getItem(index),
            temporal = [], i;

        console.log(data);
        console.log("ID:" + data[0].id);

        for (i = 0; i < dataLocal.length; ++i) {
            if (dataLocal[i].id !== data[0].id) {
                temporal.push(dataLocal[i]);
            }
            else {
                console.log("ENCONTRE EL ITEM");
                console.log(data);
                temporal.push(data[0]);
            }
        }
        //console.log(window.localStorage);
        window.localStorage.removeItem(index);
        nata.localStorage.setItem(index, temporal);

    },

    updateItem: function (index, member, value, data) {
        try {
            console.log("localStorage.updateItem");
            var temporal =nata.localStorage.getItem(index), i;
            for (i = 0; i < temporal.length; ++i) {
                if (temporal[i][member].toString() === value.toString()) {
                    console.log("paso 80 001");
                    console.log(data);
                    temporal[i] = data;
                    console.log(temporal[i]);
                    break;
                }
            }
            window.localStorage.removeItem(index);
            nata.localStorage.setItem(index, temporal);
        }
        catch (err) {
            console.log(err);
        }
    },

    testing: {
        index: function () {
            const test = {
                a: 1,
                b: 2
            };
            nata.localStorage.setItem("testing", test);
            const data = nata.localStorage.getItem("testing");
            console.log(data);
        }
    }
};
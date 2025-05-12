/* globals nata, app */
nata.sessionStorage = {
    append: function (index, json) {
        if (app.config.dev.verbose.secundario) console.log("nata.sessionStorage.append");

        const data = nata.sessionStorage.getItem(index);
        data.push(json);
        nata.sessionStorage.setItem(index, data);

        return data;
    },

    getItem: function (index) {
        if (app.config.dev.verbose.secundario) console.log("nata.sessionStorage.getItem");
        return (sessionStorage.getItem(index) == null ? [] : JSON.parse(sessionStorage.getItem(index)));

    },

    getItemV1: function (index) {
        if (app.config.dev.verbose.secundario) console.log("nata.sessionStorage.getItem");
        return (sessionStorage.getItem(index) == null ? {} : JSON.parse(sessionStorage.getItem(index)));

    },

    setItem: function (index, data) {
        if (app.config.dev.verbose.secundario) console.log("nata.sessionStorage.setItem");
        sessionStorage.setItem(index, JSON.stringify(data));
    },

    remove: function (options) {
        if (app.config.dev.verbose.secundario) console.log("nata.sessionStorage.remove");
        //index, attribute, value
        let data = nata.sessionStorage.getItem(options.index);
        if (data === null) data = [];
        data = data.filter(function (record) {
            return record[options.attribute] != options.value;
        });
        nata.sessionStorage.setItem(options.index, data);
        return data;
    },

    removeItem(index) {
        sessionStorage.removeItem(index);
    }
};
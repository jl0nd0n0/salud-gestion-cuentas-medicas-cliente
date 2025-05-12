/* global app, nata */

if (typeof app.adapter == "undefined") {
    app.adapter = {};
}

if (typeof app.adapter.widget == "undefined") {
    app.adapter.widget = {};
}

app.adapter.widget.combo = {
    get: function (consecutivo, data, indexEndpoint) {
        console.log("app.adapter.widget.combo.get");
		
        if (typeof indexEndpoint == "undefined") {
            indexEndpoint = "";
        }

        if (indexEndpoint != "") {
            console.log(window[indexEndpoint]);
            return window[indexEndpoint];
        }
        else {

            if (typeof data == "undefined") {
                console.error("Error, no se ha recibido el dominio del combo: 'id:valor|id:valor'. Consecutivo " + consecutivo);
                console.error(data);
                return [];
            }

            var temporal = data.split("|");
            //console.log(temporal);
            //console.log(temporal.length);

            if (temporal.length == 1) {
                console.error("Error en el dominio del combo, recuerde que debe venir: 'id:valor|id:valor'. Consecutivo " + consecutivo);
                console.error(data);
                return [];
            }

            var i, dataCombo = [], tempo;
            for (i = 0; i < temporal.length; ++i) {
                tempo = temporal[i].split(":");
                //console.log(tempo);
                //TODO: Por si llega algun dato vacio
                if (typeof tempo[0] != "undefined" && typeof tempo[1] != "undefined") {
                    dataCombo.push({
                        i: tempo[0].trim(),
                        t: tempo[1].trim()
                    });
                }
            }
        }

        return dataCombo;
    }
};

app.adapter.widget.multiple = {
    get: function (consecutivo, data, indexEndpoint, indexLocalStorage, response = []) {
        if (app.config.dev.verbose.secundario) console.log("app.adapter.widget.get");

        if (typeof indexEndpoint == "undefined") {
            indexEndpoint = "";
        }

        if (typeof indexLocalStorage == "undefined") {
            indexLocalStorage = "";
        }

        if (indexLocalStorage != "") {
            return nata.localStorage.getItem(indexLocalStorage);
        }
        else if (indexEndpoint != "") {
            console.log(window[indexEndpoint]);
            return window[indexEndpoint];
        }
        else {

            if (typeof data == "undefined") {
                console.error("Error, no se ha recibido el dominio del combo: 'id:valor|id:valor'. Consecutivo " + consecutivo);
                console.error(data);
                return [];
            }

            var temporal = data.split("|");
            //console.log(temporal);
            //console.log(temporal.length);

            if (temporal.length == 1) {
                console.error("Error en el dominio del combo, recuerde que debe venir: 'id:valor|id:valor'. Consecutivo " + consecutivo);
                console.error(data);
                return [];
            }

            var i, dataAdapter = [], tempo, contador;
            for (i = 0; i < temporal.length; ++i) {
                tempo = temporal[i].split(":");
                //console.log(tempo);
                //TODO: Por si llega algun dato vacio
                if (typeof tempo[0] != "undefined" && typeof tempo[1] != "undefined") {

                    contador = response.filter(function (element) {
                        return element == tempo[0].trim();
                    }).length;

                    dataAdapter.push({
                        i: tempo[0].trim(),
                        t: tempo[1].trim(),
                        checked: (contador > 0 ? true : false)

                    });
                }
            }
        }

        return dataAdapter;
    }
};
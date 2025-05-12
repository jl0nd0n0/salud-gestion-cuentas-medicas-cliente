/* global nata, app */

const fx = function (method, url, data, typeResponse, callback, callbackError, timeout = 0, self = {}) {

    if (typeof typeResponse == "undefined") {
        typeResponse = "json";
    }

    const xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        //console.log(xmlhttp.readyState);
        switch (xmlhttp.readyState) {
        case 0:
            //console.log("UNSENT");
            break;
        case 1:
            //console.log("OPENED");
            break;
        case 2:
            //console.log("HEADERS_RECEIVED");
            break;
        case 3:
            //console.log("LOADING");
            break;
        case 4:
            //console.log("DONE");
            break;
        }

        const jsonValid = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        //console.log(xmlhttp.readyState);
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
            if (xmlhttp.status == 200) {
                // llamar con callback(data)
                if (typeof callback == "function") {
                    //console.log(xmlhttp.responseText);
                    if (typeResponse == "json") {
                        if (jsonValid(xmlhttp.responseText)) {
                            callback(JSON.parse(xmlhttp.responseText), self.params);
                        }
                        else {
                            console.error(url, "No se han recibido datos validos del servidor");
                        }
                    }
                    else {
                        console.error("No se han recibido datos json");
                        return false;
                        //callback(xmlhttp.responseText);
                    }
                }
                else {
                    //console.error("No se ha recibido callback para el ajax !!");
                    return false;
                }
            }
            //DANGER: deprecado, se controla en xmlhttp.onerror ??
            /*
            else if(xmlhttp.status == 0){
                alert("este estado significa que esta desconectado de internet");
            }
            */
        }
    };

    xmlhttp.onerror = function(e) {
        console.log(e);
        if (typeof callbackError == "function") callbackError();
    };

    xmlhttp.open(method, url, true);

    if (typeof app.config == "undefined") console.error("NO SE HA CONFIGURADO: app.config.ajax.timeout");
    if (typeof app.config.ajax == "undefined") console.error("NO SE HA CONFIGURADO: app.config.ajax.timeout");
    if (typeof app.config.ajax.timeout == "undefined") console.error("NO SE HA CONFIGURADO: app.config.ajax.timeout");

    xmlhttp.timeout = timeout * 1000;
    if (typeof data != "undefined") {
        //xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify(data));
    }
    else {
        xmlhttp.send();
    }
};

nata.ajax = fx;

// eslint-disable-next-line no-unused-vars
class nataAjax {
    constructor(params) {
        this.params = params;
    }

    send(method, url, data, typeResponse, callback, callbackError, timeout = 0) {
        const self = this;
        fx(method, url, data, typeResponse, callback, callbackError, timeout, self);
    }
}
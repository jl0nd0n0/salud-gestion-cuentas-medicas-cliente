/* global app, nata, divipola, swal, localforage, session */

app.adapter = {
    divipola: {
        helpers: {
            departamentoGet: function () {
                if (app.config.dev.verbose.secundario) console.log("app.adapter.divipola.get");

                const data = divipola.map(function (record) {
                    return {
                        i: record.id,
                        d: record.d
                    };
                });

                const by = property => function (object) {
                    const value = object[property];
                    return !(this.has(value) || !this.add(value));
                };

                return nata.fx.json.array.sort(data.filter(by("d"), new Set), "d");
            },

            municipioGet: function (id) {
                if (app.config.dev.verbose.secundario) console.log("app.adapter.divipola.helpers.municipioGet");
                var data = divipola.filter(function (record) {
                    return record.id == id;
                });
                data = data.map(function (record) {
                    return {
                        i: record.im,
                        m: record.m
                    };
                });
                return nata.fx.json.array.sort(data, "m");
            }
        },
        get: function () {
            if (app.config.dev.verbose.secundario) console.log("app.adapter.divipola.get");
            return app.adapter.divipola.helpers.departamentoGet();
        },
        municipio: {
            get: function (id) {
                if (app.config.dev.verbose.secundario) console.log("app.adapter.divipola.municipio.get");
                return app.adapter.divipola.helpers.municipioGet(id);
            }
        }
    },
    hc: {
        insert: {
            attributoGet: function (jsonData) {
                console.log("%c Aquí se ajustan los datos de HC ...", "background:red;color:white;font-weight:bold;font-size:12px");
                let i, response = {};
                for (i = 0; i < jsonData.length; ++i) {
                    console.log(jsonData[i]);

                    if (typeof jsonData[i].r != "undefined") {
                        if (typeof jsonData[i].atr == "undefined") {
                            swal("Error Configuracion", "No se han asignado los atributos de este formulario", "error");
                            break;
                        }
                        console.log(jsonData[i].atr.toString().trim());
                        if (typeof jsonData[i].r == "undefined") jsonData[i].r = "";

                        if (jsonData[i].tr == "tension-arterial") {
                            console.log(jsonData[i]);
                            response["ta"] = jsonData[i].r.s + "/" + jsonData[i].r.d;
                        }
                        else {
                            console.log(jsonData[i].r.toString().trim());
                            response[jsonData[i].atr.toString().trim()] = jsonData[i].r;
                            console.log(response[jsonData[i].atr.toString().trim()]);
                        }
                    }
                }
                console.log(response);
                return response;
            },
            core: async function (dataLocal, escala) {
                console.log("app.adapter.hc.insert.core");
                console.log(dataLocal);
                let i;
                for (i = 0; i < dataLocal.json.length; ++i) {
                    if (typeof dataLocal.json[i].atr == "undefined") {
                        console.error("Digale a Paola que cargue lo que ya le habia dicho !!!");
                        alert("Digale a Paola que cargue lo que ya le habia dicho !!!");
                        return false;
                    }
                }

                const jsonAtributos = app.adapter.hc.insert.attributoGet(dataLocal.json);
                console.log(jsonAtributos);

                const data = Object.assign({}, jsonAtributos);
                console.log(data);

                // paso 1, convertir el datalocal
                let temporal = {};
                let item, value;
                for (i = 0; i < dataLocal.json.length; ++i) {
                    item = dataLocal.json[i].atr;
                    value = dataLocal.json[i]["r"];
                    console.log(item, value);
                    temporal[item] = value;
                }
                console.log(temporal);

                // paso 2, asignar los atributos
                for (item in data) {
                    console.log(item);
                    console.log(temporal[item]);
                    data[item] = temporal[item];
                }

                // paso 3, asignar datos de session
                data.ios = dataLocal.ios;
                data.if = dataLocal.if;
                data.dd = nata.fx.date.getDay();
                data.dm = nata.fx.date.getMonth();
                data.dy = nata.fx.date.getYear();

                if (escala == "news") {
                    console.log(dataLocal.json[0].r);
                    let total = 0, prop;
                    for (prop in dataLocal.json[0].r) {
                        console.log(prop);
                        total += parseInt(dataLocal.json[0].r[prop].value);
                    }
                    data.nt = total;
                }
                /*
                data.cs = dataLocal.cs;
                data.ipa = dataLocal.ipa;
                data.nos = dataLocal.nos;
                data.s = dataLocal.s;
                */

                console.log(data);
                return data;
            },
            indice: async function (idOrdenServicio, idFormulario, modulo) {
                console.log("app.adapter.hc.insert.indice");

                let dataAgenda = await localforage.getItem("agenda");
                if (dataAgenda === null) dataAgenda = [];
                dataAgenda = dataAgenda.filter(function (record) {
                    return record.ios == idOrdenServicio;
                })[0];

                const data = {
                    ios: idOrdenServicio,
                    cs: dataAgenda.cs,
                    nos: dataAgenda.nos,
                    s: dataAgenda.s,
                    i: "",
                    if: idFormulario,
                    m: modulo,
                    ipa: dataAgenda.ipa,
                    f: await app.historiaClinica.core.consulta.fechaGet( idOrdenServicio ),
                    dy: nata.fx.date.getYear(),
                    dm: nata.fx.date.getMonth(),
                    dd: nata.fx.date.getDay(),
                    il: new Date().getTime()
                };
                return data;
            }
        }
    },
    parte: {
        get: function () {
            console.log("app.adapter.parte.get");
            return {
                tipoPersona: [
                    {
                        i: 1,
                        t: "Persona Natural"
                    },
                    {
                        i: 2,
                        t: "Persona Jurídica"
                    }
                ],
                tipoIdentificacion: [
                    {
                        i: 1,
                        t: "Cédula Ciudadanía"
                    },
                    {
                        i: 2,
                        t: "Cédula Extranjería"
                    },
                    {
                        i: 3,
                        t: "Pasaporte"
                    },
                    {
                        i: 4,
                        t: "RUT"
                    }
                ]
            };
        }
    },
    widget: {
        combo: {
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
        },
        multiple: {
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
        }
    }
};
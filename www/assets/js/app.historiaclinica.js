/* global app, $, session, nata, localforage, swal, alasql, nataUIFormBasic, nataUIListDetail,
    localforage, nataUIDialog, artemisaHistoriaClinica, oState, dayjs, templates_, doT
*/

app.historiaClinica = {
    core: {
        consulta: {
            cerrar: function(json, boolMostrarTransaccion = true) {
                console.trace("app.historiaClinica.core.consulta.cerrar");
                console.log(json);
                console.log(json.idlocal);
                //#region actualizar el estado de la agenda
                localforage.getItem("agenda").then(function (dataAgenda) {
                    console.log(dataAgenda);
                    dataAgenda = dataAgenda.filter(function (record) {
                        return record.ios != json.ios;
                    });
                    localforage.setItem("agenda", dataAgenda);
                });
                //#endregion actualizar estado de la agenda

                console.log(json.ios);
                const element = document.querySelector("#liAgenda-" + json.ios);
                if (element !== null) element.remove();
                app.offline.removeItem(json.idlocal);

                if (boolMostrarTransaccion) {
                    if (session.dialog.dialog !== null) {
                        session.dialog.dialog.querySelector(".ui-dialog-body").innerHTML = "<div class='w-100 p-2'>Has realizado el precierre del caso.<br># Transacción: " +  json.idlocal + "</div>";
                    }
                }
                else {
                    session.dialog.dialog.querySelector(".ui-dialog-body").innerHTML = "<div class='w-100 p-2'>Has cerrado la consulta</div>";
                }
            },
            fechaGet: async function ( idOrdenServicio) {
                console.log("%c app.historiaClinica.core.consulta.fechaGet", "background:red;color:#fff;font-size:11px;font-weight:bold;");
                // recuperar la fecha de consulta de la historia clinica
                let data = await localforage.getItem( "historia-clinica" );
                if ( data.length == 0 ) {
                    const message = "No se ha recibido la fecha de consulta";
                    swal(app.config.title, message, "error");
                    console.error(message);
                    return false;
                }
                data = data.filter(function ( record ) {
                    return record.ios == idOrdenServicio && record.m == "datos-basicos";
                });
                if ( data.length == 0 ) {
                    const message = "No se ha recibido la fecha de consulta";
                    swal(app.config.title, message, "error");
                    console.error(message);
                    return false;
                }
                console.log ( data );
                const json = JSON.parse( data[0].json );
                console.log ( json );
                return json.hc_fecha;
            }
        },
        header: {
            show: async function (idPaciente, idOrdenServicio, boolServicio = true, boolToolbar = true, boolGetHTML = false) {
                console.trace("%c app.historiaClinica.core.header.show", "background:red;color:#fff;font-size:11px;font-weight:bold;");
                // #region header paciente

                await app.historiaClinica.core.session.paciente.set(idOrdenServicio);

                if (typeof idPaciente == "undefined" || (typeof idPaciente == "string" && idPaciente == "undefined")) {
                    const message = "No se recibio el parámetro: idPaciente";
                    swal("Error Dev", message, "error");
                    console.error(message);
                    return false;
                }

                let dataAgenda = await await localforage.getItem("agenda");
                if (dataAgenda === null) dataAgenda = [];
                dataAgenda = dataAgenda.filter(function (record) {
                    return record.ios == idOrdenServicio;
                });

                const dataServicio = dataAgenda.map(function (record) {
                    return {
                        id: record.nos,
                        codigo: record.cs,
                        descripcion: record.s
                    };
                });

                const obj = { servicio: dataServicio[0] };
                oState.setProp( "paciente", obj );

                let data = await localforage.getItem("historia-clinica");
                if (data === null) data = [];
                data = data.filter(function (record) {
                    return record.ipa == idPaciente;
                });

                const temporal = {};

                if (boolToolbar) {
                    temporal.toolbar = {
                        ipa: idPaciente,
                        ios: idOrdenServicio,
                        registros: data.length,
                        registrado: dataAgenda[0].registrado,
                        dev: {
                            mode: app.config.dev.mode
                        }
                    };
                }

                if (boolServicio) {
                    temporal.servicio = dataServicio[0];
                }

                //console.log(temporal);
                if (boolGetHTML) {
                    //document.getElementById("container-header").style.display = "none";
                    const html = await app.core.ui.paciente.show(document.getElementById("container-header"), temporal, true);
                    //console.log(html);
                    return html;
                }
                else {
                    //console.log(temporal.toolbar);
                    app.core.ui.paciente.show(document.getElementById("container-header"), temporal, false, undefined, idOrdenServicio);
                }
                dataAgenda = null;
                data = null;
                //#endregion header paciente
            },
            showV1: async function ( idOrdenServicio ) {
                console.trace("%c app.historiaClinica.core.header.showV1", "background:red;color:#fff;font-size:10px;font-weight:bold;");
                console.log( idOrdenServicio );
                const element = document.getElementById("container-header");
                let data = await localforage.getItem("agenda");
                data = data.filter(function (record) {
                    return record.ios == idOrdenServicio;
                });

                if ( data.length == 0 ) {
                    const message = "Error inesperado";
                    swal("Error", message, "error");
                    console.error(message);
                    return false;
                }

                console.log( data[0] );
                const cantidadDatosBasicos = data[0].cdb;
                element.render( "templatePacienteHeader-hc", data[0] );
                if ( document.querySelector(".button-nata-ui-animate") !== null ) {
                    setTimeout(() => {
                        document.querySelector(".button-nata-ui-animate").classList.add("ball");
                    }, 1.25 * 1000);
                    setTimeout(() => {
                        document.querySelector(".button-nata-ui-animate").classList.remove("ball");
                    }, 3 * 1000);
                }
                element.style.display = "block";
                console.log( cantidadDatosBasicos );
                if ( cantidadDatosBasicos > 0) {
                    $( "#medicoAgenda .button-hc-evolucion, #container-header .button-hc-evolucion" ).removeClass( "disabled" );
                }

                //@todo control boton cerrar
                const oArtemisaHC = new artemisaHistoriaClinica();
                oArtemisaHC.activateCloseItem( idOrdenServicio );
            }
        },
        CUMSCUPS: {
            activarLocal: async function (index) {
                console.log("app.historiaClinica.core.CUMSCUPS.activarLocal");
                let i, data = await localforage.getItem(index);
                for (i = 0; i < data.length; ++i) {
                    data[i].boolLocal = 1;
                }
                await localforage.setItem(index, data);
            }
        },
        //detalle: si la tabla es maestro detalle, aquí se envia el detalle
        insertar: async function (options = {}, idPaciente, idOrdenServicio, index = "", escala = "", callback) {
            console.log("%c app.historiaClinica.core.insertar ", "background: orange; color: #fff;");

            // se debe mostrar el dialogo por defecto al enviar los datos al servidor ??
            let boolShowDialog;
            if (typeof options.boolShowDialog == "undefined") {
                boolShowDialog = true;
                if (escala != "") {
                    boolShowDialog = false;
                }
            }
            else {
                boolShowDialog = options.boolShowDialog;
            }

            //#region enviar paciente
            let widget, tipo;

            const idlocal = new Date().getTime();
            const url = app.config.server.php + "core/databaseInsert?ts=" + new Date().getTime();

            const json = {
                url: url,
                if: session.form.id,
                m: options.modulo,
                // OJO AQUI VA EL ID DEL USUARIO EN EL ROL, NO EL ID DEL USUARIO GENERAL
                idlocal: idlocal,
                iu: session.user.i,
                i: idPaciente,
                ios: idOrdenServicio,
                section: session.form.section,
                sectionMax: session.form.maxSection,
                fields: [
                    {
                        field: "hc_fecha",
                        value: await app.historiaClinica.core.consulta.fechaGet( idOrdenServicio ),
                    },
                    {
                        field: "pac_id",
                        value: idPaciente
                    },
                    {
                        field: "pse_id",
                        value: idOrdenServicio
                    },
                    {
                        field: "idlocal",
                        value: idlocal
                    }
                ],
                json: session.form.fields.map(function (record) {
                    if (record.tr == "divipola") widget = "divipola";
                    else widget = "";

                    if (record.se == "custom" || record.se == "numerico") tipo = "numerico";
                    else tipo = "";

                    return {
                        atr: record.atr,
                        c: record.c,
                        r: record.response,
                        w: widget,
                        t: tipo,
                        tr: record.tr,
                        f: record.dc
                    };
                }),
                keys: [
                    {
                        field: "pse_id",
                        value: idOrdenServicio
                    }
                ]
            };

            if (typeof options.detalle !== "undefined") {
                json.detalle = options.detalle;
            }
            //#region adaptar json a data local - datos consulta
            if (index != "" && index != "hc-diagnostico") {
                console.log(json);
                let temporal = await app.adapter.hc.insert.core(json, escala);
                console.log(temporal);
                if (escala == "") {
                    await nata.localforage.append(index, temporal, "ios");
                }
                else {
                    console.log("%c Aquí se guardan los datos ...", "background:red;color:white;font-weight:bold;font-size:12px");
                    console.log(temporal);
                    await nata.localforage.update("hc-escala", temporal, "ios");
                }
            }
            //#endregion adaptar json a data local - indice

            //#region  code temporal
            $("#container").empty();

            // registrar evolucion HC para actualizar estado del menu
            if (typeof session.profesional == "undefined") session.profesional = {};
            if (typeof session.profesional.consulta == "undefined") session.profesional.consulta = [];

            const dataPaciente = session.profesional.consulta.filter(function (record) {
                return record.ipa == idPaciente;
            });

            session.profesional.consulta = session.profesional.consulta.filter(function (record) {
                return record.ipa !== idPaciente;
            });

            let indiceEvolucion;
            if (escala == "") {
                indiceEvolucion = index;
            }
            else {
                indiceEvolucion = escala;
            }

            if (dataPaciente.length == 0) {
                dataPaciente.push({
                    ipa: idPaciente,
                    evolucion: [
                        {
                            e: indiceEvolucion
                        }
                    ]
                });
            }
            else {
                dataPaciente[0].evolucion = dataPaciente[0].evolucion.filter(function (record) {
                    return record.e !== indiceEvolucion;
                });

                dataPaciente[0].evolucion.push({
                    e: indiceEvolucion
                });

                console.log(dataPaciente[0].evolucion);
            }

            //#endregion code temporal

            console.log(dataPaciente);
            session.profesional.consulta.push(dataPaciente[0]);
            console.log(session.profesional.consulta);
            //json, message, callback, boolShowDialog
            // TODO: volver

            const callback_ = function (response) {
                console.log("callback_");

                if (typeof response !== "undefined") app.offline.removeItem(response[0].idlocal);

                // aqui hay que mostrar el encabezado del paciente
                //idPaciente, idOrdenServicio, boolServicio = true, boolToolbar = true, boolGetHTML = false, callback
                //app.historiaClinica.core.header.show(idPaciente, idOrdenServicio, true, true, false);

                const element = document.getElementById("container-header");
                element.render( "templateHeaderPaciente", nata.sessionStorage.getItem("consulta") );
                element.style.display = "block";

                //app.historiaClinica.historial.render(idPaciente, idOrdenServicio, true);
                //$("#toolbar .menu-hc").removeClass("disabled");

                if (typeof callback == "function") callback();
            };
            app.core.server.send("Registro Exitoso", "Se registraron los datos de historia clínica", url, json, callback_, "", boolShowDialog);
            //#endregion
        },
        session: {
            paciente: {
                set: async function (idOrdenServicio) {
                    console.log("app.historiaClinica.core.session.paciente.set");
                    //#region crear session paciente
                    let dataAgenda = await localforage.getItem("agenda");
                    console.log(dataAgenda);
                    if (dataAgenda === null) dataAgenda = [];
                    dataAgenda = dataAgenda.filter(function (record) {
                        return record.ios == idOrdenServicio;
                    });

                    if (dataAgenda.length == 0) {
                        const message = "No se recibieron datos de la agenda";
                        swal("Error Dev", message, "error");
                        console.error(message);
                        return false;
                    }

                    const dataPaciente = dataAgenda.map(function (record) {
                        return {
                            pn: record.pn,
                            sn: record.sn,
                            pa: record.pa,
                            sa: record.sa,
                            ni: record.ni,
                            td: record.tit,
                            fn: record.fn,
                            cd: record.cd
                        };
                    });
                    console.log(dataPaciente);
                    //nata.sessionStorage.setItem("paciente", dataPaciente[0]);
                    oState.setProp( "paciente", dataPaciente[0] );
                    //#endregion crear session paciente
                }
            }
        },
        validar: async function (idOrdenServicio, index, oResponse, strAttributes) {
            console.log("%c app.historiaClinica.core.validar ", "background:red;color:white;font-weight:bold;font-size:11px");

            console.log(index);
            console.log(oResponse);
            console.log(strAttributes);

            const arrAttributes = strAttributes.split(",");
            console.log(arrAttributes);
            let boolValid = true;
            let i;
            for (i = 0; i < arrAttributes.length; i++) {
                if (typeof oResponse[arrAttributes[i]] == "undefined") oResponse[arrAttributes[i]] = "";

                //console.log(arrAttributes[i], arrAttributes[i].indexOf("nw_in"));
                console.error("que pasa con esto ??");
                if (arrAttributes[i].indexOf("nw_in") !== -1) {
                    continue;
                }

                if (oResponse[arrAttributes[i]] == "") {
                    boolValid = false;
                    break;
                }
            }
            console.log(boolValid);
            document.getElementById("buttonNext").disabled = !boolValid;
            return boolValid;
        }
    },
    evolucionBasica: {
        render: async function (idPaciente, idOrdenServicio) {
            console.trace("%c app.historiaClinica.evolucionBasica.render ", "background:red;color:#fff;font-size:11px;font-weight:bold;");

            //#region toolbar
            if (app.config.dev.mode) {
                const devToolbar = document.getElementById("devToolbar");
                devToolbar.render("templateButtonRobot");
                devToolbar.style.display = "inline-block";
                //document.getElementById("buttonRobot").style.display = "inline-block";
                document.querySelector(".ui-container-toolbar").style.display = "inline-block";
                $(".button-robot")
                    .show()
                    .off()
                    .click(app.testing.hc.unificada);
            }
            //#endregion toolbar

            app.historiaClinica.core.header.showV1( idOrdenServicio );

            const options = {
                config: {
                    index: {
                        // config.index.tableCollection
                        adapter: "mysql-nosql",
                        tableCollection: "historia-clinica",
                        key: "datos-basicos",
                        keys: [
                            {
                                prop: "ios",
                                value: idOrdenServicio
                            }
                        ],
                        date: {
                            prop: "hc_fecha"
                        }
                    }
                },
                form: {
                    boolButtons: true,
                    idForm: 6,
                    idSection: 1,
                    idUser: session.user.i,
                    //typeStorage: "localforage",
                    // No se guarda localmente, siempre se esta recuperando el paciente del servidor ...
                    // options.form.index
                    index: "hc-evolucion-basica",
                    idRecord: 0,
                    title: "Evolución Básica",
                    subtitle: "Datos Básicos de Consulta",
                    table: "hc_evolucion_basica",
                    idLocal: new Date().getTime()
                }
            };

            //#region get data
            let data = await app.core.form.data.get(idOrdenServicio, "datos-basicos");
            console.log(data);
            if ( data.length > 0) {
                data = data[0].json;
            }
            else {
                data = {};
            }
            console.log(data);
            if ( typeof options.form.dataset == "undefined" ) options.form.dataset = {};
            options.form.dataset.data = data;
            //#endregion get data

            const events = {
                formSend: async function ( dataForm ) {
                    console.log("%c events.formSend ", "background:red;color:white;font-weight:bold;font-size:11px");

                    //#region guardar datos session
                    //@audit 20220617-1
                    let dataHistoriaClinica = await localforage.getItem("historia-clinica");
                    dataHistoriaClinica = dataHistoriaClinica.filter(function(record) {
                        return record.ios != idOrdenServicio;
                    });
                    dataHistoriaClinica.push(
                        {
                            dd: parseInt(dataForm.hc_fecha.substring(7,2)),
                            dm: parseInt(dataForm.hc_fecha.substring(5,2)),
                            dy: parseFloat(dataForm.hc_fecha.substring(0,4)),
                            f: dataForm.hc_fecha,
                            i: new Date().getTime(),
                            ios: idOrdenServicio,
                            json: JSON.stringify(dataForm),
                            m: "datos-basicos"
                        }
                    );
                    await localforage.setItem("historia-clinica", dataHistoriaClinica);
                    //#endregion guardar datos session

                    //@audit eliminar este manejo de estado, trabajar localStorage y sale
                    const oStateArtemisa = new artemisaHistoriaClinica();
                    oStateArtemisa.evolucionUpdate( idOrdenServicio, "basica" );

                    console.log( dataForm );
                    oState.setProp( "consulta", { fechaConsulta: dataForm.hc_fecha, ios: idOrdenServicio }, false );
                    if ( typeof oState.state.session == "undefined" ) {
                        oState.setProp( "session", {}, false );
                    }

                    app.historiaClinica.diagnostico.render( idPaciente, idOrdenServicio );

                    let data = await localforage.getItem( "agenda");
                    app.debug.log( "data agenda", data );
                    let i;
                    for (i=0; i<data.length; i++) {
                        console.log( data[i].ios, idOrdenServicio );
                        if ( data[i].ios == idOrdenServicio ) {
                            data[i].cdb = 1;
                            break;
                        }
                    }
                    console.log( data );
                    await localforage.setItem( "agenda", data );
                    //#endregion actualizar la data de la agenda
                },
                valid: function () {
                    if (app.config.dev.verbose.core) console.log("%c events.valid ", "background:blue;color:white;font-weight:bold;font-size:11px");
                    const alturaMetros = document.querySelector(".imc-altura-1");
                    const alturaCentimetros = document.querySelector(".imc-altura-2");
                    const peso = document.querySelector(".imc-peso");

                    const labelAltura = document.getElementById("control-26-label");
                    const labelPeso = document.getElementById("control-27-label");

                    labelPeso.classList.remove("d-none");
                    labelAltura.classList.remove("d-none");

                    labelPeso.classList.add("d-none");
                    labelAltura.classList.add("d-none");

                    if ((alturaMetros.value != "" || alturaCentimetros.value != "") && peso.value == "") {
                        // mostrar las 2 etiquetas
                        labelPeso.innerHTML = "Debes ingresar el peso";
                        labelPeso.classList.remove("d-none");
                        labelPeso.style.display = "block";
                        document.getElementById("buttonNext").disabled = true;
                        console.log(false);
                        return false;
                    }
                    else if (peso.value != "" && (alturaMetros.value == "" || alturaCentimetros.value == "")) {
                        labelAltura.innerHTML = "Debes ingresar la altura";
                        labelAltura.classList.remove("d-none");
                        labelAltura.style.display = "block";
                        document.getElementById("buttonNext").disabled = true;
                        console.log(false);
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            };
            session.forms["hc-basica"] = new nataUIFormBasic(options, undefined, events);
            session.forms["hc-basica"].renderLayout();

            document.querySelector(".container-user").style.display = "none";

            //#endregion render form
        }
    },
    datosGenerales: {
        render: function (idPaciente, idOrdenServicio) {
            console.log("%c app.historiaClinica.datosGenerales.render ", "background: orange; color: #fff;");
            console.log(idPaciente, idOrdenServicio);
            session.idPaciente = idPaciente;
            session.idOrdenServicio = idOrdenServicio;
            if (typeof idPaciente == "undefined" || (typeof idPaciente == "string" && idPaciente == "undefined")) {
                const message = "No se recibio el parámetro: idPaciente";
                swal("Error Dev", message, "error");
                console.error(message);
                return false;
            }

            let callback = function () {
                $(".button-robot")
                    .off()
                    .click(function () {
                        app.robot.testing.run("199");
                    })
                    .show();
            };
            //idPaciente, idOrdenServicio, boolServicio = true, boolToolbar = true, boolGetHTML = false, callback
            //app.historiaClinica.core.header.show(idPaciente, idOrdenServicio, true, true, false, callback);
            const element = document.getElementById("container-header");
            element.render( "templateHeaderPaciente", nata.sessionStorage.getItem("consulta") );
            element.style.display = "block";
            console.log(idPaciente);

            //idForm, idSection, title, subtitle, index, callback
            //#region render forms
            app.form.init();
            session.form.id = 90;
            session.form.section = 1;
            app.form.events.formValid = function (boolShowDialog = false) {
                if (boolShowDialog) {
                    swal({
                        text: "Deseas Cerrar Datos de la Consulta ?",
                        icon: "warning",
                        buttons: ["NO, voy a revisar", "SI, Continuar"],
                        dangerMode: true,
                    }).then((response) => {
                        if (response) {
                            //idPaciente, idOrdenServicio, index = "", escala = "", callback

                            //#region send data
                            const options = {
                                modulo: "Datos Consulta"
                            };
                            app.historiaClinica.core.insertar(options, idPaciente, idOrdenServicio, "hc-datos-consulta", "");
                            //#endregion send data
                        }
                    });
                }
            };
            const options = {
                toolbar: true,
                indexLocalStorage: "paciente-" + idPaciente + "-form-" + session.form.id + "-" + session.form.section
            };
            callback = function () { };
            localforage.getItem("hc-datos-consulta").then(function (dataFormulario) {

                if (dataFormulario == null) dataFormulario = [];

                console.log(dataFormulario);
                console.log(idOrdenServicio);
                dataFormulario = dataFormulario.filter(function (record) {
                    return (record.ios == idOrdenServicio);
                });
                console.log(dataFormulario);
                app.form.layout.render(session.form.id, session.form.section, "Historia Clínica", "Datos Consulta", callback, options, undefined, undefined, dataFormulario[0]);
            });
            //#endregion render forms

        }
    },
    datosCuidador: {
        render: function (idPaciente, idOrdenServicio) {
            console.log("%c app.historiaClinica.datosCuidador.render ", "background: orange; color: #fff;");
            // ui

            //app.historiaClinica.core.header.show(idPaciente, idOrdenServicio, true, true, false);
            const element = document.getElementById("container-header");
            element.render( "templateHeaderPaciente", nata.sessionStorage.getItem("consulta") );
            element.style.display = "block";

            //#region render forms
            app.form.init();
            session.form.id = 91;
            session.form.section = 1;
            app.form.events.formValid = function (boolShowDialog = false) {
                if (boolShowDialog) {
                    swal({
                        text: "Deseas Cerrar Datos Cuidador ?",
                        icon: "warning",
                        buttons: ["NO, voy a revisar", "SI, Continuar"],
                        dangerMode: true,
                    }).then((response) => {
                        if (response) {
                            //app.historiaClinica.datosCuidador.insertar(idPaciente, idOrdenServicio);
                            const options = {
                                modulo: "Datos Cuidador"
                            };
                            app.historiaClinica.core.insertar(options, idPaciente, idOrdenServicio, "hc-datos-cuidador");
                        }
                    });
                }
            };
            const options = {
                toolbar: true,
                indexLocalStorage: "paciente-" + idPaciente + "-form-" + session.form.id + "-" + session.form.section
            };
            callback = function () { };
            //idForm, idSection, title, subtitle, callback, options = {}, events, class_ = "", respuestas = {}
            localforage.getItem("hc-datos-cuidador").then(function (data) {
                const respuestas = data.filter(function (record) {
                    return record.ios == idOrdenServicio;
                });
                console.log(idOrdenServicio);
                console.log(data);
                if (respuestas.length > 0) {
                    console.log(respuestas[0]);
                    app.form.layout.render(session.form.id, session.form.section, "Historia Clínica", "Datos Cuidador", callback, options, undefined, undefined, respuestas[0]);
                }
                else {
                    app.form.layout.render(session.form.id, session.form.section, "Historia Clínica", "Datos Cuidador", callback, options);
                }
                
            });
            //#endregion render forms
        }
    },
    signosVitales: {
        render: function (idPaciente, idOrdenServicio = 0) {
            console.log("%c app.historiaClinica.signosVitales.render ", "background: orange; color: #fff;");
            // ui
            const element = document.getElementById("container-header");
            element.render( "templateHeaderPaciente", nata.sessionStorage.getItem("consulta") );
            element.style.display = "block";
            //app.historiaClinica.core.header.show(idPaciente, idOrdenServicio, true, true, false);

            //#region render forms
            app.form.init();
            session.form.id = 92;
            session.form.section = 1;
            app.form.events.formValid = function (boolShowDialog = false) {

                if (document.querySelector(".tension-arterial-sistolica").value != ""
                    && document.querySelector(".tension-arterial-diastolica").value == "") {
                    swal("Error Formulario", "Debe ingresar la tensión SISTÓLICA Y DIASTÓLICA", "error");
                    return false;
                }

                if (document.querySelector(".tension-arterial-sistolica").value == ""
                    && document.querySelector(".tension-arterial-diastolica").value != "") {
                    swal("Error Formulario", "Debe ingresar la tensión SISTÓLICA Y DIASTÓLICA", "error");
                    return false;
                }

                if (document.querySelector(".tension-arterial-sistolica").value !== "") {
                    if (document.querySelector(".tension-arterial-sistolica").value < 70) {
                        swal("Error Formulario", "La tensión SISTÓLICA debe ser mayor o igual a 70", "error");
                        return false;
                    }

                    if (document.querySelector(".tension-arterial-sistolica").value > 230) {
                        swal("Error Formulario", "La tensión SISTÓLICA debe ser menor o igual a 230", "error");
                        return false;
                    }
                }

                if (document.querySelector(".tension-arterial-diastolica").value !== "") {
                    if (document.querySelector(".tension-arterial-diastolica").value < 50) {
                        swal("Error Formulario", "La tensión DIASTÓLICA debe ser mayor o igual a 50", "error");
                        return false;
                    }

                    if (document.querySelector(".tension-arterial-diastolica").value > 120) {
                        swal("Error Formulario", "La tensión DIASTÓLICA debe ser menor o igual a 120", "error");
                        return false;
                    }
                }

                if (document.querySelector(".frecuencia_cardiaca").value !== "") {
                    if (document.querySelector(".frecuencia_cardiaca").value < 40) {
                        swal("Error Formulario", "La frecuencia cardiaca debe ser mayor o igual a 40", "error");
                        return false;
                    }

                    if (document.querySelector(".frecuencia_cardiaca").value > 120) {
                        swal("Error Formulario", "La frecuencia cardiaca debe ser menor o igual a 120", "error");
                        return false;
                    }
                }

                if (document.querySelector(".frecuencia_respiratoria").value !== "") {
                    if (document.querySelector(".frecuencia_respiratoria").value < 8) {
                        swal("Error Formulario", "La frecuencia respiratoria debe ser mayor o igual a 8", "error");
                        return false;
                    }

                    if (document.querySelector(".frecuencia_respiratoria").value > 100) {
                        swal("Error Formulario", "La frecuencia respiratoria debe ser menor o igual a 100", "error");
                        return false;
                    }
                }

                if (document.querySelector(".temperatura").value !== "") {
                    if (document.querySelector(".temperatura").value < 30) {
                        swal("Error Formulario", "La temperatura debe ser mayor o igual a 30", "error");
                        return false;
                    }

                    if (document.querySelector(".temperatura").value > 43) {
                        swal("Error Formulario", "La temperatura debe ser menor o igual a 43", "error");
                        return false;
                    }
                }

                if (document.querySelector(".saturacion").value !== "") {
                    if (document.querySelector(".saturacion").value < 50) {
                        swal("Error Formulario", "La saturación de oxígeno debe ser mayor o igual a 50", "error");
                        return false;
                    }

                    if (document.querySelector(".saturacion").value > 100) {
                        swal("Error Formulario", "La saturación de oxígeno debe ser menor o igual a 100", "error");
                        return false;
                    }
                }

                if (document.querySelector(".glucometria").value !== "") {
                    if (document.querySelector(".glucometria").value < 50) {
                        swal("Error Formulario", "La glucometría debe ser mayor o igual a 50", "error");
                        return false;
                    }

                    if (document.querySelector(".glucometria").value > 180) {
                        swal("Error Formulario", "La glucometría debe ser menor o igual a 180", "error");
                        return false;
                    }
                }

                if (document.querySelector(".imc-peso").value !== "") {
                    if (document.querySelector(".imc-peso").value > 600) {
                        swal("Error Formulario", "El peso debe ser menor o igual a 600", "error");
                        return false;
                    }
                }

                if (document.querySelector(".imc-altura-1").value != ""
                    && ( document.querySelector(".imc-altura-2").value == ""
                        || document.querySelector(".imc-peso").value == ""
                    )
                ) {
                    swal("Error Formulario", "Debe ingresar Altura en Metros, Centímetros y Peso", "error");
                    return false;
                }

                if (document.querySelector(".imc-altura-2").value != ""
                    && ( document.querySelector(".imc-altura-1").value == ""
                        || document.querySelector(".imc-peso").value == ""
                    )
                ) {
                    swal("Error Formulario", "Debe ingresar Altura en Metros, Centímetros y Peso", "error");
                    return false;
                }

                if (document.querySelector(".imc-peso").value != ""
                    && (document.querySelector(".imc-altura-1").value == ""
                    || document.querySelector(".imc-altura-2").value == ""
                    )
                ) {
                    swal("Error Formulario", "Debe ingresar Altura en Metros, Centímetros y Peso", "error");
                    return false;
                }
                
                if (
                    document.querySelector(".hcsv_indicaciones").value == ""
                    && document.querySelector(".tension-arterial-sistolica").value == ""
                    && document.querySelector(".tension-arterial-diastolica").value == ""
                    && document.querySelector(".frecuencia_cardiaca").value == ""
                    && document.querySelector(".frecuencia_respiratoria").value == ""
                    && document.querySelector(".temperatura").value == ""
                    && document.querySelector(".saturacion").value == ""
                    && document.querySelector(".glucometria").value == ""
                    && document.querySelector(".imc-altura-1").value == ""
                    && document.querySelector(".imc-altura-2").value == ""
                    && document.querySelector(".imc-peso").value == ""
                ) {
                    swal("Error Formulario", "Se debe ingresar algun dato para cerrar Signos Vitales", "error");
                    return false;
                }

                if (boolShowDialog) {
                    swal({
                        text: "Deseas Cerrar Signos Vitales ?",
                        icon: "warning",
                        buttons: ["NO, voy a revisar", "SI, Continuar"],
                        dangerMode: true,
                    }).then((response) => {
                        if (response) {
                            const options = {
                                modulo: "Signos Vitales"
                            };
                            app.historiaClinica.core.insertar(options, idPaciente, idOrdenServicio, "hc-signos-vitales");
                        }
                    });
                }
            };
            const options = {
                toolbar: true,
                indexLocalStorage: "paciente-" + idPaciente + "-form-" + session.form.id + "-" + session.form.section
            };
            callback = function () { };
            localforage.getItem("hc-signos-vitales").then(function (data) {
                const respuestas = data.filter(function (record) {
                    return record.ios == idOrdenServicio;
                });
                console.log(idOrdenServicio);
                console.log(data);
                if (respuestas.length > 0) {
                    console.log(respuestas[0]);
                    app.form.layout.render(session.form.id, session.form.section, "Historia Clínica", "Signos Vitales", callback, options, undefined, undefined, respuestas[0]);
                }
                else {
                    app.form.layout.render(session.form.id, session.form.section, "Historia Clínica", "Signos Vitales", callback, options);
                }

            });
            //#endregion render forms
        }
    },
    examenFisico: {
        render: function (idPaciente, idOrdenServicio) {
            console.log("%c app.historiaClinica.examenFisico.render ", "background: orange; color: #fff;");

            //app.historiaClinica.core.header.show(idPaciente, idOrdenServicio, true, true, false);
            const element = document.getElementById("container-header");
            element.render( "templateHeaderPaciente", nata.sessionStorage.getItem("consulta") );
            element.style.display = "block";

            //#region render forms
            app.form.init();
            session.form.id = 93;
            session.form.section = 1;
            app.form.events.formValid = function (boolShowDialog = false) {
                if (boolShowDialog) {
                    swal({
                        text: "Deseas Cerrar Datos Exámen Físico ?",
                        icon: "warning",
                        buttons: ["NO, voy a revisar", "SI, Continuar"],
                        dangerMode: true,
                    }).then((response) => {
                        if (response) {
                            const options = {
                                modulo: "Examen Fisico"
                            };
                            app.historiaClinica.core.insertar(options, idPaciente, idOrdenServicio, "hc-examen-fisico");
                        }
                    });
                }
            };
            const options = {
                toolbar: true,
                indexLocalStorage: "paciente-" + idPaciente + "-form-" + session.form.id + "-" + session.form.section
            };
            let callback = function () { };
            localforage.getItem("hc-examen-fisico").then(function (data) {
                const respuestas = data.filter(function (record) {
                    return record.ios == idOrdenServicio;
                });
                console.log(idOrdenServicio);
                console.log(data);
                if (respuestas.length > 0) {
                    console.log(respuestas[0]);
                    app.form.layout.render(session.form.id, session.form.section, "Historia Clínica", "Examen Fisico", callback, options, undefined, undefined, respuestas[0]);
                }
                else {
                    app.form.layout.render(session.form.id, session.form.section, "Historia Clínica", "Examen Fisico", callback, options);
                }

            });
            //#endregion render forms
        }
    },
    cambiosAtencionPaciente: {
        render: function (idPaciente, idOrdenServicio) {
            console.log("%c app.historiaClinica.cambiosAtencionPaciente.render ", "background: orange; color: #fff;font-size:11px; font-weight: bold;");

            //app.historiaClinica.core.header.show(idPaciente, idOrdenServicio, true, true, false);
            const element = document.getElementById("container-header");
            element.render( "templateHeaderPaciente", nata.sessionStorage.getItem("consulta") );
            element.style.display = "block";

            //#region render forms
            let callback = function () { };
            app.form.init();
            session.form.id = 94;
            session.form.section = 1;
            app.form.init();
            app.form.events.formValid = function (boolShowDialog = false) {
                if (boolShowDialog) {
                    swal({
                        text: "Deseas Cerrar Datos de Cambio del Paciente en la Atención ?",
                        icon: "warning",
                        buttons: ["NO, voy a revisar", "SI, Continuar"],
                        dangerMode: true,
                    }).then((response) => {
                        if (response) {
                            const options = {
                                modulo: "Cambios Atencion Paciente"
                            };
                            app.historiaClinica.core.insertar(options, idPaciente, idOrdenServicio, "hc-cambios-atencion-paciente");
                        }
                    });
                }
            };
            const options = {
                toolbar: true,
                indexLocalStorage: "paciente-" + idPaciente + "-form-" + session.form.id + "-" + session.form.section
            };
            localforage.getItem("hc-cambios-atencion-paciente").then(function (data) {
                const respuestas = data.filter(function (record) {
                    return record.ios == idOrdenServicio;
                });
                console.log(idOrdenServicio);
                console.log(data);
                if (respuestas.length > 0) {
                    console.log(respuestas[0]);
                    app.form.layout.render(session.form.id, session.form.section, "Historia Clínica", "Cambios del Paciente en la Atención", callback, options, undefined, undefined, respuestas[0]);
                }
                else {
                    app.form.layout.render(session.form.id, session.form.section, "Historia Clínica", "Cambios del Paciente en la Atención", callback, options);
                }

            });
            //#endregion render forms
        }
    },
    diagnostico: {
        render: async function ( idPaciente, idOrdenServicio ) {
            console.log("%c app.historiaClinica.diagnostico.render ", "background: red; color: #fff;font-size: 12px; font-weight: bold");
            app.historiaClinica.core.header.showV1( idOrdenServicio );

            //#region render forms
            const index = "hc-diagnostico";
            const indexDetail = "hc-diagnostico-detalle";
            const key = {
                field: "ios",
                value: idOrdenServicio
            };

            let fechaConsulta = await app.historiaClinica.core.consulta.fechaGet( idOrdenServicio );

            const options = {
                config: {
                    index: {
                        // config.index.tableCollection
                        adapter: "mysql-nosql",
                        tableCollection: "historia-clinica",
                        key: "diagnóstico",
                        keys: [
                            {
                                prop: "ios",
                                value: idOrdenServicio
                            }
                        ],
                        date: {
                            value: fechaConsulta
                        }
                    }
                },
                form: {
                    boolButtons: true,
                    boolShowDialogMessage: false,
                    idForm: 95,
                    idSection: 1,
                    idUser: session.user.i,
                    index: index,
                    indexDetail: indexDetail,
                    idRecord: 0,
                    title: "Diagnóstico",
                    subtitle: "",
                    key: key
                }
            };

            //#region get data
            let data = await app.core.form.data.get( idOrdenServicio, "diagnóstico" );
            console.log(data);
            if ( data.length > 0) {
                data = data[0].json;
            }
            else {
                data = {};
            }
            console.log(data);
            if ( typeof options.form.dataset == "undefined" ) options.form.dataset = {};
            options.form.dataset.data = data;
            //#endregion get data

            const events = {
                afterSaveRecordLocal: async function () {
                    const oStateArtemisa = new artemisaHistoriaClinica();
                    oStateArtemisa.evolucionUpdate( idOrdenServicio, "dx" );
                },
                afterSend: async function () {
                    app.documento.incapacidad.render(idPaciente, idOrdenServicio);

                    const url = app.config.server.php + "historia/diagnosticosSend";
                    const json = {
                        ios: idOrdenServicio,
                        detail: await localforage.getItem(indexDetail)
                    };
                    //console.log(json);
                    app.offline.setItem(new Date().getItem, url, json);

                    //method, url, data, typeResponse, callback, callbackError, timeout = 0, self = {}
                    const callbackError = function () {
                        swal("Error", "Se ha presentado un error enviando datos al servidor.\nPor favor contactar a soporte Crescend", "error");
                        return false;
                    };
                    nata.ajax("post", url, json, "json", undefined, callbackError);
                },
                beforeSend: async function () {
                    console.log("events.beforeSend");
                    document.querySelector(".ui-container-toolbar").style.display = "none";
                    document.getElementById("container").innerHTML = "";
                },
                valid: async function (boolFormValid, cantidadDetalles) {
                    console.log("%c valid ", "background:red;color:white;font-weight:bold;font-size:11px");

                    const data = await localforage.getItem(indexDetail);
                    if (data.length == 0) {
                        document.getElementById("buttonNext").disabled = true;
                        return  false;
                    }

                    const label = document.getElementById("labelErrorTipoDX");
                    const element = document.getElementById("selectTipoDX");
                    if (element !== null) {
                        if (document.getElementById("selectTipoDX").value == "") {
                            console.log("paso 02");
                            document.getElementById("buttonNext").disabled = true;

                            label.innerHTML = "Debe seleccionar el tipo de diagnóstico principal";
                            label.style.display = "block";
                            return false;
                        }
                    }

                    console.log(boolFormValid, cantidadDetalles);
                    if (!boolFormValid) {
                        console.log("paso 04");
                        document.getElementById("buttonNext").disabled = true;
                        return false;
                    }

                    if (cantidadDetalles == 0) {
                        console.log("paso 05");
                        document.getElementById("buttonNext").disabled = true;
                        return false;
                    }

                    if (label !== null) {
                        label.style.display = "none";
                    }

                    return true;
                },
                noValid: function () {
                    console.log("%c noValid ", "background:red;color:white;font-weight:bold;font-size:10px");
                    const label = document.getElementById("labelErrorTipoDX");
                    if (label !== null) {
                        if (document.getElementById("selectTipoDX").value == "") {
                            label.innerHTML = "Debe seleccionar el tipo de diagnóstico principal";
                            label.style.display = "block";
                        }
                    }

                }
            };
            session.forms["hc-dx"] = new nataUIFormBasic(options, undefined, events);
            session.forms["hc-dx"].renderLayout();

            //#region toolbar
            if (app.config.dev.mode) {
                const devToolbar = document.getElementById("devToolbar");
                devToolbar.render("templateButtonRobot");
                devToolbar.style.display = "inline-block";
                document.getElementById("buttonRobot").style.display = "inline-block";
                document.querySelector(".ui-container-toolbar").style.display = "inline-block";
                $(".button-robot")
                    .show()
                    .off()
                    .click(app.testing.hc.dx);
            }
            //#endregion toolbar

            //#endregion render form

            //#region detail
            document.getElementById("formDetail").innerHTML = `
				<button type="button" class="btn btn-secondary btn-sm my-2 button-list-dialog">
                	<img class="icon-button" src="assets/images/icons/plus-circle-white.svg" alt="">  Adicionar Diagnóstico
           		</button>
				<div id="listDetail"></div>
			`;

            session.detail["CIE"] = new nataUIListDetail({
                idCota: "",
                index: "hc-diagnostico-detalle",
                template: "templateDiagnosticosListar",
                form: session.forms["hc-dx"],
                fxRender: app.cie10.index,
                fields: {
                    ios: idOrdenServicio,
                    f: fechaConsulta,
                    il: new Date().getTime()
                },
                key: key,
                events: {
                    detailAdd: function (cantidadRegistros, record) {
                        console.log("events.detailAdd");
                        if (cantidadRegistros == 0) {
                            record.p = 1;
                        }
                    },
                    detailDelete: async function () {
                        console.log("events.detailDelete");

                        let data = await localforage.getItem("hc-diagnostico-detalle");
                        if (data === null) data = [];

                        let boolTienePrincipal = false;
                        let i;
                        for (i = 0; i < data.length; i++) {
                            if (typeof data[i].p == "undefined") data[i].p = 0;
                            if (data[i].p == 1) {
                                boolTienePrincipal = true;
                                break;
                            }
                        }

                        if (!boolTienePrincipal && data.length > 0) {
                            data[0].p = 1;
                        }

                        await localforage.setItem("hc-diagnostico-detalle", data);
                    },
                    detailRender: function (cantidadRegistros, data) {
                        console.log("%c events.detailRender ", "background:#8c004b;color:white;font-weight:bold;font-size:11px");

                        if (cantidadRegistros == 0) {
                            document.getElementById("listDiagnosticos").style.display = "none";
                        }
                        else {
                            document.getElementById("listDiagnosticos").style.display = "block";
                        }

                        console.log(data);
                        let boolTieneTipoDx = false;
                        if (data.length >= 1) {
                            let i;
                            for (i = 0; i < data.length; i++) {
                                if (typeof data[i].p == "undefined") data[i].p = 0;
                                if (typeof data[i].td == "undefined") data[i].td = "";

                                if (data[i].p == 1) {
                                    if (data[i].td != "") {
                                        $("#selectTipoDX").val(data[i].td);
                                        $("#selectTipoDX option:selected").text(data[i].tdd);
                                        document.getElementById("labelErrorTipoDX").style.display = "none";
                                        boolTieneTipoDx = true;
                                        break;
                                    }
                                }
                            }
                        }
                        else {
                            document.getElementById("labelErrorTipoDX").style.display = "block";
                        }

                        if (!boolTieneTipoDx) {
                            document.getElementById("buttonNext").disabled = true;
                        }

                        $("#selectTipoDX")
                            .off()
                            .change(async function () {
                                console.log("%c #selectTipoDX.change ", "background:red;color:white;font-weight:bold;font-size:11px");
                                const self = this;

                                const value = this.value;
                                // insertar el campo en los fields que se envian aparte
                                const data = await localforage.getItem(indexDetail);
                                console.log(data);

                                // encontrar el principal
                                let i;
                                for (i = 0; i < data.length; i++) {
                                    if (typeof data[i].p == "undefined") data[i].p = 0;
                                    if (typeof data[i].td == "undefined") data[i].td = "";
                                    if (typeof data[i].tdd == "undefined") data[i].tdd = "";

                                    if (data[i].p == 1) {
                                        data[i].td = value;
                                        data[i].tdd = $(self).find("option:selected").text();
                                    }
                                    else {
                                        data[i].td = "";
                                    }
                                }

                                localforage.setItem(indexDetail, data).then(function () {});

                                session.forms["hc-dx"].validateForm();
                                document.getElementById("labelErrorTipoDX").style.display = "none";
                            });

                        $("#listDiagnosticos .form-check-input")
                            .off()
                            .click(async function () {
                                console.log("#listDiagnosticos .form-check-input.click");
                                const codigo = this.dataset.codigo;
                                console.log(codigo);

                                let data = await localforage.getItem("hc-diagnostico-detalle");
                                if (data === null) data = [];
                                data = data.filter(function (record) {
                                    return record.ios == idOrdenServicio;

                                });
                                nata.localStorage.setItem("debug", data);
                                console.log(nata.localStorage.getItem("debug"));
                                const value = document.getElementById("selectTipoDX").value;
                                console.log(value);
                                let i;
                                for (i = 0; i < data.length; i++) {
                                    if (data[i].c == codigo) {
                                        data[i].p = 1;
                                        if (value !== "") {
                                            data[i].td = value;
                                        }
                                    }
                                    else {
                                        data[i].p = 0;
                                        data[i].td = "";
                                    }
                                }
                                nata.localStorage.setItem("debug-1", data);
                                console.log(nata.localStorage.getItem("debug-1"));
                                await localforage.setItem("hc-diagnostico-detalle", data);
                            });
                    }
                }
            });
            session.forms["hc-dx"].detailIndex = session.detail["CIE"].options.index;
            session.detail["CIE"].detailRender();
            //#endregion detail
        }
    },
    escalas: {
        adapter: {
            onlyValue: function ( idForm, obj ) {
                console.log("%c app.historiaClinica.escalas.adapter.onlyValue", "background:red;color:white;font-weight:bold;font-size:10px");

                nata.localStorage.setItem( "debug", obj);
                console.log( nata.localStorage.getItem( "debug") );

                let prop, oTemplate, indice;
                for (prop in obj) {
                    oTemplate = {};
                    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                        if ( idForm == 96) {
                            // extraer solamente las propiedades de Glasgow
                            // el sufijo de gl_
                            if (prop.indexOf("gl_") !== -1) {
                                if ( typeof obj[ prop ] != "object") {
                                    oTemplate.value = obj[ prop ];
                                    obj[ prop ] = oTemplate;
                                }
                            }
                        }
                        else if ( idForm == 97) {
                            // extraer solamente las propiedades de Barthel
                            // el sufijo de bt_
                            if (prop.indexOf("bt_") !== -1) {
                                if ( typeof obj[ prop ] != "object") {
                                    oTemplate.value = obj[ prop ];
                                    obj[ prop ] = oTemplate;
                                }
                            }
                        }
                        else if ( idForm == 98) {
                            // extraer solamente las propiedades de Karnofsky
                            // el sufijo de ka_
                            if (prop.indexOf("ka_") !== -1) {
                                if ( typeof obj[ prop ] != "object") {
                                    oTemplate.value = obj[ prop ];
                                    obj[ prop ] = oTemplate;
                                }
                            }
                        }
                        else if ( idForm == 99) {
                            // extraer solamente las propiedades de News
                            // el sufijo de nw_
                            if (prop.indexOf("nw_") !== -1) {
                                if (prop.indexOf("_i") === -1) {
                                    if ( typeof obj[ prop ] != "object") {
                                        indice = obj[ prop + "_i" ];
                                        oTemplate.value = obj[ prop ];
                                        oTemplate.indice = indice;
                                        obj[ prop ] = oTemplate;
                                        delete obj[ prop + "_i"];
                                    }
                                }
                            }
                        }
                    }
                }

                nata.localStorage.setItem( "debug", obj);
                return obj;
            },
            get: function ( idForm, obj ) {
                console.log("%c app.historiaClinica.escalas.adapter.get", "background:red;color:white;font-weight:bold;font-size:10px");
                console.log( obj );
                console.log( Object.keys( obj ) );

                let  objResponse = {};

                const arrkeys = Object.keys( obj );
                let arrIndices = arrkeys.filter(function ( record ) {
                    if (record.indexOf("_i") !== -1) {
                        return record;
                    }
                });
                console.log( arrIndices );

                let i, oTemplate, prop;
                for (i=0; i<arrIndices.length; i++) {
                    oTemplate = {};
                    prop = arrIndices[i].replace("_i", "");
                    console.log( prop );
                    oTemplate.indice = obj[arrIndices[i]];
                    oTemplate.value = obj[prop];
                    console.log( oTemplate );
                    objResponse[prop] = oTemplate;
                }

                console.log( objResponse );
                return objResponse;
            }
        },
        core: {
            ui: {
                checkOpciones: async function (idOrdenServicio, selectorBoton, selectorClassList, index) {
                    console.log("app.historiaClinica.escalas.core.ui.checkOpciones");
                    let dataEscala = await localforage.getItem("hc-escala");
                    if (dataEscala === null) return false;
                    if (dataEscala.length == 0) return false;

                    dataEscala = dataEscala.filter(function (record) {
                        return record.ios == idOrdenServicio;
                    });
                    console.log(dataEscala);
                    let data = dataEscala[0][index];
                    if (typeof data != "object") {
                        let temporal = {};
                        temporal[index] = data;
                        data = temporal;
                    }

                    console.log(data);

                    let contador = 0;
                    let prop;
                    for (prop in data) {
                        if (Object.prototype.hasOwnProperty.call(data, prop)) {
                            // do stuff
                            console.log(prop);
                            console.log(data[prop]);
                            ++contador;

                            if (typeof data[prop] == "object") {
                                $(selectorBoton + prop + "-" + data[prop]["indice"])
                                    .prop("checked", true)
                                    .trigger("change");
                            }
                            else {
                                $(selectorBoton + prop + "-" + data[prop])
                                    .prop("checked", true)
                                    .trigger("change");
                            }
                        }
                    }

                    if (contador == $(selectorClassList).length) {
                        document.getElementById("buttonNext").disabled = false;
                    }
                    else {
                        document.getElementById("buttonNext").disabled = true;
                    }
                }
            },
            evaluacion: {
                getTotal: async function ( idOrdenServicio, idForm, indexForm ) {

                    console.log("%c app.historiaClinica.escalas.core.evaluacion.getTotal ", "background: red; color: #fff; font-size: 10px; font-weight:bold;");

                    let data = session.forms[indexForm].data;
                    console.log( data );
                    // calcular el total
                    let total = 0, prop;
                    for (prop in data ) {
                        if (Object.prototype.hasOwnProperty.call(data, prop)) {
                            total += parseInt(data[prop].value);
                        }
                    }
                    return total;
                },
                render: async function ( idOrdenServicio, idPaciente, idForm, indexForm ) {
                    console.log("%c app.historiaClinica.escalas.core.evaluacion.render ", "background: red; color: #fff; font-size: 10px; font-weight:bold;");

                    const data = {
                        total: await app.historiaClinica.escalas.core.evaluacion.getTotal( idOrdenServicio, idForm, indexForm )
                    };

                    //app.historiaClinica.core.insertar(options, idPaciente, idOrdenServicio, "hc-escala-glasgow", "");

                    //#region render dialog
                    const options = {
                        height: "auto",
                        left: (session.width < 450) ? 0 : (session.width - 450) / 2,
                        top: 50,
                        width: (session.width < 450) ? session.width : 450
                    };

                    //@todo 01
                    if (idForm == 96) {
                        app.core.ui.dialogo.render("Evaluación Escala Glasgow", options, "templateEscalaGlasgowEvaluacion", data, true);  
                        app.historiaClinica.escalas.core.render( idOrdenServicio, idPaciente, 97, "hc-escala-barthel", "Escala Barthel");
                    }

                    if (idForm == 97) {
                        app.core.ui.dialogo.render("Evaluación Escala Barthel", options, "templateEscalaBarthelEvaluacion", data, true);
                        app.historiaClinica.escalas.core.render( idOrdenServicio, idPaciente, 99, "hc-escala-news", "Escala News");
                    }

                    if (idForm == 98) {
                        app.core.ui.dialogo.render("Evaluación Escala Karnofsky", options, "templateEscalaKarnofskyEvaluacion", data, true);                                                
                    }

                    if (idForm == 99) {
                        app.core.ui.dialogo.render("Evaluación Escala News", options, "templateEscalaNewsEvaluacion", data, true);
                    }

                    window.scroll({
                        top: 0,
                        left: 0,
                        behavior: "smooth"
                    });
                    //#endregion render dialog

                }
            },
            render: async function ( idOrdenServicio, idPaciente, idForm, indexForm, title ) {
                console.log("%c app.historiaClinica.escalas.core.render ", "background:red;color:#fff;font-size:11px;font-weight:bold;");

                //#region toolbar
                if (app.config.dev.mode) {

                    let fx;
                    if ( idForm  == 96) {
                        fx = app.testing.hc.escala.glasglow;
                    }
                    else if ( idForm  == 97) {
                        fx = app.testing.hc.escala.barthel;
                    }
                    else if ( idForm  == 98) {
                        fx = app.testing.hc.escala.karnofsky;
                    }
                    else if ( idForm  == 99) {
                        fx = app.testing.hc.escala.news;
                    }

                    const devToolbar = document.getElementById("devToolbar");
                    devToolbar.render("templateButtonRobot");
                    devToolbar.style.display = "inline-block";
                    //document.getElementById("buttonRobot").style.display = "inline-block";
                    document.querySelector(".ui-container-toolbar").style.display = "inline-block";
                    $(".button-robot")
                        .show()
                        .off()
                        .click(fx);
                }
                //#endregion toolbar

                //console.log( idOrdenServicio, idPaciente, idForm, indexForm, title );
                app.historiaClinica.core.header.showV1( idOrdenServicio );
                // recuperar fecha consulta evolución básica
                //#region render forms
                const index = "hc-escala";

                let data = await localforage.getItem(index);
                if (data === null) data = [];
                data = data.filter(function (record) {
                    return record.ios == idOrdenServicio;
                });
                if (data.length > 0) {
                    //data = app.historiaClinica.escalas.adapter.get( idForm, data[0] );
                    data = app.historiaClinica.escalas.adapter.onlyValue( idForm, data[0] );
                }

                let key;
                if ( idForm  == 96) {
                    key = "glasglow";
                }
                else if ( idForm  == 97) {
                    key = "barthel";
                }
                else if ( idForm  == 98) {
                    key = "karnofsky";
                }
                else if ( idForm  == 99) {
                    key = "news";
                }

                const options = {
                    config: {
                        index: {
                            // config.index.tableCollection
                            adapter: "mysql-nosql",
                            tableCollection: "historia-clinica",
                            key: key,
                            keys: [
                                {
                                    prop: "ios",
                                    value: idOrdenServicio
                                }
                            ],
                            date: {
                                value: await app.historiaClinica.core.consulta.fechaGet( idOrdenServicio )
                            }
                        }
                    },
                    form: {
                        boolButtons: true,
                        boolShowDialogMessage: false,
                        idForm: idForm,
                        idSection: 1,
                        idUser: session.user.i,
                        //typeStorage: "localforage",
                        // No se guarda localmente, siempre se esta recuperando el paciente del servidor ...
                        // options.form.index
                        index: index,
                        idRecord: 0,
                        title: title,
                        subtitle: "",
                        table: "historia_clinica_escala",
                        idLocal: new Date().getTime()
                    }
                };

                const events = {
                    afterSaveRecordLocal: async function () {
                        app.historiaClinica.escalas.core.evaluacion.render( idOrdenServicio, idPaciente, idForm, indexForm  );

                        if ( idForm == 99 ) {
                            app.historiaClinica.historial.render_v1( idOrdenServicio, true );
                        }

                        const oStateArtemisa = new artemisaHistoriaClinica();
                        oStateArtemisa.evolucionUpdate( idOrdenServicio, indexForm.replace( "hc-escala-", "" ) );
                    },
                    valid: async function () {
                        const oResponse = session.forms[indexForm].options.form.fields[0].response;
                        const oAttributes = session.forms[indexForm].options.form.fields[0].atrs;
                        return await app.historiaClinica.core.validar(idOrdenServicio, index, oResponse, oAttributes);
                    }
                };

                // app.form.layout.render(session.form.id, session.form.section, "Historia Clínica", "Escala Barthel", callback, options, {}, "", respuestas);

                session.forms[indexForm] = new nataUIFormBasic(options, undefined, events);
                session.forms[indexForm].renderLayout();
                //#endregion render forms
            }
        },
    },
    prescripcion: {
        index: function ( idOrdenServicio, idPaciente ) {
            console.log("%c app.historiaClinica.prescripcion.index ", "background: red; color: #fff; font-size:11px; font-weight: bold;");
            swal({
                text: "Deseas prescribir\nprocedimientos y/o medicamentos ?",
                icon: "warning",
                buttons: ["NO, CONTINUAR", "SI, PRESCRIBIR"],
                dangerMode: false
            }).then((response) => {
                if (response) {
                    app.historiaClinica.prescripcion.render( idOrdenServicio, idPaciente );
                }
                else {
                    app.historiaClinica.escalas.core.render( idOrdenServicio, idPaciente, 96, "hc-escala-glasgow", "Escala Glasgow");
                }
            });
        },
        procedimiento: {
            changeCantidad: function (element) {
                console.log( "app.historiaClinica.prescripcion.procedimiento.changeCantidad" );

                const ios = element.dataset.ios;
                const codigo = element.dataset.id;
                const value = element.value;

                localforage.getItem("hc-prescripcion-cups").then(function (data) {
                    let i;
                    for (i = 0; i < data.length; i++) {
                        if (data[i].ios == ios && data[i].c == codigo) {
                            data[i].cp = value.toString().trim();
                            break;
                        }
                    }
                    localforage.setItem("hc-prescripcion-cups", data).then(function () {
                        session.eventValid();
                    });
                });
            },

            changeNotas: function (element) {
                console.log( "app.historiaClinica.prescripcion.procedimiento.changeNotas" );

                const ios = element.dataset.ios;
                const codigo = element.dataset.id;
                const value = element.value;

                localforage.getItem("hc-prescripcion-cups").then(function (data) {
                    let i;
                    for (i = 0; i < data.length; i++) {
                        if (data[i].ios == ios && data[i].c == codigo) {
                            data[i].np = value.toString().trim();
                            break;
                        }
                    }
                    localforage.setItem("hc-prescripcion-cups", data).then(function () {
                        session.eventValid();
                    });
                });
            },
        },
        render: async function ( idOrdenServicio, idPaciente ) {
            //console.log("**** app.historiaClinica.prescripcion.render ****");
            console.trace("%c app.historiaClinica.prescripcion.render ", "background:red;color:#fff;font-size:11px;font-weight:bold;");

            app.historiaClinica.core.header.showV1( idOrdenServicio );

            const element = document.getElementById("container");
            element.render("templatePrescripcion", {ios: idOrdenServicio, ipa: idPaciente});
            element.style.display = "block";

            const eventValid = async function () {
                console.log("%c detail valid", "background:red;color:white;font-weight:bold;font-size:10px");

                // validar todas las dosificaciones */
                const labelError = document.getElementById("labelErrorPX");

                // validar que los dos details tengan registros y en medicamentos todos tengan dosificacion
                //const dataProcedimientos = await localforage.getItem("hc-prescripcion-cups");
                let dataMedicamentos = await localforage.getItem("hc-prescripcion-cums");
                if (dataMedicamentos === null) dataMedicamentos = [];
                const session = nata.localStorage.getItem("session-detail");
                dataMedicamentos = dataMedicamentos.filter(function (record) {
                    return record.ios == session.ios;
                });
                console.log(dataMedicamentos);
                let i;
                for (i = 0; i < dataMedicamentos.length; i++) {
                    if (typeof dataMedicamentos[i].d == "undefined") dataMedicamentos[i].d = "";
                    //console.log(dataMedicamentos[i].d);
                    if (dataMedicamentos[i].d == "") {
                        labelError.innerHTML = "Debes ingresar la dosificación";
                        labelError.style.display = "block";
                        document.getElementById("buttonPrescripcionCerrar").disabled = true;
                        console.log(false);
                        return false;
                    }
                }

                let dataProcedimientos = await localforage.getItem("hc-prescripcion-cups");
                if (dataProcedimientos === null) dataProcedimientos = [];
                dataProcedimientos = dataProcedimientos.filter(function (record) {
                    return record.ios == session.ios;
                });
                console.log(dataProcedimientos);
                for (i = 0; i < dataProcedimientos.length; i++) {
                    if (typeof dataProcedimientos[i].cp == "undefined") dataProcedimientos[i].cp = "";
                    console.log(dataProcedimientos[i].cp);
                    if (dataProcedimientos[i].cp == "") {
                        console.log("paso 04");
                        labelError.innerHTML = "Debes ingresar la cantidad de procedimientos";
                        labelError.style.display = "block";
                        document.getElementById("buttonPrescripcionCerrar").disabled = true;
                        console.log(false);
                        return false;
                    }
                }

                document.getElementById("buttonPrescripcionCerrar").disabled = false;
                labelError.style.display = "none";
                return true;
            };
            session.eventValid = eventValid;

            const fields = {
                iu: session.user.i,
                ipa: idPaciente,
                ios: idOrdenServicio,
                f: await app.historiaClinica.core.consulta.fechaGet( idOrdenServicio ),
                il: new Date().getTime()
            };

            fields.if = 201;

            session.detail["CUPS"] = new nataUIListDetail({
                idCota: "CUPS",
                index: "hc-prescripcion-cups",
                template: "templateProcedimientosListar",
                fxRender: app.cups.index,
                key: {
                    field: "ios",
                    value: idOrdenServicio
                },
                listDetail: "detailProcedimiento",
                events: {
                    valid: eventValid
                },
                fields: fields,
                detailRender: function () {
                    console.log("%c events.detailRender", "background: red; color: #fff;font-size: 10px");
                    $("#listCUPS .procedimiento-cantidad")
                        .off()
                        .change(async function () {
                            console.log("#listProcedimiento .procedimiento-cantidad.change");

                            const id = this.dataset.id;
                            const value = this.value;

                            const labelError = document.getElementById("labelErrorPX");
                            if (value.toString().trim() == "") {
                                labelError.innerHTML = "Debes seleccionar la dosificación";
                                labelError.style.display = "block";
                                document.getElementById("buttonPrescripcionCerrar").disabled = true;
                                return false;
                            }

                            //#region guardar
                            let dataProcedimientos = await localforage.getItem("hc-prescripcion-cups");
                            let temporal = dataProcedimientos.filter(function (record) {
                                return (record.ios + "-" + record.c == idOrdenServicio + "-" + id);
                            });

                            if (temporal.length == 0) {
                                const message = "Error inesperado";
                                swal("Error Dev", message, "error");
                                console.error(message);
                                return false;
                            }

                            temporal = temporal[0];
                            temporal["d"] = value;

                            dataProcedimientos = dataProcedimientos.filter(function (record) {
                                return (record.ios + "-" + record.c != idOrdenServicio + "-" + id);
                            });
                            dataProcedimientos.push(temporal);
                            await localforage.setItem("hc-prescripcion-cups", dataProcedimientos);
                            //#endregion guardar

                            eventValid();
                        });

                    eventValid();
                }
            });

            fields.if = 200;
            const idCota = "CUMS";
            session.detail["CUMS"] = new nataUIListDetail({
                idCota: idCota,
                index: "hc-prescripcion-cums",
                template: "templateMedicamentosListar",
                fxRender: app.cums.index,
                key: {
                    field: "ios",
                    value: idOrdenServicio
                },
                listDetail: "detailMedicamento",
                fields: fields,
                events: {
                    detailRender: function () {
                        console.log("%c events.detailRender", "background: red; color: #fff;font-size: 10px");
                        $("#list" + idCota + " .medicamento-px-notas")
                            .off()
                            .change(async function () {
                                console.log("#listMedicamentos .medicamento-px-notas.change");

                                const id = this.dataset.id;
                                const value = this.value;

                                const labelError = document.getElementById("labelErrorPX");
                                if (value.toString().trim() == "") {
                                    labelError.innerHTML = "Debes seleccionar la dosificación";
                                    labelError.style.display = "block";
                                    document.getElementById("buttonPrescripcionCerrar").disabled = true;
                                    return false;
                                }

                                //#region guardar
                                let dataMedicamentos = await localforage.getItem("hc-prescripcion-cums");
                                let temporal = dataMedicamentos.filter(function (record) {
                                    return (record.ios + "-" + record.c == idOrdenServicio + "-" + id);
                                });

                                if (temporal.length == 0) {
                                    const message = "Error inesperado";
                                    swal("Error Dev", message, "error");
                                    console.error(message);
                                    return false;
                                }

                                temporal = temporal[0];
                                temporal["d"] = value;

                                dataMedicamentos = dataMedicamentos.filter(function (record) {
                                    return (record.ios + "-" + record.c != idOrdenServicio + "-" + id);
                                });
                                dataMedicamentos.push(temporal);
                                await localforage.setItem("hc-prescripcion-cums", dataMedicamentos);
                                //#endregion guardar

                                eventValid();
                            });

                        eventValid();
                    }
                }
            });

            session.detail["CUPS"].detailRender();
            session.detail["CUMS"].detailRender();

            eventValid();

            nata.localStorage.setItem("session-detail", fields);

            //app.cums.detail.render(idOrdenServicio);
            //app.cups.detail.render(idOrdenServicio);

            //#region eventos
            $("#buttonProcedimientoAdicionar")
                .off()
                .click(function () {
                    console.log("#buttonProcedimientoAdicionar.click");

                    const ios = this.dataset.ios;
                    const ipa = this.dataset.ipa;

                    session.ios = ios;
                    session.ipa = ipa;

                    app.cups.index();
                });

            $("#buttonMedicamentoAdicionar")
                .off()
                .click(function () {
                    console.log("#buttonMedicamentoAdicionar.click");

                    const ios = this.dataset.ios;
                    const ipa = this.dataset.ipa;

                    session.ios = ios;
                    session.ipa = ipa;

                    app.cums.index();
                });

            $("#buttonPrescripcionCerrar")
                .off()
                .click(async function () {
                    console.log("#buttonPrescripcionCerrar.click");
                    const dataDetailCUMS = await localforage.getItem("hc-prescripcion-cums");
                    const dataDetailCUPS = await localforage.getItem("hc-prescripcion-cups");

                    console.log(dataDetailCUPS);
                    const fecha = await app.historiaClinica.core.consulta.fechaGet( idOrdenServicio );

                    const url = app.config.server.php + "historia/prescripcionActualizar?ts=" + new Date().getTime();
                    const json = {
                        m: "Prescripción",
                        il: new Date().getTime(),
                        iu: session.user.i,
                        ipa: idPaciente,
                        ios: idOrdenServicio,
                        // aqui va la fecha y hora actual, no se necesita una fcha de session, la session va con el id paciente y codigo servicio
                        f: fecha,
                        cums: dataDetailCUMS,
                        cups: dataDetailCUPS
                    };
                    console.log(json);
                    app.offline.setItem(new Date().getItem, url, json);

                    //method, url, data, typeResponse, callback, callbackError, timeout = 0, self = {}
                    const callbackError = function () {
                        swal("Error", "Se ha presentado un error enviando datos al servidor.\nPor favor contactar a soporte Crescend", "error");
                        return false;
                    };
                    nata.ajax("post", url, json, "json", undefined, callbackError);

                    document.getElementById("container").innerHTML = "";

                    app.historiaClinica.escalas.core.render( idOrdenServicio, idPaciente, 96, "hc-escala-glasgow", "Escala Glasgow");
                    swal("Registro Exitoso", "Se registraron los datos de historia clínica", "success");

                });
            //#endregion eventos
        }
    },
    historial: {
        adapter: {
            groupByDate: async function ( data ) {
                console.log( "app.historiaClinica.historial.adapter.groupByDate" );

                // 1. obtener las fechas unicas de la evolución de la HC
                const sql = "SELECT DISTINCT dy, dm, dd, ios, nos FROM ?";
                // console.log(sql);
                let temporal = alasql(sql, [data]);
                console.log(temporal);

                // 2. vamos a recuperar la data del indice de la HC

                let diagnostico = await localforage.getItem("hc-diagnostico");
                // aqui

                const dataComboFinalidadConsulta = app.core.form.comboGet(95, "hcdi_finalidad_consulta");
                const dataComboCausaExterna = app.core.form.comboGet(95, "hcdi_causa_externa");
                //console.log(dataComboCausaExterna);

                let i;
                for (i=0; i<diagnostico.length; ++i){
                    diagnostico[i].fcd = dataComboFinalidadConsulta.filter(function (record) {
                        return record.i == diagnostico[i].fc;
                    })[0].t;

                    diagnostico[i].ced = dataComboCausaExterna.filter(function (record) {
                        return record.i == diagnostico[i].ce;
                    })[0].t;
                }
                //console.log(diagnostico);

                let dataCums = await localforage.getItem("hc-prescripcion-cums");
                if (dataCums === null) dataCums = [];

                let dataCups = await localforage.getItem("hc-prescripcion-cups");
                if (dataCups === null) dataCups = [];

                //TODO: adicionar los formatos a la vista de la HC
                //let prescripcionFormato = await localforage.getItem("hc-prescripcion-formato");

                let dataEscala = await localforage.getItem("hc-escala");

                let datosEvolucionBasica, datosConsulta, datosCuidador, signosVitales, examenFisico, cambiosAtencionPaciente;
                if (app.config.modulos.historiaClinica.unificada) {
                    datosEvolucionBasica = await localforage.getItem("hc-evolucion-basica");
                }
                else {
                    datosConsulta = await localforage.getItem("hc-datos-consulta");
                    datosCuidador = await localforage.getItem("hc-datos-cuidador");
                    signosVitales = await localforage.getItem("hc-signos-vitales");
                    examenFisico = await localforage.getItem("hc-examen-fisico");
                    cambiosAtencionPaciente = await localforage.getItem("hc-cambios-atencion-paciente");
                }

                console.log(diagnostico);

                //#region code1

                //let tempo, escala, formulario, i;
                let tempo, formulario;
                for (i = 0; i < data.length; ++i) {

                    formulario = data[i].if;

                    // diagnósticos
                    if (data[i].if == 95) {
                        // a lo que vinimos vamos
                        tempo = diagnostico.filter(function (record) {
                            return record.ios == data[i].ios;
                        });
                        data[i].diagnostico = tempo[0];
                        //console.log(tempo);

                        const dataTemporal = await localforage.getItem("hc-diagnostico-detalle");
                        data[i].detail = dataTemporal.filter(function (record) {
                            return record.ios == data[i].ios;
                        });
                    }

                    if (app.config.modulos.historiaClinica.unificada) {

                        if (data[i].m.toString().trim().toLowerCase() == "historia_clinica_escala") {
                            tempo = dataEscala.filter(function (record) {
                                return record.ios == data[i].ios;
                            });

                            if ( tempo.length > 0) {
                                data[i].datosEscala = tempo[0];
                                data[i].datosEscala.totalGlasgow = await app.historiaClinica.escalas.core.evaluacion.getTotal( data[i].datosEscala.ios, 96 );
                                data[i].datosEscala.totalBarthel = await app.historiaClinica.escalas.core.evaluacion.getTotal( data[i].datosEscala.ios, 97 );
                                data[i].datosEscala.totalKarnofsky = await app.historiaClinica.escalas.core.evaluacion.getTotal( data[i].datosEscala.ios, 98 );
                                data[i].datosEscala.totalNews = await app.historiaClinica.escalas.core.evaluacion.getTotal( data[i].datosEscala.ios, 99 );
                                console.log(data[i].datosEscala);
                            }
                            else {
                                data[i].datosEscala = {};
                            }

                        }

                        if (data[i].if == 6) {
                            tempo = datosEvolucionBasica.filter(function (record) {
                                return record.ios == data[i].ios;
                            });
                            data[i].datosEvolucionBasica = tempo[0];
                            //console.log(data[i].datosConsulta);
                        }

                        if (data[i].if == 201) {
                            tempo = dataCups.filter(function (record) {
                                return record.ios == data[i].ios;
                            });
                            data[i].datosCUPS = tempo;
                            //console.log(data[i].datosConsulta);
                        }

                        if (data[i].if == 200) {
                            tempo = dataCums.filter(function (record) {
                                return record.ios == data[i].ios;
                            });
                            data[i].datosCUMS = tempo;
                            //console.log(data[i].datosConsulta);
                        }

                    }
                    //#region historia clínica separada, no aplica ...
                    else {

                        if (data[i].if == 90) {
                            tempo = datosConsulta.filter(function (record) {
                                return record.ios == data[i].ios;
                            });
                            data[i].datosConsulta = tempo[0];
                            //console.log(data[i].datosConsulta);
                        }

                        if (data[i].if == 91) {
                            // a lo que vinimos vamos
                            tempo = datosCuidador.filter(function (record) {
                                return record.ios == data[i].ios;
                            });
                            data[i].datosCuidador = tempo[0];
                        }

                        if (data[i].if == 92) {
                            // a lo que vinimos vamos
                            tempo = signosVitales.filter(function (record) {
                                return record.ios == data[i].ios;
                            });
                            data[i].signosVitales = tempo[0];
                            //console.log(tempo);
                        }

                        if (data[i].if == 93) {
                            // a lo que vinimos vamos
                            tempo = examenFisico.filter(function (record) {
                                return record.ios == data[i].ios;
                            });
                            data[i].examenFisico = tempo[0];
                            //console.log(tempo);
                        }

                        if (data[i].if == 94) {
                            // a lo que vinimos vamos
                            tempo = cambiosAtencionPaciente.filter(function (record) {
                                return record.ios == data[i].ios;
                            });
                            data[i].cambiosAtencionPaciente = tempo[0];
                            //console.log(tempo);
                        }

                    }
                    //#endregion historia clínica separada, no aplica ...

                }
                //#endregion code1

                for (i = 0; i < temporal.length; ++i) {
                    temporal[i].detail = data.filter(function (record) {
                        return record.dy == temporal[i].dy
                            && record.dm == temporal[i].dm
                            && record.dd == temporal[i].dd
                            && record.ios == temporal[i].ios;
                    });

                    // ordenar
                    temporal[i].detail = nata.fx.json.ordenarNumerico(temporal[i].detail, "if");
                    console.log(formulario, dataEscala);
                }

                temporal = {
                    detail: temporal
                };
                return temporal;
            }
        },
        render_v1: async function (idOrdenServicio) {
            console.log("%c app.historiaClinica.historial.render_v1", "background:red;color:white;font-weight:bold;font-size:12px");

            //#region adaptador, ajusta la estructura de la data a la templeta en la vista
            let data = await localforage.getItem( "historia-clinica" );
            data = data.filter(function (record) {
                return record.ios == idOrdenServicio;
            });
            console.log( data );

            const dataHistoriaClinica = [];
            let i;
            for (i=0; i<data.length; i++) {
                dataHistoriaClinica.push( JSON.parse( data[i].json ) );
                dataHistoriaClinica[i].modulo = data[i].m;
            }
            //#endregion

            if (data.length == 0) {
                const message = "No hay datos de historia clínica";
                swal(app.config.title, message, "error");
                console.error(message);
                return false;
            }

            console.log( dataHistoriaClinica );
            const fxGetVars = function ( html ) {
                //console.log(tagline.indexOf('developers')); // 20
                let position, positionSpace, strVar, strPiece, indexOtros;
                let str;
                console.log( html, html.length);
                position = html.indexOf("obj.");
                //console.log( position );
                if ( position == -1 ) return {
                    s: "",
                    sp: ""
                };
                console.log( position );
                str = html.substr( position, html.length, html );
                positionSpace = str.indexOf(" ");
                if ( positionSpace === -1 ) {
                    positionSpace = str.length;
                }
                strVar = str.substr( 0, positionSpace );

                indexOtros = strVar.indexOf("}");
                if ( indexOtros !== -1 ) {
                    strVar = strVar.substr( 0, indexOtros );
                }

                strPiece = str.substr( positionSpace, str.length, str);
                console.log ( strPiece.substr(0, 100) );
                return {
                    s: strVar.replace("obj.", ""),
                    sp: strPiece
                };
            };
            //let contador = 0;

            const fxFixData = function ( html ) {
                let boolContinue = true;
                let arr = [], stringPiece = "", result;
                while ( boolContinue ) {
                    if ( stringPiece == "" ) {
                        result = fxGetVars( html );
                        arr.push( result.s );
                    }
                    else {
                        result = fxGetVars( stringPiece );
                        //console.log( contador, stringPiece );
                        if ( result.s != "" ) {
                            arr.push( result.s );
                        }
                    }
                    stringPiece = result.sp;
                    //console.log( stringPiece );
                    if ( stringPiece == "") {
                        boolContinue = false;
                    }
                }
                //console.log( contador );
                console.log( arr );

                if ( dataHistoriaClinica.length > 0) {
                    // validar
                    let i;
                    for (i=0; i<arr.length; i++) {
                        if ( typeof dataHistoriaClinica[0][arr[i]] == "undefined" ) {
                            dataHistoriaClinica[0][arr[i]] = "";
                            //console.error( "No hay datos para esta propiedad -> " + arr[i] );
                            //return false;
                        }
                    }
                }
            };

            //fxFixData( templates_.templateHCEvolucionBasica );
            //fxFixData( templates_.templateHCSignosVitales );

            new nataUIDialog({
                height: session.height,
                html: nata.ui.template.get( "templateHistoriaClinica", { detail: dataHistoriaClinica } ),
                width: session.width,
                title: "Historia Clínica",
                events: {
                    render: function () {},
                    close: function () {}
                }
            });


        }
    },
    cerrar: {
        render: function ( idOrdenServicio ) {
            console.log("%c app.historiaClinica.cerrar.render ", "background: orange; color: #fff;");
            console.log( idOrdenServicio );
            swal({
                text: "Deseas Cerrar la Historia Clínica? Una vez cerrada no puedes modificarla",
                icon: "warning",
                buttons: ["NO, voy a revisar", "SI, Cerrar"],
                dangerMode: true,
            }).then((response) => {
                if (response) {
                    //
                    const url = app.config.server.php + "historia/cerrar/";
                    const json = {
                        ios: idOrdenServicio
                    };
                    const callback = async function (data) {
                        console.log("callback");
                        console.log(data);
                        //swal("Se ha cerrado la Historia Clínica", "", "success");
                        $("#liAgenda-" + idOrdenServicio).remove();

                        if ( $("#medicoAgenda .list-group-item").length == 0 ) {
                            document.getElementById("container").innerHTML = "";
                        }

                        // eliminar el registro local
                        const tempo = await nata.localforage.removeItem("agenda", "ios", "", idOrdenServicio, "");
                        console.log(tempo);

                    };

                    const options = {
                        parameters: {
                            index: "orden-servicio-registro",
                            attribute: "ios",
                            value: idOrdenServicio
                        },
                        fx: "remove"
                    };
                    window["remove"] = nata.localStorage.remove;
                    //title, text = "Has actualizado los datos", url, json, callback, code = "", boolShowDialog = true, options = {}
                    app.core.server.send("Se ha cerrado la Historia Clínica", "Se registraron los datos de historia clínica", url, json, callback, "", true, options);
                }
            });
        }
    },

    otros: {
        cerrar: function (idOrdenServicio) {
            console.trace("%c app.historiaClinica.otros.cerrar ", "background:red;color:#fff;font-size:11px;font-weight:bold;");
            session.flujo.push( "app.historiaClinica.otros.cerrar" );

            const json = {
                ios: idOrdenServicio,
                il: new Date().getTime()
            };

            const url = app.config.server.php + "consulta/otrosCerrar?ts=" + new Date().getTime();
            //method, url, data, typeResponse, callback, callbackError, timeout = 0, self = {}
            nata.ajax("post", url, json, "json",
                function (response) {
                    console.log(response);
                    if (response.length == 0) {
                        console.error("se ha presentado un error");
                    }
                    app.historiaClinica.core.consulta.cerrar(response[0], false);
                }
            );
        }
    },

    sanitas: {
        premium: {
            cerrar: function (idOrdenServicio) {
                console.log("%c app.historiaClinica.sanitas.premium.cerrar ", "background:red;color:#fff;font-size:11px;font-weight:bold;");
                session.flujo.push( "app.historiaClinica.sanitas.premium.cerrar" );
                //alert(idOrdenServicio);

                localforage.getItem("agenda").then(function(data) {
                    //#region recuperar datos del paciente
                    data = data.filter(function (record) {
                        return record.ios == idOrdenServicio;
                    })[0];
                    console.log(data);
                    const oDataPaciente = {
                        nombre: data.pn + " " + data.sn + " " + data.pa + " " + data.sa,
                        identificacion: data.ni,
                        tipoIdentificacion: data.tit,
                        convenio: data.cn,
                        servicio: data.s,
                        fechaNacimiento: data.fn,
                        direccion: data.pd,
                        municipio: data.m || "",
                        departamento: data.d || ""
                    };
                    nata.sessionStorage.setItem("session", oDataPaciente);
                    const idPaciente = data.ipa;
                    console.log(oDataPaciente);
                    //#endregion recuperar datos del paciente
                    let oDialog;
                    if (data.fn.toString().trim() == "") {
                        const template = `
                            {{#templates_.templateHeaderTablePaciente}}
                            <form id="frmPacienteEdad">
                                <div class="w-100 widget-date">
                                    <label class="mt-2">Fecha Nacimiento</label>
                                    <div class="w-100 text-center">
                                        <input type="number" id="txtYear"
                                            class="form-control d-inline-block year ui-input-numerico"
                                            placeholder="AAAA"
                                            min="1920"
                                            max="{{=new Date().getFullYear()}}"
                                            required>
                                        <input type="number" id="txtMonth"
                                            class="form-control d-inline-block month ui-input-numerico"
                                            min="1"
                                            max="12"
                                            placeholder="MM"
                                            required>
                                        <input type="number" id="txtDay"
                                            class="form-control d-inline-block day ui-input-numerico"
                                            min="1"
                                            max="31"
                                            placeholder="DD"
                                            required>
                                    </div>

                                    <div class="w-100 text-center">
                                        <span id="widget-date-message" class="form-text footer">
                                            <strong>(AAAA-MM-DD)</strong> Ejemplo: 2010-12-01
                                        </span>
                                    </div>
                                </div>

                                <div class="w-100 text-center mt-4">
                                    <button id="buttonSubmitContinuar" type="submit" 
                                        class="btn btn-primary min-width-250px d-inline-block" disabled>Continuar</button>
                                </div>
                            </form>
                        `;
                        document.querySelector("#container").style.display = "none";

                        oDialog = new nataUIDialog({
                            height: 450,
                            html: doT.template(template, undefined, templates_)(oDataPaciente),
                            width: 360,
                            title: "Fecha Nacimiento Paciente",
                            events: {
                                render: function () {
                                },
                                close: function () {
                                    document.querySelector("#container").style.display = "block";
                                }
                            }
                        });

                        //#region core
                        const fxRemoveError = function () {
                            const elements = document.querySelectorAll(".ui-error");
                            let i;
                            for (i=0; i<elements.length; i++) {
                                elements[i].remove();
                            }
                        };

                        const fxAddError = function name(form, message) {
                            const div = document.createElement("div");
                            div.setAttribute("class", "ui-error");
                            div.innerHTML = message;
                            form.append(div);
                        };

                        const fxValidateDate = function () {
                            const strDate = document.querySelector("#txtYear").value + "-" + 
                            document.querySelector("#txtMonth").value + "-" + 
                            document.querySelector("#txtDay").value;
                            const isValid = dayjs(strDate, "YYYY-MM-DD", true).isValid();
                            if (!isValid) {
                                document.querySelector("#buttonSubmitContinuar").disabled = true;
                            }
                            else {
                                document.querySelector("#buttonSubmitContinuar").disabled = false;
                            }
                        };
                        //#endregion core

                        //#region events
                        const elInputYear = document.querySelector("#txtYear");
                        console.log(elInputYear);
                        elInputYear.addEventListener("input", function() {
                            const self = this;
                            fxRemoveError();

                            //#region año error
                            console.log(self.validity);
                            if (self.validity.rangeUnderflow) {
                                fxAddError(self.form, "Debes ingresar mínimo 1920");
                            }
                            else if (self.validity.rangeOverflow) {
                                fxAddError(self.form, "Debes ingresar máximo " + new Date().getFullYear());
                            }
                            else {
                                fxValidateDate();
                            }
                            //#endregion year
                        });

                        const elInputMonth = document.querySelector("#txtMonth");
                        elInputMonth.addEventListener("input", function() {
                            const self = this;
                            fxRemoveError();
                            if (self.validity.rangeUnderflow) {
                                fxAddError(self.form, "El mes mínimo es 01");
                            }
                            else if (self.validity.rangeOverflow) {
                                fxAddError(self.form, "El mes máximo es 12");
                            }
                        });

                        elInputMonth.addEventListener("change", function() {
                            const self = this;
                            fxRemoveError();
                            if (self.value.toString().trim().length == 1) {
                                self.value = "0" + self.value;
                            }
                            else if (self.value.toString().trim().length > 2) {
                                fxAddError(self.form, "2 dígitos unicamente");
                            }
                            else {
                                fxValidateDate();
                            }
                        });

                        const elInputDay = document.querySelector("#txtDay");
                        elInputDay.addEventListener("input", function() {
                            const self = this;
                            fxRemoveError();
                            if (self.validity.rangeUnderflow) {
                                fxAddError(self.form, "El día mínimo es 01");
                            }
                            else if (self.validity.rangeOverflow) {
                                fxAddError(self.form, "El día máximo es 31");
                            }
                        });
                        elInputDay.addEventListener("change", function() {
                            const self = this;
                            fxRemoveError();
                            if (self.value.toString().trim().length == 1) {
                                self.value = "0" + self.value;
                            }
                            else if (self.value.toString().trim().length > 2) {
                                fxAddError(self.form, "2 dígitos unicamente");
                            }
                            else {
                                fxValidateDate();
                            }
                        });

                        document.querySelector("#frmPacienteEdad").addEventListener("submit", function(e) {
                            e.preventDefault();
                            // enviar la data al servidor
                            const oDataServerSend = {
                                url: app.config.server.php + "paciente/fechaNacimientoSet/",
                                data: {
                                    ipa: idPaciente,
                                    fn: document.querySelector("#txtYear").value + "-" + 
                                        document.querySelector("#txtMonth").value + "-" + 
                                        document.querySelector("#txtDay").value
                                }
                            };
                            app.server.send(oDataServerSend, function () {
                                oDialog.destroy();
                                document.querySelector("#container").style.display = "block";
                                app.historiaClinica.sanitas.premium.precierre(idOrdenServicio);
                            });
                        });
                        //#endregion events

                        //#region filter inputs
                        $("input.year").inputfilter(
                            {
                                allowNumeric: true,
                                allowText: false,
                                actionLog: false,
                                allowCustom: [],
                                maxLength: 4
                            }
                        );

                        $("input.month, input.day").inputfilter(
                            {
                                allowNumeric: true,
                                allowText: false,
                                allowCustom: [],
                                maxLength: 2,
                                actionLog: true
                            }
                        );

                        //#endregion filter inputs
                    }
                    else {
                        //@audit revisar aqui
                        app.historiaClinica.sanitas.premium.precierre(idOrdenServicio);
                    }
                });
            },
            consulta: {
                form: {
                    validar: function () {
                        console.trace("%c app.historiaClinica.sanitas.premium.consulta.form.validar ", "background:red;color:#fff;font-size:11px;font-weight:bold;");
                        const elButton = document.querySelector("#buttonSanitasConsultaCerrar");
                        if (
                            nata.sessionStorage.getItem("data-consulta").cv.toString() === "" ||
                            nata.sessionStorage.getItem("data-consulta").d.toString() === "" ||
                            nata.sessionStorage.getItem("data-consulta").di.toString() === "" ||
                            nata.sessionStorage.getItem("data-consulta").detail.length == 0
                        ) {
                            elButton.classList.add("disabled");
                        }
                        else {
                            elButton.classList.remove("disabled");
                        }
                    }
                }
            },
            precierre: function (idOrdenServicio) {
                console.log("%c app.historiaClinica.sanitas.premium.precierre ", "background:red;color:#fff;font-size:11px;font-weight:bold;");
                //#region code
                /* definir estructura de datos */
                const dataConsulta = {
                    m: "keralty-premium-consulta",
                    ios: idOrdenServicio,
                    idlocal: new Date().getDate(),
                    cv: "123456",
                    d: 0,
                    o: "Consulta sin novedad",
                    di: "Servicio Atendido",
                    detail: []
                };
                nata.sessionStorage.setItem("data-consulta", dataConsulta);

                //#region telemetria
                /*
                const oDateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
                localforage.getItem("agenda").then(function (data) {
                    console.log(data);

                    const timestamp = new Date().getTime();
                    const oTelemetria = {
                        iu: session.user.i,
                        il: timestamp,
                        dt: oDateTime,
                        ios: idOrdenServicio,
                        a: "click botón cerrar",
                        p: data[0].pn + " " + data[0].sn + " " + data[0].pa + " " + data[0].sa,
                        ni: data[0].ni
                    };

                    console.log(oTelemetria);
                    localforage.getItem("telemetria").then(function (dataTelemetria) {
                        if (dataTelemetria == null) dataTelemetria = [];
                        dataTelemetria.push(oTelemetria);
                        localforage.setItem("telemetria", dataTelemetria);
                        console.log(dataTelemetria);

                        const url = app.config.server.php + "core/telemetria?ts=" + new Date().getTime();
                        app.offline.setItem(timestamp, url, oTelemetria);
                        if( app.config.dev.online ) {
                            nata.ajax("post", url, oTelemetria, "json", function (response) {
                                console.log(response);
                                app.offline.removeItem(timestamp);
                            });
                        }
                    });

                });
                */
                //#endregion telemetria

                const data = nata.sessionStorage.getItem("session");
                oDialog = new nataUIDialog({
                    html: doT.template(document.querySelector("#templateSanitasPremiumConsultaCerrar").innerHTML, undefined, templates_)(data),
                    title: "Pre Cierre Keralty CRM",
                    events: {
                        render: function () {},
                        close: function () {}
                    }
                });

                document.querySelector("#buttonSanitasConsultaCerrar").classList.add("disabled");

                $("input.ui-input-numerico").inputfilter(
                    {
                        allowNumeric: true,
                        allowText: false,
                        actionLog: false,
                        allowCustom: []
                    }
                );

                $("input.ui-input-latin").inputfilter(
                    {
                        allowNumeric: true,
                        allowText: true,
                        actionLog: true,
                        allowCustom: ["ñ", "Ñ", "á", "é", "í", "ó", "ú", "Á", "É", "Í", "Ó", "Ú", "ü", "Ü", ".", "-", "&", ",", " ", "#", "@", "_"]
                    }
                );

                //#region eventos
                document.querySelector("#txtCodigoVerificacion").addEventListener("change", function() {
                    console.log("#txtCodigoVerificacion.change");
                    const dataConsulta = nata.sessionStorage.getItem("data-consulta");
                    dataConsulta.cv = this.value;
                    nata.sessionStorage.setItem("data-consulta", dataConsulta);
                    app.historiaClinica.sanitas.premium.consulta.form.validar();
                });

                document.querySelector("#txtDiasIncapacidad").addEventListener("change", function() {
                    console.log("#txtDiasIncapacidad.change");
                    const dataConsulta = nata.sessionStorage.getItem("data-consulta");
                    dataConsulta.d = this.value;
                    nata.sessionStorage.setItem("data-consulta", dataConsulta);
                    app.historiaClinica.sanitas.premium.consulta.form.validar();
                });

                document.querySelector("#tarObservaciones").addEventListener("change", function() {
                    console.log("#tarObservaciones.change");
                    const dataConsulta = nata.sessionStorage.getItem("data-consulta");
                    dataConsulta.o = this.value;
                    nata.sessionStorage.setItem("data-consulta", dataConsulta);
                    app.historiaClinica.sanitas.premium.consulta.form.validar();
                });

                document.querySelector("#selectDireccionamiento").addEventListener("change", function() {
                    console.log("#selectDireccionamiento.change");
                    const data = nata.sessionStorage.getItem("data-consulta");
                    data.di = this.value;
                    nata.sessionStorage.setItem("data-consulta", data);
                    app.historiaClinica.sanitas.premium.consulta.form.validar();
                });

                $(".ui-dialog .form-check-input")
                    .off()
                    .change(function() {
                        console.log(".form-check-input.change");
                        console.log(this);
                        const value = this.value;
                        session.value = value;

                        if (this.checked) {
                            const callback = function () {
                                // muy importante para optimizar manejo de eventos, se clona el elemento para eliminar todos
                                // los eventos
                                const elClusterizer = document.querySelector("#listClusterize");
                                //elClusterizer.replaceWith(elClusterizer.cloneNode(true));
                                elClusterizer.addEventListener( "click", function ( event ) {
                                    console.log("#listClusterize.click");
                                    event.preventDefault();
                                    event.stopPropagation();
                                    console.log(event.target);
                                    if ( event.target.classList.contains( "button-list-create" ) ) {
                                        console.log("#listClusterize .button-list-create.click");
                                        const codigo = event.target.dataset.codigo;
                                        const text = event.target.dataset.text;
                                        const elBox = document.querySelector("#box" + session.value);
                                        console.log(elBox);
                                        elBox.innerHTML = `<span class="badge text-bg-primary">${codigo} - ${text}</span>`;

                                        const dataCie = nata.sessionStorage.getItem("data-consulta").detail.filter(function (record) {
                                            return record.td != session.value;
                                        });

                                        dataCie.push({
                                            td: session.value,
                                            c: codigo,
                                            t: text
                                        });

                                        const dataConsulta = nata.sessionStorage.getItem("data-consulta");
                                        dataConsulta.detail = dataCie;
                                        nata.sessionStorage.setItem("data-consulta", dataConsulta);
                                        console.log(dataConsulta);
                                        //return false;
                                        app.historiaClinica.sanitas.premium.consulta.form.validar();
                                        session.cie10.dialog.hide();
                                        //#region  data
                                    }
                                }, true);
                            };
                            const options = {
                                events: {
                                }
                            };
                            app.cie10.render(options, callback);
                        }
                        else {
                            const elBox = document.querySelector("#box" + session.value);
                            elBox.innerHTML = "";
                            const dataConsulta = nata.sessionStorage.getItem("data-consulta");
                            const dataCie = dataConsulta.detail.filter(function (record) {
                                return record.td != session.value;
                            });
                            dataConsulta.detail = dataCie;
                            nata.sessionStorage.setItem("data-consulta", dataConsulta);

                            app.historiaClinica.sanitas.premium.consulta.form.validar();
                        }
                    });

                $("#buttonSanitasConsultaCerrar")
                    .off()
                    .click(function () {
                        console.log("#buttonSanitasConsultaCerrar.click");
                        swal({
                            title: app.config.title,
                            text: "Deseas cerrar esta consulta ?",
                            icon: "success",
                            buttons: ["NO, voy a revisar", "SI, Continuar"],
                            dangerMode: false,
                        }).then(function(response) {
                            if (response) {
                                oDialog.destroy();

                                const dataConsulta = nata.sessionStorage.getItem("data-consulta");
                                console.log(dataConsulta);

                                //#region telemetria
                                /*
                                const oDateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
                                localforage.getItem("agenda").then(function (data) {
                                    console.log(data);

                                    const timestamp = new Date().getTime();
                                    const oTelemetria = {
                                        iu: session.user.i,
                                        il: timestamp,
                                        dt: oDateTime,
                                        ios: idOrdenServicio,
                                        a: "click botón finalizar consulta"
                                    };

                                    console.log(oTelemetria);
                                    localforage.getItem("telemetria").then(function (dataTelemetria) {
                                        if (dataTelemetria == null) dataTelemetria = [];
                                        dataTelemetria.push(oTelemetria);
                                        localforage.setItem("telemetria", dataTelemetria);
                                        console.log(dataTelemetria);

                                        const url = app.config.server.php + "core/telemetria?ts=" + new Date().getTime();
                                        app.offline.setItem(timestamp, url, oTelemetria);
                                        if( app.config.dev.online ) {
                                            nata.ajax("post", url, oTelemetria, "json", function (response) {
                                                console.log(response);
                                                app.offline.removeItem(timestamp);
                                            });
                                        }
                                    });
                                });
                                */
                                //#endregion telemetria
                                const timestamp = new Date().getTime();
                                const url = app.config.server.php + "monitor/keralty/consultaCerrar_v2";
                                session.consulta.fin = dayjs().format("YYYY-MM-DD HH:mm:ss");
                                dataConsulta.ini = session.consulta.inicio;
                                dataConsulta.fin = session.consulta.fin;
                                dataConsulta.idlocal = timestamp;
                                nata.sessionStorage.setItem("data-consulta", dataConsulta);

                                session.dialog = new nataUIDialog({
                                    height: 250,
                                    html: `
                                        <div id="loader" class="loader">
                                            <svg class="circular" viewbox="25 25 50 50">
                                                <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />
                                            </svg>
                                        </div>
                                    `,
                                    width: 400,
                                    title: "Enviando Datos de PreCierre Keralty",
                                    events: {
                                        render: function () {},
                                        close: function () {}
                                    }
                                });

                                const callbackError = function () {
                                    session.dialog.destroy();
                                    session.dialog = new nataUIDialog({
                                        height: 250,
                                        html: `
                                            <div class='w-100 p-2'>
                                                No fue posible enviar los datos.<br>Tienes problemas de conexión<br>
                                                Igual no te preocupes, Artemisa enviará los datos tan pronto encuentre conexión.
                                            </div>
                                        `,
                                        width: 400,
                                        title: "Enviando Datos de PreCierre Keralty",
                                        events: {
                                            render: function () {},
                                            close: function () {}
                                        }
                                    });
                                    app.offline.setItem(timestamp, url, nata.sessionStorage.getItem("data-consulta"), true);
                                };

                                // soporte offline
                                if(app.config.dev.online) {
                                    console.log(nata.sessionStorage.getItem("data-consulta"));
                                    //alert("ajustando dataConsulta");
                                    //return false;
                                    nata.ajax("post", url + "?ts=" + new Date().getTime(), nata.sessionStorage.getItem("data-consulta"), "json",
                                        function (response) {
                                            console.log(response);
                                            if (response.length == 0) {
                                                console.error("se ha presentado un error");
                                            }
                                            app.historiaClinica.core.consulta.cerrar(response[0]);
                                        },
                                        function (xmlhttp) {
                                            callbackError();
                                            console.error(xmlhttp);
                                        },
                                        30 * 1000
                                    );
                                }
                            }
                        });
                    });
                //#endregion eventos
            }
        }
    },

    test: {
        estado: function () {
            console.log("%c app.historiaClinica.test.estado ", "background: orange; color: #fff;");
            const oHistoriaClinica = new artemisaHistoriaClinica();
            oHistoriaClinica.test();
        }
    }
};

//#region events
$(document).on("submit", "#formDialoghistoriaClinica", function (event) {
    event.preventDefault();
    event.stopPropagation();

    const selectorTipoIdentificacion = document.getElementById("historiaClinicaTipoIdentificacion");
    const tipoIdentificacion = selectorTipoIdentificacion.options[selectorTipoIdentificacion.selectedIndex].text;
    session.historiaClinica = {
        indiceTipoIdentificacion: selectorTipoIdentificacion.value,
        tipoIdentificacion: tipoIdentificacion,
        numeroIdentificacion: $("#historiaClinicaNumeroIdentificacion").val()
    };

    console.log(session.historiaClinica);

    $("#uiDialog").remove();
    app.historiaClinica.render();
});

$(document).on("click", ".button-hc-datos-generales", function () {
    app.historiaClinica.datosGenerales.render(this.dataset.ipa, this.dataset.ios);
});

$(document).on("click", ".button-hc-datos-cuidador", function () {
    app.historiaClinica.datosCuidador.render(this.dataset.ipa, this.dataset.ios);
});

$(document).on("click", ".button-hc-signos-vitales", function () {
    app.historiaClinica.signosVitales.render(this.dataset.ipa, this.dataset.ios);
});

$(document).on("click", ".button-hc-examen-fisico", function () {
    app.historiaClinica.examenFisico.render(this.dataset.ipa, this.dataset.ios);
});

$(document).on("click", ".button-hc-cambios-atencion-paciente", function () {
    app.historiaClinica.cambiosAtencionPaciente.render(this.dataset.ipa, this.dataset.ios);
});

$(document).on("click", ".button-hc-diagnostico", function () {
    app.historiaClinica.diagnostico.render( this.dataset.ipa, this.dataset.ios );
});

$(document).on("click", ".button-hc-glasgow", function () {
    //app.historiaClinica.escalas.glasgow.render(this.dataset.ipa, this.dataset.ios);
    app.historiaClinica.escalas.core.render( this.dataset.ios, this.dataset.ipa, 96, "hc-escala-glasgow", "Escala Glasgow");
});

$(document).on("click", ".button-hc-barthel", function () {
    app.historiaClinica.escalas.core.render( this.dataset.ios, this.dataset.ipa, 97, "hc-escala-barthel", "Escala Barthel");
});

$(document).on("click", ".button-hc-karnofsky", function () {
    app.historiaClinica.escalas.core.render( this.dataset.ios, this.dataset.ipa, 98, "hc-escala-karnofsky", "Escala Karnofsky");
});

$(document).on("click", ".button-hc-news", function () {
    //app.historiaClinica.escalas.news.render(this.dataset.ipa, this.dataset.ios);
    app.historiaClinica.escalas.core.render( this.dataset.ios, this.dataset.ipa, 99, "hc-escala-news", "Escala News");
});

$(document).on("click", ".button-hc-prescripcion", function () {
    app.historiaClinica.prescripcion.render( this.dataset.ios, this.dataset.ipa );
});

$(document).on("click", ".button-hc-cerrar", function () {
    app.historiaClinica.cerrar.render( this.dataset.ios );
});
//#endregion events
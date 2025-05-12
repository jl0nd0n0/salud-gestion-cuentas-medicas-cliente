/* globals app, nata, $, session, swal, nataUIList, Jets, nataUIFormBasic, alasql, oState, workflow, nataUIDialog, dayjs, doT */

let oWorkflow;

app.flujo = {
    agenda: {
        teleconsulta: {
            manual: {
                // REVISED:
                send: function (data, boolValidar = 1, boolCrearServicio = 1, boolForzar = 0) {
                    console.trace("%c app.flujo.agenda.teleconsulta.manual.send ", "background:orange;color:white;font-weight:bold;font-size:11px");
                    session.flujo.push("app.flujo.agenda.teleconsulta.manual.send");

                    //const flujoFormaAgendamiento = sessionStorage.getItem("flujo-forma-agendamiento");

                    const dataAgenda = {
                        il: new Date().getTime(),
                        ip: oWorkflow.idPaquete,
                        iu: session.user.i,
                        agenda: data,
                        ico: oState.state.servicio.convenio,
                        s: oWorkflow.flow[oWorkflow.step].d,
                        cs: oWorkflow.flow[oWorkflow.step].icc,
                        sc: oWorkflow.flow[oWorkflow.step].pq,
                        ts: oWorkflow.flow[oWorkflow.step].ts,
                        fs: oState.state.servicio.fechaSolicitud,
                        h: oState.state.servicio.horaSolicitud,
                        ipa: oState.state.paciente.i,
                        a: oState.state.servicio.autorizacion,
                        im: oState.state.servicio.masivaID,
                        validar: boolValidar,
                        boolCrearServicio: boolCrearServicio,
                        forzar: boolForzar,
                        t: oWorkflow.flow[oWorkflow.step].tc
                    };

                    console.log(dataAgenda);

                    //method, url, data, typeResponse, callback, callbackError
                    nata.ajax("post", app.config.server.php + "agenda/teleconsultaAgendarManual", dataAgenda, "json", function (response) {
                        console.log("%c control autorización y servicio ", "background:red;color:white;font-weight:bold;font-size:11px");
                        console.log(response);

                        if (typeof response.servicioFechaConteo == "undefined") response.servicioFechaConteo = 0;
                        if (typeof response.autorizacionConteo == "undefined") response.autorizacionConteo = 0;
                        if (typeof response.servicioConteo == "undefined") response.servicioConteo = 0;

                        if (response.servicioFechaConteo > 0) {
                            $(".ui-dialog").remove();
                            swal("Ya existe el servicio agendado", "Ya existe por lo menos un código CUN agendado para el paciente", "error");
                            app.flujo.paciente.ordenServicio.listar(false);
                            return false;
                        }

                        if (response.autorizacionConteo > 0) {
                            swal("Ya existe la autorización", "La autorización ya había sido cargada ..", "error");
                            app.flujo.paciente.ordenServicio.listar();
                            return false;
                        }

                        if (response.servicioConteo > 0) {
                            $(".ui-dialog").remove();
                            swal("Ya existe el servicio agendado", "código CUN agendado para el paciente", "error");
                            app.flujo.paciente.ordenServicio.listar(true);
                            return false;
                        }

                        //console.log(response);
                        if (response.length == 0) {
                            swal("No hay respuesta de la agenda", "Por favor contacta a Soporte", "error");
                            return false;
                        }

                        if (typeof session.masiva == "undefined") session.masiva = { id: 0 };
                        if (oState.state.servicio.masivaID !== "") {
                            response[0].id = session.masiva.id;
                        }

                        $("#uiDialog-" + session.dialogTimestamp).remove();
                        //console.log(response[0]);

                        oWorkflow.flow[oWorkflow.step].estado = 1;
                        oWorkflow.flow[oWorkflow.step].idProfesional = data.idProfesional;
                        oWorkflow.flow[oWorkflow.step].profesional = data.profesional;
                        oWorkflow.flow[oWorkflow.step].horaInicial = data.horaInicial;
                        oWorkflow.flow[oWorkflow.step].horaFinal = data.horaFinal;
                        // aqui termina el flujo
                        ++oWorkflow.step;
                        if (oWorkflow.flow.length == oWorkflow.step) {
                            // cerrar el flujo
                            oWorkflow.end( response[0] );
                        }
                        else {
                            oWorkflow.render();
                        }
                    });
                }
            }
        }
    },
    paciente: {
        // REVISED:
        actualizar: function (callback) {
            console.log("%c app.flujo.paciente.actualizar ", "background:red;color:white;font-weight:bold;font-size:11px");
            session.flujo.push("app.flujo.paciente.actualizar");

            //#region UI
            $("#dropdown-paciente").hide();
            console.warn("#dropdown-paciente -> hide");
            //#endregion UI

            //#region guardar la session del paciente
            //@audit hay que revisar si es necesario guardar la session del paciente
            //#endregion guardar la session del paciente

            let widget = "", tipo = "";

            let idLocal;
            if ( typeof oState.state.paciente.idlocal == "undefined" ) {
                idLocal = new Date().getTime();
            }
            else {
                idLocal = oState.state.paciente.idlocal;
            }

            const json = {
                if: session.forms["paciente"].options.form.idForm,
                il: idLocal,
                iu: session.user.i,
                i: oState.state.paciente.i,
                identificacion: oState.state.paciente.identificacion,
                json: session.forms["paciente"].options.form.fields.map(function (record) {
                    if (record.tr == "divipola") widget = "divipola";
                    else widget = "";

                    if (record.se == "custom" || record.se == "numerico") tipo = "numerico";
                    else tipo = "";

                    return {
                        c: record.c,
                        r: record.response,
                        w: widget,
                        t: tipo,
                        tr: record.tr
                    };
                })
            };
            nata.ajax("post", app.config.server.php + "paciente/actualizar?ts=" + new Date().getTime(), json, "json", function ( response ) {
                console.log( response );
                //oState.setProp ( "paciente", { ti: response[0].td } );
                if (typeof callback == "function") callback();
            });
        },
        buscar: {
            perfil: {
                programador: {
                    render: function () {
                        console.log("%c app.flujo.paciente.buscar.perfil.programador.render ", "background:red;color:white;font-weight:bold;font-size:11px");
                        app.flujo.paciente.buscar.render( function ( response ) {
                            session.operacion = "editar";
                            session.dataset.checklist[session.operacion] = false;
                            oState.setProp ( "paciente", response[0] );
                            app.flujo.paciente.crearEditar.render();
                        });
                    }
                },
                profesional: {
                    render: function () {
                        console.log("%c app.flujo.paciente.buscar.perfil.profesional.render ", "background:red;color:white;font-weight:bold;font-size:11px");
                        app.flujo.paciente.buscar.render( function ( response ) {
                            oState.setProp ( "paciente", response[0] );
                            app.flujo.paciente.consultar.render(response);
                        });
                    }
                },

            },
            // REVISED:
            render: function () {
                console.log("%c app.flujo.paciente.buscar.render ", "background:red;color:white;font-weight:bold;font-size:11px");
                session.flujo.push("app.flujo.paciente.buscar.render");

                $(".ui-dialog").remove();
                session.flujo = [];

                //#region toolbar dev
                const devToolbar = document.getElementById("devToolbar");
                if (app.config.dev.mode) {
                    devToolbar.render("templateButtonRobot");
                    devToolbar.style.display = "none";
                    document.getElementById("buttonRobot").style.display = "inline-block";

                    $(".button-robot")
                        .off()
                        .click(function () {
                            app.robot.testing.run(1);
                        });

                    $(".ui-container-toolbar").show();
                }
                else {
                    devToolbar.style.display = "none";
                }
                //#endregion

                sessionStorage.clear();
                sessionStorage.setItem("flujo-forma-carga-paciente", "manual");
                sessionStorage.setItem("flujo-masiva-covid", 0);

                // estado
                session.estado.paciente.tipoCarga = "manual";

                const container = document.getElementById("container");
                container.render("templatePacienteConsultar");
                //container.style.display = "block";

                //#region dev, presentation
                const element = document.getElementById("txtIdentificacion");
                if ( app.config.dev.mode ) {
                    element.value = "79500207";
                }
                //#endregion dev, presentation
                element.focus();

                $("#txtIdentificacion").inputfilter(
                    {
                        allowNumeric: true,
                        allowText: false,
                        actionLog: false,
                        allowCustom: []
                    }
                );

                $("#frmPacienteConsultar")
                    .off()
                    .submit(function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        console.log("%c #frmPacienteConsultar.submit ", "background:red;color:white;font-weight:bold;font-size:12px");
                        console.log( { identificacion: element.value } );
                        oState.setProp("paciente", { identificacion: element.value });
                        app.flujo.paciente.buscar.server( event, false, undefined, element.value );
                    });
            },
            // REVISED:
            server: function (event, boolMasiva = false, dataSession, identificacion) {
                console.log("%c app.flujo.paciente.buscar.server ", "background:red;color:white;font-weight:bold;font-size:12px");
                session.flujo.push("app.flujo.paciente.buscar.server");

                // clear state - session
                session.dataset.checklist = [];

                //console.log(event);

                if (typeof event !== "undefined") {
                    event.preventDefault();
                    event.stopPropagation();
                }

                session.state = oState;

                if ( typeof oState.state.paciente == "undefined" ) {
                    const message = "No existe session 'paciente', revisar la clase artemisaState ";
                    swal("Error Dev", message, "error");
                    console.error(message);
                    return false;
                }

                const json = {
                    id: identificacion
                };

                nata.ajax("post", app.config.server.php + "paciente/identificacionGet", json, "json", function (response) {
                    if (app.config.dev.verbose.secundario) console.log("* paciente/identificacionGet.callback .. *");
                    console.log(response);

                    // se eliminan los datos del preregistro de paciente anterior
                    //FIXME: revisar, esto es lógico?
                    //@audit revisar, esto es lógico?
                    nata.localStorage.removeItem("form-5-1");

                    if (response.length == 0) {
                        // crear paciente
                        session.existe = false;
                        oState.setProp("paciente", { boolExiste: false });
                        nata.sessionStorage.setItem("session", { boolExiste: false });
                        console.log( oState.state );
                        session.operacion = "crear";
                        session.dataset.checklist[session.operacion] = false;
                        console.warn("flujo: paciente no existe");

                        let dataRecord;

                        if ( boolMasiva ) {
                            //#region actualizar datos de masiva
                            console.log("%c paciente: actualizar datos masiva ", "background: orange; color: #fff;");
                            // si proviene de una masiva y no existe el paciente, hay que actualizar los datos del paciente que sirvan y crearlo
                            const pacientesMasiva = nata.sessionStorage.getItem("masiva");
                            const record = pacientesMasiva.filter(function (record) {
                                return record.i == dataSession.masiva.idPaciente;
                            })[0];
                            //console.log(record);

                            // mapear los datos de la masiva al paciente
                            // ciudad
                            dataRecord = {};
                            let value;
                            if (dataSession.convenio == "sanitas") {
                                value = nata.fx.mapeo.sanitasCovid.get("c", record.c);
                                if (value === false) {
                                    swal("No es posible mapear la ciudad del paciente", "", "error");
                                    console.error("No es posible mapear la ciudad del paciente");
                                    return false;
                                }
                                else {
                                    // divipola direccion residencia
                                    dataRecord.pac_direccion_divipola = value;

                                    value = nata.fx.mapeo.sanitasCovid.get("tp", record.tp);
                                    if (value === false) {
                                        swal("No es posible mapear la divipola de la dirección", "", "error");
                                        console.error("No es posible mapear la divipola de la dirección");
                                        return false;
                                    }
                                    else {
                                        console.log(record);
                                        record.tp = value;
                                        dataRecord.tid_id = value;
                                        dataRecord.pac_numero_identificacion = record.nd;
                                        dataRecord.pac_nombre = record.np;
                                        dataRecord.pac_telefono_etiqueta = "";
                                        dataRecord.pac_telefono_movil_1 = record.t1;
                                        dataRecord.pac_telefono_movil_2 = record.t2;
                                        dataRecord.pac_direccion = record.d;
                                        console.log(dataRecord);
                                        console.log(record.ss);
                                        sessionStorage.setItem("masiva-servicio-solicitado", record.ss);
                                    }
                                }
                            }
                            else {
                                dataRecord.pac_nombre = record.np;
                                dataRecord.pac_telefono_etiqueta = record.tp;
                                dataRecord.pac_numero_identificacion = record.d;
                                dataRecord.pac_direccion = record.dp;
                                alert("revisar fecha de solicitud");
                            }

                            //#endregion actualizar datos de masiva
                        }
                        else {
                            dataRecord = {
                                "pac_numero_identificacion": oState.state.paciente.identificacion
                            };
                        }
                        //identificacion, data, convenio, hora, fecha, boolCrearPaciente
                        console.log(dataRecord);
                        console.log(dataSession);
                        app.flujo.paciente.preRegistro.render(dataRecord, dataSession);
                    }
                    else {
                        const data = {
                            boolExiste: true,
                            nombre: response[0].nc,
                            identificacion: response[0].ni,
                            direccion: response[0].d
                        };
                        nata.sessionStorage.setItem("session", data);
                        response[0].boolExiste = true;
                        oState.setProp( "paciente", response[0] );
                        app.flujo.paciente.crearEditar.render( response[0] );
                    }
                });
            }
        },
        crearEditar: {
            // REVISED:
            // data: parametro que se recibe cuando se va a editar el paciente
            render: function ( data ) {
                console.log("%c app.flujo.paciente.crearEditar.render ", "background:red;color:white;font-weight:bold;font-size:11px");
                session.flujo.push("app.flujo.paciente.crearEditar.render");

                const elDialog = document.querySelector(".ui-dialog");
                if (elDialog !== null) elDialog.remove();

                //#region toolbar
                if (app.config.dev.mode) {
                    const devToolbar = document.getElementById("devToolbar");
                    devToolbar.render("templateButtonRobot");
                    devToolbar.style.display = "inline-block";
                    document.getElementById("buttonRobot").style.display = "inline-block";
                    document.querySelector(".ui-container-toolbar").style.display = "inline-block";

                    if( nata.sessionStorage.getItem("session").boolExiste ) {
                        $(".button-robot")
                            .show()
                            .off()
                            .click(function () {
                                if(session.forms["paciente"].options.form.idSection == 1) {
                                    app.testing.paciente.existe.seccion1();
                                }
                                else if(session.forms["paciente"].options.form.idSection == 2) {
                                    app.testing.paciente.existe.seccion2();
                                }
                            });
                    }
                    else {
                        $(".button-robot")
                            .show()
                            .off()
                            .click(function () {
                                if(session.forms["paciente"].options.form.idSection == 1) {
                                    app.testing.paciente.noExiste.seccion1();
                                }
                                else if(session.forms["paciente"].options.form.idSection == 2) {
                                    app.testing.paciente.noExiste.seccion2();
                                }
                            });
                    }

                }
                //#endregion toolbar

                // bloquear el # de identificacion del paciente

                // TODO: revisar esto
                session.paciente.masiva = 0;
                sessionStorage.setItem("covid", 0);
                //sessionStorage.setItem("operacion", "crear");
                //#region toolbar
                const toolbar = document.getElementById("toolbar");
                toolbar.render("templatePacienteToolbar", { detail: nata.localStorage.getItem("tipo-paciente-no-efectivo") });
                toolbar.style.display = "inline-block";
                $(".ui-container-toolbar").show();
                //#endregion toolbar
                console.trace( data );
                if ( typeof data == "undefined" ) {
                    data =  nata.localStorage.getItem("form-5-1");
                }

                let fxBeforeSend;
                //@audit 01 cerrar esta lógica
                if ( nata.sessionStorage.getItem("session").boolExiste ) {
                    fxBeforeSend = function () {
                        app.flujo.paciente.actualizar();
                    };
                }
                else {
                    fxBeforeSend = function () {
                        app.flujo.paciente.actualizar(function () {
                            console.log("events.beforeSend");

                            //idForm, claseOCampo, value
                            const tipoIdentificacion = app.core.form.comboGet( 5, "paciente-tipo_identificacion", data[6].response );
                            data = session.forms["paciente"].adapterDataFields();
                            console.log ( data );
                            data.td = tipoIdentificacion;
                            oState.setProp("paciente", data );

                            const oSession = nata.sessionStorage.getItem("session");
                            let nombre = data.pn;
                            if (typeof data.sn !== "undefined") nombre = nombre + " " + data.sn;
                            if (typeof data.pa !== "undefined") nombre = nombre + " " + data.pa;
                            if (typeof data.sa !== "undefined") nombre = nombre + " " + data.sa;
                            oSession.nombre = nombre;
                            oSession.identificacion = data.ni;
                            oSession.direccion = data.d;
                            nata.sessionStorage.setItem("session", oSession);

                            /*
                            const oSession = {
                                boolExiste: true,
                                nombre: response[0].nc,
                                identificacion: response[0].ni,
                                direccion: response[0].d
                            };
                            */
                            //nata.sessionStorage.setItem("session", data);

                            console.log( oState.state.paciente );
                            //app.flujo.core.worflow.render();
                            app.flujo.paciente.ordenServicio.iniciarFlujo();
                        });
                    };
                }

                //#region render forms
                const options = {
                    form: {
                        boolButtons: true,
                        boolSend: false,
                        idForm: 4,
                        idSection: 1,
                        typeStorage: "localstorage",
                        index: "paciente",
                        idRecord: 0,
                        title: "Crear / Actualizar Paciente",
                        table: "paciente",
                        dataset: {
                            data: data
                        }
                    }
                };

                console.log( options );

                const events = {
                    beforeSend: fxBeforeSend,
                    formSend: function ( data ) {
                        console.log( "formSend ..." );
                        console.log( data );

                        if ( Array.isArray( data ) ) {
                            const message = "Se espera un objeto no un array";
                            swal("Error Dev", message, "error");
                            console.error(message);
                            return false;
                        }

                        // recuperar el tipo de identificacion
                        const tipoIdentificacion = app.core.form.comboGet( 5, "paciente-tipo_identificacion", data.ti );
                        data.td = tipoIdentificacion;
                        oState.setProp( "paciente", data, true );
                        const oSession = {
                            nombre: data.pn + " " + data.pa,
                            identificacion: data.ni,
                            direccion: data.d
                        };
                        app.flujo.paciente.ordenServicio.render(oSession);
                    },
                    render: function () {
                        console.log(session.forms["paciente"]);
                        //if (operacion == "editar") {
                        const element = document.querySelector("input.paciente-numero-identificacion");
                        if (element !== null) {
                            element.setAttribute("readonly", true);
                        }
                        //}
                    }
                };

                //session.forms["paciente"] = new nataUIFormBasic( options, dataset, events );
                session.forms["paciente"] = new nataUIFormBasic( options, undefined, events );
                session.forms["paciente"].renderLayout();
                //#endregion render form
            }
        },
        consultar: {
            // REVISED:
            render: function () {
                console.trace("%c app.flujo.paciente.consultar.render ", "background:red;color:white;font-weight:bold;font-size:11px");
                session.flujo.push("app.flujo.paciente.consultar.render");
                alert("app.flujo.paciente.consultar.render");

                // limpiar dialog busqueda paciente
                document.querySelector( "#container" ).innerHTML = "";

                //#region toolbar
                const toolbar = document.getElementById("toolbar");
                toolbar.render("templatePacienteToolbar", { detail: nata.localStorage.getItem("tipo-paciente-no-efectivo") });
                toolbar.style.display = "inline-block";
                $(".ui-container-toolbar").show();
                //#endregion toolbar

                // recuperar los datos el paciente
                console.log( oState.state.paciente );

                const element = document.getElementById("container-header");
                element.render( "templatePacienteDatosBasicos-laptop", oState.state.paciente );
                element.style.display = "block";

                setTimeout(function() {

                    const data = {
                        ipa: oState.state.paciente.i
                    };
                    //method, url, data, typeResponse, callback, callbackError, timeout = 0, self = {}
                    nata.ajax( "post", app.config.server.php + "paciente/historiaClinicaGet", data, "json",
                        function ( response ) {
                            console.log( response );
                            if ( response.length == 0 ) {
                                const message = "No hay datos de historia clínica";
                                swal( app.config.dialog.title || "Artemisa IPS", message, "success");
                                return false;
                            }
                        }
                    );
                }, 0.25 * 1000);
            }
        },
        direccion: {
            // REVISED:
            //@audit deprecate
            georeferenciar: function (fecha, geo = {}) {
                console.log("%c app.flujo.paciente.direccion.georeferenciar ", "background: orange; color: #fff;");
                session.flujo.push("app.flujo.paciente.direccion.georeferenciar");

                console.log(oState);

                // si es domiciliaria se captura la coordenada del paciente
                //titulo, settings, template, data, blnDialogosRemover, callback
                let url = "https://www.google.com/maps/place/" + oState.state.paciente.d + " Bogotá";
                url = url.replaceAll(" ", "+");
                url = url.replaceAll("#", "%23");
                url = url.replaceAll("é", "%C3%A1");
                const data = {
                    url: url,
                    paciente: [oState.state.paciente]
                };

                const html = nata.ui.template.get("templateServicioDomiciliariaAgendar", data);
                new nataUIDialog({
                    html: html,
                    title: "Agenda Consulta Domiciliaria",
                    events: {
                        render: function () {},
                        close: function () {}
                    }
                });

                geo = {};
                if (typeof geo.latitud == "string") {
                    document.getElementById("txtLatitud").value = geo.latitud;
                }

                if (typeof geo.longitud == "string") {
                    document.getElementById("txtLongitud").value = geo.longitud;
                    $("#buttonAgendar1").attr("disabled", false);
                }

                //#region filter input
                setTimeout(function() {
                    $("#textareaLatlng").inputfilter(
                        {
                            allowNumeric: true,
                            allowText: false,
                            actionLog: false,
                            allowCustom: [".", ",", "-"]
                        }
                    );
                }, 0.5 * 1000);
                //#endregion filter input

                //#region events
                $("#textareaLatlng")
                    .off()
                    .change(function () {
                        const coordenada = this.value;

                        if (this.value.toString().trim() == "") {
                            $("#buttonAgendar1").attr("disabled", true);
                        }
                        else {
                            const arr = coordenada.split(",");

                            if (typeof arr[0] !== "undefined") {
                                $("#txtLatitud").val(arr[0].trim());
                                oState.setProp( "servicio", { latitud: arr[0].trim()} );
                            }

                            if (typeof arr[1] !== "undefined") {
                                $("#txtLongitud").val(arr[1].trim());
                                oState.setProp( "servicio", { longitud: arr[1].trim()} );
                            }

                            console.log( oState.state );
                            $("#buttonAgendar1").attr("disabled", false);
                        }
                    });

                $("#buttonPrevious").attr("disabled", false);
                $("#buttonAgendar1")
                    .off()
                    .click(function () {
                        console.log("#buttonAgendar1.click");
                        session.noAgendaDiaSiguienteContador = 0;
                        app.agenda.domiciliaria.send( fecha );
                    });
                //#endregion events
            },

            georeferenciar_v1: function (oSession, geo = {}) {
                console.log("%c app.flujo.paciente.direccion.georeferenciar_v1 ", "background:red; color:#fff;");
                session.flujo.push("app.flujo.paciente.direccion.georeferenciar_v1");

                // si es domiciliaria se captura la coordenada del paciente
                //titulo, settings, template, data, blnDialogosRemover, callback
                const options = {
                    height: 600,
                    left: (session.width - 450) / 2,
                    top: 50,
                    width: 450
                };
                // OJO: debe llegar la ciudad al final
                let url = "https://www.google.com/maps/place/" + oSession.direccion;
                url = url.replaceAll(" ", "+");
                url = url.replaceAll("#", "%23");
                url = url.replaceAll("é", "%C3%A1");

                const data = Object.assign(oSession, {});
                data.url = url;
                app.core.ui.dialogo.render("Agenda Consulta Domiciliaria", options, "templateServicioDomiciliariaAgendar-v1", data, true);

                if (typeof geo.latitud == "string") {
                    document.getElementById("txtLatitud").value = geo.latitud;
                }

                if (typeof geo.longitud == "string") {
                    document.getElementById("txtLongitud").value = geo.longitud;
                    $("#buttonAgendar1").attr("disabled", false);
                }

                $("#textareaLatlng")
                    .off()
                    .change(function () {
                        const coordenada = this.value;

                        if (this.value.toString().trim() == "") {
                            $("#buttonAgendar1").attr("disabled", true);
                        }
                        else {
                            const arr = coordenada.split(",");

                            if (typeof arr[0] !== "undefined") {
                                $("#txtLatitud").val(arr[0].trim());
                                oState.setProp( "servicio", { latitud: arr[0].trim()} );
                            }

                            if (typeof arr[1] !== "undefined") {
                                $("#txtLongitud").val(arr[1].trim());
                                oState.setProp( "servicio", { longitud: arr[1].trim()} );
                            }

                            console.log( oState.state );
                            $("#buttonAgendar1").attr("disabled", false);
                        }
                    });

                $("#buttonPrevious").attr("disabled", false);
                $("#buttonAgendar1")
                    .off()
                    .click(function () {
                        console.log("#buttonAgendar1.click");
                        session.noAgendaDiaSiguienteContador = 0;
                        app.agenda.domiciliaria.send_v1( oSession, dayjs().format("YYYY-MM-DD HH:mm:ss"), document.getElementById("txtLatitud").value, document.getElementById("txtLongitud").value );
                    });
            }
        },
        insertar: function (callback) {
            console.trace("%c app.flujo.paciente.insertar ", "background: orange; color: #fff;");
            session.flujo.push("app.flujo.paciente.insertar");

            //#region enviar paciente
            //console.log(session.form.fields);
            console.log(session.forms["pre-registro"].options.form.fields);
            let widget, tipo;
            oState.setProp( "paciente", { idlocal: new Date().getTime() } );
            const json = {
                if: session.forms["pre-registro"].options.form.idForm,
                il: oState.state.paciente.idlocal,
                iu: session.user.i,
                i: oState.state.paciente.i,
                identificacion: oState.state.paciente.identificacion,
                json: session.forms["pre-registro"].options.form.fields.map(function (record) {
                    if (record.tr == "divipola") widget = "divipola";
                    else widget = "";

                    if (record.se == "custom" || record.se == "numerico") tipo = "numerico";
                    else tipo = "";

                    return {
                        c: record.c,
                        r: record.response,
                        w: widget,
                        t: tipo,
                        tr: record.tr
                    };
                })
            };

            const callbackError = function () {
                swal("102002 - Se ha presentado un error", "Por favor contacta a Soporte", "error");
                return false;
            };

            nata.ajax("post", app.config.server.php + "paciente/insertar", json, "json", function (response) {
                console.log(response);
                oState.setProp("paciente", { i: response[0].i });
                if (typeof callback == "function") callback();
            }, callbackError);
            //#endregion
        },
        masiva: {
            agendar: function (dataset) {
                console.log("%c app.flujo.paciente.masiva.agendar ", "background:orange;color:white;font-weight:bold;font-size:11px");
                session.flujo.push("app.flujo.paciente.masiva.agendar");
                console.log(dataset);

                const message = "No se ha configurado esta funcionalidad";
                swal("Artemisa IPS", message, "error");
                return false;

                //#region fecha solicitud masiva
                let fecha = dataset.fecha.toString().split("-");
                const year = 2000 + parseInt(fecha[2]);

                if (isNaN(year)) {
                    console.error("Se ha presentado un error con el año de la masiva");
                    swal("Se ha presentado un error con el año de la masiva", "Revisar la fecha de la masiva", "error");
                    return false;
                }

                if (year < 2021 && year > 2031) {
                    console.error("Se ha presentado un error con el año de la masiva");
                    swal("Se ha presentado un error con el año de la masiva", "Revisar la fecha de la masiva", "error");
                    return false;
                }

                const mes = fecha[1];
                const dia = fecha[0];
                fecha = year + "-" + nata.fx.date.string.twoDigits(mes) + "-" + nata.fx.date.string.twoDigits(dia);
                const masiva = {
                    id: dataset.id,
                    fecha: fecha
                };
                app.core.session.paciente.set("masiva", masiva);

                oState.state.servicio.masivaIDPaciente = dataset.id;
                //#endregion fecha solicitud masiva

                // guardar en sessionStorage el id del paciente en la masiva
                session.paciente.masiva = 1;
                $(".ui-dialog").remove();
                dataSession = {
                    masiva: {
                        idPaciente: dataset.id,
                        fecha: fecha,
                        servicio: dataset.servicio
                    },
                    paciente: {
                        identificacion: dataset.identificacion
                    },
                    convenio: dataset.convenio,
                    hora: "",
                    boolCrearPaciente: true
                };

                console.log("Se ha limpiado #container");

                oState.state.paciente.identificacion = dataset.identificacion;
                app.flujo.paciente.buscar.server(undefined, true, dataSession);
            },
            listar: function () {
                console.log("%c app.flujo.paciente.masiva.listar ", "background: orange; color: #fff;");
                session.flujo.push("app.flujo.paciente.masiva.listar");

                session.convenio = this.dataset.convenio;
                let url;
                if (session.convenio == "sanitas") {
                    url = "paciente/masivaSanitas/";
                }
                else {
                    url = "paciente/masivaColmedica/";
                }

                // TODO: aqui se guardaba la fecha de carga de la masiva
                sessionStorage.setItem("masiva-fecha", this.dataset.fecha);
                // TODO: aqui se guardaba la hora de carga de la masiva
                sessionStorage.setItem("masiva-hora", this.dataset.hora);

                document.querySelector("#container").innerHTML = "";

                const id = this.dataset.id;
                if (typeof session.masiva == "undefined") session.masiva = {};
                oState.state.servicio.masivaID = id;

                // ajax get data
                //(method, url, data, typeResponse, callback, callbackError)
                nata.ajax("get", app.config.server.php + url + session.user.ia + "/" + id, {}, "json", function (data) {
                    console.log(data);
                    nata.sessionStorage.setItem("masiva", data);
                    console.log("paciente ajax masiva get");

                    //jsonDialog, index, data, jsonLayout
                    oDialog = {
                        title: "Pacientes masiva " + session.convenio,
                        close: true,
                        //#region buttons
                        buttons: [
                            {
                                type: "button",
                                class: "button-regresar",
                                icon: "arrow-left-circle.svg",
                                alt: "Volver",
                                click: nata.ui.dialog.closeAll
                            },
                            /*
							{
								type: "dropdown",
								class: "",
								icon: "dots-vertical-white.svg",
								dropdown: [
									{
										id: "buttonDescuentoLotes",
										text: "Descuento Lotes"
									},
									{
										id: "buttonDialogDropdownProductBonificado",
										text: "Bonificados"
									},
									{
										id: "buttonDialogDropdownProductKits",
										text: "Kits"
									},
								]
							},
							{
								type: "button",
								class: "button-pedido-ver",
								color: "warning",
								icon: "filter-menu.svg",
								//click: app.order.confirm
							}
							*/
                        ]
                        //#endregion buttons
                    };

                    let template;
                    if (session.convenio == "sanitas") {
                        template = "templateMasivaPacienteSanitasCovid-mobile";
                    }
                    else {
                        template = "templateMasivaPacienteColmedicaCovid-mobile";
                    }

                    const oClusterize = {
                        fieldsFilter: ["np", "nd", "t1", "t2", "ss", "pl"],
                        templateRender: template,
                        search: true
                    };

                    //dialog, config, events = {}, index, data, detail, callbacks = {}
                    const oList = new nataUIList(oDialog, oClusterize, {}, "masiva-pacientes-covid-sanitas", data);
                    //session.lists["pedido"] = oList;
                    oList.render();
                });
            }
        },
        noEfectivo: {
            send: function (callback, callbackError, dataset, boolValidar = 1, boolForzar = 0) {
                console.log("%c app.flujo.paciente.noEfectivo.send", "background:orange;color:white;font-weight:bold;font-size:11px");
                session.flujo.push("app.flujo.paciente.noEfectivo.send");

                if (typeof session.dataset == "undefined") session.dataset = {};
                if (typeof session.dataset.paciente == "undefined") session.dataset.paciente = {};
                if (typeof session.dataset.idProfesional == "undefined") session.dataset.idProfesional = 0;

                if (typeof oState.state.servicio.masivaID == "undefined") oState.state.servicio.masivaID = "";
                if (typeof oState.state.servicio.autorizacion == "undefined") oState.state.servicio.autorizacion = "";
                if (typeof oState.state.servicio.convenio == "undefined") oState.state.servicio.convenio = "";

                let fecha;
                if (typeof dataset == "undefined") dataset = {};
                if (typeof dataset.masiva == "undefined") dataset.masiva = {};
                if (typeof dataset.masiva.fecha == "undefined") dataset.masiva.fecha = "";

                if (dataset.masiva.fecha !== "") {
                    fecha = dataset.masiva.fecha;

                    // corregir formato de fecha
                    const arrFecha = fecha.split("-");

                    const year = arrFecha[0];
                    const day = arrFecha[1];
                    const month = arrFecha[2];

                    console.log(fecha);
                    console.log(year, month, day);

                    fecha = year.toString() + "-" + month.toString() + "-" + day.toString();
                }
                else {
                    //fecha = session.dataset.paciente.ordenServicio.fechaSolicitud;
                    fecha = oState.state.servicio.fechaSolicitud;
                }

                let dataAutorizacion = "";
                if ( typeof oState.state.servicio.autorizacion !== "undefined" ) {
                    dataAutorizacion = oState.state.servicio.autorizacion;
                }

                const json = {
                    ipa: oState.state.paciente.i,
                    il: session.user.i + "-" + new Date().getTime(),
                    iu: session.user.i,
                    ico: oState.state.servicio.convenio,
                    ipr: oState.state.servicio.idProfesional || 0,
                    cs: oState.state.servicio.icc,
                    s: oState.state.servicio.d,
                    fs: fecha,
                    h: oState.state.servicio.horaSolicitud,
                    a: dataAutorizacion,
                    ine: dataset.idNoEfectivo,
                    ned: dataset.descripcionNoEfectivo,
                    boolCrearServicio: 1,
                    validar: boolValidar,
                    forzar: boolForzar,
                    // masiva
                    mn: session.dataset.masiva.nombre, // masiva nombre
                    im: oState.state.servicio.masivaID, // id masiva
                    imp: oState.state.servicio.masivaIDPaciente // id paciente
                };
                console.log(json);

                nata.ajax("post", app.config.server.php + "paciente/noEfectivoSet", json, "json", function (data) {
                    console.log(data);
                    console.warn(data);

                    //#region control ordenes de servicio
                    if (typeof data.noEfectivoFechaConteo == "undefined") data.noEfectivoFechaConteo = 0;
                    if (typeof data.noEfectivoConteo == "undefined") data.noEfectivoConteo = 0;

                    if (data.noEfectivoFechaConteo > 0) {
                        $(".ui-dialog").remove();
                        swal("1002 - ya existe reporte", "Ya existe reporte de paciente no efectivo", "error");
                        app.flujo.paciente.ordenServicio.listar(false, 2);
                        return false;
                    }
                    if (data.noEfectivoConteo > 0) {
                        $(".ui-dialog").remove();
                        swal("1003 - Ya existe reporte de paciente no efectivo", "Ya ha sido reportado este paciente como NO EFECTIVO !!", "error");
                        app.flujo.paciente.ordenServicio.listar(true, 2);
                        return false;
                    }

                    //#endregion control ordenes de servicio

                    if (typeof callback === "function") callback(data);

                }, callbackError);
            }
        },
        preRegistro: {
            // REVISED:
            render: function (dataForm, dataSession) {
                console.log("%c app.flujo.paciente.preRegistro.render ", "background: red; color: #fff;font-size:12px");
                session.flujo.push("app.flujo.paciente.preRegistro.render");

                const element = document.getElementById( "dropdown-paciente" );
                if ( element !== null) element.display = "none";

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
                        .click(app.testing.paciente.crear);
                }
                //#endregion toolbar

                //#region render forms
                const options = {
                    form: {
                        boolButtons: true,
                        boolSend: false,
                        idForm: 5,
                        idSection: 1,
                        typeStorage: "localstorage",
                        index: "paciente",
                        idRecord: 0,
                        title: "Pre registro paciente",
                        subtitle: "Datos Básicos del Paciente"
                    }
                };
                /*
				const dataset = {
					data: data
				};
				*/
                const events = {
                    beforeSend: function () {
                        console.log("events.beforeSend ...");
                        app.flujo.paciente.insertar(function () {
                            console.log(dataSession);
                            app.flujo.paciente.ordenServicio.render(dataSession);
                        }, dataSession);
                    },
                    afterSaveRecordLocal: function( data ) {
                        console.log( "events.afterSaveRecordLocal" );
                        console.log( data );
                        nata.sessionStorage.setItem( "paciente", data );
                    },
                    render: function () {
                        console.log("events.render ...");
                        const element = document.querySelector(".paciente-numero-identificacion");
                        element.value = oState.state.paciente.identificacion;
                        element.classList.remove("invalid");
                        const id = element.dataset.id;
                        document.getElementById("control-" + id + "-label").style.display = "none";
                        element.readOnly = true;
                        session.forms["pre-registro"].fieldSave(element);
                    },
                    valid: function () {
                        console.log("events.valid ...");
                        session.dataset.paciente.movil1 = $("input.paciente-movil-1")[0].value;
                        session.dataset.paciente.movil2 = $("input.paciente-movil-2")[0].value;
                        return true;
                    }
                };
                session.forms["pre-registro"] = new nataUIFormBasic(options, undefined, events);
                session.forms["pre-registro"].renderLayout();
                $("#frmSection .pac_nombre")
                    .off()
                    .click(function () {
                        navigator.clipboard.writeText(this.value);
                    });
            }
        },
        ordenServicio: {
            ui: {
                // REVISED:
                logica: function () {
                    console.log("app.flujo.paciente.ordenServicio.ui.logica");
                    session.flujo.push("app.flujo.paciente.ordenServicio.ui.logica");
                    console.log( oState.state );
                    // no quitar, controla que si borran la fecha y hora bloquee los botones
                    if (typeof oState.state.servicio.fechaSolicitud == "undefined") oState.state.servicio.fechaSolicitud = "";
                    if (oState.state.servicio.fechaSolicitud == "") oState.state.servicio.fechaSolicitud = undefined;

                    if (typeof oState.state.servicio.horaSolicitud == "undefined") oState.state.servicio.horaSolicitud = "";
                    if (oState.state.servicio.horaSolicitud == "") oState.state.servicio.horaSolicitud = undefined;

                    if (oState.state.servicio.au == 1) {
                        console.log(oState.state.servicio.icc, oState.state.servicio.convenio, oState.state.servicio.autorizacion, oState.state.servicio.fechaSolicitud, oState.state.servicio.horaSolicitud);

                        if (typeof oState.state.servicio.autorizacion == "undefined") oState.state.servicio.autorizacion = "";

                        if (
                            typeof oState.state.servicio.icc !== "undefined" &&
							typeof oState.state.servicio.convenio !== "undefined" &&
							oState.state.servicio.autorizacion !== "" &&
							typeof oState.state.servicio.fechaSolicitud !== "undefined" &&
							typeof oState.state.servicio.horaSolicitud !== "undefined"
                        )
                        {
                            document.getElementById("buttonPacienteNoEfectivo").disabled = false;
                            if ( nata.sessionStorage.getItem("session").boolExiste ) {
                                document.getElementById("buttonPacienteAgendarManual").disabled = false;
                            }
                            else {
                                document.getElementById("buttonPacienteCrear").disabled = false;
                            }
                        }
                        else {
                            document.getElementById("buttonPacienteNoEfectivo").disabled = true;
                            if ( nata.sessionStorage.getItem("session").boolExiste ) {
                                document.getElementById("buttonPacienteAgendarManual").disabled = true;
                            }
                            else {
                                document.getElementById("buttonPacienteCrear").disabled = true;
                            }
                        }
                    }
                    else {
                        console.log(oState.state.servicio.icc, oState.state.servicio.convenio, oState.state.servicio.fechaSolicitud, oState.state.servicio.horaSolicitud);

                        if (
                            typeof oState.state.servicio.icc !== "undefined" &&
							typeof oState.state.servicio.convenio !== "undefined" &&
							typeof oState.state.servicio.fechaSolicitud !== "undefined" &&
							typeof oState.state.servicio.horaSolicitud !== "undefined"
                        ) {
                            document.getElementById("buttonPacienteNoEfectivo").disabled = false;
                            if ( nata.sessionStorage.getItem("session").boolExiste ) {
                                document.getElementById("buttonPacienteAgendarManual").disabled = false;
                            }
                            else {
                                document.getElementById("buttonPacienteCrear").disabled = false;
                            }
                        }
                        else {
                            document.getElementById("buttonPacienteNoEfectivo").disabled = true;
                            if ( nata.sessionStorage.getItem("session").boolExiste ) {
                                document.getElementById("buttonPacienteAgendarManual").disabled = true;
                            }
                            else {
                                document.getElementById("buttonPacienteCrear").disabled = true;
                            }
                        }
                    }
                },
                reset: function () {
                    console.log("app.flujo.paciente.ordenServicio.ui.reset");

                    const selectors = ["#buttonPacienteNoEfectivo", "#buttonPacienteCrear"];
                    let i, element;
                    for(i=0; i<selectors.length; i++) {
                        element = document.querySelector(selectors[i]);
                        if (element !== null) element.disabled = true;
                    }
                }
            },
            // REVISED:
            iniciarFlujo: function () {
                console.trace("%c app.flujo.paciente.ordenServicio.iniciarFlujo ", "background:blue;color:white;font-weight:bold;font-size:11px");
                session.flujo.push("app.flujo.paciente.ordenServicio.iniciarFlujo");
                // adicionar el servicio seleccionado al motor de flujo
                document.getElementById( "container" ).innerHTML = "";
                //@todo continuar ....
                console.log( oState.state.servicio );
                oWorkflow = new workflow();
                oWorkflow.render();
            },
            // tipo: 1 si es agenda orden de servicio, 2 si es paciente no efectivo
            listar: function (blnCrear = false, tipo = 1) {
                console.log("%c app.flujo.paciente.ordenServicio.listar ", "background: red; color: #fff; font-size: 12px; font-weight: bold");
                session.flujo.push("app.flujo.paciente.ordenServicio.listar");

                $(".ui-dialog").remove();

                const callback = function (response) {
                    console.log(response);
                    if (response.length == 0) {
                        swal("No hay ordenes de servicio", "", "error");
                        return false;
                    }

                    const json = {
                        tipo: tipo,
                        detail: response,
                        blnCrear: blnCrear
                    };

                    new nataUIDialog({
                        height: session.height,
                        html: doT.template(document.getElementById("templatePacienteOrdenesServicio").innerHTML)(json),
                        width: session.width,
                        title: "Ordenes de Servicio para el Paciente",
                        events: {
                            render: function () {},
                            close: function () {}
                        }
                    });

                    if (blnCrear) {
                        $("#buttonPrestacionControlContinuar")
                            .off()
                            .click(function () {
                                console.log("#buttonPrestacionControlContinuar.click");

                                if (tipo == 2) {
                                    console.log(session.dataset.noEfectivo);

                                    const callback = function () {
                                        document.getElementById("container").innerHTML = "";
                                        $(".ui-dialog").remove();
                                        swal("Se ha reportado el paciente como no efectivo !", "", "success");
                                    };

                                    const callbackError = function () {
                                        swal("102006 - Se ha presentado un error", "Por favor contacta a Soporte", "error");
                                        return false;
                                    };

                                    //callback, callbackError, dataset, boolValidar = 1, boolForzar = 0
                                    app.flujo.paciente.noEfectivo.send(callback, callbackError, session.dataset.noEfectivo, 0, 1);
                                }
                                else {
                                //data, boolValidar = 1, boolCrearServicio = 1, boolForzar = 0
                                    app.flujo.agenda.teleconsulta.manual.send(session.dataset.agenda, undefined, undefined, 1);
                                }
                            });
                    }
                };

                const callbackError = function () {
                    swal("102023 - Se ha presentado un error", "Por favor contacta a Soporte", "error");
                    console.error("102023 - Se ha presentado un error");
                    return false;
                };

                nata.ajax("get", app.config.server.php + "paciente/ordenesServicioGet/" + oState.state.paciente.i, {}, "json", callback, callbackError);
            },
            // REVISED:
            render: function () {
                console.log("%c app.flujo.paciente.ordenServicio.render", "background:red;color:white;font-weight:bold;font-size:12px");
                session.flujo.push("app.flujo.paciente.ordenServicio.render");

                //#region ui
                app.flujo.paciente.ordenServicio.ui.reset();
                document.getElementById("container").innerHTML = "";
                //#endregion ui

                //#region state - session
                oState.state.servicio = {};
                nata.sessionStorage.setItem("servicio", {});
                console.log(nata.sessionStorage.getItem("servicio"));
                //#endregion state - session

                //#region render orden de servicio
                const data = nata.localStorage.getItem("convenio-servicios");
                const sql = "SELECT DISTINCT ic AS i, cn AS t FROM ?";
                //console.log(sql);
                const convenios = alasql(sql, [data]);
                //console.log(convenios);

                const dataTemplate = {
                    convenios: convenios,
                    detail: nata.localStorage.getItem("tipo-paciente-no-efectivo")
                };
                console.log(dataTemplate);

                const callback = function () {
                    // si se esta creando el paciente se forza que al cerrar el dialogo se elimine el form para crear el paciente.
                    // el paciente ya esta creado
                    if (session.operacion == "crear") {
                        $(".button-dialog-close").remove();
                    }
                    app.core.ui.agenda.buttons.refresh();
                };

                $(".ui-dialog").remove();
                const options = {
                    title: "Creación Orden de Servicio",
                    html: "",
                    height: "auto",
                    width: 550,
                    top: 25,
                    left: (session.width - 550) / 2,
                    callback: callback
                };
                let oDialog = new nataUIDialog(options);
                dataTemplate.dialog = oDialog.getID;
                oDialog.render(nata.ui.template.get("templateOrdenServicio", dataTemplate));
                $("#txtFechaPacienteSolicitud").val(dayjs().format("YYYY-MM-DD"));

                //#region deprecate
                oState.setProp("servicio", {fechaSolicitud: dayjs().format("YYYY-MM-DD")});
                console.log(oState);
                //#endregion deprecate

                const oSession = nata.sessionStorage.getItem("servicio");
                oSession.fechaSolicitud = dayjs().format("YYYY-MM-DD");
                nata.sessionStorage.setItem("servicio", oSession);
                console.log(nata.sessionStorage.getItem("session"));
                
                app.flujo.paciente.ordenServicio.ui.logica();

                document.getElementById("buttonPacienteNoEfectivo").addEventListener("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    oDialog =  new nataUIDialog({
                        height: "auto",
                        html: nata.ui.template.get("templatePacienteNoEfectivoList", {detail: nata.localStorage.getItem("tipo-paciente-no-efectivo")}),
                        left: (session.width - 400) / 2,
                        title: "Selecciona el motivo ..",
                        top: 50,
                        width: 400
                    });

                    //#region evento paciente no efectivo click
                    $(oDialog.getID).find(".menu-paciente-no-efectivo")
                        .off()
                        .click(function () {
                            console.log(".menu-paciente-no-efectivo.click");

                            const self = this;
                            const id = self.dataset.id;
                            const motivo = self.dataset.motivo;

                            const callback = function () {
                                document.getElementById("container").innerHTML = "";
                                $(".ui-dialog").remove();
                                swal("Se ha reportado el paciente como no efectivo !", "", "success");
                            };

                            const callbackError = function () {
                                swal("102006 - Se ha presentado un error", "Por favor contacta a Soporte", "error");
                                return false;
                            };

                            if (self.dataset.motivo.toString().toLowerCase() == "otro") {
                                options.title = "Paciente no efectivo Otro";
                                options.html = nata.ui.template.get("templatePacienteNoEfectivoOtro", {}),
                                oDialog = new nataUIDialog(options);
                                sessionStorage.setItem("dialog-id", session.dialogTimestamp);
                                $(".ui-dialog").remove();

                                $("#buttonContinuarPacienteNoEfectivo")
                                    .off()
                                    .click(function () {
                                        console.log("#buttonContinuarPacienteNoEfectivo.click");
                                        //@audit revisar esta parte y habilitarla
                                        const message = "Opción deshabilitada por el adminsitrador";
                                        swal("Error Dev", message, "error");
                                        return false;
                                        console.error(message);
                                        // rama paciente manual sanitas covid NO EFECTIVO OTRO MOTIVO
                                        dataSession.idNoEfectivo = self.dataset.id;
                                        dataSession.descripcionNoEfectivo = $("#textareaPacienteNoEfectivo").val();
                                        session.dataset.noEfectivo = {
                                            idNoEfectivo: dataSession.idNoEfectivo,
                                            descripcionNoEfectivo: dataSession.descripcionNoEfectivo
                                        };
                                        app.flujo.paciente.noEfectivo.send(callback, callbackError, dataSession);

                                        session.fx = function () {
                                            console.log("session.fx");
                                            session.dataSession = dataSession;
                                            app.flujo.paciente.noEfectivo.send(callback, callbackError, session.dataSession, 0);
                                        };
                                    });
                            }
                            else {

                                //titulo, settings, template, data, blnDialogosRemover
                                //app.core.dialogo.render("Paciente no efectivo", {}, "templatePacienteNoEfectivo", {}, false);
                                swal({
                                    title: "Desea reportar el paciente como no efectivo ?",
                                    text: "Motivo: " + self.dataset.motivo,
                                    icon: "warning",
                                    buttons: ["CANCELAR", "SI, continuar"],
                                    dangerMode: true,
                                }).then((response) => {
                                    if (response) {
                                        console.log("swal.response");
                                        //console.log(session.dialogTimestamp);
                                        $(sessionStorage.getItem("dialog-id")).remove();

                                        // rama paciente manual sanitas covid NO EFECTIVO
                                        /*
                                        dataSession.idNoEfectivo = self.dataset.id;
                                        dataSession.descripcionNoEfectivo = self.dataset.motivo;
                                        */

                                        session.dataset.noEfectivo = {
                                            idNoEfectivo: id,
                                            descripcionNoEfectivo: motivo
                                        };

                                        app.flujo.paciente.noEfectivo.send(callback, callbackError);

                                        session.fx = function (boolForzar) {
                                            console.log("session.fx");
                                            session.dataSession = dataSession;
                                            app.flujo.paciente.noEfectivo.send(callback, callbackError, session.dataSession, 0, boolForzar);
                                        };
                                    }
                                });

                            }
                        });
                //#endregion evento paciente no efectivo click
                }, true);

                //#region eventos

                //#region evento select convenio
                $("#selectConvenio")
                    .off()
                    .change(function () {
                        console.log("%c #selectConvenio.change ", "background:orange;color:white;font-weight:bold;font-size:11px");
                        session.flujo.push("selectConvenio.change");
                        const self = this;

                        const dataStateServicio = oState.get("servicio");
                        dataStateServicio.convenio = this.value;
                        dataStateServicio.aseguradora = self.options[self.selectedIndex].text;
                        oState.setProp( "servicio", dataStateServicio );

                        document.querySelector("#containerConvenioServicio").style.display = "none";
                        app.flujo.paciente.ordenServicio.ui.reset();

                        //console.log(data);
                        //#region evento render servicios
                        $("#buttonServicioSeleccionar")
                            .show()
                            .off()
                            .on("click", function () {
                                console.log("%c #buttonServicioSeleccionar.click ", "background:red;color:white;font-weight:bold;font-size:11px");
                                let dataServicios = nata.localStorage.getItem("convenio-servicios");
                                if (dataServicios.length == 0) {
                                    swal("No se han cargado los tarifarios", "Por favor contacta a Soporte Crescend", "error");
                                    $("#buttonServicioSeleccionar").hide();
                                    document.getElementById("buttonPacienteNoEfectivo").disabled = true;
                                    document.getElementById("buttonPacienteCrear").disabled = true;
                                    //document.getElementById("buttonDropdownAgendaPaciente").disabled = true;
                                    return false;
                                }

                                dataServicios = dataServicios.filter(function (record) {
                                    return (
                                        record.ic == oState.state.servicio.convenio
										&& record.v == 1
                                    );
                                });

                                console.log(dataServicios);

                                //console.log(detail);

                                const html = doT.template(document.querySelector("#templateConvenioServicioSeleccionar").innerHTML)({ detail: dataServicios });
                                oDialog = new nataUIDialog({
                                    html: html,
                                    title: "Seleccionar Servicio",
                                    events: {
                                        render: function () {},
                                        close: function () {}
                                    }
                                });

                                if (typeof session.jets !== "undefined") {
                                    session.jets.destroy();
                                }

                                //console.log($("#txtSearch"));
                                //console.log($("#ulConvenioServicio"));

                                session.jets = new Jets({
                                    searchTag: "#txtSearch",
                                    contentTag: "#ulConvenioServicio"
                                });

                                document.querySelector("#containerConvenioServicio").style.display = "block";

                                //#region evento seleccionar servicio
                                $("#ulConvenioServicio .button-convenio-servicio")
                                    .off()
                                    .click(function () {
                                        //console.error("whatsapp ??");
                                        console.log("%c .button-convenio-servicio.click", "background:red;color:white;font-weight:bold;font-size:12px");
                                        session.flujo.push(".button-convenio-servicio.click");

                                        oDialog.destroy();
                                        const ic = this.dataset.ic;
                                        const icc = this.dataset.icc;
                                        const ts = this.dataset.ts;
                                        const tc = this.dataset.tc;

                                        //console.log( ic, icc, ts, data );
                                        app.flujo.paciente.ordenServicio.servicio.seleccionar(ic, icc, ts, data);

                                        if (tc == "terapia") {
                                            document.querySelector("#containerFields").innerHTML = `
                                                <label for="dataListSesiones" class="form-label">Número Sesiones Terapia</label>
                                                <input id="dataListSesiones" class="form-control" list="datalistOptions" placeholder="Ingresa el número de sesiones de terapia">
                                                <datalist id="datalistOptions" aria-describedby="dataListSesionesHelp">
                                                    <option value="5">
                                                    <option value="12">                                                            
                                                </datalist>
                                                <div id="dataListSesionesHelp" class="form-text color-red bold">
                                                    Asegurate que el número de sesiones corresponda con la solicitud de servicio
                                                </div>
                                            `;

                                            const element = document.querySelector("#dataListSesiones");
                                            element.focus();

                                            element.addEventListener("change", function () {
                                                const self = this;
                                                if (self.value.trim() == "") {
                                                    document.querySelector("#buttonPacienteAgendarManual").disabled = true;
                                                }
                                                else { 
                                                    const sessionServicio = nata.sessionStorage.getItem("servicio");

                                                    if (self.value != sessionServicio.smi) {
                                                        document.querySelector("#buttonPacienteAgendarManual").disabled = true;
                                                        swal("Artemisa 2023", "El número de sesiones de terapia no corresponde con la solicitud de servicio", "error");
                                                        return false;
                                                    }
                                                }
                                            });

                                        }
                                    });
                                    //#endregion evento seleccionar servicio


                                /*
                                app.core.ui.dialogo.render("Seleccionar Servicio", options, "templateConvenioServicioSeleccionar",
                                    { detail: dataServicios }, false, function () {

                                        if (typeof session.jets !== "undefined") {
                                            session.jets.destroy();
                                        }

                                        //console.log($("#txtSearch"));
                                        //console.log($("#ulConvenioServicio"));

                                        session.jets = new Jets({
                                            searchTag: "#txtSearch",
                                            contentTag: "#ulConvenioServicio"
                                        });

                                        document.querySelector("#containerConvenioServicio").style.display = "block";

                                        //#region evento seleccionar servicio
                                        $("#ulConvenioServicio .button-convenio-servicio")
                                            .off()
                                            .click(function () {
                                                //console.error("whatsapp ??");
                                                console.log("%c .button-convenio-servicio.click", "background:red;color:white;font-weight:bold;font-size:12px");
                                                session.flujo.push(".button-convenio-servicio.click");

                                                $("#uiDialog-" + session.dialogTimestamp).remove();
                                                const ic = this.dataset.ic;
                                                const icc = this.dataset.icc;
                                                const ts = this.dataset.ts;
                                                const tc = this.dataset.tc;

                                                //console.log( ic, icc, ts, data );
                                                app.flujo.paciente.ordenServicio.servicio.seleccionar(ic, icc, ts, data);

                                                if (tc == "terapia") {
                                                    document.querySelector("#containerFields").innerHTML = `
                                                        <label for="dataListSesiones" class="form-label">Número Sesiones Terapia</label>
                                                        <input id="dataListSesiones" class="form-control" list="datalistOptions" placeholder="Ingresa el número de sesiones de terapia">
                                                        <datalist id="datalistOptions" aria-describedby="dataListSesionesHelp">
                                                            <option value="5">
                                                            <option value="12">                                                            
                                                        </datalist>
                                                        <div id="dataListSesionesHelp" class="form-text color-red bold">
                                                            Asegurate que el número de sesiones corresponda con la solicitud de servicio
                                                        </div>
                                                    `;

                                                    const element = document.querySelector("#dataListSesiones");
                                                    element.focus();

                                                    element.addEventListener("change", function () {
                                                        const self = this;
                                                        if (self.value.trim() == "") {
                                                            document.querySelector("#buttonPacienteAgendarManual").disabled = true;
                                                        }
                                                        else { 
                                                            const sessionServicio = nata.sessionStorage.getItem("servicio");

                                                            if (self.value != sessionServicio.smi) {
                                                                document.querySelector("#buttonPacienteAgendarManual").disabled = true;
                                                                swal("Artemisa 2023", "El número de sesiones de terapia no corresponde con la solicitud de servicio", "error");
                                                                return false;
                                                            }
                                                        }
                                                    });

                                                }
                                            });
                                        //#endregion evento seleccionar servicio
                                    });
                                */

                            });
                        //#endregion evento render servicios
                    });
                //#endregion evento select convenio

                //#region evento txtAutorizacion
                $("#txtAutorizacion")
                    .off()
                    .change(function () {
                        console.log("#txtAutorizacion.change");
                        const self = this;
                        //#region deprecate
                        const stateServicio = oState.get("servicio");
                        stateServicio.autorizacion = this.value;
                        oState.setProp("servicio", stateServicio);
                        //#endregion deprecate

                        const oSession = nata.sessionStorage.getItem("servicio");
                        oSession.autorizacion = self.value;
                        nata.sessionStorage.setItem("servicio", oSession);

                        app.flujo.paciente.ordenServicio.ui.logica();
                    });
                //#endregion evento txtAutorizacion

                //#region evento txtFechaPacienteSolicitud
                $("#txtFechaPacienteSolicitud")
                    .off()
                    .change(function () {
                        console.log("#txtFechaPacienteSolicitud.change");
                        const self = this;
                        //#region deprecate
                        oState.setProp("servicio", { fechaSolicitud: this.value } );
                        //#endregion deprecate

                        const oSession = nata.sessionStorage.getItem("servicio");
                        oSession.fechaSolicitud = self.value;
                        nata.sessionStorage.setItem("servicio", oSession);

                        app.flujo.paciente.ordenServicio.ui.logica();
                    });
                //#endregion evento txtFechaPacienteSolicitud

                //#region evento txtHoraPacienteSolicitud
                $("#txtHoraPacienteSolicitud")
                    .off()
                    .change(function () {
                        console.log("#txtHoraPacienteSolicitud.change");
                        const self = this;
                        //#region deprecate
                        oState.setProp("servicio", { horaSolicitud: this.value });
                        //#endregion deprecate

                        const oSession = nata.sessionStorage.getItem("servicio");
                        oSession.horaSolicitud = self.value;
                        nata.sessionStorage.setItem("servicio", oSession);
                        console.log(nata.sessionStorage.getItem("servicio"));

                        app.flujo.paciente.ordenServicio.ui.logica();
                    });
                //#endregion evento txtHoraPacienteSolicitud

                //#endregion eventos

                //#region logica negocio frontend
                if (nata.sessionStorage.getItem("session").boolExiste) {
                    document.getElementById("buttonPacienteCrear").style.display = "none";
                    document.getElementById("buttonPacienteAgendarManual").style.display = "block";
                }
                else {
                    document.getElementById("buttonPacienteCrear").style.display = "block";
                    document.getElementById("buttonPacienteAgendarManual").style.display = "none";
                }
                //#endregion logica negocio frontend

            },
            servicio: {
                seleccionar: function (ic, icc, ts, data) {
                    console.log( "app.flujo.paciente.ordenServicio.servicio.seleccionar" );
                    const dataServicio = nata.localStorage.getItem("convenio-servicios").filter(function (record) {
                        return (
                            record.ic == ic &&
                            record.icc == icc &&
                            record.ts == ts
                        );
                    })[0];
                    console.log(dataServicio);

                    //#region set servicio
                    //let dataStateServicio = oState.get("servicio");
                    let prop;
                    const oSession = nata.sessionStorage.getItem("servicio");
                    for (prop in dataServicio) {
                        // eslint-disable-next-line no-prototype-builtins
                        if ( dataServicio.hasOwnProperty(prop) ) {
                            const obj = {};
                            if (prop == "tipoConsulta") {
                                obj[prop] = dataServicio[prop].tc.toString().trim();
                                //dataStateServicio[prop] = dataServicio[prop].tc.toString().trim();
                            }
                            else {
                                obj[prop] = dataServicio[prop];
                                //dataStateServicio[prop] = dataServicio[prop];
                            }
                            //#region deprecate
                            oState.setProp("servicio", obj );
                            //#endregion deprecate

                            oSession[prop] = obj[prop];
                        }
                    }
                    //#region deprecate
                    console.log(oState.state.servicio);
                    //#endregion deprecate

                    nata.sessionStorage.setItem("servicio", oSession);
                    console.log(nata.sessionStorage.getItem("servicio"));

                    if (oState.state.servicio.au == 1) {
                        // activar autorizacion
                        document.getElementById("containerAutorizacion").style.display = "block";
                    }
                    else {
                        document.getElementById("containerAutorizacion").style.display = "none";
                    }

                    //#endregion

                    app.flujo.paciente.ordenServicio.ui.logica();

                    $("#containerConvenioServicio")
                        .show();

                    $("#codigoConvenioServicio")
                        .html(icc);

                    $("#descripcionConvenioServicio")
                        .html(oState.state.servicio.d);

                    $("#buttonPacienteCrear")
                        .off()
                        .click(function () {
                            console.log("#buttonPacienteCrear.click");
                            $(".ui-dialog").remove();

                            if (data.length > 0 ) {
                                app.flujo.paciente.crearEditar.render();
                            }
                            else {
                                app.flujo.paciente.crearEditar.render();
                            }
                        });

                    if (nata.sessionStorage.getItem("session").boolExiste) {
                        $("#buttonPacienteAgendarManual")
                            .off()
                            .click(app.flujo.paciente.ordenServicio.iniciarFlujo);
                    }
                    else {
                        $("#buttonPacienteCrear")
                            .off()
                            .click(function () {
                                const data = nata.localStorage.getItem("form-5-1");
                                app.flujo.paciente.crearEditar.render( data );
                            });
                    }
                }
            }
        }
    }
};
$(document).on("click", ".button-masiva-lote-render", app.flujo.paciente.masiva.listar);
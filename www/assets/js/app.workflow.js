/* globals app, swal, session, $, oState, nata, nataUIDialog, axios, doT, dayjs, AirDatepicker, nataUIDatepickerWrapperAir */

// eslint-disable-next-line no-unused-vars
class workflow {

    constructor() {

        console.trace("workflow.constructor ...");

        const self = this;
        this.clear( true );

        let tarifario = nata.localStorage.getItem("convenio-servicios");

        if (typeof oState.state.servicio == "undefined") {
            this.error = true;
            swal("Error de parametrización", "No se ha definido el servicio", "error");
            return false;
        }

        if (typeof oState.state.servicio.ts == "undefined") {
            this.error = true;
            const message = "No se ha encontrado el código de servicio -> ts en el tarifario";
            swal( "Error de parametrización", message, "error" );
            console.error( message );
            return false;
        }

        if ( typeof oState.state.servicio.pq == "undefined" ) oState.state.servicio.pq = "";
        if ( oState.state.servicio.pq == null ) oState.state.servicio.pq = "";
        if (oState.state.servicio.ts == 2 && oState.state.servicio.pq.indexOf(",") == -1) {
            swal("Error de parametrización", "No se ha configurado el servicio complementario para el servicio: Convenio -> " + oState.state.servicio.aseguradora + ", código: " + oState.state.servicio.icc  + " en el tarifario", "error");
            this.error = true;
            return false;
        }

        console.log( oState.state.servicio.pq );
        oState.state.servicio.pq = oState.state.servicio.pq.trim();
        if ( oState.state.servicio.pq == "" ) {
            self.flow.push(oState.state.servicio);
        }
        else {
            let i, dataPaqueteServicios = oState.state.servicio.pq.split(","), dataServicio;
            for (i = 0; i < dataPaqueteServicios.length; ++i) {
                console.log(dataPaqueteServicios[i]);

                if (i == 0) {
                    dataServicio = tarifario.filter(function (record) {
                        //return ( record.ic == convenio.id && record.icc == dataPaqueteServicios[i].toString().trim() );
                        return (record.icc == dataPaqueteServicios[i].toString().trim() && record.ts == 2);
                    })[0];
                }
                else {
                    dataServicio = tarifario.filter(function (record) {
                        //return ( record.ic == convenio.id && record.icc == dataPaqueteServicios[i].toString().trim() );
                        return (record.icc == dataPaqueteServicios[i].toString().trim() && record.ts == 1);
                    })[0];
                }

                console.log( dataServicio );

                if (typeof dataServicio == "undefined") {
                    swal("Error de parametrización", "No se ha encontrado el servicio habilitado para el convenio. Convenio -> " + oState.state.servicio.aseguradora + ", código: " + oState.state.servicio.icc, "error");
                    return false;
                }

                if (dataServicio.length == 0) {
                    swal("Error de parametrización", "No se ha encontrado el servicio habilitado para el convenio. Convenio -> " + oState.state.servicio.aseguradora + ", código: " + oState.state.servicio.icc, "error");
                    return false;
                }

                if (dataServicio.length > 1) {
                    swal("Error de parametrización", "Hay un error en la parametrización de los tarifarios. Convenio -> " + oState.state.servicio.aseguradora + ", código: " + oState.state.servicio.icc, "error");
                    return false;
                }

                self.flow.push(dataServicio);
            }
        }
    }

    // 2022-04-14

    get step() {
        return this._step;
    }

    set step(value) {
        this._step = value;
    }

    clear( boolStart = true ) {
        this._step = 0;
        if (boolStart) this.idPaquete = new Date().getTime();
        else this.idPaquete = "";
        this.flow = [];
    }

    end( response ) {
        console.trace("workflow.end");
        console.log ( "**********************************" );
        console.log ( response );

        if (typeof response == "undefined") return false;

        if ( typeof response == "undefined") {
            const message = "No se han recibido datos";
            swal("Error", message, "error");
            console.eror( message );
            return false;
        }

        /*
        let fechaAgenda = response[0].agenda[0].fa;
        let oDate = dayjs( fechaAgenda ).add(45, "minutes");
        let strDate = oDate.format("YYYY-MM-DD HH:mm:ss");
        console.log( strDate );
        strDate = oDate.add(app.config.agendamiento.tiempoEstimadoConsulta, "minutes");
        console.log( strDate );
        */

        // adicionar la fecha estimada de consulta
        /*
        const agenda = response[0].agenda;
        let i;
        for (i=0; i<agenda.length; i++) {
            agenda[i].fe = dayjs(  agenda[i].fa ).add( app.config.agendamiento.tiempoEstimadoConsulta, "minutes" ).format("YYYY-MM-DD HH:mm:ss");
        }
        console.log( agenda );
        */

        $(".ui-dialog").remove();
        new nataUIDialog({
            height: "auto",
            html: nata.ui.template.get("templateAgendaInfo", response),
            left: (session.width - 400) / 2,
            title: "Confirmación Agenda",
            top: 20,
            width: 600
        });
        document.querySelector( ".ui-dialog" ).style.height = (session.height - 40) + "px";
        document.getElementById("container").innerHTML = "";
        const elContainerHeader = document.getElementById("container-header");
        if (elContainerHeader !== null) elContainerHeader.style.display = "none";
        this.clear();
    }

    render () {
        console.log( "workflow.render" );
        const self = this;

        if (typeof self.dialog != "undefined") {
            self.dialog.destroy();
        }

        console.log( oState.state.paciente.td );
        if ( typeof oState.state.paciente.td == "undefined" ) {
            const message = "No ha llegado el tipo de identificación";
            swal("Error DEV", message, "error");
            console.error(message);
            return false;
        }

        $(".ui-dialog").remove(); // ojo no quitar, cierra el dialog de la orden de servicio
        self.dialog = new nataUIDialog({
            height: "auto",
            html: nata.ui.template.get("templateWorkflow", { step: self.step }),
            left: (session.width - 450) / 2,
            title: "Agendamiento Prestación Servicios",
            top: 98,
            width: 450,
        });
    }

    runStep() {
        const self = this;

        // ejecutar primer siguiente paso
        $(".ui-dialog").remove();

        if (self.flow[self.step].tc == "visita domiciliaria") {
            let geo;
            if (typeof oState.state.servicio.latitud == "string") {
                geo = {
                    latitud: oState.state.servicio.latitud,
                    longitud: oState.state.servicio.longitud
                };
            }
            console.log(oState);
            app.flujo.paciente.direccion.georeferenciar(oState.state.servicio.fecha, geo);
        }
        else if (self.flow[self.step].tc == "teleconsulta") {
            app.agenda.teleconsulta.render(undefined, true, true, true, true);
        }
        else if (self.flow[self.step].tc == "terapia") {
            console.log("%c terapia", "background: red; color: #fff; font-weight: bold; font-size: 12px");
            const data = {
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                ia: nata.sessionStorage.getItem("servicio").ia
            };
            axios.post(app.config.server.php + "agenda/terapiaDisponibilidadGet", data)
                .then(function (response) {
                    console.log(response.data);
                    const template = `
                        <style>
                            #tableTerapiaDisponibilidad { 
                                table-layout: fixed;
                                width: 850px;
                            }
                        </style>
                        <table id="tableTerapiaDisponibilidad" class="table table-striped">
                            <colgroup>
                                <col width="200"></col>
                                <col width="200"></col>
                                <col width="100" class="text-end"></col>
                                <col width="100" class="text-end"></col>
                                <col width="100" class="text-end"></col>
                                <col width="150" class="text-center"></col>
                            </colgroup>
                            <tr>
                                <th class="text-center">
                                    Profesional
                                </th>
                                <th class="text-center">
                                    Especialidad
                                </th>
                                <th class="text-center">
                                    Horas Disponibles
                                </th>
                                <th class="text-center">
                                    Horas Asignadas
                                </th>
                                <th class="text-center">
                                    Porcentaje Asignación
                                </th>
                                <th></th>
                            </tr>
                            {{~it.detail :d:di}}
                            <tr>
                                <td>{{=d.n}}</td>
                                <td>{{=d.c}}</td>
                                <td>{{=d.d}}</td>
                                <td>{{=d.a}}</td>
                                <td>{{=d.p}}</td>
                                <td>
                                    <button type="button" class="btn btn-primary button-asignar-terapia"
                                        data-id="{{=d.id}}"
                                        data-n="{{=d.n}}"
                                        data-c="{{=d.c}}"
                                        >Seleccionar</button>
                                </td>
                            </tr>
                            {{~}}
                        </table>
                    `;

                    const html = doT.template(template)({detail: response.data});
                    console.log(html);
                    session.dialog = new nataUIDialog({
                        html: html,
                        title: "Selecciona el profesional",
                        events: {
                            render: function () {
                            },
                            close: function () {}
                        }
                    });

                    $("#tableTerapiaDisponibilidad .button-asignar-terapia").on("click", function () {
                        const identificacion = this.dataset.id;
                        const nombre = this.dataset.n;
                        const cargo = this.dataset.c;

                        nata.sessionStorage.setItem("agenda-terapia", {identificacion: identificacion, nombre: nombre, cargo: cargo});

                        const data = {
                            identificacion: identificacion
                        };
                        axios.post(app.config.server.php + "agenda/terapiaDisponibilidadDetalleGet", data)
                            .then(function (response) {
                                console.log(response.data);
                                session.dialog.destroy();

                                let template = `
                                    <div class="w-100 header text-end">
                                        <div class="dropdown">
                                            <a class="btn btn-secondary dropdown-toggle button-circle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>                                          
                                            </a>
                                            <ul class="dropdown-menu">
                                                <li><a class="dropdown-item" href="#">Action</a></li>
                                                <li><a class="dropdown-item" href="#">Another action</a></li>
                                                <li><a class="dropdown-item" href="#">Something else here</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col">
                                            <table class="table table-bordered table-sm table-striped">
                                                <tr>
                                                    <td colspan="2" class="text-start">
                                                        <small>Terapeuta</small><br>
                                                        <span class="bold">${nombre}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="text-start">
                                                        Especialidad
                                                    </td>
                                                    <td>
                                                        <span class="bold">${cargo}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="text-start">
                                                        Número Sesiones
                                                    </td>
                                                    <td>
                                                        <span class="badge rounded-pill text-bg-primary text-end">
                                                            {{=nata.sessionStorage.getItem("servicio").smi}}
                                                        </span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                        <div class="col">
                                            {{#templates_.templateHeaderTablePaciente}}
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-4">
                                            <div class="w-100 group-fields">
                                                <div class="row">
                                                    <div class="col">
                                                        <div class="form-check">
                                                            <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="1" checked>
                                                            <label class="form-check-label" for="inlineCheckbox1">Lunes</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input class="form-check-input" type="checkbox" id="inlineCheckbox2" value="2" checked>
                                                            <label class="form-check-label" for="inlineCheckbox2">Martes</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input class="form-check-input" type="checkbox" id="inlineCheckbox3" value="3" checked>
                                                            <label class="form-check-label" for="inlineCheckbox3">Miercoles</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input class="form-check-input" type="checkbox" id="inlineCheckbox4" value="4" checked>
                                                            <label class="form-check-label" for="inlineCheckbox4">Jueves</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input class="form-check-input" type="checkbox" id="inlineCheckbox5" value="5" checked>
                                                            <label class="form-check-label" for="inlineCheckbox5">Viernes</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input class="form-check-input" type="checkbox" id="inlineCheckbox6" value="6" checked>
                                                            <label class="form-check-label" for="inlineCheckbox6">Sabado</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input class="form-check-input" type="checkbox" id="inlineCheckbox0" value="0" disabled>
                                                            <label class="form-check-label" for="inlineCheckbox0">Domingo</label>
                                                        </div>
                                                    </div>
                                                    <div class="col font-small">
                                                        <select id="selectHora" class="form-select" aria-label="Selecciona la hora">
                                                            <option selected>Selecciona la hora</option>
                                                            <option value="08:00">08:00</option>
                                                            <option value="09:00">09:00</option>
                                                            <option value="10:00">10:00</option>
                                                            <option value="11:00">11:00</option>
                                                            <option value="12:00">12:00</option>
                                                            <option value="13:00">13:00</option>
                                                            <option value="14:00">14:00</option>
                                                            <option value="15:00">15:00</option>
                                                            <option value="16:00">16:00</option>
                                                        </select>
                                                        <button id="buttonAgendar" type="button" class="btn btn-primary w-100 mt-2" disabled>Agendar</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-8">
                                            <div id="containerCalendar"></div>
                                        </div>
                                    </div>
                                `;

                                let html = doT.template(template)(nata.sessionStorage.getItem("session"));
                                session.dialog = new nataUIDialog({
                                    html: html,
                                    title: "Agendamiento de Terapias",
                                    events: {
                                        render: function () {
                                        },
                                        close: function () {}
                                    }
                                });
                                //#region calendar

                                // template default calendar 
                                template = `
                                    {{
                                        let horaInicial = it.hi.toString();
                                        if (horaInicial.length == 1) {
                                            horaInicial = "0" + horaInicial + ":00";
                                        }
                                        else {
                                            horaInicial = horaInicial + ":00";
                                        }

                                        let horaFinal = it.hf.toString();
                                        if (horaFinal.length == 1) {
                                            horaFinal = "0" + horaFinal + ":00";
                                        }
                                        else {
                                            horaFinal = horaFinal + ":00";
                                        }
                                    }}
                                    <div class="font-size-11px line-height-16px">
                                        <span class="me-1 min-width-60px">Sesiones</span>
                                        <span class="bold">{{=it.sd}}</span>
                                        <br>
                                        <span class="me-1 min-width-60px">Hora Inicial</span>
                                        <span class="bold">{{=horaInicial}}</span>
                                        <br>
                                        <span class="me-1 min-width-60px">Hora Final</span>
                                        <span class="bold">{{=horaFinal}}</span>
                                    </div>
                                `;
                                html = doT.template(template)(response.data[0]);
                                console.log(html);

                                const optionsCalendar = {
                                    blockSundays: true,
                                    showFromToday: true,
                                    controls: {
                                        month: {
                                            previous: false,
                                            next: false
                                        }
                                    }
                                };
                                app.calendar.render(document.querySelector("#containerCalendar"), optionsCalendar, undefined, html);
                                //#endregion calendar

                                const button = document.querySelector("#buttonAgendar");

                                document.querySelector("#selectHora").addEventListener("change", function () {
                                    console.log("#selectHora.change");
                                    if (this.value !== "") {
                                        button.disabled = false;
                                    }
                                    else {
                                        button.disabled = true;
                                    }
                                });

                                button.addEventListener("click", function () {

                                    const boolActivarDomingos = false;
                                    const boolActivarSabados = true;

                                    //const numeroSesiones = parseInt(nata.sessionStorage.getItem("servicio").smi);
                                    const numeroSesiones = 6;

                                    const year =  new Date().getFullYear();
                                    const month =  new Date().getMonth();
                                    const day =  new Date().getDate();
                                    const hour = new Date().getHours();
                                    const hourSelected = parseInt(document.querySelector("#selectHora").value.toString().replace(":00", ""));
                                    session.dataAgenda = [];

                                    const fxGetDate = function (year, month, day) {
                                        console.log("fxGetDate");
                                        console.log(year, month, day);
                                        let oDate = new Date(year, month, day);
                                        if (oDate.getDay() == 0 && !boolActivarDomingos) {
                                            oDate = fxGetDate(year, month, ++day);
                                        }
                                        return oDate;
                                    };

                                    let i, oDate;
                                    let diaAgenda = day; 
                                    console.log(hourSelected, hour, hourSelected - hour);
                                    for (i=1; i<=numeroSesiones; i++) {
                                        /*
                                        ++numeroDiaSemana;
                                        if (numeroDiaSemana == 7 && !boolActivarDomingos) {
                                            numeroDiaSemana = 1;
                                            ++diaAgenda;
                                        }
                                        */

                                        if (i==1) {
                                            console.log(hourSelected - hour);
                                            console.log((hourSelected - hour) < -4);
                                            if ((hourSelected - hour) < -4) {
                                                //oDate = new Date(year, month, ++diaAgenda);
                                                oDate = fxGetDate(year, month, ++diaAgenda);
                                                console.log(year, month, diaAgenda);
                                            }
                                            else {
                                                //oDate = new Date(year, month, diaAgenda);
                                                oDate = fxGetDate(year, month, diaAgenda);
                                            }
                                        }
                                        else {
                                            //oDate = new Date(year, month, ++diaAgenda);
                                            oDate = fxGetDate(year, month, ++diaAgenda);
                                        }

                                        console.log(oDate);
                                        session.dataAgenda.push({
                                            d: dayjs(oDate).format("YYYY-MM-DD"),
                                            h: document.querySelector("#selectHora").value,
                                            dw: oDate.getDay()
                                        });
                                    }
                                    console.log(session.dataAgenda);
                                    const template = `
                                        <div class="w-100 scroll">
                                            <ul id="listaAgendaCerrar" class="list-group">
                                                {{~it.detail :d:di}}
                                                <li class="list-group-item">
                                                    <span id="badgeNameDay-{{=di}}" class="badge text-bg-primary w-80px">
                                                        {{=nata.fx.date.getNameDayByWeekNumber(d.dw)}}
                                                    </span>
                                                    <span id="badgeDate-{{=di}}" class="badge text-bg-primary w-130px cursor-pointer badge-datepicker me-2"
                                                        data-index="{{=di}}"
                                                        >
                                                        {{=d.d}}
                                                    </span>
                                                    <div id="buttonDatepicker-{{=di}}"></div>

                                                    <select id="selectHora" class="form-select d-inline-block mt-1 w-180px" aria-label="Selecciona la hora"
                                                        data-index="{{=di}}"
                                                        >
                                                        <option selected>Selecciona la hora</option>
                                                        <option value="08:00" {{? d.h == '08:00'}}selected{{?}}>08:00</option>
                                                        <option value="09:00" {{? d.h == '09:00'}}selected{{?}}>09:00</option>
                                                        <option value="10:00" {{? d.h == '10:00'}}selected{{?}}>10:00</option>
                                                        <option value="11:00" {{? d.h == '11:00'}}selected{{?}}>11:00</option>
                                                        <option value="12:00" {{? d.h == '12:00'}}selected{{?}}>12:00</option>
                                                        <option value="13:00" {{? d.h == '13:00'}}selected{{?}}>13:00</option>
                                                        <option value="14:00" {{? d.h == '14:00'}}selected{{?}}>14:00</option>
                                                        <option value="15:00" {{? d.h == '15:00'}}selected{{?}}>15:00</option>
                                                        <option value="16:00" {{? d.h == '16:00'}}selected{{?}}>16:00</option>
                                                    </select>

                                                    <!--
                                                    <div class="d-inline-block">
                                                        <div class="input-group w-180px">
                                                            <input type="text" class="form-control" placeholder="Año (YYYY)" aria-label="Año" 
                                                                value="{{=d.d.substr(0,4)}}"
                                                                data-index="{{=di}}"
                                                                >
                                                            <input type="text" class="form-control" placeholder="Mes (MM)" aria-label="Mes" 
                                                                value="{{=d.d.substr(5,2)}}"
                                                                data-index="{{=di}}"
                                                                >
                                                            <input type="text" class="form-control" placeholder="Año (DD)" aria-label="Día" 
                                                                value="{{=d.d.substr(8,2)}}"
                                                                data-index="{{=di}}"
                                                                >
                                                        </div>
                                                    </div>
                                                    <select id="selectHora" class="form-select d-inline-block ms-2 w-180px" aria-label="Selecciona la hora"
                                                        data-index="{{=di}}"
                                                        >
                                                        <option selected>Selecciona la hora</option>
                                                        <option value="08:00" {{? d.h == '08:00'}}selected{{?}}>08:00</option>
                                                        <option value="09:00" {{? d.h == '09:00'}}selected{{?}}>09:00</option>
                                                        <option value="10:00" {{? d.h == '10:00'}}selected{{?}}>10:00</option>
                                                        <option value="11:00" {{? d.h == '11:00'}}selected{{?}}>11:00</option>
                                                        <option value="12:00" {{? d.h == '12:00'}}selected{{?}}>12:00</option>
                                                        <option value="13:00" {{? d.h == '13:00'}}selected{{?}}>13:00</option>
                                                        <option value="14:00" {{? d.h == '14:00'}}selected{{?}}>14:00</option>
                                                        <option value="15:00" {{? d.h == '15:00'}}selected{{?}}>15:00</option>
                                                        <option value="16:00" {{? d.h == '16:00'}}selected{{?}}>16:00</option>
                                                    </select>
                                                    !-->
                                                </li>
                                                {{~}}
                                            </ul>
                                            <div class="w-100 text-center mt-2">
                                                <button id="buttonAgendaCerrar" type="button" class="btn btn-primary min-width-250px mt-2 d-inline-block">Cerrar Agenda</button>
                                            </div>
                                        </div>
                                    `;

                                    const html = doT.template(template)({detail: session.dataAgenda});

                                    new nataUIDialog({
                                        height: 650,
                                        width: 550,
                                        html: html,
                                        title: "Agenda de Citas",
                                    });

                                    document.querySelector("#buttonAgendaCerrar").addEventListener("click", function () {
                                        console.log("buttonAgendaCerrar.click");
                                        const data = nata.sessionStorage.getItem("agenda-terapia");
                                        const dataSession = nata.sessionStorage.getItem("session");
                                        data.agenda = session.dataAgenda;
                                        data.pacienteIdentificacion = dataSession.identificacion;

                                        axios.post(app.config.server.php + "agenda/terapiaSet", data)
                                            .then(function (response) {
                                                console.log(response.data);
                                                
                                            })
                                            .catch(function (error) {
                                                console.log(error);
                                            });
                                    });

                                    session.datepicker = [];

                                    let oDatepikcerWrapperAir;

                                    const options = {
                                        timepicker: false,
                                        visible: false,
                                        autoClose: true,
                                        minDate: new Date(),
                                        onSelect(oData) {
                                            console.log(oData);
                                            document.querySelector("#badgeDate-" + session.index).innerText = oData.formattedDate;
                                            document.querySelector("#badgeNameDay-" + session.index).innerText = nata.fx.date.getNameDayByWeekNumber(oData.date.getDay());
                                            // guardar los nuevos datos de la fecha
                                            session.dataAgenda[session.index].d = oData.formattedDate;
                                            session.dataAgenda[session.index].dw = oData.date.getDay();

                                            oDatepikcerWrapperAir = new nataUIDatepickerWrapperAir(session.datepicker[session.index].datepicker);
                                            oDatepikcerWrapperAir.hide();
                                        }
                                    };
                                    let oDatepicker;
                                    for (i=0; i<session.dataAgenda.length; i++) {
                                        oDatepicker = new AirDatepicker("#buttonDatepicker-" + i, options);
                                        session.datepicker.push({
                                            datepicker: oDatepicker
                                        });
                                        //oDatepicker.hide();
                                        session.datepicker[i].datepicker.$el.style.display = "none";
                                    }

                                    $("#listaAgendaCerrar .badge-datepicker").click(function () {
                                        console.log("#listaAgendaCerrar .badge-datepicker.click");
                                        const self = this;
                                        oDatepikcerWrapperAir = new nataUIDatepickerWrapperAir(session.datepicker[self.dataset.index].datepicker);
                                        if (session.datepicker[self.dataset.index].datepicker.$el.style.display == "block") {
                                            oDatepikcerWrapperAir.hide();
                                            //session.datepicker[self.dataset.index].datepicker.$el.style.display = "none";
                                        }
                                        else {
                                            session.index = self.dataset.index;
                                            //session.datepicker[self.dataset.index].datepicker.$el.style.display = "block";
                                            oDatepikcerWrapperAir.show();
                                        }
                                    });
                                });
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        else {
            const message = "El tipo de consulta para el servicio: " + self.flow[self.step].id + ": " + self.flow[self.step].tipo + " no es válido";
            swal("Error parametrización", message, "error");
            console.error(message);
            this.error = true;
        }
    }

    // fin - 2022-04-14

    // Getter
    get idAgenda () {
        return oState.state.servicio.idAgenda;
    }

    set idProfesional(value) {
        oState.state.servicio.idProfesional = value;
    }

    set profesional(value) {
        oState.state.servicio.profesional = value;
    }

    set horaInicial(value) {
        oState.state.servicio.horaInicial = value;
    }

    set horaFinal(value) {
        oState.state.servicio.horaFinal = value;
    }

    /* fecha de servicio */
    set fecha(value) {
        oState.state.servicio.fecha = value;
    }
}
/* globals app, doT, html2pdf, oDialog */
// eslint-disable-next-line no-unused-vars
let oDialogConsulta;
app.consultas = {

    afiliacion: {
        index: function () {
            console.log("app.consultas.afiliacion.index");
            app.core.dialog.close();
            app.core.busqueda.identificacionNombre(
                "Afiliaciones", 
                app.config.server.php + "afiliacion/consultar", 
                app.consultas.afiliacion.render
            );
        },

        render: function (data) {
            console.log("app.consultas.afiliacion.render");
            console.log(data);

            const template = `
                <style>
                    #tableAfiliacion {
                        table-layout: fixed;
                        width: 1070px;
                    }
                </style>
                <div class="w-100 scroll">
                    <h5>Afiliación, Grupo Familiar</h5>
                    <table id="tableAfiliacion" class="table table-sm">
                        <colgroup>
                            <col width="100"></col>
                            <col width="100"></col>
                            <col width="120"></col>
                            <col width="120"></col>
                            <col width="120"></col>
                            <col width="120"></col>
                            <col width="120"></col>
                            <col width="120"></col>
                            <col width="150"></col>
                        </colgroup>
                        <thead>
                            <tr class="text-center">
                                <th>Tipo Identificación</th>
                                <th>Número Identificación</th>
                                <th>Primer Apellido</th>
                                <th>Segundo Apellido</th>
                                <th>Primer Nombre</th>
                                <th>Segundo Nombre</th>
                                <th>Fecha Nacimiento</th>
                                <th>Tipo Afiliado</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {{~ it.detail: d:id}}
                            <tr class="{{?id % 2 == 0}}zebra{{?}}">
                                <td class="">{{=d.pti}}</td>
                                <td class="text-end">{{=d.pni}}</td>
                                <td class="">{{=d.ppa}}</td>
                                <td class="">{{=d.psa}}</td>
                                <td class="">{{=d.ppn}}</td>
                                <td class="">{{=d.psn}}</td>
                                <td class="text-end">{{?d.pfn !== null}}{{=d.pfn}}{{?}}</td>
                                <td class="">{{=d.pta}}</td>
                                <td class="text-center">
                                    <button type="button" class="btn btn-primary min-width-140px button-afiliado-ficha-ver"
                                        data-ti="{{=d.pti}}" data-ni="{{=d.pni}}">
                                        Ver
                                    </button>
                                </td>
                            </tr>
                            {{~}}
                        </tbody>
                    </table>
                </div>
            `;

            document.querySelector("#container").innerHTML = doT.template(template)({detail: data}),
            document.querySelector("#loader").style.display = "none";

            document.querySelector("#tableAfiliacion").addEventListener("click", function(event) {
                const element = event.target;
                if (element.classList.contains("button-afiliado-ficha-ver")) {
                    console.log(".button-afiliado-ficha-ver.click");

                    const tipoIdentificacion = element.dataset.ti;
                    const numeroIdentificacion = element.dataset.ni;

                    const template = `
                        <style>
                            #tableFichaAfiliado {
                                table-layout: fixed;
                                width: 1050px;
                            }
                            #tableHistorialEmpresas {
                                table-layout: fixed;
                                max-width: 1350px;
                                overflow-x: auto;
                            }
                            #tableRelacionLaboral {
                                table-layout: fixed;
                                max-width: 1350px;
                                overflow-x: auto;
                            }
                        </style>
                        <div class="w-1340px scroll-y">
                            <div class="w-100">
                                <table id="tableFichaAfiliado" class="table table-sm">
                                    <colgroup>
                                        <col width="150"></col>
                                        <col width="150"></col>
                                        <col width="150"></col>
                                        <col width="150"></col>
                                        <col width="150"></col>
                                        <col width="150"></col>
                                        <col width="150"></col>
                                    </colgroup>
                                    <tr>
                                        <th>Fecha Radicado</th>
                                        <th># Radicado</th>
                                        <th>Formulario</th>
                                        <th>Tipo Afiliado</th>
                                        <th>Fecha Afiliación</th>
                                        <th>Fecha Afilicación SGSSS</th>
                                        <th>Discapacidad</th>
                                    </tr>
                                    <tr>
                                        <td class="text-end">{{=it.afr}}</td>
                                        <td class="text-end">{{=it.anr}}</td>
                                        <td class="text-end">{{=it.anf}}</td>
                                        <td class="text-end">{{=it.ata}}</td>
                                        <td class="text-end">{{=it.afa}}</td>
                                        <td class="text-end">{{=it.afs}}</td>
                                        <td>{{=it.ad}}</td>
                                    </tr>

                                    <tr>
                                        <th>Grado</th>
                                        <th>Tipo Identificación</th>
                                        <th># Documento</th>
                                        <th>Primer Apellido</th>
                                        <th>Segundo Apellido</th>
                                        <th>Primer Nombre</th>
                                        <th>Segundo Nombre</th>
                                    </tr>
                                    <tr>
                                        <td class="text-end">{{=it.ag}}</td>
                                        <td class="text-end">{{=it.pti}}</td>
                                        <td class="text-end">{{=it.pni}}</td>
                                        <td class="text-end">{{=it.ppa}}</td>
                                        <td class="text-end">{{=it.psa}}</td>
                                        <td class="text-end">{{=it.ppn}}</td>
                                        <td class="text-end">{{=it.psn}}</td>
                                    </tr>

                                    <tr>
                                        <th>Fecha Nacimiento</th>
                                        <th>Edad</th>
                                        <th>Sexo</th>
                                        <th>Estado Civil</th>
                                        <th>Tipo Identifiación Conyuge</th>
                                        <th colspan="2">Número Identificación Cónyuge</th>
                                    </tr>
                                    <tr>
                                        <td class="text-end">
                                            {{? it.pfn !== null}}
                                                {{=it.pfn}}
                                            {{?}}
                                        </td>
                                        <td class="text-end">
                                            {{? it.pfn !== null}}
                                                {{=nata.fx.date.getEdad(it.pfn)}}
                                            {{?}}
                                        </td>
                                        <td>{{=it.ps}}</td>
                                        <td>{{=it.pec}}</td>
                                        <td>{{=it.atic}}</td>
                                        <td colspan="2">{{=it.anic}}</td>
                                    </tr>

                                    <tr>
                                        <th colspan="2">Dirección Residencia</th>
                                        <th>Teléfono Residencia</th>
                                        <th>Teléfono Celular</th>
                                        <th>Ubicación Residencia</th>
                                        <th colspan="2">Municipio Residencia</th>
                                    </tr>
                                    <tr>
                                        <td colspan="2">{{=it.adr}}</td>
                                        <td>{{=it.atr}}</td>
                                        <td>{{=it.atc}}</td>
                                        <td>{{=it.aur}}</td>
                                        <td colspan="2">{{=it.amr}}</td>
                                    </tr>

                                    <tr>
                                        <th colspan="2">IPS a la que pertenece</th>
                                        <th>Teléfono IPS</th>
                                        <th colspan="2">Dirección IPS</th>
                                        <th colspan="2">Regional Usuario</th>
                                    </tr>
                                    <tr>
                                        <td colspan="2">{{=it.aip}}</td>
                                        <td>{{=it.ait}}</td>
                                        <td colspan="2">{{=it.adi}}</td>
                                        <td colspan="2">{{=it.aru}}</td>                                    
                                    </tr>

                                    <tr>
                                        <th>Estado Afiliación</th>
                                        <th>Razón Estado</th>
                                        <th>Fecha Fin Urgencia</th>
                                        <th>Fecha Inicio Pleno</th>
                                        <th>Fecha Retiro</th>
                                        <th>Origen Afiliación</th>
                                    </tr>
                                    <tr>
                                        <td>{{=it.ae}}</td>
                                        <td>{{=it.aer}}</td>
                                        <td>
                                            {{? it.affu !== null}}
                                            {{=it.affu}}
                                            {{?}}
                                        </td>
                                        <td>
                                            {{? it.afip !== null}}
                                            {{=it.afip}}
                                            {{?}}
                                        </td>
                                        <td>
                                            {{? it.afre !== null}}
                                            {{=it.afre}}
                                            {{?}}
                                        </td>
                                        <td>{{=it.aoa}}</td>
                                    </tr>
                                </table>
                            </div>

                            <div class="w-100 scroll-x">
                                <h5 class="mt-2">Historial Empresas Cotizantes</h5>
                                <table id="tableHistorialEmpresas" class="table table-sm">
                                    <colgroup>
                                        <col width="90"></col>
                                        <col width="100"></col>
                                        <col width="120"></col>
                                        <col width="250"></col>
                                        <col width="150"></col>
                                        <col width="120"></col>
                                        <col width="120"></col>
                                        <col width="120"></col>
                                        <col width="150"></col>
                                        <col width="200"></col>
                                        <col width="100"></col>
                                    </colgroup>
                                    <tr>
                                        <th>VIP</th>
                                        <th>Tipo Documento</th>
                                        <th>Número Documento</th>
                                        <th>Razón Social</th>
                                        <th>Tipo Cotizante</th>
                                        <th>Fecha Inicio Laboral</th>
                                        <th>Fecha Fin Laboral</th>
                                        <th>Ingreso Mensual</th>
                                        <th>Cargo</th>
                                        <th>Dirección Laboral</th>
                                        <th>Teléfono Laboral</th>
                                    </tr>
                                    {{~ it.hl: d:id}}
                                    <tr>
                                        <td>{{=d.hlv}}</td>
                                        <td>{{=d.hltd}}</td>
                                        <td>{{=d.hlnd}}</td>
                                        <td>{{=d.hlrs}}</td>
                                        <td>{{=d.hltc}}</td>
                                        <td>{{=d.hlfil}}</td>
                                        <td>{{=d.hlffl}}</td>
                                        <td>{{=d.hlim}}</td>
                                        <td>{{=d.hlc}}</td>
                                        <td>{{=d.hldl}} {{=d.hlml}}</td>
                                        <td>{{=d.hltl}}</td>
                                    </tr>
                                    {{~}}
                                </table>
                            </div>

                            <div class="w-100 scroll-x">
                                <h5 class="mt-2">Relación Laboral Cotizante y Beneficiarios</h5>
                                <table id="tableRelacionLaboral" class="table table-sm">
                                    <colgroup>
                                        <col width="90"></col>
                                        <col width="100"></col>
                                        <col width="120"></col>
                                        <col width="250"></col>
                                        <col width="150"></col>
                                        <col width="120"></col>
                                        <col width="120"></col>
                                        <col width="120"></col>
                                        <col width="150"></col>
                                        <col width="200"></col>
                                        <col width="100"></col>
                                    </colgroup>
                                    <tr>
                                        <th>VIP</th>
                                        <th>Tipo Documento</th>
                                        <th>Número Documento</th>
                                        <th>Razón Social</th>
                                        <th>Tipo Cotizante</th>
                                        <th>Fecha Inicio Laboral</th>
                                        <th>Fecha Fin Laboral</th>
                                        <th>Ingreso Mensual</th>
                                        <th>Cargo</th>
                                        <th>Dirección Laboral</th>
                                        <th>Teléfono Laboral</th>
                                    </tr>
                                    {{~ it.rl: d:id}}
                                    <tr>
                                        <td>{{=d.rlv}}</td>
                                        <td>{{=d.rltd}}</td>
                                        <td>{{=d.rlnd}}</td>
                                        <td>{{=d.rlrs}}</td>
                                        <td>{{=d.rltc}}</td>
                                        <td>{{=d.rlfil}}</td>
                                        <td>{{=d.rlffl}}</td>
                                        <td>{{=d.rlim}}</td>
                                        <td>{{=d.rlc}}</td>
                                        <td>{{=d.rldl}} {{=d.rlml}}</td>
                                        <td>{{=d.rltl}}</td>
                                    </tr>
                                    {{~}}
                                </table>
                            </div>
                        </div>
                    `;

                    console.log(data);
                    console.log(tipoIdentificacion, numeroIdentificacion);
                    const dataView = data.filter(function (record) {
                        return (record.pti == tipoIdentificacion && record.pni == numeroIdentificacion);
                    })[0];

                    // historia laboral
                    console.log(dataView);

                    oDialog = new nataUIDialog({
                        html: doT.template(template)(dataView),
                        title: "Ficha Afiliado",
                        events: {
                            render: function () {},
                            close: function () {}
                        }
                    });
                    
                }
            })
            
        }
    },

    autorizacion: {
        altoCosto: {
            index: function () {
                console.log("app.consultas.autorizacion.altoCosto.index");
                
                app.core.dialog.close();
                document.querySelector("#container").innerHTML = "";

                //#region render form index
                const html = `
                    <fieldset>
                        <legend># Autorización</legend>
                        {{? app.config.dev.mode == true}}
                        <div class="float-end mb-1">
                            <span class="badge text-bg-terciary copy-clipboard">10203040</span>
                        </div>
                        {{?}}
                        <div class="mb-2">
                            <label for="txtNumeroAutorizacion" class="form-label"></label>
                            <input id="txtNumeroAutorizacion" class="form-control" type="text" 
                                minlength="5" maxlength="20">
                        </div>
                    </fieldset>
                `;
                const oDialogOptions = {
                    height: 420
                };
                const oElement = {
                    validator: function () {
                        console.log("element.validator");
                        if (document.querySelector("#txtNumeroAutorizacion").value == "") {
                            document.querySelector("#buttonContinuar").disabled = true;
                        }
                        else {
                            document.querySelector("#buttonContinuar").disabled = false;
                        }
                    }
                };
                const oElements = [{
                    el: "txtNumeroAutorizacion",
                    var: "na"
                }];
                const oFormIdentificacion = new form_identificacion(oElements);
                oFormIdentificacion.render(
                    "Autorizaciones Alto Costo",
                    app.config.server.php + "autorizacion_alto_costo/consultar", 
                    app.consultas.autorizacion.altoCosto.render,
                    html, 
                    oDialogOptions
                );

                document.querySelector("#txtNumeroAutorizacion").addEventListener("change", function () {
                    if (this.value == "") {
                        oFormIdentificacion.validator();
                    }
                    else {
                        document.querySelector("#selectTipoIdentificacion").value = "";
                        document.querySelector("#txtNumeroIdentificacion").value = "";
                        document.querySelector("#buttonContinuar").disabled = false;
                    }
                });
                //#endregion render form index
            },

            render: function (data) {
                console.log("app.consultas.autorizacion.altoCosto.render");

                if (data.length == 0) {
                    swal(app.config.title, `
                            No se han encontrado autorizaciones para este 
                            paciente: ${session.data.t} ${session.data.n}
                        `, "error");
                    return false;
                }

                //#region template autorizacion alto costo
                const template = `
                    <style>
                        #tableAutorizacion {
                            table-layout: fixed;
                            width: 940px;
                        }

                        #tableTecnologia {
                            table-layout: fixed;
                            width: 940px;
                        }
                    </style>
                    <h5>Autorizaciones Alto Costo <span class="badge bg-secondary">Identificación</span></h5>
                    <table id="tableAutorizacion" class="table table-sm">
                        <colgroup>
                            <col width="150"></col>
                            <col width="100"></col>
                            <col width="140"></col>
                            <col width="150"></col>
                            <col width="180"></col>
                            <col width="140"></col>
                            <col width="80"></col>
                        </colgroup>
                        <thead>
                            <tr class="text-center">
                                <th>Autorización</th>
                                <th>Solicitud</th>
                                <th>Estado Solicitud</th>
                                <th>Fecha</th>
                                <th>Origen</th>
                                <th>Estado Autorización</th>
                                <th>Seleccionar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {{~ it.detail: d:id}}
                            <tr class="{{?id % 2 == 0}}zebra{{?}}">
                                <td class="text-end">{{=d.an}}</td>
                                <td class="text-end">{{=d.sn}}</td>
                                <td class="text-end">{{=d.aes}}</td>
                                <td class="text-end">{{=d.af}}</td>
                                <td class="text-end">{{=d.ao}}</td>
                                <td class="text-end">{{=d.aea}}</td>
                                <td class="text-center">
                                    <input class="input-checkbox" class="form-check-input" type="checkbox" value=""
                                        data-id-autorizacion="{{=d.an}}">
                                </td>
                            </tr>
                            <tr class="{{?id % 2 == 0}}zebra{{?}}">
                                <td colspan="7">
                                    <div class="w-100 text-center">
                                        <span class="badge rounded-pill text-bg-primary">Tecnología en Salud</span>
                                    </div>
                                    <div class="w-100">
                                        <table id="tableTecnologia" class="table table-sm">
                                            <colgroup>
                                                <col width="140"></col>
                                                <col width="800"></col>                                            
                                            </colgroup>
                                            {{~ d.t: t:it}}
                                            <tr class="{{?id % 2 == 0}}zebra{{?}}">
                                                <td class="text-end">{{=t.tc}}</td>
                                                <td class="text-end">{{=t.tn}}</td>
                                            </tr>
                                            {{~}}
                                        </table>
                                    </div>
                                </td>
                            </tr>
                            {{~}}
                            <tr>
                                <td colspan="7" class="text-center">
                                    <button id="buttonGenerar" type="button" class="btn btn-primary" disabled>
                                        Generar Autorizaciones
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div id="panelDocumentos" class="w-100"></div>
                `;
                //#endregion template autorizacion alto costo
                document.querySelector("#container").innerHTML = doT.template(template)({ detail: data });
    
                // event delegate
                document.querySelector("#tableAutorizacion").addEventListener("click", function (event) {
                    console.log("#tableAutorizacion.click");
                    const element = event.target;
                    console.log(element);
                    if (element.classList.contains("input-checkbox")) {
                        const idAutorizacion = element.dataset.idAutorizacion;
                        if (element.checked) {
                            console.log("checked");
                            session.list = session.list.filter(function (record) {
                                return record.idAutorizacion != idAutorizacion;
                            });
                            session.list.push({
                                ia: idAutorizacion
                            });
                            console.log(session.list);
                        }
                        else {
                            console.log("not checked");
                            session.list = session.list.filter(function (record) {
                                return record.ia != idAutorizacion;
                            });
                            console.log(session.list);
                        }
    
                        const elButton = document.querySelector("#buttonGenerar");
                        if (session.list.length == 0) {
                            elButton.disabled = true;
                        }
                        else {
                            elButton.disabled = false;
                        }
                    }
                });
    
                document.querySelector("#buttonGenerar").addEventListener("click", function (event) {
                    console.log("buttonGenerar.click");
                    const dataSend = {
                        l: session.list
                    };
                    axios.post(app.config.server.php + "autorizacion_alto_costo/generar?ts=" + new Date().getTime(), 
                        dataSend)
                        .then(function (response) {
                            console.log(response.data);
                            app.consultas.autorizacion.documentos.render(response.data);
                        }).catch(function (error) {
                            console.log(error);
                        });
                });
            }
        },

        pos: {
            /*
            index: function () {
                console.log("app.consultas.autorizacion.pos.index");
                app.core.dialog.close();

                oDialog = app.core.consultar.identificacion("Autorizaciones POS");

                document.querySelector("#frmConsultar").addEventListener("submit", function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    document.querySelector("#loader").style.display = "block";

                    setTimeout(() => {
                        //#region validar cliente
                        console.warn("No olvides agregar el condicional para validar el formulario en cliente ...");
                        //console.log("%c app.flujo.paciente.preRegistro.render ", "background: orange; color: #fff;font-size:12px");
                        if (document.querySelector("#selectTipoIdentificacion").value == ""
                            && document.querySelector("#txtNumeroIdentificacion").value == ""
                            ) {
                                const element = document.querySelector("#error");
                                element.innerHTML = "Ingresa los datos de consulta";
                                element.classList.remove("hide");
                                document.querySelector("#loader").style.display = "none";
                                return false;
                            }
                        //#endregion validar cliente

                        const tipoIdentificacion = document.querySelector("#selectTipoIdentificacion").value;
                        const numeroIdentificacion = document.querySelector("#txtNumeroIdentificacion").value;

                        oDialog.destroy();

                        const dataSend = {};
                        if (tipoIdentificacion != "") dataSend.t = tipoIdentificacion;
                        if (numeroIdentificacion != "") dataSend.n = numeroIdentificacion;

                        session.data = dataSend;

                        axios.post(app.config.server.php + "autorizacion_pos/getByIdentificacion", dataSend)
                            .then(function (response) {
                                console.log(response.data);
                                app.consultas.autorizacion.pos.render(response.data);
                                document.querySelector("#loader").style.display = "none";
                            }).catch(function (error) {
                                console.log(error);
                            });

                    }, 1 * 1000);

                }, true);
            },
            */

            index: function () {
                console.log("app.consultas.autorizacion.pos.index");
                app.core.dialog.close();
    
                //#region render form index
                const oDialogOptions = {
                    height: 330
                };
                
                const oFormIdentificacion = new form_identificacion();
                oFormIdentificacion.render(
                    "Autorizaciones POS", 
                    app.config.server.php + "autorizacion_pos/consultar", 
                    app.consultas.autorizacion.pos.render,
                    "",
                    oDialogOptions
                );
                //#endregion render form index
    
                /*
                document.querySelector("#frmIdentificacionConsultar").addEventListener("submit", function (event) {
                    oDialog.destroy();
    
                    event.preventDefault();
                    event.stopPropagation();
    
                    alert("bingo !!");
    
    
                });
                */
            },

            render: function (data) {
                console.log("app.consultas.autorizacion.pos.render");

                const dataMaestro = data.m;
                const dataDetalle = data.d;

                if (dataMaestro.length == 0) {
                    swal(app.config.title, `
                        No se han encontrado autorizaciones para este 
                        paciente: ${session.data.t} ${session.data.n}
                    `, "error");
                    return false;
                }

                const templateMaster = `
                    <style>
                        #tableAutorizacionPos {
                            table-layout: fixed;
                            width: 1075px;
                        }
                    </style>
                    <div class="w-100 scroll">
                        <h5>Autorizaciones POS</h5>
                        <table id="tableAutorizacionPos" class="table table-sm">
                            <colgroup>
                                <col width="150"></col>
                                <col width="250"></col>
                                <col width="100"></col>
                                <col width="125"></col>
                                <col width="300"></col>
                                <col width="150"></col>
                                <col width="100"></col>
                            </colgroup>
                            <thead>
                                <tr class="text-center">
                                    <th># Autorización</th>
                                    <th>Nombre Paciente</th>
                                    <th>Tipo Documento</th>
                                    <th>Número Documento</th>
                                    <th>IPS</th>
                                    <th>Fecha y Hora Solicitud</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {{~ it.detail: d:id}}
                                <tr class="{{?id % 2 == 0}}zebra{{?}}">
                                    <td class="text-end">{{=d.an}}</td>
                                    <td class="text-end">{{=d.pn}}</td>
                                    <td class="text-end">{{=d.pti}}</td>
                                    <td class="text-end">{{=d.pni}}</td>
                                    <td>{{=d.prn}}</td>
                                    <td class="text-end">{{=d.af}}</td>
                                    <td class="text-end">{{=d.aes}}</td>
                                </tr>
                                <tr class="{{?id % 2 == 0}}zebra{{?}}">
                                    <td colspan="7">
                                        <div class="w-100 text-center">
                                            <span class="badge rounded-pill text-bg-primary">Procedimientos solicitados</span>
                                        </div>                                        
                                    </td>
                                </tr>
                                <tr class="{{?id % 2 == 0}}zebra{{?}}">
                                    <td id="containerProcedimientos" colspan="7"></td>
                                </tr>
                                {{~}}
                            </tbody>
                        </table>
                    </div>
                `;
                document.querySelector("#container").innerHTML = doT.template(templateMaster)({ detail: dataMaestro });

                const templateDetail = `
                    <style>
                        #tableAutorizacionProcedimientos {
                            table-layout: fixed;
                            width: 600px;
                        }
                    </style>
                    <div class="w-100 bg-white">
                        <table id="tableAutorizacionProcedimientos" class="table table-sm table-striped">
                            <colgroup>
                                <col width="400px"></col>
                                <col width="200px"></col>
                            </colgroup>
                            <tbody>
                                {{~ it.detail: d:id}}
                                <tr>
                                    <td>{{=d.tn}}</td>
                                    <td class="text-center">
                                        <button type="button" class="btn btn-primary btn-sm min-width-180px 
                                            btn-autorizacion-procedimiento-ver" 
                                            data-id-tecnologia="{{=d.ti}}" data-id-autorizacion="{{=d.an}}">
                                            Ver Autorización POS
                                        </button>
                                    </td>
                                </tr>
                                {{~}}
                            </tbody>
                        </table>
                    </div>
                `;

                document.querySelector("#containerProcedimientos").innerHTML = doT.template(templateDetail)({ detail: dataDetalle });

                // event delegate
                document.querySelector("#tableAutorizacionPos").addEventListener("click", function (event) {
                    const element = event.target;
                    if (element.classList.contains("btn-autorizacion-procedimiento-ver")) {
                        const idAutorizacion = element.dataset.idAutorizacion;
                        const idTecnologia = element.dataset.idTecnologia;

                        document.querySelector("#loader").style.display = "block";
                        setTimeout(() => {

                            const dataSend = {
                                ia: idAutorizacion,
                                it: idTecnologia
                            };

                            axios.post(app.config.server.php + "autorizacion_pos/getProcedimientos", dataSend)
                                .then(function (response) {
                                    console.log(response.data);

                                    const template = `
                                        <div class="w-100 scroll">
                                            <h5>Diagnósticos</h5>
                                            <ul class="list-group">
                                                {{~ it.detail: d:id}}        
                                                <li class="list-group-item">
                                                    {{?id == 0}}
                                                    <span class="badge rounded-pill text-bg-primary">DX Principal</span>
                                                    {{?}}

                                                    {{?id == 1}}
                                                    <span class="badge rounded-pill text-bg-primary">DX Secundario</span>
                                                    {{?}}
                                                    {{=d.co10}} - {{=d.cde}}
                                                </li>
                                                {{~}}
                                            </ul>
                                            <h5>Procedimientos</h5>
                                            <style>
                                                #tableProcedimientos {
                                                    table-layout: fixed;
                                                    width: 1300px;
                                                }
                                            </style>
                                            <table id="tableProcedimientos" class="table table-sm">
                                                <colgroup>
                                                    <col width="100"></col>
                                                    <col width="200"></col>
                                                    <col width="80"></col>
                                                    <col width="200"></col>
                                                    <col width="120"></col>
                                                    <col width="200"></col>
                                                    <col width="200"></col>
                                                    <col width="200"></col>
                                                </colgroup>
                                                <thead>
                                                    <tr class="text-center">
                                                        <th>ID Procedimiento</th>
                                                        <th>Procedimiento</th>
                                                        <th>Cantidad</th>
                                                        <th>IPS</th>
                                                        <th>Alto Costo</th>
                                                        <th>Contingencia</th>
                                                        <th>Finalidad</th>
                                                        <th>Observaciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {{~ it.pr: d:id}}
                                                    <tr class="{{?id % 2 == 0}}zebra{{?}}">
                                                        <td class="text-end">{{=d.pc}}</td>
                                                        <td>{{=d.pn}}</td>
                                                        <td class="text-end">{{=d.pca}}</td>
                                                        <td>{{=d.ppi}} - {{=d.ppn}}</td>
                                                        <td>{{=d.pac}}</td>
                                                        <td>{{=d.pc}}</td>
                                                        <td>{{=d.pf}}</td>
                                                        <td>{{=d.po}}</td>
                                                    </tr>
                                                    <tr class="text-center">
                                                        <th colspan="2">Pago Compartido</th>
                                                        <th colspan="2">Copago</th>
                                                        <th colspan="2">Cuota Moderadora</th>
                                                    </tr>
                                                    <tr class="text-center">
                                                        <th>EPS</th>
                                                        <th>Usuario</th>
                                                        <th>Porcentaje %</th>
                                                        <th>Valor</th>
                                                        <th>Valor</th>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                    </tr>
                                                    <tr class="{{?id % 2 == 0}}zebra{{?}}">
                                                        <td class="text-end">{{=percent.format(d.ppce)}}</td>
                                                        <td class="text-end">{{=percent.format(d.ppcu)}}</td>
                                                        <td class="text-end">{{=percent.format(d.pcp)}}</td>
                                                        <td class="text-end">{{=numberDecimal.format(d.pcv)}}</td>
                                                        <td class="text-end">{{=numberDecimal.format(d.pcm)}}</td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                    </tr>
                                                    <tr class="{{?id % 2 == 0}}zebra{{?}}">
                                                        <td class="text-center py-2" colspan="8">
                                                            <b>
                                                                Luego de ser prestado el servicio, le agradecemos
                                                                enviarnos la respectiva<br>cuenta de cobro adjuntando 
                                                                la presente autorización.
                                                            </b>
                                                        </td>
                                                    </tr>
                                                    <tr class="{{?id % 2 == 0}}zebra{{?}}">
                                                        <td colspan="4">
                                                            <b>Nombre y Firma del Funcionario que Autoriza</b><br><br><br><br><br>
                                                            <div class="d-flex">
                                                                <div class="p-2 text-center strong flex-fill">Firma del Funcionario</div>
                                                                <div class="p-2 text-center strong flex-fill">Número del Registro</div>
                                                            </div>
                                                        </td>
                                                        <td colspan="4">
                                                            <b>Institución a la que se remite</b><br>
                                                            <b>Nombre</b><br>
                                                            {{=d.ppi}} - {{=d.ppn}}
                                                            <br><b>Dirección</b><br>
                                                            {{=d.ppd}} - {{=d.ppc}}
                                                            <br><b>Teléfono</b><br>
                                                            {{=d.ppt}}
                                                        </td>
                                                    </tr>
                                                    <tr class="{{?id % 2 == 0}}zebra{{?}}">
                                                        <td colspan="8" class="text-center py-2">
                                                            <b>
                                                                Importante: Autorización válida solamente en los 90 días siguientes a su expedición
                                                            </b>
                                                        </td>
                                                    </tr>
                                                    {{~}}
                                                </tbody>
                                            </table>
                                        </div>
                                    `;

                                    oDialog = new nataUIDialog({
                                        html: doT.template(template)({detail:response.data.dx, pr:response.data.pr}),
                                        title: "Información Procedimiento Autorizado",
                                        events: {
                                            render: function () {},
                                            close: function () {}
                                        }
                                    });
                        

                                    //app.consultas.autorizacion.altoCosto.render(response.data);
                                    document.querySelector("#loader").style.display = "none";
                                }).catch(function (error) {
                                    console.log(error);
                                });

                        }, 1 * 1000);

                    }
                });
            }
        },

        documentos: {
            render: function(data) {
                console.log("app.consultas.autorizacion.documentos.render");

                const template = `
                    <style>
                        #tableDocumentos {
                            table-layout: fixed;
                            width: 350px;
                        }
                    </style>
                    <h5>Soportes</h5>
                    <table id="tableDocumentos" class="table table-sm">
                        <colgroup>
                            <col width="100"></col>
                            <col width="250"></col>
                        </colgroup>
                        <thead>
                            <tr class="text-center">
                                <th>Autorización</th>
                                <th>Soporte</th>
                            </tr>
                        </thead>
                        <tbody>
                            {{~ it.detail: d:id}}
                            <tr class="{{?id % 2 == 0}}zebra{{?}}">
                                <td class="text-end">{{=d.an}}</td>
                                <td class="text-center">
                                    <a href="${app.config.server.docs}/AAC-{{=d.an}}.docx?ts=${new Date().getTime()}" target="_new_{{=d.an}}">AAC-{{=d.an}}.docx</a>
                                </td>
                            </tr>
                            {{~}}
                        </tbody>
                    </table>
                    <div id="panelDocumentos" class="w-100"></div>
                `;
                document.querySelector("#panelDocumentos").innerHTML = doT.template(template)({ detail: data });
            }
        },

    },

    cartera: {
        index: function () {
            console.log("app.consultas.cartera.index");
            app.core.dialog.close();

            //#region render form index
            const html = `
                <fieldset>
                    <legend>Empresa</legend>
                    <div class="mb-2">
                        <label for="txtIDEmpresa" class="form-label">ID Empresa</label>
                        <input id="txtIDEmpresa" class="form-control" type="text" 
                            minlength="3" maxlength="20" placeholder="Ingresa el ID Empresa">
                    </div>
                </fieldset>
            `;
            const oDialogOptions = {
                height: 420
            };
            const oElement = {
                validator: function () {
                    console.log("element.validator");
                    if (document.querySelector("#txtIDEmpresa").value == "") {
                        document.querySelector("#buttonContinuar").disabled = true;
                    }
                    else {
                        document.querySelector("#buttonContinuar").disabled = false;
                    }
                }
            };
            const oElements = [{
                el: "txtIDEmpresa",
                var: "ie"
            }];
            const oFormIdentificacion = new form_identificacion(oElements);
            oFormIdentificacion.render(
                "Cartera", 
                app.config.server.php + "cartera/consultar", 
                app.consultas.cartera.render,
                html,
                oDialogOptions
            );

            document.querySelector("#txtIDEmpresa").addEventListener("change", function () {
                if (this.value == "") {
                    oFormIdentificacion.validator();
                }
                else {
                    document.querySelector("#buttonContinuar").disabled = false;
                }
            });
            //#endregion render form index

            /*
            document.querySelector("#frmIdentificacionConsultar").addEventListener("submit", function (event) {
                oDialog.destroy();

                event.preventDefault();
                event.stopPropagation();

                alert("bingo !!");


            });
            */
        },

        render: function (data) {
            console.log("app.cartera.render");
            console.log(data);

            const template = `
                <div id="containerCatera" class="w-100">
                    <style>
                        #tableCartera {
                            table-layout: fixed;
                            width: 900px;
                        }
                    </style>
                    <div class="w-100 scroll">
                        <h5>Cartera</h5>
                        <table id="tableCartera" class="table table-sm">
                            <colgroup>
                                <col width="100"></col>
                                <col width="120"></col>
                                <col width="220"></col>
                                <col width="120"></col>
                                <col width="120"></col>
                                <col width="220"></col>
                            </colgroup>
                            <tbody>
                                <tr class="text-center">
                                    <th>Período Vencido</th>
                                    <th>Identificación Empleador</th>
                                    <th>Razón Social</th>
                                    <th>Cotizante Tipo Identificación</th>
                                    <th>Documento Cotizante</th>
                                    <th>Nombre Cotizante</th>
                                </tr>
                                {{~ it.detail: d:id}}
                                <tr class="{{?id % 2 == 0}}zebra{{?}}">
                                    <td>{{=d.cp}}</td>
                                    <td>{{=d.ced}}</td>
                                    <td>{{=d.cerz}}</td>
                                    <td>{{=d.pti}}</td>
                                    <td>{{=d.pni}}</td>
                                    <td>{{=d.pn}}</td>
                                </tr>
                                <tr>
                                    <td colspan="6" class="text-center">
                                        <button id="buttonCarteraGenerar" type="button" class="btn btn-primary min-width-250px">
                                            Generar
                                        </button>
                                    </tr>
                                </tr>
                                {{~}}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

            const html = doT.template(template)({detail: data});
            oDialog = new nataUIDialog({
                html: html,
                title: "Detalle de Cartera",
                events: {
                    render: function () {},
                    close: function () {}
                }
            });
            document.querySelector("#container").innerHTML = "",
            document.querySelector("#loader").style.display = "none";

            document.querySelector("#buttonCarteraGenerar").addEventListener("click", function () {
                console.log("#buttonCarteraGenerar.click");

                this.remove();
                const elements = document.querySelectorAll(".scroll");
                let i;
                for (i = 0; i < elements.length; i++) {
                    elements[i].style.paddingBottom = "0!important";
                    elements[i].style.marginBottom = "0!important";
                }

                const element = document.getElementById("containerCatera");
				// Choose the element and save the PDF for your user.
                const options = {
                    margin: 1,
                    jsPDF: {unit: "in", orientation: "landscape"}
                };
				html2pdf().set(options).from(element).save();
            });
        }
    },
 
    compensacion: {
        index: function () {
            console.log("app.consultas.compensacion.index");
            app.core.dialog.close();
            app.core.busqueda.identificacionNombre("Compensaciones", app.config.server.php + "compensacion/consultar", app.consultas.compensacion.render);
        },

        render: function (data) {
            console.log("app.consultas.compensacion.render");
            console.log(data);

            const template = `
                <style>
                    #tableCompensacion {
                        table-layout: fixed;
                        width: 880px;
                    }
                </style>
                <div class="w-100 scroll">
                    <h5>Afiliación, Grupo Familiar</h5>
                    <table id="tableCompensacion" class="table table-sm">
                        <colgroup>
                            <col width="100"></col>
                            <col width="160"></col>
                            <col width="120"></col>
                            <col width="160"></col>
                            <col width="100"></col>
                            <col width="120"></col>
                            <col width="120"></col>
                        </colgroup>
                        <thead>
                            <tr class="text-center">
                                <th>Período</th>
                                <th>Tipo Documento Empresa</th>
                                <th>Documento Empresa</th>
                                <th>Tipo Documento Cotizante</th>
                                <th>Documento Cotizante</th>
                                <th>Días Compensados</th>
                                <th>Fecha Compensación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {{~ it.detail: d:id}}
                            <tr class="{{?id % 2 == 0}}zebra{{?}}">
                                <td class="text-end">{{=d.cp}}</td>
                                <td class="text-end">{{=d.cetd}}</td>
                                <td class="text-end">{{=d.cend}}</td>

                                <td class="text-end">{{=d.pti}}</td>
                                <td class="">{{=d.pni}}</td>

                                <td class="text-end">{{=d.cdc}}</td>
                                <td class="text-end">{{?d.cfc !== null}}{{=d.cfc}}{{?}}</td>
                            </tr>
                            {{~}}
                        </tbody>
                    </table>
                </div>
            `;

            document.querySelector("#container").innerHTML = doT.template(template)({detail: data}),
            document.querySelector("#loader").style.display = "none";
        }
    },

    cuentasMedicas: {
        index: function () {
            console.log("app.consultas.cuentasMedicas.index");
            app.core.dialog.close();

            let option;

            const template = `
                <h5>Buscar por</h5>
                <ul class="list-group">
                    <li class="list-group-item">
                        <input id="radioNITPRestador" class="form-check-input me-1" type="radio" name="listGroupRadio" 
                            value="">
                        <label class="form-check-label" for="radioPaciente">NIT Prestador</label>
                    </li>
                    <li class="list-group-item">
                        <input id="radioFacturaPrestador" class="form-check-input me-1" type="radio" name="listGroupRadio" 
                            value="">
                        <label class="form-check-label" for="radioTutela">Factura Prestador</label>
                    </li>
                </ul>
                <div class="my-2 text-center">
                    <button id="buttonContinuar" type="button" class="btn btn-primary mb-3" disabled>Continuar</button>
                </div>
            `;
            oDialog = new nataUIDialog({
                height: 270,
                width: 425,
                html: doT.template(template)(),
                title: "Consultar Tutelas",
                events: {
                    render: function () {},
                    close: function () {}
                }
            });

            document.querySelector("#radioNITPRestador").addEventListener("click", function () {
                document.querySelector("#buttonContinuar").disabled = false;
                option = 1;
            });

            document.querySelector("#radioFacturaPrestador").addEventListener("click", function () {
                document.querySelector("#buttonContinuar").disabled = false;
                option = 2;
            });

            document.querySelector("#buttonContinuar").addEventListener("click", function () {
                oDialog.destroy();

                if (option == 1) {
                    const template = `
                        <form id="frmCuentaMedicaConsultar">
                            <fieldset>
                                <legend>Nit Prestador</legend>
                                <div class="mb-2">
                                    <label for="txtFechaInicial" class="form-label">Fecha Inicial</label>
                                    <input id="txtFechaInicial" class="form-control" type="date">
                                </div>
                                <div class="mb-2">
                                    <label for="txtFechaFinal" class="form-label">Fecha Final</label>
                                    <input id="txtFechaFinal" class="form-control" type="date">
                                </div>
                                <div class="mb-2">
                                    <label for="txtNIT" class="form-label">NIT</label>
                                    <input id="txtNIT" class="form-control ui-input-nit" type="text"
                                        minlength="5" maxlength="20">
                                </div>
                            </fieldset>

                            <div class="mb-3 text-center">
                                <button id="buttonContinuar" type="submit" class="btn btn-primary mb-3" disabled>Consultar</button>
                            </div>
                        </form>
                    `;
                    oDialog = new nataUIDialog({
                        height: 400,
                        width: 425,
                        html: doT.template(template)({detail: nata.localStorage.getItem("tipo-identificacion")}),
                        title: "Consultar Cuentas Médicas",
                        events: {
                            render: function () {},
                            close: function () {}
                        }
                    });

                    $("input.ui-input-nit").inputfilter(
                        {
                            allowNumeric: true,
                            allowText: false,
                            actionLog: false,
                            allowCustom: ["-"]
                        }
                    );

                    const fxUIValidate = function () {
                        console.log("fxUIValidate");

                        console.log(
                            document.querySelector("#txtFechaInicial").value.toString().trim().length == 10
                                || document.querySelector("#txtFechaFinal").value.toString().trim().length == 10
                        );

                        console.log(document.querySelector("#txtNIT").value.toString().trim().length >= 5);

                        if (
                                (
                                    document.querySelector("#txtFechaInicial").value.toString().trim().length == 10
                                    || document.querySelector("#txtFechaFinal").value.toString().trim().length == 10
                                ) && document.querySelector("#txtNIT").value.toString().trim().length >= 5
                        )
                        {
                            document.querySelector("#buttonContinuar").disabled = false;
                            console.log(false);
                        }
                        else {
                            document.querySelector("#buttonContinuar").disabled = true;
                            console.log(true);
                        }
                    };

                    //#region events
                    document.querySelector("#txtFechaInicial").addEventListener("change", function () {
                        console.log("#txtFechaInicial.change");
                        fxUIValidate();
                    });

                    document.querySelector("#txtFechaFinal").addEventListener("change", function () {
                        console.log("#txtFechaFinal.change");
                        fxUIValidate();
                    });

                    document.querySelector("#txtNIT").addEventListener("change", function () {
                        console.log("#txtFechaFinal.change");
                        fxUIValidate();
                    });

                    document.querySelector("#frmCuentaMedicaConsultar").addEventListener("submit", function (event) {
                        console.log("frmCuentaMedicaConsultar.submit");
                        event.preventDefault();
                        event.stopPropagation();

                        const txtFechaInicial = document.querySelector("#txtFechaInicial").value;
                        const txtFechaFinal = document.querySelector("#txtFechaFinal").value;
                        const txtNIT = document.querySelector("#txtNIT").value;

                        const dataSend = {};
                        if (txtFechaInicial != "") dataSend.fi = txtFechaInicial;
                        if (txtFechaFinal != "") dataSend.ff = txtFechaFinal;
                        if (txtNIT != "") dataSend.nit = txtNIT;
                        dataSend.opc = 1;
                        alert("paso 01");

                        axios.post(app.config.server.php + "cuenta_medica/consultar", dataSend)
                            .then(function (response) {
                                console.log(response.data);

                                if (response.data.length == 0) {
                                    swal(app.config.title, "No se ha encontrado información de Reembolsos", "success");
                                    document.querySelector("#loader").style.display = "none";
                                    return false;
                                }

                                const template = `
                                    <style>
                                        #tableReembolso {
                                            table-layout: fixed;
                                            width: 1290px;
                                        }
                                    </style>
                                    <div class="w-100 scroll-y">
                                        <table id="tableReembolso" class="table table-sm table-font-12px">
                                            <colgroup>
                                                <col width="150"></col>
                                                <col width="90"></col>
                                                <col width="130"></col>
                                                <col width="180"></col>
                                                <col width="180"></col>
                                                <col width="140"></col>
                                                <col width="80"></col>
                                                <col width="140"></col>
                                                <col width="110"></col>
                                                <col width="100"></col>                            
                                            </colgroup>
                                            <thead>
                                                <tr class="text-center zebra">
                                                    <th>Radicado</th>
                                                    <th>Tipo Documento</th>
                                                    <th># Documento</th>
                                                    <th>Nombre</th>
                                                    <th>Estado Afiliación</th>
                                                    <th>Tipo Afiliado</th>
                                                    <th>Regional</th>
                                                    <th># Factura</th>
                                                    <th>Valor Factura</th>
                                                    <th>Fecha Radicado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {{~ it.detail: d:id}}
                                                <tr class="{{?id % 2 == 0}}zebra{{?}}">
                                                    <td>{{=d.rr}}</td>
                                                    <td>{{=d.rtd}}</td>
                                                    <td class="text-end">{{=d.rnd}}</td>
                                                    <td>{{=d.rppn}} {{=d.rpsn}} {{=d.rppa}}{{=d.rpsa}} </td>
                                                    <td>{{=d.rea}}</td>
                                                    <td>{{=d.rta}}</td>
                                                    <td>{{=d.rre}}</td>
                                                    <td class="text-end">{{=d.rnf}}</td>
                                                    <td class="text-end">{{=dollarUS.format( d.rvf )}}</td>
                                                    <td class="text-end">{{=d.rfr}}</td>
                                                </tr>
                                                <tr class="{{?id % 2 == 0}}zebra{{?}}">
                                                    <th colspan="3">Observacion de Devolucion</th>
                                                    <th colspan="7">Estado de Cuenta</th>
                                                </tr>
                                                <tr class="{{?id % 2 == 0}}zebra{{?}}">
                                                    <td colspan="3">{{=d.rec}}</td>
                                                    <td colspan="7">{{=d.rod}}</td>  
                                                </tr>
                                                <tr class="{{?id % 2 == 0}}zebra{{?}}">
                                                    <td colspan="10" class="text-center">
                                                        <button type="button" 
                                                            class="btn btn-primary button-reembolso-generar min-width-250px"
                                                            data-id="{{=d.rr}}">
                                                            Generar
                                                        </button>
                                                    </td>                                            
                                                </tr>
                                                {{~}}
                                            </tbody>
                                        </table>
                                        <div class="w-100 text-center">
                                            
                                        </div>
                                        <div id="panelDocumentos" class="w-100"></div>
                                    </div>
                                `;
                                oDialog.destroy();

                                const html = doT.template(template)({detail: response.data});
                                oDialog = new nataUIDialog({
                                    html: html,
                                    title: "Reembolsos",
                                    events: {
                                        render: function () {},
                                        close: function () {}
                                    }
                                });

                                document.querySelector("#loader").style.display = "none";

                                // event delegate
                                document.querySelector("#tableReembolso").addEventListener("click", function (event) {
                                    console.log("tableReembolso.click");

                                    const element = event.target;
                                    if (element.classList.contains("button-reembolso-generar")) {
                                        numeroRadicado = element.dataset.id;

                                        const dataSend = {
                                            ir: numeroRadicado
                                        };
                                        axios.post(app.config.server.php + "reembolso/generar?ts=" + new Date().getTime(), dataSend)
                                            .then(function (response) {
                                                console.log("ajax reembolso/generar");
                                                console.log(response.data);
                                                app.consultas.reembolso.documentos.render(numeroRadicado, response.data, "# radicado");
            
                                            }).catch(function (error) {
                                                console.log(error);
                                            });
                                    }
                                });

                            }).catch(function (error) {
                                console.log(error);
                            });
                            });
                    //#endregion events
                }
                else {
                    const template = `
                        <form id="frmIdentificacionConsultar">
                            <fieldset>
                                <legend>Número Factura</legend>
                                <div class="mb-2">
                                    <label for="txtNumeroFactura" class="form-label">Número Factura</label>
                                    <input id="txtNumeroFactura" class="form-control" type="text"
                                        minlength="5" maxlength="20">
                                </div>
                                <div class="mb-2">
                                    <label for="txtNIT" class="form-label">NIT</label>
                                    <input id="txtNIT" class="form-control ui-input-nit" type="text"
                                        minlength="5" maxlength="20">
                                </div>
                            </fieldset>

                            <div class="mb-3 text-center">
                                <button id="buttonContinuar" type="submit" class="btn btn-primary mb-3" disabled>Consultar</button>
                            </div>
                        </form>
                    `;
                    oDialog = new nataUIDialog({
                        height: 400,
                        width: 425,
                        html: doT.template(template)({detail: nata.localStorage.getItem("tipo-identificacion")}),
                        title: "Consultar Cuentas Médicas",
                        events: {
                            render: function () {},
                            close: function () {}
                        }
                    });

                    $("input.ui-input-nit").inputfilter(
                        {
                            allowNumeric: true,
                            allowText: false,
                            actionLog: false,
                            allowCustom: ["-"]
                        }
                    );

                    const fxUIValidate = function () {
                        console.log("fxUIValidate");

                        console.log(document.querySelector("#txtNumeroFactura").value.toString().trim().length >= 5);
                        console.log(document.querySelector("#txtNIT").value.toString().trim().length >= 5);

                        if (
                                document.querySelector("#txtNumeroFactura").value.toString().trim().length >= 5
                                && document.querySelector("#txtNIT").value.toString().trim().length >= 5
                        )
                        {
                            document.querySelector("#buttonContinuar").disabled = false;
                            console.log(false);
                        }
                        else {
                            document.querySelector("#buttonContinuar").disabled = true;
                            console.log(true);
                        }
                    };

                    //#region events
                    document.querySelector("#txtNumeroFactura").addEventListener("change", function () {
                        console.log("#txtNumeroFactura.change");
                        fxUIValidate();
                    });

                    document.querySelector("#txtNIT").addEventListener("change", function () {
                        console.log("#txtFechaFinal.change");
                        fxUIValidate();
                    });
                    //#endregion events
                    
                    
                }
            });

        }
    },

    incapacidad: {
        index: function () {
            console.log("app.consultas.incapacidad.index");
            app.core.dialog.close();

            const html = `
                <fieldset>
                    <legend>Paciente</legend>
                    <form id="frmIncapacidadConsultar">

                            <div class="mb-2">
                                <label for="txtNumeroIncapacidad" class="form-label">Número Incapacidad</label>
                                <input id="txtNumeroIncapacidad" class="form-control" type="text" 
                                    minlength="3" maxlength="20" placeholder="Ingresa el # incapacidad">
                            </div>

                            <div class="mb-2">
                                <label for="txtNumeroAutorizador" class="form-label">Número Autorizador</label>
                                <input id="txtNumeroAutorizador" class="form-control" type="text" 
                                    minlength="3" maxlength="20" placeholder="Ingresa el # autorizador">
                            </div>
                        </form>
                </fieldset>
            `;

            const oDialogOptions = {
                height: 450
            };

            const oElement = {
                validator: function () {
                    console.log("element.validator");
                    if (document.querySelector("#txtIDEmpresa").value == "") {
                        document.querySelector("#buttonContinuar").disabled = true;
                    }
                    else {
                        document.querySelector("#buttonContinuar").disabled = false;
                    }
                }
            };
            /*
            app.core.busqueda.identificacion.index("Cartera", app.config.server.php + "cartera/getByIdentificacion", 
                app.consultas.cartera.render, html, oDialogOptions, oElement);
            */

            const oElements = ["txtNumeroIncapacidad", "txtNumeroAutorizador"];
            const oFormIdentificacion = new form_identificacion(oElements);
            oFormIdentificacion.render(
                "Incapacidad", 
                app.config.server.php + "incapacidad/getByIdentificacion", 
                app.consultas.incapacidad.render,
                html, 
                oDialogOptions
            );

            document.querySelector("#selectTipoIdentificacion").addEventListener("change", function () {
                    if (this.value !== "") {
                        document.querySelector("#txtNumeroIncapacidad").value = "";
                        document.querySelector("#txtNumeroAutorizador").value = "";
                    }
                });

            document.querySelector("#txtNumeroIdentificacion").addEventListener("change", function () {
                if (this.value !== "") {
                    document.querySelector("#txtNumeroIncapacidad").value = "";
                    document.querySelector("#txtNumeroAutorizador").value = "";
                }
            });

            document.querySelector("#txtNumeroIncapacidad").addEventListener("change", function () {
                if (this.value !== "") {
                            document.querySelector("#selectTipoIdentificacion").value = "";
                            document.querySelector("#txtNumeroIdentificacion").value = "";
                            document.querySelector("#txtNumeroAutorizador").value = "";
                            document.querySelector("#buttonContinuar").disabled = false;
                            }
                            fxLogicaUI();
                        });
            document.querySelector("#txtNumeroAutorizador").addEventListener("change", function () {
                if (this.value !== "") {
                            document.querySelector("#selectTipoIdentificacion").value = "";
                            document.querySelector("#txtNumeroIdentificacion").value = "";
                            document.querySelector("#txtNumeroIncapacidad").value = "";
                            document.querySelector("#buttonContinuar").disabled = false;
                     }
                     fxLogicaUI();
            });

            /*
            document.querySelector("#frmIdentificacionConsultar").addEventListener("submit", function (event) {
                oDialog.destroy();

                event.preventDefault();
                event.stopPropagation();

                alert("bingo !!");


            });
            */
        }
    },

    historiaClinicaLaboratorio: {
        index: function () {
            console.log("app.consultas.afiliacion.index");
            app.core.dialog.close();
            app.core.busqueda.identificacionNombre(
                    "Historia Clínica, Laboratorios", 
                    app.config.server.php + "historia_clinica_laboratorio/consultar", 
                    app.consultas.historiaClinicaLaboratorio.render
            );
        },

        render: function (data) {
            console.log("app.historiaClinicaLaboratorio.afiliacion.render");
            console.log(data);

            const template = `
                <style>
                    #tableHistoriaClinica {
                        table-layout: fixed;
                        width: 1040px;
                    }

                    #tablePaciente {
                        table-layout: fixed;
                        width: 600px;
                    }

                </style>
                <div class="w-100 scroll">
                    <h5>Datos del Paciente</h5>
                    <table id="tablePaciente" class="table table-sm">
                        <colgroup>
                            <col width="200"></col>
                            <col width="200"></col>
                            <col width="200"></col>
                        </colgroup>
                        <tr class="text-center">
                            <th colspan="2">Paciente</th>
                            <th colspan="2">Edad</th>
                            <th colspan="2">Genero</th>
                        </tr>
                        {{~ it.paciente: d:id}}
                        <tr class="text-center">
                            <td colspan="2">{{=d.pn}}</td>
                            <td colspan="2">{{=d.pfn}}</td>
                            <td colspan="2">{{=d.pg}}</td>
                        </tr>
                        {{~}}
                    </table>

                    <table id="tableHistoriaClinica" class="table table-sm">
                        <colgroup>
                            <col width="150"></col>
                            <col width="220"></col>
                            <col width="120"></col>
                            <col width="200"></col>
                            <col width="200"></col>
                        </colgroup>
                        <tbody>
                            <tr class="text-center">
                                <th>Ámbito</th>
                                <th>Tipo Historia</th>
                                <th>Fecha Atención</th>
                                <th>Especialidad</th>
                                <th>Profesional</th>
                            </tr>
                            {{~ it.detail: d:id}}
                            <tr class="{{?id % 2 == 0}}zebra{{?}}">
                                <td>{{=d.ha}}</td>
                                <td>{{=d.hth}}</td>
                                <td class="text-end">{{=d.hfa}}</td>
                                <td>{{=d.he}}</td>
                                <td>{{=d.hp}}</td>
                            </tr>
                            <tr>
                                <th colspan="6" class="text-center">Diagnóstico</th>
                            </tr>
                            <tr>
                                <td colspan="6">{{=d.hd}}</tr>
                            </tr>
                            <tr>
                                <td colspan="6" class="text-center">
                                    <button type="button" class="btn btn-primary min-width-250px button-hc-generar"
                                        data-ti="{{=d.pti}}" data-ni="{{=d.pni}}">
                                        Generar
                                    </button>
                                </tr>
                            </tr>
                            {{~}}
                        </tbody>
                    </table>
                </div>
            `;

            document.querySelector("#container").innerHTML = doT.template(template)({paciente: data.p, detail: data.d}),
            document.querySelector("#loader").style.display = "none";

            document.querySelector("#tableHistoriaClinica").addEventListener("click", function(event) {
                const element = event.target;
                if (element.classList.contains("button-hc-generar")) {
                    console.log(".button-hc-generar.click");
                    alert("No es posible generar el documento, pendientes con el cliente");
                    return false;

                    const tipoIdentificacion = element.dataset.ti;
                    const numeroIdentificacion = element.dataset.ni;

                    const template = `
                        <style>
                            #tableFichaAfiliado {
                                table-layout: fixed;
                                width: 1050px;
                            }
                            #tableHistorialEmpresas {
                                table-layout: fixed;
                                max-width: 1350px;
                                overflow-x: auto;
                            }
                            #tableRelacionLaboral {
                                table-layout: fixed;
                                max-width: 1350px;
                                overflow-x: auto;
                            }
                        </style>
                        <div class="w-1340px scroll-y">
                            <div class="w-100">
                                <table id="tableFichaAfiliado" class="table table-sm">
                                    <colgroup>
                                        <col width="150"></col>
                                        <col width="150"></col>
                                        <col width="150"></col>
                                        <col width="150"></col>
                                        <col width="150"></col>
                                        <col width="150"></col>
                                        <col width="150"></col>
                                    </colgroup>
                                    <tr>
                                        <th>Fecha Radicado</th>
                                        <th># Radicado</th>
                                        <th>Formulario</th>
                                        <th>Tipo Afiliado</th>
                                        <th>Fecha Afiliación</th>
                                        <th>Fecha Afilicación SGSSS</th>
                                        <th>Discapacidad</th>
                                    </tr>
                                    <tr>
                                        <td class="text-end">{{=it.afr}}</td>
                                        <td class="text-end">{{=it.anr}}</td>
                                        <td class="text-end">{{=it.anf}}</td>
                                        <td class="text-end">{{=it.ata}}</td>
                                        <td class="text-end">{{=it.afa}}</td>
                                        <td class="text-end">{{=it.afs}}</td>
                                        <td>{{=it.ad}}</td>
                                    </tr>

                                    <tr>
                                        <th>Grado</th>
                                        <th>Tipo Identificación</th>
                                        <th># Documento</th>
                                        <th>Primer Apellido</th>
                                        <th>Segundo Apellido</th>
                                        <th>Primer Nombre</th>
                                        <th>Segundo Nombre</th>
                                    </tr>
                                    <tr>
                                        <td class="text-end">{{=it.ag}}</td>
                                        <td class="text-end">{{=it.pti}}</td>
                                        <td class="text-end">{{=it.pni}}</td>
                                        <td class="text-end">{{=it.ppa}}</td>
                                        <td class="text-end">{{=it.psa}}</td>
                                        <td class="text-end">{{=it.ppn}}</td>
                                        <td class="text-end">{{=it.psn}}</td>
                                    </tr>

                                    <tr>
                                        <th>Fecha Nacimiento</th>
                                        <th>Edad</th>
                                        <th>Sexo</th>
                                        <th>Estado Civil</th>
                                        <th>Tipo Identifiación Conyuge</th>
                                        <th colspan="2">Número Identificación Cónyuge</th>
                                    </tr>
                                    <tr>
                                        <td class="text-end">
                                            {{? it.pfn !== null}}
                                                {{=it.pfn}}
                                            {{?}}
                                        </td>
                                        <td class="text-end">
                                            {{? it.pfn !== null}}
                                                {{=nata.fx.date.getEdad(it.pfn)}}
                                            {{?}}
                                        </td>
                                        <td>{{=it.ps}}</td>
                                        <td>{{=it.pec}}</td>
                                        <td>{{=it.atic}}</td>
                                        <td colspan="2">{{=it.anic}}</td>
                                    </tr>

                                    <tr>
                                        <th colspan="2">Dirección Residencia</th>
                                        <th>Teléfono Residencia</th>
                                        <th>Teléfono Celular</th>
                                        <th>Ubicación Residencia</th>
                                        <th colspan="2">Municipio Residencia</th>
                                    </tr>
                                    <tr>
                                        <td colspan="2">{{=it.adr}}</td>
                                        <td>{{=it.atr}}</td>
                                        <td>{{=it.atc}}</td>
                                        <td>{{=it.aur}}</td>
                                        <td colspan="2">{{=it.amr}}</td>
                                    </tr>

                                    <tr>
                                        <th colspan="2">IPS a la que pertenece</th>
                                        <th>Teléfono IPS</th>
                                        <th colspan="2">Dirección IPS</th>
                                        <th colspan="2">Regional Usuario</th>
                                    </tr>
                                    <tr>
                                        <td colspan="2">{{=it.aip}}</td>
                                        <td>{{=it.ait}}</td>
                                        <td colspan="2">{{=it.adi}}</td>
                                        <td colspan="2">{{=it.aru}}</td>                                    
                                    </tr>

                                    <tr>
                                        <th>Estado Afiliación</th>
                                        <th>Razón Estado</th>
                                        <th>Fecha Fin Urgencia</th>
                                        <th>Fecha Inicio Pleno</th>
                                        <th>Fecha Retiro</th>
                                        <th>Origen Afiliación</th>
                                    </tr>
                                    <tr>
                                        <td>{{=it.ae}}</td>
                                        <td>{{=it.aer}}</td>
                                        <td>
                                            {{? it.affu !== null}}
                                            {{=it.affu}}
                                            {{?}}
                                        </td>
                                        <td>
                                            {{? it.afip !== null}}
                                            {{=it.afip}}
                                            {{?}}
                                        </td>
                                        <td>
                                            {{? it.afre !== null}}
                                            {{=it.afre}}
                                            {{?}}
                                        </td>
                                        <td>{{=it.aoa}}</td>
                                    </tr>
                                </table>
                            </div>

                            <div class="w-100 scroll-x">
                                <h5 class="mt-2">Historial Empresas Cotizantes</h5>
                                <table id="tableHistorialEmpresas" class="table table-sm">
                                    <colgroup>
                                        <col width="90"></col>
                                        <col width="100"></col>
                                        <col width="120"></col>
                                        <col width="250"></col>
                                        <col width="150"></col>
                                        <col width="120"></col>
                                        <col width="120"></col>
                                        <col width="120"></col>
                                        <col width="150"></col>
                                        <col width="200"></col>
                                        <col width="100"></col>
                                    </colgroup>
                                    <tr>
                                        <th>VIP</th>
                                        <th>Tipo Documento</th>
                                        <th>Número Documento</th>
                                        <th>Razón Social</th>
                                        <th>Tipo Cotizante</th>
                                        <th>Fecha Inicio Laboral</th>
                                        <th>Fecha Fin Laboral</th>
                                        <th>Ingreso Mensual</th>
                                        <th>Cargo</th>
                                        <th>Dirección Laboral</th>
                                        <th>Teléfono Laboral</th>
                                    </tr>
                                    {{~ it.hl: d:id}}
                                    <tr>
                                        <td>{{=d.hlv}}</td>
                                        <td>{{=d.hltd}}</td>
                                        <td>{{=d.hlnd}}</td>
                                        <td>{{=d.hlrs}}</td>
                                        <td>{{=d.hltc}}</td>
                                        <td>{{=d.hlfil}}</td>
                                        <td>{{=d.hlffl}}</td>
                                        <td>{{=d.hlim}}</td>
                                        <td>{{=d.hlc}}</td>
                                        <td>{{=d.hldl}} {{=d.hlml}}</td>
                                        <td>{{=d.hltl}}</td>
                                    </tr>
                                    {{~}}
                                </table>
                            </div>

                            <div class="w-100 scroll-x">
                                <h5 class="mt-2">Relación Laboral Cotizante y Beneficiarios</h5>
                                <table id="tableRelacionLaboral" class="table table-sm">
                                    <colgroup>
                                        <col width="90"></col>
                                        <col width="100"></col>
                                        <col width="120"></col>
                                        <col width="250"></col>
                                        <col width="150"></col>
                                        <col width="120"></col>
                                        <col width="120"></col>
                                        <col width="120"></col>
                                        <col width="150"></col>
                                        <col width="200"></col>
                                        <col width="100"></col>
                                    </colgroup>
                                    <tr>
                                        <th>VIP</th>
                                        <th>Tipo Documento</th>
                                        <th>Número Documento</th>
                                        <th>Razón Social</th>
                                        <th>Tipo Cotizante</th>
                                        <th>Fecha Inicio Laboral</th>
                                        <th>Fecha Fin Laboral</th>
                                        <th>Ingreso Mensual</th>
                                        <th>Cargo</th>
                                        <th>Dirección Laboral</th>
                                        <th>Teléfono Laboral</th>
                                    </tr>
                                    {{~ it.rl: d:id}}
                                    <tr>
                                        <td>{{=d.rlv}}</td>
                                        <td>{{=d.rltd}}</td>
                                        <td>{{=d.rlnd}}</td>
                                        <td>{{=d.rlrs}}</td>
                                        <td>{{=d.rltc}}</td>
                                        <td>{{=d.rlfil}}</td>
                                        <td>{{=d.rlffl}}</td>
                                        <td>{{=d.rlim}}</td>
                                        <td>{{=d.rlc}}</td>
                                        <td>{{=d.rldl}} {{=d.rlml}}</td>
                                        <td>{{=d.rltl}}</td>
                                    </tr>
                                    {{~}}
                                </table>
                            </div>
                        </div>
                    `;

                    console.log(data);
                    console.log(tipoIdentificacion, numeroIdentificacion);
                    const dataView = data.filter(function (record) {
                        return (record.pti == tipoIdentificacion && record.pni == numeroIdentificacion);
                    })[0];

                    // historia laboral
                    console.log(dataView);

                    oDialog = new nataUIDialog({
                        html: doT.template(template)(dataView),
                        title: "Ficha Afiliado",
                        events: {
                            render: function () {},
                            close: function () {}
                        }
                    });
                    
                }
            })
            
        }

    },

    recaudo: {
        index: function () {
            console.log("app.consultas.recaudo.index");
            app.core.dialog.close();

            let option;

            const template = `
                <h5>Buscar por</h5>
                <ul class="list-group">
                    <li class="list-group-item">
                        <input id="radioPaciente" class="form-check-input me-1" type="radio" 
                            name="listGroupRadio" value="">
                        <label class="form-check-label" for="radioPaciente">Paciente</label>
                    </li>
                    <li class="list-group-item">
                        <input id="radioRecaudo" class="form-check-input me-1" type="radio" 
                            name="listGroupRadio" value="">
                        <label class="form-check-label" for="radioRecaudo">Recaudo</label>
                    </li>
                </ul>
                <div class="my-2 text-center">
                    <button id="buttonContinuar" type="button" class="btn btn-primary mb-3" disabled>Continuar</button>
                </div>
            `;
            oDialog = new nataUIDialog({
                height: 270,
                width: 425,
                html: doT.template(template)(),
                title: "Consultar Recaudos",
                events: {
                    render: function () {},
                    close: function () {}
                }
            });

            document.querySelector("#radioPaciente").addEventListener("click", function () {
                document.querySelector("#buttonContinuar").disabled = false;
                option = 1;
            });

            document.querySelector("#radioRecaudo").addEventListener("click", function () {
                document.querySelector("#buttonContinuar").disabled = false;
                option = 2;
            });

            document.querySelector("#buttonContinuar").addEventListener("click", function () {
                oDialog.destroy();

                if (option == 1) {
                    app.core.busqueda.identificacionNombre("Recaudos", app.config.server.php + "recaudo/getByIdentificacion", app.consultas.recaudo.render);
                }
                else {
                    const template = `
                        <form id="frmConsultar">

                            <div class="mb-2">
                                <label for="txtLote" class="form-label">Lote</label>
                                <input id="txtLote" class="form-control" type="text" 
                                    minlength="5" maxlength="255" placeholder="Ingresa el lote">
                            </div>

                            <div class="mb-2">
                                <label for="txtFechaDesde" class="form-label">Fecha Desde</label>
                                <input id="txtFechaDesde" class="form-control" type="text" 
                                    minlength="10" maxlength="10" placeholder="Ingresa la fecha desde">
                            </div>

                            <div class="mb-2">
                                <label for="txtFechaHasta" class="form-label">Fecha Hasta</label>
                                <input id="txtFechaHasta" class="form-control" type="text" 
                                    minlength="10" maxlength="10" placeholder="Ingresa la fecha hasta">
                            </div>

                            <div class="my-2 text-center">
                                <button id="buttonContinuar" type="button" class="btn btn-primary mb-3" disabled>Continuar</button>
                            </div>
                        </form>
                    `;
                    oDialog = new nataUIDialog({
                        height: 360,
                        width: 425,
                        html: doT.template(template)(),
                        title: "Buscar por Recaudo",
                        events: {
                            render: function () {},
                            close: function () {}
                        }
                    });

                    const fxLogicaUI = function () {

                        if (document.querySelector("#txtLote").toString().trim().length > 0) {
                            document.querySelector("#buttonContinuar").disabled = false;
                        }

                        if (document.querySelector("#txtFechaDesde").toString().trim().length > 0) {
                            document.querySelector("#buttonContinuar").disabled = false;
                        }

                        if (document.querySelector("#txtFechaHasta").toString().trim().length > 0) {
                            document.querySelector("#buttonContinuar").disabled = false;
                        }
                    };

                    document.querySelector("#txtLote").addEventListener("change", function () {
                        fxLogicaUI();
                    });

                    document.querySelector("#txtFechaDesde").addEventListener("change", function () {
                        fxLogicaUI();
                    });
                    
                    document.querySelector("#txtFechaHasta").addEventListener("change", function () {
                        fxLogicaUI();
                    });

                }
            });
        }
    },

    reembolso: {
        index: function () {
            console.log("%c app.consultas.reembolso.index ", "background: red; color: #fff;font-size: 11px");
            app.core.dialog.close();

            let option;

            const template = `
                <form id="frmReembolsoConsultar">
                    <div class="mb-2">
                        <label for="txtNumeroRadicado" class="form-label"># radicado</label>
                        {{? app.config.dev.mode == true}}
                        <div class="float-end mb-1">
                            <span class="badge text-bg-terciary copy-clipboard">6866</span>
                        </div>
                        {{?}}
                        <input id="txtNumeroRadicado" class="form-control" type="text" 
                            minlength="3" maxlength="20" placeholder="Ingresa el # radicado">
                    </div>

                    <div class="mb-2">
                        <label for="txtFechaDesde" class="form-label">Fecha Desde</label>
                        {{? app.config.dev.mode == true}}
                        <div class="float-end mb-1">
                            <span class="badge text-bg-terciary copy-clipboard">2020-07-24</span>
                        </div>
                        {{?}}
                        <input id="txtFechaDesde" class="form-control" type="date" 
                            minlength="10" maxlength="10" placeholder="Ingresa la fecha desde">
                    </div>

                    <div class="mb-2">
                        <label for="txtFechaHasta" class="form-label">Fecha Hasta</label>
                        <input id="txtFechaHasta" class="form-control" type="date" 
                            minlength="3" maxlength="10" placeholder="Ingresa la fecha hasta">
                    </div>

                    <div class="mb-2">
                        <label for="selRegional" class="form-label">Regional</label>
                        {{? app.config.dev.mode == true}}
                        <div class="float-end mb-1">
                            <span class="badge text-bg-terciary copy-clipboard">Regional Cundinamarca</span>
                        </div>
                        {{?}}
                        <select id="selRegional" class="form-select">
                            <option value="" selected>Selecciona la Regional</option>
                            <option value="Regional Cundinamarca">Regional Cundinamarca</option>
                            <option value="Regional Cundinamarca">Regional Costa</option>
                        </select>
                    </div>

                    <div class="my-2 text-center">
                        <button id="buttonContinuar" type="submit" class="btn btn-primary mb-3" disabled>Continuar</button>
                    </div>
                </form>
            `;
            oDialog = new nataUIDialog({
                height: 450,
                width: 425,
                html: doT.template(template)(),
                title: "Consultar Reembolsos",
                events: {
                    render: function () {},
                    close: function () {}
                }
            });

            let numeroRadicado;
            let fechaDesde;
            let fechaHasta;
            let regional;

            const fxLogicaUI = function () {
                console.log("fxLogicaUI");

                numeroRadicado = document.querySelector("#txtNumeroRadicado").value.toString().trim();
                fechaDesde = document.querySelector("#txtFechaDesde").value.toString().trim();
                fechaHasta = document.querySelector("#txtFechaHasta").value.toString().trim();
                regional = document.querySelector("#selRegional").value.toString().trim();

                console.log(numeroRadicado.length);
                console.log(fechaDesde.length);
                console.log(fechaHasta.length);
                console.log(regional.length);

                if (numeroRadicado.length == 0 &&
                    fechaDesde.length == 0 && 
                    fechaHasta.length == 0 && 
                    regional.length == 0) {
                        document.querySelector("#buttonContinuar").disabled = true;    
                    }
                else if (numeroRadicado.length > 0) {
                    document.querySelector("#buttonContinuar").disabled = false;
                }
                else if (fechaDesde.length > 0) {
                    document.querySelector("#buttonContinuar").disabled = false;
                }
                else if (fechaHasta.length > 0) {
                    document.querySelector("#buttonContinuar").disabled = false;
                }
                else if (regional.length > 0) {
                    document.querySelector("#buttonContinuar").disabled = false;
                }
            };

            document.querySelector("#txtNumeroRadicado").addEventListener("change", function () {
                fxLogicaUI();
            });

            document.querySelector("#txtFechaDesde").addEventListener("change", function () {
                fxLogicaUI();
            });
            
            document.querySelector("#txtFechaHasta").addEventListener("change", function () {
                fxLogicaUI();
            });

            document.querySelector("#selRegional").addEventListener("change", function () {
              fxLogicaUI();
            });
            
            document.querySelector("#frmReembolsoConsultar").addEventListener("submit", function (event) {
                console.log("%c #frmReembolsoConsultar.submit ", "background: red; color: #fff;font-size: 11px");
                event.preventDefault();
                event.stopPropagation();

                const dataSend = {};
                if (numeroRadicado != "") dataSend.nr = numeroRadicado;
                if (fechaDesde != "") dataSend.fd = fechaDesde;
                if (fechaHasta != "") dataSend.fh = fechaHasta;
                if (regional != "") dataSend.r = regional;

                axios.post(app.config.server.php + "reembolso/consultar", dataSend)
                    .then(function (response) {
                        console.log(response.data);

                        if (response.data.length == 0) {
                            swal(app.config.title, "No se ha encontrado información de Reembolsos", "success");
                            document.querySelector("#loader").style.display = "none";
                            return false;
                        }

                        const template = `
                            <style>
                                #tableReembolso {
                                    table-layout: fixed;
                                    width: 1290px;
                                }
                            </style>
                            <div class="w-100 scroll-y">
                                <table id="tableReembolso" class="table table-sm table-font-12px">
                                    <colgroup>
                                        <col width="150"></col>
                                        <col width="90"></col>
                                        <col width="130"></col>
                                        <col width="180"></col>
                                        <col width="180"></col>
                                        <col width="140"></col>
                                        <col width="80"></col>
                                        <col width="140"></col>
                                        <col width="110"></col>
                                        <col width="100"></col>                            
                                    </colgroup>
                                    <thead>
                                        <tr class="text-center zebra">
                                            <th>Radicado</th>
                                            <th>Tipo Documento</th>
                                            <th># Documento</th>
                                            <th>Nombre</th>
                                            <th>Estado Afiliación</th>
                                            <th>Tipo Afiliado</th>
                                            <th>Regional</th>
                                            <th># Factura</th>
                                            <th>Valor Factura</th>
                                            <th>Fecha Radicado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {{~ it.detail: d:id}}
                                        <tr class="{{?id % 2 == 0}}zebra{{?}}">
                                            <td>{{=d.rr}}</td>
                                            <td>{{=d.rtd}}</td>
                                            <td class="text-end">{{=d.rnd}}</td>
                                            <td>{{=d.rppn}} {{=d.rpsn}} {{=d.rppa}}{{=d.rpsa}} </td>
                                            <td>{{=d.rea}}</td>
                                            <td>{{=d.rta}}</td>
                                            <td>{{=d.rre}}</td>
                                            <td class="text-end">{{=d.rnf}}</td>
                                            <td class="text-end">{{=dollarUS.format( d.rvf )}}</td>
                                            <td class="text-end">{{=d.rfr}}</td>
                                        </tr>
                                        <tr class="{{?id % 2 == 0}}zebra{{?}}">
                                            <th colspan="3">Observacion de Devolucion</th>
                                            <th colspan="7">Estado de Cuenta</th>
                                        </tr>
                                        <tr class="{{?id % 2 == 0}}zebra{{?}}">
                                            <td colspan="3">{{=d.rec}}</td>
                                            <td colspan="7">{{=d.rod}}</td>  
                                        </tr>
                                        <tr class="{{?id % 2 == 0}}zebra{{?}}">
                                            <td colspan="10" class="text-center">
                                                <button type="button" 
                                                    class="btn btn-primary button-reembolso-generar min-width-250px"
                                                    data-id="{{=d.rr}}">
                                                    Generar
                                                </button>
                                            </td>                                            
                                        </tr>
                                        {{~}}
                                    </tbody>
                                </table>
                                <div class="w-100 text-center">
                                    
                                </div>
                                <div id="panelDocumentos" class="w-100"></div>
                            </div>
                        `;
                        oDialog.destroy();

                        const html = doT.template(template)({detail: response.data});
                        oDialog = new nataUIDialog({
                            html: html,
                            title: "Reembolsos",
                            events: {
                                render: function () {},
                                close: function () {}
                            }
                        });

                        document.querySelector("#loader").style.display = "none";

                        // event delegate
                        document.querySelector("#tableReembolso").addEventListener("click", function (event) {
                            console.log("tableReembolso.click");

                            const element = event.target;
                            if (element.classList.contains("button-reembolso-generar")) {
                                numeroRadicado = element.dataset.id;

                                const dataSend = {
                                    ir: numeroRadicado
                                };
                                axios.post(app.config.server.php + "reembolso/generar?ts=" + new Date().getTime(), dataSend)
                                    .then(function (response) {
                                        console.log("ajax reembolso/generar");
                                        console.log(response.data);
                                        app.consultas.reembolso.documentos.render(numeroRadicado, response.data, "# radicado");
    
                                    }).catch(function (error) {
                                        console.log(error);
                                    });
                            }
                        });

                    }).catch(function (error) {
                        console.log(error);
                    });
    
            });

        },

        documentos: {
            render: function(id, data, respuesta) {
                console.log("app.consultas.reembolso.documentos.render");

                const template = `
                    <style>
                        #tableDocumentos {
                            table-layout: fixed;
                            width: 350px;
                        }
                    </style>
                    <h5>Soportes</h5>
                    <table id="tableDocumentos" class="table table-sm">
                        <colgroup>
                            <col width="100"></col>
                            <col width="250"></col>
                        </colgroup>
                        <thead>
                            <tr class="text-center">
                                <th>${respuesta}</th>
                                <th>Soporte</th>
                            </tr>
                        </thead>
                        <tbody>
                            {{~ it.detail: d:id}}
                            <tr class="{{?id % 2 == 0}}zebra{{?}}">
                                <td class="text-end">{{=d.id}}</td>
                                <td class="text-center">
                                    <a href="${app.config.server.docs}/reembolso-{{=it.id}}.docx?ts=${new Date().getTime()}" target="_new_{{=it.id}}">reembolso-{{=it.id}}.docx</a>
                                </td>
                            </tr>
                            {{~}}
                        </tbody>
                    </table>
                `;
                console.log(id);
                console.log(data);
                document.querySelector("#panelDocumentos").innerHTML = doT.template(template)({ id: id, detail: data });
            }
        }

    },

    tutela: {
        index: function () {
            console.log("app.consultas.tutela.index");
            app.core.dialog.close();

            let option;

            const template = `
                <h5>Buscar por</h5>
                <ul class="list-group">
                    <li class="list-group-item">
                        <input id="radioPaciente" class="form-check-input me-1" type="radio" name="listGroupRadio" 
                            value="">
                        <label class="form-check-label" for="radioPaciente">Paciente</label>
                    </li>
                    <li class="list-group-item">
                        <input id="radioTutela" class="form-check-input me-1" type="radio" name="listGroupRadio" 
                            value="">
                        <label class="form-check-label" for="radioTutela">Tutela</label>
                    </li>
                </ul>
                <div class="my-2 text-center">
                    <button id="buttonContinuar" type="button" class="btn btn-primary mb-3" disabled>Continuar</button>
                </div>
            `;
            oDialog = new nataUIDialog({
                height: 270,
                width: 425,
                html: doT.template(template)(),
                title: "Consultar Tutelas",
                events: {
                    render: function () {},
                    close: function () {}
                }
            });

            document.querySelector("#radioPaciente").addEventListener("click", function () {
                document.querySelector("#buttonContinuar").disabled = false;
                option = 1;
            });

            document.querySelector("#radioTutela").addEventListener("click", function () {
                document.querySelector("#buttonContinuar").disabled = false;
                option = 2;
            });

            document.querySelector("#buttonContinuar").addEventListener("click", function () {
                oDialog.destroy();

                if (option == 1) {
                    app.core.busqueda.identificacionNombre(
                        "Tutelas", 
                        app.config.server.php + "tutela/consultar", 
                        app.consultas.tutela.render
                    );
                }
                else {
                    const template = `
                        <form id="frmConsultar">

                            <div class="mb-2">
                                <label for="txtIDTutela" class="form-label">ID Tutela</label>
                                <input id="txtIDTutela" class="form-control" type="text" 
                                    minlength="10" maxlength="10" placeholder="Ingresa el ID de la tutela">
                            </div>

                            <div class="mb-2">
                                <label for="txtFecha" class="form-label">Fecha Tutela</label>
                                <input id="txtFecha" class="form-control" type="text" 
                                    minlength="10" maxlength="10" placeholder="YYYY-MM-DD">
                            </div>

                            <div class="mb-2">
                                <label for="tarPretenciones" class="form-label">Pretenciones</label>
                                <textarea id="tarPretenciones" class="form-control" 
                                    aria-label="Pretenciones" minlength="5" maxlength="300"
                                    placeholder="ingresa las pretenciones a consultar"></textarea>
                            </div>

                            <div class="my-2 text-center">
                                <button id="buttonContinuar" type="button" class="btn btn-primary mb-3" disabled>Continuar</button>
                            </div>
                        </form>
                    `;
                    oDialog = new nataUIDialog({
                        height: 360,
                        width: 425,
                        html: doT.template(template)(),
                        title: "Buscar por Tutela",
                        events: {
                            render: function () {},
                            close: function () {}
                        }
                    });

                    const fxLogicaUI = function () {
                        if (document.querySelector("#txtIDTutela").toString().trim().length > 0) {
                            document.querySelector("#buttonContinuar").disabled = false;
                        }

                        if (document.querySelector("#txtFecha").toString().trim().length > 0) {
                            document.querySelector("#buttonContinuar").disabled = false;
                        }

                        if (document.querySelector("#tarPretenciones").toString().trim().length > 0) {
                            document.querySelector("#buttonContinuar").disabled = false;
                        }
                    };

                    document.querySelector("#txtIDTutela").addEventListener("change", function () {
                        fxLogicaUI();
                    });
                    
                    document.querySelector("#txtFecha").addEventListener("change", function () {
                        fxLogicaUI();
                    });

                    document.querySelector("#tarPretenciones").addEventListener("change", function () {
                        fxLogicaUI();
                    });
                }
            });
        },

        render: function (data) {
            console.log("app.tutela.afiliacion.render");
            console.log(data);

            const template = `
                <style>
                    #tableTutela {
                        table-layout: fixed;
                        width: 910px;
                    }
                </style>
                <div class="w-100 scroll">
                    <h5>Datos del Paciente</h5>
                    <table id="tableTutela" class="table table-sm">
                        <colgroup>
                            <col width="100"></col>
                            <col width="250"></col>
                            <col width="200"></col>
                            <col width="220"></col>
                            <col width="140"></col>
                        </colgroup>
                        <tr class="text-center">
                            <th>ID</th>
                            <th>Entidad</th>
                            <th>Regional</th>
                            <th>Estado</th>
                            <th>Fecha Presentación</th>
                        </tr>
                        {{~ it.detail: d:id}}
                        <tr class="text-center">
                            <td>{{=d.ti}}</td>
                            <td>{{=d.te}}</td>
                            <td>{{=d.tr}}</td>                            
                            <td>{{=d.tes}}</td>
                            <td>{{=d.tfp}}</td>
                        </tr>
                        {{~}}
                    </table>
                </div>
            `;

            document.querySelector("#container").innerHTML = doT.template(template)({detail: data}),
            document.querySelector("#loader").style.display = "none";

            document.querySelector("#tableHistoriaClinica").addEventListener("click", function(event) {
                const element = event.target;
                if (element.classList.contains("button-hc-generar")) {
                    console.log(".button-hc-generar.click");
                    alert("No es posible generar el documento, pendientes con el cliente");
                    return false;

                    const tipoIdentificacion = element.dataset.ti;
                    const numeroIdentificacion = element.dataset.ni;

                    const template = `
                        <style>
                            #tableFichaAfiliado {
                                table-layout: fixed;
                                width: 1050px;
                            }
                            #tableHistorialEmpresas {
                                table-layout: fixed;
                                max-width: 1350px;
                                overflow-x: auto;
                            }
                            #tableRelacionLaboral {
                                table-layout: fixed;
                                max-width: 1350px;
                                overflow-x: auto;
                            }
                        </style>
                        <div class="w-1340px scroll-y">
                            <div class="w-100">
                                <table id="tableFichaAfiliado" class="table table-sm">
                                    <colgroup>
                                        <col width="150"></col>
                                        <col width="150"></col>
                                        <col width="150"></col>
                                        <col width="150"></col>
                                        <col width="150"></col>
                                        <col width="150"></col>
                                        <col width="150"></col>
                                    </colgroup>
                                    <tr>
                                        <th>Fecha Radicado</th>
                                        <th># Radicado</th>
                                        <th>Formulario</th>
                                        <th>Tipo Afiliado</th>
                                        <th>Fecha Afiliación</th>
                                        <th>Fecha Afilicación SGSSS</th>
                                        <th>Discapacidad</th>
                                    </tr>
                                    <tr>
                                        <td class="text-end">{{=it.afr}}</td>
                                        <td class="text-end">{{=it.anr}}</td>
                                        <td class="text-end">{{=it.anf}}</td>
                                        <td class="text-end">{{=it.ata}}</td>
                                        <td class="text-end">{{=it.afa}}</td>
                                        <td class="text-end">{{=it.afs}}</td>
                                        <td>{{=it.ad}}</td>
                                    </tr>

                                    <tr>
                                        <th>Grado</th>
                                        <th>Tipo Identificación</th>
                                        <th># Documento</th>
                                        <th>Primer Apellido</th>
                                        <th>Segundo Apellido</th>
                                        <th>Primer Nombre</th>
                                        <th>Segundo Nombre</th>
                                    </tr>
                                    <tr>
                                        <td class="text-end">{{=it.ag}}</td>
                                        <td class="text-end">{{=it.pti}}</td>
                                        <td class="text-end">{{=it.pni}}</td>
                                        <td class="text-end">{{=it.ppa}}</td>
                                        <td class="text-end">{{=it.psa}}</td>
                                        <td class="text-end">{{=it.ppn}}</td>
                                        <td class="text-end">{{=it.psn}}</td>
                                    </tr>

                                    <tr>
                                        <th>Fecha Nacimiento</th>
                                        <th>Edad</th>
                                        <th>Sexo</th>
                                        <th>Estado Civil</th>
                                        <th>Tipo Identifiación Conyuge</th>
                                        <th colspan="2">Número Identificación Cónyuge</th>
                                    </tr>
                                    <tr>
                                        <td class="text-end">
                                            {{? it.pfn !== null}}
                                                {{=it.pfn}}
                                            {{?}}
                                        </td>
                                        <td class="text-end">
                                            {{? it.pfn !== null}}
                                                {{=nata.fx.date.getEdad(it.pfn)}}
                                            {{?}}
                                        </td>
                                        <td>{{=it.ps}}</td>
                                        <td>{{=it.pec}}</td>
                                        <td>{{=it.atic}}</td>
                                        <td colspan="2">{{=it.anic}}</td>
                                    </tr>

                                    <tr>
                                        <th colspan="2">Dirección Residencia</th>
                                        <th>Teléfono Residencia</th>
                                        <th>Teléfono Celular</th>
                                        <th>Ubicación Residencia</th>
                                        <th colspan="2">Municipio Residencia</th>
                                    </tr>
                                    <tr>
                                        <td colspan="2">{{=it.adr}}</td>
                                        <td>{{=it.atr}}</td>
                                        <td>{{=it.atc}}</td>
                                        <td>{{=it.aur}}</td>
                                        <td colspan="2">{{=it.amr}}</td>
                                    </tr>

                                    <tr>
                                        <th colspan="2">IPS a la que pertenece</th>
                                        <th>Teléfono IPS</th>
                                        <th colspan="2">Dirección IPS</th>
                                        <th colspan="2">Regional Usuario</th>
                                    </tr>
                                    <tr>
                                        <td colspan="2">{{=it.aip}}</td>
                                        <td>{{=it.ait}}</td>
                                        <td colspan="2">{{=it.adi}}</td>
                                        <td colspan="2">{{=it.aru}}</td>                                    
                                    </tr>

                                    <tr>
                                        <th>Estado Afiliación</th>
                                        <th>Razón Estado</th>
                                        <th>Fecha Fin Urgencia</th>
                                        <th>Fecha Inicio Pleno</th>
                                        <th>Fecha Retiro</th>
                                        <th>Origen Afiliación</th>
                                    </tr>
                                    <tr>
                                        <td>{{=it.ae}}</td>
                                        <td>{{=it.aer}}</td>
                                        <td>
                                            {{? it.affu !== null}}
                                            {{=it.affu}}
                                            {{?}}
                                        </td>
                                        <td>
                                            {{? it.afip !== null}}
                                            {{=it.afip}}
                                            {{?}}
                                        </td>
                                        <td>
                                            {{? it.afre !== null}}
                                            {{=it.afre}}
                                            {{?}}
                                        </td>
                                        <td>{{=it.aoa}}</td>
                                    </tr>
                                </table>
                            </div>

                            <div class="w-100 scroll-x">
                                <h5 class="mt-2">Historial Empresas Cotizantes</h5>
                                <table id="tableHistorialEmpresas" class="table table-sm">
                                    <colgroup>
                                        <col width="90"></col>
                                        <col width="100"></col>
                                        <col width="120"></col>
                                        <col width="250"></col>
                                        <col width="150"></col>
                                        <col width="120"></col>
                                        <col width="120"></col>
                                        <col width="120"></col>
                                        <col width="150"></col>
                                        <col width="200"></col>
                                        <col width="100"></col>
                                    </colgroup>
                                    <tr>
                                        <th>VIP</th>
                                        <th>Tipo Documento</th>
                                        <th>Número Documento</th>
                                        <th>Razón Social</th>
                                        <th>Tipo Cotizante</th>
                                        <th>Fecha Inicio Laboral</th>
                                        <th>Fecha Fin Laboral</th>
                                        <th>Ingreso Mensual</th>
                                        <th>Cargo</th>
                                        <th>Dirección Laboral</th>
                                        <th>Teléfono Laboral</th>
                                    </tr>
                                    {{~ it.hl: d:id}}
                                    <tr>
                                        <td>{{=d.hlv}}</td>
                                        <td>{{=d.hltd}}</td>
                                        <td>{{=d.hlnd}}</td>
                                        <td>{{=d.hlrs}}</td>
                                        <td>{{=d.hltc}}</td>
                                        <td>{{=d.hlfil}}</td>
                                        <td>{{=d.hlffl}}</td>
                                        <td>{{=d.hlim}}</td>
                                        <td>{{=d.hlc}}</td>
                                        <td>{{=d.hldl}} {{=d.hlml}}</td>
                                        <td>{{=d.hltl}}</td>
                                    </tr>
                                    {{~}}
                                </table>
                            </div>

                            <div class="w-100 scroll-x">
                                <h5 class="mt-2">Relación Laboral Cotizante y Beneficiarios</h5>
                                <table id="tableRelacionLaboral" class="table table-sm">
                                    <colgroup>
                                        <col width="90"></col>
                                        <col width="100"></col>
                                        <col width="120"></col>
                                        <col width="250"></col>
                                        <col width="150"></col>
                                        <col width="120"></col>
                                        <col width="120"></col>
                                        <col width="120"></col>
                                        <col width="150"></col>
                                        <col width="200"></col>
                                        <col width="100"></col>
                                    </colgroup>
                                    <tr>
                                        <th>VIP</th>
                                        <th>Tipo Documento</th>
                                        <th>Número Documento</th>
                                        <th>Razón Social</th>
                                        <th>Tipo Cotizante</th>
                                        <th>Fecha Inicio Laboral</th>
                                        <th>Fecha Fin Laboral</th>
                                        <th>Ingreso Mensual</th>
                                        <th>Cargo</th>
                                        <th>Dirección Laboral</th>
                                        <th>Teléfono Laboral</th>
                                    </tr>
                                    {{~ it.rl: d:id}}
                                    <tr>
                                        <td>{{=d.rlv}}</td>
                                        <td>{{=d.rltd}}</td>
                                        <td>{{=d.rlnd}}</td>
                                        <td>{{=d.rlrs}}</td>
                                        <td>{{=d.rltc}}</td>
                                        <td>{{=d.rlfil}}</td>
                                        <td>{{=d.rlffl}}</td>
                                        <td>{{=d.rlim}}</td>
                                        <td>{{=d.rlc}}</td>
                                        <td>{{=d.rldl}} {{=d.rlml}}</td>
                                        <td>{{=d.rltl}}</td>
                                    </tr>
                                    {{~}}
                                </table>
                            </div>
                        </div>
                    `;

                    console.log(data);
                    console.log(tipoIdentificacion, numeroIdentificacion);
                    const dataView = data.filter(function (record) {
                        return (record.pti == tipoIdentificacion && record.pni == numeroIdentificacion);
                    })[0];

                    // historia laboral
                    console.log(dataView);

                    oDialog = new nataUIDialog({
                        html: doT.template(template)(dataView),
                        title: "Ficha Afiliado",
                        events: {
                            render: function () {},
                            close: function () {}
                        }
                    });
                    
                }
            })
            
        }
    }
};

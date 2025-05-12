/* globals app, nataUIDialog, doT, axios, $, session */

// eslint-disable-next-line no-unused-vars
//let oDialogConsultaAfiliacion;

app.consultas.afiliacion = {
    index: function() {
        console.log("app.consultas.afiliacion.index");
        app.core.dialog.close();
        app.core.busqueda.identificacionNombreV1(
            "Afiliaciones", app.config.server.php + "afiliacion/consultar", app.consultas.afiliacion.render
        );
    },
    render: function(dataResponse, oUI = {}) {
        console.log("app.consultas.afiliacion.render");

        if (typeof oUI.button !== "undefined") oUI.button.disabled = false;

        console.log(dataResponse);
        const tipoConsulta = dataResponse.tc;
        const data = dataResponse.data;

        console.log(tipoConsulta);
        console.log(data);

        const template = `
            <style>
                #tableAfiliacion-{{=it.tc}} {
                    table-layout: fixed;
                    width: 1070px;
                }
            </style>
            <div class="w-100 scroll">
                <h5>Afiliado y Grupo Familiar</h5>
                <table id="tableAfiliacion-{{=it.tc}}" class="table table-striped table-sm">
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
                            <td class="">{{=d.ata}}</td>
                            <td class="text-center">
                                {{? it.tc == 1}}
                                <button type="button" class="btn btn-primary min-width-140px button-afiliado-ficha-ver"
                                    data-ti="{{=d.pti}}" data-ni="{{=d.pni}}">
                                    Ver
                                </button>
                                {{??}}
                                <button type="button" class="btn btn-primary min-width-140px button-afiliado-consultar"
                                    data-ti="{{=d.pti}}" data-ni="{{=d.pni}}">
                                    Consultar
                                </button>
                                {{?}}
                            </td>
                        </tr>
                        {{~}}
                    </tbody>
                </table>
            </div>
        `;
        const html = doT.template(template)({tc: tipoConsulta, detail: data});

        if (typeof session.dialog !== "undefined") session.dialog.destroy();
        session.dialog = new nataUIDialog({
            html: html,
            title: "Afiliaciones",
            events: {
                render: function() {},
                close: function() {}
            }
        });
        document.querySelector("#loader").style.display = "none";
        
        // evento delegados

        const fx = function (event) {
            console.log("event.click");

            const element = event.target;
            if (element.classList.contains("button-afiliado-ficha-ver")) {
                session.dialog.destroy();
                console.log(".button-afiliado-ficha-ver.click");
                const tipoIdentificacion = element.dataset.ti;
                const numeroIdentificacion = element.dataset.ni;
                console.log(tipoIdentificacion);
                console.log(numeroIdentificacion);

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

                    </div>
                `;
                
                console.log(data);
                console.log(event);

                const dataView = data.filter((function(record) {
                    return record.pti == tipoIdentificacion && record.pni == numeroIdentificacion;
                }))[0];
                
                new nataUIDialog({
                    html: doT.template(template)(dataView),
                    title: "Ficha Afiliado",
                    events: {
                        render: function() {},
                        close: function() {}
                    }
                });
            }
            else if (element.classList.contains("button-afiliado-consultar")) {
                const tipoIdentificacion = element.dataset.ti;
                const numeroIdentificacion = element.dataset.ni;
                const data = {
                    t: tipoIdentificacion,
                    n: numeroIdentificacion
                };
                axios.post(app.config.server.php + "afiliacion/consultar?ts=" + (new Date).getTime(), data)
                    .then((function(response) {
                        app.consultas.afiliacion.render(response.data);
                    })).catch((function(error) {
                        console.log(error);
                    }));
            }
        };

        $("#tableAfiliacion-" + tipoConsulta)
            .off()
            .click(fx);

        //document.querySelector("#tableAfiliacion").removeEventListener("click", fx);
        //document.querySelector("#tableAfiliacion").addEventListener("click", fx);
    }
};

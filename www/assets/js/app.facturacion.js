/* globals app, $, nata, nataUIDialog, doT, dayjs */

app.facturacion = {
    dataset: {
        // app.facturacion.dataset.periodos
        periodos: [
            {
                a: 2023,
                m: 4,
                fi: "2023-04-01",
                ff: "2022-04-30"
            },
            {
                a: 2023,
                m: 4,
                fi: "2023-04-01",
                ff: "2023-04-30"
            }
        ]
    },
    index: function () {
        console.log("app.facturacion.index");

        const oDataFacturacion = [
            {
                idConvenio: 16,
                //convenio: "SANITAS PREMIUM",
                convenio: "SOAT",
                codigoServicio: "890101",
                servicio: "ATENCION (VISITA) DOMICILIARIA POR MEDICO GENERAL",
                cantidadServicios: 2643,
                saldo: 177081000
            }
            /*
            ,
            {
                idConvenio: 4,
                convenio: "SEGUROS BOLIVAR",
                codigoServicio: "890101",
                servicio: "ATENCIÓN (VISITA) DOMICILIARIA POR MEDICINA GENERAL",
                cantidadServicios: 3500,
                saldo: 216678000
            }
            */
        ];

        const oDataModeloControl = [
            {
                idControl: 1,
                control: "Soporte Prestación"
            },
            {
                idControl: 2,
                control: "Historia Clinica"
            },
            {
                idControl: 3,
                control: "RIPS"
            }
        ];

        let i, total = 0;
        for (i=0; i<oDataFacturacion.length; i++) {
            total += oDataFacturacion[i].saldo;
        }

        /*
        let oPeriodo = app.facturacion.dataset.periodos.filter(function (record) {
            return record.a == new Date().getFullYear()
                && record.m == new Date().getMonth() + 1;
        });

        if (oPeriodo.length == 0) {
            swal("Artemisa 2023", "Error, no se ha configurado el período de facturación", "error");
            return false;
        }
        */

        const oPeriodo = app.facturacion.dataset.periodos[0];

        const date = dayjs().format("YYYY-MM-DD");

        const template = `
                <table id="tableFacturacionResumen" class="table table-sm mt-3">
                    <colgroup>
                        <col width="150"></col>
                        <col width="100"></col>
                        <col width="150"></col>
                        <col width="100"></col>
                    </colgroup>
                    <tr>
                        <td class="ui-label-sm">
                            Fecha Actual
                        </td>
                        <td class="text-end">
                            <span class="badge rounded-pill text-bg-primary">${date}</span>
                        </td>                    
                        <td class="ui-label-sm">
                            Saldo por Facturar
                        </td>
                        <td class="text-end">
                            <span class="badge rounded-pill text-bg-danger">{{=numberDecimal.format( ${total} )}}</span>
                        </td>
                    </tr>
                </table>

                <div class="p-3">
                    <table id="tableFacturacionPendientes" class="table table-bordered table-sm table-striped table-fix-layout">
                        <colgroup>
                            <col width="400"></col>
                            <col width="150"></col>
                            <col width="150"></col>
                            <col width="200"></col>
                        </colgroup>
                        <tr>
                            <th class="text-center">
                                Convenio
                            </th>
                            <th class="text-center">
                                Cantidad Servicios
                            </th>
                            <th class="text-center">
                                Valor
                            </th>
                            <th class="text-center"></th>
                        </tr>
                        {{~ it.detail: d:id}}
                        <tr>
                            <td>
                                {{=d.convenio}}
                            </td>
                            <td>
                                <span class="badge text-bg-danger rounded-pill min-width-50px text-end">
                                    {{=d.cantidadServicios}}
                                </span>
                            </td>
                            <td class="text-end">
                                <span class="badge text-bg-danger rounded-pill min-width-50px text-end">
                                    {{=numberDecimal.format( d.saldo )}}
                                </span>
                            </td>
                            <td>
                                <div class="btn-toolbar justify-content-end" role="toolbar">
                                    <div class="btn-group me-2 text-end" role="group">
                                        <button type="button" class="btn btn-danger button-facturacion-gestion"
                                            data-id="{{=d.idConvenio}}"
                                            data-convenio="{{=d.convenio}}">
                                            Gestion
                                        </button>
                                        <button type="button" class="btn btn-primary button-facturacion-soportes" data-id="{{=d.i}}">Soportes</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        {{~}}
                    </table>
                </div>
                <!--
                <div class="w-100">
                    <button id="buttonCuentaMedicaPendiente" type="button" class="btn btn-danger max-width-250px">
                        Pendientes Presentación Cuenta Médica
                    </button>
                </div>
                !-->
                <div id="chart" class="h-50 bg-white rounded-pill">
                    &nbsp;
                </div>
        `;

        const element = document.getElementById("container");
        element.innerHTML = doT.template(template)({
            detail:oDataFacturacion,
            total:oDataFacturacion.sum("saldo"),
            fi: oPeriodo.fi,
            ff: oPeriodo.ff,
        });
        element.style.display = "block";

        nata.ui.charts.echarts.doughnutChart.render("chart", oDataFacturacion, "convenio", "saldo", "Convenio");

        $("#tableFacturacionPendientes .button-facturacion-gestion")
            .off()
            .click(app.facturacion.control.gestion);

        $("#tableFacturacionPendientes .button-facturacion-soportes")
            .off()
            .click(app.facturacion.soportes.render);

    },
    control: {
        gestion: function() {
            console.log("app.facturacion.control.gestion");

            const id = this.dataset.id;
            const convenio = this.dataset.convenio;

            const oDataSoportesEstadoxConvenio = [
                {
                    idConvenio: 16,
                    idControl: 1,
                    control: "Soporte Prestación",
                    cantidadAprobados: 0,
                    cantidadPendientes: 2643
                },
                {
                    idConvenio: 16,
                    idControl: 2,
                    control: "Historia Clinica",
                    cantidadAprobados: 0,
                    cantidadPendientes: 2643
                },
                {
                    idConvenio: 16,
                    idControl: 3,
                    control: "RIPS",
                    cantidadAprobados: 2643,
                    cantidadPendientes: 0
                }
            ];

            const temporal = oDataSoportesEstadoxConvenio.filter(function(record){
                return record.idConvenio == id;
            });

            console.log(temporal);

            const template = `
                <h4>Control Soportes Cuenta Médica</h4>
                <div class="p-3">
                    <style>
                        #tableControlSoportes { 
                            width: 550px;
                        }
                    </style>
                    <table id="tableControlSoportes" class="table table-bordered table-sm table-striped table-fix-layout">
                        <tr>
                            <td class="text-center ui-label-sm width-150px">
                                Soporte
                            </td>                    
                            <td class="text-center ui-label-sm width-100px">
                                Aprobados
                            </td>
                            <td class="text-center ui-label-sm width-100px">
                                Pendientes
                            </td>
                            <td class="text-center ui-label-sm width-100px">
                                % Pendientes
                            </td>
                            <td class="text-center ui-label-sm width-100px">
                                % Completos
                            </td>
                        </tr>
                        {{~ it.detail: d:id}}
                        {{

                        }}
                        <tr>
                            <td>
                                {{=d.control}}
                            </td>
                            <td class="text-end">
                                <span class="badge rounded-pill text-bg-success text-end">
                                    {{=numberDecimal.format(d.cantidadAprobados)}}
                                </span>
                            </td>
                            <td class="text-end">
                                <span class="badge rounded-pill text-bg-danger text-end">
                                    {{=numberDecimal.format(d.cantidadPendientes)}}
                                </span>
                            </td>
                            <td class="text-end">
                                {{? d.cantidadAprobados == 0}}
                                <span class="badge rounded-pill text-bg-danger text-end">100%</span>
                                {{?}}
                            </td>
                            <td class="text-end">
                                {{? d.cantidadPendientes == 0}}
                                <span class="badge rounded-pill text-bg-success text-end">100%</span>
                                {{?}}
                            </td>
                        </tr>
                        {{~}}
                    </table>
                </div>
            `;

            oDialog = new nataUIDialog({
                height: "100%",
                html: doT.template(template)({detail: temporal}),
                width: "100%",
                title: convenio
            });

            /*
            nata.localforage.getItem("facturacion-detalle").then(function (data) {
                data = data.filter(function (record) {
                    return record.ic == id;
                });
                console.log(data);
                const total = data.sum("v");
                console.log(total);
                const html = nata.ui.template.get("templateFacturacionControlGestion", { detail: data, total: total, url: app.config.server.docs });
                oDialog = new nataUIDialog({
                    height: "100%",
                    html: html,
                    width: "100%",
                    title: convenio
                });

                const elements = document.querySelector("#tableFacturacionControlGestion").querySelectorAll(".ui-tooltip");
                let i;
                for (i=0; i<elements.length; i++) {
                    new bootstrap.Tooltip(elements[i]);
                }
            });
            */
            
            // presentar el modelo de control de soportes

        }
    },
    detalle: {
        render: function () {
            console.log("app.factura.detalle.render");

            const id = this.dataset.id;

            let oDialog;
            if (typeof oDialog != "undefined") {
                oDialog.destroy();
            }

            nata.localforage.getItem("facturacion-detalle").then(function (data) {
                data = data.filter(function (record) {
                    return record.ic == id;
                });
                console.log(data);
                const html = nata.ui.template.get("templateFacturacionDetalle", { detail: data, url: app.config.server.docs });
                oDialog = new nataUIDialog({
                    height: "100%",
                    html: html,
                    width: "100%",
                    title: "Detalle Facturación"
                });
            });
        }
    },
    soportes: {
        render: async function () {
            console.log("app.factura.soportes.render");
            let oDialog;
            if (typeof oDialog != "undefined") {
                oDialog.destroy();
            }
            //const data = await nata.localforage.getItem("facturacion-detalle");
            const data = [
                {
                    s: "Factura Electrónica",
                    l: "/soportes/f-990020025.pdf"
                },
                {
                    s: "RIPS",
                    l: "/soportes/rips/rips-1234567890.zip"
                },
                {
                    s: "Historia Clínica",
                    l: "/soportes/hc/hv-52807380.pdf"
                },
                {
                    s: "FURIPS",
                    l: "/soportes/FURIPS.pdf"
                },
                {
                    s: "FURTRAN",
                    l: "/soportes/FURTRAN.pdf"
                }
            ];
            //console.log(data);
            //const html = nata.ui.template.get("templateFacturacionDetalle", { detail: data });
            const html = nata.ui.template.get("templateFacturacionSoportes", { detail: data} );
            oDialog = new nataUIDialog({
                height: 600,
                html: html,
                title: "Soportes Facturación",
                width: 400
            });
        }
    }
};
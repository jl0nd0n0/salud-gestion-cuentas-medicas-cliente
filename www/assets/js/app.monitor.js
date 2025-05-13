/* eslint-disable quotes */
/* globals app, nata, doT*/

app.monitor = {
   index: function () {
        console.trace("%c app.monitor.index", "background:red;color:#fff;font-size:11px");

        // Obtener datos del localStorage
        let data = nata.localStorage.getItem("robot-armado");
        console.log(data);
        /*
        console.log(data.filter(function (record) {
            return record.f == "IND646213"
        }));
        */

        let dataDetalle = data.detalles;
        let dataResumen = data.resumen;
        let dataResumenRegistros = data.resumenRegistros;

        const processedData = dataDetalle.map(item => {
            const allOk = item.d.every(dd => dd.ge !== "0");
            return {
                ...item,
                radicarOK: allOk
            };
        });

        console.log(processedData);
        

        const tableTemplate = `
            <div class="container-1 w-100 h-100 algin-top">
                
                <div class="card mx-2 my-4 d-inline-block">
                    <div class="card-header position-relative">
                        <div>
                            <div class="icon-title">${iconChart}</div>  Armado Cuentas Médicas - Diario
                        </div>
                        <div class="w-100 text-end">
                            <input id="datepicker" type="date" class="form-control d-inline-block max-width-200px control-highlight" value="2025-05-12">
                        </div>
                        
                    </div>
                    <div id="chart1" class="card-body min-width-450px min-height-500px"></div>
                    <div id="box1" class="min-width-450px"></div>
                </div>

                <div class="card mx-2 my-4 d-inline-block scroll-y">
                    <div class="card-header">
                        <div class="icon-title">${iconProcess}</div>  Control Armado Cuentas Médicas - Diario
                    </div>
                    <div class="card-body">
                        <input id="txtSearch" type="text" class="form-control input-search mb-3" placeholder="Buscar ..." autocomplete="off" style="width: 980px;">
                        <div id="searchTarget" style="overflow: auto; height: 80vh;">
                            <style>
                                .table-robot-armado-cuenta {
                                    table-layout: fixed;
                                    width: 930px;
                                }

                                .table-robot-armado-cuenta-detail {
                                    table-layout: fixed;
                                    width: 930px;
                                }

                                .table-robot-armado-cuenta td,
                                .table-robot-armado-cuenta-detail td {
                                    font-size: 12px
                                }

                                .table-robot-armado-cuenta-detail tr th {
                                    font-size: 11px
                                }
                            </style>
                            
                            {{~it.detail: d:id}}
                            <div class="search-group mb-4">
                                <table class="table table-bordered table-sm table-robot-armado-cuenta">
                                    <colgroup>
                                        <col width="50"></col>
                                        <col width="350"></col>
                                        <col width="200"></col>
                                        <col width="140"></col>
                                        <col width="240"></col>
                                    </colgroup>
                                    <thead class="table-primary">
                                        <tr>
                                            <th class="text-center">Radicar</th>
                                            <th class="text-center">Factura</th>
                                            <th class="text-center">Fecha</th>
                                            <th class="text-center">Valor</th>
                                            <th class="text-center">Paciente</th>
                                            <th class="text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                            <tr class="bg-table-row-1">
                                                <td class="text-center border-right-none">
                                                    {{? d.radicarOK }}
                                                        <div class="rounded-circle bg-success d-inline-block icon-dot" ></div>
                                                    {{??}}
                                                        <div class="rounded-circle bg-danger d-inline-block icon-dot"></div>
                                                    {{?}}
                                                </td>
                                                <td class="text-start fw-bold">{{=d.f}}</td>
                                                <td class="text-center">{{=d.fe}}</td>
                                                <td class="text-end">
                                                    $ {{=numberDecimal.format( d.v )}}
                                                </td>
                                                <td colspan="2" class="text-center">{{=d.p}}</td>
                                            </tr>                                
                                    </tbody>
                                </table>
                                
                                <table class="table table-bordered table-sm table-robot-armado-cuenta-detail">
                                    <colgroup>
                                        <col width="400"></col>
                                        <col width="200"></col>
                                        <col width="140"></col>
                                        <col width="120"></col>
                                        <col width="120"></col>
                                    </colgroup>
                                    <thead class="table-primary">
                                        <tr>
                                            <th class="text-center">Grupo</th>
                                            <th class="text-center">Soporte</th>
                                            <th class="text-center">Armado</th>
                                            <th class="text-center">Estado</th>
                                            <th class="text-center">Descripción</th>
                                        </tr>
                                    </thead>
                                    {{~d.d: dd:idd}}
                                    <tr {{? idd % 2 == 1}}class="bg-table-row-1"{{?}}>
                                        <td class="text-start">{{=dd.g}}</td>
                                        <td class="text-start">
                                            <span class="badge 
                                                {{? dd.ge == "1"}}text-bg-success{{??}}text-bg-danger{{?}}">
                                                {{=dd.s}}
                                            </span>                                        
                                        </td>
                                        <td class="text-center">
                                            {{? dd.ge == "0"}}
                                            <div class="rounded-circle bg-danger d-inline-block icon-dot"></div>
                                            {{??}}
                                            <div class="rounded-circle bg-success d-inline-block icon-dot"></div>
                                            {{?}}
                                        </td>
                                        <td class="text-start">{{=dd.o}}</td>
                                        <td class="text-start">{{=dd.n}}</td>
                                    </tr>
                                    {{~}}                                
                                    </tbody>
                                </table>
                            </div>
                            {{~}}

                        </div>
                    </div>
                </div>            
            </div>
        `;

        const html = doT.template(tableTemplate)({detail: processedData});

        // const html = compiledTemplate(data); 

        const container = document.getElementById("container");

        if (container) {
            container.innerHTML = html;

            session.jets = new Jets({
                searchTag: "#txtSearch",
                contentTag: "#searchTarget",
                rowSelector: ".search-group"
            });

           flatpickr("#datepicker", {
                // mode: "range",
                minDate: "2025-05-12",
                maxDate: new Date(),
                dateFormat: "Y-m-d",
                locale: {
                    firstDayOfWeek: 1,
                    weekdays: {
                        shorthand: ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"],
                        longhand: [
                            "Domingo", "Lunes", "Martes", "Miércoles",
                            "Jueves", "Viernes", "Sábado"
                        ]
                    },
                    months: {
                        shorthand: [
                            "Ene", "Feb", "Mar", "Abr", "May", "Jun",
                            "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
                        ],
                        longhand: [
                            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                        ]
                    }
                }
            });

        } else {
            console.error("Contenedor no encontrado.");
        }

        const fxRenderChart = function () {
            // Initialize the echarts instance based on the prepared dom
            const myChart = echarts.init(document.getElementById('chart1'));

            const chartData = dataResumen.map(item => ({
                value: parseFloat(item.v),
                name: item.e
            }));

            // Specify the configuration items and data for the chart
            const option = {
                color: ['#f8d7da', '#C5E1A5'],
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [
                    {
                        name: 'Facturas',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 40,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: chartData
                    }
                ]
            };

            // Display the chart using the configuration items and data just specified.
            myChart.setOption(option);

            const template = `
                <style>
                    .table-consolidado {
                        table-layout: fixed;
                        width: 480px;
                    }
                    .table-consolidado tr th {
                        font-size: 11px
                    }
                </style>
                
                <table class="table table-bordered table-sm table-consolidado mb-3">
                    <colgroup>
                        <col width="50"></col>
                        <col width="150"></col>
                        <col width="80"></col>
                        <col width="120"></col>
                        <col width="80"></col>
                    </colgroup>
                    <thead class="table-primary">
                        <tr>
                            <th class="text-center">Radicar</th>
                            <th class="text-center">Estado</th>
                            <th class="text-end">Cantidad Facturas</th>
                            <th class="text-end">Valor Total</th>
                            <th class="text-end">%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {{~it.detail: d:id}}
                        <tr class="bg-table-row-1">
                            <td class="text-center">
                                {{? d.e == "Listas para radicar"}}
                                <div class="rounded-circle bg-success d-inline-block icon-dot"
                                    style="width: 25px; height: 25px;"></div>
                                {{??}}
                                <div class="rounded-circle bg-danger d-inline-block icon-dot"
                                    style="width: 25px; height: 25px;"></div>
                                {{?}}                                
                            </td>                            
                            <td class="text-start fw-bold">{{=d.e}}</td>
                            <td class="text-end">{{=d.c}}</td>
                            <td class="text-end">$ {{=numberDecimal.format( d.v )}}</td>
                            <td class="text-end">{{=d.p}}%</td>
                        </tr>
                        {{~}}                           
                    </tbody>
                </table>

                <style>
                    #tableResumenRegistros{
                        margin-top: 1rem !important;
                    }

                    .table-consolidado {
                        table-layout: fixed;
                        width: 480px;
                    }
                    .table-consolidado tr th {
                        font-size: 11px
                    }
                </style>
                
                <table id="tableResumenRegistros" class="table table-bordered table-sm table-consolidado">
                    <colgroup>
                        <col width="150"></col>
                        <col width="120"></col>
                        <col width="120"></col>
                    </colgroup>
                    <thead class="table-primary">
                        <tr>
                            <th class="text-center">Total Facturas</th>
                            <th class="text-center">Pendiente Soportes</th>
                            <th class="text-center">Soportes Generados</th>
                        </tr>
                    </thead>
                    <tbody>
                        {{~it.datailRegistro: d:id}}
                        <tr class="bg-table-row-1">                     
                            <td>{{=d.tf}}</td>
                            <td>{{=d.tsp}}</td>
                            <td>{{=d.tsg}}</td>
                        </tr>
                        {{~}}                           
                    </tbody>
                </table>
            `;

            const html = doT.template(template)({ detail: dataResumen, datailRegistro: dataResumenRegistros });
            const box1 = document.getElementById("box1");
            if (box1) {
                box1.innerHTML = html;
            } else {
                console.error("Contenedor no encontrado.");
            }
        };
        fxRenderChart();


    }
};


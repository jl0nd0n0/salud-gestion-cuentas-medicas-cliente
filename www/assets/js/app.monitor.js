/* eslint-disable quotes */
/* globals app, nata, doT, flatpickr, session, iconChart, iconProcess, Jets, echarts, nataUIDialog, axios, swal */

app.monitor = {
    index: function () {
        console.log("%c app.monitor.index", "background:red;color:#fff;font-size:11px");
        //const data = nata.localStorage.getItem("robot-armado-fecha" + session.fechaDashboard);
        const data = nata.localStorage.getItem("robot-armado-fecha");
        const dataResumen = nata.localStorage.getItem("robot-armado-resumen");
        const dataDetalle = data.detalles;
        console.log(dataDetalle);
        // let dataResumenOriginal = data.resumen;
        // let dataResumenRegistrosOriginal = data.resumenRegistros;

        function getTodayDate() {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        function calculateSummaryStats(detalle) {
            const grouped = {};
            detalle.forEach(item => {
                const key = item.f;
                if (!grouped[key]) {
                    grouped[key] = {
                        estado: item.radicarOK ? "Listas para radicar" : "Pendiente Soportes",
                        valor: parseFloat(item.v) || 0
                    };
                }
            });
            const statsArray = Object.values(grouped);
            const tsg = statsArray.filter(s => s.estado === "Listas para radicar").length;
            const tsp = statsArray.filter(s => s.estado === "Pendiente Soportes").length;
            const totalFacturas = tsg + tsp;
            const totalValor = statsArray.reduce((sum, s) => sum + s.valor, 0);
            const listasParaRadicarValor = statsArray
                .filter(s => s.estado === "Listas para radicar")
                .reduce((sum, s) => sum + s.valor, 0);
            const pendienteSoportesValor = statsArray
                .filter(s => s.estado === "Pendiente Soportes")
                .reduce((sum, s) => sum + s.valor, 0);
            const resumen = [
                {
                    e: "Listas para radicar",
                    c: tsg,
                    v: listasParaRadicarValor,
                    p: ((listasParaRadicarValor / totalValor) * 100).toFixed(2)
                },
                {
                    e: "Pendiente Soportes",
                    c: tsp,
                    v: pendienteSoportesValor,
                    p: ((pendienteSoportesValor / totalValor) * 100).toFixed(2)
                }
            ];
            const resumenRegistros = [{
                tf: totalFacturas,
                tsp: tsp,
                tsg: tsg
            }];
            return { resumen, resumenRegistros };
        }

        function filterDataByDate(dataDetalle, date) {
            const filteredDetalle = dataDetalle.filter(item => item.fe === date);
            const processedDetalle = filteredDetalle.map(item => ({
                ...item,
                radicarOK: item.d.every(dd => dd.ge !== "0")
            }));
            console.log(processedDetalle);
            const { resumen, resumenRegistros } = calculateSummaryStats(processedDetalle);
            return {
                detalle: processedDetalle,
                resumen,
                resumenRegistros
            };
        }

        const initialDate = getTodayDate();
        const initialFilteredData = filterDataByDate(dataDetalle, initialDate);
        let currentDetalle = initialFilteredData.detalle;
        session.data = currentDetalle;
        let i;
        for (i = 0; i < currentDetalle.length; i++) {
            console.log(currentDetalle[i].f);
        }

        let currentResumen = initialFilteredData.resumen;
        let currentResumenRegistros = initialFilteredData.resumenRegistros;
        let selectedDate = getTodayDate();

        let myChart = null;

        const templateLayout = `
            <div class="container-1 w-100 h-100 align-top my-4 ms-3">
                <div class="row d-inline-block col-izquierda h-100 v-align-top scroll-y">
                    <div class="card w-100">
                        <div class="card-header position-relative">
                            <div>
                                <div class="icon-title">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <title>chart-arc</title><path d="M16.18,19.6L14.17,16.12C15.15,15.4 15.83,14.28 15.97,13H20C19.83,15.76 18.35,18.16 16.18,19.6M13,7.03V3C17.3,3.26 20.74,6.7 21,11H16.97C16.74,8.91 15.09,7.26 13,7.03M7,12.5C7,13.14 7.13,13.75 7.38,14.3L3.9,16.31C3.32,15.16 3,13.87 3,12.5C3,7.97 6.54,4.27 11,4V8.03C8.75,8.28 7,10.18 7,12.5M11.5,21C8.53,21 5.92,19.5 4.4,17.18L7.88,15.17C8.7,16.28 10,17 11.5,17C12.14,17 12.75,16.87 13.3,16.62L15.31,20.1C14.16,20.68 12.87,21 11.5,21Z"></path></svg>
                                </div> Armado Cuentas Médicas - Consolidado
                            </div>
                        </div>
                        <div class="card-body ps-0">
                            <div id="table-placeholder"></div>
                        </div>
                    </div>

                    <div class="card w-100">
                        <div class="card-header position-relative">
                            <div>
                                <div class="icon-title">${iconChart}</div> Armado Cuentas Médicas - Diario
                            </div>
                            <div class="w-100 text-end">
                                <input id="datepicker" type="text" autocomplete="off" class="form-control d-inline-block max-width-200px control-highlight">
                            </div>
                        </div>
                        <div id="chart1" class="card-body min-width-400px min-height-400px p-0"></div>
                        <div id="box1" class="min-width-400px"></div>
                    </div>
                </div>
                <div id="box2" class="d-inline-block col-derecha h-100 ms-5"></div>
            </div>
        `;

        

        const container = document.getElementById("container");
        container.innerHTML = templateLayout;

        const renderMainTable = (filteredData) => {
            const tableTemplate = `
                <div class="card d-inline-block scroll-y width-100">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <div class="icon-title me-2">${iconProcess}</div>
                            <span>Control Armado Cuentas Médicas - Diario</span>
                        </div>

                        <div class="btn-group">
                            <button type="button" class="btn btn-primary dropdown-toggle btn-circle" data-bs-toggle="dropdown" aria-expanded="false">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                </svg>
                            </button>
                            <ul class="dropdown-menu no-select">
                                <li>
                                    <a class="dropdown-item" id="menuCuentasTodos">
                                        <div class="rounded-circle bg-dark d-inline-block icon-dot"></div>&nbsp;&nbsp;Ver todos
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item" id="menuCuentasSoportesPendientes">
                                        <div class="rounded-circle bg-danger d-inline-block icon-dot"></div>&nbsp;&nbsp;Cuentas con soportes pendientes
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item" id="menuCuentasRadicar">
                                        <div class="rounded-circle bg-success d-inline-block icon-dot"></div>&nbsp;&nbsp;Cuentas para radicar
                                    </a>
                                </li>

                                <li><hr class="dropdown-divider"></li>

                                <li><a class="dropdown-item" id="armado-radicar-facturas">Radicar Facturas</a></li>
                                <li><a class="dropdown-item" id="menuExcelRadicar">Descargar Excel Facturas radicar</a></li>
                                <li><a class="dropdown-item" id="menuExcelPreauditoria">Descargar Excel Preauditoria</a></li>
                                <li><a class="dropdown-item" id="menuExcelSoportesFaltantes">Descargar Excel Soportes faltantes</a></li>
                            </ul>
                        </div>
                    </div>

                    <div>
                        <span id="cuentas-badge" class="badge rounded-pill text-bg-primary position-relative min-width-100px">
                            <center><span id="cuentas-title">Total</span></center>
                            <span id="cuentas-cantidad" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">
                                {{=it.cantidad}}
                            <span class="visually-hidden">unread messages</span>
                        </span>
                    </div>
                    <div id="box2-table" class="card-body vh-100">
                        <input id="txtSearch" type="text" class="form-control input-search mb-3" 
                            placeholder="Buscar ..." autocomplete="off">
                        <div id="searchTarget" style="overflow-x:hidden; overflow-y: auto; height: 75vh;">
                            <style>
                                .table-robot-armado-cuenta {
                                    table-layout: fixed;
                                    width: 814px;
                                }
                                .table-robot-armado-cuenta-detail {
                                    table-layout: fixed;
                                    width: 814px;
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
                                <table class="table table-bordered table-sm table-robot-armado-cuenta
                                    {{? d.radicarOK}}cuenta-radicar{{??}}cuenta-no-radicar{{?}}">
                                    <colgroup>
                                        <col width="50"></col>
                                        <col width="100"></col>
                                        <col width="100"></col>
                                        <col width="100"></col>
                                        <col width="100"></col>
                                        <col width="364"></col>
                                    </colgroup>
                                    <thead class="table-primary">
                                        {{? d.sa == 1 }}
                                            <tr>
                                                <th class="tableColorRojo text-center">Radicar</th>
                                                <th class="tableColorRojo text-center">Factura</th>
                                                <th class="tableColorRojo text-center">Fecha</th>
                                                <th class="tableColorRojo text-center">Días Vencimiento</th>
                                                <th class="tableColorRojo text-center">Valor</th>
                                                <th class="tableColorRojo text-center">Paciente</th>
                                            </tr>
                                        {{??}}
                                            {{? d.sr == 1 }}
                                                <tr>
                                                    <th class="tableColorVerde text-center">Radicar</th>
                                                    <th class="tableColorVerde text-center">Factura</th>
                                                    <th class="tableColorVerde text-center">Fecha</th>
                                                    <th class="tableColorVerde text-center">Días Vencimiento</th>
                                                    <th class="tableColorVerde text-center">Valor</th>
                                                    <th class="tableColorVerde text-center">Paciente</th>
                                                </tr>
                                            {{??}}
                                                <tr>
                                                    <th class="text-center">Radicar</th>
                                                    <th class="text-center">Factura</th>
                                                    <th class="text-center">Fecha</th>
                                                    <th class="text-center">Días Vencimiento</th>
                                                    <th class="text-center">Valor</th>
                                                    <th class="text-center">Paciente</th>
                                                </tr>
                                            {{?}}
                                        {{?}}                                        
                                    </thead>
                                    <tbody>
                                        <tr class="bg-table-row-1">
                                            {{? d.sa == 1 }}
                                                <td class="text-center {{? !d.radicarOK }}bg-danger text-white{{?}} border-right-none">
                                                    <div class="rounded-circle d-inline-block" style="width: 14px; height: 14px; background-color: #f74260 !important;"></div>
                                                </td>
                                            {{??}}
                                                {{? d.sr == 1 }}
                                                    <td class="text-center border-right-none tableColorVerdeTd">
                                                        <div class="rounded-circle d-inline-block" style="width: 14px; height: 14px; background-color: #66BB6A;"></div>
                                                    </td>
                                                {{??}}
                                                    <td class="text-center border-right-none">
                                                        {{? d.radicarOK }}
                                                            <div class="rounded-circle bg-success d-inline-block icon-dot"></div>
                                                        {{??}}
                                                            <div class="rounded-circle bg-danger d-inline-block icon-dot"></div>
                                                        {{?}}
                                                    </td>
                                                {{?}}
                                            {{?}}
                                            {{? d.sa == 1 }}
                                                <td class="tableColorRojoTd text-start fw-bold">{{=d.f}}</td>
                                            {{??}}
                                                {{? d.sr == 1 }}
                                                    <td class="tableColorVerdeTd text-start fw-bold">{{=d.f}}</td>
                                                {{??}}
                                                    <td class="text-start fw-bold">{{=d.f}}</td>
                                                {{?}}
                                            {{?}}
                                            {{? d.sa == 1 }}
                                                <td class="tableColorRojoTd text-center">{{=d.fe}}</td>
                                            {{??}}
                                                {{? d.sr == 1 }}
                                                    <td class="tableColorVerdeTd text-center">{{=d.fe}}</td>
                                                {{??}}
                                                    <td class="text-center">{{=d.fe}}</td>
                                                {{?}}
                                            {{?}}
                                            {{? d.sa == 1 }}
                                                <td class="tableColorRojoTd text-center fw-bold"><span class="badge text-bg-danger">{{=d.dv}}</span></td>
                                            {{??}}
                                                {{? d.sr == 1 }}
                                                    <td class="tableColorVerdeTd text-center fw-bold"><span class="badge text-bg-success">{{=d.dv}}</span></td>
                                                {{??}}
                                                <td class="text-center fw-bold"><span class="badge text-bg-danger">{{=d.dv}}</span></td>
                                                {{?}} 
                                            {{?}}
                                            {{? d.sa == 1 }}
                                                <td style="background-color: #F8D7DA;" class="text-end">$ {{=numberDecimal.format( d.v )}}</td>
                                            {{??}}
                                                {{? d.sr == 1 }}
                                                    <td class="tableColorVerdeTd text-end">$ {{=numberDecimal.format( d.v )}}</td>
                                                {{??}}
                                                    <td class="text-end">$ {{=numberDecimal.format( d.v )}}</td>
                                                {{?}}
                                            {{?}}
                                            {{? d.sa == 1 }}
                                                <td style="background-color: #F8D7DA;" colspan="2" class="text-center">{{=d.p}}</td>
                                            {{??}}
                                                {{? d.sr == 1 }}
                                                    <td colspan="2" class=" tableColorVerdeTd text-center">{{=d.p}}</td>
                                                {{??}}
                                                    <td colspan="2" class="text-center">{{=d.p}}</td>
                                                {{?}}
                                            {{?}}
                                        </tr>                                
                                    </tbody>
                                </table>
                                {{
                                    console.log("******************************");
                                    let lista;
                                    if (d.radicarOK) { lista = 1 } else { lista = 0 }
                                    console.log(d.f, lista);
                                }}
                                {{? d.sa == 1 }}
                                    <table class="table table-bordered table-sm w-100">
                                          <td class="text-center py-1" style="background-color: #F8D7DA">
                                            <span class="badge text-bg-danger">Anulada</span>
                                        </td>
                                    </table>
                                {{??}}
                                    <table class="table table-bordered table-sm table-robot-armado-cuenta-detail 
                                        {{? d.radicarOK}}cuenta-radicar{{??}}cuenta-no-radicar{{?}}">
                                        <colgroup>
                                            <col width="254"></col>
                                            <col width="180"></col>
                                            <col width="80"></col>
                                            <col width="100"></col>
                                            <col width="200"></col>
                                        </colgroup>
                                        <thead class="table-primary">
                                            {{? d.sr == 1 }}
                                                <tr>
                                                    <th class="tableColorVerdeTh text-center">Grupo</th>
                                                    <th class="tableColorVerdeTh text-center">Soporte</th>
                                                    <th class="tableColorVerdeTh text-center">Armado</th>
                                                    <th class="tableColorVerdeTh text-center">Estado</th>
                                                    <th class="tableColorVerdeTh text-center">Descripción</th>
                                                </tr>
                                            {{??}}
                                                <tr>
                                                    <th class="text-center">Grupo</th>
                                                    <th class="text-center">Soporte</th>
                                                    <th class="text-center">Armado</th>
                                                    <th class="text-center">Estado</th>
                                                    <th class="text-center">Descripción</th>
                                                </tr>
                                            {{?}}

                                        </thead>
                                        {{~d.d: dd:idd}}
                                            {{? d.sr == 1 }}
                                            <tr {{? idd % 2 == 1}} class="tableColorVerdeTr bg-table-row-1"{{?}}>
                                                    <td class="tableColorVerdeTr text-start">{{=dd.g}}</td>
                                                    <td class=" tableColorVerdeTr text-start">
                                                        <span class="badge 
                                                            {{? dd.ge == "1"}}text-bg-success{{??}}text-bg-danger{{?}}">
                                                            {{=dd.s}}
                                                        </span>                                        
                                                    </td>
                                                    <td class="tableColorVerdeTr text-center">
                                                        <div class="rounded-circle d-inline-block" style="width: 14px; height: 14px; background-color: #66BB6A;"></div>
                                                    </td>
                                                    <td class=" tableColorVerdeTr text-center">
                                                        <div class="badge text-bg-success" >Radicado</div>
                                                    </td>
                                                    <td class="tableColorVerdeTr text-start">{{=dd.n}}</td>
                                                </tr>
                                            {{??}}
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
                                                    {{? d.sr == 1 }}                                            
                                                        <td class="badge text-bg-success text-center">Radicar</td>
                                                    {{??}}
                                                        <td class="text-start">{{=dd.o}}</td>
                                                    {{?}}
                                                    <td class="text-start">{{=dd.n}}</td>
                                                </tr>
                                            {{?}}
                                        {{~}}                                
                                    </table>
                                {{?}}
                            </div>
                            {{~}}
                        </div>
                    </div>
                </div>
            `;
            const html = doT.template(tableTemplate)({ detail: filteredData, cantidad: session.totalFactura || filteredData.length});
            const box2 = document.getElementById("box2");
            box2.innerHTML = html;

            if (session.jets) {
                session.jets.destroy();
            }

            session.jets = new Jets({
                searchTag: "#txtSearch",
                contentTag: "#searchTarget",
                rowSelector: ".search-group"
            });

            const buttonExcelRadicar = document.getElementById("menuExcelRadicar");

            buttonExcelRadicar.addEventListener("click", function(){
                console.log("menuExcelRadicar.click");

                axios.get(app.config.server.php1 + "x=cuentasMedicas&k=monitorRadicarExcel&ts=" + new Date().getTime())
                    .then(function(response){
                        console.log(response.data);

                        const file = app.config.server.path + response.data[0].file;

                        window.open(file, "_blank");
                    })
                    .catch(function(error){
                        console.error(error);
                    });
            });

            const buttonExcelPreauditoria = document.getElementById("menuExcelPreauditoria");

            buttonExcelPreauditoria.addEventListener("click", function(){
                console.log("menuExcelPreauditoria.click");

                axios.get(app.config.server.php1 + "x=cuentasMedicas&k=monitorPreauditoriaExcel&ts=" + new Date().getTime())
                    .then(function(response){
                        console.log(response.data);

                        const file = app.config.server.path + response.data[0].file;

                        window.open(file, "_blank");
                    })
                    .catch(function(error){
                        console.error(error);
                    });
            });

            const buttonExcelSoportesFaltantes = document.getElementById("menuExcelSoportesFaltantes");

            buttonExcelSoportesFaltantes.addEventListener("click", function(){
                console.log("menuExcelSoportesFaltantes.click");

                axios.get(app.config.server.php1 + "x=cuentasMedicas&k=monitorSoportesFaltantesExcel&ts=" + new Date().getTime())
                    .then(function(response){
                        console.log(response.data);

                        const file = app.config.server.path + response.data[0].file;

                        window.open(file, "_blank");
                    })
                    .catch(function(error){
                        console.error(error);
                    });
            });

            // const buttonSoportesFaltantes = document.getElementById("menuSoportesFaltantes");

            // buttonSoportesFaltantes.addEventListener("click", function () {
            //     console.log("%c buttonSoportesFaltantes.click", "background:red;color:#fff;font-size:11px");

            //     axios.get(app.config.server.php1 + "x=cuentasMedicas&k=monitorSoportesFaltantes&ts=" + new Date().getTime())
            //         .then(function(response){
            //             console.log(response.data);

            //             const data = response.data;

            //             const template = `
            //                 <div id="containerCatera" class="w-100">
            //                     <style>
            //                         #tableCartera {
            //                             table-layout: fixed;
            //                             width: 860px;
            //                             font-size: 16px
            //                         }
            //                     </style>
            //                     <div class="w-100">
            //                         <div class="mb-3">
            //                             <input type="text" id="filterInput" class="form-control" placeholder="Filtrar por numero factura, Soporte, fecha factura y observacíon">
            //                         </div>
            //                     <table id="tableCartera" class="table table-sm table-striped">
            //                             <colgroup>
            //                                 <col width="100"></col>
            //                                 <col width="200"></col>
            //                                 <col width="120"></col>
            //                                 <col width="120"></col>
            //                                 <col width="250"></col>
            //                                 <col width="80"></col>
            //                                 <col width="120"></col>
            //                             </colgroup>
            //                             <thead>
            //                                 <tr class="text-center">
            //                                     <th>Numero Factura</th>
            //                                     <th>Soporte</th>
            //                                     <th>Fecha Factura</th>
            //                                     <th>Fecha Desmaterializado</th>
            //                                     <th>Observación</th>
            //                                     <th>Días en proceso</th>
            //                                     <th>Valor</th>
            //                                 </tr>
            //                             </thead>
            //                             <tbody id="tableBody">
            //                                 {{~ it.detail: d:id}}
            //                                 <tr class="text-center">
            //                                     <td>
            //                                         <span class="badge rounded-pill text-bg-primary">{{=d.nf}}</span>
            //                                     </td>
            //                                     <td class="text-start">
            //                                         <span class="badge rounded-pill text-bg-danger">{{=d.s}}</span>
            //                                     </td>
            //                                     <td class="text-end">{{=d.f}}</td>
            //                                     <td class="text-end">{{=d.fd}}</td>
            //                                     <td class="text-start">{{=d.o}}</td>
            //                                     <td class="text-end">
            //                                         <span class="badge rounded-pill text-bg-danger pulse-red">{{=d.d}}</span>
            //                                     </td>
            //                                     <td class="text-end">
            //                                         <b>{{=numberDecimal.format(d.v)}}</b>
            //                                     </td>
            //                                 </tr>
            //                                 {{~}}
            //                                 <tr class="text-center">
            //                                     <td colspan="6" class="text-center">
            //                                         <b>TOTAL</b>
            //                                     </td>
            //                                     <td class="text-end">
            //                                         <b>{{=numberDecimal.format(it.total)}}</b>
            //                                     </td>
            //                                 </tr>
            //                             </tbody>
            //                         </table>

            //                     </div>
            //                 </div>
            //             `;
                        
            //             const html = doT.template(template)({ detail: data, total: data.sum("v") });
            //             new nataUIDialog({
            //                 html: html,
            //                 title: "Soportes Faltantes",
            //                 toolbar: `
            //                     <div class="btn-group">
            //                         <button type="button" class="btn btn-primary dropdown-toggle btn-circle" data-bs-toggle="dropdown" aria-expanded="false">
            //                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            //                                 <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
            //                             </svg>
            //                         </button>
            //                         <ul class="dropdown-menu">
            //                             <li><a class="dropdown-item" id="descargar-excel">Descargar Excel</a></li>
            //                         </ul>
            //                     </div>
            //                 `,
            //                 events: {
            //                     render: function () {                            
            //                         session.jets = new Jets({
            //                             searchTag: "#filterInput",
            //                             contentTag: "#tableCartera tbody"
            //                         });
            //                     },
            //                     close: function () {}
            //                 }
            //             });

                        
            //         })
            //         .catch(function(error){
            //             console.error(error);
            //         })

            //     console.log(data);
            // });

            document.querySelector("#armado-radicar-facturas").addEventListener("click", function() {
                console.log("armado-radicar-facturas.click");

                const processedData = dataDetalle.map(item => ({
                        ...item,
                        radicarOK: item.d.every(dd => dd.ge !== "0")
                }));

                const dataRadicar = processedData.filter(item => item.radicarOK);
                console.log(dataRadicar);

                let templateRadicar = `
                    <ul class="list-group mt-n3">
                        <div class="input-group input-group-sm mb-3">
                            <input id="txtFacturasRadicar" type="text" class="form-control w-1000 input-search" placeholder="Buscar ..." autocomplete="off">
                        </div>

                        <div class="form-check d-flex justify-content-between align-content-center">
                            <div>
                                <input type="checkbox" class="form-check-input" id="chk-seleccionar-primeros">
                                <label class="form-check-label" for="chk-seleccionar-primeros">
                                    Seleccionar primeros <span id="contador-seleccionados">0</span> registros
                                </label>
                            </div>

                            <div>
                                <button id="btn-limpiar-seleccion" class="btn btn-sm btn-outline-secondary mb-3">
                                    Limpiar
                                </button>
                            </div>
                        </div>
                        {{~it.detail: d:id}}
                        <li class="list-group-item">
                            <div class="form-check d-flex align-items-center justify-content-between">
                                <div class="d-flex align-items-center">
                                    <input class="form-check-input chk-soporte me-2" type="checkbox"
                                        value="{{=d.f}}" data-id="{{=d.f}}" id="chk-{{=d.f}}">
                                    <label class="factura-radicar form-check-label" for="chk-{{=d.f}}">
                                        {{=d.f}}
                                    </label>
                                </div>

                                <div class="badges-container">
                                    <small class="factura-radicar badge rounded-pill text-bg-success text-end" style="font-size: 0.75em;">
                                        $ {{=numberDecimal.format(d.v)}}
                                    </small>
                                    <small class="factura-radicar badge fecha rounded-pill text-bg-primary text-end" style="font-size: 0.75em;">
                                        {{=d.fe}}
                                    </small>
                                    
                                </div>
                            </div>
                        </li>
                        {{~}}
                    </ul>
                `;

                const html = doT.template(templateRadicar)({ detail: dataRadicar });

                new nataUIDialog({
                    html: html,
                    height: 400,
                    width: 500,
                    title: `Factura para radicar
                        &nbsp;&nbsp;
                            <button id="btn-guardar-seleccion" class="btn btn-sm btn-primary">
                                Guardar selección
                            </button>
                    `,
                    events: {
                        render: function () {
                            setTimeout(() => {
                                setupSearch();
                                setupCheckSeleccionarPrimeros();
                                setupSeleccionLimitada.init();
                                setupLimpiarSeleccion();
                                setupBotonGuardar();
                            }, 100);                        
                        },
                        close: function () {}
                    }
                });
            });

            const setupSearch = () => {
                const input = document.getElementById('txtFacturasRadicar');
                if (!input) return;

                input.addEventListener('input', function () {
                    const searchTerm = this.value.toLowerCase();

                    document.querySelectorAll('.list-group-item').forEach(li => {
                        const label = li.querySelector('.form-check-label')?.textContent.trim().toLowerCase() || '';
                        const fecha = li.querySelector('.fecha')?.textContent.trim().toLowerCase() || '';
                        const valor = li.querySelector('.badge-success')?.textContent.trim().toLowerCase() || '';

                        const textToSearch = `${label} ${fecha} ${valor}`;
                        li.style.display = textToSearch.includes(searchTerm) ? '' : 'none';
                    });

                    setupSeleccionLimitada.init();
                });
            };

            const setupCheckSeleccionarPrimeros = () => {
                const checkbox = document.getElementById('chk-seleccionar-primeros');
                if (!checkbox) return;

                checkbox.addEventListener('change', () => {
                    const itemsVisibles = Array.from(document.querySelectorAll('.list-group-item')).filter(li => li.style.display !== 'none');
                    const seleccionables = itemsVisibles.slice(0, 20);
                    const marcadosActuales = document.querySelectorAll('.chk-soporte:checked').length;

                    seleccionables.forEach((li, index) => {
                        if (index + marcadosActuales >= 20) return;
                        const chk = li.querySelector('.chk-soporte');
                        if (chk) chk.checked = checkbox.checked;
                    });

                    setupSeleccionLimitada.actualizarContador();
                });
            };

            const setupLimpiarSeleccion = () => {
                const btnLimpiar = document.getElementById('btn-limpiar-seleccion');
                if (!btnLimpiar) return;

                btnLimpiar.addEventListener('click', () => {
                    document.querySelectorAll('.chk-soporte').forEach(chk => {
                        chk.checked = false;
                    });
                    setupSeleccionLimitada.actualizarContador();
                });
            };

            const getFacturasSeleccionadas = () => {
                return Array.from(document.querySelectorAll('.chk-soporte:checked')).map(chk => {
                    const item = chk.closest('.list-group-item');
                    return {
                        f: item.querySelector('.form-check-label')?.textContent.trim()
                    };
                });
            };

            const setupBotonGuardar = () => {
                const btnGuardar = document.getElementById('btn-guardar-seleccion');
                if (!btnGuardar) return;

                btnGuardar.addEventListener('click', () => {
                    const seleccionadas = getFacturasSeleccionadas();

                    if (seleccionadas.length === 0) {
                        swal('Información', 'Por favor selecciona al menos una factura antes de guardar.', 'info');
                        return;
                    }

                    console.log('Facturas seleccionadas:', seleccionadas);

                    swal({
                        text: `¿Deseas generar el armado de las ${seleccionadas.length} seleccionadas?`,
                        icon: "warning",
                        buttons: ["NO, voy a revisar", "SI, Continuar"]
                    }).then((response) => {
                        if (response) {
                            document.getElementById("loader").style.display = "block";
                            axios.post(app.config.server.php1 + "x=cuentasMedicas&k=robotCuentasRadicar&ts=" + new Date().getTime(), seleccionadas)
                                .then(function(response){
                                    console.log(response.data);

                                    document.getElementById("loader").style.display = "none";

                                    const file = app.config.server.cdnPathBase + "homi/armado_radicar/" + response.data;
                                    console.log(file);
                                    window.open(file, "_blank");

                                    app.core.robot.message("Se ha generado el armado correctamente", 5);

                                    app.core.dialog.removeAll();
                                })
                                .catch(function(error){
                                    console.error(error);
                                });                            
                        }
                    });
                    
                });
            };

            const setupSeleccionLimitada = {
                actualizarContador() {
                    const totalMarcados = document.querySelectorAll('.chk-soporte:checked').length;
                    const contador = document.getElementById('contador-seleccionados');
                    const master = document.getElementById('chk-seleccionar-primeros');

                    if (contador) contador.textContent = totalMarcados;
                    if (master) {
                        master.checked = totalMarcados > 0;
                        master.indeterminate = totalMarcados > 0 && totalMarcados < 20;
                    }
                },

                init() {
                    const master = document.getElementById('chk-seleccionar-primeros');

                    document.querySelectorAll('.chk-soporte').forEach(chk => {
                        chk.addEventListener('change', () => {
                            const marcados = document.querySelectorAll('.chk-soporte:checked');
                            if (marcados.length > 20) {
                                chk.checked = false;
                                alert('Solo puedes seleccionar máximo 20 facturas.');
                            }
                            this.actualizarContador();
                        });
                    });

                    if (master) {
                        master.addEventListener('change', () => {
                            const itemsVisibles = Array.from(document.querySelectorAll('.list-group-item')).filter(li => li.style.display !== 'none');
                            const seleccionables = itemsVisibles.slice(0, 20);
                            const marcadosActuales = document.querySelectorAll('.chk-soporte:checked').length;

                            seleccionables.forEach((li, index) => {
                                if (index + marcadosActuales >= 20) return;
                                const chk = li.querySelector('.chk-soporte');
                                if (chk) chk.checked = master.checked;
                            });

                            this.actualizarContador();
                        });
                    }

                    this.actualizarContador();
                }
            };

            document.querySelector("#menuCuentasTodos").addEventListener("click", function() {
                console.log("%c menuCuentasTodos.click", "background:red;color:#fff;font-size:11px");

                const elements = document.querySelectorAll("table.table-robot-armado-cuenta");
                for (let i = 0; i < elements.length; i++) {
                    elements[i].style.display = "block";
                }

                const elements2 = document.querySelectorAll("table.table-robot-armado-cuenta-detail");
                for (let i = 0; i < elements2.length; i++) {
                    elements2[i].style.display = "block";
                }

                const cuentaCantidad = document.querySelector("#cuentas-cantidad");
                const cuentaTitle = document.querySelector("#cuentas-title");
                const cuentaBadge = document.querySelector("#cuentas-badge");

                cuentaCantidad.innerText = session.totalFactura;
                cuentaTitle.innerText = "Total";
                cuentaCantidad.classList.remove("text-bg-danger", "text-bg-success");
                cuentaCantidad.classList.add("bg-dark");

                cuentaBadge.classList.remove("text-bg-danger", "text-bg-success");
                cuentaBadge.classList.add("bg-dark");
            });

            document.querySelector("#menuCuentasSoportesPendientes").addEventListener("click", function() {
                console.log("%c buttonCuentasSoportesPendientes.click", "background:red;color:#fff;font-size:11px");

                const fxOcultarResto = function() {
                    const elements = document.querySelectorAll("table.cuenta-radicar");
                    let i;
                    for (i = 0; i < elements.length; i++) {
                        const element = elements[i];
                        element.style.display = "none";
                    }
                }
                
                const elements = document.querySelectorAll("table.cuenta-no-radicar");

                const cuentaCantidad = document.querySelector("#cuentas-cantidad");
                const cuentaTitle = document.querySelector("#cuentas-title");
                const cuentaBadge = document.querySelector("#cuentas-badge");

                cuentaCantidad.innerText = session.pendientesSoportes;
                cuentaTitle.innerText = "Pendiente Soportes";
                cuentaCantidad.classList.remove("bg-dark", "text-bg-success");
                cuentaCantidad.classList.add("text-bg-danger");

                cuentaBadge.classList.remove("bg-dark", "text-bg-success");
                cuentaBadge.classList.add("text-bg-danger");

                let i;
                for (i = 0; i < elements.length; i++) {
                    const element = elements[i];
                    element.style.display = "block";
                }
                fxOcultarResto()
            });

            document.querySelector("#menuCuentasRadicar").addEventListener("click", function() {
                console.log("%c menuCuentasRadicar.click", "background:red;color:#fff;font-size:11px");

                const fxOcultarResto = function() {
                    const elements = document.querySelectorAll("table.cuenta-no-radicar");
                    let i;
                    for (i = 0; i < elements.length; i++) {
                        const element = elements[i];
                        element.style.display = "none";
                    }
                }

                let elements = document.querySelectorAll("table.cuenta-radicar");

                const cuentaCantidad = document.querySelector("#cuentas-cantidad");
                const cuentaTitle = document.querySelector("#cuentas-title");
                const cuentaBadge = document.querySelector("#cuentas-badge");

                cuentaCantidad.innerText = session.radicar;
                cuentaTitle.innerText = "Listas para radicar";
                cuentaCantidad.classList.remove("bg-dark", "text-bg-danger");
                cuentaCantidad.classList.add("text-bg-success");

                cuentaBadge.classList.remove("bg-dark", "text-bg-danger");
                cuentaBadge.classList.add("text-bg-success");

                if (elements.length === 0) {
                    swal(app.config.title, "No hay cuentas para radicar", "info");
                    document.querySelector("#box2-table").visibility = "hidden";
                    fxOcultarResto();
                    return false
                }
                fxOcultarResto();

                elements = document.querySelectorAll("table.cuenta-radicar");
                let i;
                for (i = 0; i < elements.length; i++) {
                    const element = elements[i];
                    element.style.display = "block";
                }
            });
        };

        // Renderizar inicialmente
        renderMainTable(currentDetalle);

        // Inicializar datepicker
        flatpickr("#datepicker", {
            dateFormat: "Y-m-d",
            defaultDate: initialDate,
            minDate: new Date(2025, 4, 16),
            maxDate: new Date().toISOString().split("T")[0],
            locale: {
                firstDayOfWeek: 1,
                weekdays: {
                    shorthand: ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"],
                    longhand: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
                },
                months: {
                    shorthand: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
                    longhand: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
                }
            },
            onChange: function(selectedDates, selectedDate, instance) {
                console.log("onChange");
                console.log(selectedDates, selectedDate, instance);
                session.date = selectedDate;
                document.getElementById("datepicker").value = selectedDate;
                const filteredData = filterDataByDate(dataDetalle, selectedDate);
                currentDetalle = filteredData.detalle;
                session.data = currentDetalle;

                let i;
                for (i = 0; i < currentDetalle.length; i++) {
                    console.log(currentDetalle[i].f);
                }

                currentResumen = filteredData.resumen;
                currentResumenRegistros = filteredData.resumenRegistros;
                updateChartsAndSummary(filteredData.resumen, filteredData.resumenRegistros);

                renderMainTable(filteredData.detalle, true);
            }
        });

        document.getElementById("datepicker").value = initialDate;

        function updateChartsAndSummary(resumen, resumenRegistros) {
            console.log("%c updateChartsAndSummary", "background:red;color:#fff;font-size:11px");
            const chartContainer = document.getElementById('chart1');

            if (myChart && !myChart.isDisposed()) {
                myChart.dispose();
            }

            myChart = echarts.init(chartContainer);

            const chartData = resumen.map(item => ({
                value: parseFloat(item.v),
                name: item.e
            }));

            const option = {
                color: ['#C5E1A5', '#f8d7da'],
                tooltip: { trigger: 'item' },
                legend: { top: '5%', left: 'center' },
                series: [{
                    name: 'Facturas',
                    type: 'pie',
                    radius: ['45%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: { show: false },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 40,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: { show: false },
                    data: chartData
                }]
            };
            myChart.setOption(option, true);

            const summaryTemplate = `
                <style>
                    .table-consolidado { table-layout: fixed; width: 400px; }
                    .table-consolidado tr th { font-size: 11px }
                    .table-consolidado tr td { font-size: 11px }
                </style>
                <table class="table table-bordered table-sm table-consolidado mb-3">
                    <colgroup>
                        <col width="50">
                        <col width="125">
                        <col width="60">
                        <col width="105">
                        <col width="60">
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
                                <div class="rounded-circle bg-success d-inline-block icon-dot"></div>
                                {{??}}
                                <div class="rounded-circle bg-danger d-inline-block icon-dot"></div>
                                {{?}}                                
                            </td>                        
                            <td class="text-start fw-bold">{{=d.e}}</td>
                            <td class="text-end">{{=d.c}}</td>
                            <td class="text-end">$ {{=numberDecimal.format( d.v )}}</td>
                            <td class="text-end">{{=d.p}}%</td>
                        </tr>
                        {{~}}
                        <tr>
                            <td class="text-center fw-bold" colspan="2">
                                <b>Total</b>
                            </td>
                            <td class="text-end fw-bold">{{=it.detail.sum("c")}}</td>
                            <td class="text-end fw-bold">$ {{=numberDecimal.format( it.detail.sum("v") )}}</td>
                            <td class="text-end">{{=numberDecimal.format(it.detail.sum("p"))}}.00%</td>
                        </tr>
                    </tbody>
                </table>                
            `;
            const htmlSummary = doT.template(summaryTemplate)({
                detail: resumen,
                datailRegistro: resumenRegistros
            });

            resumen.forEach(estado => {
                console.log(estado.e);

                if(estado.e === "Pendiente Soportes"){
                    session.pendientesSoportes = estado.c;
                }

                if(estado.e === "Listas para radicar"){
                    session.radicar = estado.c;
                }
            });

            session.totalFactura = session.pendientesSoportes + session.radicar;

            const box1 = document.getElementById("box1");
            if (box1) {
                box1.innerHTML = "";
                box1.insertAdjacentHTML("afterbegin", htmlSummary);
            }

            app.monitor.consolidado.render();
        }

        updateChartsAndSummary(currentResumen, currentResumenRegistros);
    },

    consolidado: {
        render: function() {
            console.log("%c app.monitor.consolidado.render", "background:red;color:#fff;font-size:11px");
            const data = nata.localStorage.getItem("robot-armado-resumen");
            console.log(data);
            const template = `
                <style>
                    .table-consolidado { table-layout: fixed; width: 400px; }
                    .table-consolidado tr th { font-size: 11px }
                    .table-consolidado tr td { font-size: 11px }
                </style>
                <table class="table table-bordered table-resumen table-sm table-consolidado mb-3">
                    <colgroup>
                        <col width="50">
                        <col width="125">
                        <col width="60">
                        <col width="105">
                        <col width="60">
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
                                <div class="rounded-circle bg-success d-inline-block icon-dot"></div>
                                {{??}}
                                <div class="rounded-circle bg-danger d-inline-block icon-dot"></div>
                                {{?}}                                
                            </td>                        
                            <td class="text-start fw-bold">{{=d.e}}</td>
                            <td class="text-end">{{=d.cf}}</td>
                            <td class="text-end">$ {{=numberDecimal.format( d.vt )}}</td>
                            <td class="text-end">{{=d.p}}%</td>
                        </tr>
                        {{~}}
                        <tr>
                            <td class="text-center fw-bold" colspan="2">
                                <b>Total</b>
                            </td>
                            <td class="text-end fw-bold">{{=it.detail.sum("cf")}}</td>
                            <td class="text-end fw-bold">$ {{=numberDecimal.format( it.detail.sum("vt") )}}</td>
                            <td class="text-end">{{=it.detail.reduce((a,b) => a + +b.p, 0).toFixed(2)}}%</td>
                        </tr>
                    </tbody>
                </table>                
            `;
            
            const html = doT.template(template)({
                detail: data
            });

            document.getElementById("table-placeholder").innerHTML = html;
            
        }
    }
};
/* globals app, nata, alasql, nataUIDialog, swal, doT, echarts, flatpickr, axios, numberDecimal, tippy */

app.auditoria = {
    control: {
        index : function (year, month) {
            console.trace("%c app.auditoria.control.index", "background:red;color:#fff;font-size:11px");

            const data = nata.localStorage.getItem("control-auditoria");
            console.log(data);

            // axios.get(app.config.server.php1 + "x=auditoria&y=validarFacturaDetalle&ts=" + (new Date).getTime())
            //     .then(function(response) {
            //         console.log(response.data);

            //         sessionStorage.setItem("auditoria-factura-detalle", JSON.stringify(response.data));
            //     })
            //     .catch(function(error) {
            //         console.error(error);
            //     });


            // const currentMonth = new Date().getMonth() + 1;

            // let options = "";
            // for (let i = 1; i <= 12; ++i) {
            //     options += `<option value="${i}" ${i === currentMonth ? "selected" : ""}>MES GESTION ${i}</option>`;
            // }

            let template = `
                <div class="conta scroll-y">
                    <div id="resultados"></div>
                </div>
            `;

            let html = doT.template(template)();

            new nataUIDialog({
                html: html,
                title: `Control Auditoria - Año ${year}`,
                toolbar: `
                    <div class="btn-group">
                        <button type="button" class="btn btn-primary dropdown-toggle btn-circle" data-bs-toggle="dropdown" aria-expanded="false">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                            </svg>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" id="validar-factura-detalle">Validar Factura Detalle</a></li>
                        </ul>
                    </div>
                `,
            });     
            
            document.querySelector("#validar-factura-detalle").addEventListener("click", function() {
                console.log("validar-factura-detalle.click");
            
                const rawData = sessionStorage.getItem("auditoria-factura-detalle");
                let dataFactura;

                if (rawData) {
                    dataFactura = JSON.parse(rawData);
                }
                console.log(dataFactura);
            
                // const selectedMonth = parseInt(document.querySelector("#selectMes").value, 10);
            
                const filteredDataMonth = dataFactura.filter(item => {
                    const itemDate = new Date(item.fa);
                    return itemDate.getMonth() + 1 === Number(month); 
                });
            
                console.log(filteredDataMonth);

                const options = {
                    id: "tableFacturaDetalle",
                    columns: [
                        {
                            title: "Numero Factura",
                            width: "250",
                            prop: "nf",
                            class: "text-center"
                        }
                    ],
                    data: filteredDataMonth
                };

                nata.sessionStorage.setItem("widget", options);

                const optionsDialog = {
                    height: 650,
                    width: 950,
                    html: `
                        <div class="d-flex justify-content-evenly align-items-center" style="height: 100%;">
                            <div style="flex: 1; max-height: 100%; overflow-y: auto; padding: 10px;">
                                <nata-ui-table></nata-ui-table>
                            </div>
                            <nata-ui-upload
                                data-title="Subir detalles de factura"
                                data-subtitle="Solo archivos con extensión zip"
                                data-accept=".zip"
                                data-url="https://homi.artemisaips.com/server/php/index.php?x=upload&y=fileZipDataUpdate_v1"
                                data-etl=""
                                data-consola=1
                                style="margin-left: 20px;"
                            ></nata-ui-upload>
                        </div>
                    `,
                    title: `
                        Artemisa - Control de Auditoria 
                        <span class="badge rounded-pill text-bg-danger">${filteredDataMonth.length}</span>
                    `,
                    events: {
                        render: function () { },
                        close: function () { }
                    }
                };
                new nataUIDialog(optionsDialog);
            });

            const selectElement = document.getElementById("selectMes");
            const resultadosContainer = document.getElementById("resultados");

            function handleMonthChange(selectedValue) {
                console.log(selectedValue);
                let selectedMonth = parseInt(selectedValue);
                let filter = data.filter(function(record) {
                    return parseInt(record.mf) === selectedMonth; 
                });
                console.log(filter);

                if (filter.length === 0) {
                    resultadosContainer.innerHTML = "";
                
                    swal({
                        title: "Informacion",
                        text: `Para el mes ${selectedValue} no se tienen datos`,
                        icon: "info",
                        confirmButtonText: "Aceptar"
                    }).then(() => {
                        selectElement.value = currentMonth;
                    });
                } else {
                    let sql = `
                        SELECT 
                            r,
                            SUM(tapv::NUMBER) AS cp,
                            SUM(tag::NUMBER) AS cg,
                            SUM(ig::NUMBER) AS ig,
                            SUM(ifpv::NUMBER) AS ifpv,
                            sum(va::NUMBER) AS va,
                            sum(vg::NUMBER) AS vg
                        FROM ?
                        GROUP BY r
                    `;
                    const totalAuditor = alasql(sql, [filter]);
                    console.log(totalAuditor);
                
                    const templateInformacion = `
                        <style>                
                            .value-text {
                                font-size: 2rem;
                                font-weight: bold;
                                color: #007bff;
                            }
                            .text-muted .value-text {
                                color: #6c757d;
                            }
                        </style>
                        <br>
                        <div class="row">
                            <div class="list col">
                                {{~it.detail :d:id}}
                                <div class="row align-items-center border-bottom pb-2 mb-3">
                                    <div class="row">
                                        <div class="col text-center p-0 fw-bold"></div>
                                        <div class="col text-center fw-bold">Facturas Primera Vez</div>
                                        <div class="col text-center fw-bold">Items Glosa</div>
                                        <div class="col text-center fw-bold"></div>
                                    </div>
                                    
                                    <div class="row align-items-center">
                                        <div class="col text-bg-primary rounded-pill text-center p-0">{{=d.r}}</div>
                                        
                                        <div class="col text-center">
                                            <span class="value-text" data-tippy-content="Ítems: {{=d.ifpv}}<br> Valor: \${{=numberDecimal.format(d.va)}}">{{=d.cp}}</span>
                                        </div>
                                        
                                        <div class="col text-center text-muted">
                                            <span class="value-text" data-tippy-content="Ítems: {{=d.ig}}<br> Valor: \${{=numberDecimal.format(d.vg)}}">{{=d.cg}}</span>
                                        </div>
                                        
                                        <div class="col text-center button-container btn-detalle-auditoria" id="{{=d.r}}">
                                            <button data-id="{{=d.r}}" type="button" class="btn btn-primary btn-sm plan-badge">Ver Detalle</button>
                                        </div>
                                    </div>
                                </div>
                                {{~}}
                            </div>
                            <div class="graphic col">
                                <div class="d-flex justify-content-center mb-3">
                                    <button id="btn-cp2" class="btn btn-outline-primary me-2">Ver Facturas de Primera Vez</button>
                                    <button id="btn-cg2" class="btn btn-outline-secondary">Ver Facturas de Glosa</button>
                                </div>
                                <div id="responsable-chart" style="width: 100%; height: 450px;"></div>
                            </div>
                        </div>
                    `;

                    let html2 = doT.template(templateInformacion)({ detail: totalAuditor });
                    resultadosContainer.innerHTML = html2;

                    tippy('.value-text', {
                        placement: 'top',
                        animation: 'shift-away',
                        arrow: true,
                        allowHTML: true,
                        theme: 'light',
                    });
                    
                    function initGlobalChart(type = "cp") {
                        const chartDom = document.getElementById("responsable-chart");
                        const myChart = echarts.init(chartDom);

                        const groupedData = totalAuditor.reduce((acc, record) => {
                            if (!acc[record.r]) {
                                acc[record.r] = { cp: 0, cg: 0 };
                            }
                            acc[record.r].cp += record.cp;
                            acc[record.r].cg += record.cg;
                            return acc;
                        }, {});

                        const dataForChart = Object.entries(groupedData).map(([responsable, values]) => ({
                            name: responsable,
                            value: values[type],
                        }));

                        const option = {
                            title: {
                                text: `Resumen de ${type === "cp" ? "Facturas Primera Vez" : "Facturas Glosa"} por Responsable`,
                                left: "center",
                                top: 20,
                                textStyle: {
                                    fontSize: 16,
                                },
                            },
                            tooltip: {
                                trigger: "item",
                                formatter: "{a} <br/>{b}: {c} ({d}%)",
                            },
                            legend: {
                                top: "20%",
                                left: "center",
                            },
                            series: [
                                {
                                    name: type === "cp" ? "Facturas Primera Vez" : "Facturas Glosa",
                                    type: "pie",
                                    top: "20%",
                                    emphasis: {
                                        itemStyle: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 2,
                                            shadowColor: "rgba(0, 0, 0, 0.5)",
                                        },
                                    },
                                    label: {
                                        fontSize: 16,
                                    },
                                    data: dataForChart,
                                },
                            ],
                        };

                        option && myChart.setOption(option);
                    }

                    initGlobalChart();

                    document.getElementById("btn-cp2").addEventListener("click", () => initGlobalChart("cp"));
                    document.getElementById("btn-cg2").addEventListener("click", () => initGlobalChart("cg"));

                   
                    document.querySelectorAll(".plan-badge").forEach(button => {
                        button.addEventListener("click", function() {
                            console.log("plan-badge.click");
                            
                            const id = this.getAttribute("data-id");

                            let dataResponsable = filter.filter(function(record) {                                                        
                                return record.r === id;
                            });
                    
                            console.log(dataResponsable);
                    
                            let html = `
                                <div class="row justify-content-md-center">
                                    <div class="col-6">
                                        <div id="calendar-container"></div>
                                        <br>
                                        <div id="info-container" style="margin-top: 10px;">
                                            <p class="text-muted">Selecciona una fecha para ver la información</p>
                                        </div>
                                        <div class="custom-tooltip" id="custom-tooltip"></div>
                                    </div>
                                    <div class="col-6">
                                        <div id="dona-chart" style="width: 100%; height: 450px;"></div>
                                    </div>
                                </div>
                            `;
                            
                            new nataUIDialog({
                                html: html,
                                title: `
                                    Control Auditoria &nbsp;&nbsp; 
                                    <span class="badge rounded-pill text-bg-primary">
                                        ${id}
                                    </span>
                                `,
                                events: {
                                    render: function () {

                                        const chartDom = document.getElementById("dona-chart");
                                        const myChart = echarts.init(chartDom);

                                        function updateChartWithDates(startDate, endDate) {
                                            const filteredData = dataResponsable.filter(record => {
                                                const recordDate = new Date(record.fa);
                                                return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
                                            });                                            
                                            console.log(filteredData);
                                            
                                            const groupedTableData = filteredData.reduce((acc, record) => {
                                                const recordDate = new Date(record.fa).toISOString().split('T')[0];
                                                const key = `${recordDate}_${record.r}`;
                                                
                                                if (!acc[key]) {
                                                    acc[key] = { 
                                                        tapv: 0, 
                                                        tag: 0, 
                                                        ig: 0, 
                                                        ifpv: 0,
                                                        date: recordDate, 
                                                        responsable: record.r,
                                                        va: 0,
                                                        vg: 0
                                                    };
                                                }
                                                acc[key].tapv += Number(record.tapv) || 0;
                                                acc[key].tag += Number(record.tag) || 0;
                                                acc[key].ig += Number(record.ig) || 0;
                                                acc[key].ifpv += Number(record.ifpv) || 0;
                                                acc[key].va += Number(record.va) || 0;
                                                acc[key].vg += Number(record.vg) || 0;
                                                return acc;
                                            }, {});                                            
                                            console.log(groupedTableData);
                                            
                                            const totalData = filteredData.reduce((acc, record) => {
                                                if (!acc[record.r]) {
                                                    acc[record.r] = { tapv: 0, tag: 0, ig: 0, va: 0, vg: 0 };
                                                }
                                                acc[record.r].tapv += Number(record.tapv) || 0;
                                                acc[record.r].tag += Number(record.tag) || 0;
                                                acc[record.r].ig += Number(record.ig) || 0;
                                                acc[record.r].va += Number(record.va) || 0;
                                                acc[record.r].vg += Number(record.vg) || 0;
                                                return acc;
                                            }, {});
                                            
                                            const dataForChart = [];
                                            let tableHTML = `
                                                <table class="table table-sm table-bordered mt-3">
                                                    <thead>
                                                        <tr>
                                                            <th>Fecha</th>
                                                            <th>Responsable</th>
                                                            <th>Facturas Primera Vez</th>
                                                            <th>Valor Auditado Primera Vez</th>
                                                            <th>Facturas Glosa</th>
                                                            <th>Ítems Glosa</th>
                                                            <th>Valor Auditado Glosa</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                            `;
                                            
                                            for (const [key, values] of Object.entries(groupedTableData)) {
                                                tableHTML += `
                                                    <tr>
                                                        <td>${values.date}</td>
                                                        <td>${values.responsable}</td>
                                                        <td class="text-end"><span class="badge rounded-pill text-bg-primary">${values.tapv}</span></td>
                                                        <td class="text-end"><span class="badge rounded-pill text-bg-primary">${values.ifpv}</span></td>
                                                        <td class="text-end"><span class="badge rounded-pill text-bg-primary">${numberDecimal.format(values.va)}</span></td>
                                                        <td class="text-end"><span class="badge rounded-pill text-bg-success">${values.tag}</span></td>
                                                        <td class="text-end"><span class="badge rounded-pill text-bg-success">${values.ig}</span></td>
                                                        <td class="text-end"><span class="badge rounded-pill text-bg-success">${numberDecimal.format(values.vg)}</span></td>
                                                    </tr>
                                                `;
                                            }
                                            
                                            tableHTML += `
                                                </tbody>
                                                </table>
                                            `;
                                            
                                            const infoContainer = document.getElementById("info-container");
                                            infoContainer.innerHTML = tableHTML;
                                            
                                            // Solo incluir tapv y tag en el gráfico
                                            const totalTapv = Object.values(totalData).reduce((sum, values) => sum + values.tapv, 0);
                                            const totalTag = Object.values(totalData).reduce((sum, values) => sum + values.tag, 0);
                                        
                                            dataForChart.push(
                                                { name: 'Total Facturas Primera Vez', value: totalTapv },
                                                { name: 'Total Facturas Glosa', value: totalTag }
                                            );
                                        
                                            const option = {
                                                title: {
                                                    text: "Datos Filtrados por Fecha",
                                                    left: "center",
                                                },
                                                tooltip: {
                                                    trigger: "item",
                                                    formatter: "{a} <br/>{b}: {c} ({d}%)",
                                                },
                                                legend: {
                                                    top: "10%",
                                                    left: "center",
                                                },
                                                series: [
                                                    {
                                                        name: "Indicadores",
                                                        type: "pie",
                                                        radius: "50%",
                                                        data: dataForChart,
                                                        emphasis: {
                                                            itemStyle: {
                                                                shadowBlur: 10,
                                                                shadowOffsetX: 0,
                                                                shadowColor: "rgba(0, 0, 0, 0.5)",
                                                            },
                                                        },
                                                    },
                                                ],
                                            };
                                            
                                            myChart.setOption(option);
                                        }
                                        
                                        // const currentYear = new Date().getFullYear();
                                        const firstDayOfSelectedMonth = new Date(year, selectedMonth - 1, 1);

                                        flatpickr("#calendar-container", {
                                            inline: true,
                                            mode: "range",
                                            dateFormat: "Y-m-d",
                                            allowInput: true,
                                            maxDate: "today",
                                            locale: {
                                                firstDayOfWeek: 1,
                                                weekdays: {
                                                    shorthand: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
                                                    longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
                                                },
                                                months: {
                                                    shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                                                    longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
                                                },
                                            },
                                            defaultDate: [firstDayOfSelectedMonth],
                                            enable: [
                                                function(date) {
                                                    const firstDayOfMonth = new Date(firstDayOfSelectedMonth.getFullYear(), firstDayOfSelectedMonth.getMonth(), 1);
                                                    const lastDayOfMonth = new Date(firstDayOfSelectedMonth.getFullYear(), firstDayOfSelectedMonth.getMonth() + 1, 0);
                                                    
                                                    return date >= firstDayOfMonth && date <= lastDayOfMonth;
                                                }
                                            ],
                                            monthSelectorType: "static",
                                            nextArrow: "",
                                            prevArrow: "",
                                            onChange: function (selectedDates) {
                                                if (selectedDates.length === 2) {
                                                    const startDate = selectedDates[0].toISOString().split("T")[0];
                                                    const endDate = selectedDates[1].toISOString().split("T")[0];

                                                    updateChartWithDates(startDate, endDate);
                                                }
                                            },
                                        });                                        
                                    },
                                    close: function () {}
                                }
                            });
                        });
                    });
                    
                    // function animateProgressBar(id, value, maxValue) {
                    //     const progressBar = document.getElementById(id);
                    //     let start = 0;
                    //     const end = Math.min((value / maxValue) * 100, 100);
                    //     const increment = end > 0 ? (end / 100) : 0; 
                    //     const speed = 10;
                    
                    //     const interval = setInterval(() => {
                    //         if (start >= end) {
                    //             clearInterval(interval);
                    //             progressBar.style.width = end + "%";
                    //             progressBar.textContent = Math.round(end) + "%";
                    //         } else {
                    //             start += increment;
                    //             progressBar.style.width = start + "%";
                    //             progressBar.textContent = Math.round(start) + "%";
                    //         }
                    //     }, speed);
                    // }
                    
                    // function setupTooltip() {
                    //     const tooltip = document.getElementById("custom-tooltip");
                    
                    //     document.querySelectorAll(".hover-target").forEach(item => {
                    //         item.addEventListener("mouseover", function(event) {
                    //             tooltip.style.display = "block";
                    //             const customMessage = this.getAttribute("data-tooltip"); // Obtiene el mensaje personalizado
                    //             tooltip.textContent = customMessage; // Muestra el mensaje
                    //             tooltip.style.top = event.pageY + "px";
                    //             tooltip.style.left = event.pageX + "px";
                    //         });
                    
                    //         item.addEventListener("mousemove", function(event) {
                    //             tooltip.style.top = event.pageY + "px";
                    //             tooltip.style.left = event.pageX + "px";
                    //         });
                    
                    //         item.addEventListener("mouseout", function() {
                    //             tooltip.style.display = "none";
                    //         });
                    //     });
                    // }
                    
                }
                
            }
            handleMonthChange(month);

            setTimeout(() => {
                if (selectElement) {
                    selectElement.addEventListener("change", (event) => {
                        let selectedValue = event.target.value;
                        handleMonthChange(selectedValue);
                    });
                }
            }, 100);
        },
        index_v1: function () {
            console.trace("%c app.auditoria.control.index_v1", "background:red;color:#fff;font-size:11px");
        
            const data = nata.localStorage.getItem("control-auditoria");
            console.log(data);
        
            // sessionStorage.removeItem("auditoria-factura-detalle");

            axios.get(`${app.config.server.php1}x=auditoria&y=validarFacturaDetalle&ts=${Date.now()}`)
                .then(response => {
                    console.log(response.data);
                    sessionStorage.setItem("auditoria-factura-detalle", JSON.stringify(response.data));
                })
                .catch(error => console.error(error));
        
            const dataFacturaDetalle = JSON.parse(sessionStorage.getItem("auditoria-factura-detalle") || "[]");
        
            const strSQL = `
                SELECT
                    month(fa) AS mf,
                    year(fa) AS yf,
                    sum(va::NUMBER) AS va,
                    sum(vg::NUMBER) AS vg,
                    sum(tapv::NUMBER) AS cp,
                    sum(tag::NUMBER) AS cg,
                    sum(ig::NUMBER) AS ig,
                    sum(ifpv::NUMBER) AS ifpv
                FROM ?
                GROUP BY month(fa), year(fa);
            `;
            const oData = alasql(strSQL, [data]);
            console.log(oData);
        
            const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            const homologatedData = oData.map(row => ({ ...row, mfh: monthNames[row.mf - 1] }));
            console.log(homologatedData);
        
            let yf = new Date().getFullYear();

            const availableYears = [...new Set(homologatedData.map(d => d.yf))];
            yf = availableYears.includes(yf) ? yf : availableYears[0]; 

            function renderCard(year) {
                const filteredData = homologatedData.filter(d => d.yf === year);

                const dataFacturaDetalleYear = dataFacturaDetalle.filter(d => new Date(d.fa).getFullYear() === year);

                const template = `
                    <style>
                        .value-text { font-size: 2rem; font-weight: bold; color: #007bff; }
                        .text-muted .value-text { color: #6c757d; }
                    </style>
                    <br>
                    <div class="row">
                        <div class="list col">
                            <div class="year-control text-center mb-3">
                                <label for="year-select" class="fw-bold">Seleccione el Año:</label>
                                <select id="year-select" class="form-select d-inline w-auto mx-2 text-center">
                                    ${availableYears.map(y => `<option value="${y}" ${y === year ? "selected" : ""}>${y}</option>`).join("")}
                                </select>
                            </div>
                            ${dataFacturaDetalleYear.length > 0 ? `<div class="alert alert-info">Hay ${dataFacturaDetalleYear.length} facturas sin cargar el detalle. Esto puede afectar el informe.</div>` : ""}
                            <div class="row align-items-center">
                                {{~it.detail :d}}
                                <div class="col-4">
                                    <div class="card text-center mb-3">
                                        <div class="card-body">
                                            <h5 class="card-title text-bg-primary rounded-pill">{{=d.mfh}}</h5>
                                            <div class="row align-items-center">
                                                <label class="fw-bold">Facturas Primera Vez</label>
                                                <span class="value-text" data-tippy-content="Ítems: {{=d.ifpv}}<br> Valor: \${{=numberDecimal.format(d.va)}}">{{=d.cp}}</span>
                                            </div>
                                            <div class="row align-items-center">
                                                <label class="fw-bold">Facturas Glosa</label>
                                                <span class="value-text" data-tippy-content="Ítems: {{=d.ig}}<br> Valor: \${{=numberDecimal.format(d.vg)}}">{{=d.cg}}</span>
                                            </div>
                                            <a href="javascript:void(0)" data-year=${year} data-month={{=d.mf}} class="btn btn-sm btn-primary btn-ver-detalle">Ver Detalle</a>
                                        </div>
                                    </div>
                                </div>
                                {{~}}
                            </div>
                        </div>
                        <div class="graphic col">
                            <div class="d-flex justify-content-center mb-3">
                                <button id="btn-cp" class="btn btn-outline-primary me-2">Facturas de Primera Vez</button>
                                <button id="btn-ig" class="btn btn-outline-secondary">Facturas de Glosas</button>
                            </div>
                            <div id="global-chart" style="width: 100%; height: 450px;"></div>
                        </div>
                    </div>
                `;
                const html = doT.template(template)({ detail: filteredData });

                new nataUIDialog({
                    html,
                    title: `Control Auditoria - Año ${year}`,
                    events: {
                        render: () => {
                            tippy('.value-text', { placement: 'top', animation: 'shift-away', arrow: true, allowHTML: true });
                        },
                    },
                });

                document.getElementById('year-select').addEventListener('change', (e) => {
                    yf = parseInt(e.target.value, 10);
                    app.core.dialog.removeAll();
                    renderCard(yf);
                    initGlobalChart("cp");
                });

                document.querySelectorAll('.btn-ver-detalle').forEach(button => {
                    button.addEventListener('click', function() {
                        const year = this.getAttribute('data-year');
                        const month = this.getAttribute('data-month');
                        app.auditoria.control.index(year, month);
                    });
                });

                document.getElementById("btn-cp").onclick = () => initGlobalChart("cp");
                document.getElementById("btn-ig").onclick = () => initGlobalChart("cg");

                initGlobalChart("cp");
            }

            function initGlobalChart(type = "cp") {
                const chartDom = document.getElementById("global-chart");
                const myChart = echarts.init(chartDom);

                const filteredData = homologatedData.filter(d => d.yf === yf);
                const chartData = filteredData.map(row => ({
                    name: row.mfh,
                    value: type === "cp" ? row.cp : row.cg,
                }));

                myChart.setOption({
                    title: {
                        text: `Participación Mensual (${type === "cp" ? "Facturas Primera Vez" : "Facturas Glosa"})`,
                        left: "center",
                        textStyle: { fontSize: 16 },
                    },
                    tooltip: {
                        trigger: "item",
                        formatter: params => {
                            const item = filteredData.find(row => row.mfh === params.name);
                            const extraData = type === "cp" ? item.ifpv : item.ig;
                            return `${params.name}: ${params.value} (${params.percent}%)<br>Ítems: ${extraData}`;
                        },
                    },
                    series: [{
                        name: `Participación (${type === "cp" ? "Facturas Primera Vez" : "Facturas Glosa"})`,
                        type: "pie",
                        radius: "50%",
                        data: chartData,
                        emphasis: {
                            itemStyle: { shadowBlur: 10, shadowOffsetX: 2, shadowColor: "rgba(0, 0, 0, 0.5)" },
                        },
                        label: { fontSize: 14, formatter: "{b}: {c}" },
                    }],
                });
            }

            renderCard(yf);

        }        
    }
};

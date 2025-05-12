/* eslint-disable indent */
/* globals app, doT, nataUIList, nata, alasql, nataUIDialog, session, swal, session, axios, dataSend */

app.cartera = {

    soat: {
        furips: {
            generar: function () {
                console.log("%c app.cartera.soat.furips.generar ", "background:red;color:#fff;font-size:11px");
                // ajax
                axios.get(app.config.server.php1 + "cartera/circular30EstadoPeriodoGet/" + dataSend.ie + "?ts=" + (new Date).getTime())
                    .then((function (response) {
                        console.log(response.data);

                        /*
                        new nataUIDialog({
                            html: "<div id='containerDetalleCartera'></div>",
                            title: "Gestión Cartera Pendiente por Estado",
                            events: {
                                render: function () {},
                                close: function () {},
                            },
                        });

                        const templateLayout = `
                            {{? it.search}}
                            <header class="d-inline-block w-100">
                                <div class="input-group flex-nowrap">
                                    <span class="input-group-text" id="addon-wrapping">
                                        <img src="assets/images/icons/search.svg" alt="">
                                    </span>
                                    <input id="txtSearchLayout-{{=it.id}}" type="text" class="form-control input-search" placeholder="Buscar ..." aria-label="Buscar"
                                        aria-describedby="addon-wrapping">
                                    <button id="buttonSearchClear-{{=it.id}}" type="button" class="btn btn-primary button-search-clear">
                                        <img src="assets/images/icons/close-circle-white.svg" alt="">
                                    </button>
                                </div>
                            </header>
                            {{?}}
                            <style>
                                table.table-cartera-detalle {
                                    table-layout: fixed;
                                    width: 1080px;
                                }
                            </style>
                            <div id="scroll-{{=it.id}}" class="clusterize-scroll">
                                <table class="table table-sm table-cartera-detalle table-striped">
                                    <colgroup>
                                        <col width="120"></col>
                                        <col width="140"></col>
                                        <col width="140"></col>
                                        <col width="140"></col>
                                        <col width="250"></col>
                                        <col width="100"></col>
                                        <col width="100"></col>
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>Número Factura</th>
                                            <th>Fecha Factura</th>
                                            <th>Fecha Radicado</th>
                                            <th>Nit Asegurador</th>
                                            <th>Asegurador</th>
                                            <th>Estado Factura</th>
                                            <th>Saldo</th>
                                        </tr>
                                    </thead>
                                    <tbody id="{{=it.id}}"></tbody>
                                </table>
                            </div>
                        `;

                        const templateRender = `
                            <tr>
                                <td>{{=it.f}}</td>
                                <td class="text-end">{{=it.ff}}</td>
                                <td class="text-end">{{=it.fr}}</td>
                                <td class="text-end">{{=it.n}}</td>
                                <td>{{=it.ta}}</td>
                                <td>{{=it.ef}}</td>
                                <td class="text-end">{{=numberDecimal.format(it.s)}}</td>
                            </tr>
                        `;

                        const oConfig = {
                            element: element,
                            fieldsFilter: ["f", "ff", "fr", "n", "ta", "ef", "s"], // TODO: aqui van los atributos del json si se filtra o busca
                            templateLayout: templateLayout,
                            templateRender: templateRender,
                            search: true,
                        };
                        const index = "cartera-detalle";
                        console.log(data);
                        alert("paso 01");
                        new nataUIList({}, oConfig, {}, index, response.data);
                        //oNataUDList.init();
                        */

                    })).catch((function (error) {
                        console.error(error);
                    }));

            }
        },

        glosa: {
            adres: {
                aseguradora: function (name) {
                    console.log("%c app.cartera.soat.glosa.bolivar ", "background:red;color:#fff;font-size:11px");
                    console.log(name);

                    // Obtener datos de localStorage
                    const response = nata.localStorage.getItem("cartera-glosa");

                    // Verificar que response tenga datos antes de ejecutar la consulta
                    if (response) {
                        // Filtrar registros según el nombre de la aseguradora
                        const filteredData = response.filter(item => item.ase === name);

                        if (filteredData.length > 0) {
                            const sql = `
                                SELECT
                                    id::NUMBER AS id,
                                    COUNT(1) AS cf,
                                    SUM(vg::NUMBER) AS vg,
                                    MAX(dtf::number) AS dv,
                                    MAX(dtc::number) AS dvc,
                                    MAX(dtn::number) AS dvs
                                FROM ?
                                GROUP BY id
                                ORDER BY id
                            `;

                            const totales = alasql(sql, [filteredData]);
                            console.log(totales);

                            const options = {
                                id: "tableCarteraGlosa",
                                columns: [
                                    {
                                        title: "Año",
                                        width: "100",
                                        prop: "id"
                                    },
                                    {
                                        title: "Cantidad Facturas",
                                        width: "140",
                                        prop: "cf",
                                        type: "number"
                                    },
                                    {
                                        title: "Valor Gestión Glosa",
                                        width: "120",
                                        prop: "vg",
                                        class: "text-end",
                                        type: "number",
                                        widget: {
                                            w: "badge",
                                            c: "text-bg-danger pulse-red"
                                        }
                                    },
                                    {
                                        title: "Dias vencimiento",
                                        width: "120",
                                        prop: "dv",
                                        class: "text-end",
                                        type: "number",
                                        widget: {
                                            w: "badge",
                                            c: "text-bg-danger pulse-red"
                                        }
                                    },
                                    {
                                        title: "Dias Vencimiento Contrato Crescend",
                                        width: "120",
                                        prop: "dvc",
                                        class: "text-end",
                                        type: "number",
                                        widget: {
                                            w: "badge",
                                            c: "text-bg-danger pulse-red"
                                        }
                                    },
                                    {
                                        title: "Días Vencimiento Solicitud Crescend",
                                        width: "120",
                                        prop: "dvs",
                                        class: "text-end",
                                        type: "number",
                                        widget: {
                                            w: "badge",
                                            c: "text-bg-danger pulse-red"
                                        }
                                    },
                                    {
                                        title: "",
                                        width: "150",
                                        class: "text-end",
                                        html: `
                                            <button type="button"
                                                class="btn btn-primary btn-sm btn-detalle"
                                                data-id="[id]">
                                                Ver Facturas
                                            </button>
                                        `
                                    }
                                ],
                                data: totales
                            };

                            nata.sessionStorage.setItem("widget", options);

                            new nataUIDialog({
                                html: `
                                    <div class="scroll-y">
                                        <nata-ui-table></nata-ui-table>
                                    </div>
                                `,
                                title: `
                                    Cartera ${name.toUpperCase()} <span class="badge rounded-pill text-bg-danger">${filteredData.length}</span>
                                `
                            });

                            document.querySelector("#tableCarteraGlosa").addEventListener("click", function (event) {
                                const element = event.target;

                                if (element.classList.contains("btn-detalle")) {
                                    console.log("%c ver facturas ", "background:red;color:#fff;font-size:11px");

                                    const year = element.dataset.id;
                                    const oDataView = filteredData.filter(function (record) {
                                        return record.id == year;
                                    });
                                    console.log(oDataView);

                                    const template = `
                                        <style>
                                            #carteraGlosa {
                                                table-layout: fixed;
                                                width: 1260px;
                                            }
                                        .center-container-button {
                                            text-align: center;
                                        }
                                        </style>
                                        <div class="scroll-y scroll-x">
                                            <table id="carteraGlosa" class="table table-sm table-striped">
                                                <colgroup>
                                                    <col width="90"></col>
                                                    <col width="100"></col>
                                                    <col width="120"></col>
                                                    <col width="120"></col>
                                                    <col width="130"></col>
                                                    <col width="120"></col>
                                                    <col width="110"></col>
                                                    <col width="120"></col>
                                                    <col width="110"></col>
                                                    <col width="110"></col>
                                                    <col width="90"></col>
                                                    <col width="90"></col>
                                                </colgroup>
                                                <tr>
                                                    <th># Factura</th>
                                                    <th>Fecha Factura</th>
                                                    <th>Valor Factura</th>
                                                    <th>Saldo Factura</th>
                                                    <th>Fecha Devolución</th>
                                                    <th>Valor Glosado</th>
                                                    <th>Estado Cartera</th>
                                                    <th>Dias vencimiento</th>
                                                    <th>Dias Vencimiento Contrato Crescend</th>
                                                    <th>Días Vencimiento Solicitud Crescend</th>
                                                    <th></th>
                                                    <th></th>
                                                </tr>
            
                                                {{~ it.detail: d:id}}
            
                                                <tr>
                                                    <td class="text-end">
                                                        <span>{{=d.nf}}</span>
                                                    </td>
                                                    <td class="text-center">
                                                        <span>{{=d.f}}</span>
                                                    </td>
                                                    <td class="text-end">
                                                        {{=numberDecimal.format(d.v)}}
                                                    </td>
                                                    <td class="text-end">
                                                        {{=numberDecimal.format(d.sa)}}
                                                    </td>
                                                    <td class="text-end">
                                                        <span>{{=d.fd}}</span>
                                                    </td>
                                                    <td class="text-end">
                                                        {{=numberDecimal.format(d.vg)}}
                                                    </td>
                                                    <td class="text-end">
                                                        <span class="badge rounded-pill text-bg-danger">
                                                            ({{=d.ie}}) {{=d.e}}
                                                        </span>
                                                    </td>
                                                    <td class="text-end">
                                                    <span class="text-bg-danger pulse-red badge">{{=d.dtf}}</span>
                                                    </td>
                                                    <td class="text-end">
                                                    <span class="text-bg-danger pulse-red badge">{{=d.dtc}}</span>
                                                    </td>
                                                    <td class="text-end">
                                                    <span class="text-bg-danger pulse-red badge">{{=d.dtn}}</span>
                                                    </td>
                                                    <td class="text-center">
                                                        {{? d.c > 0}}
                                                        <button type="button"
                                                            class="btn btn-primary btn-sm btn-detalle-glosa"
                                                            data-id="{{=d.nf}}"
                                                            title="Ver detalle Glosa"
                                                            data-toggle="tooltip"
                                                            data-placement="top">
                                                            <svg class="btn-detalle-glosa" data-id="{{=d.nf}}"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff">
                                                                <title>Ver detalle glosa</title>
                                                                <path d="M22.54 21.12L20.41 19L22.54 16.88L21.12 15.46L19 17.59L16.88 15.46L15.46 16.88L17.59 19L15.46 21.12L16.88 22.54L19 20.41L21.12 22.54M6 2C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H13.81C13.45 21.38 13.2 20.7 13.08 20H6V4H13V9H18V13.08C18.33 13.03 18.67 13 19 13C19.34 13 19.67 13.03 20 13.08V8L14 2M8 12V14H16V12M8 16V18H13V16Z" />
                                                            </svg>
                                                        </button>
            
                                                        {{?}}
                                                    </td>
                                                    <td class="text-center">
                                                        {{? d.s !== ""}}
                                                        <button type="button"
                                                            class="btn btn-primary btn-sm btn-soportes"
                                                            data-id="{{=d.nf}}">
                                                            <svg class="btn-soportes" data-id="{{=d.nf}}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                                                            </svg>
                                                        </button>
                                                        {{?}}
                                                    </td>
                                                </tr>
                                                {{? d.c > 0}}
                                                <tr class="d-none">
                                                    <td id="containerGlosaDetalle-{{=d.nf}}" colspan="7"></td>
                                                </tr>
                                                {{?}}
                                                {{~}}
                                            </table>
                                    `;

                                    const html = doT.template(template)({ detail: oDataView });
                                    new nataUIDialog({
                                        html: html,
                                        title: `
                                            Cartera ${name.toUpperCase()}  <span class="badge rounded-pill pulse-red badge text-bg-danger">${oDataView.length}</span>
                                        `,
                                        toolbar: `
                                            <div class="btn-group">
                                                <button type="button" class="btn btn-primary dropdown-toggle btn-circle" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                                    </svg>

                                                </button>
                                                <ul class="dropdown-menu">
                                                    <li><a class="dropdown-item download-button">Descargar Excel</a></li>
                                                </ul>
                                            </div>
                                        `
                                    });

                                    document.querySelector("#carteraGlosa").addEventListener("click", function (event) {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        const element = event.target;
                                        if (element.classList.contains("btn-detalle-glosa")) {
                                            console.log("btn-detalle-glosa .click");
                                            const id = element.dataset.id;

                                            axios.get(app.config.server.php1 + "x=cartera&y=glosaDetalleGet&z=" + id)
                                                .then((function (response) {
                                                    console.log(response.data);

                                                    const oDataView = response.data.filter(function (record) {
                                                        return record.nf == id;
                                                    });
                                                    console.log(oDataView);

                                                    const options = {
                                                        id: "tableGlosaDetalle",
                                                        columns: [
                                                            {
                                                                title: "Estado",
                                                                width: "250",
                                                                prop: "en",
                                                            },
                                                            {
                                                                title: "Descripción Glosa",
                                                                width: "250",
                                                                prop: "dg"
                                                            },
                                                            {
                                                                title: "Anotación",
                                                                width: "250",
                                                                prop: "da",
                                                            }
                                                        ],
                                                        data: oDataView
                                                    };
                                                    nata.sessionStorage.setItem("widget", options);

                                                    new nataUIDialog({
                                                        html: `
                                                            <div class="w-100 scroll-y">
                                                                <nata-ui-table></nata-ui-table>
                                                            </div>
                                                        `,
                                                        title: `
                                                            Gestión Cartera Pendiente por Estado&nbsp;&nbsp;
                                                            <span class="badge rounded-pill text-bg-primary">
                                                                ${id}
                                                            </span>
                                                        `,
                                                        events: {
                                                            render: function () { },
                                                            close: function () { },
                                                        }
                                                    });
                                                })).catch((function (error) {
                                                    console.error(error);
                                                }));
                                        }

                                        else if (element.classList.contains("btn-soportes")) {
                                            const numeroFactura = element.dataset.id;
                                            axios.get("https://cdn1.artemisaips.com/index.php?k=soat&x=soportesVer&y=" + app.config.client + "&w=" + numeroFactura + "&z=1")
                                                .then((function (response) {
                                                    console.log(response.data);

                                                    const template = `
                                                        <ul class="list-group">
                                                            {{~ it.detail: d:id}}
                                                            <li class="list-group-item">
                                                                <a href="https://cdn1.artemisaips.com/5cb3f764-e920-45a2-a60a-db50418e8ffa/{{=d.f}}" target="_new">
                                                                    {{=d.f}}
                                                                </a>
                                                            </li>
                                                            {{~}}
                                                        </ul>
                                                    `;
                                                    const html = doT.template(template)({ detail: response.data });

                                                    new nataUIDialog({
                                                        html: html,
                                                        title: `
                                                            Soportes <span class="badge rounded-pill text-bg-primary">${numeroFactura}</span>
                                                        `,
                                                        events: {
                                                            render: function () { },
                                                            close: function () {
                                                                document.querySelector("#chatBubble").style.display = "none";
                                                            }
                                                        }
                                                    });

                                                })).catch((function (error) {
                                                    console.error(error);
                                                }));
                                        }
                                    });
                                    document.querySelector(".download-button").addEventListener("click", function (event) {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        //alert(year);
                                        const data = {
                                            y: year
                                        };
                                        document.getElementById("loader").style.display = "block";
                                        console.log(data);
                                        axios.post(app.config.server.php1 + "x=download&y=glosaAdresDocumento", data)
                                            .then((function (response) {
                                                console.log(response.data[0]);
                                                document.getElementById("loader").style.display = "none";
                                                //console.log(response);
                                                const link = document.createElement("a");

                                                link.href = app.config.server.docs + "templates/excel/" + year + "/archivo_final.xlsx";
                                                link.download = "archivo_final.xlsx";

                                                //console.log(link.href);
                                                document.body.appendChild(link);

                                                link.click();

                                                document.body.removeChild(link);

                                            })).catch((function (error) {
                                                document.getElementById("loader").style.display = "none";
                                                console.log(error);
                                            }));
                                    });
                                }
                            });
                        }
                    }
                },

                revisar: function (response = nata.localStorage.getItem("cartera-glosa-adres")) {
                    console.log("%c app.cartera.soat.glosa.adres ", "background:red;color:#fff;font-size:11px");
                    console.log(response);

                    const sql = `
                        SELECT
                            id::NUMBER AS id,
                            COUNT(1) AS cf,
                            SUM(vg::NUMBER) AS vg,
                            max(dtf::number) as dv,
                            max(dtc::number) as dvc,
                            max(dtn::number) as dvs

                        FROM ?
                        GROUP BY id
                        ORDER BY id
                    `;
                    const totales = alasql(sql, [response]);
                    console.log(totales);

                    const options = {
                        id: "tableCarteraGlosaAdres",
                        columns: [
                            {
                                title: "Año",
                                width: "100",
                                prop: "id"
                            },
                            {
                                title: "Cantidad Facturas",
                                width: "140",
                                prop: "cf",
                                type: "number"
                            },
                            {
                                title: "Valor Glosado",
                                width: "120",
                                prop: "vg",
                                class: "text-end",
                                type: "number",
                                widget: {
                                    w: "badge",
                                    c: "text-bg-danger pulse-red"
                                }
                            },
                            {
                                title: "Dias vencimiento",
                                width: "120",
                                prop: "dv",
                                class: "text-end",
                                type: "number",
                                widget: {
                                    w: "badge",
                                    c: "text-bg-danger pulse-red"
                                }
                            },
                            {
                                title: "Dias Vencimiento Contrato Crescend",
                                width: "120",
                                prop: "dvc",
                                class: "text-end",
                                type: "number",
                                widget: {
                                    w: "badge",
                                    c: "text-bg-danger pulse-red"
                                }
                            },
                            {
                                title: "Días Vencimiento Solicitud Crescend",
                                width: "120",
                                prop: "dvs",
                                class: "text-end",
                                type: "number",
                                widget: {
                                    w: "badge",
                                    c: "text-bg-danger pulse-red"
                                }
                            },
                            {
                                title: "",
                                width: "150",
                                class: "text-end",
                                html: `
                                    <button type="button"
                                        class="btn btn-primary btn-sm btn-detalle"
                                        data-id="[id]">
                                        Ver Facturas
                                    </button>
                                `
                            }
                        ],
                        data: totales
                    };
                    nata.sessionStorage.setItem("widget", options);
                    new nataUIDialog({
                        html: `
                            <div class="scroll-y">
                                <nata-ui-table></nata-ui-table>
                            </div>
                        `,
                        title: `
                            Cartera ADRES  <span class="badge rounded-pill text-bg-danger">${response.length}</span>
                        `
                    });

                    //#region evento delegado
                    document.querySelector("#tableCarteraGlosaAdres").addEventListener("click", function (event) {
                        const element = event.target;

                        if (element.classList.contains("btn-detalle")) {
                            console.log("%c ver facturas ", "background:red;color:#fff;font-size:11px");

                            const year = element.dataset.id;
                            const oDataView = response.filter(function (record) {
                                return record.id == year;
                            });
                            console.log(oDataView);

                            const template = `
                                <style>
                                    #carteraAdres {
                                        table-layout: fixed;
                                        width: 1260px;
                                    }
                                .center-container-button {
                                    text-align: center;
                                }
                                </style>
                                <!--<div class="scroll-y scroll-x">!-->
                                <table id="carteraAdres" class="table table-sm table-striped">
                                    <colgroup>
                                        <col width="90"></col>
                                        <col width="100"></col>
                                        <col width="120"></col>
                                        <col width="120"></col>
                                        <col width="130"></col>
                                        <col width="120"></col>
                                        <col width="110"></col>
                                        <col width="120"></col>
                                        <col width="110"></col>
                                        <col width="110"></col>
                                        <col width="90"></col>
                                        <col width="90"></col>
                                    </colgroup>
                                    <tr>
                                        <th># Factura</th>
                                        <th>Fecha Factura</th>
                                        <th>Valor Factura</th>
                                        <th>Saldo Factura</th>
                                        <th>Fecha Devolución</th>
                                        <th>Valor Glosado</th>
                                        <th>Estado Cartera</th>
                                        <th>Dias vencimiento</th>
                                        <th>Dias Vencimiento Contrato Crescend</th>
                                        <th>Días Vencimiento Solicitud Crescend</th>
                                        <th></th>
                                        <th></th>
                                    </tr>

                                    {{~ it.detail: d:id}}

                                    <tr>
                                        <td class="text-end">
                                            <span>{{=d.nf}}</span>
                                        </td>
                                        <td class="text-center">
                                            <span>{{=d.f}}</span>
                                        </td>
                                        <td class="text-end">
                                            {{=numberDecimal.format(d.v)}}
                                        </td>
                                        <td class="text-end">
                                            {{=numberDecimal.format(d.sa)}}
                                        </td>
                                        <td class="text-end">
                                            <span>{{=d.fd}}</span>
                                        </td>
                                        <td class="text-end">
                                            {{=numberDecimal.format(d.vg)}}
                                        </td>
                                        <td class="text-end">
                                            <span class="badge rounded-pill text-bg-danger">
                                                ({{=d.ie}}) {{=d.e}}
                                            </span>
                                        </td>
                                        <td class="text-end">
                                            <span class="text-bg-danger pulse-red badge">{{=d.dtf}}</span>
                                        </td>
                                        <td class="text-end">
                                            <span class="text-bg-danger pulse-red badge">{{=d.dtc}}</span>
                                        </td>
                                        <td class="text-end">
                                            <span class="text-bg-danger pulse-red badge">{{=d.dtn}}</span>
                                        </td>
                                        <td class="text-center">
                                            {{? d.c > 0}}
                                            <button type="button"
                                                class="btn btn-primary btn-sm btn-detalle-glosa"
                                                data-id="{{=d.nf}}"
                                                title="Ver detalle Glosa"
                                                data-toggle="tooltip"
                                                data-placement="top">
                                                <svg class="btn-detalle-glosa" data-id="{{=d.nf}}"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff">
                                                    <title>Ver detalle glosa</title>
                                                    <path d="M22.54 21.12L20.41 19L22.54 16.88L21.12 15.46L19 17.59L16.88 15.46L15.46 16.88L17.59 19L15.46 21.12L16.88 22.54L19 20.41L21.12 22.54M6 2C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H13.81C13.45 21.38 13.2 20.7 13.08 20H6V4H13V9H18V13.08C18.33 13.03 18.67 13 19 13C19.34 13 19.67 13.03 20 13.08V8L14 2M8 12V14H16V12M8 16V18H13V16Z" />
                                                </svg>
                                            </button>

                                            {{?}}
                                        </td>
                                        <td class="text-center">
                                            {{? d.s !== ""}}
                                            <button type="button"
                                                class="btn btn-primary btn-sm btn-soportes"
                                                data-id="{{=d.nf}}">
                                                <svg class="btn-soportes" data-id="{{=d.nf}}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                                                </svg>
                                            </button>
                                            {{?}}
                                        </td>
                                    </tr>
                                    {{? d.c > 0}}
                                    <tr class="d-none">
                                        <td id="containerGlosaDetalle-{{=d.nf}}" colspan="7"></td>
                                    </tr>
                                    {{?}}
                                    {{~}}
                                </table>
                            <!--</div>!--->
                            `;

                            const html = doT.template(template)({ detail: oDataView });
                            new nataUIDialog({
                                html: html,
                                title: `
                                    Cartera ADRES  <span class="badge rounded-pill pulse-red badge text-bg-danger">${oDataView.length}</span>
                                `,
                                toolbar: `
                                    <div class="btn-group">
                                        <button type="button" class="btn btn-primary dropdown-toggle btn-circle" data-bs-toggle="dropdown" aria-expanded="false">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                            </svg>

                                        </button>
                                        <ul class="dropdown-menu">
                                            <li><a class="dropdown-item download-button">Descargar Excel</a></li>
                                        </ul>
                                    </div>
                                `
                            });

                            document.querySelector("#carteraAdres").addEventListener("click", function (event) {
                                event.preventDefault();
                                event.stopPropagation();
                                const element = event.target;
                                if (element.classList.contains("btn-detalle-glosa")) {
                                    console.log("btn-detalle-glosa .click");
                                    const id = element.dataset.id;

                                    axios.get(app.config.server.php1 + "x=cartera&y=adresGlosaDetalleGet&z=" + id)
                                        .then((function (response) {
                                            console.log(response.data);

                                            const oDataView = response.data.filter(function (record) {
                                                return record.nf == id;
                                            });
                                            console.log(oDataView);

                                            const options = {
                                                id: "tableAdresGlosaDetalle",
                                                columns: [
                                                    {
                                                        title: "Tipo Elemento",
                                                        width: "130",
                                                        prop: "te"
                                                    },
                                                    {
                                                        title: "Código Elemento",
                                                        width: "120",
                                                        prop: "ce",
                                                    },
                                                    {
                                                        title: "Descripción Elemento",
                                                        width: "250",
                                                        prop: "de",
                                                    },
                                                    {
                                                        title: "Descripción Glosa",
                                                        width: "250",
                                                        prop: "dg"
                                                    },
                                                    {
                                                        title: "Anotación",
                                                        width: "250",
                                                        prop: "da",
                                                    }
                                                ],
                                                data: oDataView
                                            };
                                            nata.sessionStorage.setItem("widget", options);

                                            new nataUIDialog({
                                                html: `
                                                    <div class="w-100 scroll-y">
                                                        <nata-ui-table></nata-ui-table>
                                                    </div>
                                                `,
                                                title: `
                                                    Gestión Cartera Pendiente por Estado&nbsp;&nbsp;
                                                    <span class="badge rounded-pill text-bg-primary">
                                                        ${id}
                                                    </span>
                                                `,
                                                events: {
                                                    render: function () { },
                                                    close: function () { },
                                                }
                                            });
                                        })).catch((function (error) {
                                            console.error(error);
                                        }));
                                }

                                else if (element.classList.contains("btn-soportes")) {
                                    const numeroFactura = element.dataset.id;
                                    axios.get("https://cdn1.artemisaips.com/index.php?k=soat&x=soportesVer&y=" + app.config.client + "&w=" + numeroFactura + "&z=5")
                                        .then((function (response) {
                                            console.log(response.data);

                                            const template = `
                                                <ul class="list-group">
                                                    {{~ it.detail: d:id}}
                                                    <li class="list-group-item">
                                                        <a href="https://cdn1.artemisaips.com/5cb3f764-e920-45a2-a60a-db50418e8ffa/{{=d.f}}" target="_new">
                                                            {{=d.f}}
                                                        </a>
                                                    </li>
                                                    {{~}}
                                                </ul>
                                            `;
                                            const html = doT.template(template)({ detail: response.data });

                                            new nataUIDialog({
                                                html: html,
                                                title: `
                                                    Soportes <span class="badge rounded-pill text-bg-primary">${numeroFactura}</span>
                                                `,
                                                events: {
                                                    render: function () { },
                                                    close: function () {
                                                        document.querySelector("#chatBubble").style.display = "none";
                                                    }
                                                }
                                            });

                                        })).catch((function (error) {
                                            console.error(error);
                                        }));
                                }
                            });
                            document.querySelector(".download-button").addEventListener("click", function (event) {
                                event.preventDefault();
                                event.stopPropagation();
                                //alert(year);
                                const data = {
                                    y: year
                                };
                                document.getElementById("loader").style.display = "block";
                                console.log(data);
                                axios.post(app.config.server.php1 + "x=download&y=glosaAdresDocumento", data)
                                    .then((function (response) {
                                        console.log(response.data[0]);
                                        document.getElementById("loader").style.display = "none";
                                        //console.log(response);
                                        const link = document.createElement("a");

                                        link.href = app.config.server.docs + "templates/excel/" + year + "/archivo_final.xlsx";
                                        link.download = "archivo_final.xlsx";

                                        //console.log(link.href);
                                        document.body.appendChild(link);

                                        link.click();

                                        document.body.removeChild(link);

                                    })).catch((function (error) {
                                        document.getElementById("loader").style.display = "none";
                                        console.log(error);
                                    }));
                            });

                        }
                    });
                    //#endregion
                },

                upload: function () {
                    console.log("%c app.cartera.soat.glosa.adres.upload ", "background:red;color:#fff;font-size:11px");
                    document.querySelector("#container").innerHTML = `
                        <nata-ui-upload
                            data-title="Actualizar datos ADRES"
                            data-subtitle=""
                            data-file-types="csv"
                            data-url="${app.config.server.php1}x=upload&y=adres"
                            data-etl=""
                            data-params='
                                {
                                    "idConvenio": 16,
                                    "codigoServicio": "890101"
                                }
                            '>
                        ></nata-ui-upload>
                    `;
                }
            }
        },

        index: function (data = nata.localStorage.getItem("cartera-soat-informe-gestion-catalogo-0")) {
            console.trace("%c app.cartera.soat.index", "background:red;color:#fff;font-size:11px");

            const dataView = nata.localStorage.getItem("cartera-soat-informe-gestion-catalogo-0");

            document.querySelector("#loader").style.display = "none";

            if (dataView && dataView.error) {
                swal("Error", dataView.error, "error");
                return;
            }

            let value = nata.localStorage.getItem("tipo-poliza");
            let valueCatalogo = nata.localStorage.getItem("catalogo");

            if(value.length == 0){
                value = "SOAT";
            }

            const htmlLayout = `
                <div class="w-100 d-flex">
                    <select id="informeSelect" class="form-select fit-content catalogo-informe me-3" aria-label="Default select example">
                        <option value="0" ${valueCatalogo === "0" ? "selected" : ""}>Catalogo Crescend</option>
                        <option value="1" ${valueCatalogo === "1" ? "selected" : ""}>Catalogo Gerencia salud</option>
                    </select>
                    <select id="informeSelect" class="form-select fit-content filtrar-informe" aria-label="Default select example">
                        <option value="SOAT" ${value === "SOAT" ? "selected" : ""}>Informe SOAT</option>
                        <option value="NO SOAT" ${value === "NO SOAT" ? "selected" : ""}>Informe NO SOAT</option>
                        <option value="ADRES" ${value === "ADRES" ? "selected" : ""}>Informe ADRES</option>
                    </select>
                </div>
                <div class="w-100 h-100">                   
                    <div id="containerInforme" class="d-inline-block w-100"></div>
                </div>
            `;
            document.querySelector("#container").innerHTML = htmlLayout;

            let template = `
                <div class="w-100">
                    <div class="text-center">
                        <h5>Estados Gestión Cartera ${value}</h5>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <div id="box2" class="d-inline-block"></div>
                        </div>
                        <div class="col-8 h-700px" >
                            <nata-ui-chart-donut
                                id="chart1"
                                class="d-inline-block m-top-160px"
                                data-title-text=""
                                data-title-subtext=""
                                data-series-name="Estados Cartera"
                            ></nata-ui-chart-donut>
                        </div>
                    </div>
                </div>

                <div class="w-100 margin-top-m65px">
                <!--
                    <div class="w-100 h-350px" >
                        <nata-ui-chart-line
                            id="chart2"
                            class="d-inline-block"
                            data-title-text=""
                            data-title-subtext="Saldo Cartera"
                            data-series-name="Estados Cartera">
                        </nata-ui-chart-line>
                    </div>
                !-->
                </div>
            `;
            console.log(data);

            //#region tx data
            const sql = "SELECT e, SUM(s::NUMBER) AS s FROM ? GROUP BY e";
            const totales = alasql(sql, [data]);
            console.log(totales);

            let i, detail;
            for (i = 0; i < totales.length; i++) {
                console.log(totales[i].ie);
                detail = data.filter(function (record) {
                    return record.ie == totales[i].ie;
                });
                totales[i].detail = detail;
            }
            console.log(totales);
            //#endregion tx data

            data = data.map(function (record) {
                return {
                    name: record.e,
                    value: parseFloat(record.s)
                };
            });
            console.log(data);

            const options = {
                title: {
                    text: "",
                    subtext: ""
                },
                series: [
                    {
                        name: "Estados Cartera",
                        data: data
                    }
                ]
            };
            nata.sessionStorage.setItem("chart1", options);
            nata.sessionStorage.setItem("chart1-data", totales);

            let html = doT.template(template)({});
            document.querySelector("#containerInforme").innerHTML = html;

            //nata.ui.charts.donut.render(document.querySelector("#chart1"),options);

            template = `
                <style>
                    .total-cien{
                        background-color: #437d33;
                    }
                    .total-setenta-cinco{
                        background-color: #fdc515;
                    }
                    .total-cincuenta{
                        background-color: #fb8902;
                    }
                    .total-veinticinco{
                        background-color: #ea4235;
                    }

                    #box2 {
                        overflow-y: auto;
                    }
                </style>
                <table id="tableCarteraConsolidadoGestion" class="table table-sm table-striped">
                    <colgroup>
                        <col width="25"></col>
                        <col width="320"></col>
                        <col width="180"></col>
                    </colgroup>
                    <thead>
                        <tr>
                            <th>
                            </th>
                            <th>
                                Estado
                            </th>
                            <th>
                                Saldo
                            </th>
                        </tr>
                        {{
                            let grupo = "";
                        }}
                        {{~ it.detail: d:id}}
                        <tr>
                            <td>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>plus-circle-outline</title><path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z" /></svg>
                            </td>
                            <td>
                                <b>{{=d.e}}</b>
                            </td>
                            <td class="text-end">
                                <span class="badge rounded-pill text-bg-primary font-size-12px">
                                    {{=((parseFloat(d.s)/parseFloat(it.totalData.total)) * 100).toFixed(2)}}%
                                </span>
                                &nbsp;&nbsp;&nbsp;
                                <b>{{=numberDecimal.format(d.s)}}</b>
                            </td>
                        </tr>

                        {{~ d.detail: dd:idd}}
                        {{? grupo != dd.l}}
                        <!--<tr>
                            <td colspan="3">
                                {{? dd.l == "conciliado"}}
                                <span class="badge text-bg-success font-size-12px">{{=dd.l}}</span>
                                {{??}}
                                <span class="badge text-bg-danger font-size-12px">{{=dd.l}}</span>
                                {{?}}
                            </td>                            
                        </tr>-->
                        {{?}}
                        {{
                            grupo = "";
                        }}
                        <tr class="font-size-12px">
                            <td></td>
                            <td>
                                {{=dd.e}}
                            </td>
                            <td class="text-end">
                                {{=numberDecimal.format(dd.s)}}
                            </td>
                        </tr>

                        {{
                            grupo = dd.l;
                        }}

                        {{~}}

                        {{~}}

                        <tr>
                            <td colspan="2"><b>TOTAL GESTIÓN</b></td>
                            <td class="text-end">
                                <b>{{=numberDecimal.format(it.totalData.total)}}</b>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2"><b>TOTAL CARTERA RECIBIDA</b></td>
                            <td class="text-end">
                                <b>{{=numberDecimal.format(it.totalData.totalRecibida)}}</b>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3" class="text-end">
                            {{? numberDecimal.format(it.totalData.porcentaje)==100}}
                                <span class="badge rounded-pill total-cien">{{=numberDecimal.format(it.totalData.porcentaje)}}%</span>
                            {{?}}
                            {{? numberDecimal.format(it.totalData.porcentaje)>=75 && numberDecimal.format(it.totalData.porcentaje)<100}}
                                <span class="badge rounded-pill total-setenta-cinco">{{=numberDecimal.format(it.totalData.porcentaje)}}%</span>
                            {{?}}
                            {{? numberDecimal.format(it.totalData.porcentaje)>=50 && numberDecimal.format(it.totalData.porcentaje)<75}}
                                <span class="badge rounded-pill total-cincuenta">{{=numberDecimal.format(it.totalData.porcentaje)}}%</span>
                            {{?}}
                            {{? numberDecimal.format(it.totalData.porcentaje)<50}}
                                <span class="badge rounded-pill total-veinticinco">{{=numberDecimal.format(it.totalData.porcentaje)}}%</span>
                            {{?}}
                            </td>
                        </tr>
                    </thead>
                </table>
            `;

            console.log(data);
            console.log(totales);
            console.log(dataView);

            //#region ordenar detalles
            let detalle;
            for (i = 0; i < dataView.length; i++) {
                detalle = dataView[i].detail;
                detalle = detalle.sort(function (a, b) {
                    return parseFloat(b.s) - parseFloat(a.s); // Descending order
                });
            }
            console.log(detalle);
            //#endregion ordenar detalles

            const total = data.reduce((acum, act) => { return act.value + acum; }, 0);
            const totalCarteraRecibida = parseFloat(nata.localStorage.getItem("cartera-soat-total")[0].total);
            const porcentaje = (total / totalCarteraRecibida) * 100;
            console.log(porcentaje);
            html = doT.template(template)({
                detail: dataView,
                totalData: {
                    total: total,
                    totalRecibida: totalCarteraRecibida,
                    porcentaje: porcentaje
                }
            });
            const element = document.querySelector("#box2");
            element.innerHTML = html;
            element.style.height = (session.height - 150) + "px";


            document.querySelector(".filtrar-informe").addEventListener("change", function(){
                console.log("filtrar-informe.click");

                const value = document.querySelector(".filtrar-informe").value;

                console.log(value);
                
                axios.get(app.config.server.php1 + "x=cartera&y=informe&z=0&k=" + value)
                    .then(function(response){
                        console.log(response.data);

                        const dataFilter = nata.localStorage.setItem("cartera-soat-informe-gestion-catalogo-0", response.data);
                        nata.localStorage.setItem("tipo-poliza", value);

                        app.cartera.soat.index(dataFilter);
                    })
                    .catch(function(error){
                        console.log(error);
                    });
            });

            document.querySelector(".catalogo-informe").addEventListener("change", function(){
                console.log("catalogo-informe.click");

                const value = document.querySelector(".catalogo-informe").value;

                console.log(value);

                axios.get(app.config.server.php1 + "x=cartera&y=informe&z=" + value)
                    .then(function(response){
                        console.log(response.data);

                        const dataFilter = nata.localStorage.setItem("cartera-soat-informe-gestion-catalogo-0", response.data);
                        nata.localStorage.setItem("catalogo", value);

                        app.cartera.soat.index(dataFilter);
                    })
                    .catch(function(error){
                        console.log(error);
                    });
            });
        },

        asegurador: function (data = nata.localStorage.getItem("cartera-asegurador")) {
            console.log("%c app.cartera.soat.asegurador ", "background:red;color:#fff;font-size:11px");

            console.log(data);

            const strSQL = `
                SELECT
                    SUM(v5::NUMBER) AS v5,
                    SUM(v6::NUMBER) AS v6,
                    SUM(v7::NUMBER) AS v7,
                    SUM(v8::NUMBER) AS v8,
                    SUM(v9::NUMBER) AS v9,
                    SUM(v10::NUMBER) AS v10
                FROM ?
            `;
            const total = alasql(strSQL, [data])[0];
            console.log(total);

            let i, value, arrTotal = [];
            console.log(Object.keys(total).length);
            for (i = 0; i < Object.keys(total).length; i++) {
                console.log("v" + (i + app.config.dashboard.mesInicial));
                value = total["v" + (i + app.config.dashboard.mesInicial)];
                arrTotal.push(value);
            }

            console.log(arrTotal);

            const htmlLayout = `
                <div id="box1" class="w-100 h-100">
                </div>
            `;
            const template = `
                <style>
                    #containerTableAsegurador {
                        height: calc(100vh - 110px);
                    }
                </style>
                <div id="containerTableAsegurador" class="w-100 scroll-y bg-white">
                    {{
                        const colWidth = 120;
                    }}
                    <style>
                        #tableCartera {
                            table-layout: fixed;
                            width: 1070px;
                            text-align: left;
                        }

                        #tableCartera td, #tableCartera th{
                            border-color: #bbb;
                        }

                        #titleCartera {
                            position: sticky;
                            top: 0;
                            background-color: white; /* Cambia esto al color de fondo deseado */
                            z-index: 1;
                        }
                        tr>th:first-child,tr>td:first-child {
                            position: sticky;
                            left: 0;
                        }
                    </style>

                    <h6 id="titleCartera">
                        Estado Cartera por Asegurador <span class="badge rounded-pill text-bg-primary">
                            {{=app.config.client}}
                        </span>
                    </h6>

                    <table id="tableCartera" class="table table-sm table-striped-columns">
                        <colgroup>
                            <col width="350"></col>
                            <col width="{{=colWidth}}"></col>
                            {{=app.fx.template.cartera.columnsRender(it.mesInicial, 1, colWidth)}}
                        </colgroup>
                        <thead>
                            <tr>
                                <th></th>
                                {{
                                    session.parameter = 1;
                                }}
                                {{=app.fx.template.cartera.columnsRender(it.mesInicial, 2)}}
                            </tr>
                        </thead>
                        <tbody>
                            {{
                                let asegurador = "";
                            }}
                            {{~ it.detail: d:id}}
                                {{
                                    let classColor = "";
                                    if (d.ie == 45 || d.ie == 40) {
                                        classColor = "color-orange";
                                    }
                                    else {
                                        if (d.iee == 0) {
                                            classColor = "color-blue";
                                        }
                                        else if (d.iee == 5) {
                                            classColor = "color-green";
                                        }
                                        else {
                                            classColor = "color-red";
                                        }
                                    }

                                    let TDBgColor = "";
                                    if (id == 0) {
                                        TDBgColor = "bg-blue-opacity";
                                    }
                                    else {
                                        if (d.ie == 45 || d.ie == 40) {
                                            TDBgColor = "bg-orange-opacity";
                                        }
                                        else {
                                            if (d.iee == 5) {
                                                TDBgColor = "bg-green-opacity";
                                            }
                                            else if (d.iee == 4) {
                                                TDBgColor = "bg-red-opacity";
                                            }
                                            else {
                                                TDBgColor = "bg-zebra";
                                            }
                                        }
                                    }

                                    const classByEstado = app.fx.classByEstadoGet(d.iee, d.ie);
                                }}

                            {{? asegurador != d.a}}
                            {{? id > 0}}
                            <tr>
                                <th>
                                    SALDO CARTERA AL CORTE
                                </th>
                                {{
                                    const oData = it.detail.filter(function (record) {
                                        return record.a == asegurador;
                                    });
                                }}
                                {{=app.fx.template.cartera.totales.render(it.mesInicial, oData)}}
                            </tr>
                            {{?}}

                            <tr>
                                <th colspan="7" class="text-start">
                                    <b>{{=d.a}}</b>
                                </th>
                            </tr>
                            {{?}}

                            <tr>
                                <td class="{{=classColor}} {{=TDBgColor}}">
                                    <span class="{{=classColor}}">
                                        <b>({{=d.ie}}) {{=d.e}}</b>
                                    </span>
                                </td>

                                <td class="text-end {{=TDBgColor}}">
                                    {{? d.v5 > 0}}
                                    <span class="badge rounded-pill {{=classByEstado}} {{=classColor}} ui-badge-value">
                                    {{=numberDecimal.format(d.v5)}}
                                    </span>
                                    {{?}}
                                </td>

                                <td class="text-end {{=TDBgColor}}">
                                    {{? d.v6 > 0}}
                                    <span class="badge rounded-pill {{=classByEstado}} {{=classColor}} ui-badge-value">
                                    {{=numberDecimal.format(d.v6)}}
                                    </span>
                                    {{?}}
                                </td>

                                <td class="text-end {{=TDBgColor}}">
                                    {{? d.v7 > 0}}
                                    <span class="badge rounded-pill {{=classByEstado}} {{=classColor}} ui-badge-value">
                                    {{=numberDecimal.format(d.v7)}}
                                    </span>
                                    {{?}}
                                </td>

                                <td class="text-end {{=TDBgColor}}">
                                    {{? d.v8 > 0}}
                                    <span class="badge rounded-pill {{=classByEstado}} {{=classColor}} ui-badge-value">
                                    {{=numberDecimal.format(d.v8)}}
                                    </span>
                                    {{?}}
                                </td>

                                <td class="text-end {{=TDBgColor}}">
                                    {{? d.v9 > 0}}
                                    <span class="badge rounded-pill {{=classByEstado}} {{=classColor}} ui-badge-value">
                                    {{=numberDecimal.format(d.v9)}}
                                    </span>
                                    {{?}}
                                </td>

                                <td class="text-end {{=TDBgColor}}">
                                    {{? d.v10 > 0}}
                                    <span class="badge rounded-pill {{=classByEstado}} {{=classColor}} ui-badge-value">
                                    {{=numberDecimal.format(d.v10)}}
                                    </span>
                                    {{?}}
                                </td>
                            </tr>

                            {{
                                asegurador = d.a;
                            }}

                            {{? asegurador != d.a}}
                            <tr>
                                <th colspan="7" class="text-start">
                                    AQUI LOS TOTALES ..
                                </th>
                            </tr>
                            {{?}}

                            {{~}}
                            <tr>
                                <th>
                                    SALDO CARTERA AL CORTE
                                </th>
                                {{
                                    const oData = it.detail.filter(function (record) {
                                        return record.a == asegurador;
                                    });
                                }}
                                {{=app.fx.template.cartera.totales.render(it.mesInicial, oData)}}
                            </tr>

                        </tbody>
                    </table>
                </div>
            `;
            if (data.length == 0) {
                swal(app.config.title, "No hay datos de estado de cartera por Asegurador", "error");
                return false;
            }
            //const debug = app.fx.cartera.estado.calcularTotal(data, 5);
            //console.log(debug);
            const html = doT.template(template)({ mesInicial: app.config.dashboard.mesInicial, detail: data });
            document.querySelector("#container").innerHTML = htmlLayout;
            document.querySelector("#box1").innerHTML = html;

            //const totalIPS = 151516843481156;
            //const totalEAPBS = 1156984648463;

            //const totalIPS = data.d.map(record => record.vp).reduce((a, b) => parseFloat(a) + parseFloat(b));
            //const totalEAPBS = data.d.map(record => record.va).reduce((a, b) => parseFloat(a) + parseFloat(b));

            session.dataset = {};

            app.electra.init();
            session.step = 1;
            app.electra.play(session.step);

            document.querySelector("#loader").style.display = "none";

        },

        // tipo: (1) si es la cartera anterior para sanear o (2) es cartera despues de la entrega ...

        estadosCartera: function (data = nata.localStorage.getItem("cartera-index")) {
            console.trace("%c app.cartera.soat.estadosCartera", "background:red;color:#fff;font-size:11px");

            axios.get(app.config.server.php1 + "x=cartera&y=glosaAdresGet")
                .then(function (response) {
                    console.log(response.data);
                    const strSQL = `
                        SELECT
                            SUM(v5::NUMBER) AS v5,
                            SUM(v6::NUMBER) AS v6,
                            SUM(v7::NUMBER) AS v7,
                            SUM(v8::NUMBER) AS v8,
                            SUM(v9::NUMBER) AS v9,
                            SUM(v10::NUMBER) AS v10
                        FROM ?
                    `;
                    const total = alasql(strSQL, [data])[0];
                    console.log(total);

                    let i, value, arrTotal = [];
                    console.log(Object.keys(total).length);
                    for (i = 0; i < Object.keys(total).length; i++) {
                        console.log("v" + (i + app.config.dashboard.mesInicial));
                        value = total["v" + (i + app.config.dashboard.mesInicial)];
                        arrTotal.push(value);
                    }

                    console.log(arrTotal);

                    const htmlLayout = `
                        <div id="box1" class="w-100 h-100">
                        </div>
                    `;
                    const template = `
                        <div class="w-100">
                            <div class="w-100 scroll-x bg-white">
                                {{
                                    const colWidth = 105;
                                }}
                                <style>
                                    #tableCartera {
                                        table-layout: fixed;
                                        width: 1080px;
                                        text-align: left;
                                    }

                                    #tableCartera td, #tableCartera th{
                                        border-color: #bbb;
                                    }

                                    #titleCartera {
                                        position: sticky;
                                        top: 0;
                                        background-color: white; /* Cambia esto al color de fondo deseado */
                                        z-index: 1;
                                    }
                                    tr>th:first-child,tr>td:first-child {
                                        position: sticky;
                                        left: 0;
                                    }
                                    #tableCartera .col-main{
                                        font-size:13px;
                                    }
                                    #tableCartera td:not(.col-main) > span{
                                        font-size:12px !important;
                                    }
                                </style>

                                <h6 id="titleCartera" class="d-inline-block">
                                    Estado Cartera <span class="badge rounded-pill text-bg-primary">{{=app.config.client}}</span>
                                </h6>
                                <div class="dropdown d-inline-block">
                                    <button
                                        class="btn btn-primary btn-circle dropdown-toggle d-inline-block"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Menu</title><path d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z" /></svg>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li>
                                            <a class="dropdown-item"
                                                href="javascript:void(0);
                                                "onclick='app.cartera.soat.index();'"
                                            >Saldos Consolidados</a>
                                        </li>
                                        <li><hr class="dropdown-divider"></li>
                                        <li>
                                            <a class="dropdown-item"
                                                href="javascript:void(0);
                                                "onclick='app.cartera.soat.asegurador();'"
                                            >Cliente</a>
                                        </li>
                                        <li>
                                            <a class="dropdown-item"
                                                href="javascript:void(0);
                                                "onclick='app.cartera.soat.asegurador();'"
                                            >Adres</a>
                                        </li>
                                        <li>
                                            <a class="dropdown-item"
                                                href="javascript:void(0);
                                                "onclick='app.cartera.soat.asegurador();'"
                                            >Edad Cartera</a>
                                        </li>
                                        <li>
                                            <a class="dropdown-item"
                                                href="javascript:void(0);
                                                "onclick='app.cartera.soat.asegurador();'"
                                            >Años Cartera</a>
                                        </li>
                                    </ul>
                                </div>

                                <table id="tableCartera" class="table table-sm table-striped-columns">
                                    <colgroup>
                                        <col width="329"></col>
                                        <col width="{{=colWidth}}"></col>
                                        {{=app.fx.template.cartera.columnsRender(it.mesInicial, 1, colWidth)}}
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th class="color-white">
                                                Estado Cartera
                                            </th>
                                            <th class="color-transparent no-striped">
                                                Total
                                            </th>
                                            {{
                                                let i;
                                                for(i=it.mesInicial;i<=10;i++) {
                                                }}
                                                {{
                                                }
                                            }}
                                        </tr>
                                        <tr>
                                            <th>
                                                Estado de Cartera
                                            </th>
                                            {{
                                                session.parameter = 1;
                                            }}
                                            {{=app.fx.template.cartera.columnsRender(it.mesInicial, 2)}}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {{~ it.detail: d:id}}
                                        <tr>
                                            {{
                                                let classColor = "";
                                                if (d.c !== '') {
                                                    classColor = "color-orange";
                                                }
                                                else {
                                                    if (d.ie == 45 || d.ie == 40) {
                                                        classColor = "color-orange";
                                                    }
                                                    else {
                                                        if (d.iee == 0) {
                                                            classColor = "color-blue";
                                                        }
                                                        else if (d.iee == 5) {
                                                            classColor = "color-green";
                                                        }
                                                        else {
                                                            classColor = "color-red";
                                                        }
                                                    }
                                                }

                                                let TDBgColor = "";
                                                if (d.c !== '') {
                                                    TDBgColor = "bg-" + d.c + "-opacity";
                                                }
                                                else {
                                                    if (id == 0) {
                                                        TDBgColor = "bg-blue-opacity";
                                                    }
                                                    else {
                                                        if (d.ie == 45 || d.ie == 40) {
                                                            TDBgColor = "bg-orange-opacity";
                                                        }
                                                        else {
                                                            if (d.iee == 5) {
                                                                TDBgColor = "bg-green-opacity";
                                                            }
                                                            else if (d.iee == 4) {
                                                                TDBgColor = "bg-red-opacity";
                                                            }
                                                            else {
                                                                TDBgColor = "bg-zebra";
                                                            }
                                                        }
                                                    }
                                                }

                                                const classByEstado = app.fx.classByEstadoGet(d.iee, d.ie);
                                            }}
                                            <td class="{{=classColor}} {{=TDBgColor}} col-main">
                                                <span class="{{=classColor}}">
                                                    <b>({{=d.ie}}) {{=d.e}}</b>
                                                </span>
                                            </td>

                                            <td class="text-end {{=TDBgColor}}">
                                                {{? d.v5 > 0}}
                                                <span class="badge rounded-pill {{=classByEstado}} {{=classColor}} ui-badge-value">
                                                {{=numberDecimal.format(d.v5)}}
                                                </span>
                                                {{?}}
                                            </td>

                                            <td class="text-end {{=TDBgColor}}">
                                                {{? d.v6 > 0}}
                                                <span class="badge rounded-pill {{=classByEstado}} {{=classColor}} ui-badge-value">
                                                {{=numberDecimal.format(d.v6)}}
                                                </span>
                                                {{?}}
                                            </td>

                                            <td class="text-end {{=TDBgColor}}">
                                                {{? d.v7 > 0}}
                                                <span class="badge rounded-pill {{=classByEstado}} {{=classColor}} ui-badge-value">
                                                {{=numberDecimal.format(d.v7)}}
                                                </span>
                                                {{?}}
                                            </td>

                                            <td class="text-end {{=TDBgColor}}">
                                                {{? d.v8 > 0}}
                                                <span class="badge rounded-pill {{=classByEstado}} {{=classColor}} ui-badge-value">
                                                {{=numberDecimal.format(d.v8)}}
                                                </span>
                                                {{?}}
                                            </td>

                                            <td class="text-end {{=TDBgColor}}">
                                                {{? d.v9 > 0}}
                                                <span class="badge rounded-pill {{=classByEstado}} {{=classColor}} ui-badge-value">
                                                {{=numberDecimal.format(d.v9)}}
                                                </span>
                                                {{?}}
                                            </td>

                                            <td class="text-end {{=TDBgColor}}">
                                                {{? d.v10 > 0}}
                                                <span class="badge rounded-pill {{=classByEstado}} {{=classColor}} ui-badge-value">
                                                {{=numberDecimal.format(d.v10)}}
                                                </span>
                                                {{?}}
                                            </td>
                                        </tr>
                                        {{~}}
                                        <tr>
                                            <th>
                                                SALDO CARTERA AL CORTE
                                            </th>
                                            {{=app.fx.template.cartera.totales.render(it.mesInicial, it.detail)}}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    `;
                    if (data.length == 0) {
                        swal(app.config.title, "No hay datos sobre el estado de cartera", "error");
                        return false;
                    }
                    const debug = app.fx.cartera.estado.calcularTotal(data, 5);
                    console.log(debug);
                    const html = doT.template(template)({ mesInicial: app.config.dashboard.mesInicial, detail: data });
                    document.querySelector("#container").innerHTML = htmlLayout;
                    document.querySelector("#box1").innerHTML = html;

                    //const totalIPS = 151516843481156;
                    //const totalEAPBS = 1156984648463;

                    //const totalIPS = data.d.map(record => record.vp).reduce((a, b) => parseFloat(a) + parseFloat(b));
                    //const totalEAPBS = data.d.map(record => record.va).reduce((a, b) => parseFloat(a) + parseFloat(b));

                    session.dataset = {};

                    app.electra.init();
                    session.step = 1;
                    app.electra.play(session.step);

                    document.querySelector("#loader").style.display = "none";
                }).catch(function (error) {
                    console.log(error);
                });
        },

        pago: function () {
            console.log("%c app.cartera.soat.pago", "background:red;color:#fff;font-size:11px");

            const title = "Subir Pagos";

            new nataUIDialog({
                height: 450,
                width: 400,
                html: `
                      <nata-ui-upload
                        data-title="${title}"
                        data-subtitle="Solo archivos con extensión xlsx"
                        data-file-types="xlsx"
                        data-url="${app.config.server.cdnPathBase}/index.php?x=soporte&y=subirPago"
                        data-etl=""
                      ></nata-ui-upload>
                `,
                title: title
            });
        }

        /*
        monitor: function () {
            console.log( "%c app.cartera.soat.monitor ", "background:red;color:#fff;font-size:11px");

            const data = nata.localStorage.getItem("cartera-soat-monitor-general");
            console.log(data);

            const html = `
                <div class="scroll-y">
                    <div id="containerTableMonitor" class="w-100"></div>
                </div>
            `;

            new nataUIDialog({
                html: html,
                title: "Monitor Cartera SOAT",
                events: {
                    render: function () {},
                    close: function () {
                        document.querySelector("#chatBubble").style.display = "none";
                    }
                }
            });

            console.log(data);
            const options = {
                id: "tableMonitorSOAT",
                columns: [
                    {
                        title: "Control",
                        width: "250",
                        prop: "d",
                        class: "fw-bold descriptor"
                    },
                    {
                        title: "Valor",
                        width: "110",
                        prop: "s",
                        type: "number"
                    },
                    {
                        title: "Cant. Facturas",
                        width: "80",
                        prop: "cf",
                        type: "number"
                    },
                    {
                        title: "Días Desde",
                        width: "80",
                        prop: "mind",
                        class: "text-end",
                        widget: {
                            w: "badge",
                            c: "text-bg-danger pulse-red"
                        }
                    },
                    {
                        title: "Días Hasta",
                        width: "80",
                        prop: "maxd",
                        class: "text-end",
                        widget: {
                            w: "badge",
                            c: "text-bg-danger pulse-red"
                        }
                    },
                    {
                        title: "Años Desde",
                        width: "80",
                        prop: "miny",
                        class: "text-end",
                        widget: {
                            w: "badge",
                            c: "text-bg-danger pulse-red"
                        }
                    },
                    {
                        title: "Años Hasta",
                        width: "80",
                        prop: "maxy",
                        class: "text-end",
                        widget: {
                            w: "badge",
                            c: "text-bg-danger pulse-red"
                        }
                    },
                    {
                        title: "Días Crescend",
                        width: "120",
                        prop: "dvg",
                        class: "text-end",
                        widget: {
                            w: "badge",
                            c: "text-bg-danger pulse-red"
                        }
                    },
                    {
                        title: "",
                        width: 150,
                        html: `
                            <button
                                id="button-[id]"
                                type="button"
                                class="btn btn-primary btn-sm button-detail"
                            >
                                Ver Facturas
                            </button>
                        `
                    }
                ],
                data: data
            };
            nata.sessionStorage.setItem("widget", options);
            document.querySelector("#containerTableMonitor").innerHTML = "<nata-ui-table></nata-ui-table>";

            const oDataVencidas = data[0];
            console.log(oDataVencidas);
            const fxRobotMessageVencimiento = function () {

                let preposicion = "";
                if ((oDataVencidas.dvg % 31) > 0) {
                    preposicion = "más";
                }
                else {
                    preposicion = "cerca";
                }

                const message = `
                    Tu equipo ha gestionado esta cartera durante ${oDataVencidas.dvg} días,
                    ${preposicion} de ${parseInt(oDataVencidas.dvg/30)} meses.
                    <br><br>
                    Tienen cartera con vencimientos de hasta
                    <span class="badge rounded-pill text-bg-danger pulse-red">
                        ${oDataVencidas.maxy}
                    </span> años.
                    <br><br>
                    Es urgente que descargues estas facturas de la cartera a gestionar y de las cuentas por cobrar del cliente.<br><br>
                    Este indicador es negativo para tu gestión !
                `;

                document.querySelector("#robot").message(message, "bgcolor-2");
            };

            fxRobotMessageVencimiento();

            // document.querySelector(".nata-ui-table").addEventListener("click", function(event) {
            // event.preventDefault();
            // event.stopPropagation();

            //     const element = event.target;
            //     if (element.classList.contains("svg-icon-warning")) {
            //         console.log("svg-icon-warning.click");
            //         fxRobotMessageVencimiento();
            //     }
            // });

            document.querySelector("#tableMonitorSOAT").addEventListener("click", function(event) {
                event.preventDefault();
                event.stopPropagation();

                const element = event.target;
                if (element.classList.contains("button-detail")) {
                    //alert("bingo !!");
                    document.querySelector("#chatBubble").style.display = "none";
                    let id = element.getAttribute("id");
                    id = id.replace("button-", "");
                    console.log(id);
                    console.log(data);
                    const oDataView = data.filter(function (record) {
                        return parseInt(record.id) == parseInt(id);
                    })[0].detail;
                    console.log("🚀 ~ file: app.cartera.js:1168 ~ document.querySelector ~ oDataView:", oDataView);
                    id = null;

                    // titulo
                    const parent = element.parentElement.parentElement;
                    console.log(parent);
                    const descriptor = parent.querySelector(".descriptor").innerHTML;
                    console.log(descriptor);

                    let options = {
                        id: "tableMedicamentoAplicar",
                        columns: [
                            {
                                title: "Número Factura",
                                width: "120",
                                prop: "nf"
                            },
                            {
                                title: "Fecha Factura",
                                width: "120",
                                prop: "ff"
                            },
                            {
                                title: "Días Vencimiento",
                                width: "140",
                                prop: "dvt",
                                type: "number"
                            },
                            {
                                title: "Días Vencimiento Crescend",
                                width: "140",
                                prop: "dvg",
                                type: "number"
                            },
                            {
                                title: "Saldo",
                                width: "140",
                                prop: "s",
                                type: "number"
                            }
                        ],
                        data: oDataView
                    };
                    nata.sessionStorage.setItem("widget", options);
                    const html = `
                        <div class="scroll-y">
                            <nata-ui-table></nata-ui-table>
                        </div>
                    `;
                    new nataUIDialog({
                        html: html,
                        title: "Facturas " + descriptor,
                        events: {
                            render: function () {},
                            close: function () {}
                        }
                    });
                }
            });
        }
        */
    },

    consolidada: {
        render: function (data = nata.localStorage.getItem("cartera-consolidada")) {
            console.log("%c app.cartera.consolidada.render", "background:red;color:#fff;font-size:11px");

            axios.get(app.config.server.php1 + "x=cartera&y=glosaAdresGet")
                .then((function (response) {
                    console.log(response.data);
                })).catch((function (error) {
                    console.error(error);
                }));

            const htmlLayout = `
                <div id="box1" class="w-100">
                </div>
            `;

            const template = `
                <div class="card" style="width:${session.width - 132}px">
                    <div class="card-body scroll-x">
                        <div class="w-100 scroll-x bg-white">
                            {{
                                const colWidth = 120;
                            }}
                            <style>
                                #tableCarteraConsolidada {
                                    table-layout: fixed;
                                    width: {{=520 + ((new Date().getMonth()+1) * colWidth)}}px;
                                    text-align: left;
                                }

                                tr>th:first-child,tr>td:first-child {
                                    position: sticky;
                                    left: 0;
                                }
                            </style>
                            <h6>Cartera Consolidada</h6>
                            <table id="tableCarteraConsolidada" class="table table-sm table-striped-columns">
                                <colgroup>
                                    <col width="200"></col>
                                    <col width="80"></col>
                                    <col width="{{=colWidth}}"></col>
                                    <col width="{{=colWidth}}"></col>
                                    {{
                                        let i;
                                        for(i=1;i<=new Date().getMonth()+1;i++) {
                                    }}
                                    <col width="{{=colWidth}}"></col>
                                    {{
                                        }
                                    }}

                                </colgroup>
                                <thead>
                                    <tr>
                                        <th class="color-white">
                                            Estado Cartera
                                        </th>
                                        <th class="no-striped"></th>
                                        <th class="color-transparent no-striped">
                                            Total
                                        </th>
                                        {{
                                            for(i=1;i<=new Date().getMonth()+1;i++) {
                                                if (i%3 == 0) {
                                        }}
                                        <th colspan="3" class="no-striped">
                                            <span class="badge rounded-pill text-bg-secondary">{{=new Date().getFullYear()}}</span>
                                        </th>
                                        {{
                                                }
                                            }
                                        }}
                                    </tr>
                                    <tr>
                                        <th>
                                            Estado de Cartera
                                        </th>
                                        <th></th>
                                        <th>
                                            Total
                                        </th>
                                        <th>
                                            Saldos Años Anteriores
                                        </th>
                                        {{
                                            for(i=1;i<=new Date().getMonth()+1;i++) {
                                        }}
                                        <th>
                                            {{=mes[i]}}
                                        </th>
                                        {{
                                            }
                                        }}
                                    </tr>
                                </thead>
                                <tbody>
                                    {{~ it.detail: d:id}}
                                    <tr>
                                        {{
                                            let classColor = "";
                                            if (d.ie == 0) {
                                                classColor = "color-blue";
                                            }
                                            else if (d.ie == 7) {
                                                classColor = "color-green";
                                            }
                                            else {
                                                classColor = "color-red";
                                            }
                                        }}
                                        {{
                                            let TDBgColor = "";
                                            if (d.ie == 424)) {
                                                TDBgColor = "bg-orange";
                                            }
                                            else {
                                                if (id == 0) {
                                                    TDBgColor = "bg-white";
                                                }
                                                else if (id%2 == 1) {
                                                    TDBgColor = "bg-zebra";
                                                }
                                            }
                                        }}
                                        <td class="{{=classColor}} {{=TDBgColor}}">
                                            <b><small>{{=d.ie}}-{{=d.e}}</small></b>
                                        </td>

                                        <td class="text-center {{=TDBgColor}}">
                                            <button type="button"
                                                class="btn btn-primary btn-sm d-inline-block btn-detalle"
                                                data-ie="{{=d.ie}}">
                                                ······
                                            </button>
                                        </td>

                                        <td class="text-end {{=TDBgColor}}">
                                            {{
                                                const classBG = app.fx.classByEstadoGet(d.ie);;
                                            }}
                                            <span class="badge rounded-pill {{=classBG}} {{=classColor}}">
                                                {{=numberDecimal.format(d.s)}}
                                            </span>
                                        </td>

                                        <td class="text-end {{=TDBgColor}}">
                                            <span class="badge rounded-pill {{=app.fx.classByEstadoGet(d.ie)}} {{=classColor}}">
                                                {{=numberDecimal.format(d.an)}}
                                            </span>
                                        </td>

                                        {{
                                            for(i=1;i<=new Date().getMonth()+1;i++) {
                                        }}
                                        <td class="text-end {{=TDBgColor}}">
                                            {{
                                                const classBG = app.fx.classByEstadoGet(d.ie);;
                                            }}
                                            {{? d["m" + i] > 0}}
                                            <span class="badge rounded-pill {{=classBG}} {{=classColor}} button-ver-detalle-periodo"
                                                data-y="{{=new Date().getFullYear()}}"
                                                data-m="{{=new Date().getMonth()+1}}"
                                                data-ie="{{=d.ie}}"
                                            >
                                                {{=numberDecimal.format(d["m" + i])}}
                                            </span>
                                            {{?}}
                                        </td>
                                        {{
                                            }
                                        }}
                                    </tr>
                                    {{~}}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

            if (data.length == 0) {
                swal(app.config.title, "No se ha recibido la cartera consolidada", "error");
                return false;
            }
            const html = doT.template(template)({ detail: data });
            document.querySelector("#container").innerHTML = htmlLayout;
            //document.querySelector("#box1").innerHTML = html;

            new nataUIDialog({
                html: html,
                title: "Estado Cartera",
                events: {
                    render: function () { },
                    close: function () { },
                },
            });

            //#region evento delegado
            document.querySelector("#tableCarteraConsolidada").addEventListener("click", function (event) {
                console.log("#tableCarteraConsolidada.click");
                const element = event.target;
                if (element.classList.contains("btn-detalle")) {
                    new nataUIDialog({
                        html: "",
                        title: "",
                        events: {
                            render: function () { },
                            close: function () { },
                        },
                    });
                }
                else if (element.classList.contains("button-ver-detalle-periodo")) {
                    // ajax
                    const dataSend = {
                        ie: element.dataset.ie,
                        y: element.dataset.y,
                        m: element.dataset.m
                    };

                    axios.get(app.config.server.php + "cartera/circular30EstadoPeriodoGet/" + dataSend.ie + "?ts=" + (new Date).getTime())
                        .then((function (response) {
                            console.log(response.data);

                            new nataUIDialog({
                                html: "<div id='containerDetalleCartera'></div>",
                                title: "Gestión Cartera Pendiente por Estado",
                                events: {
                                    render: function () { },
                                    close: function () { },
                                },
                            });

                            const templateLayout = `
                                {{? it.search}}
                                <header class="d-inline-block w-100">
                                    <div class="input-group flex-nowrap">
                                        <span class="input-group-text" id="addon-wrapping">
                                            <img src="assets/images/icons/search.svg" alt="">
                                        </span>
                                        <input id="txtSearchLayout-{{=it.id}}" type="text" class="form-control input-search" placeholder="Buscar ..." aria-label="Buscar"
                                            aria-describedby="addon-wrapping">
                                        <button id="buttonSearchClear-{{=it.id}}" type="button" class="btn btn-primary button-search-clear">
                                            <img src="assets/images/icons/close-circle-white.svg" alt="">
                                        </button>
                                    </div>
                                </header>
                                {{?}}
                                <style>
                                    table.table-cartera-detalle {
                                        table-layout: fixed;
                                        width: 1080px;
                                    }
                                </style>
                                <div id="scroll-{{=it.id}}" class="clusterize-scroll">
                                    <table class="table table-sm table-cartera-detalle table-striped">
                                        <colgroup>
                                            <col width="120"></col>
                                            <col width="140"></col>
                                            <col width="140"></col>
                                            <col width="140"></col>
                                            <col width="250"></col>
                                            <col width="100"></col>
                                            <col width="100"></col>
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>Número Factura</th>
                                                <th>Fecha Factura</th>
                                                <th>Fecha Radicado</th>
                                                <th>Nit Asegurador</th>
                                                <th>Asegurador</th>
                                                <th>Estado Factura</th>
                                                <th>Saldo</th>
                                            </tr>
                                        </thead>
                                        <tbody id="{{=it.id}}"></tbody>
                                    </table>
                                </div>
                            `;

                            const templateRender = `
                                <tr>
                                    <td>{{=it.f}}</td>
                                    <td class="text-end">{{=it.ff}}</td>
                                    <td class="text-end">{{=it.fr}}</td>
                                    <td class="text-end">{{=it.n}}</td>
                                    <td>{{=it.ta}}</td>
                                    <td>{{=it.ef}}</td>
                                    <td class="text-end">{{=numberDecimal.format(it.s)}}</td>
                                </tr>
                            `;

                            const oConfig = {
                                element: element,
                                fieldsFilter: ["f", "ff", "fr", "n", "ta", "ef", "s"], // TODO: aqui van los atributos del json si se filtra o busca
                                templateLayout: templateLayout,
                                templateRender: templateRender,
                                search: true,
                            };
                            const index = "cartera-detalle";
                            console.log(data);
                            alert("paso 01");
                            new nataUIList({}, oConfig, {}, index, response.data);
                            //oNataUDList.init();

                        })).catch((function (error) {
                            console.error(error);
                        }));
                }
            });
            //#endregion evento delegado
        }
    },

    workflow: {
        SolicitudEstadoCuentasAseguradora: function () {
            console.log("app.cartera.workflow.SolicitudEstadoCuentasAseguradora");

            const data = nata.localStorage.getItem(
                "cartera-solicitud-estado-cuentas-aseguradora"
            );
            const template = `
                <style>
                    #tableCarteraSolicitudEstadoCuentasAseguradora {
                        table-layout: fixed;
                        width: 500px;

                    }
                </style>
                <h5>Estado Cartera Vencimiento</h5>
                <table id="tableCarteraEstado" class="table table-sm">
                    <colgroup>
                        <col width="350"></col>
                        <col width="350"></col>
                        <col width="150"></col>
                    </colgroup>
                    <tr>
                        <th>Aseguradora</th>
                        <th>Estado</th>
                        <th>Cantidad</th>
                    </tr>
                    {{~ it.detail: d:id}}
                    <tr>
                        <td>{{=d.a}}</td>
                        <td>{{=d.e}}</td>
                        <td class="text-end">
                            {{=d.c}}
                        </td>
                    </tr>
                    {{~}}
                </table>
            `;

            const html = doT.template(template)({ detail: data });
            document.querySelector("#box-2").innerHTML = html;
        },
    },

    aseguradoraEdad: function () {
        console.log("app.cartera.aseguradoraEdad");
        const data = nata.localStorage.getItem("cartera-aseguradora-edad");


        const arrSerie = [
            2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012,
            2011, 2010, 2009, 2008, 2007,
        ];

        const colWidth = 125;
        let i,
            anchoTotal = 200;
        for (i = 0; i < arrSerie.length; i++) {
            anchoTotal += 125;
        }

        const template = `
            <style>
                #tableCarteraAseguradoraEdad {
                    table-layout: fixed;
                    width: ${anchoTotal}px;
                }
            </style>
            <div id="containerTable" class="scroll-x scroll-y"
                style="height:${session.height - 116}px;width:${session.width - 140}px">
                <table id="tableCarteraAseguradoraEdad" class="table table-sm">
                    <colgroup>
                        <col width="200"></col>
                        {{
                        let i;
                        for (i=0; i<it.serie.length; i++) { }}
                            <col width="{{=it.colWidth}}"></col>
                        {{
                        }
                        }}
                    </colgroup>
                    <tr>
                        <th>Aseguradora</th>
                        {{
                        for (i=0; i<it.serie.length; i++) { }}
                            <th class="text-end {{? it.serie[i]%2 == 1}}bg-opacity-004{{?}}">
                                A {{=it.serie[i]}}
                            </th>
                        {{
                        }
                        }}
                    </tr>
                    {{~ it.detail: d:id}}
                    <tr class="{{? id%2 == 0}}bg-opacity-0025{{?}}">
                        <td>{{=d.a}}</td>
                        {{
                        for (i=0; i<it.serie.length; i++) { }}
                            <td class="text-end {{? it.serie[i]%2 == 1}}bg-opacity-004{{?}}">
                            {{=numberDecimal.format(d["A" + it.serie[i]])}}
                            </td>
                        {{
                        }
                        }}
                        <td class="text-end">

                        </td>
                    </tr>
                    {{~}}
                </table>
            </div>
        `;

        const html = doT.template(template)({
            colWidth: colWidth,
            serie: arrSerie,
            detail: data,
        });
        document.querySelector("#container").innerHTML = html;
    },

    enviarDataFURIPS: {
        render: function () {


            console.trace(
                "%c app.cartera.enviarDataFurips",
                "background:red;color:white;font-weight:bold;font-size:11px"
            );
            const data = nata.localStorage.getItem("cartera-enviar-data-furips");
            console.log(data);
            const template = `
                <div class="scroll-y">
                    <div class="w-100">
                        <style>
                            #tableCarteraEnviarDataFURIPS {
                                table-layout: fixed;
                                width: 900px;
                            }
                        </style>
                        <h5>Cartera No Soat</h5>
                        <table id="tableCarteraEnviarDataFURIPS" class="card table table-sm">
                            <colgroup>
                                <col width="150">
                                <col width="150">
                                <col width="150">
                                <col width="100">
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th class="w-500px">Número Factura</th>
                                    <th class="w-150px">Fecha Factura</th>
                                    <th class="w-150px">Asegurador</th>
                                    <th class="w-100px">Ver detalles</th>
                                </tr>
                                {{~ it.detailNoSoat: d:id}}
                                <tr>
                                    <td class="border-bottom-none">
                                        <span class="badge rounded-pill text-bg-success">0</span>&nbsp;
                                        <b>NO CORRESPONDE A CARTERA SOAT</b>
                                    </td>
                                    <td class="text-end border-bottom-none">
                                        <span class="badge rounded-pill text-bg-success">{{=d.c}}</span>
                                    </td>
                                    <td class="text-end border-bottom-none">
                                        <span class="badge rounded-pill text-bg-success">
                                            {{=numberDecimal.format(d.s)}}
                                        </span>
                                    </td>
                                    <td class="text-center border-bottom-none">
                                        <img class="d-inline-block icon-excel"
                                            src="assets/images/icons/excel.svg" alt=""
                                            data-ia="{{=d.id}}" data-ie="{{=d.ie}}"
                                        >
                                    </td>
                                </tr>
                                {{~}}
                            </tbody>
                        </table>
                    </div>

                    <div class="w-100">
                        <style>
                            #tableCarteraEstado {
                                table-layout: fixed;
                                width: 900px;
                            }

                        </style>

                        <h5 class="mt-4">Estados Cartera Vencida</h5>
                        <table id="tableCarteraEstado" class="card table table-sm">
                            <colgroup>
                                <col width="500"></col>
                                <col width="150"></col>
                                <col width="150"></col>
                                <col width="100"></col>
                            </colgroup>
                            <tr>
                                <td></td>
                                <td class="text-end">
                                    <span class="badge rounded-pill text-bg-warning">{{=it.total.c}}</span>
                                </td>
                                <td class="text-end">
                                    <span class="badge rounded-pill text-bg-warning">
                                        {{=numberDecimal.format(it.total.s)}}
                                    </span>
                                </td>
                                <td>
                                </td>
                            </tr>
                            <tr>
                                <th class="w-500px">Estado</th>
                                <th class="w-150px">Cantidad</th>
                                <th class="w-150px">Total Facturas</th>
                                <th class="w-100px">Ver detalles</th>
                            </tr>
                            {{
                                let asegurador = "";
                            }}
                            {{~ it.detail: d:id}}
                            {{? asegurador != d.a}}
                            <tr class="title">
                                <td colspan="4">
                                    <span class="badge rounded-pill text-bg-warning">{{=d.a}}</span>
                                </td>
                            </tr>
                            {{?}}
                            {{
                                asegurador = d.a;
                            }}
                            <tr>
                                <td class="border-bottom-none">
                                    <span class="badge rounded-pill
                                        {{? d.o == 7}}
                                        text-bg-success
                                        {{??}}
                                        text-bg-danger
                                        {{?}}
                                    ">{{=d.o}}</span>&nbsp;
                                    <b>{{=d.e}}</b>
                                </td>
                                <td class="text-end border-bottom-none">
                                    <span class="badge rounded-pill
                                        {{? d.o == 7}}
                                        text-bg-success
                                        {{??}}
                                        text-bg-danger
                                        {{?}}
                                    ">{{=d.c}}</span>
                                </td>
                                <td class="text-end border-bottom-none">
                                    <span class="badge rounded-pill
                                        {{? d.o == 7}}
                                        text-bg-success
                                        {{??}}
                                        text-bg-danger
                                        {{?}}
                                    ">
                                        {{=numberDecimal.format(d.s)}}
                                    </span>
                                </td>
                                <td class="text-center border-bottom-none">
                                    <img class="d-inline-block icon-excel"
                                        src="assets/images/icons/excel.svg" alt=""
                                        data-ia="{{=d.id}}" data-ie="{{=d.ie}}"
                                    >
                                </td>
                            </tr>

                            {{?d.d !== ""}}
                            <tr>
                                <td colspan="4" class="ps-5 pt-0 border-top-none">
                                    <small>{{=d.d}}</small>
                                </td>
                            </tr>
                            {{?}}

                            {{~}}
                        </table>
                    </div>
                </div>
            `;
            const html = doT.template(template)(data[0]);
            document.querySelector("#box-3").innerHTML = html;
        }
    },

    estado: {
        render: function () {
            console.trace(
                "%c app.cartera.estado.render",
                "background:red;color:white;font-weight:bold;font-size:11px"
            );
            const data = nata.localStorage.getItem("cartera-estado-aseguradora");
            console.log(data);

            // totales
            let strSQL = `
                SELECT
                    SUM(c::number) AS c,
                    SUM(s::number) AS s
                FROM ?
            `;
            const dataTotal = alasql(strSQL, [data])[0];
            console.log(dataTotal);

            // totales por aseguradora
            strSQL = `
                SELECT
                    id,
                    a,
                    SUM(c::number) AS c,
                    SUM(s::number) AS s
                FROM ?
                GROUP BY a, id
            `;
            const dataTotalAsegurador = alasql(strSQL, [data]);
            //console.log(dataTotalAsegurador);

            const template = `
                <div class="scroll-y">
                    <div class="w-100">
                        <style>
                            #tableCarteraNoSoat {
                                table-layout: fixed;
                                width: 900px;
                            }
                        </style>
                        <h5>Cartera No Soat</h5>
                        <table id="tableCarteraNoSoat" class="card table table-sm">
                            <colgroup>
                                <col width="500">
                                <col width="150">
                                <col width="150">
                                <col width="100">
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th class="w-500px">Estado</th>
                                    <th class="w-150px">Cantidad</th>
                                    <th class="w-150px">Total Facturas</th>
                                    <th class="w-100px">Ver detalles</th>
                                </tr>
                                {{~ it.detailNoSoat: d:id}}
                                <tr>
                                    <td class="border-bottom-none">
                                        <span class="badge rounded-pill text-bg-success">0</span>&nbsp;
                                        <b>NO CORRESPONDE A CARTERA SOAT</b>
                                    </td>
                                    <td class="text-end border-bottom-none">
                                        <span class="badge rounded-pill text-bg-success">{{=d.c}}</span>
                                    </td>
                                    <td class="text-end border-bottom-none">
                                        <span class="badge rounded-pill text-bg-success">
                                            {{=numberDecimal.format(d.s)}}
                                        </span>
                                    </td>
                                    <td class="text-center border-bottom-none">
                                        <img class="d-inline-block icon-excel"
                                            src="assets/images/icons/excel.svg" alt=""
                                            data-ia="{{=d.id}}" data-ie="{{=d.ie}}"
                                        >
                                    </td>
                                </tr>
                                {{~}}
                            </tbody>
                        </table>
                    </div>

                    <div class="w-100">
                        <style>
                            #tableCarteraEstado {
                                table-layout: fixed;
                                width: 900px;
                            }

                        </style>

                        <h5 class="mt-4">Estados Cartera Vencida</h5>
                        <table id="tableCarteraEstado" class="card table table-sm">
                            <colgroup>
                                <col width="500"></col>
                                <col width="150"></col>
                                <col width="150"></col>
                                <col width="100"></col>
                            </colgroup>
                            <tr>
                                <td></td>
                                <td class="text-end">
                                    <span class="badge rounded-pill text-bg-warning">{{=it.total.c}}</span>
                                </td>
                                <td class="text-end">
                                    <span class="badge rounded-pill text-bg-warning">
                                        {{=numberDecimal.format(it.total.s)}}
                                    </span>
                                </td>
                                <td>
                                </td>
                            </tr>
                            <tr>
                                <th class="w-500px">Estado</th>
                                <th class="w-150px">Cantidad</th>
                                <th class="w-150px">Total Facturas</th>
                                <th class="w-100px">Ver detalles</th>
                            </tr>
                            {{
                                let asegurador = "";
                            }}
                            {{~ it.detail: d:id}}
                            {{? asegurador != d.a}}
                            <tr class="title">
                                <td colspan="4">
                                    <span class="badge rounded-pill text-bg-warning">{{=d.a}}</span>
                                </td>
                            </tr>
                            {{?}}
                            {{
                                asegurador = d.a;
                            }}
                            <tr>
                                <td class="border-bottom-none">
                                    <span class="badge rounded-pill
                                        {{? d.o == 7}}
                                        text-bg-success
                                        {{??}}
                                        text-bg-danger
                                        {{?}}
                                    ">{{=d.o}}</span>&nbsp;
                                    <b>{{=d.e}}</b>
                                </td>
                                <td class="text-end border-bottom-none">
                                    <span class="badge rounded-pill
                                        {{? d.o == 7}}
                                        text-bg-success
                                        {{??}}
                                        text-bg-danger
                                        {{?}}
                                    ">{{=d.c}}</span>
                                </td>
                                <td class="text-end border-bottom-none">
                                    <span class="badge rounded-pill
                                        {{? d.o == 7}}
                                        text-bg-success
                                        {{??}}
                                        text-bg-danger
                                        {{?}}
                                    ">
                                        {{=numberDecimal.format(d.s)}}
                                    </span>
                                </td>
                                <td class="text-center border-bottom-none">
                                    <img class="d-inline-block icon-excel"
                                        src="assets/images/icons/excel.svg" alt=""
                                        data-ia="{{=d.id}}" data-ie="{{=d.ie}}"
                                    >
                                </td>
                            </tr>

                            {{?d.d !== ""}}
                            <tr>
                                <td colspan="4" class="ps-5 pt-0 border-top-none">
                                    <small>{{=d.d}}</small>
                                </td>
                            </tr>
                            {{?}}

                            {{~}}
                        </table>
                    </div>
                </div>
            `;

            const dataCarteraNoSoat = data.filter(function (record) {
                return record.id == 0;
            });

            const dataCarteraEstados = data.filter(function (record) {
                return record.id != 0;
            });

            const html = doT.template(template)(
                {
                    detailNoSoat: dataCarteraNoSoat,
                    detail: dataCarteraEstados,
                    total: dataTotal,
                    totalAsegurador: dataTotalAsegurador
                }
            );
            //document.querySelector("#box-2").innerHTML = html;
            document.querySelector("#box-2").render(html);

            //#region evento delegado
            document.querySelector("#tableCarteraEstado").addEventListener("click", function (event) {
                const element = event.target;
                if (element.classList.contains("icon-excel")) {
                    const idAsegurador = element.dataset.ia;
                    const idEstado = element.dataset.ie;
                    if (idAsegurador == 1 && idEstado == 2) {
                        window.open("http://homi.artemisaips.com/server/php/backend/public/excel/get/" + idAsegurador + "/" + idEstado + "/2");
                    }
                    else {
                        window.open("http://homi.artemisaips.com/server/php/backend/public/excel/get/" + idAsegurador + "/" + idEstado);
                    }
                }
            });
            //#endregion
        },
    },

    detalle: {
        render: function () {
            console.log("app.cartera.detalle.render");
            const data = nata.localStorage.getItem("cartera-detalle");
            console.log(data);

            const year = new Date().getFullYear();

            const oDialog = new nataUIDialog({
                html: `
                    <div id="containerDetalleCartera"></div>
                `,
                title: `
                    Detalle Cartera SOAT&nbsp;&nbsp;<span class="badge rounded-pill text-bg-warning">${year}</span>
                `,
                events: {
                    render: function () { },
                    close: function () { },
                },
            });

            console.log(oDialog);

            //#region render lista
            const element = document
                .querySelector("#" + oDialog.id)
                .querySelector(".ui-dialog-body");
            console.log(element);

            const templateLayout = `
                {{? it.search}}
                <header class="d-inline-block w-100">
                    <div class="input-group flex-nowrap">
                        <span class="input-group-text" id="addon-wrapping">
                            <img src="assets/images/icons/search.svg" alt="">
                        </span>
                        <input id="txtSearchLayout-{{=it.id}}" type="text" class="form-control input-search" placeholder="Buscar ..." aria-label="Buscar"
                            aria-describedby="addon-wrapping">
                        <button id="buttonSearchClear-{{=it.id}}" type="button" class="btn btn-primary button-search-clear">
                            <img src="assets/images/icons/close-circle-white.svg" alt="">
                        </button>
                    </div>
                </header>
                {{?}}
                <style>
                    table.table-cartera-detalle {
                        table-layout: fixed;
                        width: 1080px;
                    }
                </style>
                <div id="scroll-{{=it.id}}" class="clusterize-scroll">
                    <table class="table table-sm table-cartera-detalle table-striped">
                        <colgroup>
                            <col width="120"></col>
                            <col width="140"></col>
                            <col width="140"></col>
                            <col width="140"></col>
                            <col width="250"></col>
                            <col width="100"></col>
                            <col width="100"></col>
                        </colgroup>
                        <thead>
                            <tr>
                                <th>Número Factura</th>
                                <th>Fecha Factura</th>
                                <th>Fecha Radicado</th>
                                <th>Nit Asegurador</th>
                                <th>Asegurador</th>
                                <th>Estado Factura</th>
                                <th>Saldo</th>
                            </tr>
                        </thead>
                        <tbody id="{{=it.id}}"></tbody>
                    </table>
                </div>
            `;

            const templateRender = `
                <tr>
                    <td>{{=it.f}}</td>
                    <td class="text-end">{{=it.ff}}</td>
                    <td class="text-end">{{=it.fr}}</td>
                    <td class="text-end">{{=it.n}}</td>
                    <td>{{=it.ta}}</td>
                    <td>{{=it.ef}}</td>
                    <td class="text-end">{{=numberDecimal.format(it.s)}}</td>
                </tr>
            `;

            const oConfig = {
                element: element,
                fieldsFilter: ["f", "ff", "fr", "n", "ta", "ef", "s"], // TODO: aqui van los atributos del json si se filtra o busca
                templateLayout: templateLayout,
                templateRender: templateRender,
                search: true,
            };
            const index = "cartera-detalle";
            console.log(data);
            new nataUIList({}, oConfig, {}, index, data);
            //#endregion render lista
        },
    },

    informe: {
        estadoVencimiento: {
            adapter: function (data) {
                console.log("app.cartera.informe.estadoVencimiento.adapter");
                const dataAdapter = [];
                dataAdapter.push({
                    name: "Cartera Corriente",
                    value: parseFloat(data[0].cc),
                    groupId: "cc"
                });

                dataAdapter.push({
                    name: "Cartera Vencida",
                    value: parseFloat(data[0].cv),
                    groupId: "cv"
                });

                dataAdapter.push({
                    name: "Cartera Difícil Cobro",
                    value: parseFloat(data[0].cd),
                    groupId: "cd"
                });

                dataAdapter.push({
                    name: "Cartera Recaudo Efectivo",
                    value: parseFloat(data[0].cr),
                    groupId: "cr"
                });
                return dataAdapter;
            },
            table: {
                render: function () {
                    console.log("app.cartera.informe.estadoVencimiento.table.render");
                    const data = nata.localStorage.getItem("cartera-informe");
                    const dataView = app.cartera.informe.estadoVencimiento.adapter(data);
                    console.log(dataView);

                    const template = `
                        <style>
                            #tableEstadoVencimientoCartera {
                                table-layout: fixed;
                                width: 470px;

                            }
                        </style>
                        <table id="tableEstadoVencimientoCartera" class="table table-sm">
                            <colgroup>
                                <col width="350"></col>
                                <col width="120"></col>
                            </colgroup>
                            <tr>
                                <th>Estado Vencimiento</th>
                                <th>Valor</th>
                            </tr>
                            {{~ it.detail: d:id}}
                            <tr>
                                <td>{{=d.name}}</td>
                                <td class="text-end">{{=numberDecimal.format(d.value)}}</td>
                            </tr>
                            {{~}}
                        </table>
                    `;
                    const html = doT.template(template)({ detail: dataView });
                    new nataUIDialog({
                        width: 700,
                        height: 600,
                        html: html,
                        title: "Estado Vencimiento Cartera"
                    });
                }
            }
        },

        adapter: function (data) {
            console.log("app.cartera.informe.adapter");
            const dataAdapter = [];
            dataAdapter.push({
                name: "Cartera Corriente",
                value: parseFloat(data[0].cc),
                groupId: "cc"
            });

            dataAdapter.push({
                name: "Cartera Vencida",
                value: parseFloat(data[0].cv),
                groupId: "cv"
            });

            dataAdapter.push({
                name: "Cartera Difícil Cobro",
                value: parseFloat(data[0].cd),
                groupId: "cd"
            });

            dataAdapter.push({
                name: "Cartera Recaudo Efectivo",
                value: parseFloat(data[0].cr),
                groupId: "cr"
            });
            return dataAdapter;
        },

        render: function (data) {
            console.log("%c app.cartera.informe.render ", "background:red;color:white;font-weight:bold;font-size:11px");
            console.log(data);

            const dataChart = app.cartera.informe.adapter(data);
            console.log(dataChart);
            nata.ui.charts.echarts.doughnutChart.render("box-4-chart", "Estado Vencimiento Cartera", dataChart, "Cartera Vencimiento");

            /*
            const oTitle = document.createElement("h5");
            oTitle.innerHTML = "Estado Vencimiento Cartera";
            const oElement = document.querySelector("#box-4");
            const firtsElement = oElement.firstChild;
            oElement.insertBefore(oTitle, firtsElement);
            */
            //document.querySelector("#box-4").prepend("<h6>Estado de Cartera</h6>");
        }
    },

    total: {
        render: function (data) {
            console.log("app.cartera.total.render");
            console.log(data);

            const year = new Date().getFullYear();

            const template = `
                <div>
                    <style>
                        #tableTotal {
                            table-layout: fixed;
                            width: 890px;

                        }
                    </style>
                    <table id="tableTotal" class="table table-sm">
                        <colgroup>
                            <col width="220"></col>
                            <col width="220"></col>
                            <col width="220"></col>
                            <col width="230"></col>
                        </colgroup>
                        <tr>
                            <td>
                                Totales Cartera SOAT&nbsp;&nbsp;<span class="badge rounded-pill text-bg-warning">${year}</span>
                            </td>

                            <td>
                                Total &nbsp;&nbsp;
                                <span class="badge rounded-pill text-bg-warning">{{=numberDecimal.format(it.t)}}</span>
                            </td>

                            <td>
                                Cantidad Facturas&nbsp;&nbsp;
                                <span class="badge rounded-pill text-bg-warning">{{=numberDecimal.format(it.facturas)}}</span>
                            </td>
                            <td>
                                Cantidad Aseguradoras&nbsp;&nbsp;
                                <span class="badge rounded-pill text-bg-warning">{{=numberDecimal.format(it.aseguradoras)}}</span>
                            </td>
                        </tr>
                    </table>
                </div>
            `;

            // totales
            const strSQL = `
                SELECT
                    SUM(s::number) AS t,
                    COUNT(DISTINCT f) AS facturas,
                    COUNT(DISTINCT ta) AS aseguradoras
                FROM ? `;
            const dataTotal = alasql(strSQL, [data]);
            console.log(dataTotal);
            const html = doT.template(template)(dataTotal[0]);
            document.querySelector("#box-1").innerHTML = html;

        },
    },

    totalAsegurador: function () {
        console.log("app.cartera.totalAsegurador");
        console.log("prueba de app total Aseguradora");
        const data = nata.localStorage.getItem("cartera-total-asegurador");
        console.log(data);
        const template = `
            <style>
                #tableCarteraTotalAsegurador {
                    table-layout: fixed;
                    width: 500px;

                }
            </style>
            <table id="tableCarteraTotalAsegurador" class="table table-sm">
                <colgroup>
                    <col width="350"></col>

                    <col width="150"></col>
                </colgroup>
                <tr>
                    <th>Aseguradora</th>
                    <th>Cantidad factura</th>
                    <th>Total</th>
                </tr>
                {{~ it.detail: d:id}}
                <tr>
                    <td>{{=d.a}}</td>
                    <td class="text-end">
                        <span class="badge rounded-pill text-bg-primary">{{=numberDecimal.format(d.c)}}</span>
                    </td>
                    <td class="text-end">
                        <span class="badge rounded-pill text-bg-primary">{{=numberDecimal.format(d.s)}}</span>
                    </td>
                </tr>
                {{~}}
            </table>
        `;
        const html = doT.template(template)({ detail: data });
        new nataUIDialog({
            html: html,
            title: "Cartera Vencida por Asegurador",
            events: {
                render: function () { },
                close: function () { },
            },
        });
    },
    otroAseguradores: function (response = nata.localStorage.getItem("cartera-aseguradores-radicar")) {
        console.log("%c app.cartera.otroAseguradores", "background:red;color:#fff;font-size:11px");
        document.getElementById("loader").style.display = "block";

        console.log(response);

        const options = {
            id: "tableRadicarEnProceso",
            columns: [
                {
                    title: "Numero Factura ",
                    width: "100",
                    prop: "id"
                },
                {
                    title: "Fecha",
                    width: "140",
                    prop: "f",
                    class: "text-end",
                },
                {
                    title: "Valor",
                    width: "140",
                    prop: "v",
                    class: "text-end",
                    type: "number"
                },
                {
                    title: "Dias vencimiento",
                    width: "140",
                    prop: "dtf",
                    class: "text-end",
                    widget: {
                        w: "badge",
                        c: "text-bg-danger pulse-red"
                    }
                },
                {
                    title: "Dias Vencimiento Contrato Crescend",
                    width: "140",
                    prop: "dtc",
                    class: "text-end",
                    widget: {
                        w: "badge",
                        c: "text-bg-danger pulse-red"
                    }
                },
                {
                    title: "Días Vencimiento Solicitud Crescend",
                    width: "140",
                    prop: "dtn",
                    class: "text-end",
                    widget: {
                        w: "badge",
                        c: "text-bg-danger pulse-red"
                    }
                },
                {
                    title: "",
                    width: "140",
                    html: `
                        <button type="button"
                            class="btn btn-primary btn-sm btn-soportes visible-[p1]"
                            data-id="[id]">
                            <svg class="btn-soportes" data-id="[id]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                            </svg>
                        </button>
                    `
                }
            ],
            data: response
        };
        nata.sessionStorage.setItem("widget", options);

        new nataUIDialog({
            html: "<nata-ui-table></nata-ui-table>",
            title: `
                Facturas otros aseguradores en proceso de preparación para radicación&nbsp;&nbsp;
                <span class="badge rounded-pill text-bg-danger pulse-red">
                    ${response.length}
                </span>
            `,
            toolbar: `
                <div class="btn-group">
                    <button type="button" class="btn btn-primary dropdown-toggle btn-circle" data-bs-toggle="dropdown" aria-expanded="false">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                        </svg>

                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item">Descargar</a></li>
                    </ul>
                </div>
            `
        });

        document.querySelector("#tableRadicarEnProceso").addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            const element = event.target;
            if (element.classList.contains("btn-soportes")) {
                const numeroFactura = element.dataset.id;
                axios.get("https://cdn1.artemisaips.com/index.php?k=soat&x=soportesVer&y=" + app.config.client + "&w=" + numeroFactura + "&z=2")
                    .then((function (response) {
                        console.log(response.data);

                        const template = `
                            <ul class="list-group">
                                {{~ it.detail: d:id}}
                                <li class="list-group-item">
                                    <a href="https://cdn1.artemisaips.com/5cb3f764-e920-45a2-a60a-db50418e8ffa/{{=d.f}}" target="_new">
                                        {{=d.f}}
                                    </a>
                                </li>
                                {{~}}
                            </ul>
                        `;
                        const html = doT.template(template)({ detail: response.data });

                        new nataUIDialog({
                            html: html,
                            title: `
                                Soportes <span class="badge rounded-pill text-bg-primary">${numeroFactura}</span>
                            `,
                            events: {
                                render: function () { },
                                close: function () {
                                    document.querySelector("#chatBubble").style.display = "none";
                                }
                            }
                        });

                    })).catch((function (error) {
                        console.error(error);
                    }));
            }
        });

        // fix ocultar botones de soporte
        const element = document.querySelector("#tableRadicarEnProceso");
        console.log(element);
        const arrElements = element.querySelectorAll(".visible-0");
        console.log(arrElements);
        let i;
        for (i = 0; i < arrElements.length; i++) {
            console.log(arrElements[i].style.display = "none");
        }

        document.getElementById("loader").style.display = "none";
    }

};

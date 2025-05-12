/* globals app, axios, nataUIDialog, doT, swal */

app.glosa = {
    adres: {
        responder: function () {
            console.log("app.glosa.adres.responder");
            axios.get(app.config.server.php1 + "x=glosa&y=adres_responder")
                .then((function (response) {
                    console.log(response.data);
                    /*
                    const options = {
                        id: "tableGlosaAdresEstados",
                        columns: [
                            {
                                title: "ID Estado",
                                width: "80",
                                prop: "ie"
                            },
                            {
                                title: "Estado",
                                width: "250",
                                prop: "e",
                                type: "title"
                            },
                            {
                                title: "Cantidad Facturas",
                                width: "100",
                                prop: "c",
                                widget: {
                                    w: "badge",
                                    c: "text-bg-danger pulse-red"
                                }
                            },
                            {
                                title: "Saldo",
                                width: "150",
                                prop: "s",
                                type: "number"
                            },
                            {
                                title: "Saldo",
                                width: "140",
                                prop: "s",
                                type: "number",
                                class: "text-end",
                                widget: {
                                    w: "badge",
                                    c: "text-bg-danger pulse-red"
                                }
                            },
                            {
                                title: "test",
                                width: "140",
                                prop: "l",
                                render: function (value, record) {
                                    if (value == "responder") {
                                        return `<span class="badge rounded-pill text-bg-danger">${record["s"]}</span>`;
                                    }
                                    else {
                                        return record["s"];
                                    }
                                }
                            }
                        ]
                    };
                    options.data = response.data;
                    nata.sessionStorage.setItem("widget", options);
                    */
                    const template = `
                        <style> #tableGlosaAdresEstados { table-layout: fixed; width: 780px; } } </style>
                        <table
                            id="tableGlosaAdresEstados"
                            class="table table-striped table-hover nata-ui-table"
                            >
                            <colgroup>
                                <col width="80" />
                                <col width="250" />
                                <col width="100" />
                                <col width="150" />
                                <col width="200" />
                            </colgroup>
                            <thead>
                                <tr>
                                <th class="text-center">ID Estado</th>
                                <th class="text-center">Estado</th>
                                <th class="text-center">Cantidad Facturas</th>
                                <th class="text-center">Saldo</th>
                                <th class="text-center"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {{~ it.detail: d:i}}
                                <tr>
                                    <td>{{=d.ie}}</td>
                                    <td>
                                        <h6>{{=d.e}}</h6>
                                    </td>
                                    <td class="text-end">
                                        {{? d.l == "responder"}}
                                        <span class="badge rounded-pill text-bg-danger pulse-red">{{=d.c}}</span>
                                        {{??}}
                                        <span class="badge rounded-pill text-bg-dark">{{=d.c}}</span>
                                        {{?}}
                                    </td>
                                    <td class="text-end">
                                        {{? d.l == "responder"}}
                                        <span class="badge rounded-pill text-bg-danger pulse-red">{{=numberDecimal.format(d.s)}}</span>
                                        {{??}}
                                        <span class="badge rounded-pill text-bg-dark">{{=numberDecimal.format(d.s)}}</span>
                                        {{?}}
                                    </td>
                                    <td class="text-center">
                                        {{? d.l == "responder"}}
                                        <button
                                            type="button"
                                            class="btn btn-danger btn-sm"
                                            onclick="app.glosa.adres.step1({{=d.ie}});"
                                            >
                                                Gestionar
                                            </button>
                                        {{?}}
                                    </td>
                                </tr>
                                {{~}}
                            </tbody>
                        </table>
                    `;
                    const html = doT.template(template)({ detail: response.data });
                    new nataUIDialog({
                        /*
                        html: `
                            <div class="w-100">
                                <nata-ui-table></nata-ui-table>
                            </div>
                        `,
                        */
                        html: html,
                        title: "Estados Gestión Facturas Glosa Adres",
                        events: {
                            render: function () { },
                            close: function () { }
                        }
                    });
                })).catch((function (error) {
                    console.error(error);
                }));
        },

        actualizar: function (inputElement) {
            console.log("app.glosa.adres.actualizar");

            const consecutivo = inputElement.getAttribute("data-consecutivo");
            const field = inputElement.getAttribute("data-field");
            const value = inputElement.value;

            const data = {
                c: consecutivo,
                [field]: value
            };
            console.log(data);
            axios.post(app.config.server.php1 + "x=glosa&y=actualizar", data)
                .then(function (response) {
                    console.log(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        },

        step1: function (idEstado) {
            console.log("app.glosa.adres.step1");
            axios.get(app.config.server.php1 + "x=glosa&y=adres_responder_step1&z=" + idEstado)
                .then((function (response) {
                    console.log(response.data);
                    /*
                    const options = {
                        id: "tableGlosaAdresFacturasPorEstado",
                        columns: [
                            {
                                title: "Factura",
                                width: "100",
                                prop: "f"
                            },
                            {
                                title: "Saldo",
                                width: "150",
                                prop: "s",
                                type: "number"
                            },
                            {
                                title: "",
                                width: "150",
                                class: "text-end",
                                html: `
                                    <button
                                        type="button"
                                        class="btn btn-primary btn-sm"
                                        onclick="app.glosa.adres.step2('[id]')"
                                    >Gestionar</button>
                                `
                            }
                        ]
                    };
                    options.data = response.data;
                    nata.sessionStorage.setItem("widget", options);
                    */
                    const template = `
                        <style>
                            #tableGlosaAdresFacturasPorEstado {
                                table-layout: fixed;
                                width: 400px;
                            }
                        </style>
                        <table
                            id="tableGlosaAdresFacturasPorEstado"
                            class="table table-striped table-hover nata-ui-table"
                        >
                            <colgroup>
                                <col width="100" />
                                <col width="100" />
                                <col width="150" />
                                <col width="150" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th class="text-center">Consecutivo</th>
                                    <th class="text-center">Factura</th>
                                    <th class="text-center">Saldo</th>
                                    <th class="text-center"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {{~ it.detail: d:i}}
                                <tr>
                                    <td class="">{{=i+1}}</td>
                                    <td class="">{{=d.f}}</td>
                                    <td class="text-end">{{=numberDecimal.format(d.s)}}</td>
                                    <td class="text-end">
                                        <button
                                            type="button"
                                            class="btn {{? d.cg == d.cgr}}btn-success{{??}}btn-danger{{?}} btn-sm"
                                            onclick="app.glosa.adres.step2('{{=d.f}}')"
                                        >
                                        Gestionar
                                        </button>
                                    </td>
                                </tr>
                                {{~}}
                            </tbody>
                        </table>
                    `;
                    const html = doT.template(template)({ detail: response.data });
                    new nataUIDialog({
                        /*html: `
                            <div class="w-100">
                                <nata-ui-table></nata-ui-table>
                            </div>
                        `,*/
                        html: html,
                        title: "Facturas pendientes por gestionar",
                        events: {
                            render: function () { },
                            close: function () { }
                        }
                    });

                })).catch((function (error) {
                    console.error(error);
                }));
        },

        step2: function (factura) {
            console.log("app.glosa.adres.step2");
            axios.get(app.config.server.php1 + "x=glosa&y=adres_responder_step2&z=" + factura)
                .then((function (response) {
                    console.log(response.data);

                    if(response.data && response.data.length == 0){
                        swal("Información", "No se ha cargado detalle de glosa de está factura", "info");
                        return;
                    }

                    app.core.robot.message("Por favor valida que la glosa que vas a responder corresponda a la última generada por el asegurador.");

                    /*
                    const options = {
                        id: "tableGlosaAdresFactura",
                        columns: [
                            {
                                title: "Factura",
                                width: "100",
                                prop: "f"
                            },
                            {
                                title: "Consecutivo",
                                width: "100",
                                prop: "c"
                            },
                            {
                                title: "ID Glosa",
                                width: "100",
                                prop: "ig"
                            },
                            {
                                title: "Descripción Glosa",
                                width: "250",
                                prop: "d"
                            },
                            {
                                title: "Anotación Glosa",
                                width: "250",
                                prop: "a"
                            },
                            {
                                title: "Item Facturado",
                                width: "200",
                                prop: "e"
                            },
                            {
                                title: "Valor Glosado",
                                width: "135",
                                prop: "vg",
                                type: "number"
                            },
                            {
                                title: "Valor No Aceptado",
                                width: "135",
                                prop: "vna",
                                type: "number"
                            },
                            {
                                title: "Valor Aceptado",
                                width: "135",
                                prop: "va",
                                type: "number"
                            },
                            {
                                title: "Respuesta",
                                width: "200",
                                prop: "r"
                            },
                            {
                                title: "",
                                width: "150",
                                class: "text-end",
                                html: `
                                    <button
                                        type="button"
                                        class="btn btn-primary btn-sm"
                                        onclick="app.glosa.adres.step2('[id]')"
                                    >Gestionar</button>
                                `
                            }
                        ]
                    };
                    options.data = response.data;
                    nata.sessionStorage.setItem("widget", options);
                    */
                    const template = `
                        <style> #tableGlosaAdresFactura { table-layout: fixed; width: 1405px; }</style>
                        <table
                            id="tableGlosaAdresFactura"
                            class="table table-borderless table-sm"
                            >
                            <colgroup>
                                <col width="100" />
                                <col width="100" />
                                <col width="100" />
                                <col width="250" />
                                <col width="250" />
                                <col width="200" />
                                <col width="135" />
                                <col width="135" />
                                <col width="135" />
                            </colgroup>
                            <thead>
                                <tr>
                                <th class="text-center">Factura</th>
                                <th class="text-center">Consecutivo</th>
                                <th class="text-center">ID Glosa</th>
                                <th class="text-center">Descripción Glosa</th>
                                <th class="text-center">Anotación Glosa</th>
                                <th class="text-center">Item Facturado</th>
                                <th class="text-center">Valor Glosado</th>
                                <th class="text-center">Valor No Aceptado</th>
                                <th class="text-center">Valor Aceptado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {{~ it.detail: d:i}}
                                <tr
                                    {{? d.r.trim() == "" || d.vna == "" || d.va == ""}}
                                    class="table-danger border-top-4px-fff"
                                    {{??}}
                                    class="verde-claro-1 border-top-4px-fff"
                                    {{?}}
                                >
                                    <td class="">{{=d.f}}</td>
                                    <td class="">{{=d.c}}</td>
                                    <td class="">{{=d.ig}}</td>
                                    <td class="">
                                        {{=d.d}}
                                    </td>
                                    <td class="">
                                        {{=d.a}}
                                    </td>
                                    <td class="">
                                        {{=d.e}}
                                    </td>
                                    <td class="text-end">{{=numberDecimal.format(d.vg)}}</td>
                                    <!--<td class="text-end">{{=numberDecimal.format(d.vna)}}</td>
                                    <td class="text-end">{{=numberDecimal.format(d.va)}}</td>-->
                                    
                                    {{? d.vna == ''}}
                                        <td class="text-center">
                                            <input type="number" class="form-control form-control-sm valor-actualizar" style="max-width: 80%; float: right;" value=""
                                                data-consecutivo="{{=d.c}}" 
                                                data-field="vna"
                                                onchange="app.glosa.adres.actualizar(this)"
                                            >
                                        </td>
                                    {{??}}
                                        <td class="text-end">
                                            {{=numberDecimal.format(d.vna)}}
                                        </td>
                                    {{?}}

                                    {{? d.va == ''}}
                                        <td class="text-center">
                                            <input type="number" class="form-control form-control-sm valor-actualizar" style="max-width: 80%; float: right;" value=""
                                                data-consecutivo="{{=d.c}}" 
                                                data-field="va"
                                                onchange="app.glosa.adres.actualizar(this)"
                                            >
                                        </td>
                                    {{??}}
                                        <td class="text-end">
                                            {{=numberDecimal.format(d.va)}}
                                        </td>
                                    {{?}}
                                </tr>
                                <tr
                                    {{? d.r.trim() == "" || d.vna == "" || d.va == ""}}
                                    class="table-danger"
                                    {{??}}
                                    class="verde-claro-1"
                                    {{?}}
                                >
                                    <td colspan="9" class="text-center">
                                        <textarea class="d-inline-block mb-2 form-control w-98 font-size-13px min-height-70px"
                                            rows="4"
                                            data-consecutivo="{{=d.c}}" 
                                            data-field="r"
                                            onchange="app.glosa.adres.actualizar(this)"
                                        >{{=d.r.trim()}}</textarea>
                                    </td>
                                </tr>
                                {{~}}
                            </tbody>
                        </table>
                    `;
                    const html = doT.template(template)({ detail: response.data });
                    new nataUIDialog({
                        /*
                        html: `
                            <div class="w-100">
                                <nata-ui-table></nata-ui-table>
                            </div>
                        `,
                        */
                        html: html,
                        title: "Facturas pendientes por gestionar",
                        toolbar: `
                            <div class="dropdown d-inline-block">
                                <button class="btn btn-primary dropdown-toggle btn-circle" 
                                    type="button" data-bs-toggle="dropdown">
                                    <svg fill="none" 
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"></path>
                                    </svg>
                                </button>
                                <ul class="dropdown-menu">
                                    <li>
                                        <a id="buttonSoporte" data-id="{{=it.nf}}" class="dropdown-item" href="javascript:void(0);" onclick="app.monitor.soporte.index('${factura}')">
                                            <svg class="svg-icon d-inline-block me-3" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                            </svg>
                                            Ver soportes
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        `,
                        events: {
                            render: function () { },
                            close: function () { }
                        }
                    });

                    document.querySelectorAll('.valor-actualizar').forEach(input => {
                        input.addEventListener('input', function () {
                            const parentRow = input.closest('tr');
                            console.log(parentRow);
                            const valorGlosado = parseFloat(parentRow.children[6].textContent.trim().replace(/,/g, '')) || 0;
                            const valorAceptadoInput = parentRow.children[7].children[0];
                            const valorNoAceptadoInput = parentRow.children[8].children[0];

                            let newValue = parseFloat(input.value.trim().replace(/\./g, '')) || 0;

                            if (newValue > valorGlosado) {
                                newValue = valorGlosado;
                                input.value = valorGlosado;
                            }

                            if (newValue < 0) {
                                newValue = 0;
                                input.value = 0;
                            }

                            if (input === valorAceptadoInput) {
                                valorNoAceptadoInput.value = (valorGlosado - newValue);
                            } else if (input === valorNoAceptadoInput) {
                                valorAceptadoInput.value = (valorGlosado - newValue);
                            }
                        });
                    });

                })).catch((function (error) {
                    console.error(error);
                }));
        }
    },

    responder: {
        index: function () {
            console.log("app.glosa.responder");
            axios.get(app.config.server.php1 + "x=glosa&y=responder_pendiente")
                .then((function (response) {
                    console.log(response.data);
                    const template = `
                            <style> #tableGlosaAdresEstados { table-layout: fixed; width: 780px; } } </style>
                            <table
                                id="tableGlosaAdresEstados"
                                class="table table-striped table-hover nata-ui-table"
                                >
                                <colgroup>
                                    <col width="80" />
                                    <col width="250" />
                                    <col width="100" />
                                    <col width="150" />
                                    <col width="200" />
                                </colgroup>
                                <thead>
                                    <tr>
                                    <th class="text-center">ID Estado</th>
                                    <th class="text-center">Estado</th>
                                    <th class="text-center">Cantidad Facturas</th>
                                    <th class="text-center">Saldo</th>
                                    <th class="text-center"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {{~ it.detail: d:i}}
                                    <tr>
                                        <td>{{=d.ie}}</td>
                                        <td>
                                            <h6>{{=d.e}}</h6>
                                        </td>
                                        <td class="text-end">
                                            {{? d.l == "responder"}}
                                            <span class="badge rounded-pill text-bg-danger pulse-red">{{=d.c}}</span>
                                            {{??}}
                                            <span class="badge rounded-pill text-bg-dark">{{=d.c}}</span>
                                            {{?}}
                                        </td>
                                        <td class="text-end">
                                            {{? d.l == "responder"}}
                                            <span class="badge rounded-pill text-bg-danger pulse-red">{{=numberDecimal.format(d.s)}}</span>
                                            {{??}}
                                            <span class="badge rounded-pill text-bg-dark">{{=numberDecimal.format(d.s)}}</span>
                                            {{?}}
                                        </td>
                                        <td class="text-center">
                                            {{? d.l == "responder"}}
                                            <button
                                                type="button"
                                                class="btn btn-danger btn-sm"
                                                onclick="app.glosa.responder.step1({{=d.ie}});"
                                                >
                                                    Gestionar
                                                </button>
                                            {{?}}
                                        </td>
                                    </tr>
                                    {{~}}
                                </tbody>
                            </table>
                        `;
                    const html = doT.template(template)({ detail: response.data });
                    new nataUIDialog({
                        /*
                        html: `
                            <div class="w-100">
                                <nata-ui-table></nata-ui-table>
                            </div>
                        `,
                        */
                        html: html,
                        title: "Estados Gestión Facturas Glosa Adres",
                        events: {
                            render: function () { },
                            close: function () { }
                        }
                    });
                })).catch((function (error) {
                    console.error(error);
                }));
        },

        step1: function (idEstado) {
            console.log("app.glosa.responder.step1");

            axios.get(app.config.server.php1 + "x=glosa&y=responder_pendiente_step1&z=" + idEstado)
                .then((function (response) {
                    console.log(response.data);
                    const template = `
                        <style>
                            #tableGlosaAdresFacturasPorEstado {
                                table-layout: fixed;
                                width: 400px;
                            }
                        </style>
                        <table
                            id="tableGlosaAdresFacturasPorEstado"
                            class="table table-striped table-hover nata-ui-table"
                        >
                            <colgroup>
                                <col width="100" />
                                <col width="100" />
                                <col width="150" />
                                <col width="150" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th class="text-center">Consecutivo</th>
                                    <th class="text-center">Factura</th>
                                    <th class="text-center">Saldo</th>
                                    <th class="text-center"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {{~ it.detail: d:i}}
                                <tr>
                                    <td class="">{{=i+1}}</td>
                                    <td class="">{{=d.f}}</td>
                                    <td class="text-end">{{=numberDecimal.format(d.s)}}</td>
                                    <td class="text-end">
                                        <div class="dropdown d-inline-block me-1">
                                            <button class="btn btn-primary dropdown-toggle btn-circle" 
                                                type="button" data-bs-toggle="dropdown">
                                                <svg fill="none" 
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"></path>
                                                </svg>
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li>
                                                    <a id="buttonSoporte" data-id="{{=it.nf}}" class="dropdown-item" href="javascript:void(0);" onclick="app.monitor.soporte.index('{{=d.f}}')">
                                                        <svg class="svg-icon d-inline-block me-3" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#212529" class="size-6">
                                                            <path class="strogStroke" stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                                        </svg>
                                                        Ver soportes
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <button
                                            type="button"
                                            class="btn {{? d.cg == d.cgr && d.cg > 0}}btn-success{{??}}btn-danger{{?}} btn-sm"
                                            onclick="app.glosa.adres.step2('{{=d.f}}')"
                                        >
                                        Gestionar
                                        </button>
                                    </td>
                                </tr>
                                {{~}}
                            </tbody>
                        </table>
                    `;
                    const html = doT.template(template)({ detail: response.data });
                    new nataUIDialog({
                        /*html: `
                            <div class="w-100">
                                <nata-ui-table></nata-ui-table>
                            </div>
                        `,*/
                        html: html,
                        title: "Facturas pendientes por gestionar",
                        toolbar: `
                            <div class="dropdown d-inline-block">
                                <button class="btn btn-primary dropdown-toggle btn-circle" 
                                    type="button" data-bs-toggle="dropdown">
                                    <svg fill="none" 
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"></path>
                                    </svg>
                                </button>
                                <ul class="dropdown-menu">
                                    <li>
                                        <a class="dropdown-item dropdown-toggle" href="javascript:void(0);">
                                            <svg class="svg-icon d-inline-block me-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                            </svg>
                                            Plantillas
                                        </a>
                                        <ul class="dropdown-menu">
                                            <li>
                                                <a class="dropdown-item" 
                                                    onclick="window.open('https://cdn1.artemisaips.com/docs/plantillas/temporal_cartera_glosa_detalle.xlsx', '_blank')" 
                                                    href="javascript:void(0);"
                                                >
                                                    Carga detalles de glosa
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        `,
                        events: {
                            render: function () { },
                            close: function () { }
                        }
                    });

                })).catch((function (error) {
                    console.error(error);
                }));
        },

        step2: function (factura) {
            console.log("app.glosa.adres.step2");
            axios.get(app.config.server.php1 + "x=glosa&y=adres_responder_step2&z=" + factura)
                .then((function (response) {
                    console.log(response.data);
                    const template = `
                        <style> #tableGlosaAdresFactura { table-layout: fixed; width: 1405px; }</style>
                        <table
                            id="tableGlosaAdresFactura"
                            class="table table-borderless table-sm"
                            >
                            <colgroup>
                                <col width="100" />
                                <col width="100" />
                                <col width="100" />
                                <col width="250" />
                                <col width="250" />
                                <col width="200" />
                                <col width="135" />
                                <col width="135" />
                                <col width="135" />
                            </colgroup>
                            <thead>
                                <tr>
                                <th class="text-center">Factura</th>
                                <th class="text-center">Consecutivo</th>
                                <th class="text-center">ID Glosa</th>
                                <th class="text-center">Descripción Glosa</th>
                                <th class="text-center">Anotación Glosa</th>
                                <th class="text-center">Item Facturado</th>
                                <th class="text-center">Valor Glosado</th>
                                <th class="text-center">Valor No Aceptado</th>
                                <th class="text-center">Valor Aceptado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {{~ it.detail: d:i}}
                                <tr
                                    {{? d.r.trim() == ""}}
                                    class="table-danger border-top-4px-fff"
                                    {{??}}
                                    class="verde-claro-1 border-top-4px-fff"
                                    {{?}}
                                >
                                    <td class="">{{=d.f}}</td>
                                    <td class="">{{=d.c}}</td>
                                    <td class="">{{=d.ig}}</td>
                                    <td class="">
                                        {{=d.d}}
                                    </td>
                                    <td class="">
                                        {{=d.a}}
                                    </td>
                                    <td class="">
                                        {{=d.e}}
                                    </td>
                                    <td class="text-end">{{=numberDecimal.format(d.vg)}}</td>
                                    <!--<td class="text-end">{{=numberDecimal.format(d.vna)}}</td>
                                    <td class="text-end">{{=numberDecimal.format(d.va)}}</td>-->
                                    
                                    {{? d.vna == ''}}
                                        <td colspan="2" class="text-center">
                                            <input type="number" class="form-control form-control-sm valor-actualizar" style="max-width: 60%; float: right;" value="">
                                        </td>
                                    {{??}}
                                        <td colspan="2" class="text-end">
                                            {{=numberDecimal.format(d.vna)}}
                                        </td>
                                    {{?}}

                                    {{? d.va == ''}}
                                        <td colspan="2" class="text-center">
                                            <input type="number" class="form-control form-control-sm valor-actualizar" style="max-width: 60%; float: right;" value="">
                                        </td>
                                    {{??}}
                                        <td colspan="2" class="text-end">
                                            {{=numberDecimal.format(d.va)}}
                                        </td>
                                    {{?}}
                                </tr>
                                <tr
                                    {{? d.r.trim() == ""}}
                                    class="table-danger"
                                    {{??}}
                                    class="verde-claro-1"
                                    {{?}}
                                >
                                    <td colspan="9" class="text-center">
                                        <textarea class="d-inline-block mb-2 form-control w-98 font-size-13px min-height-70px"
                                            rows="4"
                                            data-consecutivo="{{=d.c}}"
                                            onchange="app.glosa.adres.actualizar({{=d.c}}, this.value);"
                                        >{{=d.r.trim()}}</textarea>
                                    </td>
                                </tr>
                                {{~}}
                            </tbody>
                        </table>
                    `;
                    const html = doT.template(template)({ detail: response.data });
                    new nataUIDialog({
                        /*
                        html: `
                            <div class="w-100">
                                <nata-ui-table></nata-ui-table>
                            </div>
                        `,
                        */
                        html: html,
                        title: "Facturas pendientes por gestionar",
                        events: {
                            render: function () { },
                            close: function () { }
                        }
                    });

                })).catch((function (error) {
                    console.error(error);
                }));
        }
    }
}
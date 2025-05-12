/* globals app, nata, session, localforage, swal, nataUIDialog, doT,axios,numberDecimal, 
    alasql, iconTable, iconBuilding, iconRobot, wizard */

app.core = {

    dashboard: {

        estado: {
            render: function (idEstado) {
                console.log("app.core.dashboard.estado.render");
                let data = nata.localStorage.getItem("soat-monitor");
                console.log(data);
                const options = {
                    id: "tableMonitorSOAT",
                    columns: [
                        {
                            title: "",
                            width: "120",
                            prop: "ii"
                        },
                        {
                            title: "Estado",
                            width: "250",
                            prop: "e",
                            class: "fw-bold"
                        },
                        {
                            title: "Responsable",
                            width: "140",
                            prop: "r",
                            widget: {
                                w: "badge",
                                c: "text-bg-danger pulse-red"
                            }
                        },
                        {
                            title: "Descripción",
                            width: "300",
                            prop: "d"
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
                            title: "",
                            width: "100",
                            prop: "c",
                            class: "text-end",
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
                            <div class="btn-group me-2" role="group" aria-label="First group">
                                <button type="button" class="btn btn-primary btn-detalle"
                                    data-id="[id]"
                                    data-id-perfil="${session.user.ir}"
                                    data-id-tipo="soat"
                                >
                                    <svg class="btn-detalle" data-id-tipo="soat" data-id="[id]" data-id-perfil="${session.user.ir}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                        <path class="btn-detalle" data-id-tipo="soat" data-id="[id]" data-id-perfil="${session.user.ir}" stroke-linecap="round" stroke-linejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </button>
                                <button type="button" class="btn btn-primary btn-detail-download" data-id="[id]">
                                    <svg class="btn-detail-download" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        data-id="[id]">
                                        <path
                                            data-id="[id]"
                                            class="btn-detail-download stroke-transparent fill-white" d="M5 3C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3H5M5 5H19V19H5V5M13 12L16.2 17H14.2L12 13.2L9.8 17H7.8L11 12L7.8 7H9.8L12 10.8L14.2 7H16.2L13 12Z" />
                                    </svg>
                                </button>
                            </div>
                            `
                        }

                    ],
                    data: data
                };
                nata.sessionStorage.setItem("widget", options);

                const optionsDialog = {
                    html: "",
                    title: "Gestión Cartera Estado",
                };
                const oDialog = new nataUIDialog(optionsDialog);
                console.log(oDialog);
                console.log(oDialog.dialog.querySelector(".ui-dialog-body"));
                oDialog.dialog.querySelector(".ui-dialog-body").innerHTML = `
                    <!-- CONTAINER 110 !-->
                    <div id="containerViewSOAT">
                        <nata-ui-table></nata-ui-table>
                    </div>
                `;
            }
        },

        filter: function (label) {
            console.log("app.core.dashboard.filter");
            // si se solicita el label "prescripcion-cliente" se debe recuperar la data de la tabla castigo
            // por que estas facturas en cartera_detalle tiene saldo 0
            console.log(label);
            if (label == "prescripcion-cliente") {
                axios.get(app.config.server.php1 + "k=cartera&x=clientePrescripcion")
                    .then((function (response) {
                        console.log(response.data);
                        const class_ = "bg-azul";
                        const options = {
                            id: "tableMonitorSOAT",
                            columns: [
                                {
                                    title: "",
                                    width: "120",
                                    prop: "ie"
                                },
                                {
                                    title: "Estado",
                                    width: "250",
                                    prop: "e",
                                    class: "fw-bold"
                                },
                                {
                                    title: "Responsable",
                                    width: "140",
                                    prop: "r",
                                    widget: {
                                        w: "badge",
                                        c: class_
                                    }
                                },
                                {
                                    title: "Descripción",
                                    width: "300",
                                    prop: "d"
                                },
                                {
                                    title: "Saldo",
                                    width: "140",
                                    prop: "s",
                                    type: "number",
                                    class: "text-end",
                                    widget: {
                                        w: "badge",
                                        c: class_
                                    }
                                },
                                {
                                    title: "",
                                    width: "100",
                                    prop: "c",
                                    class: "text-end",
                                    widget: {
                                        w: "badge",
                                        c: class_
                                    }
                                },
                                {
                                    title: "",
                                    width: "150",
                                    class: "text-end",
                                    html: `
                                        <div class="btn-group me-2" role="group" aria-label="First group">
                                            <button type="button" class="btn btn-primary btn-detalle"
                                                data-id="[id]"
                                                data-id-perfil="${session.user.ir}"
                                                data-id-tipo="soat"
                                            >
                                                <svg class="btn-detalle" data-id-tipo="soat" data-id="[id]" data-id-perfil="${session.user.ir}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path class="btn-detalle" data-id-tipo="soat" data-id="[id]" data-id-perfil="${session.user.ir}" stroke-linecap="round" stroke-linejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                            </button>
                                            <button type="button" class="btn btn-primary btn-detail-download" data-id="[id]">
                                                <svg class="btn-detail-download" xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    data-id="[id]">
                                                    <path
                                                        data-id="[id]"
                                                        class="btn-detail-download stroke-transparent fill-white" d="M5 3C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3H5M5 5H19V19H5V5M13 12L16.2 17H14.2L12 13.2L9.8 17H7.8L11 12L7.8 7H9.8L12 10.8L14.2 7H16.2L13 12Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    `
                                }

                            ],
                            data: response.data
                        };
                        nata.sessionStorage.setItem("widget", options);
                        const element = document.querySelector("#containerViewSOAT");
                        element.innerHTML = "";
                        element.innerHTML = `
                            <nata-ui-table></nata-ui-table>
                        `;
                        document.querySelector("#badgeTotal").innerHTML = numberDecimal.format(response.data[0].s);
                        document.querySelector("#badgeTotalCantidad").innerHTML = response.data[0].c;
                        app.core.monitor.events(response.data, label);

                    })).catch((function (error) {
                        console.error(error);
                    }));
            }
            else if (label == "anulada") {
                axios.get(app.config.server.php1 + "k=cartera&x=anuladas")
                    .then((function (response) {
                        console.log(response.data);
                        const class_ = "bg-azul";
                        const options = {
                            id: "tableMonitorSOAT",
                            columns: [
                                {
                                    title: "",
                                    width: "120",
                                    prop: "ie"
                                },
                                {
                                    title: "Estado",
                                    width: "250",
                                    prop: "e",
                                    class: "fw-bold"
                                },
                                {
                                    title: "Responsable",
                                    width: "140",
                                    prop: "r",
                                    widget: {
                                        w: "badge",
                                        c: class_
                                    }
                                },
                                {
                                    title: "Descripción",
                                    width: "300",
                                    prop: "d"
                                },
                                {
                                    title: "Saldo",
                                    width: "140",
                                    prop: "s",
                                    type: "number",
                                    class: "text-end",
                                    widget: {
                                        w: "badge",
                                        c: class_
                                    }
                                },
                                {
                                    title: "",
                                    width: "100",
                                    prop: "c",
                                    class: "text-end",
                                    widget: {
                                        w: "badge",
                                        c: class_
                                    }
                                },
                                {
                                    title: "",
                                    width: "150",
                                    class: "text-end",
                                    html: `
                                        <div class="btn-group me-2" role="group" aria-label="First group">
                                            <button type="button" class="btn btn-primary btn-detalle"
                                                data-id="[id]"
                                                data-id-perfil="${session.user.ir}"
                                                data-id-tipo="soat"
                                            >
                                                <svg class="btn-detalle" data-id-tipo="soat" data-id="[id]" data-id-perfil="${session.user.ir}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path class="btn-detalle" data-id-tipo="soat" data-id="[id]" data-id-perfil="${session.user.ir}" stroke-linecap="round" stroke-linejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                            </button>
                                            <button type="button" class="btn btn-primary btn-detail-download" data-id="[id]">
                                                <svg class="btn-detail-download" xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    data-id="[id]">
                                                    <path
                                                        data-id="[id]"
                                                        class="btn-detail-download stroke-transparent fill-white" d="M5 3C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3H5M5 5H19V19H5V5M13 12L16.2 17H14.2L12 13.2L9.8 17H7.8L11 12L7.8 7H9.8L12 10.8L14.2 7H16.2L13 12Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    `
                                }
                            ],
                            data: response.data
                        };
                        nata.sessionStorage.setItem("widget", options);
                        const element = document.querySelector("#containerViewSOAT");
                        element.innerHTML = `
                            <nata-ui-table></nata-ui-table>
                        `;
                        document.querySelector("#badgeTotal").innerHTML = numberDecimal.format(response.data[0].s);
                        document.querySelector("#badgeTotalCantidad").innerHTML = response.data[0].c;
                        //app.core.monitor.events(response.data, label);

                        document.querySelector("#tableMonitorSOAT").addEventListener("click", function (event) {
                            event.preventDefault();
                            event.stopPropagation();

                            const element = event.target;
                            if (element.classList.contains("btn-detalle")) {
                                app.core.monitor.detalle.render_v1(element, label);
                            }
                            else if (element.classList.contains("btn-detail-download")) {
                                console.log("btn-detail-download");

                                const data = {
                                    sp: "carteraSoat_EstadoFacturasGet",
                                    p: [
                                        {
                                            v: element.dataset.id
                                        }
                                    ]
                                };

                                console.log(data);
                                const elLoader = document.getElementById("loader");
                                if (elLoader !== null) elLoader.style.display = "block";

                                axios.post(app.config.server.php1 + "x=excel&y=download&ts=" + new Date().getTime(), data)
                                    .then((function (response) {
                                        console.log(response.data);
                                        document.getElementById("loader").style.display = "none";
                                        const $file = app.config.server.path + response.data[0].file;
                                        // document.body.removeChild(link);
                                        document.getElementById("loader").style.display = "none";
                                        let html = `
                              <div class="text-center">
                                <a href="${$file + "?ts=" + new Date().getTime()}" class="btn btn-primary" target="_blank">Descargar</a>
                              </div>
                            `;
                                        const optionsDialog = {
                                            height: 150,
                                            width: 300,
                                            html: html,
                                            title: "Soportes",
                                        };
                                        new nataUIDialog(optionsDialog);


                                    })).catch((function (error) {
                                        document.getElementById("loader").style.display = "none";
                                        console.error(error);
                                    }));
                            }
                        });

                        document.querySelector("#containerOtrasPolizas").innerHTML = "";
                    })).catch((function (error) {
                        console.error(error);
                    }));
            }
            else {
                const data = nata.localStorage.getItem("soat-monitor");
                console.log(data);

                let class_ = "text-bg-danger pulse-red";
                console.log(label);
                if (label.indexOf("radicacion") !== -1) {
                    class_ = "text-bg-naranja";
                }

                const options = {
                    id: "tableMonitorSOAT",
                    columns: [
                        {
                            title: "",
                            width: "120",
                            prop: "ii"
                        },
                        {
                            title: "Estado",
                            width: "250",
                            prop: "e",
                            class: "fw-bold"
                        },
                        {
                            title: "Responsable",
                            width: "140",
                            prop: "r",
                            widget: {
                                w: "badge",
                                c: class_ + " font-size-13px"
                            }
                        },
                        {
                            title: "Descripción",
                            width: "300",
                            prop: "d"
                        },
                        {
                            title: "Saldo",
                            width: "140",
                            prop: "s",
                            type: "number",
                            class: "text-end",
                            widget: {
                                w: "badge",
                                c: class_
                            }
                        },
                        {
                            title: "",
                            width: "100",
                            prop: "c",
                            class: "text-end",
                            widget: {
                                w: "badge",
                                c: class_
                            }
                        },
                        {
                            title: "",
                            width: "150",
                            class: "text-end",
                            html: `
                                <div class="btn-group me-2" role="group" aria-label="First group">
                                    <button type="button" class="btn btn-primary btn-detalle"
                                        data-id="[id]"
                                        data-id-perfil="${session.user.ir}"
                                        data-id-tipo="soat"
                                    >
                                        <svg class="btn-detalle" data-id-tipo="soat" data-id="[id]" data-id-perfil="${session.user.ir}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                            <path class="btn-detalle" data-id-tipo="soat" data-id="[id]" data-id-perfil="${session.user.ir}" stroke-linecap="round" stroke-linejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </button>
                                    <button type="button" class="btn btn-primary btn-detail-download" data-id="[id]">
                                        <svg class="btn-detail-download" xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            data-id="[id]">
                                            <path
                                                data-id="[id]"
                                                class="btn-detail-download stroke-transparent fill-white" d="M5 3C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3H5M5 5H19V19H5V5M13 12L16.2 17H14.2L12 13.2L9.8 17H7.8L11 12L7.8 7H9.8L12 10.8L14.2 7H16.2L13 12Z" />
                                        </svg>
                                    </button>
                                </div>
                            `
                        }

                    ],
                    data: data
                };
                const oDataView = data.filter(function (record) {
                    return record.l.indexOf(label) !== -1;
                });
                console.log(oDataView);
                options.data = oDataView;
                nata.sessionStorage.setItem("widget", options);
                const element = document.querySelector("#containerViewSOAT");
                element.innerHTML = "";
                element.innerHTML = `
                    <nata-ui-table></nata-ui-table>
                `;
                app.core.dashboard.fxTotalesRefresh(oDataView, label);
                let oDataOtrosAseguradores = nata.localStorage.getItem("otro-aseguradores-monitor");
                console.log(oDataOtrosAseguradores);
                oDataOtrosAseguradores = oDataOtrosAseguradores.filter(function (record) {
                    return record.l.indexOf(label) !== -1;
                });
                app.core.otrasPolizas.render(oDataOtrosAseguradores, label);
                document.querySelector("#container-dev-3").style.display = "none";
            }
        },
        fxTotalesRefresh: function (data, label) {
            let totalCantidad = 0, total = 0;
            let i;
            for (i = 0; i < data.length; i++) {
                totalCantidad += parseFloat(data[i].c);
                total += parseFloat(data[i].s);
            }

            console.log(data, totalCantidad);

            const elBadgeCantidad = document.querySelector("#badgeTotalCantidad");
            const elBadgePesos = document.querySelector("#badgeTotal");
            if (label.indexOf("radicacion") !== -1) {
                elBadgeCantidad.classList.remove("text-bg-danger", "pulse-red");
                elBadgeCantidad.classList.add("text-bg-naranja");
                elBadgePesos.classList.remove("text-bg-danger", "pulse-red");
                elBadgePesos.classList.add("text-bg-naranja");
            }
            elBadgeCantidad.innerHTML = totalCantidad;
            elBadgePesos.innerHTML = numberDecimal.format(total);
            app.core.monitor.events(data, label);
        }
    },

    dialog: {
        removeAll: function () {
            console.log("app.core.dialog.removeAll");
            const elements = document.querySelectorAll(".ui-dialog ");
            console.log(elements);
            let i;
            for (i=0;i<elements.length;i++) {
                elements[i].remove();
            }
        }
    },

    facturacion: {
        panel: {
            descargar: function () {
                console.trace("%c app.core.facturacion.panel.descargar", "background:red;color:#fff;font-size:11px");

                const data = {
                    sp: "carteraSoat_EstadoFacturasPanelGet",
                    p: [
                        {
                            v: session.user.ir
                        }
                    ]
                };
                console.log(data);
                const elLoader = document.getElementById("loader");
                if (elLoader !== null) elLoader.style.display = "block";

                axios.post(app.config.server.php1 + "x=excel&y=downloadPanel&ts=" + new Date().getTime(), data)
                    .then((function (response) {
                        console.log(response.data);
                        document.getElementById("loader").style.display = "none";
                        const file = app.config.server.path + response.data[0].file;
                        // document.body.removeChild(link);
                        document.getElementById("loader").style.display = "none";
                        let html = `
                          <div class="text-center">
                            <a href="${file + "?ts=" + new Date().getTime()}" class="btn btn-primary" target="_blank">Descargar</a>
                          </div>
                        `;
                        const optionsDialog = {
                            height: 150,
                            width: 300,
                            html: html,
                            title: "Descarga Panel",
                        };
                        new nataUIDialog(optionsDialog);


                    })).catch((function (error) {
                        document.getElementById("loader").style.display = "none";
                        console.error(error);
                    }));
            }
        }
    },

    file: {
        exists: function (url_file) {
            console.log("app.core.file.exists");
            const http = new XMLHttpRequest();
            http.open("HEAD", url_file, false);
            http.send();
            return http.status != 404;
        }
    },

    furips: {
        gestion: {
            buscar: function () {
                console.trace("%c app.core.furips.gestion.buscar", "background:red;color:#fff;font-size:11px");
                let html = `
                <div class="text-center d-flex">
                    <input id="txtSearch" type="text" class="form-control w-1000 input-search" placeholder="Buscar ..." autocomplete="off">
                    <button id="btn-buscar-factura" class="btn btn-outline-primary" type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </button>
                </div>
              `;
                const optionsDialog = {
                    height: 150,
                    width: 300,
                    html: html,
                    title: "Buscar Furips",
                };
                new nataUIDialog(optionsDialog);
            }
        }
    },

    exit: function () {
        console.log("app.core.exit");
        swal({
            title: "Deseas Salir de Homi ?",
            text: "",
            icon: "warning",
            buttons: ["NO, cancelar", "SI, Cerrar"],
            dangerMode: true,
        }).then((response) => {
            if (response) {
                sessionStorage.clear();
                localStorage.clear();
                localforage.clear().then(function () {
                    location.reload(true);
                    if (session.width > 768) {
                        const elLayout = document.querySelector(".ui-layout-laptop");
                        if (elLayout !== null) elLayout.style.display = "none";
                    }
                    else {
                        const elLayout = document.querySelector(".ui-layout-mobile");
                        if (elLayout !== null) elLayout.style.display = "none";
                    }
                });
            }
        });
    },

    monitor: {
        detalle: {
            render: function (data, dataEstado, idTipo, label = "") {
                console.trace("%c app.core.monitor.detalle.render", "background:red;color:#fff;font-size:11px");
                console.log(data);

                if (data.length == 0) {
                    swal("Error", "No se han recibido datos !!", "error");
                    return false;
                }
                console.log(dataEstado);

                // transformar la data
                let oData = nata.sessionStorage.getItem("soat-glosa-total-asegurador");
                console.log(oData);

                let i, oRecord;
                const oDataView = [];
                for (i = 0; i < oData.length; i++) {
                    oRecord = oData[i];
                    oRecord.detail = data.filter(function (record) {
                        return (record.a == oData[i].a);
                    });
                    oDataView.push(oRecord);
                }
                console.log(oDataView);
                //return false;

                let strEstado = "";
                if (typeof dataEstado !== "undefined") {
                    strEstado = dataEstado.ie + " - " + dataEstado.e;
                }

                let template = `
                    <style>
                        #tableCarteraDetalle {
                            table-layout: fixed;
                            width: 1210px;
                        }
                        .center-container-button {
                            text-align: center;
                        }

                        .table-asegurador {
                            table-layout: fixed;
                            width: 540px;
                        }
                    </style>
                `;

                if (strEstado.length > 0) {
                    template += `
                        <h6><span class="badge bg-primary">${strEstado}</span></h6>
                    `;
                }

                template += `
                    <style>
                        .btn-detalle {
                            transition: background-color 0.3s ease, transform 0.3s ease;
                        }
                        .btn-detalle:hover {
                            background-color: #5BA8DB; 
                            transform: scale(1.05); 
                        }
                    </style>
                    <!-- tableCarteraDetalle 01 !-->
                    <table id="tableCarteraDetalle" class="table table-sm">
                        <colgroup>
                            <col width="300"></col>
                            <col width="120"></col>
                            <col width="120"></col>
                            ${oDataView[0].min_dv ? '<col width="100"></col>' : ''}
                            ${oDataView[0].max_dv ? '<col width="100"></col>' : ''}
                            <col width="300"></col>
                        </colgroup>

                        <thead>
                            <tr>
                                <th class="text-center"></th>
                                <th class="text-center"></th>
                                <th class="text-center"></th>
                                ${oDataView[0].min_dv ? '<th class="text-center">Días Min.</th>' : ''}
                                ${oDataView[0].max_dv ? '<th class="text-center">Días Max</th>' : ''}
                                <th class="text-center"></th>
                            </tr>
                        </thead>

                        {{~ it.detail: d:id}}
                        <tr>
                            <td colspan="11">
                                <table class="table table-sm table-asegurador">
                                    <col width="300"></col>
                                    <col width="120"></col>
                                    <col width="120"></col>
                                    ${oDataView[0].min_dv ? '<col width="100"></col>' : ''}
                                    ${oDataView[0].max_dv ? '<col width="100"></col>' : ''}
                                    <col width="300"></col>
                                    <tr>
                                        <td class="text-end">
                                            <strong>{{=d.a}}</strong>
                                        </td>
                                        <td class="text-end">
                                            <span class="text-bg-danger pulse-red badge rounded-pill">
                                                {{=numberDecimal.format(d.tc)}}
                                            </span>
                                        </td>
                                        <td class="text-end">
                                            <span class="text-bg-danger pulse-red badge rounded-pill">
                                                {{=numberDecimal.format(d.ts)}}
                                            </span>
                                        </td>
                                        ${oDataView[0].min_dv ? `
                                        <td class="text-end">
                                            <span class="text-bg-danger pulse-red badge rounded-pill">
                                                {{=d.min_dv}}
                                            </span>
                                        </td>
                                        ` : ''}
                                        ${oDataView[0].max_dv ? `
                                        <td class="text-end">
                                            <span class="text-bg-danger pulse-red badge rounded-pill">
                                                {{=d.max_dv}}
                                            </span>
                                        </td>
                                        ` : ''}
                                        <td class="position-relative text-center ">
                                            <div class="btn-group me-2" role="group" aria-label="First group">
                                                <!-- button 02 !-->
                                                <button type="button"
                                                        class="btn btn-primary btn-sm btn-facturas"
                                                        data-asegurador="{{=d.a}}"
                                                        data-id="{{=d.a}}"
                                                        data-estado="${strEstado}"
                                                        title="ver detalle"
                                                        alt="ver detalle">
                                                        ${iconTable}
                                                </button>
                                                {{? session.user.ir == 24 }}
                                                <button type="button"
                                                        class="btn btn-primary btn-sm btn-facturas-asegurador btn-detalle"
                                                        data-asegurador="{{=d.a}}"
                                                        data-id="{{=d.a}}"
                                                        data-estado="${strEstado}"
                                                        title="Asegurador"
                                                        alt="Asegurador">
                                                        ${iconBuilding}
                                                </button>                                                
                                                {{?}}

                                                {{? it.estado.label.indexOf("radicar-primera-vez") !== -1 }}
                                                <button type="button"
                                                    class="btn btn-warning btn-sm button-wizard"
                                                    data-id="{{=it.estado.id}}"
                                                    title="Wizar Artemisa"
                                                    alt="Wizar Artemisa">
                                                    ${iconRobot}
                                                </button>
                                                {{?}}

                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        {{~}}
                    </table>
                `;
                console.log(data);
                let totalSum = 0;
                let cantidad2;
                for (i=0; i<data.length; i++) {
                    cantidad2 = parseInt(data[i].sa, 10);
                    totalSum += cantidad2;
                    //console.log(totalSum);
                }
                totalSum = numberDecimal.format(totalSum);
                console.log(data.length + " " + totalSum);
                console.log(oDataView);
                console.log(dataEstado);
                const oSession = nata.sessionStorage.getItem("session");
                console.log(oSession);

                const html = doT.template(template)({ detail: oDataView, estado: oSession});
                console.log(data);
                new nataUIDialog({
                    html: html,
                    title: `
                        Cartera &nbsp;&nbsp; <span class="badge rounded-pill pulse-red badge text-bg-danger">${data.length}</span>&nbsp;&nbsp;
                        <span class="text-end text-bg-danger pulse-red badge rounded-pill">
                          ${totalSum}
                        </span>
                    `,
                    toolbar: `
                        <div class="btn-group">
                            <button type="button" class="btn btn-primary dropdown-toggle btn-circle" data-bs-toggle="dropdown" aria-expanded="false">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                </svg>
                            </button>
                            <!-- dropdown 01 !-->
                            <ul class="dropdown-menu">                            
                                <li class="ui-dropdown-basic" id="artemisa-option">
                                    <a href="#" class="dropdown-item dropdown-toggle" data-bs-toggle="dropdown">
                                        ${iconRobot} Artemisa
                                    </a>
                                    <ul class="dropdown-menu submenu">
                                        <li>
                                            <a class="dropdown-item" data-id="${data[0].ie}" id="artemisaArmado" onclick="app.wizard_V1.armado.index(${data[0].ie})">
                                                ${iconDocumentsAdd} Armado Cuentas
                                            </a>
                                        </li>
                                        <li>
                                            <a class="dropdown-item" data-id="${data[0].ie}" id="artemisaArmado" onclick="app.wizard_V1.armado.index(${data[0].ie})">
                                                ${iconGestionar} Gestionar
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li id="validar-option">
                                    <a href="#" class="dropdown-item dropdown-toggle" data-bs-toggle="dropdown">Validar</a>
                                    <ul class="dropdown-menu submenu">
                                        <li id="xml-option">
                                            <a href="#" class="dropdown-item dropdown-toggle" data-bs-toggle="dropdown">Factura XML</a>
                                            <ul class="dropdown-menu submenu">
                                                <li data-id="${data[0].ie}">
                                                    <a class="dropdown-item" data-id="${data[0].ie}" id="validar-factura-xml">Validar</a>
                                                </li>                                        
                                                <li data-id="${data[0].ie}">
                                                    <a class="dropdown-item" data-id="${data[0].ie}" id="cargar-factura-xml" onclick="app.documentacion.wizard.render('validar-soportes', 'Validar Soportes');">Cargar</a>
                                                </li>
                                                <li data-id="${data[0].ie}">
                                                    <a class="dropdown-item" data-id="${data[0].ie}" id="verificar-factura-xml">Verificar Soportes</a>
                                                </li>
                                            </ul>
                                        </li>                                       
                                        <li data-id="${data[0].ie}">
                                            <a class="dropdown-item" data-id="${data[0].ie}" id="validar-siras">Validar siras</a>
                                        </li>
                                    </ul>
                                </li>
                                ${data[0].l.includes("glosa") ? `
                                    <li>
                                        <a class="dropdown-item" id="download-button-glosa" data-id="${data[0].ie}" data-id-perfil="${session.user.ir}" data-id-tipo="${idTipo}">Descargar Excel Glosa</a>
                                    </li>
                                ` : ""}
                                ${data[0].l.includes("auditoria-integral") ? `
                                    <li>
                                        <a class="dropdown-item" id="download-button-pv" data-id="${data[0].ie}" data-id-perfil="${session.user.ir}" data-id-tipo="${idTipo}">Descargar Excel Primera Vez</a>
                                    </li>
                                ` : ""}
                                <li>
                                    <a class="dropdown-item" id="download-button" data-id="${data[0].ie}" data-id-perfil="${session.user.ir}" data-id-tipo="${idTipo}">Descargar Excel</a>
                                </li>
                                <li data-id="${data[0].ie}">
                                    <a class="dropdown-item" id="consulta-soporte" data-id="${data[0].ie}" data-id-soporte="SF">Facturas sin soporte de facturación</a>
                                </li>
                                <li data-id="${data[0].ie}">
                                    <a class="dropdown-item" id="consulta-soporte" data-id="${data[0].ie}" data-id-soporte="HC">Facturas sin soporte de historia clínica</a>
                                </li>
                                <li data-id="${data[0].ie}">
                                    <a class="dropdown-item" id="consulta-soporte" data-id="${data[0].ie}" data-id-soporte="S">Facturas sin soporte de siras</a>
                                </li>
                                ${session.user.ir == 24 || session.user.ir == 2 ? `
                                <li id="furips-option">
                                    <a href="#" class="dropdown-item dropdown-toggle" data-bs-toggle="dropdown">Furips</a>
                                    <ul class="dropdown-menu submenu">
                                        <li data-id="${data[0].ie}">
                                            <a class="dropdown-item" id="validar-furips" data-id="${data[0].ie}">Validar Furips</a>
                                        </li>
                                        <li data-id="${data[0].ie}">
                                            <a class="dropdown-item" id="furipsCerrarAsistente" data-id="${data[0].ie}">Corregir Furips</a>
                                        </li>
                                        <li data-id="${data[0].ie}">
                                            <a class="dropdown-item" id="precargar-furips" data-id="${data[0].ie}">Precargar Furips</a>
                                        </li>
                                    </ul>
                                </li>
                                ` : "" }
                                <li>
                                    <a class="dropdown-item" id="consulta-facturas-mayor">Facturas con fecha de informe mayor a 7 días</a>
                                </li>
                            </ul>

                        </div>
                    `
                });
                // adicionar la clase de button-wizard al button svg
                document.querySelectorAll("svg.robot").forEach(function(element) {
                    element.classList.add("button-wizard");
                });
                document.querySelectorAll("svg.robot path").forEach(function(element) {
                    element.classList.add("button-wizard");
                });
                

                //#region eventos
                document.querySelectorAll("#download-button-glosa").forEach(function(element) {
                    element.addEventListener("click", function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        const id = element.dataset.id;
                        const idPerfil = element.dataset.idPerfil;
                        console.log(id);
                        const data ={
                            e: id,
                            ip: idPerfil,
                            t: idTipo
                        };
                        console.log(data);
                        axios.post(app.config.server.php1 + "x=download&y=desargaFacturasEstadoGlosa&ts=" + (new Date).getTime(), data)
                            .then((function(response) {
                                console.log(response.data[0]);
                                document.getElementById("loader").style.display = "none";
                                //console.log(response);
                                const link = document.createElement("a");

                                const name = "respuesta-glosa-" + id + ".xlsx";
                                const file = app.config.server.docs1 + name;
                                console.log(file);
                                link.href = file;
                                link.download = name;

                                //console.log(link.href);
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);

                            })).catch((function(error) {
                                console.log(error);
                            }));

                    });
                });
                document.querySelectorAll("#download-button-pv").forEach(function(element) {
                    element.addEventListener("click", function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        const id = element.dataset.id;
                        const idPerfil = element.dataset.idPerfil;
                        console.log(id);
                        const data ={
                            e: id,
                            ip: idPerfil,
                            t: idTipo
                        };
                        console.log(data);
                        axios.post(app.config.server.php1 + "x=download&y=desargaFacturasEstadoPV&ts=" + (new Date).getTime(), data)
                            .then((function(response) {
                                console.log(response.data[0]);
                                document.getElementById("loader").style.display = "none";
                                //console.log(response);
                                const link = document.createElement("a");

                                const name = "respuesta-auditoria-" + id + ".xlsx";
                                const file = app.config.server.docs1 + name;
                                console.log(file);
                                link.href = file;
                                link.download = name;

                                //console.log(link.href);
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            })).catch((function(error) {
                                console.log(error);
                            }));

                    });
                });
                document.querySelectorAll("#download-button").forEach(function(element) {
                    element.addEventListener("click", function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        const id = element.dataset.id;
                        const idPerfil = element.dataset.idPerfil;
                        console.log(id);
                        const data ={
                            e: id,
                            ip: idPerfil,
                            t: idTipo
                        };
                        console.log(data);
                        axios.post(app.config.server.php1 + "x=download&y=desargaFacturasEstado&ts=" + (new Date).getTime(), data)
                            .then((function(response) {
                                console.log(response.data);

                                if (parseInt(response.data.c) == 0) {
                                    return false;
                                }

                                const link = document.createElement("a");

                                link.href = app.config.server.path + response.data[0].file+ "?ts="+ new Date().getTime();
                                link.download = "facturas_sin_soporte_estado.xlsx";

                                console.log(link.href);
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);

                            })).catch((function(error) {
                                console.log(error);
                            }));

                    });
                });
                document.querySelectorAll("#consulta-soporte").forEach(function(element) {
                    element.addEventListener("click", function(event) {
                        console.log("click");
                        event.preventDefault();
                        event.stopPropagation();
                        const id = element.dataset.id;
                        const tipoSoporte = element.dataset.idSoporte;
                        console.log(tipoSoporte);
                        console.log(id);
                        const data ={
                            e:id,
                            ts:tipoSoporte,
                            p: session.user.ir,
                        };
                        axios.post(app.config.server.php1 + "x=cartera&y=facturasSinSoporteEstado&ts=" + (new Date).getTime(), data)
                            .then((function(response) {
                                console.log(response.data);
                                const oDataSoportes = response.data;

                                const options = {
                                    id: "tableSoportes",
                                    columns: [
                                        {
                                            title: "Numero Factura",
                                            width: "100",
                                            prop: "nf"
                                        },
                                        {
                                            title: "Fecha",
                                            width: "100",
                                            prop: "ff",
                                        },
                                        {
                                            title: "Valor Factura",
                                            width: "100",
                                            prop: "v",
                                            type: "number",
                                        },
                                        {
                                            title: "Saldo Factura",
                                            width: "100",
                                            prop: "sa",
                                            type: "number",
                                            class: "saldo"
                                        },
                                        {
                                            title: "Estado Cartera",
                                            width: "200",
                                            prop: "ea",
                                            class: "text-end",
                                            widget: {
                                                w: "badge",
                                                c: "text-bg-danger pulse-red"
                                            }
                                        },
                                        {
                                            title: "Dias vencimiento",
                                            width: "110",
                                            prop: "dtf",
                                            class: "text-end",
                                            widget: {
                                                w: "badge",
                                                c: "text-bg-danger pulse-red"
                                            }
                                        },
                                        {
                                            title: "Dias Vencimiento Crescend",
                                            width: "110",
                                            prop: "dtc",
                                            class: "text-end",
                                            widget: {
                                                w: "badge",
                                                c: "text-bg-danger pulse-red"
                                            }
                                        },
                                    ],
                                    data: oDataSoportes
                                };

                                nata.sessionStorage.setItem("widget", options);
                                new nataUIDialog({
                                    html: `
                                        <div class="w-100 scroll-y">
                                            <nata-ui-table></nata-ui-table>
                                        </div>
                                    `,
                                    title: `
                                        Facturas sin soporte&nbsp;&nbsp;
                                        <span class="badge rounded-pill text-bg-primary">
                                            ${tipoSoporte}
                                        </span>
                                        &nbsp;&nbsp;
                                        <span class="badge rounded-pill text-bg-primary">
                                            ${oDataSoportes.length}
                                        </span>&nbsp;&nbsp;
                                    `,
                                    toolbar: `
                                        <div class="btn-group">
                                            <button type="button" class="btn btn-primary dropdown-toggle btn-circle" data-bs-toggle="dropdown" aria-expanded="false">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                                </svg>
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li data-id="${id}"><a class="dropdown-item" id="descargar-soporte">Descargar</a></li>
                                            </ul>
                                        </div>
                                    `,
                                    events: {
                                        render: function () {},
                                        close: function () {},
                                    }
                                });

                                document.querySelector("#descargar-soporte").addEventListener("click", function(event){
                                    event.preventDefault();
                                    event.stopPropagation();
                                    const id = element.dataset.id;
                                    const estado = tipoSoporte;
                                    const data={
                                        ts:estado,
                                        a: "",
                                        p:session.user.ir,
                                        e:id
                                    };
                                    console.log(data);
                                    axios.post(app.config.server.php1 + "x=download&y=descargaFacturasSinSoporte&ts=" + (new Date).getTime(), data)
                                        .then((function(response) {
                                            console.log(response);
                                            const link = document.createElement("a");

                                            link.href = app.config.server.path + response.data[0].file+ "?ts="+ new Date().getTime();
                                            link.download = "facturas_sin_soporte.xlsx";

                                            console.log(link.href);
                                            document.body.appendChild(link);

                                            link.click();

                                            document.body.removeChild(link);
                                        })).catch((function(error) {
                                            console.log(error);
                                        }));
                                });
                            })).catch((function(error) {
                                console.log(error);
                            }));

                    });
                });
                document.querySelector("#validar-factura-xml").addEventListener("click", function(e){
                    const element = e.target;

                    const id = element.dataset.id;
                    console.log(id);
                    const dataXML = {
                        e : id
                    };

                    axios.post(app.config.server.php1 + "x=cartera&y=validarFacturaXML&ts=" + (new Date).getTime(), dataXML)
                        .then((function(response) {
                            console.log(response.data);

                            if(response.data.length == 0){
                                swal("Éxito", "Todas las facturas tiene el XML cargado", "success");
                            }
                            else{
                                const options = {
                                    id: "tableFacturaXML",
                                    columns: [
                                        {
                                            title: "Numero Factura",
                                            width: "250",
                                            prop: "nf"
                                        }
                                    ],
                                    data: response.data
                                };

                                nata.sessionStorage.setItem("widget", options);
                                new nataUIDialog({
                                    html: `
                                            <div class="w-100 scroll-y d-flex justify-content-center text-center">
                                                <nata-ui-table></nata-ui-table>
                                            </div>
                                        `,
                                    title: `
                                            Facturas sin factura XML&nbsp;&nbsp;
                                            <span class="badge rounded-pill text-bg-primary">
                                                Estado: ${id} 
                                            </span>
                                            &nbsp;&nbsp;
                                            <span class="badge text-bg-danger pulse-red rounded-pill">
                                                ${response.data.length}
                                            </span>
                                        `,
                                    height: 350,
                                    width: 450,
                                    events: {
                                        render: function () {},
                                        close: function () {},
                                    }
                                });
                            }

                        })).catch((function(error) {
                            console.log(error);
                        }));

                });
                document.querySelector("#validar-siras").addEventListener("click", function(e){
                    const element = e.target;

                    const id = element.dataset.id;
                    console.log(id);
                    const dataSiras = {
                        e : id
                    };

                    axios.post(app.config.server.php1 + "x=cartera&y=validarSiras&ts=" + (new Date).getTime(), dataSiras)
                        .then((function(response) {
                            console.log(response.data);
                            const oDataSiras = response.data;
                            console.log(oDataSiras);

                            let totalFacturas;
                            for (i = 0; i < oDataSiras.length; i++) {
                                totalFacturas = oDataSiras[i].s;
                                break;
                            }
                            totalFacturas = numberDecimal.format(totalFacturas);
                            console.log(totalFacturas);

                            const options = {
                                id: "tableSiras",
                                columns: [
                                    {
                                        title: "Numero Factura",
                                        width: "100",
                                        prop: "nf"
                                    },
                                    {
                                        title: "Fecha",
                                        width: "100",
                                        prop: "ff",
                                    },
                                    {
                                        title: "Valor Factura",
                                        width: "100",
                                        prop: "vf",
                                        type: "number",
                                    },
                                    {
                                        title: "Saldo Factura",
                                        width: "100",
                                        prop: "s",
                                        type: "number",
                                        class: "saldo"
                                    },
                                    {
                                        title: "Asegurador",
                                        width: "350",
                                        prop: "a",
                                        class: "text-end",
                                        widget: {
                                            w: "badge",
                                            c: "text-bg-danger pulse-red"
                                        }
                                    },
                                    {
                                        title: "Dias Vencimiento Crescend",
                                        width: "110",
                                        prop: "fm",
                                        class: "text-end",
                                        widget: {
                                            w: "badge",
                                            c: "text-bg-danger pulse-red"
                                        }
                                    },
                                ],
                                data: oDataSiras
                            };

                            nata.sessionStorage.setItem("widget", options);
                            new nataUIDialog({
                                html: `
                                        <div class="w-100 scroll-y">
                                            <nata-ui-table></nata-ui-table>
                                        </div>
                                    `,
                                title: `
                                        Facturas sin Siras&nbsp;&nbsp;
                                        <span class="badge rounded-pill text-bg-primary">
                                            ${id} 
                                        </span>
                                        &nbsp;&nbsp;
                                        <span class="badge text-bg-danger pulse-red rounded-pill">
                                            ${oDataSiras.length}
                                        </span>&nbsp;&nbsp;
                                        <span class="badge text-bg-danger pulse-red rounded-pill">
                                            ${totalFacturas}
                                        </span>&nbsp;&nbsp;
                                    `,
                                events: {
                                    render: function () {},
                                    close: function () {},
                                }
                            });

                        })).catch((function(error) {
                            console.log(error);
                        }));

                });
                document.querySelector("#verificar-factura-xml").addEventListener("click", function(e){
                    const element = e.target;

                    const id = element.dataset.id;
                    console.log(id);

                    document.getElementById("loader").style.display = "block";

                    axios.get("https://cdn1.artemisaips.com/index.php?x=soporte&y=validarFacturaDetalle&z=" + app.config.client + "&w=" + id + "&ts=" + (new Date).getTime())
                        .then((function(response) {
                            console.log(response.data);

                            if(response.data.factura && response.data.factura.length > 0){
                                document.getElementById("loader").style.display = "none";

                                swal("Error", "Hay facturas que no se ha cargado el XML", "error");

                                const options = {
                                    id: "tableFacturaXML",
                                    columns: [
                                        {
                                            title: "Número Factura",
                                            width: "250",
                                            prop: "nf"
                                        }
                                    ],
                                    data: response.data.factura
                                };

                                nata.sessionStorage.setItem("widget", options);

                                new nataUIDialog({
                                    html: `
                                            <div class="w-100 scroll-y d-flex justify-content-center text-center">
                                                <nata-ui-table></nata-ui-table>
                                            </div>
                                        `,
                                    title: `
                                            Facturas sin factura XML&nbsp;&nbsp;
                                            <span class="badge rounded-pill text-bg-primary">
                                                Estado: ${id} 
                                            </span>
                                            &nbsp;&nbsp;
                                            <span class="badge text-bg-danger pulse-red rounded-pill">
                                                ${response.data.factura.length}
                                            </span>
                                        `,
                                    height: 350,
                                    width: 450,
                                    events: {
                                        render: function () {},
                                        close: function () {},
                                    }
                                });
                            }
                            else if(response.data.length > 0){
                                document.getElementById("loader").style.display = "none";

                                const options = {
                                    id: "tableSoportes",
                                    columns: [
                                        {
                                            title: "Número Factura",
                                            width: "150",
                                            prop: "nf"
                                        },
                                        {
                                            title: "Código",
                                            width: "200",
                                            prop: "c"
                                        },
                                        {
                                            title: "Soporte Requerido",
                                            width: "450",
                                            prop: "m"
                                        }
                                    ],
                                    data: response.data
                                };

                                nata.sessionStorage.setItem("widget", options);
                                
                                
                                new nataUIDialog({
                                    html: `
                                            <div class="w-100 scroll-y">
                                                <nata-ui-table></nata-ui-table>
                                            </div>
                                        `,
                                    title: `
                                            Soportes faltantes&nbsp;&nbsp;
                                            <span class="badge rounded-pill text-bg-primary">
                                                Estado: ${id} 
                                            </span>
                                            &nbsp;&nbsp;
                                            <span class="badge text-bg-danger pulse-red rounded-pill">
                                                ${response.data.length} Errores
                                            </span>
                                        `,
                                    events: {
                                        render: function () {},
                                        close: function () {},
                                    }
                                });
                            }
                            else{
                                swal("Éxito", "Las facturas cumplen con los soportes facturados", "success");
                            }
                            
                        })).catch((function(error) {
                            console.log(error);
                        }));

                });
                document.querySelectorAll("#consulta-facturas-mayor").forEach(function(element) {
                    element.addEventListener("click", function(event) {
                        console.log("click");
                        event.preventDefault();
                        event.stopPropagation();
                        //alert("7");
                        const oDataFechas = data.filter(function (record) {
                            return record.dtn > 7;
                        });
                        console.log(oDataFechas);
                        const strSQL = "SELECT * FROM ? ORDER BY dtn desc, a";
                        const oDataAseguradorFecha = alasql(strSQL, [oDataFechas]);
                        console.log(oDataAseguradorFecha);

                        let totalFacturas;
                        for (i = 0; i < oDataAseguradorFecha.length; i++) {
                            totalFacturas = oDataAseguradorFecha[i].v;
                            break;
                        }
                        totalFacturas = numberDecimal.format(totalFacturas);
                        console.log(totalFacturas);
                        //alert(totalFacturas);
                        const options = {
                            id: "tableDetalleFacturas2",
                            columns: [
                                {
                                    title: "Numero Factura",
                                    width: "100",
                                    prop: "nf"
                                },
                                {
                                    title: "Asegurador",
                                    width: "300",
                                    prop: "a"
                                },
                                {
                                    title: "Valor Factura",
                                    width: "100",
                                    prop: "v",
                                    type: "number",
                                },
                                {
                                    title: "Saldo Factura",
                                    width: "80",
                                    prop: "sa",
                                    type: "number",
                                    class: "saldo"
                                },
                                {
                                    title: "Fecha",
                                    width: "100",
                                    prop: "f",
                                },
                                {
                                    title: "Dias vencimiento",
                                    width: "110",
                                    prop: "dtf",
                                    class: "text-end",
                                    widget: {
                                        w: "badge",
                                        c: "text-bg-danger pulse-red"
                                    }
                                },
                                {
                                    title: "Dias Vencimiento Crescend",
                                    width: "100",
                                    prop: "dtc",
                                    class: "text-end",
                                    widget: {
                                        w: "badge",
                                        c: "text-bg-danger pulse-red"
                                    }
                                },
                                {
                                    title: "Días Vencimiento Solicitud Crescend",
                                    width: "120",
                                    prop: "dtn",
                                    class: "text-end",
                                    widget: {
                                        w: "badge",
                                        c: "text-bg-danger pulse-red"
                                    }
                                },
                            ],
                            data: oDataAseguradorFecha
                        };

                        nata.sessionStorage.setItem("widget", options);
                        new nataUIDialog({
                            html: `
                                <div class="w-100 scroll-y scroll-x">
                                    <nata-ui-table></nata-ui-table>
                                </div>
                            `,
                            title: `
                                Facturas reportadas &nbsp;
                                <span class="badge text-bg-danger pulse-red rounded-pill">
                                  ${oDataAseguradorFecha.length}
                                </span>&nbsp;&nbsp;
                                <span class="badge text-bg-danger pulse-red rounded-pill">
                                  ${totalFacturas}
                                </span>&nbsp;&nbsp;
                            `,
                            events: {
                                render: function () { },
                                close: function () { },
                            }
                        });
                    });
                });

                document.querySelector("#tableCarteraDetalle").addEventListener("click", function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                
                    const element = event.target;
                    console.log(element);
                    const oSession = nata.sessionStorage.getItem("session");
                    if (element.classList.contains("button-wizard")) {
                        console.log("button-wizard.click");
                        console.log(oSession);
                        const oWizard = new wizard(oSession.estado);
                        // alert("A01: " + oSession.estado);
                        // alert("A02: " + oWizard.idEstado);
                        oWizard.run(oSession.label);
                    }
                    else if (element.classList.contains("btn-ver-detalle")) {
                        console.log("btn-ver-detalle.click");
                        // alert("A01: " + oSession.estado);
                        app.core.monitor.detalle.render_v2(element, dataEstado.ie);
                    }
                });

                //#endregion eventos

                if (session.user.ir == 24 || session.user.ir == 2) {
                    document.querySelector("#validar-furips").addEventListener("click", function(e){
                        const element = e.target;
                        const id = element.dataset.id;
                        app.furips.validarFurips(id);
                    });

                    document.querySelector("#furipsCerrarAsistente").addEventListener("click", function () {
                        const self = this;
                        const id = self.dataset.id;
                        const lote = new Date().getTime();
                        document.getElementById("loader").style.display = "block";
                        axios.get(app.config.server.php1 + "x=furips&k=validar&l=" + id + "&m=" + lote)
                            .then(function (response) {
                                console.log(response.data);
                                let data = response.data;
    
                                document.querySelector("#loader").style.display = "none";
    
                                if(!response.data.malla || response.data.malla.length == 0){
                                    swal("Éxito", "No hay errores en la validación de la malla", "success");
                                    return;
                                }
    
                                const strSQLCount = `
                                    SELECT
                                        COUNT(1) AS fc
                                    FROM ?;
                                `;

                                const strSQLCountFacturas = `
                                SELECT
                                    COUNT(distinct f) AS fc
                                FROM  ?;
                                `;
            
                                const oDataCountFacturas = alasql(strSQLCountFacturas, [response.data.malla]);
                                console.log(oDataCountFacturas);

                                const oDataCount = alasql(strSQLCount, [response.data.malla]);
                                console.log(oDataCount);
    
                                response = null;
                                console.log(data);
                                const oDataMalla = data.malla.map(function (record) {
                                    return {
                                        f: record.f,
                                        c: record.c,
                                        i: record.c.replace("C", ""),
                                        l: record.cd,
                                        e: record.d,
                                        v: record.v
                                    };
                                });
                                const strSQL = "SELECT DISTINCT f FROM ? ORDER BY f";
                                const oData = alasql(strSQL, [data.malla]);
                                console.log(oData);
                                let template = `
                                    <ul id="listFacturas" class="list-group">
                                        {{~ it.detail: d:id}}
                                            <li class="list-group-item">
                                                <a href="javacspt:void(0);" class="furips-factura-cerrar" data-id="{{=d.f}}">{{=d.f}}</a>
                                            </li>
                                        {{~}}
                                    </ul>
                                    <div id="containerForm" class="w-100 mt-5"></div>
                                `;
                                let html = doT.template(template)({ detail: oData });
                                new nataUIDialog({
                                    html: html,
                                    title: `
                                        Cerrar Furips Factura&nbsp;&nbsp;
                                        <span class="badge bg-primary">${oDataCountFacturas[0].fc}</span>
                                        &nbsp;&nbsp;
                                        <span class="badge bg-primary">${oDataCount[0].fc}</span>
                                    `,
                                    events: {
                                        render: function () { },
                                        close: function () { },
                                    }
                                });    
                                
                                function adjustDialogPosition() {
                                    const scrollDistance = window.scrollY || window.pageYOffset;
                                    const elements = document.querySelectorAll(".ui-dialog");
                                    elements.forEach(element => {
                                        element.style.top = (scrollDistance) + "px";
                                    });
                                }
    
                                adjustDialogPosition();
    
                                window.addEventListener("scroll", adjustDialogPosition);
    
                                document.querySelector("#listFacturas").addEventListener("click", function(event) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    
                                    const element = event.target;
                                    const id = element.dataset.id;
    
                                    if (element.classList.contains("furips-factura-cerrar")) {
                                        console.log("furips-factura-cerrar.click");
                                        console.log(oDataMalla);
                                        let strSQL = `
                                            SELECT DISTINCT c, i, l, v
                                            FROM ?
                                            WHERE f = '${id}' ORDER BY i::NUMBER
                                        `;
                                        const oDataViewMaster = alasql(strSQL, [oDataMalla]);
                                    
                                        strSQL = `
                                            SELECT c, i, l, e 
                                            FROM ?
                                            WHERE f = '${id}' ORDER BY i::NUMBER
                                        `;
                                        const oDataViewDetail = alasql(strSQL, [oDataMalla]);
                                    
                                        console.log(oDataViewMaster);
                                        console.log(oDataViewDetail);
                                    
                                        let i, temporal;
                                        for (i = 0; i < oDataViewMaster.length; i++) {
                                            console.log(oDataViewMaster[i]);
                                            temporal = oDataViewDetail.filter(function (record) {
                                                return record.c == oDataViewMaster[i].c;
                                            });
                                            console.log(temporal);
                                            oDataViewMaster[i].detail = temporal;
                                        }
                                        console.log(oDataViewMaster);
                                    
                                        template = `
                                            <h5 class="d-inline-block">Factura: ${id}</h5>
                                            <div class="d-inline-block ms-3">
                                                <div class="btn-group">
                                                    <button type="button" class="btn btn-primary dropdown-toggle btn-circle" data-bs-toggle="dropdown" aria-expanded="false">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                                        </svg>
                                                    </button>
                                                    <ul class="dropdown-menu">
                                                        <li data-id="199">
                                                            <a class="dropdown-item" href="https://cdn1.artemisaips.com/docs/template.zip" target="_new">Descargar Plantillas FURIPS</a>
                                                        </li>
                                                        <li data-id="199">
                                                            <a class="dropdown-item" href="https://cdn1.artemisaips.com/docs/furips-anexo-tecnico.pdf" target="_new">Ver Anexo Técnico ADRES</a>
                                                        </li>
                                                         <li>
                                                            <a class="dropdown-item solicitar-soportes"
                                                                href="javascript:void(0);"
                                                                onclick="app.monitor.glosa.soporte.crearEstadoParalelo('${id}')"
                                                            >
                                                                Crear Estado Paralelo
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                    
                                            <form id="factura-form">
                                                {{~ it.detail: d:id}}
                                                <div class="w-100 mb-3">
                                                    <div class="form-floating">
                                                        <textarea name="campo_{{=d.c}}" id="tar_{{=d.c}}" class="form-control">{{=d.v}}</textarea>
                                                        <label for="tar_{{=d.c}}">{{=d.c}}: {{=d.l}}</label>
                                                    </div>
                                                    {{~ d.detail: dd:idd}}
                                                    <div class="w-100 error">
                                                        {{=dd.e}}
                                                    </div>
                                                    {{~}}
                                                </div>
                                                {{~}}
                                                <button type="submit" class="btn btn-primary">Actualizar</button>
                                            </form>
                                        `;
                                        html = doT.template(template)({ detail: oDataViewMaster });
                                        document.querySelector("#containerForm").innerHTML = html;
    
                                      
                                        document.querySelector("#containerForm").scrollIntoView({ behavior: "smooth" });    
                                        
                                        document.querySelector("#factura-form").addEventListener("submit", function (event) {
                                            event.preventDefault();
                                        
                                            let formData = new FormData(this);
                                            
                                            let campo_C3_value = id;
                                            
                                            let valuesArray = {
                                                "campo_C3": campo_C3_value
                                            };
                                        
                                            console.log(id);
    
                                            formData.forEach((value, key) => {
                                                valuesArray[key] = value;
                                            });
    
                                            axios.post(app.config.server.php1 + "x=furips&y=corregir&ts=" + new Date().getTime(), valuesArray)
                                                .then(function(response){
                                                    console.log(response.data);
    
                                                    const message = response.data[0];
                                                    swal("Éxito", message, "success");
    
                                                    const elements = document.querySelectorAll(".ui-dialog");
                                                    console.log(elements);
                                                    let i;
                                                    for (i = elements.length - 1; i < elements.length; i++) {
                                                        elements[i].remove();
                                                    }
                                                })
                                                .catch(function(error){
                                                    console.error(error);
                                                });
                                        
                                        });
                                        
                                    }
                                });
                            })
                            .catch(function (error) {
                                console.error(error);
                            });
                    });
    
                    document.querySelector("#precargar-furips").addEventListener("click", function(e){
                        const element = e.target;
    
                        const id = element.dataset.id;
    
                        app.furips.precargarFurips(id);
                    });
                }            

                document.querySelector("#tableCarteraDetalle").addEventListener("click", function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    const element = event.target;

                    if (element.classList.contains("btn-detalle-glosa")) {
                        console.log("btn-detalle-glosa .click");
                        const id = element.dataset.id;

                        axios.get(app.config.server.php1 + "x=cartera&y=adresGlosaDetalleGet&z=" + id)
                            .then((function(response) {
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
                                        <span class="badge text-bg-danger rounded-pill" title="Items glosa">${response.data.length}</span>
                                    `,
                                    events: {
                                        render: function () {},
                                        close: function () {},
                                    }
                                });
                            })).catch((function(error) {
                                console.error(error);
                            }));
                    }

                    else if (element.classList.contains("btn-facturas-asegurador")) {
                        console.log("btn-facturas-asegurador .click");
                        
                        const aseguradorSelect = element.dataset.asegurador;
                        console.log(aseguradorSelect);

                        const asegurador = nata.localStorage.getItem("aseguradores-informe");  
                        
                        let oDataAsegurador = asegurador.filter(function (record) {
                            // console.log(record);
                            return record.am == aseguradorSelect;
                        });

                        console.log(oDataAsegurador);

                        if(oDataAsegurador[0].ap === 'NO DATA' && oDataAsegurador[0].acsc === 'NO DATA'){
                            swal(app.config.title, "No se tienen datos del asegurador, Solicitar accesos!", "info");
                            return;
                        }
        
                        let template;
                        if(oDataAsegurador[0].ap != 'NO DATA'){
                            template = `
                            <div class="scroll-x">
                                {{~ it.detail:d:i }}
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item"><a href="{{=d.ap}}" target="_blank">Link plataforma</a> </li>
                                        <li class="list-group-item">Usuario: {{=d.aui}}</li>
                                        <li class="list-group-item">Contraseña: {{=d.api}}</li>
                                    </ul>
                                {{~}}
                            </div>
                        `;    
                        }
                        else if (oDataAsegurador[0].acsc != 'NO DATA'){
                            template = `
                            <div class="scroll-x">
                                {{~ it.detail:d:i }}
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item">Correo de solicitud: {{=d.acsc}}</li>
                                    </ul>
                                {{~}}
                            </div>
                        `;    
                        }
                        else if (oDataAsegurador[0].ap !== 'NO DATA' && oDataAsegurador[0].acsc !== 'NO DATA' ){
                            template = `
                                <div class="scroll-x">
                                    {{~ it.detail:d:i }}
                                        <ul class="list-group list-group-flush">
                                            <li class="list-group-item"><a href="{{=d.ap}}" target="_blank">Link plataforma</a> </li>
                                            <li class="list-group-item">Usuario: {{=d.aui}}</li>
                                            <li class="list-group-item">Contraseña: {{=d.api}}</li>
                                            <li class="list-group-item">Correo de solicitud: {{=d.acsc}}</li>
                                        </ul>
                                    {{~}}
                                </div>
                            `;    
                        }

                        const html = doT.template(template)({ detail: oDataAsegurador });

                        new nataUIDialog({
                            height: 250,
                            width: 500,
                            html: html,
                            title: `
                                Ingreso Plataforma Aseguradora
                            `,
                            events: {
                                render: function () { },
                                close: function () { },
                            }
                        });
                    }

                    else if (element.classList.contains("btn-facturas")) {
                        console.log("btn-facturas .click");
                        console.log(label);
                        if (label == "prescripcion-cliente") {
                            axios.get(app.config.server.php1 + "k=cartera&x=clientePrescripcionDetalle")
                                .then((function (response) {
                                    console.log(response.data);

                                    const class_ = "bg-azul";

                                    const options = {
                                        id: "tableDetalleFacturas3",
                                        columns: [
                                            {
                                                title: "Numero Factura",
                                                width: "120",
                                                prop: "f"
                                            },
                                            {
                                                title: "Fecha",
                                                width: "120",
                                                prop: "ff"
                                            },
                                            {
                                                title: "Valor",
                                                width: "140",
                                                prop: "v",
                                                type: "number",
                                                class: "text-end",
                                                widget: {
                                                    w: "badge",
                                                    c: class_
                                                }
                                            },
                                            {
                                                title: "Saldo",
                                                width: "140",
                                                prop: "s",
                                                type: "number",
                                                class: "text-end",
                                                widget: {
                                                    w: "badge",
                                                    c: class_
                                                }
                                            },
                                            {
                                                title: "Valor Castigo",
                                                width: "140",
                                                prop: "sc",
                                                type: "number",
                                                class: "text-end",
                                                widget: {
                                                    w: "badge",
                                                    c: class_
                                                }
                                            },
                                            {
                                                title: "Días Vencimiento",
                                                width: "100",
                                                prop: "dv",
                                                type: "number",
                                                class: "text-end",
                                                widget: {
                                                    w: "badge",
                                                    c: class_
                                                }
                                            },
                                            {
                                                title: "",
                                                width: "150",
                                                class: "text-end",
                                                html: `
                                                    <div class="btn-group" role="group" aria-label="Basic example">
                                                        <!-- button 02 !-->
                                                        <button type="button" class="btn btn-primary btn-sm btn-detalle-glosa btn-detalle-glosa-[id]"
                                                        data-id="[id]"
                                                        title="Ver detalle Glosa"
                                                        data-toggle="tooltip"
                                                        data-placement="top"
                                                        id="btn-detalle-glosa"
                                                        >
                                                        <svg class="btn-detalle-glosa" data-id="[id]"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff">
                                                            <title>Ver detalle glosa</title>
                                                            <path data-id="[id]" class="btn-detalle-glosa" d="M22.54 21.12L20.41 19L22.54 16.88L21.12 15.46L19 17.59L16.88 15.46L15.46 16.88L17.59 19L15.46 21.12L16.88 22.54L19 20.41L21.12 22.54M6 2C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H13.81C13.45 21.38 13.2 20.7 13.08 20H6V4H13V9H18V13.08C18.33 13.03 18.67 13 19 13C19.34 13 19.67 13.03 20 13.08V8L14 2M8 12V14H16V12M8 16V18H13V16Z" />
                                                        </svg>
                                                        </button>
    
                                                        <!-- button 02 !-->
                                                        <button
                                                            id="buttonSoporte-[id]"
                                                            type="button"
                                                            data-id="[id]"
                                                            id="btn-soporte"
                                                            class="btn btn-primary dropdown-toggle btn-soporte btn-soporte-[id]"
                                                            aria-expanded="false">
                                                            <svg class="btn-soporte" id="btn-soporte" data-id="[id]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                                <title>Ver soporte</title>
                                                                <path data-id="[id]" id="btn-soporte" class="btn-soporte btn-soporte-[id]" stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                                                            </svg>
                                                        </button>
                                                        
                                                        <button
                                                            id="buttonAuditoria" type="button" data-id="{{=it.nf}}"
                                                            class="btn btn-primary dropdown-toggle btn-auditoria" aria-expanded="false">
                                                            <svg class="btn-auditoria" data-id="{{=it.nf}}" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                                viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                                <title>Ver soporte</title>
                                                                <path data-id="{{=it.nf}}" class="btn-auditoria" stroke-linecap="round"
                                                                    stroke-linejoin="round"
                                                                    d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75">
                                                                </path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                `
                                            }
                                        ],
                                        data: response.data
                                    };

                                    nata.sessionStorage.setItem("widget", options);

                                    new nataUIDialog({
                                        html: `
                                            <nata-ui-table></nata-ui-table>
                                        `,
                                        title: `
                                            Gestión Cartera &nbsp;&nbsp;
                                            <span class="badge text-bg-primary pulse-red">
                                                ${response.data[0].ie} - ${response.data[0].e}
                                            </span>&nbsp;&nbsp;
                                            <span id="badgeTotal" class="badge text-bg-danger pulse-red rounded-pill"></span>
                                        `,
                                        toolbar: `
                                            <div class="btn-group">
                                                <button type="button" class="btn btn-primary dropdown-toggle btn-circle" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                                    </svg>
                                                </button>
                                                <ul class="dropdown-menu">
                                                    <li data-id="SF"><a class="dropdown-item" id="consulta-soporte" data-id="SF">Facturas sin soporte de facturación</a></li>
                                                    <li data-id="HC" ><a class="dropdown-item "id="consulta-soporte" data-id="HC" >Facturas sin soporte de historia clínica</a></li>
                                                    <li data-id="S"><a class="dropdown-item "id="consulta-soporte" data-id="S" >Facturas sin soporte de siras</a></li>
                                                </ul>
                                            </div>
                                        `,
                                        events: {
                                            render: function () { },
                                            close: function () { }
                                        }
                                    });

                                    document.querySelector("#badgeTotal").innerHTML = numberDecimal.format(response.data[0].s);
                                    //document.querySelector("#badgeTotalCantidad").innerHTML = response.data[0].c;

                                    document.querySelector("#tableDetalleFacturas").addEventListener("click", function (event) {
                                        event.preventDefault();
                                        event.stopPropagation();
        
                                        try {
                                            const element = event.target;
                                            if (element.classList.contains("btn-detalle-glosa")) {
                                                console.log("btn-detalle-glosa .click");
                                                session.factura = element.dataset.id;
                                                //console.log(id);
                                                app.monitor.glosa.detalle.render(session.factura);
                                            }
                                            else if (element.classList.contains("btn-soporte")) {
                                                //alert("2");
                                                console.log("btn-soporte .click");
        
                                                const id = element.dataset.id;
                                                console.log(id);
        
                                                document.getElementById("loader").style.display = "block";
        
                                                axios.get("https://cdn1.artemisaips.com/index.php?k=soporte&x=descargar_v1&y=" + app.config.client + "&w=" + id + "&ts=" + new Date().getTime())
                                                    .then((function (response) {
                                                        document.getElementById("loader").style.display = "none";
                                                        //alert("vamos que vamos");
                                                        console.log(response.data);
                                                        const template = `
                                                            <ul class="list-group">
                                                                {{~ it.detail: d:id}}
                                                                <li class="list-group-item">
                                                                    <a href="${app.config.server.cdnPathBaseFiles}{{=d.u}}{{=d.f}}?ts=${new Date().getTime()}"
                                                                        target="_new_{{=id}}">
                                                                        {{=d.f}}
                                                                    </a>
                                                                </li>
                                                                {{~}}
                                                            </ul>
                                                        `;
        
                                                        const html = doT.template(template)({ detail: response.data });
                                                        const optionsDialog = {
                                                            height: 400,
                                                            width: 500,
                                                            html: html,
                                                            toolbar: `
                                                                    <div class="btn-group">
                                                                        <button type="button" class="btn btn-primary dropdown-toggle btn-circle" data-bs-toggle="dropdown" aria-expanded="false">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                                                            </svg>
        
                                                                        </button>
                                                                        <ul class="dropdown-menu dropdown-sm">
                                                                            <li>
                                                                                <a class="dropdown-item solicitar-soportes"
                                                                                    href="javascript:void(0);"
                                                                                    onclick="app.monitor.glosa.soporte.solicitar('${id}')"
                                                                                >
                                                                                    Solicitar Soportes
                                                                                </a>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                `,
                                                            title: `
                                                                Soportes&nbsp;&nbsp;
                                                                <span class="badge text-bg-primary">${id}</span>
                                                                `,
                                                            events: {
                                                                render: function () { },
                                                                close: function () { }
                                                            }
                                                        };
                                                        new nataUIDialog(optionsDialog);
        
        
                                                    })).catch((function (error) {
                                                        swal("Error", "552 La factura no tiene soporte, cargar soporte", "error");
                                                        console.error(error);
                                                        return;
                                                    }));
        
                                                return false;
                                            }
                                        }
                                        catch (e) {
                                            // sentencias para manejar cualquier excepción
                                            console.error(e); // pasa el objeto de la excepción al manejador de errores
                                        }
        
                                    }, true);

                                })).catch((function (error) {
                                    console.error(error);
                                }));
                        }
                        else {
                            const id = element.dataset.id;
                            console.log(id);
                            console.log(data);
                            let oDataAsegurador = data.filter(function (record) {
                                // console.log(record);
                                return record.a == id;
                            });
                            console.log(oDataAsegurador);

                            session.estado = {};
                            session.estado.label = oDataAsegurador[0].l;
                            

                            const strSQL = "SELECT * FROM ? ORDER BY sa::NUMBER desc";
                            oDataAsegurador = alasql(strSQL, [oDataAsegurador]);

                            const asegurador = id;

                            const template = `
                                <style>
                                    #tableDetalleFacturas {
                                        table-layout: fixed;
                                        width: 1080px;
                                    }
                                </style>
                                <div class="w-100 scroll">
                                    <!-- tableDetalleFacturas 01 !-->
                                    <table id="tableDetalleFacturas" class="table table-sm">
                                        <colgroup>
                                            <col width="120"></col>
                                            <col width="100"></col>
                                            <col width="100"></col>
                                            ${oDataAsegurador[0].ie == "103" || oDataAsegurador[0].l.includes("radicacion-2")  ? "<col width=\"100\"></col>" : ""}
                                            <col width="100"></col>
                                            <col width="100"></col>
                                            <col width="100"></col>
                                            <col width="110"></col>
                                            <col width="110"></col>
                                            <col width="110"></col>
                                            <col width="150"></col>
                                        </colgroup>
                                        <thead>
                                            <tr class="text-center">
                                                <th>Número Factura</th>
                                                <th>Fecha</th>
                                                ${oDataAsegurador[0].l.includes("radicacion-2") ? "<th>Fecha Asignación</th>" : ""}
                                                <th>Valor Factura</th>
                                                ${oDataAsegurador[0].ie == "103" ? "<th>Valor Pago</th>" : ""}
                                                <th>Saldo Factura</th>
                                                <th>Fecha Devolución</th>
                                                <th>Valor Glosado</th>
                                                <th>Dias vencimiento</th>
                                                <th>Dias Vencimiento Crescend</th>
                                                <th>Días Vencimiento Solicitud Crescend</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {{~ it.detail: d:id}}
                                            <tr class="{{?id % 2 == 0}}zebra{{?}} border-top-2px">
                                                <td>
                                                    <span class="badge rounded-pill text-bg-primary">{{=d.nf}}</span>                                                    
                                                </td>
                                                <td class="">{{=d.f}}</td>
                                                ${oDataAsegurador[0].l.includes("radicacion-2") ? "<td class=\"text-center\">{{=d.fas}}</td>" : ""}
                                                <td class="text-center">{{=numberDecimal.format(d.v)}}</td>
                                                ${oDataAsegurador[0].ie == "103" ? "<td class=\"text-center\">{{=numberDecimal.format(d.vp)}}</td>" : ""}
                                                <td class="text-center">{{=numberDecimal.format(d.sa)}}</td>
                                                <td class="">{{=d.fd}}</td>
                                                <td class="text-center">{{=numberDecimal.format(d.vg)}}</td>
                                                <td class="text-center">
                                                    <span class="badge rounded-pill text-bg-danger pulse-red">
                                                        {{?d.dtf === null}}0{{??}}{{=d.dtf}}{{?}}
                                                    </span>
                                                </td>
                                                <td class="text-center">
                                                    <span class="badge rounded-pill text-bg-danger pulse-red">{{=d.dtc}}</span>
                                                </td>
                                                <td class="text-center">
                                                    <span class="badge rounded-pill text-bg-danger pulse-red">{{=d.dtn}}</span>
                                                </td>
                                                <td class="text-center">
                                                    <div class="btn-group">
                                                        <button type="button" class="btn btn-primary dropdown-toggle btn-circle" data-bs-toggle="dropdown" aria-expanded="false">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                                            </svg>
                                                        </button>
                                                        <ul class="dropdown-menu">
                                                            <li><a class="dropdown-item btn-detalle-glosa btn-detalle-glosa-{{=d.id}}" data-id="{{=d.id}}" id="btn-detalle-glosa">Ver detalle de glosa</a></li>
                                                            <li><a class="dropdown-item btn-soporte btn-soporte-{{=d.id}}" data-id="{{=d.id}}" id="buttonSoporte-{{=d.id}}">Ver soportes</a></li>
                                                            <li><a class="dropdown-item btn-tareas btn-tareas-{{=d.id}}" data-id="{{=d.id}}" id="btn-tareas">Ver/Crear tareas</a></li>
                                                            {{?d.pd > 0}}
                                                            <li>
                                                               <a class="dropdown-item btn-pagos btn-pagos-{{=d.id}}" data-id="{{=d.id}}" id="btn-pagos">
                                                                    Ver pagos
                                                                </a>
                                                            </li>
                                                            {{?}}
                                                        </ul>
                                                    </div>                                                    
                                                </td>
                                            </tr>
                                            <tr class="observacion" id="observacion-{{=d.id}}">
                                                <th colspan="${oDataAsegurador[0].ie == "103" || oDataAsegurador[0].l.includes("radicacion-2") ? 11 : 10}">
                                                    {{?d.fa && d.fa !== 'null'}}
                                                        <h5>Auditoría Integral</h5>
                                                        <span class="text-bg-danger badge rounded-pill ms-3">
                                                            {{=d.fa}}
                                                        </span>
                                                    {{??}}
                                                        ${oDataAsegurador[0].l.includes("auditoria-integral") ? `
                                                            <button data-id="{{=d.id}}" type="button" class="btn btn-primary btn-sm btn-responder-auditoria">
                                                                Auditar
                                                            </button>
                                                         ` : ""}
                                                    {{?}}
                                                    {{?d.agd > 0}}
                                                        <button type="button" class="btn btn-primary btn-sm btn-detalle-auditoria-glosa btn-detalle-glosa-{{=d.id}}"
                                                        data-id="{{=d.id}}"
                                                        title="Ver detalle Glosa"
                                                        data-toggle="tooltip"
                                                        data-placement="top"
                                                        id="btn-detalle-auditoria-glosa">
                                                            <svg class="btn-detalle-auditoria-glosa" data-id="{{=d.id}}"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff">
                                                                <title>Ver detalle glosa</title>
                                                                <path data-id="{{=d.id}}" class="btn-detalle-auditoria-glosa" d="M22.54 21.12L20.41 19L22.54 16.88L21.12 15.46L19 17.59L16.88 15.46L15.46 16.88L17.59 19L15.46 21.12L16.88 22.54L19 20.41L21.12 22.54M6 2C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H13.81C13.45 21.38 13.2 20.7 13.08 20H6V4H13V9H18V13.08C18.33 13.03 18.67 13 19 13C19.34 13 19.67 13.03 20 13.08V8L14 2M8 12V14H16V12M8 16V18H13V16Z" />
                                                            </svg>
                                                        </button>
                                                    {{??}}
                                                    {{?}}
                                                </th>
                                            </tr>
                                            {{?d.ra == '. '}}
                                            {{??}}
                                            <tr class="observacion" id="observacion-detalle-{{=d.id}}">
                                                <td colspan="${oDataAsegurador[0].ie == "103" || oDataAsegurador[0].l.includes("radicacion-2") ? 11 : 10}">
                                                    {{=d.ra}}
                                                </td>
                                            </tr>
                                            {{?}}                                            
                                            <tr class="observacion" id="observacion-{{=d.id}}">
                                                <th colspan="${oDataAsegurador[0].ie == "103" || oDataAsegurador[0].l.includes("radicacion-2") ? 11 : 10}">
                                                    Observaciones
                                                </th>
                                            </tr>
                                            <tr class="observacion" id="observacion-detalle-{{=d.id}}">
                                                <td colspan="${oDataAsegurador[0].ie == "103" || oDataAsegurador[0].l.includes("radicacion-2") ? 11 : 10}">
                                                    {{=d.o}}
                                                </td>
                                            </tr>
                                            {{~}}
                                        </tbody>
                                    </table>
                                </div>
                            `;

                            const options = nata.sessionStorage.getItem("widget");
                            console.log(options);
                            //console.log(nata.sessionStorage.getItem("widget"));
                            nata.sessionStorage.removeItem("widget", options);

                            console.log(oDataAsegurador[0].asel);

                            const htmlFactura = doT.template(template)({ detail: oDataAsegurador });

                            const strSQLCount = `
                                SELECT
                                    COUNT(1) AS tc
                                FROM ?;
                            `;
                            
                            const oData = alasql(strSQLCount, [oDataAsegurador]);
                            console.log(oData);

                            let totalAsegurador;
                            for (let i = 0; i < oDataView.length; i++) {
                                if (oDataView[i].a === id) {
                                    totalAsegurador = oDataView[i].ts;
                                    break;
                                }
                            }
                            totalAsegurador = numberDecimal.format(totalAsegurador);


                            new nataUIDialog({
                                html: htmlFactura,
                                title: `
                                        Gestión Cartera &nbsp;&nbsp;
                                        <span class="badge text-bg-primary pulse-red">
                                            ${id}
                                        </span>&nbsp;&nbsp;
                                        <span class="badge text-bg-danger pulse-red rounded-pill">
                                            ${totalAsegurador}
                                        </span>
                                        <span class="badge text-bg-primary rounded-pill">
                                            ${oData[0].tc}
                                        </span>
                                    `,
                                toolbar: `
                                        <div class="btn-group">
                                            <button type="button" class="btn btn-primary dropdown-toggle btn-circle" data-bs-toggle="dropdown" aria-expanded="false">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                                </svg>
                                            </button>
                                            <!-- dropdown 02 !-->
                                            <ul class="dropdown-menu dropdown-sm">
                                                <li class="ui-dropdown-basic" id="artemisa-option">
                                                    <a href="#" class="dropdown-item dropdown-toggle" data-bs-toggle="dropdown">
                                                        <svg viewBox="0 0 24 24"><title>robot-outline</title><path d="M17.5 15.5C17.5 16.61 16.61 17.5 15.5 17.5S13.5 16.61 13.5 15.5 14.4 13.5 15.5 13.5 17.5 14.4 17.5 15.5M8.5 13.5C7.4 13.5 6.5 14.4 6.5 15.5S7.4 17.5 8.5 17.5 10.5 16.61 10.5 15.5 9.61 13.5 8.5 13.5M23 15V18C23 18.55 22.55 19 22 19H21V20C21 21.11 20.11 22 19 22H5C3.9 22 3 21.11 3 20V19H2C1.45 19 1 18.55 1 18V15C1 14.45 1.45 14 2 14H3C3 10.13 6.13 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2S14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.87 7 21 10.13 21 14H22C22.55 14 23 14.45 23 15M21 16H19V14C19 11.24 16.76 9 14 9H10C7.24 9 5 11.24 5 14V16H3V17H5V20H19V17H21V16Z" /></svg>    
                                                        Artemisa
                                                    </a>
                                                    <ul class="dropdown-menu submenu">
                                                        <li>
                                                            <a class="dropdown-item" data-id="${data[0].ie}" id="asistente-gestion">Armado Cuentas</a>
                                                        </li>
                                                    </ul>
                                                </li>
                                                <li id="glosa-option">
                                                    <a href="#" class="dropdown-item dropdown-toggle" data-bs-toggle="dropdown">Glosa</a>
                                                    <ul class="dropdown-menu submenu">
                                                        <li>
                                                            <a class="dropdown-item" 
                                                                data-id="${data[0].ie}" data-id-perfil="${session.user.ir}" 
                                                                data-id-tipo="${idTipo}" data-asegurador="${oDataAsegurador[0].asel}" 
                                                                id="descargar-glosa-asegurador">
                                                            Descargar plantilla respuesta</a>
                                                        </li>
                                                    </ul>
                                                </li>
                                                <li data-id="${data[0].ie}">
                                                    <a class="dropdown-item" data-id="${data[0].ie}" id="verificar-factura-xml-asegurador">Verificar Soportes</a>
                                                </li>
                                                <li data-id="SF"><a class="dropdown-item" id="consulta-soporte" data-id="SF">Facturas sin soporte de facturación</a></li>
                                                <li data-id="HC"><a class="dropdown-item" id="consulta-soporte" data-id="HC">Facturas sin soporte de historia clínica</a></li>
                                                <li data-id="S"><a class="dropdown-item" id="consulta-soporte" data-id="S">Facturas sin soporte de siras</a></li>
                                                <li><a class="dropdown-item" id="solicitar-conciliacion">Solicitar conciliación</a></li>
                                            </ul>
                                        </div>
                                    `,
                                events: {
                                    render: function () { },
                                    close: function () { }
                                }
                            });

                            const estado = `
                                <span class="badge rounded-pill text-bg-danger pulse-red">
                                    ${oDataAsegurador[0].ie + " - " + oDataAsegurador[0].e}
                                </span>
                            `;

                            const table = document.getElementById("tableDetalleFacturas");
                            const div = document.createElement("div");
                            div.innerHTML = estado;

                            table.parentNode.insertBefore(div, table);

                            // console.log(options);
                            // nata.sessionStorage.setItem("widget", options);
                            //nata.sessionStorage.setItem("colspan", strEstado);

                            // eliminar botones glosa
                            for (i = 0; i < oDataAsegurador.length; i++) {
                                if (oDataAsegurador[i].cgd == 0) {
                                    /*
                                    if (oDataAsegurador[i].nf == "HFE114371") {
                                        console.log(oDataAsegurador[i].nf + ": " + oDataAsegurador[i].gt);
                                    }
                                    */
                                    const btnGlosa = document.querySelector(".btn-detalle-glosa-" + oDataAsegurador[i].nf);
                                    if (btnGlosa) {
                                        btnGlosa.remove();
                                    }
                                }
                            }

                            // console.log(oDataAsegurador);
                            const tiposSoporte = nata.localStorage.getItem("tipo-soportes");
                            console.log(tiposSoporte);
                            let j;
                            let tipoSoportes = [];
                            for (j = 0; j < tiposSoporte.length; j++) {
                                tipoSoportes.push(tiposSoporte[j].p);
                            }
                            console.log(tipoSoportes);
                            let facturasRepetidas = [];
                            /*uso para pruebas de un solo soporte descomentar el if else para uso */
                            let facturasUnicas = new Set();
                            oDataAsegurador.forEach(function (record) {
                                //recore los tipos de soportes por factura en la data principal
                                for (let i = 0; i < tipoSoportes.length; i++) {
                                    //si el soporte es igual a 0
                                    console.log(record[tipoSoportes[i]]);
                                    if (record[tipoSoportes[i]] == 0) {
                                        let nf = record.nf;
                                        console.log(nf);
                                        if (facturasUnicas.has(nf)) {
                                            // Si ya existe en el conjunto de facturas únicas, la agregamos al arreglo de facturas repetidas
                                            facturasRepetidas.push(nf);
                                        } else {
                                            // Si no existe en el conjunto de facturas únicas, la agregamos al conjunto
                                            facturasUnicas.add(nf);
                                        }
                                    }
                                }
                            });
                            const frequencyMap = {};
                            for (let i = 0; i < facturasRepetidas.length; i++) {
                                // Incrementar la frecuencia para cada factura repetida
                                frequencyMap[facturasRepetidas[i]] = (frequencyMap[facturasRepetidas[i]] || 0) + 1;
                            }

                            const facturasContadorRepeticiones = Object.keys(frequencyMap).filter(factura => frequencyMap[factura] === tipoSoportes.length - 1);

                            console.log(facturasContadorRepeticiones);
                            let elementButtonSoporte;
                            for (i = 0; i < facturasRepetidas.length; i++) {
                                //console.log(facturasRepetidas[i]);
                                elementButtonSoporte = document.querySelector("#buttonSoporte-" + facturasContadorRepeticiones[i]);
                                if (elementButtonSoporte !== null) elementButtonSoporte.remove();
                            }
                            // const tipoSoportes = [
                            //     "sf",
                            //     "shc"
                            // ];
                            // let facturasRepetidas = [];
                            // let facturasUnicas = new Set();
                            // oDataAsegurador.forEach(function(record) {
                            //     //recore los tipos de soportes por factura en la data principal
                            //     for (let i = 0; i < tipoSoportes.length; i++) {
                            //         //si el soporte es igual a 0
                            //         if (record[tipoSoportes[i]] == 0) {
                            //             let nf = record.nf;
                            //             if (facturasUnicas.has(nf)) {
                            //                 // Si ya existe en el conjunto de facturas únicas, la agregamos al arreglo de facturas repetidas
                            //                 facturasRepetidas.push(nf);
                            //             } else {
                            //                 // Si no existe en el conjunto de facturas únicas, la agregamos al conjunto
                            //                 facturasUnicas.add(nf);
                            //             }
                            //         }
                            //     }
                            // });

                            // //console.log("Facturas repetidas:", facturasRepetidas);

                            // let elementButtonSoporte;
                            // for (i = 0; i < facturasRepetidas.length; i++) {
                            //     //console.log(facturasRepetidas[i]);
                            //     elementButtonSoporte = document.querySelector("#buttonSoporte-" + facturasRepetidas[i]);
                            //     if (elementButtonSoporte !== null) elementButtonSoporte.remove();
                            // }

                            document.querySelector("#tableDetalleFacturas").addEventListener("click", function (event) {
                                event.preventDefault();
                                event.stopPropagation();

                                try {
                                    const element = event.target;
                                    if (element.classList.contains("btn-detalle-glosa")) {
                                        console.log("btn-detalle-glosa .click");
                                        session.factura = element.dataset.id;
                                        //console.log(id);
                                        app.monitor.glosa.detalle.render(session.factura);
                                    }
                                    else if (element.classList.contains("btn-soporte")) {
                                        //alert("2");
                                        console.log("btn-soporte .click");

                                        const id = element.dataset.id;
                                        console.log(id);

                                        document.getElementById("loader").style.display = "block";

                                        axios.get("https://cdn1.artemisaips.com/index.php?k=soporte&x=descargar_v1&y=" + app.config.client + "&w=" + id + "&ts=" + new Date().getTime())
                                            .then((function (response) {
                                                document.getElementById("loader").style.display = "none";
                                                //alert("vamos que vamos");
                                                console.log(response.data);
                                                const template = `
                                                    <ul class="list-group text-sm">
                                                        {{~ it.detail: d:id}}
                                                        <li class="list-group-item d-flex justify-content-between align-items-center py-1 px-2">
                                                            <div>
                                                                {{? d.u == 'soportes_detalle/' }}
                                                                <a href="${app.config.server.cdnPathBaseFiles}{{=d.u}}{{=d.f}}?ts=${new Date().getTime()}"
                                                                    target="_new_{{=id}}">
                                                                    {{=d.f}}
                                                                </a>
                                                                {{??}}
                                                                <a href="${app.config.server.cdnPathBaseFiles}cache/{{=d.u}}{{=d.f}}?ts=${new Date().getTime()}"
                                                                    target="_new_{{=id}}">
                                                                    {{=d.f}}
                                                                </a>
                                                                {{?}}
                                                                <small class="badge rounded-pill {{? d.u == 'soportes_detalle/' }}text-bg-primary{{?}}" style="font-size: 0.75em;">
                                                                    {{? d.u == 'soportes_detalle/' }}
                                                                        Soporte detalle
                                                                    {{?}}
                                                                </small>
                                                            </div>
                                                            <button data-id="{{=d.f}}" type="button" class="btn btn-primary btn-sm editarSoportes">
                                                                <svg data-id="{{=d.f}}" class="editarSoportes" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                                    <path data-id="{{=d.f}}" class="editarSoportes" stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                                </svg>
                                                            </button>
                                                        </li>
                                                        {{~}}
                                                    </ul>
                                                `;

                                                const html = doT.template(template)({ detail: response.data });
                                                const optionsDialog = {
                                                    height: 400,
                                                    width: 500,
                                                    html: html,
                                                    toolbar: `
                                                            <div class="btn-group">
                                                                <button type="button" class="btn btn-primary dropdown-toggle btn-circle" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                                                    </svg>

                                                                </button>
                                                                <ul class="dropdown-menu dropdown-sm">
                                                                    ${session.user.ir == '2' || session.user.ir == '24' || session.user.ir == '32' || session.user.ir == '34' ? `
                                                                        <li>
                                                                            <a class="dropdown-item" data-id="${id}" id="cambiar-estado-factura">
                                                                                Cambiar estado
                                                                            </a>
                                                                        </li> 
                                                                    ` : ''}
                                                                    <!-- dropdown 03 !-->
                                                                    <li class="ui-dropdown-basic" id="artemisa-option">
                                                                        <a href="#" class="dropdown-item dropdown-toggle" data-bs-toggle="dropdown">
                                                                            Estados Paralelos
                                                                        </a>
                                                                        <ul class="dropdown-menu submenu">
                                                                            <li>
                                                                               <a class="dropdown-item solicitar-soportes"
                                                                                    href="javascript:void(0);"
                                                                                    onclick="app.monitor.glosa.soporte.crearEstadoParalelo('${id}')"
                                                                                >
                                                                                    Crear estado
                                                                                </a>
                                                                            </li>
                                                                            <li>
                                                                                <a class="dropdown-item ver-estados"
                                                                                    href="javascript:void(0);"
                                                                                    data-id="${id}"
                                                                                >
                                                                                    Ver estado
                                                                                </a>
                                                                            </li>
                                                                        </ul>
                                                                    </li> 
                                                                    <li>
                                                                        <a class="dropdown-item subir-soportes"
                                                                            href="javascript:void(0);"
                                                                            onclick="app.monitor.glosa.soporte.plantillaMAOS.index('${id}')"
                                                                        >
                                                                            Generar plantilla solicitud MAOS
                                                                        </a>
                                                                    </li>                                                                
                                                                    <li>
                                                                        <a class="dropdown-item solicitar-soportes"
                                                                            href="javascript:void(0);"
                                                                            onclick="app.monitor.glosa.soporte.solicitar('${id}')"
                                                                        >
                                                                            Solicitar Soportes
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <a class="dropdown-item subir-soportes"
                                                                            href="javascript:void(0);"
                                                                            onclick="app.monitor.soporte.subirSoportes('${id}')"
                                                                        >
                                                                            Subir Soportes
                                                                        </a>
                                                                    </li>
                                                                    <!--<li data-id="${id}">
                                                                        <a class="dropdown-item" data-id="${id}" id="verificar-factura-xml-factura">Verificar Soportes</a>
                                                                    </li>-->
                                                                </ul>
                                                            </div>
                                                        `,
                                                    title: `
                                                        Soportes&nbsp;&nbsp;
                                                        <span class="badge text-bg-primary">${id}</span>
                                                    `,
                                                    events: {
                                                        render: function () { },
                                                        close: function () { }
                                                    }
                                                };
                                                new nataUIDialog(optionsDialog);

                                                const botonesEditar = document.querySelectorAll(".editarSoportes");

                                                botonesEditar.forEach(function (boton) {
                                                    boton.addEventListener("click", function (e) {
                                                        console.log("editarSoportes.click");
                                                        e.stopPropagation();

                                                        const soporte = e.target.dataset.id;
                                                        console.log(soporte);
                                                        const allLinks = document.querySelectorAll("a[href]");

                                                        let linkElement = null;

                                                        allLinks.forEach(function (link) {
                                                            const href = link.getAttribute("href");
                                                            const fileName = href.substring(href.lastIndexOf("/") + 1, href.indexOf("?"));
                                                            // console.log(fileName);
                                                            if (fileName === soporte) {
                                                                linkElement = link;
                                                            }
                                                        });

                                                        if (linkElement) {
                                                            const currentText = linkElement.textContent.trim();
                                                            const currentHref = linkElement.getAttribute("href");

                                                            const newText = prompt("Edita el nombre del archivo:", currentText).trim();

                                                            if (newText) {
                                                                linkElement.textContent = newText;

                                                                const urlBase = currentHref.substring(0, currentHref.lastIndexOf("/") + 1);
                                                                const newHref = `${urlBase}${newText}?ts=${new Date().getTime()}`;
                                                                linkElement.setAttribute("href", newHref);

                                                                const button = e.target.closest("button");
                                                                button.setAttribute("data-id", newText);

                                                                const svg = button.querySelector("svg");
                                                                if (svg) {
                                                                    svg.setAttribute("data-id", newText);
                                                                }

                                                                const path = button.querySelector("path");
                                                                if (path) {
                                                                    path.setAttribute("data-id", newText);
                                                                }


                                                                axios.get(app.config.server.cdnPathBase + "index.php?k=soporte&x=editarSoporte&y=" + app.config.client + "&w=" + id + "&z=" + soporte + "&x=" + newText + "&b=" + session.user.ir)
                                                                    .then(function (response) {
                                                                        console.log(response.data);
                                                                    })
                                                                    .catch(function (error) {
                                                                        console.error(error);
                                                                    });
                                                            }
                                                        }
                                                    });
                                                });

                                                // document.querySelector("#verificar-factura-xml-factura").addEventListener("click", function(e){
                                                //     console.log("#verificar-factura-xml.click");
                                                //     const element = e.target;
                                
                                                //     const id = element.dataset.id;
                                                //     console.log(id);
                                
                                                //     document.getElementById("loader").style.display = "block";
                                
                                                //     axios.get("https://cdn1.artemisaips.com/index.php?x=soporte&y=validarFacturaDetalle&z=" + app.config.client + "&w=" + data[0].ie + "&t=&v=" + id + "&ts=" + (new Date).getTime())
                                                //         .then((function(response) {
                                                //             console.log(response.data);
                                
                                                //             if(response.data.factura && response.data.factura.length > 0){
                                                //                 document.getElementById("loader").style.display = "none";
                                
                                                //                 swal("Error", "No se ha cargado el XML de: " + id, "error");
                                                //             }
                                                //             else if(response.data.length > 0){
                                                //                 document.getElementById("loader").style.display = "none";
                                
                                                //                 const options = {
                                                //                     id: "tableSoportes",
                                                //                     columns: [
                                                //                         {
                                                //                             title: "Número Factura",
                                                //                             width: "150",
                                                //                             prop: "nf"
                                                //                         },
                                                //                         {
                                                //                             title: "Código",
                                                //                             width: "200",
                                                //                             prop: "c"
                                                //                         },
                                                //                         {
                                                //                             title: "Soporte Requerido",
                                                //                             width: "450",
                                                //                             prop: "m"
                                                //                         }
                                                //                     ],
                                                //                     data: response.data
                                                //                 };
                                
                                                //                 nata.sessionStorage.setItem("widget", options);
                                                                
                                                                
                                                //                 new nataUIDialog({
                                                //                     html: `
                                                //                             <div class="w-100 scroll-y">
                                                //                                 <nata-ui-table></nata-ui-table>
                                                //                                 <button id="cartera-incobrable" data-id="${id}" type="button" class="btn btn-primary btn-sm mt-5">Cartera Incobrable</button>
                                                //                             </div>
                                                //                         `,
                                                //                     title: `
                                                //                             Soportes faltantes&nbsp;&nbsp;
                                                //                             <span class="badge rounded-pill text-bg-primary">
                                                //                                 ${id} 
                                                //                             </span>
                                                //                             &nbsp;&nbsp;
                                                //                             <span class="badge text-bg-danger pulse-red rounded-pill">
                                                //                                 ${response.data.length} Errores
                                                //                             </span>
                                                //                         `,
                                                //                     events: {
                                                //                         render: function () {},
                                                //                         close: function () {},
                                                //                     }
                                                //                 });

                                                //                 document.querySelector("#cartera-incobrable").addEventListener("click", function(e){
                                                //                     console.log("cartera-incobrable.click");

                                                //                     const id = e.target.dataset.id;
                                                //                     console.log(id);

                                                //                     axios.post(app.config.server.php1 + "x=cartera&k=carteraIncobrable&ts=" + new Date().getTime(), response.data)
                                                //                         .then(function(response){
                                                //                             console.log(response.data);

                                                //                             if(response.data != "OK"){
                                                //                                 swal("Error", response.data, "error");
                                                //                             }else{
                                                //                                 swal("Éxito", "La factura se ha enviado a cartera incobrable", "success");

                                                //                                 const elements = document.querySelectorAll(".ui-dialog");
                                                //                                 console.log(elements);
                                                //                                 let i;
                                                //                                 for (i = elements.length - 1; i < elements.length; i++) {
                                                //                                     elements[i].remove();
                                                //                                 }
                                                //                             }
                                                //                         })
                                                //                         .catch(function(error){
                                                //                             console.error(error);
                                                //                         });
                                                //                 });
                                                //             }
                                                //             else{
                                                //                 swal("Éxito", "La factura " + id + " cumplen con los soportes facturados", "success");
                                                //             }
                                                            
                                                //         })).catch((function(error) {
                                                //             console.log(error);
                                                //         }));
                                
                                                // });

                                                const element = document.querySelector('#cambiar-estado-factura');

                                                if(element != null){
                                                    element.addEventListener("click", function(e) {
                                                        console.log("cambiar-estado-factura.click");

                                                        const id = e.target.dataset.id;
                                                        console.log(id);

                                                        axios.get(app.config.server.php1 + "x=cartera&y=getEstadosPertinencia&z=" + id)
                                                            .then(function(response){
                                                                console.log(response.data);

                                                                let template = `
                                                                    <div class="text-center">
                                                                        <select class="form-select select-estado-cambiar" aria-label="Default select example">
                                                                            {{~it.detail: d:id}}
                                                                                <option value="{{=d.i}}">{{=d.i}} - {{=d.e}}</option>
                                                                            {{~}}
                                                                        </select>
                                                                        <button type="button" class="btn btn-primary btn-asignar mt-3">Enviar Factura</button>
                                                                    </div>
                                                                `;

                                                                const html = doT.template(template)({ detail: response.data });
                        
                                                                new nataUIDialog({
                                                                    title: `Cambiar estado 
                                                                        <span class="badge badge-sm rounded-pill text-bg-primary">${id}</span>
                                                                    `,
                                                                    html: html,
                                                                    height: 200,
                                                                    width: 500
                                                                });

                                                                document.querySelector('.btn-asignar').addEventListener("click", function(){
                                                                    console.log("btn-asignar.click");
                                                                    
                                                                    const estado = document.querySelector(".select-estado-cambiar").value;
                                                                    console.log(estado);
                                                                    
                                                                    axios.get(app.config.server.php1 + "x=cartera&y=cambiarEstado&z=" + id + "&w=" + estado + "&k=" + session.user.ir)
                                                                    .then(function(response){
                                                                        console.log(response.data);
                                                                        
                                                                        swal("Éxito", `La factura ${id} ha sido asignada correctamente`, "success");
                                                                        
                                                                        const elements = document.querySelectorAll(".ui-dialog ");
                                                                        let i;
                                                                        for (i = elements.length - 2; i < elements.length; i++) {
                                                                            elements[i].remove();
                                                                        }
                                                                    })
                                                                    .catch(function(error){
                                                                        console.error(error);
                                                                    })
                                                                })
                                                            })
                                                            .catch(function(error){
                                                                console.error(error);
                                                            })
                                                    })
                                                }

                                                document.querySelector(".ver-estados").addEventListener("click", function(e){
                                                    console.log("ver-estados.click");

                                                    const id = e.target.dataset.id;

                                                    axios.get(app.config.server.php1 + "x=cartera&k=verEstados&y=" + id + "&z=" + oDataAsegurador[0].ie)
                                                        .then(function(response){
                                                            console.log(response.data);

                                                            const options = {
                                                                id: "tableAuditoriaGlosas",
                                                                columns: [
                                                                    {
                                                                        title: "Estado",
                                                                        width: "300",
                                                                        prop: "e"
                                                                    },
                                                                    {
                                                                        title: "Días Vencimiento",
                                                                        width: "120",
                                                                        prop: "fv",
                                                                        class: "text-end",
                                                                        widget: {
                                                                            w: "badge",
                                                                            c: "text-bg-danger pulse-red"
                                                                        }
                                                                    }
                                                                ],
                                                                data: response.data
                                                            };
                                                
                                                            nata.sessionStorage.setItem("widget", options);
                                                            new nataUIDialog({
                                                                html: `
                                                                    <div class="w-100 scroll-y scroll-x">
                                                                        <nata-ui-table></nata-ui-table>
                                                                    </div>
                                                                `,
                                                                title: `
                                                                    Estados ${response.data[0].te}
                                                                `,
                                                                width: 500,
                                                                height: 300,
                                                                events: {
                                                                    render: function () { },
                                                                    close: function () { },
                                                                }
                                                            });
                                                        })
                                                        .catch(function(error){
                                                            console.error(error);
                                                        });
                                                });

                                            })).catch((function (error) {
                                                swal("Error", "553 La factura no tiene soporte, cargar soporte", "error");
                                                console.error(error);
                                                document.querySelector("#loader").display = "none";
                                                return;
                                            }));

                                        return false;
                                    }                    
                                    else if (element.classList.contains("btn-tareas")) {
                                        console.log("btn-tareas.click");
                                    
                                        const id = element.dataset.id;
                                        console.log(id);
                                    
                                        axios.get(app.config.server.php1 + "x=cartera&k=obtenerTareas&y=" + id)
                                            .then(function(response){
                                                console.log(response.data);
                                    
                                                if(response.data.length == 0){
                                                    swal("Error", "No hay tareas para la factura " + id, "info");
                                                }
                                    
                                                const options = {
                                                    id: "tableTareas",
                                                    columns: [
                                                        {
                                                            title: "Solicitud",
                                                            width: "320",
                                                            prop: "s"
                                                        },
                                                        {
                                                            title: "Responsable",
                                                            width: "200",
                                                            prop: "u",
                                                            widget: {
                                                                w: "badge",
                                                                c: "text-bg-danger"
                                                            }
                                                        },
                                                        {
                                                            title: "Fecha Solicitud",
                                                            width: "150",
                                                            prop: "f",
                                                            class: "text-end",
                                                            widget: {
                                                                w: "badge",
                                                                c: "text-bg-danger"
                                                            }
                                                        }
                                                    ],
                                                    data: response.data
                                                };
                                    
                                                nata.sessionStorage.setItem("widget", options);
                                                new nataUIDialog({
                                                    html: `
                                                        <nata-ui-table></nata-ui-table>
                                                    `,
                                                    title: `
                                                        Tareas <span class="badge rounded-pill text-bg-primary">${id}</span>
                                                    `,
                                                    toolbar: `
                                                        <div class="btn-group">
                                                            <button type="button" class="btn btn-primary btn-circle btn-crear-tareas" data-id="${id}">
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    `,
                                                    width: 700,
                                                    height: 400,
                                                    events: {
                                                        render: function () { },
                                                        close: function () { },
                                                    }
                                                });
                                    
                                                document.querySelector(".btn-crear-tareas").addEventListener("click", function(){
                                                    console.log("btn-crear-tareas.click");
                                    
                                                    let data = nata.localStorage.getItem("lista-usuarios");
                                    
                                                    const template = `
                                                        <div class="form-group">
                                                            <label for="solicitud">Solicitud</label>
                                                            <textarea class="form-control mb-3" id="solicitud" style="resize: none; height: 160px;"></textarea>
                                                        </div>
                                                        <div class="form-group">
                                                            <label for="responsable">Responsable</label>
                                                            <select id="responsable" class="form-select" aria-label="Default select example">
                                                                <option value="0" selected>Seleccione responsable</option>
                                                                {{~ it.detail: d:id}}
                                                                    <option value="{{=d.i}}">{{=d.n}}</option>
                                                                {{~}}
                                                            </select>
                                                        </div>
                                                        <div class="text-center mt-3">
                                                            <button id="guardarTarea" class="btn btn-primary">Guardar</button>
                                                        </div>
                                                    `;
                                    
                                                    const html = doT.template(template)({ detail: data });
                                                    const optionsDialog = {
                                                        height: 400,
                                                        width: 700,
                                                        html: html,
                                                        title: `Crear tarea <span class="badge rounded-pill text-bg-primary">${id}</span>`,
                                                    };
                                                    new nataUIDialog(optionsDialog);
                                    
                                                    document.querySelector("#guardarTarea").addEventListener("click", function(){
                                                        console.log("guardarTarea.click");
                                    
                                                        const solicitud = document.querySelector("#solicitud").value;
                                                        const responsable = document.querySelector("#responsable").value;
                                    
                                                        if(solicitud == "" || responsable == 0){
                                                            swal("Error", "Todos los campos son obligatorios", "error");
                                                            return;
                                                        }
                                    
                                                        const dataTarea = {
                                                            f: id,
                                                            s: solicitud,
                                                            u: responsable
                                                        };
                                                        console.log(dataTarea);
                                    
                                                        axios.post(app.config.server.php1 + "x=cartera&y=guardarTarea&ts=" + new Date().getTime(), dataTarea)
                                                            .then(function(response){
                                                                console.log(response.data);
                                    
                                                                if(response.data[0].r && response.data[0].r == "OK"){
                                                                    swal("Éxito", "La tarea se ha creado correctamente", "success");
                                    
                                                                    const elements = document.querySelectorAll(".ui-dialog");
                                                                    console.log(elements);
                                                                    let i;
                                                                    for (i = elements.length - 2; i < elements.length; i++) {
                                                                        elements[i].remove();
                                                                    }
                                                                }
                                                            })
                                                            .catch(function(error){
                                                                console.error(error);
                                                            });
                                                    });
                                                });
                                            })
                                            .catch(function(error){ 
                                                console.error(error);
                                            });
                                    }
                                    else if (element.classList.contains("btn-pagos")) {
                                        console.log("btn-pagos.click");
                                    
                                        const id = element.dataset.id;
                                        console.log(id);
                                    
                                        app.monitor.glosa.soporte.validarPagos(id);
                                    }
                                          
                                    else if (element.classList.contains("btn-toggle-observacion")) {
                                        console.log("btn-toggle-observacion.click");
                                        const id = element.dataset.id;
                                        const observacionRows = document.querySelectorAll(`#observacion-${id}, #observacion-detalle-${id}`);
                                        observacionRows.forEach(row => {
                                            row.style.display = row.style.display === "table-row" ? "none" : "table-row";
                                        });
                                    }
                                    else if (element.classList.contains("btn-auditoria")) {
                                        console.log("btn-auditoria.click");

                                        const data = nata.localStorage.getItem("respuestas-auditorias");
                                        const id = element.dataset.id;

                                        const template = `
                                            <select id="auditoriaSelect" class="form-select" aria-label="Default select example">
                                                <option value="0" selected>Categoría auditoria</option>
                                                {{~ it.detail: d:id}}
                                                    <option value="{{=d.p}}">{{=d.tr}}</option>
                                                {{~}}
                                            </select>
                                               
                                            <textarea id="respuestaAuditoria" class="form-control mt-3" rows="4"></textarea>
                        
                                            <div class="text-center mt-3">
                                                <button id="guardarAuditoria" class="btn btn-primary" disabled>Guardar</button>
                                            </div>
                                        `;

                                        const html = doT.template(template)({ detail: data });
                                        
                                        const optionsDialog = {
                                            height: 310,
                                            width: 400,
                                            html: html,
                                            title: "Enviar auditoria",
                                        };
                                        new nataUIDialog(optionsDialog);

                                        document.querySelector("#auditoriaSelect").addEventListener("change", function(event) {
                                            const p = event.target.value;
                                            const button = document.querySelector("#guardarAuditoria");

                                            if(p == 0){
                                                button.disabled = true;
                                                return;
                                            }else {
                                                button.disabled = false;
                                            }
                                            
                                            axios.get(app.config.server.php1 + "x=cartera&k=obtenerRespuestaAuditoria&x=" + p)
                                                .then(function(response){
                                                    console.log(response.data);

                                                    const respuestaAuditoria = response.data[0].ra;
                                                    document.querySelector("#respuestaAuditoria").innerHTML = respuestaAuditoria;

                                                    button.addEventListener("click", function(){
                                                        console.log("guardarAuditoria.click");

                                                        const dataAuditoria = {
                                                            ra: respuestaAuditoria,
                                                            f: id
                                                        };
                                                        console.log(dataAuditoria);

                                                        axios.post(app.config.server.php1 + "x=cartera&y=guardarAuditoria&ts=" + new Date().getTime(), dataAuditoria)
                                                            .then(function(response){
                                                                console.log(response);
                                                            })
                                                            .catch(function(error){
                                                                console.error(error);
                                                            });
                                                    });
                                                })
                                                .catch(function(error){
                                                    console.error(error);
                                                });
                                        });
                                    }
                                    else if (element.classList.contains("btn-anular")) {
                                        console.log("btn-anular.click");

                                        const id = element.dataset.id;
                                        
                                        swal({
                                            title: "¿Deseas anular la factura: " + id + "?",
                                            text: "",
                                            icon: "warning",
                                            buttons: ["NO, cancelar", "SÍ, Anular"],
                                            dangerMode: true,
                                        }).then((response) => {
                                            if (response) {
                                                axios.get(app.config.server.php1 + "x=cartera&k=anularFactura&x=" + id)
                                                    .then(function(response){
                                                        console.log(response.data);

                                                        if(response.data == true){
                                                            swal("Éxito", "La factura se ha actualizado al estado de anulada", "success");
                                                        }
                                                    })
                                                    .catch(function(error){
                                                        console.error(error);
                                                    });
                                            }
                                        });
                                    }
                                    else if (element.classList.contains("btn-detalle-auditoria-glosa")) {
                                        console.log("btn-detalle-auditoria-glosa .click");
                                        const id = element.dataset.id;
                                    
                                        console.log(id);    

                                        axios.get(app.config.server.php1 + "x=cartera&k=auditoriaGlosaGet&y=" + id)
                                            .then(function(response){
                                                console.log(response.data);

                                                const options = {
                                                    id: "tableAuditoriaGlosas",
                                                    columns: [
                                                        {
                                                            title: "Factura",
                                                            width: "120",
                                                            prop: "f"
                                                        },
                                                        {
                                                            title: "Descripción Insumo",
                                                            width: "200",
                                                            prop: "d"
                                                        },
                                                        {
                                                            title: "Valor Total",
                                                            width: "150",
                                                            prop: "vt",
                                                            class: "text-center",
                                                            type: "number",
                                                            widget: {
                                                                w: "badge",
                                                                c: "text-bg-danger"
                                                            }
                                                        },
                                                        {
                                                            title: "Valor Glosado",
                                                            width: "150",
                                                            prop: "vg",
                                                            class: "text-center",
                                                            type: "number",
                                                            widget: {
                                                                w: "badge",
                                                                c: "text-bg-danger"
                                                            }
                                                        },
                                                        {
                                                            title: "Valor Aceptado",
                                                            width: "150",
                                                            prop: "va",
                                                            class: "text-center",
                                                            type: "number",
                                                            widget: {
                                                                w: "badge",
                                                                c: "text-bg-danger"
                                                            }
                                                        },
                                                        {
                                                            title: "Valor No Aceptado",
                                                            width: "150",
                                                            prop: "vn",
                                                            class: "text-center",
                                                            type: "number",
                                                            widget: {
                                                                w: "badge",
                                                                c: "text-bg-danger"
                                                            }
                                                        },
                                                        {
                                                            title: "Descripción Glosa",
                                                            width: "250",
                                                            prop: "dg"
                                                        },
                                                        {
                                                            title: "Observación Aseguradora",
                                                            width: "250",
                                                            prop: "oa"
                                                        },
                                                        {
                                                            title: "Respuesta",
                                                            width: "250",
                                                            prop: "r"
                                                        }
                                                    ],
                                                    data: response.data
                                                };
                                    
                                                nata.sessionStorage.setItem("widget", options);
                                                new nataUIDialog({
                                                    html: `
                                                        <div class="w-100 scroll-y scroll-x">
                                                            <nata-ui-table></nata-ui-table>
                                                        </div>
                                                    `,
                                                    title: `
                                                        Auditoria Glosa
                                                        <span class="badge text-bg-danger rounded-pill">${response.data[0].re}</span>
                                                        <span class="badge text-bg-primary">${response.data[0].fe}</span>
                                                        <span class="badge text-bg-danger rounded-pill" title="Items glosa">${response.data.length}</span>
                                                    `,
                                                    toolbar: `
                                                        <div class="btn-group">
                                                            <button type="button" class="btn btn-primary dropdown-toggle btn-circle" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                                                </svg>
                                                            </button>
                                                            <ul class="dropdown-menu">
                                                                <li>
                                                                    <a class="dropdown-item" id="descargarRespuestaGlosas">Descargar Excel</a>
                                                                </li>
                                                            </ul>
                        
                                                        </div>
                                                    `,
                                                    events: {
                                                        render: function () { },
                                                        close: function () { },
                                                    }
                                                });

                                                document.querySelector("#descargarRespuestaGlosas").addEventListener("click", function(){
                                                    console.log("#descargarRespuestaGlosas");
                
                                                    axios.get(app.config.server.php1 + "x=cartera&y=descargarAuditoriaGlosas&z=" + id + "&ts=" + new Date().getTime())
                                                        .then(function(response){
                                                            console.log(response.data);
                
                                                            const file = app.config.server.path + response.data[0].file;
                
                                                            window.open(file, "_blank");
                                                        })
                                                        .catch(function(error){
                                                            console.error(error);
                                                        });
                                                });
                                            })
                                            .catch(function(event){
                                                console.error(event);
                                            });
                                    }
                                    else if (element.classList.contains("btn-responder-auditoria")){
                                        console.log("btn-responder-auditoria.click");

                                        const buttonId = element.dataset.id;
                                        console.log(buttonId);

                                        app.wizard.auditoria.index(buttonId);
                                    }
                                }
                                catch (e) {
                                    // sentencias para manejar cualquier excepción
                                    console.error(e); // pasa el objeto de la excepción al manejador de errores
                                }

                            }, true);

                            
                            document.querySelectorAll("#descargar-glosa-asegurador").forEach(function(element) {
                                element.addEventListener("click", function(event) {
                                    event.preventDefault();
                                    event.stopPropagation();

                                    console.log(element.dataset);
                                    const id = element.dataset.id;
                                    const idPerfil = element.dataset.idPerfil;
                                    const asegurador = element.dataset.asegurador;
                                    console.log(id);
                                    const data ={
                                        e: id,
                                        ip: idPerfil,
                                        t: idTipo,
                                        a: asegurador
                                    };
                                    console.log(data);
                                    
                                    axios.post(app.config.server.php1 + "x=download&y=descargaFacturasAseguradorGlosa&ts=" + (new Date).getTime(), data)
                                        .then((function(response) {
                                            console.log(response.data[0]);

                                            document.getElementById("loader").style.display = "none";
                                            console.log(response);
                                            const link = document.createElement("a");

                                            const name = "respuesta-glosa-" + id + "-" + asegurador + ".xlsx";
                                            const file = app.config.server.docs1 + name;
                                            console.log(file);
                                            link.href = file;
                                            link.download = name;

                                            //console.log(link.href);
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);

                                        })).catch((function(error) {
                                            console.log(error);
                                        }));

                                });
                            });
                            
                            document.querySelectorAll("#consulta-soporte").forEach(function (element) {
                                element.addEventListener("click", function (event) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    const id = element.dataset.id;
                                    // console.log(id);
                                    console.log(oDataAsegurador);
                                    console.log(asegurador);

                                    const oDataArchive = oDataAsegurador.filter(function (record) {
                                        return record.a == asegurador;
                                    });
                                    console.log(oDataArchive);

                                    let oDataSoportes;
                                    if (id == "SF") {
                                        oDataSoportes = oDataAsegurador.filter(function (record) {
                                            return record.sf == 0;
                                        });
                                    } else if (id == "HC") {
                                        oDataSoportes = oDataAsegurador.filter(function (record) {
                                            return record.shc == 0;
                                        });
                                        // let oDataSoportesSF = oDataAsegurador.filter(function (record) {
                                        //     return record.sf == 0;
                                        // });
                                        // oDataSoportes = oDataSoportesSF;
                                        // let oDataSoportesHC = oDataAsegurador.filter(function (record) {
                                        //     if(record.shc == 0){
                                        //         oDataSoportes.push(record);
                                        //         return record.shc == 0;
                                        //     }
                                        //     else {
                                        //         return false;
                                        //     }
                                        // });
                                        // console.log(oDataSoportesHC);
                                        // console.log(oDataSoportes);
                                    } else if (id == "S") {
                                        oDataSoportes = oDataAsegurador.filter(function (record) {
                                            return record.ss == 0;
                                        });
                                    }
                                    console.log(oDataSoportes);

                                    const options = {
                                        id: "tableSoportes",
                                        columns: [
                                            {
                                                title: "Numero Factura",
                                                width: "100",
                                                prop: "nf"
                                            },
                                            {
                                                title: "Fecha",
                                                width: "100",
                                                prop: "f",
                                            },
                                            {
                                                title: "Valor Factura",
                                                width: "100",
                                                prop: "v",
                                                type: "number",
                                            },
                                            {
                                                title: "Saldo Factura",
                                                width: "100",
                                                prop: "sa",
                                                type: "number",
                                                class: "saldo"
                                            },
                                            {
                                                title: "Estado Cartera",
                                                width: "200",
                                                prop: "ea",
                                                class: "text-end",
                                                widget: {
                                                    w: "badge",
                                                    c: "text-bg-danger pulse-red"
                                                }
                                            },
                                            {
                                                title: "Dias vencimiento",
                                                width: "110",
                                                prop: "dtf",
                                                class: "text-end",
                                                widget: {
                                                    w: "badge",
                                                    c: "text-bg-danger pulse-red"
                                                }
                                            },
                                            {
                                                title: "Dias Vencimiento Crescend",
                                                width: "110",
                                                prop: "dtc",
                                                class: "text-end",
                                                widget: {
                                                    w: "badge",
                                                    c: "text-bg-danger pulse-red"
                                                }
                                            },
                                        ],
                                        data: oDataSoportes
                                    };

                                    console.log(options);
                                    nata.sessionStorage.setItem("widget", options);
                                    new nataUIDialog({
                                        html: `
                                            <div class="w-100 scroll-y">
                                                <nata-ui-table></nata-ui-table>
                                            </div>
                                        `,
                                        title: `
                                            Facturas sin soporte&nbsp;&nbsp;
                                            <span class="badge rounded-pill text-bg-primary">
                                                ${id}
                                            </span>
                                            &nbsp;&nbsp;
                                            <span class="badge rounded-pill text-bg-primary">
                                                ${oDataSoportes.length}
                                            </span>&nbsp;&nbsp;
                                        `,
                                        toolbar: `
                                            <div class="btn-group">
                                                <button type="button" class="btn btn-primary dropdown-toggle btn-circle" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                                    </svg>
                                                </button>
                                                <ul class="dropdown-menu">
                                                    <li data-id="${id}"><a class="dropdown-item" id="descargar-soporte" data-id="SF">Descargar</a></li>
                                                </ul>
                                            </div>
                                        `,
                                        events: {
                                            render: function () { },
                                            close: function () { },
                                        }
                                    });
                                    document.querySelector("#descargar-soporte").addEventListener("click", function (event) {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        const id = element.dataset.id;
                                        const estado = oDataArchive[0].ie;
                                        const data = {
                                            ts: id,
                                            a: asegurador,
                                            p: session.user.ir,
                                            e: estado
                                        };
                                        console.log(data);
                                        axios.post(app.config.server.php1 + "x=download&y=descargaFacturasSinSoporte&ts=" + (new Date).getTime(), data)
                                            .then((function (response) {
                                                console.log(response);
                                                const link = document.createElement("a");

                                                link.href = app.config.server.path + response.data[0].file + "?ts=" + new Date().getTime();
                                                link.download = "facturas_sin_soporte.xlsx";

                                                console.log(link.href);
                                                document.body.appendChild(link);

                                                link.click();

                                                document.body.removeChild(link);
                                            })).catch((function (error) {
                                                console.log(error);
                                            }));

                                    });
                                });
                            });

                            document.querySelector("#solicitar-conciliacion").addEventListener("click", function () {
                                console.log("#solicitar-conciliacion.click");
                                console.log(oDataAsegurador);

                                const template = `
                                    <ul class="list-group mt-n3">
                                        {{~ it.detail: d:id}}
                                        <li class="list-group-item">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" value="" id="{{=d.nf}}" data-op="{{=d.nf}}">
                                                <label class="form-check-label" for="{{=d.nf}}">
                                                    {{=d.nf}}
                                                </label>
                                            </div>
                                        </li>
                                        {{~}}
                                    </ul>

                                    <div class="text-center mt-3">
                                        <button id="guardar-solicitud" class="btn btn-primary">Solicitar</button>
                                    </div>
                                `;

                                const html = doT.template(template)({ detail: oDataAsegurador });
                                session.dialog = new nataUIDialog({
                                    html: html,
                                    height: 400,
                                    width: 600,
                                    title: `
                                        Solicitud Conciliacion&nbsp;&nbsp;
                                        <span class="badge rounded-pill text-bg-primary">
                                            ${oDataAsegurador[0].a}
                                        </span>

                                    `,
                                    events: {
                                        render: function () { },
                                        close: function () { },
                                    }
                                });

                                document.getElementById("guardar-solicitud").addEventListener("click", function() {
                                    let checkboxesSeleccionados = [];

                                    let checkboxes = document.querySelectorAll("input[type='checkbox']");

                                    checkboxes.forEach(checkbox => {
                                        //console.log(checkbox);
                                        if (checkbox.checked) {
                                            checkboxesSeleccionados.push({
                                                id: checkbox.id
                                            });
                                        }
                                    });

                                    console.log(checkboxesSeleccionados);

                                    const data = {
                                        u: session.user.i,
                                        f: checkboxesSeleccionados
                                    };

                                    swal({
                                        title: "¿Está seguro de actualizar las facturas para conciliar?",
                                        text: "",
                                        icon: "warning",
                                        buttons: ["CANCELAR", "Sí, continuar"],
                                        dangerMode: true,
                                    }).then(async (response) => {
                                        if (response) {
                                            axios.post(app.config.server.php1 + "x=cartera&y=solicitarConciliacion", data)
                                                .then(response => {
                                                    console.log(response.data);
                                                    swal("Éxito","Se han actualizado las facturas para conciliar", "success");                                                    
                                                })
                                                .catch(error => {
                                                    console.error(error);
                                                });                                            
                                        }
                                    });

                                    
                                });
                            });

                            document.querySelector("#verificar-factura-xml-asegurador").addEventListener("click", function(e){
                                console.log("#verificar-factura-xml.click");
                                const element = e.target;
            
                                const id = element.dataset.id;
                                console.log(id);
            
                                document.getElementById("loader").style.display = "block";
            
                                axios.get("https://cdn1.artemisaips.com/index.php?x=soporte&y=validarFacturaDetalle&z=" + app.config.client + "&w=" + id + "&t=" + oDataAsegurador[0].a + "&ts=" + (new Date).getTime())
                                    .then((function(response) {
                                        console.log(response.data);
            
                                        if(response.data.factura && response.data.factura.length > 0){
                                            document.getElementById("loader").style.display = "none";
            
                                            swal("Error", "Hay facturas que no se ha cargado el XML", "error");
            
                                            const options = {
                                                id: "tableFacturaXML",
                                                columns: [
                                                    {
                                                        title: "Número Factura",
                                                        width: "250",
                                                        prop: "nf"
                                                    }
                                                ],
                                                data: response.data.factura
                                            };
            
                                            nata.sessionStorage.setItem("widget", options);
            
                                            new nataUIDialog({
                                                html: `
                                                        <div class="w-100 scroll-y d-flex justify-content-center text-center">
                                                            <nata-ui-table></nata-ui-table>
                                                        </div>
                                                    `,
                                                title: `
                                                        Facturas sin factura XML&nbsp;&nbsp;
                                                        <span class="badge rounded-pill text-bg-primary">
                                                            Estado: ${id} 
                                                        </span>
                                                        &nbsp;&nbsp;
                                                        <span class="badge text-bg-danger pulse-red rounded-pill">
                                                            ${response.data.factura.length}
                                                        </span>
                                                    `,
                                                height: 350,
                                                width: 450,
                                                events: {
                                                    render: function () {},
                                                    close: function () {},
                                                }
                                            });
                                        }
                                        else if(response.data.length > 0){
                                            document.getElementById("loader").style.display = "none";
            
                                            const options = {
                                                id: "tableSoportes",
                                                columns: [
                                                    {
                                                        title: "Número Factura",
                                                        width: "150",
                                                        prop: "nf"
                                                    },
                                                    {
                                                        title: "Código",
                                                        width: "200",
                                                        prop: "c"
                                                    },
                                                    {
                                                        title: "Soporte Requerido",
                                                        width: "450",
                                                        prop: "m"
                                                    }
                                                ],
                                                data: response.data
                                            };
            
                                            nata.sessionStorage.setItem("widget", options);
                                            
                                            
                                            new nataUIDialog({
                                                html: `
                                                        <div class="w-100 scroll-y">
                                                            <nata-ui-table></nata-ui-table>
                                                        </div>
                                                    `,
                                                title: `
                                                        Soportes faltantes&nbsp;&nbsp;
                                                        <span class="badge rounded-pill text-bg-primary">
                                                            Estado: ${id} 
                                                        </span>
                                                        &nbsp;&nbsp;
                                                        <span class="badge text-bg-danger pulse-red rounded-pill">
                                                            ${response.data.length} Errores
                                                        </span>
                                                    `,
                                                events: {
                                                    render: function () {},
                                                    close: function () {},
                                                }
                                            });
                                        }
                                        else{
                                            swal("Éxito", "Las facturas cumplen con los soportes facturados", "success");
                                        }
                                        
                                    })).catch((function(error) {
                                        console.log(error);
                                    }));
            
                            });

                            document.querySelector("#asistente-gestion").addEventListener("click", function(e){
                                const element = e.target;
                                const id = element.dataset.id;
                                const asegurador = oDataAsegurador[0].asel;
                                const tipoPoliza = oDataAsegurador[0].l;
                                console.log(oDataAsegurador);

                                const dataArray = [id, asegurador, tipoPoliza];
                                app.wizard.armado.index(dataArray);
                            });

                            // if(data[0].l.includes("glosa")){
                            //     document.querySelector("#wizard-glosa").addEventListener("click", function(e){
                            //         console.log("wizard-glosa.click");

                            //         const element = e.target;
                            //         const id = element.dataset.id;
                            //         const asegurador = oDataAsegurador[0].a;
                            //         console.log(id, asegurador);

                            //         axios.get(app.config.server.php1 + "x=cartera&k=validarGlosa&x=" + id + "&y=" + asegurador + "&ts=" + new Date().getTime())
                            //             .then(function(response){
                            //                 console.log(response.data);

                            //                 if (response.data.status === "success") {
                            //                     let dataArray = [id, asegurador];
                                                
                            //                     app.documentacion.wizard.render_v1("asistente-respuesta-glosa", "Asistente respuesta glosa", dataArray);
                            //                 } else {
                            //                     swal("Error", response.data.message, "error");
                            //                 }
                            //             })
                            //             .catch(function(error){
                            //                 console.error("Error en la solicitud: ", error);
                            //             });


                            //     });
                            // }
                        }
                    }

                    else if (element.classList.contains("btn-soportes")) {
                        const numeroFactura = element.dataset.id;
                        axios.get("https://cdn1.artemisaips.com/index.php?k=soat&x=soportesVer&y=" + app.config.client + "&w=" + numeroFactura + "&z=4")
                            .then((function(response) {
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
                                const html = doT.template(template)({detail: response.data});

                                new nataUIDialog({
                                    html: html,
                                    title: `
                                        Soportes <span class="badge rounded-pill text-bg-primary">${numeroFactura}</span>
                                    `,
                                    events: {
                                        render: function () {},
                                        close: function () {
                                            document.querySelector("#chatBubble").style.display = "none";
                                        }
                                    }
                                });

                            })).catch((function(error) {
                                console.error(error);
                            }));
                    }
                });
            },

            render_v1: function (element, label) {
                console.log("app.core.monitor.detalle.render_v1");

                const id = element.dataset.id;
                const idPerfil = element.dataset.idPerfil;
                const idTipo = element.dataset.idTipo;

                console.log(idTipo);

                if (id == "64") {
                    const userString = localStorage.getItem("user");
                    const user = JSON.parse(userString);

                    user.idEstado = id;
                    localStorage.setItem("user", JSON.stringify(user));
                    session.user = nata.localStorage.getItem("user", session.user);
                }

                axios.get(app.config.server.php1 + "x=soat&k=monitorDetalle&x=" + id + "&y=" + idPerfil + "&z=" + session.user.i)
                    .then((function (response) {
                        console.log(response.data);
                        if (response.data.length == 0) {
                            swal("Error", "No se han recibido datos del detalle !!", "error");
                            return false;
                        }

                        // crear los totales de cantidad y valor para cada asegurador
                        const strSQL = `
                                SELECT
                                    a,
                                    COUNT(1) AS tc,
                                    SUM(sa::NUMBER) AS ts
                                FROM ?
                                GROUP BY a
                                ORDER BY SUM(sa::NUMBER) DESC;
                            `;
                        const oData = alasql(strSQL, [response.data]);
                        nata.sessionStorage.setItem("soat-glosa-total-asegurador", oData);
                        console.log(oData);
                        // fin


                        const dataEstados = nata.localStorage.getItem("soat-estados");
                        console.log(dataEstados);

                        const strEstado = dataEstados.filter(function (record) {
                            return record.ie == id;
                        })[0].n;
                        console.log(strEstado);

                        /* enviar id y estado */
                        const dataEstado = {
                            ie: id,
                            e: strEstado
                        };

                        app.core.monitor.detalle.render(response.data, dataEstado, idTipo, label);
                    })).catch((function (error) {
                        console.error(error);
                    }));
            },

            render_v2: function (element, idEstado, label) {
                console.log("app.core.monitor.detalle.render_v2");

                // const idPerfil = element.dataset.idPerfil;
                const idTipo = element.dataset.idTipo;

                console.log(idTipo);
                console.log(element);

                if (idEstado == "64") {
                    const userString = localStorage.getItem("user");
                    const user = JSON.parse(userString);
                    user.idEstado = idEstado;
                    localStorage.setItem("user", JSON.stringify(user));
                    session.user = nata.localStorage.getItem("user", session.user);
                }

                axios.get(app.config.server.php1 + "x=soat&k=monitorDetalle&x=" + idEstado + "&y=" + session.user.ir + "&z=" + session.user.i)
                    .then((function (response) {
                        console.log(response.data);
                        if (response.data.length == 0) {
                            swal("Error", "No se han recibido datos del detalle !!", "error");
                            return false;
                        }

                        // crear los totales de cantidad y valor para cada asegurador
                        const strSQL = `
                            SELECT
                                a,
                                COUNT(1) AS tc,
                                SUM(sa::NUMBER) AS ts
                            FROM ?
                            GROUP BY a
                            ORDER BY SUM(sa::NUMBER) DESC;
                        `;

                        const oData = alasql(strSQL, [response.data]);
                        nata.sessionStorage.setItem("soat-glosa-total-asegurador", oData);
                        console.log(oData);
                        // fin

                        const dataEstados = nata.localStorage.getItem("soat-estados");
                        console.log(dataEstados);

                        const strEstado = dataEstados.filter(function (record) {
                            return record.ie == idEstado;
                        })[0].n;
                        console.log(strEstado);

                        /* enviar idEstado y estado */
                        const dataEstado = {
                            ie: idEstado,
                            e: strEstado
                        };

                        app.core.monitor.detalle.render(response.data, dataEstado, idTipo, label);
                    })).catch((function (error) {
                        console.error(error);
                    }));
            }
        },
        events: function (data, label) {
            console.log("app.core.monitor.events");
            document.querySelector("#tableMonitorSOAT").addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();

                const element = event.target;
                if (element.classList.contains("btn-detalle")) {
                    app.core.monitor.detalle.render_v1(element, label);
                }
                else if (element.classList.contains("btn-detail-download")) {
                    console.log("btn-detail-download");

                    data = {
                        sp: "carteraSoat_EstadoFacturasGet",
                        p: [
                            {
                                v: element.dataset.id
                            }
                        ]
                    };

                    console.log(data);
                    const elLoader = document.getElementById("loader");
                    if (elLoader !== null) elLoader.style.display = "block";

                    axios.post(app.config.server.php1 + "x=excel&y=download&ts=" + new Date().getTime(), data)
                        .then((function (response) {
                            console.log(response.data);
                            document.getElementById("loader").style.display = "none";
                            const $file = app.config.server.path + response.data[0].file;
                            // document.body.removeChild(link);
                            document.getElementById("loader").style.display = "none";
                            let html = `
                              <div class="text-center">
                                <a href="${$file + "?ts=" + new Date().getTime()}" class="btn btn-primary" target="_blank">Descargar</a>
                              </div>
                            `;
                            const optionsDialog = {
                                height: 150,
                                width: 300,
                                html: html,
                                title: "Soportes",
                            };
                            new nataUIDialog(optionsDialog);


                        })).catch((function (error) {
                            document.getElementById("loader").style.display = "none";
                            console.error(error);
                        }));
                }
            });
        }
    },

    otrasPolizas: {
        render: function (data, tag = "") {
            console.trace("%c app.core.otrasPolizas.render ", "background:red;color:#fff;font-size:11px");
            /* eventos monitor maestro */
            /*
            let totalSum2 = 0;
            for (let i = 0; i < data.length; i++) {
                let cantidad2 = parseInt(data[i].c, 10);
                totalSum2 += cantidad2;
                //console.log(totalSum2);
            }
            */

            //alert("A02: " + tag);
            let class_ = "text-bg-danger pulse-red";
            console.log(tag);
            if (tag.indexOf("radicacion") !== -1) {
                class_ = "text-bg-naranja";
            }
            //alert("A03: " + class_);

        

            const strSQL = `
                    SELECT *
                    FROM ?
                    ORDER BY s::NUMBER DESC;
                `;
            
            const oData = alasql(strSQL, [data]);

            const options = {
                id: "tableMonitorOtros",
                columns: [
                    {
                        title: "",
                        width: "120",
                        prop: "ii",
                        class: "bold"
                    },
                    {
                        title: "Estado",
                        width: "250",
                        prop: "e"
                    },
                    {
                        title: "Responsable",
                        width: "100",
                        prop: "r",
                        class: "font-size-13px",
                        widget: {
                            w: "badge",
                            c: class_
                        }
                    },
                    {
                        title: "Descripción",
                        width: "300",
                        prop: "d"
                    },
                    {
                        title: "Saldo",
                        width: "140",
                        prop: "s",
                        type: "number",
                        class: "text-end",
                        widget: {
                            w: "badge",
                            c: class_
                        }
                    },
                    {
                        title: "",
                        width: "100",
                        prop: "c",
                        class: "text-end",
                        widget: {
                            w: "badge",
                            c: class_
                        }
                    },
                    {
                        title: "",
                        width: "150",
                        class: "text-end",
                        html: `
                            <div class="btn-group me-2" role="group" aria-label="First group">
                                <button type="button" class="btn btn-primary btn-detalle-otros"
                                    data-id="[id]"
                                    data-id-perfil="${session.user.ir}"
                                    data-id-tipo="noSoat"
                                >
                                    <svg class="btn-detalle-otros" data-id-tipo="noSoat" data-id="[id]" data-id-perfil="${session.user.ir}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                        <path class="btn-detalle-otros" data-id-tipo="noSoat" data-id="[id]" data-id-perfil="${session.user.ir}" stroke-linecap="round" stroke-linejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </button>
                                <button type="button" class="btn btn-primary btn-detail-download-otros" data-id="[id]">
                                    <svg class="btn-detail-download-otros" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        data-id="[id]">
                                        <path
                                            data-id="[id]"
                                            class="btn-detail-download-otros stroke-transparent fill-white" d="M5 3C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3H5M5 5H19V19H5V5M13 12L16.2 17H14.2L12 13.2L9.8 17H7.8L11 12L7.8 7H9.8L12 10.8L14.2 7H16.2L13 12Z" />
                                    </svg>
                                </button>
                            </div>
                        `
                    }
                ],
                data: oData
            };
            nata.sessionStorage.setItem("widget", options);
            if (
                session.user.ir == 0 || session.user.ir == 1 || session.user.ir == 11 
                || session.user.ir == 10 || session.user.ir == 12 || session.user.ir == 14 
                || session.user.ir == 15 || session.user.ir == 16 || session.user.ir == 17
                || session.user.ir == 18 || session.user.ir == 24
            ) {
                document.querySelector("#containerOtrasPolizas").innerHTML = `
                    <div>
                        <h5>Gestion Cartera HOMI - Otros Aseguradores &nbsp;&nbsp;&nbsp;&nbsp;
                        <span id="badgeTotalCantidad2" class="text-end text-bg-danger pulse-red badge m-end-3 rounded-pill"></span>
                        <span id="badgeTotal2" class="text-end text-bg-danger pulse-red badge rounded-pill"></span>
                        <br/>
                        <br/>
                        <div id="containerNoSoat">
                            <nata-ui-table></nata-ui-table>
                        </div>
                    </div>
                `;
            }

            const fxTotalesRefresh2 = function (data) {
                let totalCantidad = 0, total = 0;
                let i;
                for (i = 0; i < data.length; i++) {
                    totalCantidad += parseFloat(data[i].c);
                    total += parseFloat(data[i].s);
                }

                let element = document.querySelector("#badgeTotalCantidad2");
                if (element !== null) element.innerHTML = totalCantidad;

                element = document.querySelector("#badgeTotal2");
                if (element !== null) element.innerHTML = numberDecimal.format(total);

                element = document.querySelector("#tableMonitorOtros");
                if (element !== null) {
                    element.addEventListener("click", function (event) {
                        //alert("1");
                        event.preventDefault();
                        event.stopPropagation();

                        const element = event.target;
                        if (element.classList.contains("btn-detalle-otros")) {
                            console.log("btn-detalle.click");

                            const id = element.dataset.id;
                            const idPerfil = element.dataset.idPerfil;
                            const idTipo = element.dataset.idTipo;
                            console.log(idPerfil);
                            console.log(id);

                            axios.get(app.config.server.php1 + "x=cartera&k=monitorDetalleOtrosAseguradores&x=" + id + "&y=" + idPerfil + "&z=" + session.user.i)
                                .then((function (response) {
                                    console.log(response.data);

                                    const strSQL = `
                                SELECT
                                    a,
                                    COUNT(1) AS tc,
                                    SUM(sa::NUMBER) AS ts
                                FROM ?
                                GROUP BY a
                                ORDER BY SUM(sa::NUMBER) DESC;
                            `;
                                    const oData = alasql(strSQL, [response.data]);
                                    nata.sessionStorage.setItem("soat-glosa-total-asegurador", oData);
                                    console.log(oData);

                                    const dataEstados = nata.localStorage.getItem("soat-estados");
                                    console.log(dataEstados);
                                    const strEstado = dataEstados.filter(function (record) {
                                        return record.ie == id;
                                    })[0].n;
                                    console.log(strEstado);

                                    /* enviar id y estado */
                                    const dataEstado = {
                                        ie: id,
                                        e: strEstado
                                    };
                                    console.log(dataEstado);
                                    app.core.monitor.detalle.render(response.data, dataEstado, idTipo);
                                })).catch((function (error) {
                                    console.error(error);
                                }));
                        }
                        else if (element.classList.contains("btn-detail-download-otros")) {
                            console.log("btn-detail-download");
                            console.log(element.dataset.id);
                            const data = {
                                sp: "carteraSoat_EstadoFacturasGet",
                                p: [
                                    {
                                        v: element.dataset.id
                                    }
                                ]
                            };
                            console.log(data);
                            document.getElementById("loader").style.display = "block";
                            axios.post(app.config.server.php1 + "x=excel&y=download&ts=" + new Date().getTime(), data)
                                .then((function (response) {
                                    console.log(response.data);
                                    document.getElementById("loader").style.display = "none";
                                    const file = app.config.server.path + response.data[0].file;
                                    // document.body.removeChild(link);
                                    document.getElementById("loader").style.display = "none";
                                    let html = `
                              <div class="text-center">
                                <a href="${file + "?ts=" + new Date().getTime()}" class="btn btn-primary" target="_blank">Descargar</a>
                              </div>
                            `;
                                    const optionsDialog = {
                                        height: 150,
                                        width: 300,
                                        html: html,
                                        title: "Soportes",
                                    };
                                    new nataUIDialog(optionsDialog);


                                })).catch((function (error) {
                                    document.getElementById("loader").style.display = "none";
                                    console.error(error);
                                }));

                        
                        }
                    });
                }

            };
            fxTotalesRefresh2(data);
        }
    },

    refresh: function () {
        console.log("app.core.refresh");
        localStorage.clear();
        nata.localStorage.setItem("user", session.user);
        location.reload();
        localforage.clear();
    },

    robot: {
        asistente: function(){
            console.log("app.core.robot.asistente");

            app.core.robot.message("¿En qué tarea quieres que te ayude hoy?");

            // const options = {
            //     id: "tableDetalleFacturas1",
            //     columns: [
            //         {
            //             title: "Tarea",
            //             width: "300",
            //             prop: "a"
            //         },
            //         {
            //             title: "Descripción",
            //             width: "200",
            //             prop: "fa"
            //         },
            //         {
            //             title: "",
            //             width: "150",
            //             prop: "da",
            //             class: "text-center",
            //             widget: {
            //                 w: "badge",
            //                 c: "text-bg-danger pulse-red"
            //             }
            //         }
            //     ],
            //     data: response.data
            // };

            // nata.sessionStorage.setItem("widget", options);
            // new nataUIDialog({
            //     html: `
            //         <div class="w-100 scroll-y scroll-x">
            //             <nata-ui-table></nata-ui-table>
            //         </div>
            //     `,
            //     title: `
            //         Control Actualización Aseguradoras
            //     `,
            //     events: {
            //         render: function () { },
            //         close: function () { },
            //     }
            // });
        },
        message: function (message, seconds = 10) {
            console.log("app.core.robot.message");
            const elChat = document.querySelector("#robot");
            elChat.message(message);
            document.querySelector("#chatBubble").style.display = "block";
            setTimeout(function(){
                document.querySelector("#chatBubble").style.display = "none";
            }, seconds * 1000);
        },
        close: function(){
            console.log("app.core.robot.close");
            document.querySelector("#chatBubble").style.display = 'none';
        }
    },

    radicacion: function () {
        console.log("app.core.radicacion");
        window.open("assets/docs/INSTRUCTIVO_PARA_ENTREGA_DE_ARMADO_A_BILLING_BRAIN_NUEVO.pdf", "_blank");
    },
    cums: {
        link: function (){
            console.log("app.core.cums.link");
            window.open("https://www.datos.gov.co/Salud-y-Protecci-n-Social/cum/mgbq-r724/about_data", "_blank");
        }
    }
};
 
/* eslint-disable indent */
/* globals app, nataUIDialog, axios, swal, session, nata, alasql */
app.furips = {

    render: function () {
        console.log("app.furips.render");
        app.core.dialog.removeAll();

        const template = `
            <div class="container mt-7">
                <h1 class="mb-4">Subida furips anexo 1 </h1>
                <form id="frmUpload" enctype="multipart/form-data">
                    <div class="mb-3">
                        <div class="alert alert-info" role="alert">
                          Por favor no olvide cargar el archivo de furips anexo 1 con el nombre:
                          <strong>furips.xlsx</strong>
                        </div>
                        <label for="excelFile" class="form-label">Archivos tipo Excel:</label>
                        <input id="inputExcelFile" name="inputExcelFile" type="file" class="form-control" accept=".xls, .xlsx">
                    </div>
                    <button type="submit" class="btn btn-primary">Subir</button>
                </form>
            </div>
        `;

        new nataUIDialog({
            height: 400,
            width: 500,
            html: template,
            title: "Generar Furips",
            events: {
                render: function() {},
                close: function() {}
            }
        });
		const lote = new Date().getTime();
        //const lote=1697164458518;
        document.querySelector("#frmUpload").addEventListener("submit", function(event) {
          event.stopPropagation();
          event.preventDefault();

          const formData = new FormData();
          const excelFile = document.querySelector("#inputExcelFile");
          formData.append("excel", excelFile.files[0]);

          document.getElementById("loader").style.display = "block";


         //console.log(lote);
          axios.post(app.config.server.php1 + "x=furips&y=upload&userid=" + session.user.i + "&etl=etlFuripsAnexo1&lote="+lote, formData, {
              headers: {
                  "Content-Type": "multipart/form-data"
              }
          }).then(response => {
            document.getElementById("loader").style.display = "none";
            const filename = lote+".7z"; // Reemplaza con el nombre de tu archivo 7z

            const url = "assets/docs/furips/" + filename;

            // Crear el contenido del cuadro de diálogo con el enlace de descarga
            const dialogContent = document.createElement("div");
            dialogContent.innerHTML = `
              <p>Registro Exitoso</p>
              <p>Se registraron los datos, el número de lote es: ${lote}</p>
              <p>Enlace de descarga: <a href="${url}" download="${filename}">Descargar archivo</a></p>
            `;
            swal({
              content: dialogContent,
              icon: "success"
            });
            console.log(response);

          }).catch(error => {
              document.getElementById("loader").style.display = "none";
              swal("Fallo en la carga", "contactar a soporte", "error");
              console.error("Error al cargar el archivo");
              console.error(error);
          });
      }, true);
    },

    renderV1: function () {
        console.log("app.furips.renderV1");
        const template = `
            <nata-ui-upload
                data-file-types="xlsx"
                data-title="Carga Excel Furips"
                data-subtitle="Archivo con información de FURIPS"
                data-url="${app.config.server.php1}x=furips&z=upload"
                data-etl="etlFurips.sh"
                data-userid="${session.user.i}"
                data-idlocal="${new Date().getTime()}"
            ></nata-ui-upload>
        `;
        new nataUIDialog({
            height: 400,
            width: 500,
            html: template,
            title: "Generar Furips",
            events: {
                render: function() {},
                close: function() {}
            }
        });
    },

    porFactura: {
        render: function () {
            console.log("app.furips.porFactura.render");
            new nataUIDialog({
                html: "",
                title: "Generar Furips",
                events: {
                    render: function() {},
                    close: function() {}
                }
            });
        },

        renderV1: function () {
            console.log("app.furips.porFactura.renderV1");
            const html = `
                <div id="containerFuripsPorFactura">
                    <div class="row">
                        <div class="col-12 col-lg-6">
                            <form id="frmFuripsPorFacturas">
                                <div class="mb-3">
                                    <textarea
                                        id="tarFacturas"
                                        class="form-control" placeholder="Ingresa las facturas, una por línea"></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary">Generar</button>
                            </form>
                        </div>
                        <div class="col-12 col-lg-6"></div>
                    </div>
                </div>
            `;
            new nataUIDialog({
                html: html,
                title: "Generar Furips",
                events: {
                    render: function() {},
                    close: function() {}
                }
            });

            document.querySelector("#frmFuripsPorFacturas").addEventListener("submit", function(event) {
                event.preventDefault();
                event.stopPropagation();


                const value = document.querySelector("#tarFacturas").value;
                const data = value.split(/\n/);

                let i;
                const oFacturas = [];
                for (i=0;i<data.length; i++) {
                    oFacturas.push({
                        f: data[i]
                    });
                }

                console.log(data);
                console.log(oFacturas);

                //console.log(app.core.file.exists(app.config.server.cdn + "x=f&y=g&z=furips-anexo1-IND206726.pdf"));

                axios.post(app.config.server.cdn + "x=f&y=e&z=" + oFacturas[0].f, oFacturas)
                    .then((function(response) {
                        console.log(response.data);

                        // existe
                        if (response.data.r == "0fb38d4b-e05e-437e-80b7-e78b7e6760da") {
                            const element = document.querySelector("#containerFuripsPorFactura");
                            const url = app.config.server.cdn.replace("index.php?", "") + "fffab1ab-db52-4863-8468-bfa133071df4/f/furips-anexo1-" + oFacturas[0].f  + ".pdf";
                            console.log(url);
                            element.innerHTML = `
                                <a href="${url}" target="_new">Descargar FURIPS</a>
                            `;
                        }

                    })).catch((function(error) {
                        console.log(error);
                    }));

            }, true);
        }
    },

    buscar: function(){
        console.log("%c app.furips.buscar", "background:red;color:#fff;font-size:11px");

        const elements = document.querySelectorAll(".ui-dialog");
        console.log(elements);
        let i;
        for (i = 0; i < elements.length; i++) {
            elements[i].remove();
        }

        let html = `
            <div class="text-center">
                <input id="buscar-furips" class="form-control mr-2 outline-0" type="search" placeholder="Buscar furips..." aria-label="Search" autocomplete="off">
                <button id="btn-buscar-furips" class="btn btn-outline-primary mt-3" type="submit">
                    Generar Furips
                </button>
            </div>
        `;
        const optionsDialog = {
            height: 185,
            width: 300,
            html: html,
            title: "Generar furips",
        };

        new nataUIDialog(optionsDialog);

        document.querySelector("#btn-buscar-furips").addEventListener("click", function() {
            const furips = document.querySelector("#buscar-furips").value;
            console.log(furips);

            const maxParFacturaLength = 12;

            if (furips.length > maxParFacturaLength) {
                swal(app.config.title, "El valor es demasiado largo para la factura", "error");
                return false;
            }

            const elements = document.querySelectorAll(".ui-dialog");
            console.log(elements);
            let i;
            for (i = 0; i < elements.length; i++) {
                elements[i].remove();
            }

            document.getElementById("loader").style.display = "block";

            axios.get(app.config.server.php1 + "x=cartera&y=buscarFurips&z=" + furips)
                .then(function(response){
                    console.log(response.data);

                    document.getElementById("loader").style.display = "none";

                    if (response.data == "No hay furips para esa factura") {
                        swal(app.config.title, response.data, "success");
                        return false;
                    }

                    if(response.data.malla){
                        console.log(response.data.malla);

                        let options = {
                            id: "tableValidacionFurips",
                            title: "Furips 1",
                            columns: [
                                {
                                    title: "Número Factura",
                                    width: "150",
                                    prop: "factura"
                                },
                                {
                                    title: "Campo",
                                    width: "100",
                                    prop: "campo"
                                },
                                {
                                    title: "Campo Descripción",
                                    width: "200",
                                    prop: "campo_descripcion"
                                },
                                {
                                    title: "Descripción Error",
                                    width: "450",
                                    prop: "descripcion_error"
                                },
                                {
                                    title: "Valor",
                                    width: "150",
                                    prop: "valor"
                                }
                            ],
                            data: response.data.malla
                        };
                        
                        nata.sessionStorage.setItem("widget", options);

                        const strSQL = `
                            SELECT
                                COUNT(1) AS fc
                            FROM ?;
                        `;

                        const oData = alasql(strSQL, [response.data.malla]);
                        console.log(oData);

                        new nataUIDialog({
                            html: `
                                <div id="containerValidacion">
                                    <nata-ui-table></nata-ui-table>
                                </div>
                            `,
                            title: `
                                Validación furips&nbsp;&nbsp;
                                <span class="badge bg-primary">${furips}</span>
                                <span class="badge bg-danger">${oData[0].fc}</span>
                            `,
                            events: {
                                render: function () { },
                                close: function () { },
                            }
                        });

                        return false;
                    }

                    const file = app.config.server.path + "server/php/" + response.data;
                    console.log(file);
                    window.open(file, "_blank");
                })
                .catch(function(error){
                    console.log(error);
                }); 
        });
    },
    
    generarLote: function(){
        console.log("%c app.furips.generarLote", "background:red;color:#fff;font-size:11px");

        const elements = document.querySelectorAll(".ui-dialog");
        console.log(elements);
        let i;
        for (i = 0; i < elements.length; i++) {
            elements[i].remove();
        }

        let html = `
            <div class="text-center">
                <input id="generar-furips" class="form-control mr-2 outline-0" type="search" placeholder="Buscar lote..." aria-label="Search" autocomplete="off">
                <button id="btn-generar-furips" class="btn btn-outline-primary mt-3" type="submit">
                    Generar Furips por Lote
                </button>
            </div>
        `;
        const optionsDialog = {
            height: 185,
            width: 300,
            html: html,
            title: "Generar furips por Lote",
        };

        new nataUIDialog(optionsDialog);

        document.querySelector("#btn-generar-furips").addEventListener("click", function() {
            const lote = document.querySelector("#generar-furips").value;
            console.log(lote);

            const maxParLoteLength = 15;

            if (lote.length > maxParLoteLength) {
                swal(app.config.title, "El valor es demasiado largo para el lote", "error");
                return false;
            }

            const elements = document.querySelectorAll(".ui-dialog");
            console.log(elements);
            let i;
            for (i = 0; i < elements.length; i++) {
                elements[i].remove();
            }

            document.getElementById("loader").style.display = "block";

            axios.get(app.config.server.php1 + "x=cartera&y=generarFuripsLote&z=" + lote)
                .then(function(response){
                    console.log(response.data);

                    document.getElementById("loader").style.display = "none";

                    if (response.data == "No hay furips para ese lote") {
                        swal(app.config.title, response.data, "success");
                        return false;
                    }

                    if(response.data.malla){
                        console.log(response.data.malla);

                        let options = {
                            id: "tableValidacionFurips",
                            title: "Furips 1",
                            columns: [
                                {
                                    title: "Número Factura",
                                    width: "150",
                                    prop: "factura"
                                },
                                {
                                    title: "Campo",
                                    width: "100",
                                    prop: "campo"
                                },
                                {
                                    title: "Campo Descripción",
                                    width: "200",
                                    prop: "campo_descripcion"
                                },
                                {
                                    title: "Descripción Error",
                                    width: "450",
                                    prop: "descripcion_error"
                                },
                                {
                                    title: "Valor",
                                    width: "150",
                                    prop: "valor"
                                }
                            ],
                            data: response.data.malla
                        };
                        
                        nata.sessionStorage.setItem("widget", options);

                        const strSQL = `
                            SELECT
                                COUNT(1) AS fc
                            FROM ?;
                        `;

                        const oData = alasql(strSQL, [response.data.malla]);
                        console.log(oData);

                        new nataUIDialog({
                            html: `
                                <div id="containerValidacion">
                                    <nata-ui-table></nata-ui-table>
                                </div>
                            `,
                            title: `
                                Validación furips&nbsp;&nbsp;
                                <span class="badge bg-primary">${lote}</span>
                                <span class="badge bg-danger">${oData[0].fc}</span>
                            `,
                            events: {
                                render: function () { },
                                close: function () { },
                            }
                        });

                        return false;
                    }

                    const file = app.config.server.path + "server/php/" + response.data;
                    
                    window.open(file, "_blank");
                })
                .catch(function(error){
                    document.getElementById("loader").style.display = "none";
                    console.log(error.response.data);
                    swal("Error", error.response.data, "error");
                }); 
        });
    },

    precargarFurips: function (id) {
        console.log("%c app.furips.precargarFurips", "background:red;color:#fff;font-size:11px");

        axios.get(app.config.server.php1 + "x=furips&k=precarga&l=" + id)
            .then(function(response){
                console.log(response.data);
                const file = app.config.server.path + response.data[0].file;

                window.open(file, "_blank");
            })
            .catch(function(error){
                console.log(error);
            });
    },

    validarFurips: function (id, asegurador, label, list, callback) {
        console.trace("%c app.furips.validarFurips", "background:red;color:#fff;font-size:11px");
        let lote = new Date().getTime();

        if (asegurador === undefined) {
            asegurador = '';
        }

        if (list === undefined) {
            list = '';
        }

        document.getElementById("loader").style.display = "block";
        axios.get(app.config.server.php1 + "x=furips&k=validar&l=" + id + "&m=" + asegurador +"&n=" + lote)
            .then(function(response){
                console.log(response.data);
                console.log(response.data.estado);
                
                document.getElementById("loader").style.display = "none";

                // response.data.malla = '';

                if (response.data.estado.includes('NO SOAT')) {
                    callback(id, asegurador, label, list);
                    return;
                }                

                if (typeof response.data.malla == "undefined") {
                    response.data.malla = [];
                }

                if (response.data.polizaMal.length > 0) {
                    const polizaMalF = response.data.polizaMal.map(item => item.f).join(", ");
                    swal("Error", `En el estado se encuentran facturas no soat:\n\n${polizaMalF}`, "error");
                    return false;
                }
                else if (typeof callback == "undefined") {
                    console.error("No se ha recibido el callback !!");
                    return false;
                }
                else if (response.data.faltan.length > 0) {
                    app.core.robot.message("Hay facturas que no tienen furips.");
                    if(list === ''){
                        list = `
                            <div class="mb-3">
                                <table>
                        `;
                    }
        
                    const listProccess = `
                                <tr>
                                    <td>Validar furips</td>
                                    <td id="statusCircle" class="status-circle error">
                                    ✖
                                    </td>
                                </tr>
                            </table>
                        </div>
                    `;
                    list+=listProccess; 

                    console.log(list);

                    const options = {
                        id: "tableValidacionFurips",
                        columns: [
                            {
                                title: "Número Factura",
                                width: "150",
                                prop: "f"
                            },
                            {
                                title: "Asegurador",
                                width: "400",
                                prop: "a"
                            },
                            {
                                title: "",
                                width: "250",
                                html: `
                                    <div class="btn-group">
                                        <button type="button" data-id="[id]" class="btn btn-primary btn-sm btn-ver-factura">Ver Factura</button>
                                        <!--<button type="button" data-id="[id]" class="btn btn-primary btn-sm btn-buscar-siras">Buscar Siras</button> -->
                                    </div>
                                `,
                            },
                        ],
                        data: response.data.faltan
                    };
                    
                    nata.sessionStorage.setItem("widget", options);

                    const optionsDialog = {
                        html: `
                            ${list}
                            <nata-ui-table></nata-ui-table>
                        `,
                        title: `Validación furips&nbsp;&nbsp;
                            <span class="badge text-bg-primary">
                                ${id} - ${asegurador}
                            </span>&nbsp;&nbsp;
                            <span class="badge rounded-pill text-bg-danger">${response.data.faltan.length}</span>
                        `,
                        events: {
                            render: function () { },
                            close: function () { 
                                app.core.robot.close();
                            },
                        }
                    };

                    new nataUIDialog(optionsDialog);

                    return false;
                }
                else if (response.data.malla.length > 0) {
                    if(list === ''){
                        list = `
                            <div class="mb-3">
                                <table>
                        `;
                    }
        
                    const listProccess = `
                                <tr>
                                    <td>Validar furips</td>
                                    <td id="statusCircle" class="status-circle error">
                                    ✖
                                    </td>
                                </tr>
                            </table>
                        </div>
                    `;
        
                    list+=listProccess; 

                    console.log(list);

                    let options = {
                        id: "tableValidacionFurips",
                        columns: [
                            {
                                title: "Número Factura",
                                width: "150",
                                prop: "f"
                            },
                            {
                                title: "Campo",
                                width: "100",
                                prop: "c"
                            },
                            {
                                title: "Campo Descripción",
                                width: "200",
                                prop: "cd"
                            },
                            {
                                title: "Descripción Error",
                                width: "450",
                                prop: "d"
                            },
                            {
                                title: "Valor",
                                width: "150",
                                prop: "v"
                            }
                        ],
                        data: response.data.malla
                    };
                    
                    nata.sessionStorage.setItem("widget", options);

                    new nataUIDialog({
                        html: `
                            <div class="w-100 scroll-y scroll-x">
                                ${list}
                                <nata-ui-table></nata-ui-table>
                            </div>
                        `,
                        title: `Validación furips&nbsp;&nbsp;
                            <span class="badge text-bg-primary">
                                ${id} - ${asegurador}
                            </span>&nbsp;&nbsp;
                            <span class="badge rounded-pill text-bg-danger">${response.data.malla.length}</span>
                        `,
                        events: {
                            render: function () { },
                            close: function () { 
                                app.core.robot.close();
                            },
                        }
                    });

                    return false;
                }
                else {
                    app.core.robot.message("Espera un momento, estamos generando los furips");

                    document.getElementById("loader").style.display = "block";

                    axios.get(app.config.server.php1 + "x=furips&k=generar&l=" + lote)
                        .then(function(response){
                            console.log(response.data);
                            document.getElementById("loader").style.display = "none";

                            callback(id, asegurador, label, list, 1);
                        })
                        .catch(function(error){
                            console.error(error);
                        })
                }
                // return;
            })
            .catch(function(error){
                console.error(error);
            });

        // document.querySelector("#btn-validar-furips").addEventListener("click", function(){
        //     console.log("#btn-validar-furips.click");
        
        //     const selectValue = document.getElementById("validar-furips").value;

        //     const elements = document.querySelectorAll(".ui-dialog");
        //     let i;
        //     for (i = 0; i < elements.length; i++) {
        //         elements[i].remove();
        //     }

        //     document.getElementById("loader").style.display = "block";
        
        //     axios.get(app.config.server.php1 + "x=furips&k=validar&l=" + selectValue + "&m=" + lote)
        //         .then(function(response){
        //             console.log(response.data); 
        //             console.log(response.data.faltan); 
        //             console.log(response.data.malla);

        //             document.getElementById("loader").style.display = "none";
        //             let options = {
        //                 id: "tableValidacionFurips",
        //                 title: "Furips 1",
        //                 columns: [
        //                     {
        //                         title: "Número Factura",
        //                         width: "150",
        //                         prop: "f"
        //                     },
        //                     {
        //                         title: "Campo",
        //                         width: "100",
        //                         prop: "c"
        //                     },
        //                     {
        //                         title: "Campo Descripción",
        //                         width: "200",
        //                         prop: "cd"
        //                     },
        //                     {
        //                         title: "Descripción Error",
        //                         width: "450",
        //                         prop: "d"
        //                     },
        //                     {
        //                         title: "Valor",
        //                         width: "150",
        //                         prop: "v"
        //                     }
        //                 ],
        //                 data: response.data.malla
        //             };
                    
        //             nata.sessionStorage.setItem("widget", options);
                    

        //             new nataUIDialog({
        //                 html: `
        //                     <div class="w-100 scroll-y scroll-x">
        //                         <span class="badge bg-primary">${response.data.faltan[0].e}</span><br>
        //                         <div class="my-3 d-flex justify-content-between" role="group" aria-label="Basic radio toggle button group">
        //                             <div class="btn-group">
        //                                 <input
        //                                     id="radioMallaValidacion"
        //                                     type="radio"
        //                                     class="btn-check radio-menu radio-menu-0 remove"
        //                                     name="btnradio" autocomplete="off" checked>
        //                                 <label
        //                                     class="btn btn-outline-primary radio-menu radio-menu-0 remove"
        //                                     for="radioMallaValidacion">Validación por malla</label>
        //                                 <input id="radioDatosFurips"
        //                                     type="radio"
        //                                     class="btn-check radio-menu radio-menu-1 remove"
        //                                     name="btnradio"
        //                                     autocomplete="off">
        //                                 <label class="btn btn-outline-primary radio-menu radio-menu-1 remove"
        //                                     for="radioDatosFurips">Facturas sin datos en furips</label>
        //                             </div>
        //                             <button type="button" class="btn btn-outline-success me-6 download-excel">
        //                                 Descargar Excel
        //                             </button>
        //                         </div>
        //                         <div id="containerValidacion">
        //                             <nata-ui-table></nata-ui-table>
        //                         </div>
        //                     </div>
        //                 `,
        //                 title: "Validación furips&nbsp;&nbsp;",
        //                 events: {
        //                     render: function () { },
        //                     close: function () { },
        //                 }
        //             });

        //             if (document.querySelector("#radioMallaValidacion") != null) {
        //                 document.querySelector("#radioMallaValidacion").addEventListener("click", function () {
        //                     console.log("#radioMallaValidacion.click");

        //                     const options = {
        //                         id: "tableValidacionFurips",
        //                         columns: [
        //                             {
        //                                 title: "Número Factura",
        //                                 width: "150",
        //                                 prop: "f"
        //                             },
        //                             {
        //                                 title: "Campo",
        //                                 width: "100",
        //                                 prop: "c"
        //                             },
        //                             {
        //                                 title: "Campo Descripción",
        //                                 width: "200",
        //                                 prop: "cd"
        //                             },
        //                             {
        //                                 title: "Descripción Error",
        //                                 width: "450",
        //                                 prop: "d"
        //                             },
        //                             {
        //                                 title: "Valor",
        //                                 width: "150",
        //                                 prop: "v"
        //                             }
        //                         ],
        //                         data: response.data.malla
        //                     };
        //                     nata.sessionStorage.setItem("widget", options);
        //                     const element = document.querySelector("#containerValidacion");
        //                     element.innerHTML = "";
        //                     element.innerHTML = `
        //                         <nata-ui-table></nata-ui-table>
        //                     `;
        //                 });
        //             }
        //             if (document.querySelector("#radioDatosFurips") != null) {
        //                 document.querySelector("#radioDatosFurips").addEventListener("click", function () {
        //                     console.log("#radioDatosFurips.click");

        //                      const options = {
        //                         id: "tableValidacionFurips",
        //                         columns: [
        //                             {
        //                                 title: "Número Factura",
        //                                 width: "150",
        //                                 prop: "f"
        //                             },
        //                             {
        //                                 title: "Asegurador",
        //                                 width: "400",
        //                                 prop: "a"
        //                             }
        //                         ],
        //                         data: response.data.faltan
        //                     };
        //                     nata.sessionStorage.setItem("widget", options);
        //                     const element = document.querySelector("#containerValidacion");
        //                     element.innerHTML = "";
        //                     element.innerHTML = `
        //                         <nata-ui-table></nata-ui-table>
        //                     `;
        //                 });
        //             }

        //             document.querySelector(".download-excel").addEventListener("click", function(){
        //                 const buttonMalla = document.querySelector("#radioMallaValidacion");
        //                 const buttonFaltantes = document.querySelector("#radioDatosFurips");

        //                 let option;

        //                 if(buttonMalla.checked){
        //                     option = 1;
        //                 }
        //                 if(buttonFaltantes.checked){
        //                     option = 2;
        //                 }

        //                 axios.get(app.config.server.php1 + "x=download&k=validacionFurips&l=" + selectValue + "&m=" + lote + "&n=" + option)
        //                     .then(function(response){
        //                         console.error(response.data);
        //                         const file = app.config.server.path + response.data[0].file;
                                
        //                         window.open(file, "_blank");
        //                     })
        //                     .catch(function(error){
        //                         console.error(error);
        //                     });

        //             });
        //         })
        //         .catch(function(error){
        //             console.error(error);
        //         });
        // });
        
    }
};

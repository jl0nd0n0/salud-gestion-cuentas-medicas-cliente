/* globals app, nata, nataUIDialog, axios,swal, session, doT, flatpickr*/
app.wizard = {
    index: function (idEstado, asegurador) {
        if (idEstado == 267) {
            app.wizard.radicar.respuestaGlosa_v1();
        }
    },
    armado: {
        index: async function (data) {
            console.log("app.wizard.armado.index");
        
            const idEstado = data[0];
            const aseLabel = data[1];
            const label = data[2];
            console.log(data);
        
            const shouldContinue = await app.wizard.armado.validarFacturaDetalle(idEstado, aseLabel);

            const listProccess = `
                <div class="mb-3">
                    <table>
                        <tr>
                            <td>Validar carga factura detalle</td>
                            <td id="statusCircle" class="status-circle">
                            ✔
                            </td>
                        </tr>
                        <tr>
                            <td>Validar suma factura detalle</td>
                            <td id="statusCircle" class="status-circle">
                            ✔
                            </td>
                        </tr>
            `;
        
            if (shouldContinue) {
                // if(label.includes("glosa")){
                //     app.wizard.armado.validarGlosa(idEstado, aseLabel, listProccess, 2);
                // }else{
                app.wizard.armado.homologarSoportes(idEstado, aseLabel, label, listProccess, 1);
                // }                
            }
        },
        generarArmado: function (idEstado, aseLabel) {
            console.log("app.wizard.armado.generarArmado");
            console.log(idEstado, aseLabel);

            document.querySelector("#loader").style.display = "block";

            app.core.robot.message("Espera un momento, se está generando el armado de la aseguradora");

            axios.get("https://cdn1.artemisaips.com/index.php?k=robot&x=generarArmado&y=" + app.config.client + "&z=" + idEstado + "&w=" + aseLabel + "&ts=" + new Date().getTime())
                .then(function(response){
                    console.log(response.data);

                    document.querySelector("#loader").style.display = "none";

                    app.core.robot.close();
                    
                    const file = app.config.server.cdnPathBaseFiles + response.data;
                    console.log(file);
                    window.open(file, "_blank");
                })
                .catch(function(error){
                    console.error(error);
                });
        },
        homologarSoportes: function (idEstado, aseLabel, label, list, opcion) {
            console.log("app.wizard.armado.homologarSoportes");
            console.log(idEstado, aseLabel, opcion);
            
            if (list === undefined) {
                list = '';
            }

            if (opcion === undefined) {
                opcion = 0;
            }
    
            const data = {
                e : idEstado,
                a : aseLabel
            };

            app.core.robot.message("Espera un momento, estamos validando la homologación de los grupos de factura");
    
            document.querySelector("#loader").style.display = "block";
    
            axios.post(app.config.server.php1 + "x=armado&y=validarHomologacionGrupo&ts=" + (new Date).getTime(), data)
                .then(function(response){
                    console.log(response.data);
    
                    document.querySelector("#loader").style.display = "none";

                    // response.data = '';

                    if(response.data && response.data.length > 0){
                        app.core.robot.message("Hay grupos facturados que no han sido homologados o el grupo está en blanco");
    
                        const options = {
                            id: "tableHomologacionItems",
                            columns: [
                                {
                                    title: "Factura",
                                    width: "180",
                                    prop: "nf",
                                    class: "text-center"
                                },
                                {
                                    title: "Grupo",
                                    width: "250",
                                    prop: "g",
                                    class: "text-center"
                                }
                            ],
                            data: response.data
                        };
    
                        nata.sessionStorage.setItem("widget", options);

                        if(list === ''){
                            list = `
                                <div class="mb-3">
                                    <table>
                            `;
                        }

                        const listProccess = `
                                    <tr>
                                        <td>Validar homologación de la factura</td>
                                        <td id="statusCircle" class="status-circle error">
                                        ✖
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        `;

                        list+=listProccess;
    
                        const optionsDialog = {
                            html: `
                                ${list}
                                <div class="d-flex justify-content-start align-items-center">                                
                                    <!--<button type="button" class="btn btn-outline-success btn-descargar-codigos mb-3 me-3">Descargar Excel</button>-->
                                    <!--<button type="button" class="btn btn-primary btn-sm btn-avanzar">Siguiente</button>-->
                                </div>
                                <div id="tableContainer">
                                    <nata-ui-table></nata-ui-table>
                                </div>
                            `,
                            title: `Artemisa - Asistente de radicación
                                <span class="badge text-bg-primary">
                                    ${idEstado} - ${aseLabel}
                                </span>
                            `,
                            events: {
                                render: function () { },
                                close: function () { 
                                    app.core.robot.close();
                                }
                            }
                        };
                        new nataUIDialog(optionsDialog);
    
                        // document.querySelector(".btn-descargar-codigos").addEventListener("click", function(){
                        //     console.log("btn-descargar-codigos.click");
    
                        //     const file = app.config.server.path + response.data[1][0].file;
    
                        //     window.open(file, "_blank");
                        // });
                    }
                    else{
                        if(list === ''){
                            list = `
                                <div class="mb-3">
                                    <table>
                            `;
                        }

                        const listProccess = `
                            <tr>
                                <td>Validar homologación de la factura</td>
                                <td id="statusCircle" class="status-circle">
                                ✔
                                </td>
                            </tr>
                        `;

                        list+=listProccess;

                        if(opcion == 0){
                            swal("Éxito", "Todos los detalles de la factura están homologados", "success");
                        }
                        else if (opcion == 1){
                            console.log("Entró");
                            app.wizard.armado.validarSoportes(idEstado, aseLabel, label, list, 1);
                        }
                    }
                })
                .catch(function(error){
                    console.error(error);
                });
        },
        validarFacturaDetalle: function (idEstado, aseLabel) {
            console.log("app.wizard.armado.validarFacturaDetalle");
            console.log(idEstado, aseLabel);
        
            const data = {
                e: idEstado,
                a: aseLabel
            };
    
            document.querySelector("#loader").style.display = "block";

            app.core.robot.message("Espera un momento, estamos validando los detalles de la factura");
        
            return axios.post(app.config.server.php1 + "x=armado&y=validarFacturaDetalle&ts=" + (new Date).getTime(), data)
                .then(function (response) {
                    console.log(response.data);
    
                    document.querySelector("#loader").style.display = "none";
        
                    if (response.data && response.data.length > 0) {
                        app.core.robot.message("Hay detalles de facturas que no se han cargado en el sistema");
        
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
                            data: response.data
                        };
        
                        nata.sessionStorage.setItem("widget", options);
        
                        const optionsDialog = {
                            html: `
                                <div class="mb-3">
                                    <table>
                                        <tr>
                                            <td>Validar carga factura detalle</td>
                                            <td id="statusCircle" class="status-circle error">
                                            ✖
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="d-flex justify-content-evenly align-items-center">
                                    <nata-ui-table></nata-ui-table>
                                    <nata-ui-upload
                                        data-title="Subir detalles de factura"
                                        data-subtitle="Solo archivos con extensión zip"
                                        data-accept=".zip"
                                        data-url="https://homi.artemisaips.com/server/php/index.php?x=upload&y=fileZipDataUpdate_v1"
                                        data-etl=""
                                        data-consola=1
                                    ></nata-ui-upload>
                                </div>
                            `,
                            title: `Artemisa - Asistente de radicación
                                <span class="badge text-bg-primary">
                                    ${idEstado} - ${aseLabel}
                                </span>
                            `,
                            events: {
                                render: function () { 
                                },
                                close: function () {
                                    app.core.robot.close();
                                }
                            }
                        };
                        new nataUIDialog(optionsDialog);
        
                        return false;
                    } else if (response.data.length === 0) {
                        return axios.post(app.config.server.php1 + "x=armado&y=validarSumaItemsFactura&ts=" + (new Date).getTime(), data)
                            .then(function (response) {
                                console.log(response.data);
        
                                if (response.data && response.data.length > 0) {
                                    app.core.robot.message("Hay facturas que no coinciden la suma de los detalles contra el valor de la factura");
        
                                    const options = {
                                        id: "tableSumaFacturaDetalle",
                                        columns: [
                                            {
                                                title: "Numero Factura",
                                                width: "120",
                                                prop: "nf",
                                                class: "text-center"
                                            },
                                            {
                                                title: "Valor factura",
                                                width: "150",
                                                prop: "vd",
                                                type: "number",
                                                class: "text-center",
                                                widget: {
                                                    w: "badge",
                                                    c: "text-bg-danger pulse-red"
                                                }
                                            },
                                            {
                                                title: "Suma Detalles",
                                                width: "150",
                                                prop: "sd",
                                                type: "number",
                                                class: "text-center",
                                                widget: {
                                                    w: "badge",
                                                    c: "text-bg-danger pulse-red"
                                                }
                                            }
                                        ],
                                        data: response.data
                                    };
        
                                    nata.sessionStorage.setItem("widget", options);
        
                                    const optionsDialog = {
                                        html: `
                                            <div class="mb-3">
                                                <table>
                                                    <tr>
                                                        <td>Validar carga factura detalle</td>
                                                        <td id="statusCircle" class="status-circle">
                                                        ✔
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Validar suma factura detalle</td>
                                                        <td id="statusCircle" class="status-circle error">
                                                        ✖
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                            <nata-ui-table></nata-ui-table>
                                        `,
                                        title: `Artemisa - Asistente de radicación
                                            <span class="badge text-bg-primary">
                                                ${idEstado} - ${aseLabel}
                                            </span>
                                        `,
                                        events: {
                                            render: function () { },
                                            close: function () { 
                                                app.core.robot.close();
                                            }
                                        }
                                    };
                                    new nataUIDialog(optionsDialog);
        
                                    return false;
                                }
                                return true;
                            })
                            .catch(function (error) {
                                console.error(error);
                                return false;
                            });
                    }
                    return true;
                })
                .catch(function (error) {
                    console.error(error);
                    return false;
                });
        },
        validarFurips: function (idEstado, aseLabel, label, list, opcion) {
            console.log("app.wizard.armado.validarFurips");
            console.log(idEstado, aseLabel);

            if (list === undefined) {
                list = '';
            }

            if (opcion === undefined) {
                opcion = 0;
            }

            app.core.robot.message("Espera un momento, estamos validando los furips");

            document.querySelector("#loader").style.display = "block";

            const fxCallback = function (idEstado, aseLabel, label, list) {
                if(list === ''){
                    list = `
                        <div class="mb-3">
                            <table>
                    `;
                }

                const listProccess = `
                    <tr>
                        <td>Validar furips</td>
                        <td id="statusCircle" class="status-circle">
                        ✔
                        </td>
                    </tr>
                `;

                list+=listProccess;

                if(opcion == 0){
                    swal("Éxito", "Todos los furips están correctos", "success");
                }
                else if (opcion == 1){
                    app.wizard.armado.validarSoportesMAOS(idEstado, aseLabel, label, list, 1)
                    // app.wizard.armado.generarArmado(idEstado, aseLabel, list, 1);
                    // console.log(idEstado, aseLabel, list);
                }
            };
            app.furips.validarFurips(idEstado, aseLabel, label, list, fxCallback);

            console.log(fxCallback);
        },
        validarGlosa: function (idEstado, aseLabel, list, opcion){
            console.log("app.wizard.armado.validarGlosa");
            console.log(idEstado, aseLabel, opcion);

            if (list === undefined) {
                list = '';
            }

            if (opcion === undefined) {
                opcion = 0;
            }

            app.core.robot.message("Espera un momento, estamos validando las respuestas de glosa");

            document.querySelector("#loader").style.display = "block";

            axios.get(app.config.server.php1 + "k=glosa&x=validarRespuestaGlosa&y=" + idEstado + "&y=" + aseLabel + "&ts=" + new Date().getTime())
                .then(function(response){
                    console.log(response.data);

                    document.querySelector("#loader").style.display = "none";

                    // response.data = '';

                    if (response.data && response.data.length > 0) {
                        app.core.robot.message("Hay inconsistencias con las respuestas de glosa, valida por favor");
                    
                        const hasValidMessage = response.data.some(item => item.m === "Hay ítems con valor aceptado, es necesario revisar antes de radicar");
                    
                        const options = {
                            id: "tableInconsistenciasGloa",
                            columns: [
                                {
                                    title: "Mensaje",
                                    width: "350",
                                    prop: "m"
                                },
                                {
                                    title: "Número Factura",
                                    width: "130",
                                    prop: "nf"
                                },
                                {
                                    title: "Valor Glosa",
                                    width: "120",
                                    prop: "vg",
                                    type: "number",
                                    class: "text-end",
                                    widget: {
                                        w: "badge",
                                        c: "text-bg-danger"
                                    }
                                },
                                {
                                    title: "Valor Aceptado",
                                    width: "120",
                                    prop: "va",
                                    type: "number",
                                    class: "text-end",
                                    widget: {
                                        w: "badge",
                                        c: "text-bg-danger"
                                    }
                                },
                                {
                                    title: "Valor No Aceptado",
                                    width: "120",
                                    prop: "vna",
                                    type: "number",
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
                    
                        if (list === '') {
                            list = `
                                <div class="mb-3">
                                    <table>
                            `;
                        }
                    
                        const listProccess = `
                                    <tr>
                                        <td>Validar respuestas de glosa</td>
                                        <td id="statusCircle" class="status-circle error">
                                        ✖
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        `;
                    
                        const listError = list + listProccess;
                    
                        const optionsDialog = {
                            html: `
                                ${listError}
                                <nata-ui-table></nata-ui-table>
                            `,
                            title: `
                                Artemisa - Asistente de radicación &nbsp;&nbsp;
                                <span class="badge text-bg-primary">
                                    ${idEstado} - ${aseLabel}
                                </span>&nbsp;&nbsp;
                                <span class="text-bg-danger pulse-red badge rounded-pill">            
                                    ${response.data.length} Errores
                                </span>
                                <button type="button" class="btn btn-sm btn-primary btn-siguiente-modal py-0 ${hasValidMessage ? '' : 'd-none'}">
                                    Siguiente
                                </button>
                            `,
                            events: {
                                render: function () { },
                                close: function () { 
                                    app.core.robot.close();
                                }
                            }
                        };
                    
                        new nataUIDialog(optionsDialog);
                    
                        document.querySelector(".btn-siguiente-modal").addEventListener("click", function () {
                            if (list === '') {
                                list = `
                                    <div class="mb-3">
                                        <table>
                                `;
                            }
                    
                            const listProccess = `
                                <tr>
                                    <td>Validar respuestas de glosa</td>
                                    <td id="statusCircle" class="status-circle error">
                                    ✖
                                    </td>
                                </tr>
                            `;
                    
                            list += listProccess;
                    
                            const elements = document.querySelectorAll(".ui-dialog");
                            for (let i = elements.length - 1; i < elements.length; i++) {
                                elements[i].remove();
                            }
                    
                            app.wizard.armado.validarSoportesRespuestaGlosa(idEstado, aseLabel, list, 1);
                        });
                    
                        const btnSiguiente = document.querySelector(".btn-siguiente-modal");
                        if (btnSiguiente) {
                            btnSiguiente.disabled = hasInvalidMessage;
                        }
                    }
                    else{
                        if(list === ''){
                            list = `
                                <div class="mb-3">
                                    <table>
                            `;
                        }

                        const listProccess = `
                            <tr>
                                    <td>Validar respuestas de glosa</td>
                                <td id="statusCircle" class="status-circle">
                                ✔
                                </td>
                            </tr>
                        `;

                        list+=listProccess;

                        if(opcion == 0){
                            swal("Éxito", "Todos las respuestas de glosa han sido generadas", "success");
                        }
                        else {
                            app.wizard.armado.validarSoportesRespuestaGlosa(idEstado, aseLabel, list, 1);
                        }
                    }
                })
                .catch(function(error){
                    console.error(error);
                })
        },
        validarSoportes: function (idEstado, aseLabel, label, list, opcion) {
            console.log("app.wizard.armado.validarSoportes");
            console.log(idEstado, aseLabel, opcion);

            if (list === undefined) {
                list = '';
            }

            if (opcion === undefined) {
                opcion = 0;
            }

            app.core.robot.message("Espera un momento, estamos validando los soportes de la factura");

            document.querySelector("#loader").style.display = "block";

            axios.get("https://cdn1.artemisaips.com/index.php?k=soporte&x=validarSoportesArmado_v1&y=" + app.config.client + "&z=" + idEstado + "&y=" + aseLabel + "&w=" + opcion + "&ts=" + new Date().getTime())
                .then(function(response){
                    console.log(response.data);

                    document.querySelector("#loader").style.display = "none";

                    // response.data.soportesNoEncontrados = '';

                    if(response.data.soportesNoEncontrados && response.data.soportesNoEncontrados.length > 0){
                        app.core.robot.message("Hay soportes que no se encuentran en la carpeta de la factura. Carga los soportes o renombralos según se indica");

                        const options = {
                            id: "tableSoportes",
                            columns: [
                                {
                                    title: "Mensaje",
                                    width: "350",
                                    prop: "m"
                                },
                                {
                                    title: "Número Factura",
                                    width: "130",
                                    prop: "nf"
                                },
                                {
                                    title: "Grupo",
                                    width: "200",
                                    prop: "g"
                                }
                            ],
                            data: response.data.soportesNoEncontrados
                        };

                        nata.sessionStorage.setItem("widget", options);

                        if(list === ''){
                            list = `
                                <div class="mb-3">
                                    <table>
                            `;
                        }

                        const listProccess = `
                                    <tr>
                                        <td>Validar soportes homologados contra la factura</td>
                                        <td id="statusCircle" class="status-circle error">
                                        ✖
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        `;

                        list+=listProccess;    

                        const optionsDialog = {
                            html: `
                                ${list}
                                <!--<button type="button" class="btn btn-primary btn-sm btn-avanzar-armado mb-3">Siguiente</button>-->
                                <nata-ui-table></nata-ui-table>
                            `,
                            title: `
                                Artemisa - Asistente de radicación &nbsp;&nbsp;
                                <span class="badge text-bg-primary">
                                    ${idEstado} - ${aseLabel}
                                </span>&nbsp;&nbsp;
                                <span class="text-bg-danger pulse-red badge rounded-pill">            
                                    ${response.data.soportesNoEncontrados.length} Errores
                                </span>
                                <button type="button" class="btn btn-sm btn-primary btn-siguiente-modal py-0">Siguiente</button>
                            `,
                            events: {
                                render: function () { },
                                close: function () { 
                                    app.core.robot.close();
                                }
                            }
                        }
                        
                        new nataUIDialog(optionsDialog);

                        document.querySelector(".btn-siguiente-modal").addEventListener("click", function(){
                            list = list.replace('</table>', '').replace('</div>', '');

                            const elements = document.querySelectorAll(".ui-dialog");
                            for (let i = elements.length - 1; i < elements.length; i++) {
                                elements[i].remove();
                            }

                            if(response.data.tipoPoliza && response.data.tipoPoliza.toUpperCase() == 'SOAT'){
                                app.wizard.armado.validarFurips(idEstado, aseLabel, label, list, 1);
                            }
                            else{
                                app.wizard.armado.validarSoportesMAOS(idEstado, aseLabel, label, list, 1);
                                // app.wizard.armado.generarArmado(idEstado, aseLabel, list, 1);
                            }
                        })
                    }
                    else {
                        if(list === ''){
                            list = `
                                <div class="mb-3">
                                    <table>
                            `;
                        }

                        const listProccess = `
                            <tr>
                                <td>Validar soportes homologados contra la factura</td>
                                <td id="statusCircle" class="status-circle">
                                ✔
                                </td>
                            </tr>
                        `;

                        list+=listProccess;

                        if(opcion == 0){
                            swal("Éxito", "Todos los soportes homologados fueron encontrados", "success");
                        }
                        else if (opcion == 1 || opcion == 2){
                            if(response.data.tipoPoliza && response.data.tipoPoliza.toUpperCase() == 'SOAT'){
                                app.wizard.armado.validarFurips(idEstado, aseLabel, label, list, 1);
                            }
                            else{
                                app.wizard.armado.validarSoportesMAOS(idEstado, aseLabel, label, list, 1);
                                // app.wizard.armado.generarArmado(idEstado, aseLabel, list, 1);
                            }                            
                        }
                    }
                })
                .catch(function(error){
                    console.error(error);
                });
        },
        validarSoportesMAOS: function (idEstado, aseLabel, label, list, opcion) {
            console.log("%c app.wizard.armado.validarSoportesMAOS ", "background:red;color:#fff;font-size:11px");
            console.log(idEstado, aseLabel, label);

            if (list === undefined) {
                list = '';
            }

            if (opcion === undefined) {
                opcion = 0;
            }

            app.core.robot.message("Espera un momento, estamos validando si hay procedimientos quirurgicos facturados");

            const data = {
                id: idEstado,
                a: aseLabel
            };

            axios.post("https://cdn1.artemisaips.com/index.php?x=soporte&y=validarSoportesMAOS&ts=" + (new Date).getTime(), data)
                .then(function(response){
                    console.log(response.data);
                    
                    if(response.data && response.data.length > 0) {
                        app.core.robot.message("Existen procedimientos quirurgicos facturados y no se encuentra el soporte. Valida si el soporte existe y es necesario renombrarlo, si definitivamente no existe envialo a cartera incobrable");

                        if(list === ''){
                            list = `
                                <div class="mb-3">
                                    <table>
                            `;
                        }

                        const listProccess = `
                                    <tr>
                                        <td>Validar servicios MAOS facturados</td>
                                        <td id="statusCircle" class="status-circle error">
                                        ✖
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        `;

                        list+=listProccess;

                        const options = {
                            id: "tableValidacionMAOS",
                            columns: [
                                {
                                    title: "Factura",
                                    width: "180",
                                    prop: "nf",
                                    class: "text-center"
                                },
                                {
                                    title: "Mensaje",
                                    width: "350",
                                    prop: "m",
                                    class: "text-center"
                                },
                                // {
                                //     title: "",
                                //     width: "200",
                                //     class: "text-end",
                                //     html: `
                                //         <button type="button" class="btn btn-sm btn-primary btn-enviar-incobrable"
                                //             data-id="[id]"
                                //             data-id-perfil="${session.user.ir}"
                                //             data-id-estado="${idEstado}"
                                //         >
                                //             Enviar incobrable
                                //         </button>
                                //     `
                                // }
                            ],
                            data: response.data
                        };

                        nata.sessionStorage.setItem("widget", options);

                        const optionsDialog = {
                            html: `
                                ${list}
                                <div class="alert alert-primary" role="alert" style="color: black;">
                                    <p>Existen procedimientos quirurgicos facturados y no se encuentra el soporte. Valida si el soporte existe y es necesario renombrarlo, si definitivamente no existe envialo a cartera incobrable</p>
                                </div>
                                <nata-ui-table></nata-ui-table>
                            `,
                            title: `Artemisa - Validación soporte MAOS
                                <span class="badge text-bg-primary">
                                    ${idEstado} - ${aseLabel}
                                </span>
                            `,
                            events: {
                                render: function () { },
                                close: function () { 
                                    app.core.robot.close();
                                }
                            }
                        };

                        new nataUIDialog(optionsDialog);
                    }
                    else{
                        if(list === ''){
                            list = `
                                <div class="mb-3">
                                    <table>
                            `;
                        }

                        const listProccess = `
                            <tr>
                                <td>Validar soportes homologados contra la factura</td>
                                <td id="statusCircle" class="status-circle">
                                ✔
                                </td>
                            </tr>
                        `;

                        list+=listProccess;

                        if(opcion == 0){
                            swal("Éxito", "Todos los soportes homologados fueron encontrados", "success");
                        }
                        else if (opcion == 1 || opcion == 2){
                            if(label.includes("glosa")){
                                app.wizard.armado.validarGlosa(idEstado, aseLabel, list, 2);
                            }else{
                                app.wizard.armado.generarArmado(idEstado, aseLabel, list, 1);
                            }   
                        }
                    }

                    // document.querySelector("#tableValidacionMAOS").addEventListener("click", function (event) {
                    //     event.preventDefault();
                    //     event.stopPropagation();

                    //     const element = event.target;
                        
                    //     if (element.classList.contains("btn-enviar-incobrable")) {
                    //         console.log("btn-enviar-incobrable.click");

                    //         const id = element.dataset.id;
                    //         const idPerfil = element.dataset.idPerfil;
                    //         const idEstado = element.dataset.idEstado;

                    //         console.log(id, idPerfil, idEstado);
                    //     }
                    // })
                })
                .catch(function(error){
                    console.error(error);
                })
        },
        validarSoportesRespuestaGlosa: function(idEstado, aseLabel, list, opcion){
            console.log("%c app.wizard.armado.validarSoportesRespuestaGlosa ", "background:red;color:#fff;font-size:11px");
            console.log(idEstado, aseLabel);

            if (list === undefined) {
                list = '';
            }

            if (opcion === undefined) {
                opcion = 0;
            }

            app.core.robot.message("Estamos validando los soportes de respuesta de glosa");
            document.querySelector("#loader").style.display = "block";

            axios.get("https://cdn1.artemisaips.com/index.php?k=robot&x=validarSoporteRespuestaGlosa&y=" + app.config.client + "&w=" + idEstado + "&z=" + aseLabel + "&ts=" + new Date().getTime())
                .then(function(response){
                    console.log(response);

                    document.querySelector("#loader").style.display = "none";

                    if(opcion == 0){
                        swal("Éxito", "Todos las respuestas de glosa han sido generadas", "success");
                    }
                    else {
                        app.wizard.armado.generarArmado(idEstado, aseLabel, list, 1);
                    }    
                })
                .catch(function(error){
                    console.error(error);
                });
        }
    },
    auditoria:{
        index: function (factura) {
            console.log("app.wizard.auditoria.index");

            console.log(factura);

            const data = {
                f: factura
            };

            axios.post(app.config.server.php1 + "x=armado&y=validarFacturaDetalle&ts=" + (new Date).getTime(), data)
                .then(function (response) {
                    console.log(response.data);

                    if (response.data && response.data.length > 0) {
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
                            data: response.data
                        };

                        nata.sessionStorage.setItem("widget", options);

                        const optionsDialog = {
                            height: 650,
                            width: 950,
                            html: `
                                <div class="alert alert-primary" role="alert" style="color: black;">
                                    <p>Los detalles de factura cumplen con la función de validar soportes según el ítem facturado, adicional de su papel en la creación de furips.</p>
                                </div>
                                <div class="d-flex justify-content-evenly align-items-center">
                                    <nata-ui-table></nata-ui-table>
                                    <nata-ui-upload
                                        data-title="Subir detalles de factura"
                                        data-subtitle="Solo archivos con extensión zip"
                                        data-accept=".zip"
                                        data-url="https://homi.artemisaips.com/server/php/index.php?x=upload&y=fileZipDataUpdate_v1"
                                        data-etl=""
                                        data-consola=1
                                    ></nata-ui-upload>
                                </div>
                                <div class="text-center">
                                    <button type="button" class="btn btn-primary btn-sm btn-avanzar">Siguiente</button>
                                </div>
                            `,
                            title: "Artemisa - Asistente de auditoria",
                            events: {
                                render: function () { },
                                close: function () { }
                            }
                        };
                        new nataUIDialog(optionsDialog);

                        document.querySelector(".btn-avanzar").addEventListener("click", function(){
                            console.log("btn-avanzar");

                            const elements = document.querySelectorAll(".ui-dialog");
                            console.log(elements);
                            let i;
                            for (i = elements.length - 1; i < elements.length; i++) {
                                elements[i].remove();
                            }

                            app.wizard.auditoria.respuestaAuditoria(factura, '', '', '');
                        });

                        return false;

                    } else if (response.data && response.data.length === 0) {
                        return axios.post(app.config.server.php1 + "x=armado&y=validarSumaItemsFactura&ts=" + (new Date).getTime(), data)
                            .then(function (response) {
                                console.log(response.data);

                                if (response.data && response.data.length > 0) {
                                    const options = {
                                        id: "tableSumaFacturaDetalle",
                                        columns: [
                                            {
                                                title: "Numero Factura",
                                                width: "120",
                                                prop: "nf",
                                                class: "text-center"
                                            },
                                            {
                                                title: "Valor factura",
                                                width: "150",
                                                prop: "vd",
                                                type: "number",
                                                class: "text-center",
                                                widget: {
                                                    w: "badge",
                                                    c: "text-bg-danger pulse-red"
                                                }
                                            },
                                            {
                                                title: "Suma Detalles",
                                                width: "150",
                                                prop: "sd",
                                                type: "number",
                                                class: "text-center",
                                                widget: {
                                                    w: "badge",
                                                    c: "text-bg-danger pulse-red"
                                                }
                                            }
                                        ],
                                        data: response.data
                                    };

                                    nata.sessionStorage.setItem("widget", options);

                                    const optionsDialog = {
                                        height: 650,
                                        width: 950,
                                        html: `
                                            <div class="alert alert-primary" role="alert" style="color: black;">
                                                <p>La validación de la suma de los detalle de factura tiene el fin de identificar que los detalles coincidan con la factura para crear el furips 2 correctamente.</p>
                                            </div>
                                            <nata-ui-table></nata-ui-table>
                                            <div class="text-center mt-3">
                                                <button type="button" class="btn btn-primary btn-sm btn-avanzar">Siguiente</button>
                                            </div>
                                        `,
                                        title: "Artemisa - Asistente de auditoria",
                                        events: {
                                            render: function () { },
                                            close: function () { }
                                        }
                                    };
                                    new nataUIDialog(optionsDialog);

                                    document.querySelector(".btn-avanzar").addEventListener("click", function(){
                                        console.log("btn-avanzar");

                                        const elements = document.querySelectorAll(".ui-dialog");
                                        console.log(elements);
                                        let i;
                                        for (i = elements.length - 1; i < elements.length; i++) {
                                            elements[i].remove();
                                        }
            
                                        app.wizard.auditoria.homologacionSoportes(factura);
                                    });

                                    return false;
                                }

                                app.wizard.auditoria.homologacionSoportes(factura);
                                return true;
                            })
                            .catch(function (error) {
                                console.error(error);
                                return false;
                            });
                    }

                    app.wizard.auditoria.homologacionSoportes(factura);
                })
                .catch(function (error) {
                    console.error(error);
                });
        },
        homologacionSoportes: function(factura){
            console.log("app.wizard.auditoria.homologacionSoportes");

            const data = {
                f : factura
            };

            document.querySelector("#loader").style.display = "block";
    
            axios.post(app.config.server.php1 + "x=armado&y=validarHomologacionItems&ts=" + (new Date).getTime(), data)
                .then(function(response){
                    console.log(response.data);

                    document.querySelector("#loader").style.display = "none";

                    if(response.data[0] && response.data[0].length > 0){
                        const options = {
                            id: "tableHomologacionItems",
                            columns: [
                                {
                                    title: "Código",
                                    width: "180",
                                    prop: "c",
                                    class: "text-center"
                                },
                                {
                                    title: "Descripción",
                                    width: "250",
                                    prop: "d",
                                    class: "text-center"
                                }
                            ],
                            data: response.data[0]
                        };

                        nata.sessionStorage.setItem("widget", options);

                        const optionsDialog = {
                            height: 650,
                            width: 950,
                            html: `
                                <div class="alert alert-primary" role="alert" style="color: black;">
                                    <p>La homologación de códigos se realiza para identificar los tipos de soportes que son necesarios para la cuenta.</p>
                                </div>                        
                                <button type="button" class="btn btn-outline-success btn-descargar-codigos my-3">Descargar Excel</button>
                                <div id="tableContainer">
                                    <nata-ui-table></nata-ui-table>
                                </div>
                                <div class="text-center mt-3">
                                    <button type="button" class="btn btn-primary btn-sm btn-avanzar">Siguiente</button>
                                </div>
                            `,
                            title: "Artemisa - Asistente de radicación",
                            events: {
                                render: function () { },
                                close: function () { }
                            }
                        };
                        new nataUIDialog(optionsDialog);

                        document.querySelector(".btn-descargar-codigos").addEventListener("click", function(){
                            console.log("btn-descargar-codigos.click");

                            const file = app.config.server.path + response.data[1][0].file;

                            window.open(file, "_blank");
                        });

                        document.querySelector(".btn-avanzar").addEventListener("click", function(){
                            console.log("btn-avanzar");

                            const elements = document.querySelectorAll(".ui-dialog");
                            console.log(elements);
                            let i;
                            for (i = elements.length - 1; i < elements.length; i++) {
                                elements[i].remove();
                            }

                            app.wizard.auditoria.validarSoportes(factura);
                        });

                        return false;
                    }

                    app.wizard.auditoria.validarSoportes(factura);
                })
                .catch(function(error){
                    console.error(error);
                });
        },
        respuestaAuditoria: function(factura, mensajes, codigos, descripciones) {
            console.log("app.wizard.auditoria.respuestaAuditoria");

            let contenidoTextarea;
        
            if (mensajes != ''){                
                const contenidoSoportes = mensajes.map((mensaje, index) => {
                    const partesMensaje = mensaje.includes("-") ? mensaje.split("-").map(part => part.trim()) : [mensaje];
                    
                    const mensajeFormateado = partesMensaje.join(" ");
                    return `- Falta soporte ${mensajeFormateado} el cual justifica el ítem ${codigos[index]}: ${descripciones[index]}`;
                });

                contenidoTextarea = contenidoSoportes.join("\n");

                console.log(contenidoTextarea);
            }
        
            let template = `
                <div class="d-flex justify-content-around">
                    <!-- Select para gestión -->
                    <div class="d-flex flex-column align-items-center">
                        <label for="selectGestion" class="form-label">Selecciona si la cuenta cumple para radicación</label>
                        <select class="form-select" id="selectGestion">
                            <option value="CUMPLE">CUMPLE</option>
                            <option value="NO CUMPLE">NO CUMPLE</option>
                        </select>
                    </div>

                    <!-- Select para póliza -->
                    <div class="d-flex flex-column align-items-center">
                        <label for="selectPoliza" class="form-label">Selecciona el tipo de póliza de la cuenta</label>
                        <select class="form-select" id="selectPoliza">
                            <option value="SOAT">SOAT</option>
                            <option value="NO SOAT">NO SOAT</option>
                        </select>
                    </div>
                </div>

                <!-- Textarea para respuesta -->
                <div class="form-floating text-center my-5">
                    <textarea class="form-control mb-3" id="respuestaAuditoria" style="resize: none; height: 300px;">${mensajes !== '' ? contenidoTextarea : ''}</textarea>
                    <label for="respuestaAuditoria">Respuesta de la auditoría</label>
                    <button type="button" class="btn btn-primary btn-respuesta">Responder Cuenta</button>
                </div>
            `;
        
            const optionsDialog = {
                height: 650,
                width: 1000,
                html: template,
                title: `
                    Artemisa - Asistente auditoria
                `,
                events: {
                    render: async function () { },
                    close: function () { }
                }
            }
        
            new nataUIDialog(optionsDialog);

            document.querySelector(".btn-respuesta").addEventListener("click", function(){
                console.log("btn-respuesta.click");

                const respuesta = document.querySelector("#respuestaAuditoria").value;
                const gestion = document.querySelector("#selectGestion").value;
                const poliza = document.querySelector("#selectPoliza").value;
                console.log(respuesta, gestion, poliza);

                const data = {
                    f: factura,
                    r: respuesta,
                    g: gestion,
                    p: poliza,
                    u: session.user.i
                };

                if(respuesta.trim() == ''){
                    swal("Error", "La respuesta está en blanco, valida e intenta nuevamente", "error");
                }else{
                    axios.post(app.config.server.php1 + "x=auditoria&y=guardarRespuesta&ts=" + (new Date).getTime(), data)
                    .then(function(response){
                        console.log(response.data);

                        if(response.data.length == 0){
                            swal("Éxito", "La respuesta de auditoria ha sigo registrada existosamente", "success");

                            const elements = document.querySelectorAll(".ui-dialog");
                            console.log(elements);
                            let i;
                            for (i = elements.length - 1; i < elements.length; i++) {
                                elements[i].remove();
                            }
                        }
                    })
                    .catch(function(error){
                        console.error(error);
                    })
                }
            });
        },
        validarSoportes: function (factura) {
            console.log("app.wizard.auditoria.validarSoportes");

            document.querySelector("#loader").style.display = "block";

            axios.get("https://cdn1.artemisaips.com/index.php?k=soporte&x=validarSoportesFactura&y=" + app.config.client + "&z=" + factura + "&ts=" + new Date().getTime())
                .then(function(response){
                    console.log(response.data);

                    document.querySelector("#loader").style.display = "none";

                    if(response.data && response.data.length > 0){
                        const options = {
                            id: "tableSoportes",
                            columns: [
                                {
                                    title: "Mensaje",
                                    width: "250",
                                    prop: "m"
                                },
                                {
                                    title: "Número Factura",
                                    width: "130",
                                    prop: "nf"
                                },
                                {
                                    title: "Tipo Glosa",
                                    width: "120",
                                    prop: "tg"
                                },
                                {
                                    title: "Código",
                                    width: "130",
                                    prop: "c"
                                },
                                {
                                    title: "Descripción",
                                    width: "250",
                                    prop: "d"
                                }
                            ],
                            data: response.data
                        };
                        
                        nata.sessionStorage.setItem("widget", options);
                        
                        const optionsDialog = {
                            height: 650,
                            width: 1000,
                            html: `
                                <div class="alert alert-primary" role="alert" style="color: black;">
                                    <p>Estos soportes son necesario para argumentar la facturación de los ítems indicados.</p>
                                </div>
                                <nata-ui-table></nata-ui-table>
                                <div class="text-center mt-3">
                                    <button type="button" class="btn btn-primary btn-sm btn-avanzar">Siguiente</button>
                                </div>
                            `,
                            title: `
                                Artemisa - Asistente auditoría &nbsp;&nbsp;
                                <span class="text-bg-danger pulse-red badge rounded-pill">            
                                    ${response.data.length}
                                </span>
                            `,
                            events: {
                                render: function () { },
                                close: function () { }
                            }
                        };
                        
                        new nataUIDialog(optionsDialog);
                        
                        document.querySelector(".btn-avanzar").addEventListener("click", function(){
                            console.log("btn-avanzar");
                        
                            const mensajesConDetalles = response.data.map(item => {
                                const mensajes = item.m.split(" ")
                                    .filter(word => word === word.toUpperCase() && word.trim() !== "")
                                    .map(word => word.trim());
                        
                                return mensajes.map(mensaje => ({
                                    mensaje,
                                    codigo: item.c,
                                    descripcion: item.d
                                }));
                            }).flat();
                        
                            console.log(mensajesConDetalles);
                        
                            const mensajes = mensajesConDetalles.map(item => item.mensaje);
                            const codigos = mensajesConDetalles.map(item => item.codigo);
                            const descripciones = mensajesConDetalles.map(item => item.descripcion);

                            const elements = document.querySelectorAll(".ui-dialog");
                            console.log(elements);
                            let i;
                            for (i = elements.length - 1; i < elements.length; i++) {
                                elements[i].remove();
                            }
                        
                            app.wizard.auditoria.respuestaAuditoria(factura, mensajes, codigos, descripciones);
                        });
                        
                    }
                    else {
                        app.wizard.auditoria.respuestaAuditoria(factura, '', '', '');
                    }
                })
                .catch(function(error){
                    console.error(error);
                });
        }
    },
    documentacion: {
        notasRapidas: function (operacion, idAseguradora){
            console.log("app.wizard.documentacion.notasRapidas");

            axios.get(app.config.server.php1 + "x=asegurador&y=obtenerAsegurador&z=" + idAseguradora + "&ts=" + (new Date).getTime())
                .then(function(response){
                    console.log(operacion + "-" + response.data);

                    app.documentacion.wizard.render(operacion + "-" + response.data, 'Documentación de operaciones aseguradoras');
                })
                .catch(function(error){
                    console.error(error);
                });
        },
        operacionesAseguradoras: function (operacion, idAseguradora){
            console.log("app.wizard.documentacion.operacionesAseguradoras");

            axios.get(app.config.server.php1 + "x=asegurador&y=obtenerAsegurador&z=" + idAseguradora + "&ts=" + (new Date).getTime())
                .then(function(response){
                    console.log(operacion + "-" + response.data);

                    app.documentacion.wizard.render(operacion + "-" + response.data, 'Documentación de operaciones aseguradoras');
                })
                .catch(function(error){
                    console.error(error);
                });
        }
    },
    informes: {
        glosa: function () {
            console.log("app.wizard.informes.glosa");

            document.querySelector("#loader").style.display = "block";

            app.core.robot.message("Espera un momento, estoy validando si hay facturas sin fecha de notificación");

            axios.get(app.config.server.php1 + "x=informe&y=validarFechaGlosa&ts=" + new Date().getTime())
                .then(function(response) {
                    console.log(response.data);
                    
                    document.querySelector("#loader").style.display = "none";

                    app.core.robot.message("Hay facturas sin fecha de notificación de glosa o devolución");

                    if(response.data.length > 0){
                        let template = `
                            <style>
                                #tableValidacionFechaGlosa {
                                    table-layout: fixed;
                                    width: 950px;
                                    font-size: 14px;
                                }
                            </style>

                            <table id="tableValidacionFechaGlosa" class="table table-striped table-sm">
                                <colgroup>
                                    <col width="120">
                                    <col width="180">
                                    <col width="500">
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th class="text-center">Número Factura</th>
                                        <th class="text-center">Fecha Notificacion</th>
                                        <th class="text-center">Observacion</th>
                                    </tr>
                                </thead>

                                {{~ it.detail:d:id }}
                                <tr>
                                    <td>{{=d.nf}}</td>
                                    <td data-id="{{=d.nf}}">
                                        <div class="input-group input-group-sm mb-3">
                                            <input data-id="{{=d.nf}}" class="fechaGlosaTxt form-control" type="text" placeholder="Seleccionar fecha">
                                        </div>
                                    </td>
                                    <td>{{=d.o}}</td>
                                </tr>
                                {{~}}        
                            </table>
                            <button type="button" class="btn btn-primary btn-siguiente mt-5">Siguiente</button>
                        `;

                        const html = doT.template(template)({ detail: response.data });

                        const optionsDialog = {
                            html: html,
                            title: `Artemisa - Informe de Glosas &nbsp;&nbsp;`,
                            events: {
                                render: function () {
                                    document.querySelectorAll(".fechaGlosaTxt").forEach(input => {
                                        flatpickr(input, {
                                            dateFormat: "Y-m-d",
                                            allowInput: true
                                        });
                                    });
                                },
                                close: function () { 
                                    app.core.robot.close();
                                }
                            }
                        }

                        new nataUIDialog(optionsDialog);


                        document.querySelector(".btn-siguiente").addEventListener("click", function() {
                            const valores = [];

                            document.querySelectorAll(".fechaGlosaTxt").forEach(input => {
                                if (input.value.trim() !== "") {
                                    valores.push({ id: input.dataset.id, fecha: input.value.trim() });
                                }
                            });

                            if(valores.length > 0){
                                axios.post(app.config.server.php1 + "x=informe&y=actualizarFechaGlosa&ts=" + new Date().getTime(), valores)
                                    .then(function(response) {
                                        console.log(response.data);

                                        app.wizard.informes.validarFechaRadicacion();
                                    })
                                    .catch(function(error){
                                        console.error(error);
                                    });
                            }
                            else{
                                app.wizard.informes.validarFechaRadicacion();
                            }
                        });
                    }
                })
                .catch(function(error){
                    console.error(error);
                })
        },
        validarFechaRadicacion: function () {
            console.log("app.wizard.informes.validarFechaRadicacion");

            document.querySelector("#loader").style.display = "block";

            app.core.robot.message("Espera un momento, estoy validando si hay facturas sin fecha de radicación");

            axios.get(app.config.server.php1 + "x=informe&y=validarFechaRadicacion&ts=" + new Date().getTime())
                .then(function(response) {
                    console.log(response.data);
                    
                    document.querySelector("#loader").style.display = "none";

                    app.core.robot.message("Hay facturas sin fecha de radicación");

                    if(response.data.length > 0){
                        let template = `
                            <style>
                                #tableValidacionFechaRadicacion {
                                    table-layout: fixed;
                                    width: 950px;
                                    font-size: 14px;
                                }
                            </style>

                            <table id="tableValidacionFechaRadicacion" class="table table-striped table-sm">
                                <colgroup>
                                    <col width="120">
                                    <col width="180">
                                    <col width="500">
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th class="text-center">Número Factura</th>
                                        <th class="text-center">Fecha Radicación</th>
                                        <th class="text-center">Observación</th>
                                    </tr>
                                </thead>

                                {{~ it.detail:d:id }}
                                <tr>
                                    <td>{{=d.nf}}</td>
                                    <td data-id="{{=d.nf}}">
                                        <div class="input-group input-group-sm mb-3">
                                            <input data-id="{{=d.nf}}" class="fechaGlosaTxt" type="date" class="form-control">
                                        </div>
                                    </td>
                                    <td>{{=d.o}}</td>
                                </tr>
                                {{~}}        
                            </table>
                            <button type="button" class="btn btn-primary btn-siguiente mt-5">Siguiente</button>
                        `;

                        const html = doT.template(template)({detail: response.data});

                        const optionsDialog = {
                            html: html,
                            title: `
                                Artemisa - Informe de Glosas &nbsp;&nbsp;
                            `,
                            events: {
                                render: function () { },
                                close: function () { 
                                    app.core.robot.close();
                                }
                            }
                        }
                    
                        new nataUIDialog(optionsDialog);

                        document.querySelector(".btn-siguiente").addEventListener("click", function() {
                            const valores = [];

                            document.querySelectorAll(".fechaGlosaTxt").forEach(input => {
                                if (input.value.trim() !== "") {
                                    valores.push({ id: input.dataset.id, fecha: input.value.trim() });
                                }
                            });

                            app.wizard.informes
                        });
                    }
                })
                .catch(function(error){
                    console.error(error);
                })
        }
    },
    radicar: {
        respuestaGlosa_v1: function () {
            console.log("app.wizard.radicar.respuestaGlosa_v1");
        
            const idEstado = nata.sessionStorage.getItem("session-id-estado");
            const aseguradorLabel = nata.sessionStorage.getItem("session-asegurador");
        
            const optionsDialog = {
                height: 650,
                width: 950,
                html: `
                    <div class="container" style="max-height: 100%; display: flex; flex-direction: column; overflow: hidden;">
                        <div id="mensajeError" class="alert alert-danger" style="display: none;"></div>
                        <div id="mensajeExito" class="alert alert-success" style="display: none;"></div>
                        <div id="iconSave" style="display: none;">
                            <button id="guardar-homologacion" type="button" class="btn btn-sm btn-outline-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                </svg>
                                &nbsp;Guardar
                            </button>
                        </div>
                        <div class="w-100 d-flex justify-content-around" id="divXML" style="overflow: hidden;">
                            <div id="tableContainer"></div>
                            <div id="cargaFacturas" style="overflow-y: auto;">
                                <div id="uploadFactura"></div>
                            </div>
                        </div>
                    </div>
                `,
                title: "Artemisa - Asistente Radicación Respuesta Glosa",
                events: {
                    render: function () { },
                    close: function () { }
                }
            };
            new nataUIDialog(optionsDialog);
        
            function mostrarMensajeError(mensaje) {
                const contenedorError = document.getElementById("mensajeError");
                contenedorError.innerText = mensaje;
                contenedorError.style.display = "block";
                document.getElementById("mensajeExito").style.display = "none";
            }
        
            function renderTable(data, step) {
                if (data && data.length > 0) {
                    const columns = Object.keys(data[0])
                        .filter(key => key !== "id")
                        .map(key => {
                            const maxTextLength = data.reduce((max, row) => {
                                const cellText = String(row[key] || "");
                                return Math.max(max, cellText.length);
                            }, key.length);
                            
                            const estimatedWidth = Math.min(250, Math.max(100, maxTextLength * 8));
                            
                            return {
                                title: key.charAt(0).toUpperCase() + key.slice(1),
                                prop: key,
                                width: `${estimatedWidth}`,
                                class: "text-break"
                            };
                        });
            
                    const options = {
                        id: "tableWizard",
                        columns: columns,
                        data: data
                    };
            
                    nata.sessionStorage.setItem("widget", options);
            
                    document.getElementById("tableContainer").innerHTML = '<nata-ui-table class="scroll-y scroll-x"></nata-ui-table>';
            
                    habilitarStep(step);
                }
            }
            

            function habilitarStep(step) {
                if (step === 'Step 1') {
                    const cargaFacturas = document.querySelector("#uploadFactura");
                    cargaFacturas.innerHTML = `
                        <nata-ui-upload
                            data-title="Subir detalles de factura"
                            data-subtitle="Solo archivos con extensión zip"
                            data-accept=".zip"
                            data-url="https://homi.artemisaips.com/server/php/index.php?x=upload&y=fileZipDataUpdate"
                            data-etl=""
                            data-consola=1
                        ></nata-ui-upload>
                    `;
                } else if (step === 'Step 2') {
                    document.getElementById("iconSave").style.display = "block";
                    const template = `
                        <button data-id="[id]" type="button" class="btn btn-primary btn-sm btn-homologar">
                            Homologar
                        </button>
                    `;

                    const templateSelect = `
                        <select class="form-control select-glosa" data-id="[id]">
                            <option value="">Selecciona una opción</option>
                            <option value="total">Total</option>
                            <option value="parcial">Parcial</option>
                        </select>
                    `;
                    
                    const options = nata.sessionStorage.getItem("widget");
                
                    if (options) {
                        options.data.forEach(row => {
                            row.selectedSoportes = row.selectedSoportes || [];
                            row.selectedSoportesDisplay = row.selectedSoportesDisplay || "";
                        });
                
                        options.columns.push(
                            { title: "Soporte Homologado", prop: "selectedSoportesDisplay", width: "250", class: "text-break" },
                            { title: "Soporte", html: template, width: "120", class: "text-break text-center" },
                            { title: "Tipo Glosa", html: templateSelect, width: "120", class: "text-break text-center" }
                        );
                
                        const saveOptions = () => nata.sessionStorage.setItem("widget", options);
                
                        const renderTable = () => {
                            document.getElementById("tableContainer").innerHTML = '<nata-ui-table class="scroll-y scroll-x"></nata-ui-table>';
                            assignButtonEvents();
                        };
                
                        const createHomologarModal = (recordId, soportes) => {
                            const modalTemplate = `
                                <ul class="list-group mt-n3">
                                    <div class="input-group input-group-sm mb-3">
                                        <input id="txtSearch" type="text" class="form-control w-1000 input-search" placeholder="Buscar ..." autocomplete="off">
                                    </div>
                                    {{~ it: soporte}}
                                    <li class="list-group-item">
                                        <div class="form-check">
                                            <input class="form-check-input chk-soporte" type="checkbox" 
                                                value="{{=soporte.ps}}" data-id="${recordId}" id="chk-{{=soporte.ps}}">
                                            <label class="homologacion-soportes form-check-label" for="chk-{{=soporte.ps}}">
                                                {{=soporte.ps}}
                                            </label>
                                        </div>
                                    </li>
                                    {{~}}
                                </ul>
                            `;
                            
                            const modalHtml = doT.template(modalTemplate)(soportes);
                            
                            new nataUIDialog({
                                html: modalHtml,
                                height: 400,
                                width: 500,
                                title: `Homologación Soportes`,
                                events: {
                                    render: () => {
                                        const rowData = options.data.find(row => row.id === recordId);
                                        if (rowData) {
                                            rowData.selectedSoportes.forEach(ps => {
                                                const checkbox = document.querySelector(`#chk-${ps}`);
                                                if (checkbox) checkbox.checked = true;
                                            });
                                        }
                                    }
                                }
                            });
                
                            setupSearch();
                            setupCheckboxEvents(recordId);
                        };
                
                        const setupSearch = () => {
                            document.getElementById('txtSearch').addEventListener('input', function () {
                                const searchTerm = this.value.toLowerCase();
                                document.querySelectorAll('.homologacion-soportes').forEach(item => {
                                    const label = item.textContent.toLowerCase();
                                    item.closest('li').style.display = label.includes(searchTerm) ? '' : 'none';
                                });
                            });
                        };
                
                        const setupCheckboxEvents = (recordId) => {
                            document.querySelectorAll('.chk-soporte').forEach(checkbox => {
                                checkbox.addEventListener('change', function () {
                                    const isChecked = this.checked;
                                    const value = this.value;
                
                                    const rowData = options.data.find(row => row.id === recordId);
                                    if (rowData) {
                                        if (isChecked) {
                                            if (!rowData.selectedSoportes.includes(value)) rowData.selectedSoportes.push(value);
                                        } else {
                                            rowData.selectedSoportes = rowData.selectedSoportes.filter(ps => ps !== value);
                                        }
                
                                        rowData.selectedSoportesDisplay = rowData.selectedSoportes.join(", ");
                                        saveOptions();
                                        renderTable();
                                    }
                                });
                            });
                        };

                        const setupSelectEvents = () => {
                            document.querySelectorAll('.select-glosa').forEach(select => {
                                select.addEventListener('change', function () {
                                    const selectedValue = this.value;
                                    const recordId = this.getAttribute('data-id');  // Get the row ID from the select element
                                    
                                    // Find the specific row using the recordId
                                    const rowData = options.data.find(row => row.id === recordId);
                                    console.log(recordId);
                                    if (rowData) {
                                        // Only update the selectedGlosa value for the specific row
                                        rowData.selectedGlosa = selectedValue;
                                        
                                        // Save the updated options to sessionStorage (or wherever you're saving)
                                        saveOptions();
                                        
                                        // Re-render the table to reflect the updated data for this row
                                        renderTable();
                                    }
                                });
                            });
                        };
                        
                        
                
                        const assignButtonEvents = () => {
                            document.querySelectorAll('.btn-homologar').forEach(button => {
                                button.addEventListener('click', function () {
                                    const recordId = this.getAttribute("data-id");
                                    const soportes = nata.localStorage.getItem("documentacion-soportes-descargar").filter(record => record.ps !== '');
                                    createHomologarModal(recordId, soportes);
                                });
                            });
                        };
                
                        document.getElementById('guardar-homologacion').addEventListener('click', () => {
                            const allSelectedSoportes = [];
                
                            options.data.forEach(row => {
                                if (row.selectedSoportes && row.selectedSoportes.length > 0) {
                                    const selectGlosa = document.querySelector(`[data-id="${row.id}"]`);
                                    const glosaValue = selectGlosa ? selectGlosa.value : null;
                
                                    if (glosaValue === "" || glosaValue === null) {
                                        swal("Error", "Faltan añadir el tipo de glosa para algun soporte homologado, validar", "error");
                                        return;
                                    } else {
                                        allSelectedSoportes.push({
                                            id: row.id,
                                            selectedSoportes: row.selectedSoportes,
                                            tipoGlosa: glosaValue
                                        });
                                    }
                                }
                            });
                
                            console.log(allSelectedSoportes);
                
                            axios.post(app.config.server.php1 + "x=cartera&y=guardarSoporteHomologado&ts=" + new Date().getTime(), allSelectedSoportes)
                                .then(function(response) {
                                    console.log(response.data);
                                })
                                .catch(function(error) {
                                    console.error(error);
                                });
                        });
                
                        saveOptions();
                        renderTable();
                    }
                }                
            }
        
            document.getElementById("loader").style.display = "block";
        
            axios.get("https://cdn1.artemisaips.com/index.php?k=robot&x=armarCuenta&y=" + app.config.client + "&z=" + idEstado + "&w=" + aseguradorLabel + "&ts=" + new Date().getTime())
                .then(function (response) {
                    console.log(response.data);
        
                    document.getElementById("loader").style.display = "none";
        
                    if (response.data) {
                        const data = response.data;
        
                        const errors = data.filter(entry => entry.e);
                        const others = data.filter(entry => !entry.e && !entry.s);

                        console.log(others);
        
                        if (errors.length > 0) {
                            mostrarMensajeError(errors.map(error => error.e).join(", "));
                        }

                        const step = data.find(entry => entry.s);

                        renderTable(others, step.s);
                    }
                })
                .catch(function (error) {
                    console.error(error);
                    mostrarMensajeError("Error al obtener datos del servidor.");
                });
        }
    }
}

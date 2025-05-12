/* globals app, nataUIDialog, wizardEngine, axios, doT, session */

app.wizard_V1 = {
    armado: {
        index: function(idEstado){
            console.log("app.wizard_V1.armado.index");
            console.log(idEstado);

            axios.get(app.config.server.php1 + "x=armado&y=validarAseguradores&z=" + idEstado + "&ts=" + (new Date).getTime())
                .then(function(response){
                    console.log(response.data);
                })
                .catch(function(error){
                    console.error(error);
                })
        }
    },
    glosa: {
        contestar: {
            // sin glosa, no se ha cargado o viene en pdf
            sin: function () {
                console.log("app.wizard_V1.glosa.contestar.sin");
                document.querySelector("#loader").style.display = "block";
                axios.get(app.config.server.php1 + "x=glosa&y=responder")
                    .then(function (response) {
                        const data = response.data.sg;
                        //const data = response.data.r;
                        console.log(data);

                        const template = `
                            <style>
                                #tableGlosaSinGlosa {
                                    table-layout: fixed;
                                    width: 480px;
                                }
                            </style>
                            <table id="tableGlosaSinGlosa" class="table nata-ui-table table-sm font-size-13px">
                                <colgroup>
                                    <col width="300">
                                    <col width="80">
                                    <col width="100">                                    
                                </colgroup>
                                <tbody>
                                {{let idEstado = "";}}
                                {{~it.detail: d:id}}
                                    {{?idEstado != d.i}}
                                    <tr>
                                        <td class="py-3" colspan="3"><h6>{{=d.i}} - {{=d.n}}</h6></td>
                                    </tr>
                                    {{?}}
                                    <tr>
                                        <td>
                                            {{=d.a}}
                                        </td>
                                        <td>{{=d.f}}</td>
                                        <td class="text-end">{{=numberDecimal.format(d.s)}}</td>
                                    </tr>
                                    {{idEstado = d.i;}}
                                {{~}}
                            </table>
                        `;
                        const html = doT.template(template)({ detail: data });

                        new nataUIDialog({
                            title: `Artemisa: Responder Glosa&nbsp;&nbsp;
                                    <button type="button" class="btn btn-sm btn-primary btn-siguiente-modal">Siguiente</button> 
                                `,
                            html: html,
                        });
                        document.querySelector("#loader").style.display = "none";

                        document.querySelector(".btn-siguiente-modal").addEventListener("click", function(){
                            console.log("btn-siguiente.click");

                            app.core.dialog.removeAll();
                            app.core.robot.close();
                            app.wizard_V1.glosa.contestar.con();
                        });
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            },
            // con glosa cargada
            con: function () {
                console.log("app.wizard_V1.glosa.contestar.con");
                document.querySelector("#loader").style.display = "block";
                axios.get(app.config.server.php1 + "x=glosa&y=responder")
                    .then(function (response) {
                        //const data = response.data.sg;
                        const data = response.data.r;
                        console.log(data);

                        const countMap = {};

                        data.forEach(d => {
                            countMap[d.f] = (countMap[d.f] || 0) + 1;
                        });

                        const updatedData = data.map(d => ({
                            ...d,
                            cf: countMap[d.f]
                        }));

                        const template = `
                            <style>
                                #tableGlosaResponder {
                                    table-layout: fixed;
                                    width: 880px;
                                }
                                .search-container {
                                    display: flex;
                                    align-items: center;
                                }
                                .search-container input,
                                .search-container select {
                                    height: 36px;
                                }
                            </style>
                            <div class="search-container">
                                <input id="txtSearch" type="text" class="form-control form-control-sm max-width-680 input-search" placeholder="Buscar ..." autocomplete="off">
                                <select id="filterGlosa" class="form-select form-select-sm max-width-200">
                                    <option value="" selected>Mostrar Todos</option>
                                    <option value="no_glosa">Sin Tipo Glosa</option>
                                    <option value="1">Administrativa</option>
                                    <option value="2">Liquidación</option>
                                    <option value="3">Pertinencia</option>
                                </select>
                            </div>
                            <table id="tableGlosaResponder" class="table nata-ui-table table-sm font-size-12px">
                                <colgroup>
                                    <col width="80">
                                    <col width="80">
                                    <col width="30">
                                    <col width="100">
                                    <col width="100">
                                    <col width="350">
                                </colgroup>
                                <tbody>
                                {{let idEstado = "", asegurador = "";}}
                                {{~it.detail: d:id}}
                                <tbody class="registro" data-glosa="{{=d.tg}}">
                                {{?idEstado != d.i || asegurador != d.ta}}
                                    <tr>
                                        <td colspan="6">
                                            <table class="table nata-ui-table table-sm table-borderless font-size-12px">
                                                <colgroup>
                                                    <col width="100%">
                                                </colgroup>
                                                <tr>
                                                    <td><b>{{=d.i}} - {{=d.n}} - {{=d.ta}}</b></td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                {{?}}
                                    <tr>
                                        <td class=""><span class="badge badge-sm rounded-pill text-bg-primary">{{=d.id}}</span></td>
                                        <td class=""><span class="badge badge-sm rounded-pill text-bg-primary">{{=d.f}}</span></td>
                                        <td class=""><span class="badge badge-sm rounded-pill text-bg-primary">{{=d.cf}}</span></td>
                                        <td class="text-end"><span class="badge badge-sm rounded-pill text-bg-danger">{{=numberDecimal.format(d.s)}}</span></td>
                                        <td class="text-end"><span class="badge badge-sm rounded-pill text-bg-danger">{{=numberDecimal.format(d.v)}}</span></td>    
                                        <td>
                                            <select data-id="{{=d.id}}" class="form-select form-select-sm optionTipoGlosa w-100">
                                                <option value="" {{? d.tg == ''}}selected{{?}}>Selecciona el tipo de glosa</option>
                                                <option value="1" {{? d.tg == 1}}selected{{?}}>Administrativa</option>
                                                <option value="2" {{? d.tg == 2}}selected{{?}}>Liquidación</option>
                                                <option value="3" {{? d.tg == 3}}selected{{?}}>Pertinencia</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr class="bg-smoke">
                                        <td colspan="6">
                                            <table class="table nata-ui-table table-sm table-borderless font-size-12px w-100">
                                                <colgroup>
                                                    <col width="180">
                                                    <col width="350">
                                                    <col width="350">
                                                </colgroup>
                                                <tr>
                                                    <td class="">{{=d.eg}}</td>                                  
                                                    <td class="">{{=d.dg}}</td>                                  
                                                    <td class="">{{=d.da}}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                                {{idEstado = d.i, asegurador = d.ta;}}
                                {{~}}
                            </table>
                        `;
                        
                        const html = doT.template(template)({ detail: updatedData });
                        
                        new nataUIDialog({
                            title: `Artemisa: Responder Glosa&nbsp;&nbsp;
                                <span class="badge badge-sm rounded-pill text-bg-danger">${data.length}</span>&nbsp;&nbsp;
                                <button type="button" class="btn btn-sm btn-primary btn-siguiente-modal" style="display: none;">Siguiente</button> 
                            `,
                            html: html,
                        });

                        const options = document.querySelectorAll(".optionTipoGlosa");

                        const selectedOptions = Array.from(options)
                            .filter((select) => select.value)
                            .map((select) => ({
                                id: select.dataset.id,
                                tg: select.value,
                            }));

                        if (selectedOptions.length == data.length) {
                            document.querySelector(".btn-siguiente-modal").style.display = "inline-block";
                        }
                        
                        document.querySelector("#loader").style.display = "none";
                        
                        function filtrarRegistros() {
                            let searchText = document.getElementById("txtSearch").value.toLowerCase();
                            let selectedValue = document.getElementById("filterGlosa").value;
                        
                            document.querySelectorAll("#tableGlosaResponder tbody.registro").forEach(registro => {
                                let contenido = registro.dataset.search || "";
                                let tipoGlosa = registro.getAttribute("data-glosa") || "";
                        
                                let coincideBusqueda = searchText === "" || contenido.includes(searchText);
                                let coincideFiltro = 
                                    selectedValue === "" ||
                                    (selectedValue === "no_glosa" && tipoGlosa === "") ||
                                    tipoGlosa === selectedValue;
                        
                                registro.style.display = coincideFiltro && coincideBusqueda ? "" : "none";
                            });
                        
                            // Update total rows count
                            const totalRows = document.querySelectorAll("#tableGlosaResponder tbody.registro").length;
                            const visibleRows = Array.from(document.querySelectorAll("#tableGlosaResponder tbody.registro")).filter(row => row.style.display !== 'none').length;
                            document.getElementById("totalRows").textContent = `Total Filas: ${visibleRows} / ${totalRows}`;
                        }
                        
                        document.getElementById("txtSearch").addEventListener("input", filtrarRegistros);
                        document.getElementById("filterGlosa").addEventListener("change", filtrarRegistros);
                        
                        setTimeout(() => {
                            document.querySelectorAll("#tableGlosaResponder tbody.registro").forEach(registro => {
                                registro.dataset.search = registro.innerText.toLowerCase().replace(/\s+/g, " ");
                            });
                        }, 100);

                        document.querySelector("#tableGlosaResponder").addEventListener("change", function (event) {
                            event.preventDefault();
                            event.stopPropagation();

                            const element = event.target;
                            if (element.classList.contains("optionTipoGlosa")) {
                                console.log("optionTipoGlosa.change");

                                const registro = element.closest("tbody.registro");

                                registro.setAttribute("data-glosa", element.value);

                                const options = document.querySelectorAll(".optionTipoGlosa");

                                const selectedOptions = Array.from(options)
                                    .filter((select) => select.value)
                                    .map((select) => ({
                                        id: select.dataset.id,
                                        tg: select.value,
                                    }));

                                if (selectedOptions.length == data.length) {
                                    document.querySelector(".btn-siguiente-modal").style.display = "inline-block";
                                } else {
                                    document.querySelector(".btn-siguiente-modal").style.display = "none";
                                }

                                axios.post(app.config.server.php1 + "x=glosa&y=setTipoGlosa&ts=" + new Date().getTime(), selectedOptions)
                                    .then(function (response) {
                                        // console.log(response.data);
                                        filtrarRegistros();
                                    })
                                    .catch(function (error) {
                                        console.error(error);
                                    });
                            }
                        });

                        document.querySelector(".btn-siguiente-modal").addEventListener("click", function(){
                            console.log("btn-siguiente.click");

                            app.core.dialog.removeAll();
                            app.core.robot.close();
                            app.wizard_V1.glosa.contestar.resumen();
                        });

                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            },

            responderTipoGlosa: function () {
                console.log("app.wizard_V1.glosa.contestar.responderTipoGlosa");
            
                const usuario = session.user.ir;
            
                axios.get(app.config.server.php1 + "x=glosa&y=responderTipoGlosa&z=" + usuario)
                    .then(function (response) {
                        console.log(response.data.rtg);
            
                        const template = `
                            <style>
                                #tableGlosaResponderPorTipo {
                                    table-layout: fixed;
                                    width: 1000px;
                                }
                                .search-container {
                                    display: flex;
                                    align-items: center;
                                }
                                .search-container select {
                                    height: 36px;
                                    width: 200px;
                                }
                                .form-control.respuesta-glosa {
                                    resize: none;
                                    font-size: 12px;
                                    padding: 5px 8px !important;
                                }
                            </style>

                            <div class="search-container mb-3">
                                <select id="filterRespuesta" class="form-control form-control-sm">
                                    <option value="">Ver todos</option>
                                    <option value="empty">Sin respuesta</option>
                                    <option value="filled">Con respuesta</option>
                                </select>
                            </div>

                            <table id="tableGlosaResponderPorTipo" class="table nata-ui-table table-sm font-size-12px">
                                <colgroup>
                                    <col width="250">
                                    <col width="250">
                                    <col width="250">
                                    <col width="250">
                                </colgroup>
                                <tbody>
                                    {{let factura = "";}}
                                    {{~it.detail : d:id}}
                                    {{?factura != d.f}}      
                                    <tr class="factura-{{=d.f}} {{?id % 2 == 0}}bg-zebra{{?}}">
                                        <td colspan="4">
                                            <span class="badge badge-sm rounded-pill text-bg-primary">
                                                {{=d.id}} - {{=d.f}} ({{=d.ta}})
                                            </span>
                                        </td>
                                    </tr>
                                    {{?}}
                                    <tr class="factura-{{=d.f}} {{?id % 2 == 0}}bg-zebra{{?}}">
                                        <td colspan="4">
                                            <label class="mb-1" style="font-weight: bold;">Descripción Elemento</label>
                                            <p>{{=d.eg}}</p>
                                        </td>
                                    </tr>
                                    <tr class="factura-{{=d.f}} {{?id % 2 == 0}}bg-zebra{{?}}">
                                        <td colspan="4">
                                            <label class="mb-1" style="font-weight: bold;">Descripción Glosa</label>
                                            <p>{{=d.dg}}</p>
                                        </td>
                                    </tr>
                                    <tr class="factura-{{=d.f}} {{?id % 2 == 0}}bg-zebra{{?}}">
                                        <td colspan="4">
                                            <label class="mb-1" style="font-weight: bold;">Descripción Anotación</label>
                                            <p>{{=d.da}}</p>
                                        </td>
                                    </tr>

                                    <tr class="factura-{{=d.f}} {{?id % 2 == 0}}bg-zebra{{?}}">
                                        <td>
                                            <label class="mb-1"><b>Valor Glosado</b></label><br>
                                            <span class="badge badge-sm rounded-pill text-bg-danger">{{=numberDecimal.format(d.v)}}</span>
                                        </td>
                                        <td>
                                            <label class="mb-1"><b>Glosa Aceptada</b></label>
                                            <input type="number" class="form-control form-control-sm glosa-aceptada" 
                                                data-id="{{=d.id}}" placeholder="Glosa Aceptada" min="0">
                                        </td>
                                        <td>
                                            <label class="mb-1"><b>Glosa No Aceptada</b></label>
                                            <input type="number" class="form-control form-control-sm glosa-no-aceptada" 
                                                data-id="{{=d.id}}" placeholder="Glosa No Aceptada" min="0">
                                        </td>
                                        <td>
                                            <label class="mb-1"><b>Tipo de Póliza</b></label>
                                            <select class="form-control form-control-sm tipo-poliza" data-id="{{=d.id}}" data-factura="{{=d.f}}">
                                                <option value="" selected>Selecciona una opción</option>
                                                <option value="SOAT">SOAT</option>
                                                <option value="NO SOAT">NO SOAT</option>
                                            </select>
                                        </td>
                                    </tr>

                                    <tr class="factura-{{=d.f}} {{?id % 2 == 0}}bg-zebra{{?}}">
                                        <td colspan="4">
                                            <label class="mb-1"><b>Respuesta Glosa</b></label>
                                            <textarea class="form-control form-control-sm respuesta-glosa" 
                                                data-id="{{=d.id}}" placeholder="Escribe tu respuesta..."></textarea>
                                        </td>
                                    </tr>
                                    {{factura = d.f;}}
                                    {{~}}
                                </tbody>
                            </table>
                        `;

                        const html = doT.template(template)({ detail: response.data.rtg });

                        new nataUIDialog({
                            title: `Artemisa: Responder Glosa &nbsp;
                                    <span class="badge badge-sm rounded-pill text-bg-danger">${response.data.rtg.length}</span>`,
                            html: html,
                            toolbar: `
                                <div class="btn-group">
                                    <button type="button" class="btn btn-primary dropdown-toggle btn-circle" data-bs-toggle="dropdown" aria-expanded="false">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                        </svg>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li>
                                            <a class="dropdown-item guardar-respuestas">
                                                Guardar Respuestas
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            `
                        });

                        document.querySelectorAll('.glosa-aceptada, .glosa-no-aceptada').forEach(input => {
                            input.addEventListener('input', function () {
                                const row = input.closest('tr');
                                const valorGlosado = parseFloat(row.querySelector('.text-bg-danger').textContent.trim().replace(/,/g, '')) || 0;
                                const valorAceptadoInput = row.querySelector('.glosa-aceptada');
                                const valorNoAceptadoInput = row.querySelector('.glosa-no-aceptada');
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

                        document.querySelectorAll('.tipo-poliza').forEach(select => {
                            select.addEventListener('change', function() {
                                const selectedValue = this.value;
                                const factura = this.getAttribute('data-factura');
                                document.querySelectorAll(`.tipo-poliza[data-factura="${factura}"]`).forEach(s => {
                                    s.value = selectedValue;
                                });
                            });
                        });

                        document.getElementById('filterRespuesta').addEventListener('change', function() {
                            const filterValue = this.value;
                            const rows = document.querySelectorAll('#tableGlosaResponderPorTipo tbody tr');

                            rows.forEach(row => {
                                const facturaClass = Array.from(row.classList).find(cls => cls.startsWith('factura-'));
                                const textarea = row.querySelector('.respuesta-glosa');
                                const hasResponse = textarea ? textarea.value.trim().length > 0 : false;

                                if (facturaClass) {
                                    if (filterValue === 'empty' && hasResponse) {
                                        document.querySelectorAll(`.${facturaClass}`).forEach(fila => fila.style.display = 'none');
                                    } else if (filterValue === 'filled' && !hasResponse) {
                                        document.querySelectorAll(`.${facturaClass}`).forEach(fila => fila.style.display = 'none');
                                    } else {
                                        document.querySelectorAll(`.${facturaClass}`).forEach(fila => fila.style.display = '');
                                    }
                                }
                            });
                        });                        
                        
                        document.querySelector('.guardar-respuestas').addEventListener('click', function () {
                            const rows = document.querySelectorAll('#tableGlosaResponderPorTipo tbody tr');
                            let isValid = true;
                            const validRowsData = [];
                        
                            rows.forEach(row => {
                                const glosaAceptada = row.querySelector('.glosa-aceptada');
                                const glosaNoAceptada = row.querySelector('.glosa-no-aceptada');
                                const tipoPoliza = row.querySelector('.tipo-poliza');
                                const respuesta = document.querySelector(`.respuesta-glosa[data-id="${glosaAceptada ? glosaAceptada.dataset.id : ''}"]`);
                        
                                const fields = [respuesta, glosaAceptada, glosaNoAceptada, tipoPoliza];
                                let isAnyFieldFilled = fields.some(field => field && field.value.trim() !== "");
                        
                                if (isAnyFieldFilled) {
                                    let validRow = true;
                                    fields.forEach(field => {
                                        if (field) {
                                            const isEmpty = !field.value.trim();
                                            field.style.backgroundColor = isEmpty ? '#f8d7da' : '';
                                            if (isEmpty) validRow = false;
                                        }
                                    });
                        
                                    if (validRow) {
                                        const rowId = row.querySelector('.glosa-aceptada') ? row.querySelector('.glosa-aceptada').dataset.id : null;
                        
                                        validRowsData.push({
                                            id: rowId,
                                            respuesta: respuesta ? respuesta.value.trim() : '',
                                            glosaAceptada: glosaAceptada ? glosaAceptada.value.trim() : '',
                                            glosaNoAceptada: glosaNoAceptada ? glosaNoAceptada.value.trim() : '',
                                            tipoPoliza: tipoPoliza ? tipoPoliza.value.trim() : '',
                                            usuario: session.user.ir
                                        });
                                    } else {
                                        isValid = false;
                                    }
                                }
                            });
                        
                            if (!isValid) {
                                app.core.robot.message("Por favor, complete los campos resaltados para poder continuar.", 5);
                            } else {
                                console.log('Registros válidos:', validRowsData);

                                axios.post(app.config.server.php1 + "x=glosa&y=actualizarRespuestas", validRowsData)
                                    .then(function(response){
                                        console.log(response.data);

                                        app.core.dialog.removeAll();
                                        app.core.robot.message("Las respuestas han sido actualizadas exitosamente.", 5);
                                    })
                                    .catch(function(error){
                                        console.error(error);
                                    })
                            }
                        });
                        
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            },
            
            resumen: function () {
                console.log("app.wizard_V1.glosa.contestar.resumen");
                document.querySelector("#loader").style.display = "block";

                axios.get(app.config.server.php1 + "x=glosa&y=responder")
                    .then(function (response) {
                        const data = response.data.rg;
                        console.log(data);

                        document.querySelector("#loader").style.display = "none";

                        const template = `
                            <style>
                                #tableGlosaResumen {
                                    table-layout: fixed;
                                    width: 270px;
                                }
                            </style>
                            <table id="tableGlosaResumen" class="table nata-ui-table table-sm font-size-12px">
                                <colgroup>
                                    <col width="150">
                                    <col width="120">
                                </colgroup>
                                <thead>
                                    <th>Tipo Glosa</th>
                                    <th>Cantidad Glosa</th>
                                </thead>
                                <tbody>
                                {{~it.detail: d:id}}
                                    <tr>
                                        <td>{{=d.tg}}</td>
                                        <td class="text-end"><span class="badge badge-sm rounded-pill text-bg-danger">{{=d.c}}</span></td>
                                        <!--<td class="text-center">
                                            {{?d.id == 0}}
                                            {{??}}
                                            <button data-id={{=d.id}} type="button" class="btn btn-sm btn-primary btn-responder">Responder</button>
                                            {{?}}
                                        </td>-->
                                    </tr>
                                {{~}}
                                </tbody>
                            </table>
                        `;
                        
                        const html = doT.template(template)({ detail: data });
                        
                        new nataUIDialog({
                            title: `Artemisa: Responder Glosa`,
                            html: html,
                            height: 250,
                            width: 320
                        });

                        // const buttonsResponder = document.querySelectorAll(".btn-responder");

                        // buttonsResponder.forEach(buttonResponder => {
                        //     buttonResponder.addEventListener("click", function(e){
                        //         const id = e.currentTarget.dataset.id;
                        //         console.log(id);
                                
                        //         axios.get(app.config.server.php1 + "x=glosa&y=responderTipoGlosa&z=" + id)
                        //             .then(function(response){
                        //                 console.log(response.data.rtg);
                                    
                        //                 app.core.dialog.removeAll();
                        //                 app.wizard_V1.glosa.contestar.responderTipoGlosa(response.data.rtg);
                        //             })
                        //             .catch(function(error){
                        //                 console.error(error);
                        //             })
                        //     })
                        // });
                    })
                    .catch(function (error){
                        console.error(error);
                    })
            },
            
            index: function () {
                console.log("app.wizard_V1.glosa.contestar.index");
                const arrSteps = [
                    {
                        fx: function () {
                            document.querySelector("#loader").style.display = "block";
                            app.core.robot.message("Estoy verificando el estado de cuentas pendientes por respuesta de glosa", 3);
                        },
                        d: 3
                    },
                    {
                        fx: app.wizard_V1.glosa.contestar.sin,
                        d: 1
                    },
                    {
                        fx: function () {
                            app.core.robot.message(`Hay cuentas que no tienen el detalle de glosa cargado en la base de datos, 
                                verifica si existen soportes en PDF o descarga los detalles de glosa de la plataforma del asegurador`, 10);
                        },
                        d: 0
                    }
                ];
                // eslint-disable-next-line no-unused-vars
                const oWizardEngine = new wizardEngine(arrSteps);
            },
        },
    }
};

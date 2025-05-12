/* eslint-disable quotes */
/* globals app, nata, doT*/

app.monitor = {
   index: function () {
        console.trace("%c app.monitor.index", "background:red;color:#fff;font-size:11px");

        // Obtener datos del localStorage
        let data = nata.localStorage.getItem("robot-armado");
        
        console.log(data);
        console.log(data.monitor);
        console.log(data.generacion);

        let dataMonitor = data.monitor;
        let dataGeneracion = data.generacion;

        let tableTemplate = `
            <div class="d-flex flex-column justify-content-center align-items-center">
                <h6 class="my-3">Monitor estado soportes</h6>
                <table class="table table-hover table-bordered" style="font-size: 0.9rem; width: auto;">
                    <thead class="table-primary">
                        <tr>
                            <th class="text-center">Prioridad</th>
                            <th class="text-center">Soporte</th>
                            <th class="text-center">Pendiente</th>
                            <th class="text-center">Generado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {{~it.detail: d:id}}
                            <tr>
                                <td class="text-center fw-bold">{{=d.p}}</td>
                                <td class="text-center">{{=d.s}}</td>
                                <td class="text-center">{{=d.pe}}</td>
                                <td class="text-center">{{=d.g}}</td>
                            </tr>
                        {{~}}
                    </tbody>
                </table>

                <h6 class="mt-5 mb-3">Monitor generación factura IND645678</h6>
                <table class="table table-hover table-bordered" style="font-size: 0.9rem; width: auto;">
                    <thead class="table-primary">
                        <tr>
                            <th class="text-center">Factura</th>
                            <th class="text-center">Grupo</th>
                            <th class="text-center">Soporte</th>
                            <th class="text-center">Estado Generación</th>
                            <th class="text-center">Observación</th>
                            <th class="text-center">Notas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {{~it.detailArmado: d:id}}
                            <tr>
                                <td class="text-center fw-bold">{{=d.f}}</td>
                                <td class="">{{=d.g}}</td>
                                <td class="">{{=d.s}}</td>
                                <td class="text-center">{{=d.ge}}</td>
                                <td class="">{{=d.o}}</td>
                                <td class="">{{=d.n}}</td>
                            </tr>
                        {{~}}
                    </tbody>
                </table>
            </div>
        `;

        const html = doT.template(tableTemplate)({detail: dataMonitor, detailArmado: dataGeneracion});

        // const html = compiledTemplate(data); 

        const container = document.getElementById("container");

        if (container) {
            container.innerHTML = html;
        } else {
            console.error("Contenedor no encontrado.");
        }
    }
};


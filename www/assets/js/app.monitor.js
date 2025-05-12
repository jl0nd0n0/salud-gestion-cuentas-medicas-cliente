/* eslint-disable quotes */
/* globals app, nata, doT*/

app.monitor = {
   index: function () {
        console.trace("%c app.monitor.index", "background:red;color:#fff;font-size:11px");

        // Obtener datos del localStorage
        let data = nata.localStorage.getItem("robot-armado");
        
        console.log(data);

       let tableTemplate = `
            <div class="d-flex justify-content-center">
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
                        {{~it :i:index}}
                            <tr>
                                <td class="text-center fw-bold">{{=i.p}}</td>
                                <td class="text-center">{{=i.s}}</td>
                                <td class="text-center">{{=i.pe}}</td>
                                <td class="text-center">{{=i.g}}</td>
                            </tr>
                        {{~}}
                    </tbody>
                </table>
            </div>
        `;



        const compiledTemplate = doT.template(tableTemplate);

        const html = compiledTemplate(data); 

        const container = document.getElementById("container");

        if (container) {
            container.innerHTML = html;
        } else {
            console.error("Contenedor no encontrado.");
        }
    }
};


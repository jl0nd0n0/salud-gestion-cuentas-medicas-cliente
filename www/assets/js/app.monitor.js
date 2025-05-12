/* eslint-disable quotes */
/* globals app, nata, doT*/

app.monitor = {
   index: function () {
        console.trace("%c app.monitor.index", "background:red;color:#fff;font-size:11px");

        // Obtener datos del localStorage
        let data = nata.localStorage.getItem("robot-armado");
        
        console.log(data);

        const tableTemplate = `
            <div class="card mt-4 ml-5">
                <div class="card-header">
                    <div class="icon-title">${iconProcess}</div>  Control Armado Cuentas Médicas - Diario
                </div>
                <div class="card-body">
                    <div class="">
                        <style>
                            .table-robot-armado-cuenta {
                                table-layout: fixed;
                                width: 930px;
                            }

                            .table-robot-armado-cuenta-detail {
                                table-layout: fixed;
                                width: 930px;
                            }

                            .table-robot-armado-cuenta-detail tr th {
                                font-size: 11px
                            }
                        </style>
                        
                        {{~it.detail: d:id}}
                        <table class="table table-bordered table-sm table-robot-armado-cuenta">
                            <colgroup>
                                <col width="50"></col>
                                <col width="350"></col>
                                <col width="200"></col>
                                <col width="140"></col>
                                <col width="240"></col>
                            </colgroup>
                            <thead class="table-primary">
                                <tr>
                                    <th class="text-center">Radicar</th>
                                    <th class="text-center">Factura</th>
                                    <th class="text-center">Fecha</th>
                                    <th class="text-center">Valor</th>
                                    <th class="text-center">Paciente</th>
                                    <th class="text-center"></th>
                                </tr>
                            </thead>
                            <tbody>
                                    <tr>
                                        <td class="text-center">
                                            <div class="rounded-circle bg-danger d-inline-block"
                                                style="width: 25px; height: 25px;"></div>
                                        </td>
                                        <td class="text-start fw-bold">{{=d.f}}</td>
                                        <td class="text-center">{{=d.fe}}</td>
                                        <td class="text-end">
                                            $ {{=numberDecimal.format( d.v )}}
                                        </td>
                                        <td colspan="2" class="text-center">{{=d.p}}</td>
                                    </tr>                                
                            </tbody>
                        </table>
                        <table class="table table-bordered table-sm table-robot-armado-cuenta-detail">
                            <colgroup>
                                <col width="400"></col>
                                <col width="200"></col>
                                <col width="140"></col>
                                <col width="120"></col>
                                <col width="120"></col>
                            </colgroup>
                            <thead class="table-primary">
                                <tr>
                                    <th class="text-center">Grupo</th>
                                    <th class="text-center">Soporte</th>
                                    <th class="text-center">Armado</th>
                                    <th class="text-center">Estado</th>
                                    <th class="text-center">Descripción</th>
                                </tr>
                            </thead>
                            {{~d.d: dd:idd}}
                            <tr>
                                <td class="text-start">{{=dd.g}}</td>
                                <td class="text-start">{{=dd.s}}</td>
                                <td class="text-center">
                                    {{? dd.ge == "0"}}
                                    <div class="rounded-circle bg-danger d-inline-block"
                                        style="width: 25px; height: 25px;"></div>
                                    {{??}}
                                     <div class="rounded-circle bg-success d-inline-block"
                                                style="width: 25px; height: 25px;"></div>
                                    {{?}}
                                </td>
                                <td class="text-start">{{=dd.o}}</td>
                                <td class="text-start">{{=dd.n}}</td>
                            </tr>
                            {{~}}                                
                            </tbody>
                        </table>
                        {{~}}

                    </div>
                </div>
            </div>
        `;

        const html = doT.template(tableTemplate)({detail: data});

        // const html = compiledTemplate(data); 

        const container = document.getElementById("container");

        if (container) {
            container.innerHTML = html;
        } else {
            console.error("Contenedor no encontrado.");
        }
    }
};


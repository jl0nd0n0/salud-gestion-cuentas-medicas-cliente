/* globals nata, session, $, localforage, doT */

if (typeof nata.ui == "undefined") nata.ui = {};
if (typeof nata.ui.control == "undefined") nata.ui.control = {};

nata.ui.control.multiple = {
    // nata.ui.control.multiple.events
    events: {}
};

class nataUIControlMultiple extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();
        console.log("*** nataUIDashboardMenu ***");

        const this_ = this;
        var html = `
            <style>
                @import url("assets/nata/ui/control/nata.ui.control.multiple.css");
            </style>
            <div class="w-100 text-end">
                <button type="button" class="btn btn-primary btn-circle button-add">
                    <img class="icon-button" src="assets/images/icons/plus-thick-white.svg" alt="">
                </button>
            </div>

            <table class="table table-border table-striped table-sm">
                <thead>
                    <tr>
                        <th scope="col">ANT</th>
                        <th scope="col">Tipo Identificacion</th>
                        <th scope="col">Numero Identificacion</th>
                        <th scope="col">Cie10</th>
                    </tr>
                </thead>
                <tbody id="nata-ui-control-multiple-tbody"></tbody>
            </table>
        `;

        this_.innerHTML = html;

        if (this_.classList.contains("cie10")) {

            $(".control-multiple .button-add")
                .off()
                .click(function () {

                    localforage.getItem("cie10-indice").then(function (data) {
                        const html = nata.ui.listTree.html.get(data);
                        // cargando la data al componente listTree
                        nata.ui.listTree.dataset.data = data;
                        localforage.getItem("cie10").then(function (data) {
                            nata.ui.listTree.dataset.child.data = data;

                            const options = {
                                body: {
                                    html: html
                                },
                                height: session.height - 50,
                                title: "CIE 10",
                                top: 20,
                                width: (session.width < 500) ? "100%" : 500
                            };
                            nata.ui.dialog.show(options);

                            nata.ui.listTree.callback = function (record) {
                                console.log(record);

                                $("#uiDialog").remove();
                                const html = `
                                    <tr>
                                        <td>{{=it.detail.c}}</td>
                                        <td>{{=session.historiaClinica.tipoIdentificacion}}</td>
                                        <td>{{=session.historiaClinica.numeroIdentificacion}}</td>
                                        <td>{{=it.detail.d}}</td>
                                    </tr>
                                `;

                                $("#nata-ui-control-multiple-tbody").append(doT.template(html)({ 
                                    detail: record 
                                }));
                            };
                        });
                    });
                });

        }

    }

    connectedCallback() {
    }
}

// Define the new element
customElements.define("nata-ui-control-multiple", nataUIControlMultiple);
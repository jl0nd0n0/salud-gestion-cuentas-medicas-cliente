/* globals nata,session,axios,app,nataUIDialog*/

class nataUITodo extends HTMLElement {
    constructor() {
        // Siempre llamar primero a super en el constructor
        super();
    }

    connectedCallback() {
        const self = this;

        const data = nata.localStorage.getItem("notificaciones");
        console.log(data);
        const user = nata.localStorage.getItem("user");
        console.log(user);

        const options = {
            id: "tableTodo",
            columns: [
                {
                    title: "id",
                    width: "60",
                    prop: "in"
                },
                {
                    title: "Actividad",
                    width: "250",
                    prop: "a",
                    class: "descriptor"
                },
                {
                    title: "Responsable",
                    width: "120",
                    prop: "r",
                    class: "responsable"
                },
                {
                    title: "Fecha Inicio",
                    width: "120",
                    prop: "fi",
                },
                {
                    title: "Fecha Vencimiento",
                    width: "120",
                    prop: "ff",
                    class: "text-end",
                    widget: {
                        w: "badge",
                        c: "text-bg-danger pulse-red"
                    }
                },
                {
                    title: "Dias Transcurridos",
                    width: "90",
                    prop: "dt",
                    class: "text-end",
                    widget: {
                        w: "badge",
                        c: "text-bg-danger pulse-red"
                    }
                },
                {
                    title: "Dias Vencimiento",
                    width: "90",
                    prop: "dtf",
                    class: "text-end",
                    widget: {
                        w: "badge",
                        c: "text-bg-danger pulse-red"
                    }
                }
            ],
            data: data.filter(function (record) {
                return (record.e == 0);
            })
        };

        nata.sessionStorage.setItem("widget", options);
        if(data.length == 0) {
            if(session.user.ir != 11){
                self.innerHTML = `
                <style>
                    nata-ui-todo {
                        vertical-align: middle;
                        display: inline-block;
                        cursor: pointer;
                    }

                    .dropdown-item {
                        line-height: normal;
                    }
                </style>
                <div class="w-100">
                    <div class="dropdown">
                        <h7 class="usuario">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                            ${user.n}
                        </h7>
                    </div>
                </div>
            `;
            }
            else if(session.user.ir == 11){
                self.innerHTML = `
                  <style>
                      nata-ui-todo {
                          vertical-align: middle;
                          display: inline-block;
                          cursor: pointer;
                      }

                      .dropdown-item {
                          line-height: normal;
                      }
                  </style>
                  <div class="w-100">
                      <div class="dropdown">
                          <h7 class="usuario">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                              </svg>
                              ${user.n}
                          </h7>&nbsp;&nbsp;
                          <button id="DescargarPanel" type="button" class="btn btn-primary">
                            <svg id="DescargarPanel" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                              <path id="DescargarPanel" stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                          </button>
                      </div>
                  </div>
              `;
            }
        }
        else{
            self.innerHTML = `
                <style>
                    nata-ui-todo {
                        vertical-align: middle;
                        display: inline-block;
                        cursor: pointer;
                    }

                    .dropdown-item {
                        line-height: normal;
                    }
                </style>
                <div class="w-100">
                    <div class="dropdown">
                        <h7>${user.n}</h7>
                        <button class="btn btn-circle dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <lottie-player class="circle" src="assets/images/icons/animate/bell.json"
                                background="transparent" speed="1"
                                style="width: 35px; height: 35px" loop autoplay
                                direction="1" mode="normal">
                            </lottie-player>
                        </button>

                        <div class="dropdown-menu notificaciones">
                            ${"<nata-ui-table></nata-ui-table>"}
                        </div>
                    </div>
                </div>
            `;
        }
        if(document.querySelector("#DescargarPanel") != null){
            document.querySelector("#DescargarPanel").addEventListener("click", function (event) {
                console.log("#DescargarPanel.click");
                this.checked = true;

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
            });
        }

    }
}
customElements.define("nata-ui-todo", nataUITodo);

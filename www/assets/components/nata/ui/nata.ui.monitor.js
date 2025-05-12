/* globals localforage, swal, nata, doT,app */
if (typeof nata.ui == "undefined") nata.ui = {};
if (typeof nata.ui.monitor == "undefined") nata.ui.monitor = {};

const templateMonitor = `
    <p>
        <img class="icon-button" src="assets/images/icons/cog-sync.svg" alt="">&nbsp;
        Monitor
    </p>
    {{~ it.detail: d:i}}
        <table class="table table-striped table-danger">
            <thead>
                <tr class="text-center">
                    <th scope="col" colspan="7">
                        <span class="color-white font-size-14px">
                            {{? d.p == 0}}
                            Perfil Administrador General
                            {{?}}
                            {{? d.p == 1}}
                            Perfil Agendamiento Coordinacion
                            {{?}}
                            {{? d.p == 3}}
                            Perfil Toma de Muestra
                            {{?}}
                            {{? d.p == 5}}
                            Perfil Médico
                            {{?}}
                            {{? d.p == 6}}
                            Perfil Facturador
                            {{?}}
                            {{? d.p == 7}}
                            Perfil Gerencia
                            {{?}}
                        </span>
                    </th>
                </tr>
                <tr class="text-center color-white">
                    <th scope="col">ID Mensaje</th>
                    <th scope="col">Estado</th>
                    <th scope="col" colspan="3">Mensaje</th>
                    <th scope="col">ID Parámetro</th>
                    <th scope="col">Fecha</th>
                </tr>
            </thead>
            <tbody>
            {{~ it.detail: d:i}}
                <tr>
                    <td scope="row" class="color-white">
                        {{=d.id}}
                    </td>
                    <td scope="row" class="color-white">
                        {{? d.es == 1}}
                            Activo
                        {{??}}
                            inactivo
                        {{?}}
                    </td>
                    <td scope="row" colspan="3" class="color-white">
                        {{=d.me}}
                    </td>
                    <td scope="row" class="color-white">
                        {{=d.pa[0]}}
                    </td>
                    <td scope="row" class="color-white">
                        {{=d.pa[1]}}
                    </td>
                </tr>
            {{~}}
            </tbody>
        </table>
    {{~}}
`;

nata.ui.monitor = {
    alert: {
        render: function () {
            console.log("nata.ui.monitor.alert.render");
            const element = document.querySelector(".container-alert");
            element.classList.remove("hide");
            element.querySelector("img").classList.add("bell");

            //const beat = new Audio("assets/sounds/beat.wav");
            //beat.play();
            app.sound.play();
            const time = 4.4;
            setTimeout(() => {
                //beat.play();
                app.sound.play();

                setTimeout(() => {

                    //beat.play();
                    app.sound.play();

                    setTimeout(() => {
                        element.querySelector("img").classList.remove("bell");
                    }, 1000 * time);

                }, 1000 * time);

            }, 1000 * time);

        }
    },
    index: async function () {
        console.log("nata.ui.monitor.index");
        const data = await localforage.getItem("monitor");

        if (data.length > 0) {

            const fxRender = function () {
                console.log(data);
                const html = doT.template(templateMonitor)({detail: data});
                const element = document.getElementById("container");
                element.innerHTML = html;
                element.style.display = "block";
                // activar las notificaciones del monitor
                nata.ui.monitor.alert.render();
            };

            swal({
                title: app.config.title,
                text: "Bienvenid@ a Artemisa\nDesarrollado con pasión para ti\nEquipo Crescend",
                icon: "success",
                button: "Continuar",
                dangerMode: false,
            }).then((response) => {
                if (response) {
                    //title, text = "Has actualizado los datos", url, json, callback, code = ""
                    fxRender();

                    document.getElementById("buttonAlert").addEventListener("click", function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        fxRender();
                    }, true);
                }
            });

        }

    }
};
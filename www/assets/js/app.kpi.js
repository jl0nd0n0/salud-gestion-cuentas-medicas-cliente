/* globals app, session, nataUIDialog, doT */

app.kpi = {
    keralty: {
        agendamiento: function () {
            console.log("app.kpi.keralty.agendamiento");
            app.core.menu.close();
            const elContainer = document.getElementById("container");
            fetch(app.config.server.php + "kpis/keralty/agendamiento")
                .then(function (response) {
                    return response.json();
                }).then(function (json) {
                    elContainer.innerHTML = "";
                    const loader = document.querySelector("#loader");
                    loader.style.display = "block";
                    setTimeout(function() {

                        let template = "templateKPISKeraltyEstadisticas";
                        if (session.width <= 768) {
                            template = "templateKPISKeraltyEstadisticas-mobile";
                        }
                        elContainer.render(template, {detail:json});
                        elContainer.style.display = "block";
                        loader.style.display = "none";
                    }, 0.5 * 1000);
                });
        },
        cumplimiento: {
            cierre: function () {
                console.log("app.kpi.keralty.cumplimiento.cierre");
                app.core.menu.close();
                const elContainer = document.getElementById("container");
                fetch(app.config.server.php + "kpis/keralty/cumplimientoCierre")
                    .then(function (response) {
                        return response.json();
                    }).then(function (json) {
                        elContainer.innerHTML = "";
                        const loader = document.querySelector("#loader");
                        loader.style.display = "block";
                        setTimeout(function() {
                            elContainer.render("templateKPIKeraltyConsultaCierre", {detail:json});
                            elContainer.style.display = "block";
                            loader.style.display = "none";
                        }, 0.5 * 1000);
                    });
            },
            cierreDetalle: function (year, month, day) {
                console.log("app.kpi.keralty.cumplimiento.cierreDetalle");
                //alert(year + "," + month + "," + day);
                fetch(app.config.server.php + "kpis/keralty/cumplimientoCierreDetalle",{
                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                    mode: "cors", // no-cors, *cors, same-origin
                    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: "same-origin", // include, *same-origin, omit
                    headers: {
                        "Content-Type": "application/json"
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    redirect: "follow", // manual, *follow, error
                    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade,
                    body: JSON.stringify({
                        y: year,
                        m: month,
                        d: day
                    }) // body data type must match "Content-Type" 
                })
                    .then(function (response) {
                        return response.json();
                    }).then(function (oDataResponse) {
                        console.log(oDataResponse);

                        const template = `
                            <div class="max-width-600">
                                <ul class="list-group zebra scroll">
                                    {{~ it.detail: obj:i}}
                                    <li class="list-group-item {{?obj.t > 180}}bg-danger bg-opacity-10{{?}}">
                                        {{?obj.t > 180}}
                                            <span class="badge rounded-pill text-bg-danger copy-clipboard min-width-100px me-2 text-end">{{=obj.ic}}</span>
                                            <span class="badge rounded-pill text-bg-danger copy-clipboard min-width-100px me-2 text-end">{{=obj.id}}</span>
                                            <span class="badge rounded-pill text-bg-danger copy-clipboard min-width-60px me-2 text-end">{{=obj.t}}</span>
                                        {{??}}
                                            <span class="badge rounded-pill text-bg-primary copy-clipboard min-width-100px me-2 text-end">{{=obj.ic}}</span>
                                            <span class="badge rounded-pill text-bg-primary copy-clipboard min-width-100px me-2 text-end">{{=obj.id}}</span>
                                            <span class="badge rounded-pill text-bg-primary copy-clipboard min-width-60px me-2 text-end">{{=obj.t}}</span>
                                        {{?}}
                                    </li>   
                                    {{~}}
                                </ul>
                            </div>
                        `;

                        new nataUIDialog({
                            height: session.height,
                            html: doT.template(template)({detail:oDataResponse}),
                            width: session.width,
                            title: `
                                Keralty: Detalle Casos Cerrados&nbsp;
                                Año: <span class="badge rounded-pill text-bg-primary">${year}</span>&nbsp;
                                Mes: <span class="badge rounded-pill text-bg-primary">${month}</span>&nbsp;
                                Día: <span class="badge rounded-pill text-bg-primary me-4">${day}</span>
                                Casos:  <span class="badge rounded-pill text-bg-warning">${oDataResponse.length}</span>
                            `,
                            events: {
                                render: function () {},
                                close: function () {}
                            }
                        });
                    });
            }
        }
    }
};
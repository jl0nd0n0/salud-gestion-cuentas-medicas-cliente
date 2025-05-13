/*  globals app, nata, alasql,session */

app.server = {
    data: {
        get: function (idPerfil = 0) {
            console.log( "%c app.server.data.get", "background:red;color:#fff;font-size:11px");

            app.server.data.notificaciones();
            if (idPerfil == 1) {
                app.server.data.administradorGet();
            }
            else {
                console.error("Error: idPerfil no definido");
                return false;
            }

            let htmlMenuBase = `
                <style>
                    .container-version {
                        text-align: center;
                    }

                    .container-logo {
                        display: inline-block;
                        height: 60px;
                        width: 60px;
                        margin-left: 20px;
                        margin-top: 15px;
                    }

                    .btn-menu svg {
                        height: 24px;
                        width: 24px;
                    }

                    .menu {
                        padding: 0;
                        margin: 0;
                        border: 0;
                        height: 100%;
                        width: 100%;
                        border-right: solid 1px #f1f1f1;
                        background: #f9f9f9;
                        box-shadow: 0 1px 15px 1px rgb(69 65 78 / 10%);
                    }

                    .menu ul {
                        width: 100%;
                    }

                    .submenu {
                        width: 100%;
                        text-align: center;
                        padding: 10px 20px;
                    }

                    li.submenu > ul > li {
                        width: 260px;
                        text-align: left;
                    }

                    .menu ul > li {
                        text-align: center;
                    }

                    .menu ul,
                    .menu ul li,
                    .menu ul ul {
                        list-style: none;
                        margin: 0;
                        padding: 0;
                    }

                    .menu ul {
                        position: relative;
                        z-index: 500;
                        float: left;
                    }

                    .menu ul li {
                        float: left;
                        vertical-align: middle;
                        position: relative;
                    }

                    .menu ul li.hover,
                    .menu ul li:hover {
                        position: relative;
                        z-index: 510;
                        cursor: default;
                    }

                    .menu ul ul {
                        visibility: hidden;
                        position: absolute;
                        top: 0;
                        left: 99%;
                        z-index: 520;
                        width: 100%;
                        margin-top: 0.05em;
                    }

                    .menu ul ul ul {
                        top: 0;
                        right: 0;
                    }

                    .menu ul li:hover > ul {
                        visibility: visible;
                        animation: menu-fade-in .3s ease 1, move-up .3s ease-out 1;
                    }

                    .menu ul li { float: none; }

                    .menu:before {
                        content: '';
                        display: block;
                    }

                    .menu:after {
                        content: '';
                        display: table;
                        clear: both;
                    }

                    .menu a {
                        text-align: left;
                        display: block;
                        padding: 0.6rem 1.2rem;
                        text-decoration: none;
                        color: #717171;
                    }

                    .menu ul li.submenu ul li { min-width: 13em; },

                    .menu > ul > li a:hover,
                    .menu > ul > li:hover a {
                        color: #000;
                    }

                    .menu li { position: relative; }

                    .menu ul li.submenu > a:after {
                        content: '»';
                        position: absolute;
                        right: 1em;
                    }

                    .menu ul ul li.first {
                        -webkit-border-radius: 0 3px 0 0;
                        -moz-border-radius: 0 3px 0 0;
                        border-radius: 0 3px 0 0;
                    }

                    .menu ul ul li.last {
                        -webkit-border-radius: 0 0 3px 0;
                        -moz-border-radius: 0 0 3px 0;
                        border-radius: 0 0 3px 0;
                        border-bottom: 0;
                    }

                    .menu ul ul {
                        -webkit-border-radius: 0 3px 3px 0;
                        -moz-border-radius: 0 3px 3px 0;
                        border-radius: 0 3px 3px 0;
                    }

                    .menu ul ul li {
                        border: solid 1px #f1f1f1;
                        background: #fff;
                        animation: menu-fade-in .3s ease 1, move-up .3s ease-out 1;
                        float: none;
                    }

                    .menu ul ul li:hover > a {
                        background: #f5f5f5;
                        color: #000;
                        box-shadow: 0 1px 15px 1px rgb(69 65 78 / 10%);
                    }

                    .menu.align-right > ul > li > a {
                        border-right: none;
                    }

                    .menu.align-right { float: right; }

                    .menu.align-right li { text-align: right; }

                    .menu.align-right ul li.submenu > a:before {
                        content: '+';
                        position: absolute;
                        top: 50%;
                        left: 15px;
                        margin-top: -6px;
                    }

                    .menu.align-right ul li.submenu > a:after { content: none; }

                    .menu.align-right ul ul {
                        visibility: hidden;
                        position: absolute;
                        top: 0;
                        left: -100%;
                        z-index: 598;
                        width: 100%;
                    }

                    .menu.align-right ul ul li.first {
                        -webkit-border-radius: 3px 0 0 0;
                        -moz-border-radius: 3px 0 0 0;
                        border-radius: 3px 0 0 0;
                    }

                    .menu.align-right ul ul li.last {
                        -webkit-border-radius: 0 0 0 3px;
                        -moz-border-radius: 0 0 0 3px;
                        border-radius: 0 0 0 3px;
                    }

                    .menu.align-right ul ul {
                        -webkit-border-radius: 3px 0 0 3px;
                        -moz-border-radius: 3px 0 0 3px;
                        border-radius: 3px 0 0 3px;
                    }

                    .menu ul ul {
                        box-shadow: 0 1px 15px 1px rgb(69 65 78 / 10%);
                    }

                    @keyframes menu-fade-in {
                        from {
                            opacity: 0
                        }
                        to {
                            opacity: 1
                        }
                    }
                </style>
            `;

            htmlMenuBase += `
                <div class="container-logo">
                </div>

                <div class="menu">
                    <ul>
                        <li>
                            <button type="button" class="btn btn-menu d-inline-block button-circle"
                                onclick="app.core.refresh();">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" /></svg>
                            </button>
                        </li>
                        <li>
                            <button type="button" class="btn btn-menu d-inline-block button-circle"
                                onclick="app.core.exit();">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>location-exit</title><path d="M22 12L18 8V11H10V13H18V16M20 18A10 10 0 1 1 20 6H17.27A8 8 0 1 0 17.27 18Z" /></svg>
                            </button>
                        </li>
                    </ul>
                    <div class="container-version">
                        ${app.config.version.check.version}
                    </div>
                </div>
            `;

            const elMenu = document.getElementById("menu");
            if (typeof idPerfil === "undefined") idPerfil = 0;
            if (elMenu !== null) elMenu.menuRender(htmlMenuBase);

            const element = document.querySelector("#menu");
            if (element !== null) {
                element.addEventListener("mouseover", function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    const element = document.querySelector("#container");
                    element.classList.remove("effect");
                    element.classList.add("effect");

                    /*
                    const element = event.target;
                    if (element.classList.contains("submenu")) {
                        console.log("bingo !!");
                        const element = document.querySelector("#container");
                        element.classList.remove("effect");
                        element.classList.add("effect");
                        //alert("bingo !!!");
                    }
                    */

                });

                document.querySelector("#menu").addEventListener("mouseout", function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    const element = document.querySelector("#container");
                    element.classList.remove("effect");

                });
            }
        },

        administradorGet: function () {
            //alert("01");
            console.log("app.server.data.administradorGet");

            let contador = 0;

            const fxCallback = function () {
                ++contador;
                console.log(contador);
                if (contador == 2) {                    
                    app.monitor.index();
                    document.querySelector("#loader").style.display = "none";
                }
            };

            const params = [
                //FIXME: se debe trabajar con la misma vista de monitor, al implementar
                // hay que optimizar los recursos
                {
                    url: "x=cuentasMedicas&k=monitorRobotArmado",
                    index: "robot-armado",
                    callback: fxCallback
                },
                {
                    url: "x=cuentasMedicas&k=monitorRobotArmado",
                    index: "robot-armado-fecha",
                    callback: fxCallback
                }
            ];

            nata.localStorage.load(app.config.server.php1, "json", params);
        },

        auditorGet: function () {
            console.log("app.server.data.auditorGet");

            let contador = 0;
            const fxCallback = function () {
                ++contador;
                console.log(contador);
                if (contador == 2) {
                    app.monitor.index();
                    document.querySelector("#loader").style.display = "none";
                }
            };

            const params = [

                {
                    url: "x=soat&y=soportesDescarga",
                    index: "documentacion-soportes-descargar",
                    callback: fxCallback
                },
                {
                    url: "x=soat&y=monitor&z=" + session.user.ir,
                    index: "soat-monitor",
                    callback: fxCallback
                },
                {
                    url: "x=soat&y=estadosGet",
                    index: "soat-estados",
                    callback: function () {
                        document.querySelector("#iconNotificaciones").classList.remove("d-none");
                        document.querySelector("#containerNotificaciones").innerHTML = "<nata-ui-todo></nata-ui-todo>";
                    }
                }
            ];

            nata.localStorage.load(app.config.server.php1, "json", params);
        },

        carteraGlosaAdresGet: function () {
            console.log("%c app.server.data.carteraGlosaAdresGet", "background:red;color:white;font-weight:bold;font-size:11px");

            const params = [
                {
                    url: "x=cartera&y=glosaAdresGet",
                    index: "cartera-glosa-adres-get",
                    callback: function (data) {
                        app.cartera.adres(data);
                        document.querySelector("#loader").style.display = "none";
                    }
                }
            ];

            nata.localStorage.load(app.config.server.php1, "json", params);
        },

        gerenteGet: function () {
            console.log("app.server.data.gerenteGet");
            let indice = 0;
            const fxCallback = function (data) {
                indice = indice + 1;
                console.log(indice);
                //console.log("callback get data ..." + indice);
                if (indice >= 4) {
                    document.getElementById("loader").style.display = "none";
                    console.log(data);
                    app.cartera.soat.index(data);
                }
            };

            let params = [
                {
                    url: "x=cartera&y=totalGet",
                    index: "cartera-soat-total",
                    callback: fxCallback
                },
                {
                    url: "x=cartera&y=totalHomiGet",
                    index: "cartera-homi-total",
                    callback: fxCallback
                },
                {
                    url: "x=soat&y=monitor",
                    index: "cartera-soat-monitor",
                    callback: function (data) {
                        // calcular totales
                        const strSQL = `
                            SELECT
                                SUM(s::NUMBER) AS t,
                                MIN(dvt::NUMBER) AS mindvt,
                                MAX(dvt::NUMBER) AS maxdvt,
                                MAX(dvg::NUMBER) AS dvg
                            FROM ?
                        `;
                        //console.log(strSQL);

                        const total = alasql(strSQL, [data]);
                        console.log(total);

                        const totales = total[0];
                        totales.cf = data.length;
                        console.log(totales);

                        nata.sessionStorage.setItem("cartera-soat-monitor-total", totales);
                    }
                },
                {
                    url: "x=soat&y=monitor1",
                    index: "cartera-soat-monitor-general",
                    callback: function (data) {
                        console.log(data);
                    }

                },
                {
                    url: "x=soat&y=estadosGet",
                    index: "soat-estados",
                    callback: function () {
                        document.querySelector("#iconNotificaciones").classList.remove("d-none");
                        document.querySelector("#containerNotificaciones").innerHTML = "<nata-ui-todo></nata-ui-todo>";
                    }
                }
            ];
            nata.localStorage.load(app.config.server.php1, "json", params);

            params = [
                /*
                {
                    url: "cartera",
                    index: "cartera-asegurador"
                },
                */

                {
                    url: "x=cartera&y=informe&z=0",
                    index: "cartera-soat-informe-gestion-catalogo-0",
                    //callback: fxCallback
                    callback:function(data) {
                        app.cartera.soat.index(data);
                    }
                },
                {
                    url: "x=cartera&y=informe&z=1",
                    index: "cartera-soat-informe-gestion-catalogo-1",
                    callback: fxCallback
                    /*
                    callback:function(data) {
                        app.cartera.soat.index(data);
                    }
                    */
                }
            ];
            nata.localStorage.load(app.config.server.php1, "json", params);

            params = [
                /*
                {
                    url: "cartera",
                    index: "cartera-asegurador"
                },
                */
                /*
                {
                    url: "cartera",
                    index: "cartera-index",
                    callback:function(data){
                        //nata.sessionStorage.setItem("chart1-data", data);
                        //app.cartera.soat.index(data);
                    }
                },
                */
                {
                    url: "cartera/consolidada",
                    index: "cartera-consolidada"
                }
            ];
            nata.localStorage.load(app.config.server.php, "json", params);
        },

        clienteGet: function() {
            console.log("app.server.data.clienteGet");
            let contador = 0;
            const fxCallback = function () {
                ++contador;
                console.log(contador);
                if (contador == 8) {
                    app.monitor.index();
                    document.querySelector("#loader").style.display = "none";
                }
            };

            const params = [
                {
                    url: "x=soat&y=radicarEnProceso",
                    index: "cartera-soat-radicar-proceso",
                    callback: fxCallback
                },
                {
                    url: "x=cartera&y=glosaAdresGet",
                    index: "cartera-glosa-adres",
                    callback: fxCallback
                },
                {
                    url: "x=cartera&y=glosaGet",
                    index: "cartera-glosa",
                    callback: fxCallback
                },
                {
                    url: "x=cartera&y=glosaConteoGet",
                    index: "cartera-glosa-conteo",
                    callback: fxCallback
                },
                {
                    url: "x=cartera&y=radicarOtroAseguradoresEnProceso",
                    index: "cartera-aseguradores-radicar",
                    callback: fxCallback
                },
                {
                    url: "x=soat&y=soportesDescarga",
                    index: "documentacion-soportes-descargar",
                    callback: fxCallback
                },
                {
                    url: "x=soat&y=monitor&z=" + session.user.ir,
                    index: "soat-monitor",
                    callback: fxCallback
                },
                {
                    url: "x=cartera&y=monitorOtrosAseguradores&z=" + session.user.ir,
                    index: "otro-aseguradores-monitor",
                    callback: fxCallback
                },
                {
                    url: "x=soat&y=estadosGet",
                    index: "soat-estados",
                    callback: function () {
                        document.querySelector("#iconNotificaciones").classList.remove("d-none");
                        document.querySelector("#containerNotificaciones").innerHTML = "<nata-ui-todo></nata-ui-todo>";
                    }
                }
            ];

            nata.localStorage.load(app.config.server.php1, "json", params);

        },

        radicarGet: function () {
            console.log("app.server.data.radicarGet");
            let contador = 0;
            const fxCallback = function () {
                ++contador;
                console.log(contador);
                //if (contador == 4) {
                app.monitor.index();
                document.querySelector("#loader").style.display = "none";
                //}
            };

            const params = [
                {
                    url: "x=soat&y=monitor&z=" + session.user.ir,
                    index: "soat-monitor",
                    callback: fxCallback
                },
                {
                    url: "x=soat&y=soportesDescarga",
                    index: "documentacion-soportes-descargar",
                    callback: fxCallback
                },
                {
                    url: "x=cartera&y=glosaAdresGet",
                    index: "cartera-glosa-adres",
                    callback: fxCallback
                },
                {
                    url: "x=soat&y=estadosGet",
                    index: "soat-estados",
                    callback: function () {
                        document.querySelector("#iconNotificaciones").classList.remove("d-none");
                        document.querySelector("#containerNotificaciones").innerHTML = "<nata-ui-todo></nata-ui-todo>";
                    }
                }
            ];
            nata.localStorage.load(app.config.server.php1, "json", params);
        },

        radicarRobotGet: function () {
            console.log("app.server.data.radicarRobotGet");
            let contador = 0;
            const fxCallback = function () {
                ++contador;
                console.log(contador);
                //if (contador == 4) {
                // app.monitor.index();
                document.querySelector("#loader").style.display = "none";
                //}
            };

            const params = [
                {
                    url: "x=robot&y=facturacionGet",
                    index: "robot-facturacion",
                    callback: fxCallback
                }
            ];
            nata.localStorage.load(app.config.server.php1, "json", params);
        },

        documentacionDescargaSoportesGet: function () {
            console.log("%c app.server.data.documentacionDescargaSoportesGet", "background:red;color:white;font-weight:bold;font-size:11px");
            let contador = 0;
            const fxCallback = function () {
                ++contador;
                console.log(contador);
                if (contador == 1) {
                    app.documentacion.soportes.descarga();
                    document.querySelector("#loader").style.display = "none";
                }
            };

            const params = [
                {
                    url: "x=soat&y=soportesDescarga",
                    index: "documentacion-soportes-descargar",
                    callback: fxCallback
                },
            ];

            nata.localStorage.load(app.config.server.php1, "json", params);
        },
        notificaciones: function () {
            console.log("%c app.server.data.notificaciones", "background:red;color:white;font-weight:bold;font-size:11px");
            const params = [
                {
                    url: "x=notificaciones&y=actividadesGet&z=" + session.user.ir,
                    index: "notificaciones"
                }
            ];

            nata.localStorage.load(app.config.server.php1, "json", params);
        }
    }
};
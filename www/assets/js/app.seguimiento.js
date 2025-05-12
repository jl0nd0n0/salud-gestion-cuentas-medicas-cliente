/* globals app, localforage, $, nataUIDialog, session, nata, swal */

app.seguimiento = {
    index: async  function () {
        console.log("%c app.seguimiento.index ...", "background:red;color:white;font-weight:bold;font-size:12px");
        let data = await localforage.getItem("seguimiento");
        if (data === null) data = [];
        console.log(data);

        // calcular totales
        let i, t1 = 0, t2 = 0, t3 = 0, t4 = 0;
        for(i=0; i<data.length; ++i) {
            t1 += parseInt(data[i].cp);
            t2 += parseInt(data[i].cpp);
            t3 += parseInt(data[i].cf);
            t4 += parseInt(data[i].pne);
        }

        const temporal =  {
            t1: t1,
            t2: t2,
            t3: t3,
            t4: t4,
            detail: data
        };
        console.log(temporal);
        const elContainer = document.getElementById("container");
        elContainer.render("templateSeguimientoIndex", temporal);
        elContainer.style.display = "block";

        const element = document.getElementById("toolbar");
        element.innerHTML = "<nata-ui-datepicker></nata-ui-datepicker>";
        element.style.display = "inline-block";

        //#region events
        $("#tableSeguimiento .seg-pac-agendados")
            .off()
            .click(function () {
                console.log(".seg-pac-agendados.click");
                //alert ("Click");
                //html = doT.template(document.getElementById("?").text, undefined, templates_)(temporal);
                const html = "";
                new nataUIDialog({
                    height: session.height,
                    html: html,
                    width: "100%",
                    title: "Pacientes Agendados",
                    events: {
                        render: function () {
                            document.querySelector(".ui-container").style.display = "none";
                        },
                        close: function () {
                            document.querySelector(".ui-container").style.display = "block";
                        }
                    }
                });
            });

        $("#tableSeguimiento .seg-pac-atendidos")
            .off()
            .click(function () {
                console.log(".seg-pac-atendidos.click");
                //html = doT.template(document.getElementById("?").text, undefined, templates_)(temporal);
                const html = "";
                new nataUIDialog({
                    height: session.height,
                    html: html,
                    width: "100%",
                    title: "Pacientes Atendidos",
                    events: {
                        render: function () {
                            document.querySelector(".ui-container").style.display = "none";
                        },
                        close: function () {
                            document.querySelector(".ui-container").style.display = "block";
                        }
                    }
                });
            }); 

        $("#tableSeguimiento .seg-pac-facturados")
            .off()
            .click(function () {
                console.log(".seg-pac-facturados.click");
                //html = doT.template(document.getElementById("?").text, undefined, templates_)(temporal);
                const html = "";
                new nataUIDialog({
                    height: session.height,
                    html: html,
                    width: "100%",
                    title: "Pacientes Facturados",
                    events: {
                        render: function () {
                            document.querySelector(".ui-container").style.display = "none";
                        },
                        close: function () {
                            document.querySelector(".ui-container").style.display = "block";
                        }
                    }
                });
            });
        //#endregion events
    } /*,
    sanitas: {
        premium: function () {
            console.log("app.seguimiento.sanitas.premium");
            document.querySelector( "#loader" ).style.display = "block";
            setTimeout(() => {
                const fx = function ( response ) {
                    console.log( response );

                    if ( response.length == 0 ) {
                        document.querySelector( "#loader" ).style.display = "none";
                        swal( app.config.title, "No se han encontrado casos de Sanitas Premium Abiertos", "success");
                        return false;
                    }

                    let i;
                    for ( i=0; i<response.length; ++i ) {
                        response[i].json = JSON.parse( response[i].json );
                    }
                    document.querySelector( "#container" ).render( "templateSeguimientoSanitasPremium", { detail: response } );
                    document.querySelector( "#loader" ).style.display = "none";

                    const elements = document.querySelector( "#tableSeguimientoSanitasPremium" ).querySelectorAll( ".button-seguimiento-SP-cerrar" );
                    for (i=0; i<elements.length; i++) {
                        elements[i].addEventListener( "click", function ( event ) {
                            event.preventDefault();
                            event.stopPropagation();

                            const ios = this.dataset.ios;

                            swal({
                                title: app.config.title,
                                text: "Has cerrado el caso en el CRM de Sanitas Premium ?",
                                icon: "warning",
                                buttons: ["NO, VOY A REVISAR", "SI, ESTA CERRADO"],
                                dangerMode: true
                            }).then((response) => {
                                if (response) {
                                    const data = {
                                        ios: ios
                                    };
                                    //method, url, data, typeResponse, callback, callbackError, timeout = 0, self = {}
                                    nata.ajax("post", app.config.server.php + "seguimiento/sanitasPremiumCerrarConsulta/", data, "json", function () {
                                        app.seguimiento.sanitas.premium();
                                        swal( app.config.title, "Se ha confirmado el cierre del caso en el CRM de Sanitas Premium", "success");
                                    });
                                }
                            });

                        }, true  );
                    }
                };
                //method, url, data, typeResponse, callback, callbackError, timeout = 0, self = {}
                nata.ajax("post", app.config.server.php + "seguimiento/sanitasPremium/", {}, "json", fx);
            }, 0.25 * 1000);
        }
    }*/
};
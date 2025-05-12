/* eslint-disable indent */
/* globals app, nataUIDialog, axios, swal, session, nata, alasql */
app.auditoriaSoporte = {

    primeraVez:{

        options: function () {
            console.log("app.auditoria.primeraVez.option");
            // return;

            let html = `
                <div class="text-center">                
                    <button id="btn-buscar-auditoria-estado" class="btn btn-outline-primary mt-3" type="submit">
                        Generar Estado
                    </button>
                    <button id="btn-buscar-auditoria-factura" class="btn btn-outline-primary mt-3" type="submit">
                        Generar Factura
                    </button>
                </div>
            `;
            const optionsDialog = {
                height: 180,
                width: 380,
                html: html,
                title: "Reporte de auditoria primera vez",
            };
            new nataUIDialog(optionsDialog);

            document.querySelector("#btn-buscar-auditoria-estado").addEventListener("click", function() {
                console.log("btn-buscar-auditoria-estado .click");

                const elements = document.querySelectorAll(".ui-dialog");
                console.log(elements);
                let i;
                for (i = 0; i < elements.length; i++) {
                    elements[i].remove();
                }
                let html = `
                    <div class="text-center">
                        <input id="buscar-auditoria" class="form-control mr-2 outline-0" type="number" placeholder="Reporte por estados" aria-label="Search" autocomplete="off">
                        <button id="btn-buscar-auditoria" class="btn btn-outline-primary mt-3" type="submit">
                            Generar Auditoria Estado
                        </button>
                    </div>
                `;
                const optionsDialog = {
                    height: 200,
                    width: 350,
                    html: html,
                    title: "Reporte de auditoria estado",
                };
                new nataUIDialog(optionsDialog);

                document.querySelector("#btn-buscar-auditoria").addEventListener("click", function() {
                    const estado = document.querySelector("#buscar-auditoria").value;
                    console.log(estado);
                    
                    if (!/^\d+$/.test(estado)) {
                        console.log("El valor contiene solo números.");
                        swal(app.config.title, "El valor contiene datos no numericos", "error");
                        return false;
                    }
        
                    const elements = document.querySelectorAll(".ui-dialog");
                    console.log(elements);
                    let i;
                    for (i = 0; i < elements.length; i++) {
                        elements[i].remove();
                    }
        
                    document.getElementById("loader").style.display = "block";
        
                    const data = {
                        e: estado
                    };
                    axios.post(app.config.server.php1 + "x=auditoria&y=soportePrimeraVezEstado&ts=" + new Date().getTime(), data)
                        .then(function(response){
                            console.log(response.data);
        
                            document.getElementById("loader").style.display = "none";
        
                            const file = app.config.server.path + "server/php/" + response.data[0].file+"?ts="+new Date().getTime();
                            
                            window.open(file, "_blank");
                        })
                        .catch(function(error){
                            console.log(error);
                        }); 
                });
            })
            document.querySelector("#btn-buscar-auditoria-factura").addEventListener("click", function() {
                console.log("btn-buscar-auditoria-factura .click");

                const elements = document.querySelectorAll(".ui-dialog");
                console.log(elements);
                let i;
                for (i = 0; i < elements.length; i++) {
                    elements[i].remove();
                }
                let html = `
                    <div class="text-center">
                        <input id="buscar-auditoria" class="form-control mr-2 outline-0" type="text" placeholder="Reporte por factura" aria-label="Search" autocomplete="off">
                        <button id="btn-buscar-auditoria" class="btn btn-outline-primary mt-3" type="submit">
                            Generar Auditoria Factura
                        </button>
                    </div>
                `;
                const optionsDialog = {
                    height: 200,
                    width: 350,
                    html: html,
                    title: "Reporte de auditoria factura",
                };
                new nataUIDialog(optionsDialog);

                document.querySelector("#btn-buscar-auditoria").addEventListener("click", function() {
                    const factura = document.querySelector("#buscar-auditoria").value;
                    console.log(factura);

                    if(factura.length > 15){
                        console.log("factura no valida.");
                        swal(app.config.title, "factura no valida", "error");
                        return false;
                    }
        
                    const elements = document.querySelectorAll(".ui-dialog");
                    console.log(elements);
                    let i;
                    for (i = 0; i < elements.length; i++) {
                        elements[i].remove();
                    }
        
                    document.getElementById("loader").style.display = "block";
        
                    const data = {
                        f: factura
                    };
                    axios.post(app.config.server.php1 + "x=auditoria&y=soportePrimeraVezFactura&ts=" + new Date().getTime(), data)
                        .then(function(response){
                            console.log(response.data);
        
                            document.getElementById("loader").style.display = "none";
        
                            const file = app.config.server.path + "server/php/" + response.data[0].file;
                            
                            window.open(file, "_blank");
                        })
                        .catch(function(error){
                            console.log(error);
                        }); 
                });
            })


        },
    },
    glosa:{
        options: function () {
            console.log("app.auditoria.glosa.option");

            let html = `
                <div class="text-center">                
                    <button id="btn-buscar-auditoria-estado" class="btn btn-outline-primary mt-3" type="submit">
                        Generar Estado
                    </button>
                    <button id="btn-buscar-auditoria-factura" class="btn btn-outline-primary mt-3" type="submit">
                        Generar Factura
                    </button>
                </div>
            `;
            const optionsDialog = {
                height: 180,
                width: 380,
                html: html,
                title: "Reporte de auditoria glosa",
            };
            new nataUIDialog(optionsDialog);
            
            document.querySelector("#btn-buscar-auditoria-estado").addEventListener("click", function() {
                console.log("btn-buscar-auditoria-estado .click");

                const elements = document.querySelectorAll(".ui-dialog");
                console.log(elements);
                let i;
                for (i = 0; i < elements.length; i++) {
                    elements[i].remove();
                }
                let html = `
                    <div class="text-center">
                        <input id="buscar-auditoria" class="form-control mr-2 outline-0" type="number" placeholder="Reporte por estados" aria-label="Search" autocomplete="off">
                        <button id="btn-buscar-auditoria" class="btn btn-outline-primary mt-3" type="submit">
                            Generar Auditoria Estado
                        </button>
                    </div>
                `;
                const optionsDialog = {
                    height: 200,
                    width: 350,
                    html: html,
                    title: "Reporte de auditoria glosa estado",
                };
                new nataUIDialog(optionsDialog);

                document.querySelector("#btn-buscar-auditoria").addEventListener("click", function() {
                    const estado = document.querySelector("#buscar-auditoria").value;
                    console.log(estado);
                    
                    if (!/^\d+$/.test(estado)) {
                        console.log("El valor contiene solo números.");
                        swal(app.config.title, "El valor contiene datos no numericos", "error");
                        return false;
                    }
        
                    const elements = document.querySelectorAll(".ui-dialog");
                    console.log(elements);
                    let i;
                    for (i = 0; i < elements.length; i++) {
                        elements[i].remove();
                    }
        
                    document.getElementById("loader").style.display = "block";
        
                    const data = {
                        e: estado
                    };
                    axios.post(app.config.server.php1 + "x=auditoria&y=soporteGlosaEstado&ts=" + new Date().getTime(), data)
                        .then(function(response){
                            console.log(response.data);
        
                            document.getElementById("loader").style.display = "none";
        
                            const file = app.config.server.path  + response.data[0].file+"?ts="+new Date().getTime();
                            
                            window.open(file, "_blank");
                        })
                        .catch(function(error){
                            console.log(error);
                        }); 
                });
            })
            document.querySelector("#btn-buscar-auditoria-factura").addEventListener("click", function() {
                console.log("btn-buscar-auditoria-factura .click");

                const elements = document.querySelectorAll(".ui-dialog");
                console.log(elements);
                let i;
                for (i = 0; i < elements.length; i++) {
                    elements[i].remove();
                }
                let html = `
                    <div class="text-center">
                        <input id="buscar-auditoria" class="form-control mr-2 outline-0" type="text" placeholder="Reporte por factura" aria-label="Search" autocomplete="off">
                        <button id="btn-buscar-auditoria" class="btn btn-outline-primary mt-3" type="submit">
                            Generar Auditoria Factura
                        </button>
                    </div>
                `;
                const optionsDialog = {
                    height: 200,
                    width: 350,
                    html: html,
                    title: "Reporte de auditoria glosa factura",
                };
                new nataUIDialog(optionsDialog);

                document.querySelector("#btn-buscar-auditoria").addEventListener("click", function() {
                    const factura = document.querySelector("#buscar-auditoria").value;
                    console.log(factura);

                    if(factura.length > 15){
                        console.log("factura no valida.");
                        swal(app.config.title, "factura no valida", "error");
                        return false;
                    }
        
                    const elements = document.querySelectorAll(".ui-dialog");
                    console.log(elements);
                    let i;
                    for (i = 0; i < elements.length; i++) {
                        elements[i].remove();
                    }
        
                    document.getElementById("loader").style.display = "block";
        
                    const data = {
                        f: factura
                    };

                    axios.post(app.config.server.php1 + "x=auditoria&y=soporteGlosaFactura&ts=" + new Date().getTime(), data)
                        .then(function(response){
                            console.log(response.data);
        
                            document.getElementById("loader").style.display = "none";
        
                            const file = app.config.server.path + response.data[0].file+"?ts="+new Date().getTime();
                            
                            window.open(file, "_blank");
                        })
                        .catch(function(error){
                            console.log(error);
                        }); 
                });
            })
        },
    }
};

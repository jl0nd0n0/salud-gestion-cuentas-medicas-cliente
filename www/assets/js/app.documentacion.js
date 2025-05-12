/* globals app, doT, nata, session, Jets, nataUIDialog, swal */

app.documentacion = {

    wizard: {
        render: function (doc, title) {
            console.log("app.documentacion.wizard.render");

            let page = 0;

            const fxPageRender = function (page, text) {
                if (page == 0) ++page;

                let tag = "[pagina " + page + "]";
                const posInicial = text.indexOf(tag) + tag.length;
                console.log(posInicial);
                tag = "[/pagina " + page + "]";
                const posFinal = text.indexOf(tag) - 1;
                console.log(posFinal);
                console.log("posiciones", posInicial, posFinal);
                console.log(text.substring(posInicial, posFinal));

                let html = `
                    <style>
                        .img-docs {
                            height: 300px;
                        }

                        console {
                            display: block;
                            padding: 10px 20px;
                            background: #0C0C0C;
                            margin-top: 15px;
                            margin-bottom: 15px;
                            border-radius: 5px;
                            color: #BEBEBE;
                        }
                    </style>
                `;
                html += text.substring(posInicial, posFinal);

                // app.core.dialog.removeAll();

                new nataUIDialog({
                    height: 550,
                    width: 670,
                    html: html,
                    title: title,
                    events: {
                        render: function() {
                            let element = document.querySelector(".btn-siguiente");
                            if (element !== null) {
                                element.addEventListener("click", function(event) {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    fxPageRender(++page, text);
                                }, true);
                            }

                            element = document.querySelector(".btn-anterior");
                            if (element !== null) {
                                element.addEventListener("click", function(event) {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    fxPageRender(--page, text);
                                }, true);
                            }

                            element = null;
                        },
                        close: function() {}
                    }
                });

                    
            };

            fetch("docs/" + doc + ".txt")
                .then(response => {
                    if (!response.ok) {
                        swal("Error", "No se pudo cargar el contenido", "error");
                        throw new Error("Fallo en la carga del documento");
                    }
                    return response.text();
                })
                .then(function (text) {
                    console.log(text);
                    fxPageRender(page, text);
                })
                .catch(error => {
                    console.error(error);
            });
        
        },
        render_v1: function (doc, title, dataArray) {
            console.trace("app.documentacion.wizard.render_v1");
        
            let page = 0;
            
            let id = dataArray[0]; 
            let asegurador = dataArray[1];
        
            const fxPageRender = function (page, text, id) {
                if (page == 0) ++page;
        
                let tag = "[pagina " + page + "]";
                console.log(tag);
                const posInicial = text.indexOf(tag) + tag.length;
                tag = "[/pagina " + page + "]";
                const posFinal = text.indexOf(tag) - 1;
        
                let htmlContent = text.substring(posInicial, posFinal);
                
                // Reemplazar las variables interpoladas
                htmlContent = htmlContent.replace(/\$\{id\}/g, JSON.stringify(id));
                htmlContent = htmlContent.replace(/\$\{asegurador\}/g, JSON.stringify(asegurador));
        
                let html = `
                    <style>
                        .img-docs {
                            height: 300px;
                        }
                        console {
                            display: block;
                            padding: 10px 20px;
                            background: #0C0C0C;
                            margin-top: 15px;
                            margin-bottom: 15px;
                            border-radius: 5px;
                            color: #BEBEBE;
                        }
                    </style>
                `;
                html += htmlContent;
        
                app.core.dialog.removeAll();
        
                new nataUIDialog({
                    height: 700,
                    width: 950,
                    html: html,
                    title: title,
                    events: {
                        render: function() {
                            let element = document.querySelector(".btn-siguiente");
                            let elementPlus = document.querySelector(".btn-siguiente-plus");
                            if (element !== null && elementPlus !== null) {
                                element.addEventListener("click", function(event) {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    fxPageRender(++page, text, id);
                                }, true);
        
                                elementPlus.addEventListener("click", function(event) {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    fxPageRender(page+=2, text, id);
                                }, true);
                            }
                            else if(element !== null) {
                                element.addEventListener("click", function(event) {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    fxPageRender(++page, text, id);
                                }, true);
                            }
        
                            // Buscar y ejecutar código dentro de etiquetas <script>
                            const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
                            let match;
                            while ((match = scriptRegex.exec(htmlContent)) !== null) {
                                const scriptContent = match[1];
                                try {
                                    // console.log("Ejecutando script:", scriptContent);
                                    // Crear una nueva función y ejecutarla
                                    new Function(scriptContent)();
                                } catch (error) {
                                    console.error("Error ejecutando el script:", error);
                                }
                            }
                        },
                        close: function() {}
                    }
                });
            };
        
            fetch("docs/" + doc + ".txt")
                .then(response => response.text())
                .then(function (text) {
                    fxPageRender(page, text, id);
                });
        },
        render_v2: function (doc, title, dataArray) {
            console.log("app.documentacion.wizard.render_v2");
        
            let page = 0;
            
            let id = dataArray[0]; 
            let asegurador = dataArray[1];
        
            const fxPageRender = function (page, text, id) {
                if (page == 0) ++page;
        
                let tag = "[pagina " + page + "]";
                // console.log(tag);
                const posInicial = text.indexOf(tag) + tag.length;
                tag = "[/pagina " + page + "]";
                const posFinal = text.indexOf(tag) - 1;
        
                let htmlContent = text.substring(posInicial, posFinal);
                
                // Reemplazar las variables interpoladas
                htmlContent = htmlContent.replace(/\$\{id\}/g, JSON.stringify(id));
                htmlContent = htmlContent.replace(/\$\{asegurador\}/g, JSON.stringify(asegurador));
        
                let html = `
                    <style>
                        .img-docs {
                            height: 300px;
                        }
                        console {
                            display: block;
                            padding: 10px 20px;
                            background: #0C0C0C;
                            margin-top: 15px;
                            margin-bottom: 15px;
                            border-radius: 5px;
                            color: #BEBEBE;
                        }
                    </style>
                `;
                html += htmlContent;

                app.core.dialog.removeAll();
        
                new nataUIDialog({
                    height: 650,
                    width: 850,
                    html: html,
                    title: title,
                    events: {
                        render: function() {
                            let element = document.querySelector(".btn-siguiente");
                            let elementPlus = document.querySelector(".btn-siguiente-plus");
                            if (element !== null && elementPlus !== null) {
                                element.addEventListener("click", function(event) {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    fxPageRender(++page, text, id);
                                }, true);
        
                                elementPlus.addEventListener("click", function(event) {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    fxPageRender(page+=2, text, id);
                                }, true);
                            }
                            else if(element !== null) {
                                element.addEventListener("click", function(event) {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    fxPageRender(++page, text, id);
                                }, true);
                            }
        
                            // Buscar y ejecutar código dentro de etiquetas <script>
                            const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
                            let match;
                            while ((match = scriptRegex.exec(htmlContent)) !== null) {
                                const scriptContent = match[1];
                                try {
                                    // console.log("Ejecutando script:", scriptContent);
                                    // Crear una nueva función y ejecutarla
                                    new Function(scriptContent)();
                                } catch (error) {
                                    console.error("Error ejecutando el script:", error);
                                }
                            }
                        },
                        close: function() {}
                    }
                });
            };
        
            fetch("docs/" + doc + ".txt")
                .then(response => response.text())
                .then(function (text) {
                    fxPageRender(page, text, id);
                });
        },
        adres: function (doc, title) {
            console.log("app.documentacion.wizard.adres");

            let page = 0;

            const fxPageRender = function (page, text) {
                if (page == 0) ++page;

                let tag = "[pagina " + page + "]";
                const posInicial = text.indexOf(tag) + tag.length;
                console.log(posInicial);
                tag = "[/pagina " + page + "]";
                const posFinal = text.indexOf(tag) - 1;
                console.log(posFinal);
                console.log("posiciones", posInicial, posFinal);
                console.log(text.substring(posInicial, posFinal));

                let html = `
                    <style>
                        .img-docs {
                            height: 300px;
                        }

                        console {
                            display: block;
                            padding: 10px 20px;
                            background: #0C0C0C;
                            margin-top: 15px;
                            margin-bottom: 15px;
                            border-radius: 5px;
                            color: #BEBEBE;
                        }
                    </style>
                `;
                html += text.substring(posInicial, posFinal);

                app.core.dialog.removeAll();

                new nataUIDialog({
                    height: 650,
                    width: 850,
                    html: html,
                    title: title,
                    events: {
                        render: function() {
                            let element = document.querySelector(".btn-siguiente");
                            if (element !== null) {
                                element.addEventListener("click", function(event) {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    fxPageRender(++page, text);
                                }, true);
                            }

                            element = document.querySelector(".btn-anterior");
                            if (element !== null) {
                                element.addEventListener("click", function(event) {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    fxPageRender(--page, text);
                                }, true);
                            }

                            element = null;
                        },
                        close: function() {}
                    }
                });

                    
            };

            fetch("docs/" + doc + ".txt")
                .then(response => response.text())
                .then(function (text) {
                    console.log(text);
                    fxPageRender(page, text);
                });
        }
    },
    soportes: {
        descarga: function (data = nata.localStorage.getItem("documentacion-soportes-descargar")) {
            console.trace("%c app.documentacion.soportes.descarga", "background:red;color:white;font-weight:bold;font-size:11px");

            const template = `
                <style>
                    #tableDocumentacionSoportesDescarga {
                        table-layout: fixed;
                        width: 1000px;
                    }
                </style>
                <div class="scroll-y px-1" style="height:${session.height-130}px">
                    <h5>Descarga Soportes Cuenta Médica SOAT</h5>
                    <input id="txtSearch" type="text"
                        class="form-control w-1000 input-search" placeholder="Buscar ..." autocomplete="off">
                    <table id="tableDocumentacionSoportesDescarga"
                        class="table table-sm table-bordered">
                        <colgroup>
                            <col width="100"></col>
                            <col width="350"></col>
                            <col width="250"></col>
                            <col width="150"></col>
                            <col width="150"></col>
                            <col width="150"></col>
                        </colgroup>
                        <tr>
                            <th>Consecutivo</th>
                            <th>Soporte</th>
                            <th>Prefijo soporte (-)</th>
                            <th><b>Hisisis</b></th>
                            <th><b>Hosvital</b></th>
                            <th><b>IndiGo</b></th>
                        </tr>
                        <tbody id="tableDocumentacionSoportesDescarga-body">
                            {{~ it.detail: d:id}}
                            <tr {{?id == 1 || id == 2}}class="bg-blue"{{?}}">
                                <td>
                                    <strong>{{=d.c}}</strong>
                                </td>
                                <td>
                                    <strong>{{=d.s}}</strong>
                                </td>
                                <td>
                                    <small><strong>{{=d.ps}}</strong></small>
                                </td>
                                <td class="text-center">
                                    {{? d.h !== ""}}
                                    <a href="assets/videos/{{=d.h}}" target="_blank">Ver video</a>
                                    {{?}}  {{? id == 1}}(SM){{?}}
                                </td>
                                <td class="text-center">
                                    {{? d.ho !== ""}}
                                    <a href="assets/videos/{{=d.ho}}" target="_blank">Ver video</a>
                                    {{?}} {{? id == 1}}(HFE){{?}}
                                </td>
                                <td class="text-center">
                                    {{? d.i !== ""}}
                                    <a href="assets/videos/{{=d.i}}" target="_blank">Ver video</a>
                                    {{?}} {{? id == 1}}(IND){{?}}
                                </td>
                            </tr>
                            {{~}}
                        </tbody>
                    </table>
            `;
            const html = doT.template(template)({detail: data});
            document.querySelector("#container").innerHTML = html;

            session.jets = new Jets({
                searchTag: "#txtSearch",
                contentTag: "#tableDocumentacionSoportesDescarga-body"
            });
        },
        furips: function (data = nata.localStorage.getItem("documentacion-soportes-descargar")){
            console.trace("%c app.documentacion.soportes.descarga", "background:red;color:white;font-weight:bold;font-size:11px");

            const template = `
                <style>
                    #tableDocumentacionSoportesDescarga {
                        table-layout: fixed;
                        width: 1000px;
                    }
                </style>
                <div class="scroll-y px-1" style="height:${session.height-130}px">
                    <h5>Descarga Soportes FURIPS</h5>
                    <input id="txtSearch" type="text"
                        class="form-control w-1000 input-search" placeholder="Buscar ..." autocomplete="off">
                    <table id="tableDocumentacionSoportesDescarga"
                        class="table table-sm table-bordered">
                        <colgroup>
                            <col width="100"></col>
                            <col width="350"></col>
                            <col width="100"></col>
                            <col width="150"></col>
                            <col width="150"></col>
                            <col width="150"></col>
                        </colgroup>
                        <tr>
                            <th>Consecutivo</th>
                            <th>Soporte</th>
                            <th>prefijo soporte</th>
                            <th><b>Hisisis</b></th>
                            <th><b>Hosvital</b></th>
                            <th><b>IndiGo</b></th>
                        </tr>
                        <tbody id="tableDocumentacionSoportesDescarga-body">
                            {{~ it.detail: d:id}}
                            <tr {{?id == 1 || id == 2}}class="bg-blue"{{?}}">
                                <td>
                                    <strong>{{=d.c}}</strong>
                                </td>
                                <td>
                                    <strong>{{=d.s}}</strong>
                                </td>
                                <td>

                                    <strong> {{=d.ps}}</strong>
                                </td>
                                <td class="text-center">
                                    {{? d.h !== ""}}
                                    <a href="assets/videos/{{=d.h}}" target="_blank">Ver video</a>
                                    {{?}}  {{? id == 1}}(SM){{?}}
                                </td>
                                <td class="text-center">
                                    {{? d.ho !== ""}}
                                    <a href="assets/videos/{{=d.ho}}" target="_blank">Ver video</a>
                                    {{?}} {{? id == 1}}(HFE){{?}}
                                </td>
                                <td class="text-center">
                                    {{? d.i !== ""}}
                                    <a href="assets/videos/{{=d.i}}" target="_blank">Ver video</a>
                                    {{?}} {{? id == 1}}(IND){{?}}
                                </td>
                            </tr>
                            {{~}}
                        </tbody>
                    </table>
            `;
            const html = doT.template(template)({detail: data});
            document.querySelector("#container").innerHTML = html;

            session.jets = new Jets({
                searchTag: "#txtSearch",
                contentTag: "#tableDocumentacionSoportesDescarga-body"
            });
        }
    },
    estadosParalelos: {
        insertar: function (doc, title) {
            console.log("app.documentacion.estadosParalelos.insertar");

            let page = 0;

            const fxPageRender = function (page, text) {
                if (page == 0) ++page;

                let tag = "[pagina " + page + "]";
                const posInicial = text.indexOf(tag) + tag.length;
                console.log(posInicial);
                tag = "[/pagina " + page + "]";
                const posFinal = text.indexOf(tag) - 1;
                console.log(posFinal);
                console.log("posiciones", posInicial, posFinal);
                console.log(text.substring(posInicial, posFinal));

                let html = `
                    <style>
                        .img-docs {
                            height: 300px;
                        }

                        console {
                            display: block;
                            padding: 10px 20px;
                            background: #0C0C0C;
                            margin-top: 15px;
                            margin-bottom: 15px;
                            border-radius: 5px;
                            color: #BEBEBE;
                        }
                    </style>
                `;
                html += text.substring(posInicial, posFinal);

                app.core.dialog.removeAll();

                new nataUIDialog({
                    height: 550,
                    width: 670,
                    html: html,
                    title: title,
                    events: {
                        render: function() {},
                        close: function() {}
                    }
                });

                    
            };

            fetch("docs/" + doc + ".txt")
                .then(response => response.text())
                .then(function (text) {
                    console.log(text);
                    fxPageRender(page, text);
                });
        },
    },
    intranet: {
        liquidacionCobertura: function(doc, title) {
            console.trace("%c app.documentacion.intranet.liquidacionCobertura", "background:red;color:white;font-weight:bold;font-size:11px");

            let page = 0;

            const fxPageRender = function (page, text) {
                if (page == 0) ++page;

                let tag = "[pagina " + page + "]";
                const posInicial = text.indexOf(tag) + tag.length;
                console.log(posInicial);
                tag = "[/pagina " + page + "]";
                const posFinal = text.indexOf(tag) - 1;
                console.log(posFinal);
                console.log("posiciones", posInicial, posFinal);
                console.log(text.substring(posInicial, posFinal));

                let html = `
                    <style>
                        .img-docs {
                            height: 300px;
                        }

                        console {
                            display: block;
                            padding: 10px 20px;
                            background: #0C0C0C;
                            margin-top: 15px;
                            margin-bottom: 15px;
                            border-radius: 5px;
                            color: #BEBEBE;
                        }
                    </style>
                `;
                html += text.substring(posInicial, posFinal);

                app.core.dialog.removeAll();

                new nataUIDialog({
                    height: 550,
                    width: 670,
                    html: html,
                    title: title,
                    events: {
                        render: function() {},
                        close: function() {}
                    }
                });

                    
            };

            fetch("docs/" + doc + ".txt")
                .then(response => response.text())
                .then(function (text) {
                    console.log(text);
                    fxPageRender(page, text);
                });
        },
        prestacionSOAT: function(doc, title) {
            console.trace("%c app.documentacion.intranet.prestacionSOAT", "background:red;color:white;font-weight:bold;font-size:11px");

            let page = 1;

            const fxPageRender = function (page, text) {

                let tag = "[pagina " + page + "]";
                const posInicial = text.indexOf(tag) + tag.length;
                console.log(posInicial);
                tag = "[/pagina " + page + "]";
                const posFinal = text.indexOf(tag) - 1;
                console.log(posFinal);
                console.log("posiciones", posInicial, posFinal);
                console.log(text.substring(posInicial, posFinal));

                let html = `
                    <style>
                        .img-docs {
                            height: 300px;
                        }

                        console {
                            display: block;
                            padding: 10px 20px;
                            background: #0C0C0C;
                            margin-top: 15px;
                            margin-bottom: 15px;
                            border-radius: 5px;
                            color: #BEBEBE;
                        }
                    </style>
                `;
                html += text.substring(posInicial, posFinal);

                app.core.dialog.removeAll();

                new nataUIDialog({
                    height: 550,
                    width: 670,
                    html: html,
                    title: title,
                    events: {
                        render: function() {
                            let element = document.querySelector(".btn-aceptar");
                            if (element !== null) {
                                element.addEventListener("click", function(event) {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    fxPageRender(++page, text);
                                }, true);
                            }

                            element = document.querySelector(".btn-negar");
                            if (element !== null) {
                                element.addEventListener("click", function(event) {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    fxPageRender(page += 2, text);
                                }, true);
                            }

                            element = document.querySelector(".btn-volver-aceptar");
                            if (element !== null) {
                                element.addEventListener("click", function(event) {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    fxPageRender(--page, text);
                                }, true);
                            }

                            element = document.querySelector(".btn-volver-negar");
                            if (element !== null) {
                                element.addEventListener("click", function(event) {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    fxPageRender(page -= 2, text);
                                }, true);
                            }

                            element = null;
                        },
                        close: function() {}
                    }
                });

                    
            };

            fetch("docs/" + doc + ".txt")
                .then(response => response.text())
                .then(function (text) {
                    console.log(text);
                    fxPageRender(page, text);
                });
        }
    }
};

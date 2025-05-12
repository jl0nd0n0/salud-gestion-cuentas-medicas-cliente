/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* globals app, nataUIDialog */

app.asistente = {
    render: function(doc, title){
        console.log("%c app.asistente.render", "background:red;color:#fff;font-size:11px");

        let page = 0;

        const fxPageRender = function (page, text) {
            if (page == 0) ++page;

            let tag = "[pagina " + page + "]";
            const posInicial = text.indexOf(tag) + tag.length;
            tag = "[/pagina " + page + "]";
            const posFinal = text.indexOf(tag) - 1;

            let htmlContent = text.substring(posInicial, posFinal);

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
                console.log(text);
                fxPageRender(page, text);
            });
    },
    auditoria: function(){
        console.log("%c app.asistente.auditoria", "background:red;color:#fff;font-size:11px");

        app.asistente.render('asistente-auditoria', 'Auditoria');
    }
};
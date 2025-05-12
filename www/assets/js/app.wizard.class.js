/* globals axios, app, swal, doT, nataUIDialog */

// eslint-disable-next-line no-unused-vars
class wizard {
    constructor(idEstado) {
        this.idEstado = idEstado;
    }
    
    run(label) {
        if (label.indexOf("radicar-primera-vez") !== -1) {
            // 1. revisar que esten cargados los detalles de factura

            axios.get(app.config.server.php1 + "x=factura&y=detalleValidarCarga&z=" + this.idEstado)
                .then((function (response) {
                    console.log(response.data); 

                    if (response.data.length > 0) {
                        swal("Artemisa Gestión Cartera", "No se han cargado todos los detalles de factura", "error");
                        const mensaje = "Debes cargar todos los detalles de factura";
                        const template = `
                            <div class="w-250px p-10">
                                <ul class="list-group">
                                    {{~ it.detail: d:id}}
                                    <li class="list-group-item">{{=d.f}}</li>
                                    {{~}}
                                </ul>
                            <div>
                            <div class="error">
                                ${mensaje}
                            </div>
                        `;
                        const html = doT.template(template)({detail: response.data});
                        // eslint-disable-next-line no-unused-vars
                        const oDialog = new nataUIDialog({
                            html: html,
                            title: "Facturas sin detalle",
                            events: {
                                render: function () {},
                                close: function () {}
                            }
                        });

                        app.electra.chat(mensaje);
                    }
                    else {
                        app.gestion.soportes.cumplimiento.validar();
                    }

                })).catch((function (error) {
                    console.error(error);
                }));

            // 2. verificar homologación de codigos tecnología o insumo vs soporte

            // 3. enviar a (auditoría) validar cumplimiento soportado de servicio prestado en soportes
        }
    }

}
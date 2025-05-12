/* globals app, axios, swal, doT, nataUIDialog */

app.gestion = {
    soportes: {
        cumplimiento: {
            validar: function () {
                console.log("app.gestion.soportes.cumplimiento.validar");

                axios.get(app.config.server.php1 + "x=factura&y=homologoTecnologiaSoporteValidar&z=" + this.idEstado)
                    .then((function (response) {
                        console.log(response.data); 

                        if (response.data.length > 0) {
                            swal("Artemisa Gestión Cartera", "No se han homologado todos los códigos de tecnologías en salud e insumos facturados con el requisito de soportado de la cuenta", "error");
                            const mensaje = "Debes homologar todos los códigos";
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

                            app.electra.hablar(mensaje);
                        }
                        else {
                            alert("continuar ..");
                        }

                })).catch((function (error) {
                    console.error(error);
                }));
            }
        }
    }
};
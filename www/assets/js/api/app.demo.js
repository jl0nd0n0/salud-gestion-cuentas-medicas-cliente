/* globals app, nataUIDialog, session */

app.demo = {
    christus: {
        sanitasPremium: {
            masiva: {
                carga: function () {
                    console.log("app.demo.christus.sanitasPremium.masiva.carga");
                    const title = "Carga Masiva de Sanitas Premium";

                    let fecha, hora;

                    //#region paso 1 - ingresar fecha recibo masiva
                    session.dialog = new nataUIDialog({
                        height: 300,
                        width: 350,
                        html: `
                            <div class="w-100 text-center">
                                <div class="mb-3 d-inline-block">
                                    <label for="txtFecha" class="form-label">Fecha y Hora de Solicitud</label>
                                    <input id="txtFecha" name="txtFecha"
                                        type="date" class="form-control max-width-240px d-inline-block mb-1"
                                        required autocomplete="off">
                                    <div class="form-text">Fecha en que recibiste la masiva</div>

                                    <input id="txtHora" name="txtHora" type="time" min="08:00" max="18:00"
                                        class="form-control max-width-240px d-inline-block" required autocomplete="off">
                                    <div class="form-text">Hora en que recibiste la masiva</div>
                                </div>
                                <div class="w-100 text-center">
                                    <button id="buttonPaso2" type="button" 
                                        class="btn btn-primary d-inline-block min-width-250px disabled">
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        `,
                        title: title,
                        events: {
                            render: function () {},
                            close: function () {}
                        }
                    });

                    const fxValidarFormulario = function () {
                        fecha = document.querySelector("#txtFecha").value;
                        hora = document.querySelector("#txtHora").value;
                        if (fecha !== "" && hora !== "") {
                            document.querySelector("#buttonPaso2").classList.remove("disabled");
                        }
                        else {
                            document.querySelector("#buttonPaso2").classList.add("disabled");
                        }
                    };

                    document.querySelector("#txtFecha").addEventListener("change", function () {
                        fxValidarFormulario();
                    });

                    document.querySelector("#txtHora").addEventListener("change", function () {
                        fxValidarFormulario();
                    });

                    document.querySelector("#buttonPaso2").addEventListener("click", function () {
                        session.dialog.destroy();
                        session.dialog = new nataUIDialog({
                            html: `
                                <nata-ui-upload 
                                    data-title="${title}"
                                    data-subtitle="temporal-upload-masiva.xlsx"
                                    data-file-types="xlsx"
                                    data-url="${app.config.server.php}upload/demo"
                                    data-etl="etlUploadMasiva"
                                    data-params='
                                        {
                                            "idConvenio": 16,
                                            "codigoServicio": "890101",
                                            "fecha": "${fecha}",
                                            "hora": "${hora}"
                                        }
                                    '>
                                ></nata-ui-upload>
                            `,
                            title: title,
                            events: {
                                render: function () {},
                                close: function () {}
                            }
                        });
                    });
                    //#endregion paso 1 - ingresar fecha recibo masiva
                }
            }
        }
    }
};

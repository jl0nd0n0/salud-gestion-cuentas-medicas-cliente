class form_identificacion {

    constructor(elements = []) {
        this.elements = elements;
    }

    render(title, url, callback, html = "", dialog = {}) {
        console.log("form_identificacion.render");

        document.querySelector("#container").innerHTML = "";
        const self = this;

        const template = `
            <form id="frmIdentificacionConsultar">
                <fieldset>
                    <legend>Identificación Paciente</legend>
                    <div class="mb-2">
                        <label for="selectTipoIdentificacion" class="form-label">
                            Tipo Identificación
                        </label>
                        {{? app.config.dev.mode == true}}
                        <div class="float-end mb-1">
                            <span class="badge text-bg-terciary copy-clipboard">CC</span>
                        </div>
                        {{?}}
                        <select id="selectTipoIdentificacion" class="form-select">
                            <option selected value="">Seleccionar Tipo Identificacion</option>
                            {{~ it.detail: d:id}}
                            <option value="{{=d.i}}">{{=d.n}}</option>
                            {{~}}
                        </select>
                    </div>
                    <div class="mb-2">
                        <label for="txtNumeroIdentificacion" class="form-label ui-input-numerico">Número Identificación</label>
                        {{? app.config.dev.mode == true}}
                        <div class="float-end mb-1">
                            <span class="badge text-bg-terciary copy-clipboard">79500200</span>
                        </div>
                        {{?}}
                        <input id="txtNumeroIdentificacion" class="form-control" type="text" 
                            minlength="5" maxlength="20">
                    </div>
                </fieldset>

                ${html}

                <div class="mb-3 text-center">
                    <!-- buton 01 !-->
                    <button id="buttonContinuar" type="submit" class="btn btn-primary mb-3" disabled>Consultar</button>
                </div>
            </form>
        `;
        oDialog = new nataUIDialog({
            height: dialog.height ? dialog.height: 290,
            width: 425,
            html: doT.template(template)({detail: nata.localStorage.getItem("tipo-identificacion")}),
            title: "Consultar " + title,
            events: {
                render: function () {},
                close: function () {}
            }
        });

        document.querySelector("#selectTipoIdentificacion").addEventListener("change", function () {
            self.validator();
        });

        document.querySelector("#txtNumeroIdentificacion").addEventListener("change", function () {
            self.validator();
        });

        document.querySelector("#frmIdentificacionConsultar").addEventListener("submit", function (event) {
            event.preventDefault();
            event.stopPropagation();

            document.querySelector("#loader").style.display = "block";

            setTimeout(() => {
                const tipoIdentificacion = document.querySelector("#selectTipoIdentificacion").value;
                const numeroIdentificacion = document.querySelector("#txtNumeroIdentificacion").value;

                const dataSend = {};
                if (tipoIdentificacion != "") dataSend.t = tipoIdentificacion;
                if (numeroIdentificacion != "") dataSend.n = numeroIdentificacion;

                
                // pasar a dinamico
                console.log(self.elements);
                if (typeof self.elements !== "undefined") {

                    let i;
                    for (i = 0; i < self.elements.length; i++) {
                        console.log(document.querySelector("#" + self.elements[i].el));
                        if (document.querySelector("#" + self.elements[i].el).value != "") {
                            dataSend[self.elements[i].var] = document.querySelector("#" + self.elements[i].el).value;
                        }
                    }
                    console.log(dataSend);

                    //const idEmpresa = document.querySelector("#txtIDEmpresa").value;
                    //if (idEmpresa != "") dataSend.ie = idEmpresa;
                }
                
                oDialog.destroy();

                session.data = dataSend;
                axios.post(url, dataSend)
                    .then(function (response) {
                        console.log(response.data);

                        if (response.data.length == 0) {
                            swal(app.config.title, "No se ha encontrado información de " + title, "success");
                            document.querySelector("#loader").style.display = "none";
                            return false;
                        }
                        callback(response.data);
                        document.querySelector("#loader").style.display = "none";

                    }).catch(function (error) {
                        console.log(error);
                    });
            }, 1 * 1000);

        }, true);
    }

    validator() {
        console.log("form_identificacion.validator");
        const self = this;

        console.log(document.querySelector("#selectTipoIdentificacion").value.toString().trim().length);
        console.log(document.querySelector("#txtNumeroIdentificacion").value.toString().trim().length);

        // aqui limpiar los controles dinamicos
        if (
                document.querySelector("#selectTipoIdentificacion").value.toString().trim() != ""
                || document.querySelector("#txtNumeroIdentificacion").value.toString().trim() != ""
        ) {
            let i;
            for (i = 0; i < self.elements.length; i++) {
                //console.log(self.elements[i].el);
                document.querySelector("#" + self.elements[i].el).value = "";
            }
        }

        if (
            document.querySelector("#selectTipoIdentificacion").value.toString().trim().length > 0 && 
            document.querySelector("#txtNumeroIdentificacion").value.toString().trim().length > 0
        ) {
            document.querySelector("#buttonContinuar").disabled = false;
        }
        else {
            if (self.elements.length > 0) {
                self.elementsValidate();
            }
            else {
                document.querySelector("#buttonContinuar").disabled = true;
            }
        }
    }

    elementsValidate() {
        console.log("form_identificacion.elementsValidate");
        const self = this;

        console.log(self.elements);
        let i, boolResult = true, contador = 0;
        for (i = 0; i < self.elements.length; i++) {
            if (document.querySelector("#" + self.elements[i].el).value.toString().trim() == "") {
                ++contador;
            }
        }

        if (self.elements.length == contador) {
            document.querySelector("#buttonContinuar").disabled = true;
        }
        else {
            document.querySelector("#buttonContinuar").disabled = false;
        }

    }

}
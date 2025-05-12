/* globals app, $, session, nata, nataUIList, swal */

app.paciente = {

    covid: {

        agenda: {
            show: function () {
                console.log("app.paciente.covid.agenda.show");

            }
        },

        list: async function (callback) {
            console.log("app.paciente.render");
            document.querySelector("#menu").style.display = "none";

            //app.bitacora.register("transferencia tomar", session.idCuenta, session.pedido.idlocal);

            //#region RENDER
            const fxCallback = function (data) {
                const index = "pacientes-covid";
                oDialog = {
                    title: "Pacientes",
                    close: true,
                    //#region buttons
                    /*
					buttons: [
						{
							type: "button",
							class: "button-robot",
							icon: "robot-white.svg",
							click: nata.dev.robot.form.fill
						},
						/*
						{
							type: "dropdown",
							class: "",
							icon: "dots-vertical-white.svg",
							dropdown: [
								{
									id: "buttonDescuentoLotes",
									text: "Descuento Lotes"
								},
								{
									id: "buttonDialogDropdownProductBonificado",
									text: "Bonificados"
								},
								{
									id: "buttonDialogDropdownProductKits",
									text: "Kits"
								},
							]
						},
						{
							type: "button",
							class: "button-pedido-ver",
							color: "warning",
							icon: "table-check-white.svg",
							//click: app.order.confirm
						}
					]
					*/
                    //#endregion buttons
                };

                const oLayout = {};

                const oClusterize = {
                    fieldsFilter: ["1", "2", "3", "4", "6"],
                    templateRender: "templatePaciente-mobile"
                };

                //dialog, config, events = {}, index, data, detail, callbacks = {}
                // TODO: pendiente
                alert("revisar el new nataUIList");
                console.error("revisar el new nataUIList");
                const oList = new nataUIList(oLayout, oDialog, oClusterize, index, data);
                //session.lists["pedido"] = oList;
                oList.render(callback);
            };
            nata.ajax("get", app.config.server.php + "paciente/covidGet/", {}, "json", fxCallback);

        }
    },

    masiva: {

        lote: {
            render: function (convenio) {
                console.log("%c app.paciente.masiva.lote.render: ", "background:orange;color:white;font-weight:bold;font-size:11px");
                session.flujo.push("app.paciente.masiva.lote.render");

                $(".ui-dialog").remove();
                document.getElementById("container-header").style.display = "none";

                session.form.idlocal = undefined;
                sessionStorage.clear();

                // session
                // se usa para testing, robot fill
                sessionStorage.setItem("flujo-masiva-covid", 1);
                sessionStorage.setItem("flujo-forma-carga-paciente", "masiva");

                session.dataset.paciente = {};
                session.dataset.paciente.convenio = {};
                session.dataset.paciente.masiva = {};
                session.dataset.masiva.nombre = convenio;
                nata.sessionStorage.setItem("session-paciente", session.dataset.paciente);

                $("#container").empty();
                $("#containerPaciente").remove();

                // method, url, data, typeResponse, callback, callbackError
                nata.ajax("post", app.config.server.php + "convenio/masivaLoteGet/", { convenio: convenio }, "json", function (data) {
                    console.log(data);
                    if (data.length == 0) {
                        swal("No hay masivas por asignar", "", "success");
                        return false;
                    }

                    const container = document.getElementById("container");
                    container.render("templateMasivaLote", { convenio: convenio, detail: data });
                    container.style.display = "block";
                });
            }
        }

    }
};

//#region eventos
//$(document).on("click", ".patiente-edit", app.paciente.editar);

$(document).on("click", ".button-masiva-agendar-paciente", function () {
    app.flujo.paciente.masiva.agendar(this.dataset);
});

// eventos capturar datos del paciente
$(document).on("change", "input.paciente-primer-nombre", function () {
    session.dataset.paciente.primerNombre = this.value;
    sessionStorage.setItem("paciente-primerNombre", this.value);
});

$(document).on("change", "input.paciente-segundo-nombre", function () {
    session.dataset.paciente.segundoNombre = this.value;
    sessionStorage.setItem("paciente-segundoNombre", this.value);
});

$(document).on("change", "input.paciente-primer-apellido", function () {
    session.dataset.paciente.primerApellido = this.value;
    sessionStorage.setItem("paciente-primerApellido", this.value);
});

$(document).on("change", "input.paciente-segundo-apellido", function () {
    session.dataset.paciente.segundoApellido = this.value;
    sessionStorage.setItem("paciente-segundoApellido", this.value);
});

$(document).on("change", "input.paciente-numero-identificacion", function () {
    session.dataset.paciente.numeroIdentificacion = this.value;
    sessionStorage.setItem("paciente-numeroIdentificacion", this.value);
});

$(document).on("change", "select.paciente-tipo_identificacion", function () {
    console.log("select.paciente-tipo_identificacion.change");
    //alert("select.paciente-tipo_identificacion.change");

    session.dataset.paciente.tipoIdentificacion = $(this).find("option:selected").text();
    sessionStorage.setItem("paciente-tipoIdentificacion-id", this.value);
    sessionStorage.setItem("paciente-tipoIdentificacion-descripcion", $(this).find("option:selected").text());
});

$(document).on("change", "input.paciente-movil-1", function () {
    session.dataset.paciente.movil1 = this.value;
    sessionStorage.setItem("paciente-movil1", this.value);
});

$(document).on("change", "input.paciente-movil-2", function () {
    session.dataset.paciente.movil2 = this.value;
    sessionStorage.setItem("paciente-movil2", this.value);
});

$(document).on("change", "input.paciente-telefono", function () {
    session.dataset.paciente.telefono = this.value;
});
//#endregion eventos
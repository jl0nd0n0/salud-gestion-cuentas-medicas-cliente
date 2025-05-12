/* globals app, session, doT, nata, swal, api, $ */
app.convenio = {

	covid: {

		masiva: {

			render: function (convenio) {
				console.log("**** app.convenio.covid.masiva.render ****");

				$(".ui-dialog").remove();
				$("#container").empty();

				const dialogTimestamp = new Date().getTime();
				session.dialogTimestamp = dialogTimestamp;
				const options = {
					id: dialogTimestamp,
					body: { html: doT.template(document.getElementById("templateConvenioMasiva").innerHTML)() },
					height: 300,
					left: (session.width - 400) / 2,
					title: "Fecha y Hora Solicitud Servicios Masiva",
					top: 50,
					width: 400
				};
				nata.ui.dialog.open(options);

				//buttonMasivaHoraSolicitudEnviar

				const fx = function (value) {
					swal({
						title: "Confirma la fecha y hora de envio de la masiva",
						text: "Hora: " + document.getElementById("txtFechaMasivaSolicitud").value + "\n" + "Hora: " + document.getElementById("txtHoraMasivaSolicitud").value,
						icon: "warning",
						buttons: ["NO, voy a corregirla", "SI, es correcta"],
						dangerMode: true,
					}).then((response) => {
						if (response) {
							session.masivaHoraSolicitud = value;
							
							//#region enviar datos al servidor
							//(method, url, data, typeResponse, callback, callbackError)}

							const json = {
								fecha: document.getElementById("txtFechaMasivaSolicitud").value,
								hora: document.getElementById("txtHoraMasivaSolicitud").value,
								convenio: convenio,
								idlocal: new Date().getTime()
							};
							console.log(json);
							nata.ajax("post", app.config.server.php + "convenio/masivaCrear", json, "json", function (data) {
								session.idConvenio = data[0].i;
								$("#uiDialog-" + session.dialogTimestamp).remove();
								api.upload.excel.pacientes.sanitas.render(convenio);
							});
							//#endregion

						}
					});
				};

				$("#buttonMasivaHoraSolicitudEnviar")
					.off()
					.click(function () {
						fx($("#txtTimeMasivaHoraSolicitud").val());
					});

				$("#txtHoraMasivaSolicitud")
					.off()
					.change(function () {
						console.log("#txtHoraMasivaSolicitud.change");
						console.log(this.value);
						if (this.value == "") return false;
						if (document.getElementById("txtFechaMasivaSolicitud").value == "") return false;

						document.getElementById("buttonMasivaHoraSolicitudEnviar").disabled = false;
						
					});


			}
		}
	}
};
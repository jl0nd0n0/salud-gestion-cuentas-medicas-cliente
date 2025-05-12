/* globals app, nataUIList, session, cums, $, localforage */

app.cums = {
	/*
		events: Los eventos, ej click
		boolSilent: se carga el diálogo sin mostrarse: tecnica avanzada para optimizar el render en listas muy grandes, se carga oculto, luego se muestra

	*/

	detail: {
		render: async function (idOrdenServicio) {
			console.log("%c app.cums.detail.render", "background:red;color:white;font-weight:bold;font-size:12px");

			if (typeof idOrdenServicio == "undefined") {
				alert("No esta llegando el id de la orden de servicio");
				return false;
			}

			const dataMedicamentos = await localforage.getItem("hc-prescripcion-cums");
			console.log(dataMedicamentos);
			document.getElementById("detailMedicamento").render("templateMedicamentosListar", { detail: dataMedicamentos })
			app.core.px.ui.buttonCierre.refresh();

			$("#listMedicamentos textarea.medicamento-px-notas")
				.off()
				.change(async function () {
					console.log("#listMedicamentos textarea.medicamento-px-notas.change");
					const id = this.dataset.id;
					const idOrdenServicio = this.dataset.ios;
					const self = this;

					let dataMedicamentos = await localforage.getItem("hc-prescripcion-cums");
					if (dataMedicamentos === null) return false;
					const json = dataMedicamentos.filter(function (record) {
						return record.ios == idOrdenServicio && record.c == id;
					})[0];
					json.value = self.value;
					json.boolLocal = 1;
					dataMedicamentos = dataMedicamentos.filter(function (record) {
						return record.ios == idOrdenServicio && record.c != id;
					});
					dataMedicamentos.push(json);

					let i;
					for (i = 0; i < dataMedicamentos.length; ++i) {
						dataMedicamentos[i].boolLocal = 1;
					}
					await localforage.setItem("hc-prescripcion-cums", dataMedicamentos);

					app.historiaClinica.core.CUMSCUPS.activarLocal("hc-prescripcion-cups");
				});

			$("#listMedicamentos .button-medicamentos-eliminar")
				.off()
				.click(async function () {
					console.log("#listMedicamentos .button-medicamentos-eliminar.click");
					const id = this.dataset.id;
					const idOrdenServicio = this.dataset.ios;

					let dataMedicamentos = await localforage.getItem("hc-prescripcion-cums");
					if (dataMedicamentos === null) return false;
					dataMedicamentos = dataMedicamentos.filter(function (record) {
						return record.ios == idOrdenServicio && record.c != id;
					});

					let i;
					for (i = 0; i < dataMedicamentos.length; ++i) {
						dataMedicamentos[i].boolLocal = 1;
					}
					await localforage.setItem("hc-prescripcion-cums", dataMedicamentos);


					app.historiaClinica.core.CUMSCUPS.activarLocal("hc-prescripcion-cups");
					app.cums.detail.render(idOrdenServicio);
				});
		}
	},

	index: function () {
		console.log("app.cums.index");
		//#region instancia ui list
		/*
		const callbacks = {
			close: function () {
				console.log("callback.close");
				document.getElementById("buttonMedicamentoAdicionar").disabled = false;
			},
			render: function () {
				if (typeof callback == "function") callback();
			}
		};
		*/
		if (typeof session.lists["cums"] == "undefined") {
			oDialog = {
				buttons: [
					/*{
						type: "datepicker",
						class: "datepicker"
					},
					{
						type: "button",
						class: "button-refresh",
						icon: "sync_white_24dp.svg",
						// color: "warning",
						click: "app.refresh()"
					},
					{
						type: "button",
						class: "button-exit",
						icon: "location-exit-white.svg",
						// color: "warning",
						//click: "app.refresh"
					}*/
				],
				css: {
					display: "none"
				},
				close: true,
				title: "CUMS"
			};
			const oConfig = {
				fieldsFilter: ["c", "d"], // TODO: aqui van los atributos del json si se filtra o busca
				templateRender: "templateCUMS",
				search: true
			};
			const index = "cums";
			const oDetail = {
				template: "templateMedicamentosListar"
			};
			//dialog, config, events = {}, index, data, detail, callbacks = {}
			session.lists["cums"] = new nataUIList(oDialog, oConfig, {}, index, cums, oDetail);
			session.apuntador.list = session.lists["cums"];
		}
		//#endregion instancia ui list
	}
};
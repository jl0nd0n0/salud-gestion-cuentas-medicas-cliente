/* globals app, nataUIList, session, cups, $, localforage */

app.cups = {
	/*
		events: Los eventos, ej click
		boolSilent: se carga el diálogo sin mostrarse: tecnica avanzada para optimizar el render en listas muy grandes, se carga oculto, luego se muestra

	*/

	detail: {
		render: async function (idOrdenServicio) {
			console.log("%c app.cups.detail.render", "background:red;color:white;font-weight:bold;font-size:12px");

			if (typeof idOrdenServicio == "undefined") {
				alert("No esta llegando el id de la orden de servicio");
				return false;
			}

			const dataProcedimientos = await localforage.getItem("hc-prescripcion-cups");
			console.log(dataProcedimientos);
			document.getElementById("detailProcedimiento").render("templateProcedimientosListar", { detail: dataProcedimientos })
			app.core.px.ui.buttonCierre.refresh();

			$("#listProcedimientos input.procedimiento-cantidad")
				.off()
				.change(async function () {
					const id = this.dataset.id;
					const ios = this.dataset.ios;
					const self = this;

					let dataProcedimientos = await localforage.getItem("hc-prescripcion-cups");
					if (dataProcedimientos === null) return false;
					const json = dataProcedimientos.filter(function (record) {
						return record.ios == ios && record.c == id;
					})[0];
					json.value = self.value;
					json.boolLocal = 1;
					dataProcedimientos = dataProcedimientos.filter(function (record) {
						return record.ios == ios && record.c != id;
					});
					dataProcedimientos.push(json);

					let i;
					for (i = 0; i < dataProcedimientos.length; ++i) {
						dataProcedimientos[i].boolLocal = 1;
					}
					await localforage.setItem("hc-prescripcion-cups", dataProcedimientos);

					app.historiaClinica.core.CUMSCUPS.activarLocal("hc-prescripcion-cums");
				});

			$("#listProcedimientos .button-procedimientos-eliminar")
				.off()
				.click(async function () {
					console.log("#listProcedimientos .button-procedimientos-eliminar.click");
					const id = this.dataset.id;
					const ios = this.dataset.ios;

					let dataProcedimientos = await localforage.getItem("hc-prescripcion-cups");
					if (dataProcedimientos === null) return false;
					dataProcedimientos = dataProcedimientos.filter(function (record) {
						return record.ios == ios && record.c != id;
					});

					let i;
					for (i = 0; i < dataProcedimientos.length; ++i) {
						dataProcedimientos[i].boolLocal = 1;
					}

					await localforage.setItem("hc-prescripcion-cups", dataProcedimientos);

					app.historiaClinica.core.CUMSCUPS.activarLocal("hc-prescripcion-cums");
					app.cups.detail.render(ios);
				});
		}
	},

	index: function (idOrdenServicio, callback) {
		//#region cums
		console.log("app.cups.index");
		//#region render ui list
		oDialog = {
			css: {
				display: "none"
			},
			title: "CUPS",
			close: true,
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
			]
		};
		const oConfig = {
			search: true,
			fieldsFilter: ["c", "d"], // TODO: aqui van los atributos del json si se filtra o busca
			templateRender: "templateCUPS"
		};
		const index = "cups";
		const callbacks = {
			close: function () {
				console.log("callback.close");
				document.getElementById("buttonProcedimientoAdicionar").disabled = false;
			},
			render: function () {
				if (typeof callback == "function") callback();
			}
		};
		const oDetail = {
			template: "templateMedicamentosListar"
		};
		//dialog, config, events = {}, index, data, detail, callbacks = {}
		if (typeof session.lists["cups"] !== "object") {
			session.lists["cups"] = new nataUIList(oDialog, oConfig, {}, index, cups, oDetail, callbacks);
			session.apuntador.list = session.lists["cups"];
		}
		//#endregion cums
	}
};
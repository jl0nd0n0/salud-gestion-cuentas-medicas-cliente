/* globals nataUIList, session,dataCie, app, $  */

app.cie10 = {
	dataset: [],

	index: function () {
		console.log("app.cie10.index");
		//#region cie 10
		
		//#region render ui list
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
			title: "CIE 10"
		};
		const oConfig = {
			fieldsFilter: ["c", "d"], // TODO: aqui van los atributos del json si se filtra o busca
			templateRender: "templateCIE",
			search: true
		};
		const index = "cie10";
		const oDetail = {
			template: "templateDiagnosticosListar"
		};
		if (typeof session.lists["cie10"] == "undefined") {
			//dialog, config, events = {}, index, data, detail, callbacks = {}
			session.lists["cie10"] = new nataUIList(oDialog, oConfig, {}, index, dataCie, oDetail);
			session.apuntador.list = session.lists["cie10"];
		}
	}
};

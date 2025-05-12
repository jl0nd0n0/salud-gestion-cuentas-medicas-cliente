/* globals app, session, localforage, Clusterize, nata, nataUIDialog  */

app.cups = {

	index: function () {
		console.log("app.cups.index");
		//const myWorker = new Worker("assets/webworker/ww.cups.js");
		//myWorker.onmessage = function (oEvent) {
		//console.log("Worker said : " + oEvent.data);
		localforage.getItem("webworker-cups").then(function (data) {

			if (typeof app.cups.dialog == "undefined") {
				const html = nata.ui.template.get("templateListClusterizeCUPS", {});
				app.cups.dialog = new nataUIDialog({
					height: "100%",
					html: html,
					width: "100%",
					title: "CUPS",
					close: {
						remove: false
					}
				});

				session.detail["CUPS"].options.dialog = app.cups.dialog;
				console.log(data);
				//document.getElementById("container").innerHTML = data;

				var rows = [],
					search = document.getElementById("searchCUPS");

				rows = data.map(function (record) {
					return {
						values: record.values,
						markup: record.markup,
						active: true
					};
				});

				// Fetch suitable rows
				const filterRows = function (rows) {
					var results = [];
					for (var i = 0, ii = rows.length; i < ii; i++) {
						if (rows[i].active) results.push(rows[i].markup);
					}
					return results;
				};

				// Init clusterize.js
				const clusterize = new Clusterize({
					rows: filterRows(rows),
					scrollId: "scrollAreaCUPS",
					contentId: "listClusterizeCUPS"
				});

				// Multi-column search
				const onSearch = function () {
					for (var i = 0, ii = rows.length; i < ii; i++) {
						var suitable = false;
						for (var j = 0, jj = rows[i].values.length; j < jj; j++) {
							if (rows[i].values[j].toString().toLowerCase().indexOf(search.value.toLowerCase()) + 1)
								suitable = true;
						}
						rows[i].active = suitable;
					}
					clusterize.update(filterRows(rows));
				};
				search.oninput = onSearch;

				session.detail["CUPS"].eventDialogList();
			}
			else {
				app.cups.dialog.show();
			}

		});
	}
};
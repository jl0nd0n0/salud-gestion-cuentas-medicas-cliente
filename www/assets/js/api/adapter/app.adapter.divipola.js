/* global app, divipola, nata */

if (typeof app.adapter == "undefined") {
	app.adapter = {};
}

app.adapter.divipola = {

	helpers: {
		departamentoGet: function () {
			if (app.config.dev.verbose.secundario) console.log("app.adapter.divipola.get");
			
			const data = divipola.map(function (record) {
				return {
					i: record.id,
					d: record.d
				};
			});

			const by = property => function (object) {
				const value = object[property];
				return !(this.has(value) || !this.add(value));
			};

			return nata.fx.json.array.sort(data.filter(by("d"), new Set), "d");
		},

		municipioGet: function (id) {
			if (app.config.dev.verbose.secundario) console.log("app.adapter.divipola.helpers.municipioGet");
			var data = divipola.filter(function (record) {
				return record.id == id;
			});
			data = data.map(function (record) {
				return {
					i: record.im,
					m: record.m
				};
			});
			return nata.fx.json.array.sort(data, "m");
		}
	},

	get: function () {
		if (app.config.dev.verbose.secundario) console.log("app.adapter.divipola.get");
		return app.adapter.divipola.helpers.departamentoGet();
	},

	municipio: {
		get: function (id) {
			if (app.config.dev.verbose.secundario) console.log("app.adapter.divipola.municipio.get");
			return app.adapter.divipola.helpers.municipioGet(id);
		}
	}
};
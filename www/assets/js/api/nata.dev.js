/* globals app, $, session, atenea, swal, nata, TAFFY */
if(typeof nata.dev == "undefined") nata.dev = {};
nata.dev = {

	dataset: {
		// nata.dev.dataset.instances
		instances: 0
	},

	index: function (index) {
		session.flow.push("nata.dev.index");

		const dataDocumento = session.dataset.documentos.filter(function (record) {
			return record.i == index;
		})[0];
		console.log(dataDocumento);

		//#region configure payment
		session.product.name = nata.fx.string.clean(dataDocumento.t);
		session.product.description = dataDocumento.d;
		session.order.amount = dataDocumento.p;
		//#endregion

		session.document = dataDocumento;

		if (!app.session.login.get()) {
			app.session.callback = app.session.document.index;
			//app.session.login.render(false);
			nata.ui.login.render();
		}
		else {
			app.session.document.index();
		}
	},

	// nata.dev.openWindow
	openWindow: function (width, height, url) {
		console.log("nata.dev.openWindow");

		return new Promise(function (resolve, reject) {
			var vheight = "900";
			if (typeof height != "undefined") {
				vheight = height;
			}

			//var vURL = "http://localhost:8090/index.html";
			var vURL = "https://minerva.crescend.software/index.html";
			if (typeof url != "undefined") {
				vURL = url;
			}

			setTimeout(function () {
				const myWindow = window.open(vURL, "window" + nata.dev.dataset.instances++, "Height = " + vheight + ", width = " + width + ", estado = si, toolbar = si, menubar = si, location = no, top = " + (nata.dev.dataset.instances * 2) + ", left = " + (nata.dev.dataset.instances * 5));
				//const myWindow = window.open ("http://localhost:3000", "window" + nata.dev.dataset.instances++, "Height = 900, width = " + width + ", estado = si, toolbar = si, menubar = si, location = no, top = " + (nata.dev.dataset.instances*5) + ", left = " + (nata.dev.dataset.instances*3));
				//myWindow.opener.document.title = size;
				//alert(myWindow.opener.document.title);
			}, 1 * 1000);
			resolve();
		});
	},

	responsive: {

		mobile: function (url) {
			console.log("nata.dev.responsive.mobile");
			nata.dev.openWindow(320, undefined, url)
				.then(() => nata.dev.openWindow(340, undefined, url))
				.then(() => nata.dev.openWindow(340, undefined, url))
				.then(() => nata.dev.openWindow(360, undefined, url))
				.then(() => nata.dev.openWindow(375, undefined, url))
				.then(() => nata.dev.openWindow(480, undefined, url))
				.then(() => nata.dev.openWindow(575, undefined, url))
				.then(() => nata.dev.openWindow(768, undefined, url));
		},

		laptop: function (url) {
			console.log("nata.dev.responsive.laptop");
			nata.dev.openWindow(800, undefined, url)
				.then(() => nata.dev.openWindow(991, undefined, url))
				.then(() => nata.dev.openWindow(1024, undefined, url))
				.then(() => nata.dev.openWindow(1200, undefined, url))
				.then(() => nata.dev.openWindow(1366, undefined, url))
				.then(() => nata.dev.openWindow(1440, undefined, url))
				.then(() => nata.dev.openWindow(1680, undefined, url))
				.then(() => nata.dev.openWindow(1920, undefined, url));
		}
	},

	robot: {

		api: {
			// nata.dev.robot.api.accountCreate
			accountCreate: function () {
				const robot = nata.dev.robot;

				// remove user session data
				localStorage.removeItem("user");
				app.session.index();

				const elEmail = document.getElementById("txtEmailLogin");
				elEmail.value = "prueba@prueba.com";
				const event = new Event("change");
				elEmail.dispatchEvent(event);
				document.getElementById("txtPasswordLogin").value = "1111111111";

				nata.ui.form.v1.api.validate();

				setTimeout(function () {

					robot.helper.click(document.getElementById("buttonFormSubmit"));

					setTimeout(function () {
						robot.helper.click(document.getElementById("buttonAccountCreate"));

						document.getElementById("txtPrimerNombreAccount").value = "Pedro";
						document.getElementById("txtPrimerApellidoAccount").value = "Navaja";
						document.getElementById("txtMovilAccount").value = "3057075510";
						document.getElementById("txtMovilAccount").value = "3057075510";
						document.getElementById("tarAddress").value = "Calle Luna Calle Sol";
						document.getElementById("txtPasswordAccount").value = "1111111111";
						document.getElementById("txtPasswordValidarAccount").value = "1111111112";
						document.getElementById("selDepartamento").value = "91";

						setTimeout(function () {
							$("#selDepartamento").trigger("change");

							setTimeout(function () {
								document.getElementById("selMunicipio").value = "91405";
							}, nata.dev.robot.config.time * 1000);

						}, nata.dev.robot.config.time * 1000);

						//nata.ui.form.v1.api.validate();

					}, nata.dev.robot.config.time * 1000);

				}, nata.dev.robot.config.time * 1000);

			},

			script: {
				generate: function () {
					// nata.dev.robot.api.script.generate
					var i, row;
					if (session.robot.script.length == 0) {
						session.robot.script = nata.localStorage.getItem("robot-script");
					}

					for (i = 0; i < session.robot.script.length; ++i) {
						row = session.robot.script[i];
						console.log(row.ip + ";" + row.id + ";" + row.type + ";" + row.value);
					}
				}
			}
		},

		config: {
			// nata.dev.robot.config.time
			time: 0.5
		},

		//nata.dev.robot.form
		form: {
			/*
			test: function (data) {
				console.log("nata.dev.robot.form.test");
				const elForm = document.getElementById(data.id);
				const form = data.fields;
				var i;
				for (i=0; i<=form.length;++i) {
					console.log(form[i]);
				}
			}
			*/

			//nata.dev.robot.form.fill
			fill: async function () {
				console.log("nata.dev.robot.form.fill");

				if (typeof session.form.id == "undefined") {
					alert("NO hay un formulario activo, carguelo por favor");
					document.getElementById("loader").style.display = "none";
					return false;
				}


				if (typeof session.form.section == "undefined") {
					alert("NO hay seccion activa");
					document.getElementById("loader").style.display = "none";
					return false;
				}

				const data = [
					//#region form 1
					{
						if: 1,
						section: 1,
						values: [
							{
								i: 1,
								value: "Hector"
							},
							{
								i: 2,
								value: "Hernán"
							},
							{
								i: 3,
								value: "Rubiano"
							},
							{
								i: 4,
								value: "López"
							},
							{
								i: 5,
								value: "1"
							},
							{
								i: 6,
								value: "79500200"
							},
							{
								i: 7,
								value: "1992-02-28"
							},
							{
								i: 8,
								d: "11",
								m: "11001"
							},
							{
								i: 9,
								value: "1"
							},
							{
								i: 10,
								value: "1"
							},
							{
								i: 11,
								value: "1"
							},
							{
								i: 12,
								value: "Ingeniero de Sistemas"
							},
							{
								i: 13,
								value: "hector.rubiano@crescend.software"
							},
							{
								i: 14,
								value: "1"
							},
							{
								i: 15,
								value: "0"
							}
						]
					},
					{
						if: 1,
						section: 2,
						values: [
							{
								i: 16,
								value: 1
							},
							{
								i: 17,
								value: "52255000"
							},
							{
								i: 18,
								value: "Pepa Pig"
							},
							{
								i: 19,
								value: "3124578111"
							},
							{
								i: 20,
								value: "18710525"
							},
							{
								i: 21,
								value: "Hermana"
							},
							/*
							{
								i: 22,
								value: 2
							},
							{
								i: 23,
								value: "1020304050"
							},
							{
								i: 24,
								value: "Pedro Navaja"
							},
							{
								i: 25,
								value: "3005525878"
							},
							{
								i: 26,
								value: "18789899"
							},
							{
								i: 27,
								value: "Hermano"
							}
							*/
						]
					},
					{
						if: 1,
						section: 3,
						values: [
							{
								i: 28,
								value: "Carrera 7 # 123-46"
							},
							{
								i: 29,
								d: "11",
								m: "11001"
							},
							{
								i: 30,
								value: "3103212142"
							},
							{
								i: 31,
								value: "13841730"
							},
							{
								i: 32,
								value: "Usaquén"
							},
							{
								i: 33,
								value: "1"
							},
							{
								i: 34,
								value: "1"
							}
						]
					},
					{
						if: 1,
						section: 4,
						values: [
							{
								i: 35,
								value: "1"
							},
							{
								i: 36,
								value: "1"
							},
							{
								i: 37,
								value: "1"
							},
							{
								i: 38,
								value: "1"
							},
							{
								i: 39,
								value: "1"
							},
							{
								i: 40,
								value: "1"
							},
							{
								i: 41,
								value: "1"
							}
						]
					},
					//#endregion form 1

					//#region form 90
					// form 90 - section 1
					{
						if: 90,
						section: 1,
						masiva: 0,
						values: [
							{
								i: 3,
								value: "Tos"
							},
							{
								i: 4,
								value: "Motivo ingreso a programa"
							},
							{
								i: 5,
								value: "Posible contagio de COVID"
							},
							{
								i: 6,
								value: "Sintomas de COVID"
							},
							{
								i: 7,
								value: "Ninguno"
							},
							{
								i: 8,
								value: "Ninguno"
							},
							{
								i: 9,
								value: "Ninguno"
							},
							{
								i: 10,
								value: "Ninguno"
							},
							{
								i: 11,
								value: "Qué es revisión por sistemas ..."
							},
							{
								i: 12,
								value: "Qué es revisión por sistemas ..."
							},
							{
								i: 13,
								value: "Qué es lateralidad ..."
							}
						]
					},

					// form 91 - section 1
					{
						if: 91,
						section: 1,
						masiva: 0,
						values: [
							{
								i: 1,
								value: "Jhon Doe"
							},
							{
								i: 2,
								value: "18710432"
							},
							{
								i: 3,
								value: "3012142128"
							},
							{
								i: 4,
								value: "Carrera 7 # 123-46"
							},
							{
								i: 5,
								value: "Hermano"
							}
						]
					},

					// form 92 - section 1
					{
						if: 92,
						section: 1,
						masiva: 0,
						values: [
							{
								i: 1,
								value: "Indicaciones ..."
							},
							{
								i: 2,
								value: {
									s: 119,
									d: 79
								}
							},
							{
								i: 3,
								value: "121"
							},
							{
								i: 4,
								value: "90"
							},
							{
								i: 5,
								value: "45"
							},
							{
								i: 6,
								value: "50"
							},
							{
								i: 7,
								value: "135"
							},
							{
								i: 9,
								value: {
									m: 1,
									c: 80
								}
							},
							{
								i: 10,
								value: "103"
							}
						]
					},
					{
						if: 2,
						section: 6,
						values: [
							{
								i: 27,
								value: "descripción general"
							},
							{
								i: 28,
								value: "cabeza y cuello"
							},
							{
								i: 29,
								value: "cardiopulmonar"
							},
							{
								i: 30,
								value: "abdomen"
							},
							{
								i: 31,
								value: "genitourinario"
							},
							{
								i: 32,
								value: "extremidades"
							},
							{
								i: 33,
								value: "sistema nervioso central"
							}
						]
					},
					{
						if: 2,
						section: 7,
						values: [
							{
								i: 34,
								value: "complicaciones"
							},
							{
								i: 35,
								value: "accidentes"
							},
							{
								i: 36,
								value: "eventos adversos"
							},
							{
								i: 37,
								value: "Análisis de estudio diagnósticos"
							},
							{
								i: 38,
								value: "Análisis de laboratorios clínicos"
							},
							{
								i: 39,
								value: "Análisis"
							},
							{
								i: 40,
								value: "sistema nervioso central"
							},
							{
								i: 41,
								value: "Diagnóstico"
							},
							{
								i: 42,
								value: "1"
							}

						]
					},

					// form 93 - section 1
					{
						if: 93,
						section: 1,
						masiva: 0,
						values: [
							{
								i: 1,
								value: "Descripción General"
							},
							{
								i: 2,
								value: "Cabeza y cuello"
							},
							{
								i: 3,
								value: "Cardiopulmonar"
							},
							{
								i: 4,
								value: "Abdomen"
							},
							{
								i: 5,
								value: "Genitourinario"
							},
							{
								i: 6,
								value: "Extremidades"
							},
							{
								i: 7,
								value: "Sistema nervioso central"
							}
						]
					},

					// form 94 - section 9
					{
						if: 94,
						section: 1,
						masiva: 0,
						values: [
							{
								i: 1,
								value: "Complicaciones"
							},
							{
								i: 2,
								value: "Accidentes"
							},
							{
								i: 3,
								value: "Eventos adversos"
							},
							{
								i: 4,
								value: "Análisis de estudios diagnósticos"
							},
							{
								i: 5,
								value: "Análisis de laboratorios clínicos"
							},
							{
								i: 6,
								value: "Análisis"
							}

						]
					},

					// form 95 - section 1
					{
						if: 95,
						section: 1,
						masiva: 0,
						values: [
							{
								i: 1,
								value: "Plan testing"
							},
							{
								i: 2,
								value: "1"
							},
							{
								i: 3,
								value: "1"
							},
							{
								i: 4,
								value: "Condiciones generales al momento del egreso"
							}
						]
					},

					//#endregion form 2

					//#region formulario: 3
					{
						if: 3,
						section: 1,
						masiva: 0,
						values: [
							{
								i: 1,
								value: "Hector Hernán Rubiano López"
							},
							{
								i: 3,
								value: "Hector"
							},
							{
								i: 4,
								value: "Hernán"
							},
							{
								i: 5,
								value: "Rubiano"
							},
							{
								i: 6,
								value: "López"
							},
							{
								i: 7,
								value: "1"
							},
							{
								i: 8,
								value: "79500200"
							},
							{
								i: 9,
								value: "1992-02-28"
							},
							{
								i: 10,
								d: "11",
								m: "11001"
							},
							{
								i: 11,
								value: "1"
							},
							{
								i: 12,
								value: "1"
							},
							{
								i: 13,
								value: "1"
							},
							{
								i: 14,
								value: "Ingeniero de Sistemas"
							},
							{
								i: 15,
								value: "hector.rubiano@crescend.software"
							},
							{
								i: 16,
								value: "1"
							},
							{
								i: 17,
								value: "0"
							}
						]
					},
					{
						if: 3,
						section: 2,
						values: [
							{
								i: 18,
								value: "Carrera 7 # 123-46"
							},
							{
								i: 19,
								d: "11",
								m: "11001"
							},
							{
								i: 20,
								value: "3103212142"
							},
							{
								i: 21,
								value: "3052303947"
							},
							{
								i: 22,
								value: "13841730"
							},
							{
								i: 24,
								value: "19"
							},
							{
								i: 25,
								value: "Usaquén"
							},
							{
								i: 26,
								value: "4"
							}
						]
					},
					{
						if: 3,
						section: 3,
						values: [
							{
								i: 27,
								value: "1"
							},
							{
								i: 28,
								value: "1"
							},
							{
								i: 29,
								value: nata.fx.date.format.getISO(new Date())
							},
							{
								i: 30,
								value: "14:30"
							}
						]
					},
					{
						if: 3,
						section: 4,
						values: [
							{
								i: 35,
								value: "1"
							},
							{
								i: 36,
								value: "1"
							},
							{
								i: 37,
								value: "1"
							},
							{
								i: 38,
								value: "1"
							},
							{
								i: 39,
								value: "1"
							},
							{
								i: 40,
								value: "1"
							},
							{
								i: 41,
								value: "1"
							}
						]
					},
					//#endregion formulario 3

					//#region formulario: 4
					{
						if: 4,
						section: 1,
						masiva: 1,
						values: [
							{
								i: 7,
								value: "1992-02-28"
							},
							{
								i: 8,
								d: "11",
								m: "11001"
							},
							{
								i: 9,
								value: "2"
							},
							{
								i: 13,
								value: "soporte@crescend.software"
							}
						]
					},
					{
						if: 4,
						section: 1,
						masiva: 0,
						values: [
							{
								i: 1,
								value: "Hector"
							},
							{
								i: 2,
								value: "Hernán"
							},
							{
								i: 3,
								value: "Rubiano"
							},
							{
								i: 4,
								value: "López"
							},
							{
								i: 5,
								value: "1"
							},
							{
								i: 6,
								value: "79500200"
							},
							{
								i: 7,
								value: "1992-02-28"
							},
							{
								i: 8,
								d: "11",
								m: "11001"
							},
							{
								i: 9,
								value: "1"
							},
							{
								i: 10,
								value: "1"
							},
							{
								i: 11,
								value: "1"
							},
							{
								i: 12,
								value: "Ingeniero de Sistemas"
							},
							{
								i: 13,
								value: "hector.rubiano@crescend.software"
							},
							{
								i: 14,
								value: "1"
							},
							{
								i: 15,
								value: "0"
							}
						]
					},
					// section 2
					{
						if: 4,
						section: 2,
						masiva: 0,
						values: [
							{
								i: 16,
								value: "Carrera 7 # 123-46"
							},
							{
								i: 17,
								d: "11",
								m: "11001"
							},
							{
								i: 18,
								value: "3050000000"
							},
							{
								i: 22,
								value: "19"
							},
							{
								i: 23,
								value: "Santa Barbara"
							}
						]
					},
					{
						if: 4,
						section: 2,
						masiva: 1,
						values: [
							{
								i: 16,
								value: "Carrera 7 # 123-46"
							},
							{
								i: 17,
								d: "11",
								m: "11001"
							},
							/*
							{
								i: 20,
								value: "3103212142"
							},
							{
								i: 21,
								value: "3052303947"
							},
							*/
							{
								i: 22,
								value: "19"
							},
							{
								i: 23,
								value: "Santa Barbara"
							},
							/*
							{
								i: 22,
								value: "13841730"
							},
							{
								i: 24,
								value: "19"
							},
							{
								i: 25,
								value: "Usaquén"
							},
							{
								i: 26,
								value: "4"
							}
							*/
						]
					},
					{
						if: 4,
						section: 3,
						values: [
							{
								i: 27,
								value: "1"
							},
							{
								i: 28,
								value: "1"
							},
							{
								i: 29,
								value: nata.fx.date.format.getISO(new Date())
							},
							{
								i: 30,
								value: "14:30"
							}
						]
					},
					{
						if: 4,
						section: 4,
						values: [
							{
								i: 35,
								value: "1"
							},
							{
								i: 36,
								value: "1"
							},
							{
								i: 37,
								value: "1"
							},
							{
								i: 38,
								value: "1"
							},
							{
								i: 39,
								value: "1"
							},
							{
								i: 40,
								value: "1"
							},
							{
								i: 41,
								value: "1"
							}
						]
					},
					//#endregion formulario 4

					//#region formulario: 5
					{
						if: 5,
						section: 1,
						masiva: 0,
						values: [
							{
								i: 1,
								value: "Jhon"
							},
							{
								i: 2,
								value: ""
							},
							{
								i: 3,
								value: "Doe"
							},
							{
								i: 4,
								value: ""
							},
							{
								i: 5,
								value: 1
							},
							/*
							{
								i: 6,
								value: "79500210"
							},
							*/
							{
								i: 7,
								value: "3000000000"
							}
						]
					},
					//#endregion formulario 5

					{
						if: 101,
						section: 1,
						masiva: 0,
						values: [
							{
								i: 1,
								value: "Indicaciones ..."
							},
							{
								i: 2,
								value: {
									s: 119,
									d: 79
								}
							},
							{
								i: 3,
								value: "121"
							},
							{
								i: 4,
								value: "90"
							},
							{
								i: 5,
								value: "45"
							},
							{
								i: 6,
								value: "50"
							},
							{
								i: 7,
								value: "135"
							},
							{
								i: 9,
								value: {
									m: 1,
									c: 80
								}
							},
							{
								i: 10,
								value: "103"
							}
						]
					},
				];

				if (sessionStorage.getItem("flujo-masiva-covid") === null) sessionStorage.setItem("flujo-masiva-covid", 0);

				let temporal;
				if (sessionStorage.getItem("flujo-masiva-covid") == 1) {
					temporal = data.filter(function (record) {
						return record.if == session.form.id
							&& record.section == session.form.section
							&& record.masiva == 1;
					});
					console.log(temporal);
					temporal = temporal[0].values;
				}
				else {
					temporal = data.filter(function (record) {
						return record.if == session.form.id
							&& record.section == session.form.section
							&& record.masiva == 0;
					});
					console.log(temporal);
					temporal = temporal[0].values;
				}

				let questions = nata.localStorage.getItem("form-" + session.form.id);
				console.log(questions);
				questions = questions.filter(function (record) {
					return record.is == session.form.section;
				});
				//console.log(questions);

				let i, value, tempo;
				for (i = 0; i < questions.length; ++i) {
					//console.log(questions[i]);

					if (questions[i].tr == "altura") {
						tempo = temporal.filter(function (record) {
							return record.i == questions[i].c;
						})[0];

						const value = {
							m: tempo.value.m,
							c: tempo.value.c
						};
						//console.log(value);
						nata.dev.robot.helper.control.fill(questions[i], value);
					}
					else if (questions[i].tr == "tension-arterial") {
						tempo = temporal.filter(function (record) {
							return record.i == questions[i].c;
						})[0];

						const value = {
							s: tempo.value.s,
							d: tempo.value.d
						};
						//console.log(value);
						nata.dev.robot.helper.control.fill(questions[i], value);
					}
					else if (questions[i].tr == "divipola") {
						tempo = temporal.filter(function (record) {
							return record.i == questions[i].c;
						})[0];
						console.log(tempo);

						//console.log(questions[i].c);
						/*console.log(temporal.filter(function (record) {
							return record.i == questions[i].c;
						}));*/
						const value = {
							d: temporal.filter(function (record) {
								return record.i == questions[i].c;
							})[0].d,
							m: temporal.filter(function (record) {
								return record.i == questions[i].c;
							})[0].m
						};
						//console.log(value);
						nata.dev.robot.helper.control.fill(questions[i], value);
					}
					else {
						if (typeof temporal.filter(function (record) {
							return record.i == questions[i].c;
						})[0] !== "undefined") {
							value = temporal.filter(function (record) {
								return record.i == questions[i].c;
							})[0].value;
							nata.dev.robot.helper.control.fill(questions[i], value);
						}
					}

				}

				if (app.form.validate()) {
					if (typeof app.form.events.formValid == "function") {
						//app.form.events.formValid();
					}
				}

				$("input.paciente-primer-nombre, input.paciente-segundo-nombre, input.paciente-primer-apellido, input.paciente-segundo-apellido").trigger("change");
				$("input.paciente-numero-identificacion, select.paciente-tipo_identificacion, input.paciente-movil-1, input.paciente-movil-2, input.paciente-telefono").trigger("change");

				// TODO: hay que reorganizar el robot, ahora mismo por tiempo no lo hago JL
				if (session.form.id >= 90) {
					return false;
				}

				// TODO: TODO ESTO ESTA AFECTANDO AL ROBOT, HAY QUE PERFILARLO
				const tiempoLargo = 1;
				$("#buttonNext").trigger("click");
				setTimeout(() => {
					$("#selectConvenio")
						.val("1")
						.trigger("change");

					setTimeout(() => {

						$("#buttonServicioSeleccionar").trigger("click");

						setTimeout(() => {

							$("#listConvenioServicio-1006531").trigger("click");

							setTimeout(() => {
								const date = new Date();
								const currentDate = date.toISOString().substring(0, 10);

								$("#txtFechaPacienteSolicitud")
									.val(currentDate)
									.trigger("change");

								$("#txtHoraPacienteSolicitud")
									.val(date.toISOString().substring(11, 16))
									.trigger("change");

								setTimeout(() => {
									$("#buttonPacienteCrear").trigger("click");

									setTimeout(() => {
										$("#control-7")
											.val("1970-06-18")
											.trigger("change");

										setTimeout(() => {
											$("#selectDepartamento-8")
												.val("11")
												.trigger("change");

											setTimeout(() => {
												$("#selectMunicipio-8")
													.val("11001")
													.trigger("change");

												setTimeout(() => {

													setTimeout(() => {
														$("#control-9")
															.val("1")
															.trigger("change");

														setTimeout(() => {
															$("#control-13")
																.val("jorge.londono@crescend.software")
																.trigger("change");

															setTimeout(() => {
																$("#buttonNext")
																	.trigger("click");

																setTimeout(() => {
																	$("#control-16")
																		.val("La palma 2010")
																		.trigger("change");

																	setTimeout(() => {
																		$("#selectDepartamento-17")
																			.val("11")
																			.trigger("change");

																		setTimeout(() => {
																			$("#selectMunicipio-17")
																				.val("11001")
																				.trigger("change");

																			setTimeout(() => {
																				$("#control-22")
																					.val("1")
																					.trigger("change");

																				setTimeout(() => {
																					$("#control-23")
																						.val("San Pelayo")
																						.trigger("change");

																					setTimeout(() => {
																						$("#buttonNext")
																							.trigger("click");

																					}, tiempoLargo * 1000);

																				}, tiempoLargo * 1000);

																			}, tiempoLargo * 1000);

																		}, tiempoLargo * 1000);

																	}, tiempoLargo * 1000);

																}, tiempoLargo * 1000);

															}, tiempoLargo * 1000);

														}, tiempoLargo * 1000);

													}, tiempoLargo * 1000);

												}, tiempoLargo * 1000);

											}, tiempoLargo * 1000);

										}, tiempoLargo * 1000);


									}, tiempoLargo * 1000);

								}, tiempoLargo * 1000);

							}, tiempoLargo * 1000);

						}, tiempoLargo * 1000);

					}, 0.5 * 1000);

				}, 0.4 * 1000);

			}
		},

		helper: {

			control: {
				//nata.dev.robot.helper.control.fill
				fill: async function (question, value) {
					//console.log("nata.dev.robot.helper.fill");
					//console.log(question);

					const type = question.tr;
					//console.log(question.c);
					const element = document.querySelector("#control-" + question.c);

					//console.log(element);
					if (type == "altura") {
						const elemento1 = document.querySelector("#control-" + question.c + "-1");
						const elemento2 = document.querySelector("#control-" + question.c + "-2");
						elemento1.value = "" + value.m.toString().trim();
						elemento2.value = "" + value.c.toString().trim();
						elemento1.dispatchEvent(new Event("change"));
						elemento2.dispatchEvent(new Event("change"));
					}
					else if (type == "tension-arterial") {
						const elemento1 = document.querySelector("#control-" + question.c + "-1");
						const elemento2 = document.querySelector("#control-" + question.c + "-2");
						elemento1.value = "" + value.s.toString().trim();
						elemento2.value = "" + value.d.toString().trim();
						elemento1.dispatchEvent(new Event("change"));
						elemento2.dispatchEvent(new Event("change"));
					}
					else if (type == "texto" || type == "textarea" || type == "numerico" || type == "date" || type == "time") {
						//console.log(element);
						if (element !== null) {
							element.value = "" + value.toString().trim();
							//console.log(question);
							element.dispatchEvent(new Event("change"));

							if (element.classList.contains("paciente-numero-identificacion")) {
								console.log(session.paciente);
								if (typeof session.paciente == "undefined") session.paciente = {};
								//alert(value);
								session.paciente.numeroIdentificacion = value;
								//alert(session.paciente.numeroIdentificacion);
							}
						}
					}

					else if (type == "desplegable") {
						element.value = value.toString().trim();
						element.dispatchEvent(new Event("change"));
					}

					else if (type == "divipola") {
						const elDepartamento = document.querySelector("#selectDepartamento-" + question.c);
						elDepartamento.value = value.d.toString().trim();
						elDepartamento.dispatchEvent(new Event("change"));

						setTimeout(function () {
							const elMunicipio = document.querySelector("#selectMunicipio-" + question.c);
							elMunicipio.value = value.m.toString().trim();
							elMunicipio.dispatchEvent(new Event("change"));
						}, 0.5 * 1000);

					}
					/*
					else if (type == "date") {
						//console.log(element, value);
						//element.value = value;
						element.click();
						await new Promise(r => setTimeout(r, 1 * 1000));
						//element.setDate(value, true);
						//session.guardar(new Date(), element, session.dataset.apuntador.documento.is, ip, undefined);
						await new Promise(r => setTimeout(r, 1 * 1000));
					}
					*/
					else if (type == "next") {
						//await new Promise(r => setTimeout(r, 1.5 * 1000));
						var contador = 0;
						do {
							console.log("disabled ...");
							++contador;
							if (contador >= 5000) {
								break;
							}
						}
						while (document.getElementById("buttonPrevious").disabled);
						document.getElementById("buttonNext").click();
					}

					else if (type == "next-dialog") {
						await new Promise(r => setTimeout(r, 1 * 1000));
						document.getElementById("buttonDialogAceptar").click();
						await new Promise(r => setTimeout(r, 1 * 1000));
					}
					else if (type == "click") {
						element.click();
						await new Promise(r => setTimeout(r, 1 * 1000));
					}
					else if (type == "focus") {
						element.focus();
						//await new Promise(r => setTimeout(r, 1 * 1000));
					}
					else if (type == "scroll-dialog") {
						const objDiv = document.getElementById("ui-dialog");
						objDiv.scrollTo({ top: objDiv.scrollHeight, behavior: "smooth" });
					}
				}
			},

			scroll: function (element) {
				$("html, body").animate({
					scrollTop: $(element).offset().top
				}, 2000);
			}
		}
	},

	// nata.dev.test
	testing: function (rama) {
		//alert(rama);
		const tiempoLargo = 1.5;

		sessionStorage.clear();
		if (rama == 1) {

			//titulo, settings, template, data, blnDialogosRemover
			//app.core.dialogo.render("Paciente no efectivo", {}, "templatePacienteNoEfectivo", {}, false);
			swal({
				title: "Asegurese de eliminar el paciente",
				text: "Identificación: 79500200",
				icon: "warning",
				buttons: ["CANCELAR", "Eliminado, continuar"],
				dangerMode: true,
			}).then((response) => {
				if (response) {
					document.getElementById("loader").style.display = "block";
					app.flujo.paciente.buscar.render();

					setTimeout(function () {
						$("#txtIdentificacion").val("79500200");

						setTimeout(function () {
							$("#frmPacienteConsultar").trigger("submit");

							setTimeout(function () {
								nata.dev.robot.form.fill();

								setTimeout(function () {
									$("#buttonPacienteConsultarSiguiente").trigger("click");

									setTimeout(function () {

										$("#selectConvenio")
											.val(1)
											.trigger("change");

										setTimeout(function () {
											$("#buttonServicioSeleccionar").trigger("click");

											setTimeout(function () {
												$("#listConvenioServicio-1006531").trigger("click");

												setTimeout(function () {
													$("#txtAutorizacion")
														.val("")
														.trigger("change");

													const date = new Date();
													const currentDate = date.toISOString().substring(0, 10);
													$("#txtFechaPacienteSolicitud")
														.val(currentDate)
														.trigger("change");

													const currentTime = date.toISOString().substring(11, 16);
													$("#txtHoraPacienteSolicitud")
														.val(currentTime)
														.trigger("change");

													setTimeout(function () {
														$("#buttonPacienteCrear").trigger("click");

														setTimeout(function () {
															nata.dev.robot.form.fill();

															setTimeout(function () {
																$("#buttonNext").trigger("click");

																setTimeout(function () {
																	nata.dev.robot.form.fill();

																	setTimeout(function () {
																		$("#buttonNext").trigger("click");

																		setTimeout(function () {
																			$("#buttonAgendarAutomatica").trigger("click");

																			setTimeout(function () {
																				$("#buttonDialogClose-uiDialog-" + session.dialogTimestamp).trigger("click");

																				setTimeout(function () {
																					$("#container-day-" + (new Date().getDate() + 1)).trigger("click");
																					document.getElementById("loader").style.display = "none";

																				}, tiempoLargo * 1000);

																			}, tiempoLargo * 1000);

																		}, tiempoLargo * 1000);

																	}, tiempoLargo * 1000);

																}, tiempoLargo * 1000);

															}, tiempoLargo * 1000);

														}, tiempoLargo * 1000);
														
													}, 0.2 * 1000);

												}, 0.25 * 1000);

											}, tiempoLargo * 1000);

										}, tiempoLargo * 1000);

									}, tiempoLargo * 1000);

								}, tiempoLargo * 1000);

							}, tiempoLargo * 1000);

						}, tiempoLargo * 1000);

					}, 0.25 * 1000);
				}
			});
			return false;
		}
		else if (rama == 2) {
			document.getElementById("loader").style.display = "block";
			app.flujo.paciente.buscar.render();

			setTimeout(function () {
				$("#txtIdentificacion").val("79500200");

				setTimeout(function () {
					$("#frmPacienteConsultar").trigger("submit");

					setTimeout(function () {
						$("#buttonNext").trigger("click");

						setTimeout(function () {
							$("#buttonNext").trigger("click");
							
							setTimeout(function () {

								$("#selectConvenio")
									.val(1)
									.trigger("change");

								setTimeout(function () {
									$("#buttonServicioSeleccionar").trigger("click");

									setTimeout(function () {
										$("#listConvenioServicio-1006531").trigger("click");

										setTimeout(function () {
											$("#txtAutorizacion")
												.val("")
												.trigger("change");

											const date = new Date();
											const currentDate = date.toISOString().substring(0, 10);
											$("#txtFechaPacienteSolicitud")
												.val(currentDate)
												.trigger("change");

											const currentTime = date.toISOString().substring(11, 16);
											$("#txtHoraPacienteSolicitud")
												.val(currentTime)
												.trigger("change");

											$("#buttonPacienteAgendarManual").trigger("click");


										}, tiempoLargo * 1000);

									}, tiempoLargo * 1000);

								}, tiempoLargo * 1000);

							}, tiempoLargo * 1000);

						}, tiempoLargo * 1000);

					}, tiempoLargo * 1000);

				}, tiempoLargo * 1000);

			}, 0.25 * 1000);
		}
		else if (rama == 3) {
			document.getElementById("loader").style.display = "block";
			app.flujo.paciente.buscar.render();

			setTimeout(function () {
				$("#txtIdentificacion").val("79500200");

				setTimeout(function () {
					$("#frmPacienteConsultar").trigger("submit");

					setTimeout(function () {
						$("#buttonNext").trigger("click");

						setTimeout(function () {
							$("#buttonNext").trigger("click");

							setTimeout(function () {

								$("#selectConvenio")
									.val(1)
									.trigger("change");

								setTimeout(function () {
									$("#buttonServicioSeleccionar").trigger("click");

									setTimeout(function () {
										$("#listConvenioServicio-1006531").trigger("click");

										setTimeout(function () {
											$("#txtAutorizacion")
												.val("")
												.trigger("change");

											const date = new Date();
											const currentDate = date.toISOString().substring(0, 10);
											$("#txtFechaPacienteSolicitud")
												.val(currentDate)
												.trigger("change");

											const currentTime = date.toISOString().substring(11, 16);
											$("#txtHoraPacienteSolicitud")
												.val(currentTime)
												.trigger("change");

											$("#buttonPacienteAgendarManual").trigger("click");


										}, tiempoLargo * 1000);

									}, tiempoLargo * 1000);

								}, tiempoLargo * 1000);

							}, tiempoLargo * 1000);

						}, tiempoLargo * 1000);

					}, tiempoLargo * 1000);

				}, tiempoLargo * 1000);

			}, 0.25 * 1000);
		}
		document.getElementById("loader").style.display = "block";

		return false;
		

		let autorizacion;
		if (rama == 1) {
			autorizacion = "102030";
		}
		else {
			autorizacion = "111111";
		}

		if (rama == 0) {
			alert("Esta prueba se debe hacer manual");
		}

		else if (rama == 1 || rama == 2) {

			app.flujo.paciente.buscar.render();
			setTimeout(function () {
				$("#txtIdentificacion").val("79500200");

				setTimeout(function () {
					$("#frmPacienteConsultar").trigger("submit");

					setTimeout(function () {
						$("#buttonNext").trigger("click");

						setTimeout(function () {
							$("#buttonNext").trigger("click");

							setTimeout(function () {
								$("#selectConvenio")
									.val(1)
									.trigger("change");
								
								setTimeout(function () {
									$("#buttonServicioSeleccionar").trigger("click");

									setTimeout(function () {
										$("#listConvenioServicio-1006531").trigger("click");

										setTimeout(function () {
											$("#txtAutorizacion")
												.val(autorizacion)
												.trigger("change");

											const date = new Date();
											const currentDate = date.toISOString().substring(0, 10);
											$("#txtFechaPacienteSolicitud")
												.val(currentDate)
												.trigger("change");

											const currentTime = date.toISOString().substring(11, 16);
											$("#txtHoraPacienteSolicitud")
												.val(currentTime)
												.trigger("change");
											
											document.getElementById("loader").style.display = "none";


										}, 0.25 * 1000);

									}, 1 * 1000);

								}, 1 * 1000);

							}, 0.25 * 1000);

						}, 1.3 * 1000);

					}, 1.3 * 1000);

				}, 0.25 * 1000);

				

			}, 0.25 * 1000);
		
		}

		else if (rama == 3) {
			app.flujo.paciente.buscar.render();
			setTimeout(function () {
				$("#txtIdentificacion").val("79500200");

				setTimeout(function () {
					$("#frmPacienteConsultar").trigger("submit");

					setTimeout(function () {
						$("#buttonNext").trigger("click");

						setTimeout(function () {
							$("#buttonNext").trigger("click");

							setTimeout(function () {
								$("#selectConvenio")
									.val(1)
									.trigger("change");

								setTimeout(function () {
									$("#buttonServicioSeleccionar").trigger("click");

									setTimeout(function () {
										$("#listConvenioServicio-1006531").trigger("click");

										setTimeout(function () {
											$("#txtAutorizacion")
												.val("222222")
												.trigger("change");

											const date = new Date();
											const currentDate = date.toISOString().substring(0, 10);
											$("#txtFechaPacienteSolicitud")
												.val(currentDate)
												.trigger("change");

											const currentTime = date.toISOString().substring(11, 16);
											$("#txtHoraPacienteSolicitud")
												.val(currentTime)
												.trigger("change");

											setTimeout(function () {
												app.flujo.paciente.agendar();
												document.getElementById("loader").style.display = "none";
											}, 0.25 * 1000);

											document.getElementById("loader").style.display = "none";

										}, 0.25 * 1000);

									}, 1 * 1000);

								}, 1 * 1000);

							}, 0.25 * 1000);

						}, 1 * 1000);

					}, 1 * 1000);

				}, 0.25 * 1000);



			}, 0.25 * 1000);
		}
	},

	testing01: function () {
		console.log("nata.dev.testing01");
		const data = nata.localStorage.getItem("form-4");
		/*
		let database = TAFFY(data);
		console.log(database().filter({ dc: "pac_primer_nombre" }));
		*/
	}
};

/*
const accountCreate = nata.dev.robot.api.accountCreate;
const api = ["accountCreate"];
*/
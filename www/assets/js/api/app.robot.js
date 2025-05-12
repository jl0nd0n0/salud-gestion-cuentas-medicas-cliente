/* globals app, $, swal, nataUIDialog */

app.robot = {

    flow: {
        run: function (steps) {
            console.log("app.robot.flow.run");
            let i = 0;
            for (i = 0; i < steps.length; ++i) {
                if (steps[i].type == "form") {
                    if (steps[i].wait == 0) {
                        app.robot.form.fill(steps[i].data, steps[i].button);
                    }
                    else {
                        app.robot.form.fill(steps[i].data);
                        app.robot.sleep(parseInt(steps[i].wait) * 1000, function () {
                            //app.robot.form.fill(steps[i].data, steps[i].button);
                        });

                        /*
						if (steps[i].type == "form") {
							app.robot.setTimeout(function (data, button) {
								app.robot.form.fill(data, button);
							}, steps[i].data, steps[i].button, steps[i].wait);
						}
						*/
                    }
                    //app.robot.form.button.click(steps[i].button);
                }
            }
        },

        run1: function (steps) {
            console.log("app.robot.flow.run1");
            const fxs = [];
            let i;
            for (i = 0; i < steps.length; ++i) {
                console.log(steps[i].data);
                fxs.push({
                    fx: app.robot.form.fill,
                    data: steps[i].data,
                    button: steps[i].button,
                    timeout: parseInt(steps[i].wait) * 1000
                });
            }

            console.log(fxs);

            i = 0;
            function callFuncs() {
                console.log(i);
                fxs[i].fx(fxs[i].data, fxs[i].button);
                if (i < fxs.length) setTimeout(callFuncs, fxs[i].timeout);
                i++;
            }
            setTimeout(callFuncs, 1000);
            //callFuncs();
        },

        run2: async function (steps) {
            const fxs = [];
            let i;
            for (i = 0; i < steps.length; ++i) {
                console.log(steps[i].data);
                fxs.push({
                    fx: app.robot.form.fill,
                    data: steps[i].data,
                    button: steps[i].button,
                    wait: parseInt(steps[i].wait) * 1000,
                    callback: steps[i].callback
                });
            }

            console.log(fxs);

            for (i = 0; i < fxs.length; i++) {
                fxs[i].fx(fxs[i].data, fxs[i].button);
                await app.robot.sleep(1.75 * 1000);
                if (typeof fxs[i].callback == "function") fxs[i].callback();
            }

            /*
			fxs[0].fx(fxs[0].data, fxs[0].button);
			await app.robot.sleep(1 * 1000);
			fxs[1].fx(fxs[1].data, fxs[1].button);
			await app.robot.sleep(1 * 1000);
			*/
            //fxs[2].fx(fxs[2].data, fxs[2].button);
			
        }
    },
	
    form: {

        button: {
            click: function (id) {
                console.log("app.robot.form.button.click");
                $("#" + id).trigger("click");
            }
        },

        fill: function (data, button) {
            console.log("app.robot.form.fill");
            let i = 0, boolValidar = false, value;

            console.log(data);

            for (i = 0; i < data.length; ++i) {
                //console.log(data[i]);
                //console.log($("#control-" + data[i].id));

                if (typeof data[i].type == "undefined") data[i].type = "";

                //console.log(data[i].type);
                if (data[i].type == "divipola") {
                    const elDepartamento = document.querySelector("#selectDepartamento-" + data[i].id);
                    console.log(elDepartamento);
                    elDepartamento.value = data[i].value.d.toString().trim();
                    $(elDepartamento).trigger("change");
                    app.form.field.save(undefined, data[i].id, data[i].value);
                }
                else if (data[i].widget == "tension-arterial") {
                    const elemento1 = document.querySelector("#control-" + data[i].id + "-1");
                    const elemento2 = document.querySelector("#control-" + data[i].id + "-2");
                    elemento1.value = "" + data[i].value.s.toString().trim();
                    elemento2.value = "" + data[i].value.d.toString().trim();
                    elemento1.dispatchEvent(new Event("change"));
                    elemento2.dispatchEvent(new Event("change"));
                }
                else if (data[i].widget == "altura") {
                    const elemento1 = document.querySelector("#control-" + data[i].id + "-1");
                    const elemento2 = document.querySelector("#control-" + data[i].id + "-2");
                    elemento1.value = "" + data[i].value.m.toString().trim();
                    elemento2.value = "" + data[i].value.c.toString().trim();
                    elemento1.dispatchEvent(new Event("change"));
                    elemento2.dispatchEvent(new Event("change"));
                }
                else if ( $("#" + data[i].id).length == 0 ) {
                    $("#control-" + data[i].id)
                        .val(data[i].value)
                        .trigger("change");
					
                    if ($("#control-" + data[i].id) == 0) {
                        return false;
                    }
					
                    //console.log(data[i].id, data[i].value);
                    app.form.field.save(undefined, data[i].id, data[i].value);
                    boolValidar = true;
                }
                else {
                    console.log(data[i].id, data[i].value);
                    $("#" + data[i].id)
                        .val(data[i].value)
                        .trigger("change");
                }
                if (typeof data[i].change == "function") data[i].change();
            }

            if (boolValidar) {
                app.form.validate();
            }
            setTimeout(() => {
                //if (typeof button !== "undefined") app.robot.form.button.click(button);
            }, 1 * 1000);
			
        }
    },

    setTimeout: function (callback, data, button, wait) {
        console.log("app.robot.setTimeout");
        setTimeout(() => {
            callback(data, button);
        }, parseInt(wait) * 1000);

    },

    show: function (rama) {
        console.log("nata.dev.robot.show");
        const devToolbar = document.getElementById("devToolbar");
        devToolbar.render("templateButtonRobot");
        devToolbar.style.display = "inline-block";
        document.getElementById("buttonRobot").style.display = "block";
        $(".button-robot")
            .off()
            .click(function () {
                app.robot.testing.run(rama);
            });
    },

    sleep: async function (milliseconds) {
        console.log("app.robot.sleep");
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    },

    testing: {

        afiliaciones: function () {
            app.core.dialog.close();
            app.consultas.afiliacion.index();
            app.robot.sleep(1 * 1000);
            document.querySelector("#selectTipoIdentificacion").value = "CC";
            document.querySelector("#txtNumeroIdentificacion").value = "1069052479";
            app.robot.sleep(1 * 1000);
            $("#buttonSubmit").trigger("click");
        },


        preregistro: function () {
            console.log("app.robot.testing.preregistro");

            const steps = [
                {
                    type: "form",
                    button: "buttonNext",
                    wait: 2,
                    data: [
                        {
                            id: 3,
                            value: "JUANITO"
                        },
                        {
                            id: 5,
                            value: "ALIMAÑA"
                        },
                        {
                            id: 7,
                            value: "1"
                        }
                    ]
                }
            ];
            app.robot.flow.run2(steps);
        },

        paciente: {
            crear: function (step) {
                console.log("app.robot.testing.paciente.crear");

                let steps;
                if (step == 1) {
                    steps = [
                        {
                            type: "form",
                            button: "buttonNext",
                            wait: 2,
                            data: [
                                {
                                    id: 7,
                                    value: "1970-06-18"
                                },
                                {
                                    id: 8,
                                    value: {
                                        d: "11",
                                        m: "11001",
                                    },
                                    type: "divipola"
                                },
                                {
                                    id: 9,
                                    value: "1"
                                },
                                {
                                    id: 13,
                                    value: "test@test.com"
                                }
                            ]
                        }
                    ];
                }
                else {
                    steps = [
                        {
                            type: "form",
                            button: "buttonNext",
                            wait: 2,
                            data: [
                                {
                                    id: 16,
                                    value: "Carrera 7B # 123-46"
                                },
                                {
                                    id: 17,
                                    value: {
                                        d: "11",
                                        m: "11001",
                                    },
                                    type: "divipola"
                                },
                                {
                                    id: 18,
                                    value: "3057075510"
                                },
                                {
                                    id: 22,
                                    value: "1"
                                },
                                {
                                    id: 23,
                                    value: "San Pelayo"
                                }
                            ]
                        }
                    ];
                }
                app.robot.flow.run2(steps);
            }
        },

        hc: {
			
            datosCuidador: function () {
                console.log("app.robot.testing.hc.datosCuidador");

                const steps = [
                    {
                        type: "form",
                        button: "buttonNext",
                        wait: 2,
                        data: [
                            {
                                id: 1,
                                value: "Pedro Paramo"
                            },
                            {
                                id: 2,
                                value: "6018710520"
                            },
                            {
                                id: 3,
                                value: "3057075511"
                            },
                            {
                                id: 4,
                                value: "Carrera 7B # 123-56"
                            },
                            {
                                id: 5,
                                value: "Tio farrero"
                            },
                        ]
                    }
                ];
                app.robot.flow.run2(steps);
            },

            cambiosAtencionPaciente: function () {
                console.log("app.robot.testing.hc.cambiosAtencionPaciente");

                const steps = [
                    {
                        type: "form",
                        button: "buttonNext",
                        wait: 2,
                        data: [
                            {
                                id: 1,
                                value: "Complicaciones del paciente"
                            },
                            {
                                id: 2,
                                value: "Accidentes que ha tenido"
                            },
                            {
                                id: 3,
                                value: "Eventos adversos"
                            },
                            {
                                id: 4,
                                value: "Análisis de estudio diagnósticos"
                            },
                            {
                                id: 5,
                                value: "Análisis de laboratorios clínicos"
                            },
                            {
                                id: 6,
                                value: "Análisis general"
                            }
                        ]
                    }
                ];
                app.robot.flow.run2(steps);
            },

            dx: function () {
                console.log("app.robot.testing.hc.dx");
                let element;

                const fxSwalCerrar = function (element) {
                    element = document.querySelector(".swal-button--confirm");
                    $(element).trigger("click");
                };

                $("#menuHCDatosGenerales").trigger("click");
                setTimeout(function () {

                    $("#buttonNext").trigger("click");
                    setTimeout(function () {

                        element = document.querySelector(".swal-button--confirm");
                        $(element).trigger("click");

                        setTimeout(function () {

                            element = document.querySelector(".swal-button--confirm");
                            $(element).trigger("click");

                            setTimeout(function () {

                                element = document.querySelector(".button-dialog-close");
                                $(element).trigger("click");

                                setTimeout(function () {

                                    $("#menuHCDX-1").trigger("click");

                                    setTimeout(function () {

                                        element = document.querySelector(".button-dialog-close");
                                        $(element).trigger("click");

                                        setTimeout(function () {

                                            $("#buttonNext").trigger("click");

                                            setTimeout(function () {
                                                fxSwalCerrar(element);
												
                                                setTimeout(function () {
                                                    fxSwalCerrar(element);
                                                }, 0.5 * 1000);

                                            }, 0.25 * 1000);

                                        }, 0.25 * 1000);

                                    }, 0.25 * 1000);


                                }, 0.25 * 1000);


                            }, 0.25 * 1000);

							
                        }, 0.25 * 1000);

                    }, 0.25 * 1000);
				
                }, 0.25 * 1000);

				
            }
        },

        run: function (idTest) {
            console.log("app.robot.testing.run - " + idTest);

            if (idTest == "1") {
                swal({
                    title: "Eliminar el paciente",
                    text: "Asegurate que se ha eliminado el paciente totalmente",
                    icon: "warning",
                    buttons: ["NO, voy a revisar", "SI, Continuar"],
                    dangerMode: true,
                }).then((response) => {
                    if (response) {
                        app.flujo.paciente.buscar.render();
                        setTimeout(() => {
                            const steps = [
                                {
                                    type: "form",
                                    button: "buttonSubmit",
                                    wait: 2,
                                    data: [
                                        {
                                            id: "txtIdentificacion",
                                            value: "79500200"
                                        }
                                    ]
                                },
                                {
                                    type: "form",
                                    button: "buttonNext",
                                    wait: 2,
                                    data: [
                                        {
                                            id: 1,
                                            value: "Hector"
                                        },
                                        /*
										{
											id: 2,
											value: "Hernán"
										},
										*/
                                        {
                                            id: 3,
                                            value: "Rubiano"
                                        },
                                        /*
										{
											id: 4,
											value: "López"
										},
										*/
                                        {
                                            id: 5,
                                            value: "1"
                                        },
                                        {
                                            id: 7,
                                            value: "3057075510"
                                        },
                                        {
                                            id: 8,
                                            value: "3044613127"
                                        },
                                        {
                                            id: 9,
                                            value: "6018710520"
                                        }
                                    ]
                                },
                                {
                                    type: "form",
                                    wait: 1,
                                    data: [
                                        {
                                            id: "selectConvenio",
                                            value: "1",
                                            change: function () {
                                                $("#buttonServicioSeleccionar").trigger("click");
                                                setTimeout(() => {
                                                    $("#listConvenioServicio-1006531").trigger("click");
                                                }, 1 * 1000);
                                            }
                                        },
                                        {
                                            id: "txtFechaPacienteSolicitud",
                                            value: "2021-09-24"
                                        },
                                        {
                                            id: "txtHoraPacienteSolicitud",
                                            value: new Date().toISOString().substring(11, 16)
                                        }
                                    ]
                                }
                            ];
                            app.robot.flow.run2(steps);
                        }, 0.25 * 1000);
                    }
                });
            }
            else if (idTest == "3") {
                swal({
                    title: "Eliminar el paciente",
                    text: "Asegurate que se ha eliminado el paciente totalmente",
                    icon: "warning",
                    buttons: ["NO, voy a revisar", "SI, Continuar"],
                    dangerMode: true,
                }).then((response) => {
                    if (response) {
                        app.flujo.paciente.buscar.render();
                        setTimeout(() => {
                            const steps = [
                                {
                                    type: "form",
                                    button: "buttonSubmit",
                                    wait: 2,
                                    data: [
                                        {
                                            id: "txtIdentificacion",
                                            value: "79500200"
                                        }
                                    ]
                                },
                                {
                                    type: "form",
                                    button: "buttonNext",
                                    wait: 2,
                                    data: [
                                        {
                                            id: 1,
                                            value: "Hector"
                                        },
                                        {
                                            id: 2,
                                            value: "Hernán"
                                        },
                                        {
                                            id: 3,
                                            value: "Rubiano"
                                        },
                                        {
                                            id: 4,
                                            value: "López"
                                        },
                                        {
                                            id: 5,
                                            value: "1"
                                        },
                                        {
                                            id: 7,
                                            value: "3057075510"
                                        },
                                        {
                                            id: 8,
                                            value: "3044613127"
                                        },
                                        {
                                            id: 9,
                                            value: "6018710520"
                                        }
                                    ]
                                },
                                {
                                    type: "form",
                                    button: "buttonPacienteCrear",
                                    wait: 1,
                                    data: [
                                        {
                                            id: "selectConvenio",
                                            value: "1",
                                            change: function () {
                                                $("#buttonServicioSeleccionar").trigger("click");
                                                setTimeout(() => {
                                                    $("#listConvenioServicio-1006531").trigger("click");
                                                }, 1 * 1000);
                                            }
                                        },
                                        {
                                            id: "txtFechaPacienteSolicitud",
                                            value: "2021-09-24"
                                        },
                                        {
                                            id: "txtHoraPacienteSolicitud",
                                            value: new Date().toISOString().substring(11, 16)
                                        }
                                    ]
                                },
                                {
                                    type: "form",
                                    button: "buttonNext",
                                    wait: 1,
                                    data: [
                                        {
                                            id: 7,
                                            value: "1970-06-18"
                                        },
                                        {
                                            id: "selectDepartamento-8",
                                            value: "11"
                                        },
                                        {
                                            id: 9,
                                            value: "1"
                                        },
                                        {
                                            id: 13,
                                            value: "jorge.londono@crescend.software",
                                            change: function () {
                                                $("input.paciente-primer-nombre, input.paciente-segundo-nombre, input.paciente-primer-apellido, input.paciente-segundo-apellido, input.paciente-numero-identificacion, select.paciente-tipo_identificacion").trigger("change");
                                                app.form.field.save(undefined, 8, "");
                                                app.form.validate();
                                            }
                                        }
                                    ]
                                },
                                {
                                    type: "form",
                                    button: "buttonNext",
                                    wait: 1,
                                    data: [
                                        {
                                            id: 16,
                                            value: "La palma 2010"
                                        },
                                        {
                                            id: 22,
                                            value: "1"
                                        },
                                        {
                                            id: 23,
                                            value: "San Pelayo"
                                        }
                                    ],
                                    callback: function () {
                                        $("#containerForm .form-control").trigger("change");
                                        $("#buttonNext").trigger("click");
                                    }
                                }
                            ];
                            app.robot.flow.run2(steps);
                        }, 0.25 * 1000);
                    }
                });
            }
            else if (idTest == "101") {
                swal({
                    title: "Eliminar el paciente",
                    text: "Asegurate que se ha eliminado el paciente totalmente",
                    icon: "warning",
                    buttons: ["NO, voy a revisar", "SI, Continuar"],
                    dangerMode: true,
                }).then((response) => {
                    if (response) {
                        app.flujo.paciente.buscar.render();
                        setTimeout(() => {
                            const steps = [
                                {
                                    type: "form",
                                    button: "buttonSubmit",
                                    wait: 2,
                                    data: [
                                        {
                                            id: "txtIdentificacion",
                                            value: "79500200"
                                        }
                                    ]
                                },
                                {
                                    type: "form",
                                    button: "buttonNext",
                                    wait: 2,
                                    data: [
                                        {
                                            id: 1,
                                            value: "Hector"
                                        },
                                        /*
										{
											id: 2,
											value: "Hernán"
										},
										*/
                                        {
                                            id: 3,
                                            value: "Rubiano"
                                        },
                                        /*
										{
											id: 4,
											value: "López"
										},
										*/
                                        {
                                            id: 5,
                                            value: "1"
                                        },
                                        {
                                            id: 7,
                                            value: "3057075510"
                                        },
                                        {
                                            id: 8,
                                            value: "3044613127"
                                        },
                                        {
                                            id: 9,
                                            value: "6018710520"
                                        }
                                    ]
                                }
                            ];
                            app.robot.flow.run2(steps);
                        }, 0.25 * 1000);
                    }
                });
            }
            else if (idTest == "103") {
                swal({
                    title: "Eliminar el paciente",
                    text: "Asegurate que se ha eliminado el paciente totalmente",
                    icon: "warning",
                    buttons: ["NO, voy a revisar", "SI, Continuar"],
                    dangerMode: true,
                }).then((response) => {
                    if (response) {
                        app.flujo.paciente.buscar.render();
                        setTimeout(() => {
                            const steps = [
                                {
                                    type: "form",
                                    button: "buttonSubmit",
                                    wait: 2,
                                    data: [
                                        {
                                            id: "txtIdentificacion",
                                            value: "79500200"
                                        }
                                    ]
                                },
                                {
                                    type: "form",
                                    button: "buttonNext",
                                    wait: 2,
                                    data: [
                                        {
                                            id: 1,
                                            value: "Hector"
                                        },
                                        /*
										{
											id: 2,
											value: "Hernán"
										},
										*/
                                        {
                                            id: 3,
                                            value: "Rubiano"
                                        },
                                        /*
										{
											id: 4,
											value: "López"
										},
										*/
                                        {
                                            id: 5,
                                            value: "1"
                                        },
                                        {
                                            id: 7,
                                            value: "3057075510"
                                        },
                                        {
                                            id: 8,
                                            value: "3044613127"
                                        },
                                        {
                                            id: 9,
                                            value: "6018710520"
                                        }
                                    ]
                                },
                                {
                                    type: "form",
                                    button: "buttonPacienteCrear",
                                    wait: 1,
                                    data: [
                                        {
                                            id: "selectConvenio",
                                            value: "1",
                                            change: function () {
                                                $("#buttonServicioSeleccionar").trigger("click");
                                                setTimeout(() => {
                                                    $("#listConvenioServicio-1006203").trigger("click");
                                                }, 1 * 1000);
                                            }
                                        },
                                        {
                                            id: "txtFechaPacienteSolicitud",
                                            value: "2021-09-24"
                                        },
                                        {
                                            id: "txtHoraPacienteSolicitud",
                                            value: new Date().toISOString().substring(11, 16)
                                        }
                                    ]
                                },
                                {
                                    type: "form",
                                    button: "buttonNext",
                                    wait: 1,
                                    data: [
                                        {
                                            id: 7,
                                            value: "1970-06-18"
                                        },
                                        {
                                            id: "selectDepartamento-8",
                                            value: "11"
                                        },
                                        {
                                            id: 9,
                                            value: "1"
                                        },
                                        {
                                            id: 13,
                                            value: "jorge.londono@crescend.software",
                                            change: function () {
                                                $("input.paciente-primer-nombre, input.paciente-segundo-nombre, input.paciente-primer-apellido, input.paciente-segundo-apellido, input.paciente-numero-identificacion, select.paciente-tipo_identificacion").trigger("change");
                                                app.form.field.save(undefined, 8, "");
                                                app.form.validate();
                                            }
                                        }
                                    ]
                                },
                                {
                                    type: "form",
                                    button: "buttonNext",
                                    wait: 1,
                                    data: [
                                        {
                                            id: 16,
                                            value: "Carrera 7B # 123-46"
                                        },
                                        {
                                            id: 22,
                                            value: "1"
                                        },
                                        {
                                            id: 23,
                                            value: "San Pelayo"
                                        }
                                    ],
                                    callback: function () {
                                        $("#containerForm .form-control").trigger("change");
                                        //$("#buttonNext").trigger("click");
                                    }
                                }
                            ];
                            app.robot.flow.run2(steps);
                        }, 0.25 * 1000);
                    }
                });
            }
            else if (idTest == "199") {
                const steps = [
                    {
                        type: "form",
                        button: "buttonNext",
                        wait: 2,
                        data: [
                            {
                                id: 3,
                                value: "Motivo Consulta"
                            },
                            {
                                id: 4,
                                value: "Motivo de ingreso al programa"
                            },
                            {
                                id: 5,
                                value: "Enfermedad actual"
                            },
                            {
                                id: 6,
                                value: "Antecedentes personales"
                            },
                            {
                                id: 7,
                                value: "Antecedentes familiares"
                            },
                            {
                                id: 8,
                                value: "Antecedentes médicos"
                            },
                            {
                                id: 9,
                                value: "Antecedentes Sistemáticos"
                            },
                            {
                                id: 10,
                                value: "Antecedentes Alérgicos"
                            },
                            {
                                id: 11,
                                value: "Revisión por Sistemas"
                            },
                            {
                                id: 12,
                                value: "Lateralidad"
                            }
                        ]
                    }
                ];
                app.robot.flow.run2(steps);
            }
            else if (idTest == "signos") {
                const steps = [
                    {
                        type: "form",
                        button: "buttonNext",
                        wait: 2,
                        data: [
                            {
                                id: 1,
                                value: "Indicaciones"
                            },
                            {
                                id: 2,
                                value: {
                                    s: 110,
                                    d: 70
                                },
                                widget: "tension-arterial"
                            },
                            {
                                id: 3,
                                value: "80",
                            },
                            {
                                id: 4,
                                value: "20"
                            },
                            {
                                id: 5,
                                value: "36"
                            },
                            {
                                id: 6,
                                value: "98"
                            },
                            {
                                id: 7,
                                value: "116"
                            },
                            {
                                id: 9,
                                value: {
                                    m: 1,
                                    c: 80
                                },
                                widget: "altura"
                            },
                            {
                                id: 10,
                                value: "89"
                            }
                        ]
                    }
                ];
                app.robot.flow.run2(steps);

            }
            else if (idTest == "signos-menor") {
                const steps = [
                    {
                        type: "form",
                        button: "buttonNext",
                        wait: 2,
                        data: [
                            {
                                id: 1,
                                value: "Indicaciones"
                            },
                            {
                                id: 2,
                                value: {
                                    s: 79,
                                    d: 49
                                },
                                widget: "tension-arterial"
                            },
                            {
                                id: 3,
                                value: "39",
                            },
                            {
                                id: 4,
                                value: "0"
                            },
                            {
                                id: 5,
                                value: "34"
                            },
                            {
                                id: 6,
                                value: "49"
                            },
                            {
                                id: 7,
                                value: "49"
                            },
                            {
                                id: 9,
                                value: {
                                    m: 0,
                                    c: 0
                                },
                                widget: "altura"
                            },
                            {
                                id: 10,
                                value: "0"
                            }
                        ]
                    }
                ];
                app.robot.flow.run2(steps);

            }
            else if (idTest == "signos-mayor") {
                const steps = [
                    {
                        type: "form",
                        button: "buttonNext",
                        wait: 2,
                        data: [
                            {
                                id: 1,
                                value: "Indicaciones"
                            },
                            {
                                id: 2,
                                value: {
                                    s: 240,
                                    d: 100
                                },
                                widget: "tension-arterial"
                            },
                            {
                                id: 3,
                                value: "150",
                            },
                            {
                                id: 4,
                                value: "120"
                            },
                            {
                                id: 5,
                                value: "50"
                            },
                            {
                                id: 6,
                                value: "130"
                            },
                            {
                                id: 7,
                                value: "250"
                            },
                            {
                                id: 9,
                                value: {
                                    m: 4,
                                    c: 90
                                },
                                widget: "altura"
                            },
                            {
                                id: 10,
                                value: "700"
                            }
                        ]
                    }
                ];
                app.robot.flow.run2(steps);

            }
            else if (idTest == "examen") {
                const steps = [
                    {
                        type: "form",
                        button: "buttonNext",
                        wait: 2,
                        data: [
                            {
                                id: 1,
                                value: "Descripción General"
                            },
                            {
                                id: 2,
                                value: "Cabeza y Cuello"
                            },
                            {
                                id: 3,
                                value: "Cardiopulmonar"
                            },
                            {
                                id: 4,
                                value: "Abdomen"
                            },
                            {
                                id: 5,
                                value: "Genitourinario"
                            },
                            {
                                id: 6,
                                value: "Extremidades"
                            },
                            {
                                id: 7,
                                value: "Sistema Nervioso Central"
                            }
                        ]
                    }
                ];
                app.robot.flow.run2(steps);
            }
        }
    }

};
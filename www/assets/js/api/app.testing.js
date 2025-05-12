/* globals app, session, dayjs, nata, $, oState, oWorkflow */

app.testing = {
    //app.testing.time
    time: 0.7,
    controlChange: function (selector, value) {
        console.log("app.testing.controlChange");
        const element = document.querySelector("#" + selector);
        element.value = value;
        const event = new Event("change");  // (*)
        console.log(element);
        element.dispatchEvent(event);
    },

    checkBoxChange: function (form, element) {
        element.checked = true;
        form.fieldSaveMultiselect(element);
    },

    hc: {
        unificada: function () {
            console.log("app.testing.hc.unificada");

            app.testing.controlChange( "control-1", dayjs().format("YYYY-MM-DD") );

            app.testing.controlChange("control-3", "Motivo Consulta");
            app.testing.controlChange("control-4", "Motivo de ingreso al programa");
            app.testing.controlChange("control-5", "Enfermedad Actual");
            app.testing.controlChange("control-6", "Antecedentes Personales");
            app.testing.controlChange("control-7", "Antecedentes Familiares");
            app.testing.controlChange("control-8", "Antecedentes Médicos");
            app.testing.controlChange("control-9", "Antecedentes Sistemáticos");
            app.testing.controlChange("control-10", "Antecedentes Alérgicos");
            app.testing.controlChange("control-11", "Revisión por Sistemas");
            app.testing.controlChange("control-12", "Lateralidad");
            app.testing.controlChange("control-13", "Cuidador");
            app.testing.controlChange("control-14", "6018710520");
            app.testing.controlChange("control-15", "3057075510");
            app.testing.controlChange("control-16", "Calle Luna Calle Sol");
            app.testing.controlChange("control-17", "Parentesco");

            app.testing.controlChange("control-18", "Indicaciones");
            app.testing.controlChange("control-19-1", "90");
            app.testing.controlChange("control-19-2", "100");
            app.testing.controlChange("control-20", "80");
            app.testing.controlChange("control-21", "50");

            app.testing.controlChange("control-22", "35");
            app.testing.controlChange("control-23", "98");
            app.testing.controlChange("control-24", "100");
            app.testing.controlChange("control-26-1", "1");
            app.testing.controlChange("control-26-2", "80");
            app.testing.controlChange("control-27", "80");

            app.testing.controlChange("control-29", "Descripción General");
            app.testing.controlChange("control-30", "Cabeza y cuello");
            app.testing.controlChange("control-31", "Cardiopulmonar");
            app.testing.controlChange("control-32", "Abdomen");
            app.testing.controlChange("control-33", "Genitourinario");
            app.testing.controlChange("control-34", "Extremidades");
            app.testing.controlChange("control-35", "Sistema Nervioso Central");

            app.testing.controlChange("control-36", "Complicaciones");
            app.testing.controlChange("control-37", "Accidentes");
            app.testing.controlChange("control-38", "Eventos adversos");
            app.testing.controlChange("control-39", "Análisis de estudio diagnósticos");
            app.testing.controlChange("control-40", "Análisis de laboratorios clínicos");
            app.testing.controlChange("control-41", "Análisis");

            nata.fx.dom.element.scrollToBottom( document.getElementById( "container" ) );

        },
        dx: function () {
            console.log("app.testing.hc.dx");
            app.testing.controlChange("control-1", "Plan que se realiza al paciente");
            app.testing.controlChange("control-2", "01");
            app.testing.controlChange("control-3", "01");
            app.testing.controlChange("control-4", "condiciones generales al momento del egreso");
        },
        escala: {
            core: function ( arrNamesGroup, value, index ) {
                console.log( "app.testing.hc.escala.core" );
                let i, x, elements;
                for (i=0; i<arrNamesGroup.length; i++) {
                    //console.log( arrNamesGroup[i] );
                    elements = document.querySelectorAll( "[name=" + arrNamesGroup[i]);
                    //console.log( elements );
                    for (x=0; x<elements.length; x++) {
                        //console.log( elements[x] );

                        if ( elements[x].value == value ) {
                            elements[x].checked = true;
                            session.forms[index].fieldSaveOptionButton( elements[x] );
                            session.forms[index].validateFormRadio();
                        }
                        else {
                            elements[x].checked = false;
                        }
                    }
                }

            },
            glasglow: function () {
                console.log( "app.testing.hc.escala.glasglow" );
                const arrNamesGroup = ["GlasgowOptionGroup", "GlasgowOptionGroupOcular", "GlasgowOptionGroupVerbal"];
                app.testing.hc.escala.core( arrNamesGroup, 1 , "hc-escala-glasgow");
                nata.fx.dom.element.scrollToBottom( document.getElementById( "container" ) );
            },
            barthel: function () {
                console.log( "app.testing.hc.escala.barthel" );
                const arrNamesGroup = ["comerOptionGroup", "banarseOptionGroup", "vestirseOptionGroup", "arreglarseOptionGroup", "deposicionOptionGroup", "miccionOptionGroup", "retreteOptionGroup", "trasladoOptionGroup", "deambulacionOptionGroup", "escalerasOptionGroup"];
                app.testing.hc.escala.core( arrNamesGroup, 0, "hc-escala-barthel" );
                nata.fx.dom.element.scrollToBottom( document.getElementById( "container" ) );
            },
            karnofsky: function () {
                console.log( "app.testing.hc.escala.karnofsky" );
                const arrNamesGroup = ["karOptionGroup"];
                app.testing.hc.escala.core( arrNamesGroup, 50, "hc-escala-karnofsky" );
                nata.fx.dom.element.scrollToBottom( document.getElementById( "container" ) );
            },
            news: function () {
                console.log( "app.testing.hc.escala.news" );
                const arrNamesGroup = ["frecuenciaRespiratoriaOptionGroup", "saoOptionGroup", "saoEpocOptionGroup", "saoO2OptionGroup", "saoPASOptionGroup", "saoFCOptionGroup", "pfOptionGroup", "saoTCOptionGroup"];
                app.testing.hc.escala.core( arrNamesGroup, 0, "hc-escala-news" );
                nata.fx.dom.element.scrollToBottom( document.getElementById( "container" ) );
            }
        }
    },

    core: {
        next: function ( boolOther ) {
            setTimeout(() => {
                console.log( "paso 01" );
                $( "#buttonNext" ).trigger( "click" );
                setTimeout(() => {
                    if ( boolOther ) {
                        $( "#buttonNext" ).trigger( "click" );
                    }
                }, app.testing.time * 1000);
            }, app.testing.time * 1000);
        }

    },

    paciente: {
        agendar: function ( identificacion, boolAgendar = false ) {
            console.log("app.testing.paciente.agendar");

            /*
            const data = {
                identificacion: "79500207"
            };
            */

            app.flujo.paciente.buscar.perfil.programador.render();
            oState.setProp("paciente", { identificacion: identificacion } );
            app.flujo.paciente.buscar.server( event, false, undefined, identificacion );

            setTimeout(async () => {
                //setTimeout(async () => {
                //setTimeout(() => {
                await session.forms["paciente"].buttonNext();
                //$( "#buttonNext" ).trigger( "click" );

                setTimeout(() => {
                    //$( "#buttonNext" ).trigger( "click" );

                    session.forms["paciente"].buttonNext();

                    setTimeout(() => {
                        $( "#selectConvenio" )
                            .val(4)
                            .trigger( "change" );

                        setTimeout(() => {
                            app.flujo.paciente.ordenServicio.servicio.seleccionar("4", "890101-1", 1, nata.localStorage.getItem("convenio-servicios") );
                            $( "#txtHoraPacienteSolicitud" ).val( dayjs().format( "HH:mm:ss" ) );
                            const oSession = nata.sessionStorage.getItem("servicio");
                            oSession.fechaSolicitud = dayjs().format("YYYY-MM-DD");
                            nata.sessionStorage.setItem("servicio", oSession);
                            console.log(nata.sessionStorage.getItem("servicio"));
                            app.flujo.paciente.ordenServicio.ui.logica();

                            setTimeout(() => {
                                $("#buttonPacienteAgendarManual").trigger("click");

                                setTimeout(() => {
                                    oWorkflow.runStep(0);

                                    setTimeout(() => {
                                        $( "#textareaLatlng" )
                                            .val( "4.699862226312217, -74.03117435092531" )
                                            .trigger( "change" );

                                        setTimeout(() => {
                                            $("#buttonAgendar1").trigger( "click" );

                                            if ( boolAgendar ) {
                                                setTimeout(() => {
                                                    /*
                                                    window.requestAnimationFrame(function () {
                                                        const data = {
                                                            id: "1203",
                                                            idProfesional: "1019087139",
                                                            profesional: "CAROLINA PATIÑO PARRA",
                                                            horaInicial: "15",
                                                            horaFinal: "7"
                                                        };
                                                        console.log(data);
                                                        app.agenda.domiciliaria.agendar( data );

                                                        setTimeout(() => {
                                                            $(".swal-button--confirm").trigger( "click" );
                                                        }, app.testing.time * 1000);

                                                    });
                                                    */

                                                    $(".button-agendar-paciente").trigger( "click" );

                                                    setTimeout(() => {
                                                        $(".swal-button--confirm").trigger( "click" );
                                                    }, app.testing.time * 1000);

                                                }, app.testing.time * 1000);

                                            }

                                        }, app.testing.time * 1000);

                                    }, app.testing.time * 1000);

                                }, app.testing.time * 1000);

                            }, app.testing.time * 1000);

                        }, 2 * 1000);

                    }, app.testing.time * 1000);

                }, 2.5 * 1000);

                //}, app.testing.time * 1000);
            }, 2.5 * 1000);
        },
        crear: function () {
            console.log("app.testing.paciente.crear");
            app.testing.controlChange("control-1", "Juanito Alimaña");
            app.testing.controlChange("control-3", "Juanito");
            app.testing.controlChange("control-5", "Alimaña");
            app.testing.controlChange("control-7", "1");
            app.testing.controlChange("control-9", "3057075510");
        },
        existe: {
            seccion1: function () {
                console.log("app.testing.paciente.existe.seccion1");
                //app.testing.controlChange("control-1", "Pedro");
                //app.testing.controlChange("control-3", "Navaja");
                app.testing.controlChange("control-5", "1");
                app.testing.controlChange("control-7", "1970-06-18");
                app.testing.controlChange("control-8 #selectDepartamento-8", "11");
                app.testing.controlChange("control-8 #selectMunicipio-8", "11001");
                app.testing.controlChange("control-9", "1");
                app.testing.controlChange("control-10", "2");
                app.testing.controlChange("control-11", "4");
                app.testing.controlChange("control-13", "jorge.londono@crescend.software");
                app.testing.controlChange("control-16", "1");
            },
            seccion2: function () {
                console.log("app.testing.paciente.existe.seccion2");
                app.testing.controlChange("control-17", "CARRERA 7B #123-46");
                app.testing.controlChange("control-18 #selectDepartamento-18", "11");
                app.testing.controlChange("control-18 #selectMunicipio-18", "11001");
                app.testing.controlChange("control-19", "3057075510");
                app.testing.controlChange("control-23", "2");
                app.testing.controlChange("control-24", "Santa Barbara");
                app.testing.controlChange("control-25", "1");
            }
        },
        noExiste: {
            seccion1: function () {
                console.log("app.testing.paciente.crear.noExiste.seccion1");
                app.testing.controlChange("control-1", "Juanito");
                app.testing.controlChange("control-3", "Alimaña");
                app.testing.controlChange("control-5", "1");
                app.testing.controlChange("control-7", "1970-06-18");
                app.testing.controlChange("control-8 #selectDepartamento-8", "11");
                app.testing.controlChange("control-8 #selectMunicipio-8", "11001");
                app.testing.controlChange("control-9", "1");
                app.testing.controlChange("control-10", "2");
                app.testing.controlChange("control-11", "4");
                app.testing.controlChange("control-13", "jorge.londono@crescend.software");
                app.testing.controlChange("control-16", "1");
            },
            seccion2: function () {
                console.log("app.testing.paciente.crear.noExiste.seccion2");
                app.testing.controlChange("control-17", "CARRERA 7B #123-46");
                app.testing.controlChange("control-18 #selectDepartamento-18", "11");
                app.testing.controlChange("control-18 #selectMunicipio-18", "11001");
                app.testing.controlChange("control-19", "3057075510");
                app.testing.controlChange("control-23", "2");
                app.testing.controlChange("control-24", "Santa Barbara");
                app.testing.controlChange("control-25", "1");
            }
        }
    },

    sivigilaCovid: function () {
        console.log("app.testing.sivigilaCovid");
        // app.testing.sivigilaCovid
        app.testing.controlChange("control-2", "170");
        app.testing.controlChange("control-5 #selectDepartamento-5", "91");
        app.testing.controlChange("control-5 #selectMunicipio-5", "91001");
        app.testing.controlChange("control-6", "1");
        app.testing.controlChange("control-7", "4");
        app.testing.controlChange("control-8", "Las Acacias");
        app.testing.controlChange("control-9", "Las Acacias");
        app.testing.controlChange("control-10", "Las Acacias");
        app.testing.controlChange("control-11", "3429");
        app.testing.controlChange("control-13", "1");
        app.testing.controlChange("control-14", "Zenú");

        app.testing.checkBoxChange(session.forms["hc_sivigila_covid"], document.querySelector("#control-15-1"));
        app.testing.checkBoxChange(session.forms["hc_sivigila_covid"], document.querySelector("#control-15-2"));
        app.testing.checkBoxChange(session.forms["hc_sivigila_covid"], document.querySelector("#control-15-3"));

        app.testing.checkBoxChange(session.forms["hc_sivigila_covid"], document.querySelector("#control-16-1"));
        app.testing.checkBoxChange(session.forms["hc_sivigila_covid"], document.querySelector("#control-16-2"));
        app.testing.checkBoxChange(session.forms["hc_sivigila_covid"], document.querySelector("#control-16-3"));

        app.testing.controlChange("control-18", "2022-04-01");
        app.testing.controlChange("control-19", "2");
        app.testing.controlChange("control-20", "1");
        app.testing.controlChange("control-21", "2022-04-01");
        app.testing.controlChange("control-22", "2");
        app.testing.controlChange("control-23", "2022-04-01");
        app.testing.controlChange("control-24", "123456789-0");
        app.testing.controlChange("control-25", "Natural");
        app.testing.controlChange("control-26", "0574");
    },

    sivigilaCovid2: function () {
        // app.testing.sivigilaCovid2
        app.testing.controlChange("control-27", "1");
        app.testing.controlChange("control-28", "1");
        app.testing.controlChange("control-29 #selectDepartamento-29", "91");
        app.testing.controlChange("control-29 #selectMunicipio-29", "91001");
        app.testing.controlChange("control-30", "196");
        app.testing.controlChange("control-31", "1");
        app.testing.checkBoxChange(document.querySelectorAll("#control-32")[0]);
        app.testing.checkBoxChange(document.querySelectorAll("#control-32")[1]);
        app.testing.checkBoxChange(document.querySelectorAll("#control-32")[2]);
        app.testing.controlChange("control-33", "Otros");
        app.testing.checkBoxChange(document.querySelectorAll("#control-34")[0]);
        app.testing.checkBoxChange(document.querySelectorAll("#control-34")[1]);
        app.testing.checkBoxChange(document.querySelectorAll("#control-34")[2]);
        app.testing.controlChange("control-35", "Otros");
        app.testing.controlChange("control-36", "2");
        app.testing.controlChange("control-37", "1");
        app.testing.controlChange("control-38", "2022-04-01");
        app.testing.controlChange("control-39", "1");
        app.testing.controlChange("control-40", "Otros");
        app.testing.controlChange("control-41", "1");
        app.testing.controlChange("control-42", "1ra");
        app.testing.controlChange("control-43", "2022-04-01");
        app.testing.controlChange("control-44", "Astrazeneca");
        app.testing.controlChange("control-45", "2022-04-01");
        app.testing.controlChange("control-46", "2022-04-01");
        app.testing.controlChange("control-47", "1");
        app.testing.controlChange("control-48", "1");
        app.testing.controlChange("control-49", "1");
        app.testing.controlChange("control-50", "1");
        app.testing.controlChange("control-51", "2022-04-01");
        app.testing.controlChange("control-52", "1000");
        app.testing.controlChange("control-53", "2022-04-01");
        app.testing.controlChange("control-54", "2022-04-01");
        app.testing.controlChange("control-55", "1");
        app.testing.controlChange("control-56", "1");
        app.testing.controlChange("control-57", "1");
        app.testing.controlChange("control-58", "1");
        app.testing.controlChange("control-59", "2022-04-01");
        app.testing.controlChange("control-60", "1000");
    }
};
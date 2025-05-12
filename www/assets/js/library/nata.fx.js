/* eslint-disable no-unused-vars */
/* globals nata, app, swal, dayjs, jQuery, $ */

nata.fx = {
    array: {
        sum: function (items, prop) {
            console.log("nata.fx.array.sum");
            return items.reduce(function (a, b) {
                return parseInt(a) + parseInt(b[prop]);
            }, 0);
        }
    },
    date: {
        diferencia: {
            horas: function ( date1, date2 ) {
                console.log( "nata.fx.date.diferencia.horas" );
                return (( date1-date2) / 1000);
            }
        },
        getEdad: function (strDate) {
            console.log("nata.fx.date.getEdad");

            const today = new Date();

            const year = Number(strDate.substr(0, 4));
            const month = Number(strDate.substr(5, 2)) - 1;
            const day = Number(strDate.substr(8, 2));

            //console.log(year, month, day);

            const birthDate = new Date(year, month, day);
            //console.log(strDate.replaceAll("-", ""));
            //console.log(birthDate);
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        },
        getAge: function (strDate) {
            console.log("nata.fx.date.getAge");
            //alert(strDate);

            const dateNow = dayjs();
            const dateBirth = dayjs(strDate);

            //console.log(dateNow, dateBirth);
            //console.log(dateNow.diff(strDate, "year"));
            const years = dateNow.diff(strDate, "year");
            const totalMonths = dateNow.diff(strDate, "month");
            const months = totalMonths - (years * 12);
            //console.log(months);
            //console.log(dateNow.diff(strDate, "day"));
            return "Años: " + years + " Meses: " + months;
        },
        getYear: function (date = new Date()) {
            console.log("nata.fx.date.getYear");
            return date.getFullYear();
        },
        getMonth: function (date = new Date()) {
            console.log("nata.fx.getMonth");
            return date.getMonth() + 1;
        },
        getDay: function (date = new Date()) {
            console.log("nata.fx.getDay");
            return date.getDate();
        },
        getHours: function (date = new Date()) {
            console.log("nata.fx.getHours");
            return date.getHours();
        },
        getDate: function (a, m, d) {
            console.log("nata.fx.date.getDate");
            if (m.toString().trim().length == 1) m = "0" + m;
            //if (d.toString().trim().length == 1) d = "0" + d;
            let date = app.config.mes[parseInt(m) - 1] + ", " + d + " de " + a;
            //date += "-" + m + "-" + d;
            return date;
        },
        getNameDayByWeekNumber: function (weekNumber) {
            console.log("nata.fx.date.getNameDayByWeekNumber");
            if (weekNumber == 0) return "Domingo";
            else if (weekNumber == 1) return "Lunes";
            else if (weekNumber == 2) return "Martes";
            else if (weekNumber == 3) return "Miércoles";
            else if (weekNumber == 4) return "Jueves";
            else if (weekNumber == 5) return "Viernes";
            else if (weekNumber == 6) return "Sabado";
        },
        getNextMonthDate: function (date) {
            console.log("nata.fx.date.getNextMonthDate");
            var current;
            if (date.getMonth() == 11) {
                current = new Date(date.getFullYear() + 1, 0, 1);
            } else {
                current = new Date(date.getFullYear(), date.getMonth() + 1, 1);
            }

            return current;
        },
        format: {
            getISO: function (date = new Date(), daysMore = 0) {
                if (app.config.dev.verbose.secundario) console.log("nata.fx.date.format.getISO");

                var month = (date.getMonth() + 1);
                if (month.toString().length == 1) {
                    month = "0" + month;
                }

                var day = date.getDate();
                if (day.toString().length == 1) {
                    day = "0" + day;
                }

                return date.getFullYear() + "-" + month + "-" + day;
            },

            getISODateTime: function (date = new Date()) {
                if (app.config.dev.verbose.secundario) console.log("nata.fx.date.format.getISODateTime");

                let month = (date.getMonth() + 1);
                if (month.toString().length == 1) {
                    month = "0" + month;
                }

                let day = date.getDate();
                if (day.toString().length == 1) {
                    day = "0" + day;
                }

                let hour = date.getHours();

                let minutes = date.getMinutes();
                if (minutes.toString().length == 1) {
                    minutes = "0" + minutes;
                }

                return date.getFullYear() + "-" + month + "-" + day + "T" + hour + ":" + minutes;
            },

            large: function (ds, y, m, d) {
                if (app.config.dev.verbose.secundario) console.log("nata.fx.date.format.large");
                return `${ds}, ${d} de ${app.config.mes[parseInt(m)-1]} de ${y}`;
            }
        },
        string: {
            // nata.fx.date.string.yearGet
            yearGet: function (value) {
                return parseInt(value.substr(0, 4));
            },

            monthGet: function (value) {
                return parseInt(value.substr(5, 2));
            },

            dayGet: function (value) {
                return parseInt(value.substr(8, 2));
            },

            //nata.fx.date.string.twoDigits
            twoDigits: function (value) {
                if (value.length == 1) value = "0" + value;
                return value;
            }
        }
    },
    dom: {
        element: {
            size: function (element) {
                console.log("nata.fx.dom.element.size");
                const boundingClientRect = element.getBoundingClientRect();
                if (boundingClientRect.height > 0) {
                    return boundingClientRect;
                }
                else {
                    return {
                        height: element.offsetHeight,
                        width: element.offsetWidth
                    };
                }
            },
            position: {
                getCoordinates: function (element) {
                    const rect = element.getBoundingClientRect(),
                        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
                },

                top: {
                    get: function (element) {
                        console.log("nata.fx.dom.element.position.top.get");
                        return element.offsetTop;
                    }
                },
            },
            scrollToBottom: (node) => {
                console.log( "nata.fx.dom.element.sc" );
                node.style.display = "block";
                node.scrollTo({top: node.scrollHeight, behavior: "smooth"});
            }
        },
        viewport: {
            top: {
                get: function () {
                    console.log("nata.fx.dom.viewport.top.get");
                    return (window.pageYOffset || document.documentElement.scrollTop);
                }
            }
        }
    },
    escala: {

        barthel: {

            backgroundGet: function (total) {
                console.log("nata.fx.escala.barthel.backgroundGet");
                if (total >= 100) {
                    return "bg-verde-light";
                }
                else if (total >= 60) {
                    return "bg-amarillo-light";
                }
                else if (total >= 40 && total <= 59) {
                    return "bg-naranja-light";
                }
                else if (total > 20 && total <= 39) {
                    return "bg-rojo-light";
                }
                else if (total <= 20) {
                    return "bg-rojo-critico-light";
                }
            },

            evaluacion: function (total) {
                console.log("nata.fx.escala.barthel.evaluacion");
                if (total <= 20) {
                    return "Dependiente total: menos de 20 pts";
                }
                else if (total > 20 && total <= 35) {
                    return "Dependiente grave: 20-39 pts";
                }
                else if (total >= 40 && total <= 55) {
                    return "Dependiente moderado: 40-59 pts";
                }
                else if (total >= 60 && total < 100) {
                    return "Dependiente leve: más de 60 pts";
                }
                else {
                    return "Independiente: 100 pts o más (95 si permanece en silla de ruedas)";
                }
            }
        },

        glasgow: {

            backgroundGet: function (total) {
                console.log("nata.fx.escala.glasgow.backgroundGet");
                if (total <= 8) {
                    return "bg-rojo-critico-light";
                }
                else if (total >= 9 && total <= 13) {
                    return "bg-naranja-light";
                }
                else if (total == 14) {
                    return "bg-amarillo-light";
                }
                else if (total == 15) {
                    return "bg-verde-light";
                }
            },

            evaluacion: function (total) {
                console.log("nata.fx.escala.glasgow.evaluacion");
                if (total <= 8) {
                    return "SEVERO";
                }
                else if (total >= 9 && total <= 13) {
                    return "MODERADO";
                }
                else if (total == 14) {
                    return "LEVE";
                }
                else if (total == 15) {
                    return "PACIENTE NORMAL";
                }
            }
        },

        karnofsky: {

            backgroundGet: function (total) {
                //console.log("nata.fx.escala.karnofsky.backgroundGet");
                if (total >= 60) {
                    return "bg-verde-light";
                }
                else {
                    return "bg-rojo-light";
                }
            },

            evaluacion: function (total) {
                console.log("nata.fx.escala.karnofsky.evaluacion");
                if (total == 100) {
                    return "Normal: sin quejas, sin indicios de enfermedad";
                }
                else if (total < 100 && total >= 90) {
                    return "Actividades normales, pero con signos y síntomas leves de enfermedad";
                }
                else if (total < 90 && total >= 80) {
                    return "Actividad normal con esfuerzo, con algunos signos síntomas de enfermedad";
                }
                else if (total < 80 && total >= 70) {
                    return "Capaz de cuidarse, pero incapaz de llevar a término actividades normales o trabajo activo";
                }
                else if (total < 70 && total >= 60) {
                    return "Requiere atención ocasional, pero puede cuidarse a si mismo";
                }
                else if (total < 60 && total >= 50) {
                    return "Requiere gran atención, incluso de tipo médico. Encamado menos del 50% del día";
                }
                else if (total < 50 && total >= 40) {
                    return "Inválido, incapacitado, necesita cuidados y atenciones especiales. Encamado más del 50% del día";
                }
                else if (total < 40 && total >= 30) {
                    return "Inválido grave, severamente incapacitado, tratamiento de soporte";
                }
                else if (total < 30 && total >= 20) {
                    return "Encamado por completo, paciente muy grave, necesita hospitalización y tratamiento activo";
                }
                else if (total < 20 && total >= 10) {
                    return "Moribundo";
                }
                else {
                    return "Fallecido";
                }
            }
        },

        news: {

            backgroundGet: function (total) {
                console.log("nata.fx.escala.news.backgroundGet");
                if (total <= 4) {
                    return "bg-verde-light";
                }
                else if (total >= 5) {
                    return "bg-rojo-light";
                }
            },

            calcular: function (nw_fr, nw_so, nw_tas, nw_fc, nw_t) {
                console.log("nata.fx.escala.news.calcular");

                let frecuenciaArterial, saturacionOxigeno, tensionArterialSistolica, 
                    frecuenciaCardiaca, temperatura;

                if (parseFloat(nw_fr) <= 8) {
                    frecuenciaArterial = 3;
                }
                else if (parseFloat(nw_fr) >= 9 && parseFloat(nw_fr) <= 11 ) {
                    frecuenciaArterial = 1;
                }
                else if (parseFloat(nw_fr) >= 12 && parseFloat(nw_fr) <= 20) {
                    frecuenciaArterial = 0;
                }
                else if (parseFloat(nw_fr) >= 21 && parseFloat(nw_fr) <= 24) {
                    frecuenciaArterial = 2;
                }
                else if (parseFloat(fr) >= 25) {
                    frecuenciaArterial = 3;
                }

                if (parseFloat(nw_so) <= 91) {
                    saturacionOxigeno = 3;
                }
                else if (parseFloat(nw_so) >= 92 && parseFloat(nw_so) <= 93) {
                    saturacionOxigeno = 2;
                }
                else if (parseFloat(nw_so) >= 94 && parseFloat(nw_so) <= 95) {
                    saturacionOxigeno = 2;
                }
                else if (parseFloat(nw_so) >= 96) {
                    saturacionOxigeno = 0;
                }

                if (parseFloat(nw_tas) <= 90) {
                    tensionArterialSistolica = 3;
                }
                else if (parseFloat(nw_tas) >= 91 && parseFloat(nw_tas) <= 100) {
                    tensionArterialSistolica = 2;
                }
                else if (parseFloat(nw_tas) >= 101 && parseFloat(nw_tas) <= 110) {
                    tensionArterialSistolica = 1;
                }
                else if (parseFloat(nw_tas) >= 111 && parseFloat(nw_tas) <= 219) {
                    tensionArterialSistolica = 0;
                }
                else if (parseFloat(nw_tas) > 220) {
                    tensionArterialSistolica = 3;
                }

                if (parseFloat(nw_fc) <= 40) {
                    frecuenciaCardiaca = 3;
                }
                else if (parseFloat(nw_fc) >= 41 && parseFloat(nw_fc) <= 50) {
                    frecuenciaCardiaca = 1;
                }
                else if (parseFloat(nw_fc) >= 51 && parseFloat(nw_fc) <= 90) {
                    frecuenciaCardiaca = 0;
                }
                else if (parseFloat(nw_fc) >= 91 && parseFloat(nw_fc) <= 110) {
                    frecuenciaCardiaca = 1;
                }
                else if (parseFloat(nw_fc) >= 111 && parseFloat(nw_fc) <= 130) {
                    frecuenciaCardiaca = 2;
                }
                else if (parseFloat(nw_fc) >= 131) {
                    frecuenciaCardiaca = 3;
                }

                if (parseFloat(nw_t) <= 35) {
                    temperatura = 3;
                }
                else if (parseFloat(nw_t) >= 35.1 && parseFloat(nw_t) <= 36) {
                    temperatura = 1;
                }
                else if (parseFloat(nw_t) > 36 && parseFloat(nw_t) <= 38) {
                    temperatura = 0;
                }
                else if (parseFloat(nw_t) > 38 && parseFloat(nw_t) <= 39) {
                    temperatura = 1;
                }
                else if (parseFloat(nw_t) > 39) {
                    temperatura = 3;
                }

                console.log(frecuenciaArterial, saturacionOxigeno, tensionArterialSistolica, frecuenciaCardiaca, temperatura);
                return frecuenciaArterial + saturacionOxigeno + tensionArterialSistolica + frecuenciaCardiaca + temperatura;
            },

            evaluacion: function (total) {
                console.log("nata.fx.escala.news.evaluacion");
                if (total <= 4) {
                    return "El paciente puede iniciar o continuar en seguimiento por auto monitoreo en el domicilio";
                }
                else if (total >= 5) {
                    return "El paciente se debe remitir a nivel hospitalario";
                }
            },

            total: function (objectNews) {
                console.log("nata.fx.escala.news.total");
                let total = 0;
                for (prop in objectNews) {
                    if (Object.prototype.hasOwnProperty.call(objectNews, prop)) {
                        total += parseFloat(objectNews[prop].value);
                    }
                }
                return total;
            }
        }
    },
    geo: {
        calculateDistanceCoordinate: function (lat1, lon1, lat2, lon2, unit) {
            if ((lat1 == lat2) && (lon1 == lon2)) {
                return 0;
            }
            else {
                var radlat1 = Math.PI * lat1/180;
                var radlat2 = Math.PI * lat2/180;
                var theta = lon1-lon2;
                var radtheta = Math.PI * theta/180;
                var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                if (dist > 1) {
                    dist = 1;
                }
                dist = Math.acos(dist);
                dist = dist * 180/Math.PI;
                dist = dist * 60 * 1.1515;
                if (unit=="K") { dist = dist * 1.609344 }
                // metros
                if (unit=="m") { dist = dist * 1609.34 }
                if (unit=="N") { dist = dist * 0.8684 }
                return dist;
            }
        }
    },
    signosVitales: {

        frecuenciaCardiaca: {
            escalaGet: function (valor) {
                if (app.config.dev.verbose.core) console.log("%c nata.fx.signosVitales.frecuenciaCardiaca.escalaGet ", "background:blue;color:white;font-weight:bold;font-size:11px");
                const resultado = {
                    tipo: "",
                    svg: "assets/images/icons/heart.svg",
                    label: ""
                };
                if (valor > 100) {
                    resultado.tipo = "rojo";
                    resultado.svg = "assets/images/icons/heart-rojo.svg";
                    resultado.label = "TAQUICARDIA";
                }
                else if (valor < 60) {
                    resultado.tipo = "rojo";
                    resultado.svg = "assets/images/icons/heart-rojo.svg";
                    resultado.label = "BRADICARDIA";
                }
                else {
                    resultado.tipo = "verde";
                    resultado.svg = "assets/images/icons/heart-verde.svg";
                    resultado.label = "NORMAL";
                }

                return resultado;

            }
        },

        frecuenciaRespiratoria: {
            escalaGet: function (valor) {
                console.log("nata.fx.signosVitales.frecuenciaRespiratoria.escalaGet");
                const resultado = {
                    tipo: "",
                    svg: "assets/images/icons/heart.svg",
                    label: ""
                };
                if (valor > 20) {
                    resultado.tipo = "rojo";
                    resultado.svg = "assets/images/icons/heart-rojo.svg";
                    resultado.label = "TAQUIPNEA";
                }
                else if (valor < 12) {
                    resultado.tipo = "rojo";
                    resultado.svg = "assets/images/icons/heart-rojo.svg";
                    resultado.label = "BRADIPNEA";
                }
                else {
                    resultado.tipo = "verde";
                    resultado.svg = "assets/images/icons/heart-verde.svg";
                    resultado.label = "NORMAL";
                }
                return resultado;
            }
        },

        glucometria: {
            escalaGet: function (valor) {
                console.log("nata.fx.signosVitales.saturacionOxigeno.escalaGet");
                const resultado = {
                    tipo: "gris",
                    svg: "assets/images/icons/heart-gris.svg",
                    label: ""
                };
                //return resultado;
				
                if (valor > 115) {
                    resultado.tipo = "crisis";
                    resultado.svg = "assets/images/icons/heart-crisis.svg";
                    resultado.label = "HIPERGLICEMIA";
                }
                else if (valor < 70) {
                    resultado.tipo = "rojo";
                    resultado.svg = "assets/images/icons/heart-azul.svg";
                    resultado.label = "HIPOGLICEMIA";
                }
                else {
                    resultado.tipo = "verde";
                    resultado.svg = "assets/images/icons/heart-verde.svg";
                    resultado.label = "NORMAL";
                }
                return resultado;
				
            }
        },

        imc: {
            get: function (alturaMetros, pesoKilogramos) {
                console.log("nata.fx.signosVitales.imc.get");
                return (parseFloat(pesoKilogramos) / Math.pow(parseFloat(alturaMetros), 2)).toFixed(2);
            },

            escalaGet: function (alturaMetros, pesoKilogramos) {
                console.log("nata.fx.signosVitales.imc.escalaGet");
                const imc = nata.fx.signosVitales.imc.get(alturaMetros, pesoKilogramos);
                const resultado = {
                    tipo: "",
                    svg: "assets/images/icons/heart.svg",
                    label: ""
                };
				
                if (imc < 18.5) {
                    resultado.tipo = "azul";
                    resultado.svg = "assets/images/icons/heart-azul.svg";
                    resultado.label = "BAJO PESO";
                }
                else if (imc >= 18.5 && imc < 25) {
                    resultado.tipo = "verde";
                    resultado.svg = "assets/images/icons/heart-verde.svg";
                    resultado.label = "NORMAL";
                }
                else if (imc >= 25 && imc < 30) {
                    resultado.tipo = "naranja";
                    resultado.svg = "assets/images/icons/heart-naranja.svg";
                    resultado.label = "SOBREPESO";
                }
                else if (imc >= 30) {
                    resultado.tipo = "rojo";
                    resultado.svg = "assets/images/icons/heart-rojo.svg";
                    resultado.label = "OBESO";
                }


                return resultado;
            }
        },

        saturacionOxigeno: {
            escalaGet: function (valor) {
                console.log("nata.fx.signosVitales.saturacionOxigeno.escalaGet");
                const resultado = {
                    tipo: "",
                    svg: "assets/images/icons/heart.svg",
                    label: ""
                };
                if (parseFloat(valor) <= 85) {
                    resultado.tipo = "crisis";
                    resultado.svg = "assets/images/icons/heart-crisis.svg";
                    resultado.label = "HIPOXIA GRAVE";
                }
                else if (valor <= 90) {
                    resultado.tipo = "rojo";
                    resultado.svg = "assets/images/icons/heart-rojo.svg";
                    resultado.label = "HIPOXIA MODERADA";
                }
                else if (valor < 95) {
                    resultado.tipo = "naranja";
                    resultado.svg = "assets/images/icons/heart-naranja.svg";
                    resultado.label = "HIPOXIA LEVE";
                }
                else {
                    resultado.tipo = "verde";
                    resultado.svg = "assets/images/icons/heart-verde.svg";
                    resultado.label = "NORMAL";
                }
                return resultado;
            }
        },

        temperatura: {
            escalaGet: function (valor) {
                console.log("nata.fx.signosVitales.temperatura.escalaGet");
                const resultado = {
                    tipo: "",
                    svg: "assets/images/icons/heart.svg",
                    label: ""
                };
                if (valor >= 38) {
                    resultado.tipo = "rojo";
                    resultado.svg = "assets/images/icons/heart-rojo.svg";
                    resultado.label = "FIEBRE";
                }
                else if (valor < 36) {
                    resultado.tipo = "azul";
                    resultado.svg = "assets/images/icons/heart-azul.svg";
                    resultado.label = "HIPOTERMIA";
                }
                else {
                    resultado.tipo = "verde";
                    resultado.svg = "assets/images/icons/heart-verde.svg";
                    resultado.label = "NORMAL";
                }
                return resultado;
            }
        },

        tensionArterial: {

            escalaGet: function (valor) {
                console.log("nata.fx.signosVitales.tensionArterial.escalaGet");
                const resultado = {
                    tipo: "",
                    svg: "assets/images/icons/heart.svg",
                    label: ""
                };
                let tensionArterial = [];
                if (valor.toString().indexOf("/") == -1) {
                    tensionArterial[0] = valor.s;
                    tensionArterial[1] = valor.d;
                }
                else {
                    tensionArterial = valor.split("/");
                }	

                if ( tensionArterial[0] < 80 || tensionArterial[1] < 60 ) {
                    resultado.color  = "color-verde";
                    resultado.tipo = "tension-baja";
                    resultado.svg = "assets/images/icons/heart-bajo.svg";
                    resultado.label = "HIPOTENSIÓN";
                    return resultado;
                }

                if ( (tensionArterial[0] >= 80) && (tensionArterial[0] < 120)
					|| (tensionArterial[1] >= 60) && (tensionArterial[1] < 80)) {
                    resultado.color  = "color-verde-oscuro"; 
                    resultado.tipo = "tension-normal";
                    resultado.svg = "assets/images/icons/heart-normal.svg";
                    resultado.label = "NORMAL";
                    return resultado;
                }

                if ( (tensionArterial[0] >= 120) && (tensionArterial[0] < 140)
					|| (tensionArterial[1] >= 80) && (tensionArterial[1] < 90)) {
                    resultado.color = "color-amarillo";  
                    resultado.tipo = "tension-elevada";
                    resultado.svg = "assets/images/icons/heart-elevada.svg";
                    resultado.label = "PREHIPERTENSIÓN";
                    return resultado;
                }		

                if ( (tensionArterial[0] >= 140) && (tensionArterial[0] < 160)
					|| (tensionArterial[1] >= 90) && (tensionArterial[1] < 100)) {
                    resultado.color  = "color-naranja";   
                    resultado.tipo = "tension-hta-estadio1";
                    resultado.svg = "assets/images/icons/heart-hta-estadio-1.svg";
                    resultado.label = "HTA Grado 1";
                    return resultado;
                }

                if ( (tensionArterial[0] >= 160) && (tensionArterial[0] < 180)
					|| (tensionArterial[1] >= 100) && (tensionArterial[1] < 110)) {
                    resultado.color  = "color-rojo";
                    resultado.tipo = "tension-hta-estadio2";
                    resultado.svg = "assets/images/icons/heart-hta-estadio-2.svg";
                    resultado.label = "HTA Grado 2";
                    return resultado;
                }
				
                if ( tensionArterial[0] >= 180 || tensionArterial[1] >= 110) {
                    //resultado.color  = "color-rojo";
                    resultado.tipo = "tension-hta-crisis";
                    resultado.svg = "assets/images/icons/heart-hta-crisis.svg";
                    resultado.label = "Crisis Hipertensiva";
                    return resultado;
                }

            }
        }
    },
    json: {
        array: {

            sort: function (array, key) {
                if (app.config.dev.verbose.secundario) console.log("nata.fx.json.array.sort");
                return array.sort(function (a, b) {
                    const x = a[key]; const y = b[key];
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                });
            },

            sortByTwo: function (firstKey, secondKey) {
                console.log("** nata.fx.json.array.sortByTwo **");
                return function (a, b) {
                    if (a[firstKey] > b[firstKey]) {
                        return -1;
                    } else if (a[firstKey] < b[firstKey]) {
                        return 1;
                    }
                    else {
                        if (a[secondKey] > b[secondKey]) {
                            return 1;
                        } else if (a[secondKey] < b[secondKey]) {
                            return -1;
                        } else {
                            return 0;
                        }
                    }
                };
            }
        },

        clean: function (json) {
            console.log("** nata.fx.json.clean **");
            for (const key in json) {
                // eslint-disable-next-line no-prototype-builtins
                if (Object.prototype.hasOwnProperty.call(json, key)) {
                    if (typeof json[key] == "undefined") {
                        json[key] = "";
                    }
                    else if (json[key] == null) {
                        json[key] = "";
                    }					
                }				
            }
            return json;
        },

        isValid: function (str) {
            console.log("nata.fx.json.isValid");
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        },

        // nata.fx.json.ordenar
        ordenar: function (data, index) {
            console.log("nata.fx.json.ordenar");
            return data.sort(function (a, b) {
                if (a[index] > b[index]) {
                    return 1;
                }
                if (a[index] < b[index]) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });
        },

        ordenarNumerico: function (data, index) {
            console.log("nata.fx.json.ordenarNumerico");
            return data.sort(function (a, b) {
                if ( parseFloat(a[index]) > parseFloat(b[index]) ) {
                    return 1;
                }
                if (parseFloat(a[index]) < parseFloat(b[index]) ) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });
        }
    },
    /**
     *
     * @param {string} msg Mensaje a mostrar en el log
     * @param {string} color Color background badge o label: error|success|warning|info|danger
     * @param {object} object data a mostrar en el mensaje
     * @param {boolean} trace  si se muestra el trace
     */
    log: function (msg, color, object = "", trace = false) {
        //console.trace("nata.fx.log");
        let css = "",
            paint = { // default colors
                clr: "#212121",
                bgc: "#b0bec5"
            },
            colors = {
                error: { clr: "#ffebee", bgc: "#FF0000" }, // red
                success: { clr: "#e8f5e9", bgc: "#2e7d32" }, // green
                warning: { clr: "#fff", bgc: "#efb413" },
                info: { clr: "#fff", bgc: "#651fff" }, // purple,
                danger: { clr: "#fff", bgc: "#FF0000" } // danger,
            };

        // overriting default colors if color given
        // eslint-disable-next-line no-prototype-builtins
        if (colors.hasOwnProperty(color)) { paint.clr = colors[color].clr; paint.bgc = colors[color].bgc; }
        css = "color:" + paint.clr + ";font-weight:bold; background-color: " + paint.bgc + "; padding: 3px 6px; border-radius: 2px;";

        if (trace) {
            console.trace("%c" + msg, css, object);
        }
        else {
            console.log("%c" + msg, css, object);
        }
    },
    mapeo: {
        sanitasCovid: {
            get: function (index, value) {
                console.log(index, value);
                let data = nata.localStorage.getItem("mapeo-sanitas-covid");
                if (data.length == 0) {
                    swal("No se ha descargado del servidor: mapeo-sanitas-covid", "", "error");
                    return false;
                }
                data = data.filter(function (record) {
                    return record.index == index
						&& record.valueMasiva == value;
                });

                if (data.length == 0) {
                    swal("No se ha encontrado data para el mapeo", "index: " + index + " , value: " + value + "\nPor favor contacta a soporte", "error");
                    return false;
                }
                else {
                    return data[0].value;
                }
            }
        }
    },
    paciente: {
        nombreGet: function (data) {
            console.log("nata.fx.paciente.nombreGet");
            //console.log(data);
            if (typeof data == "undefined") {
                swal("Error de parámetros", "No se ha recibido el parámetro data", "error");
                console.error("No se ha recibido el parámetro data");
                return "";
            }

            let primerNombre = "";
            let segundoNombre = "";
            let primerApellido = "";
            let segundoApellido = "";

            if (typeof data.pac_primer_nombre !== "undefined" && data.pac_primer_nombre !== null) primerNombre = data.pac_primer_nombre;
            if (typeof data.pac_segundo_nombre !== "undefined" && data.pac_segundo_nombre !== null) segundoNombre = data.pac_segundo_nombre;
            if (typeof data.pac_primer_apellido !== "undefined" && data.pac_primer_apellido !== null) primerApellido = data.pac_primer_apellido;
            if (typeof data.pac_segundo_apellido !== "undefined" && data.pac_segundo_apellido !== null) segundoApellido = data.pac_segundo_apellido;

            if (typeof data.primerNombre !== "undefined" && data.primerNombre !== null) primerNombre = data.primerNombre;
            if (typeof data.segundoNombre !== "undefined" && data.segundoNombre !== null) segundoNombre = data.segundoNombre;
            if (typeof data.primerApellido !== "undefined" && data.primerApellido !== null) primerApellido = data.primerApellido;
            if (typeof data.segundoApellido !== "undefined" && data.segundoApellido !== null) segundoApellido = data.segundoApellido;

            if (typeof data.pn !== "undefined" && data.pn !== null) primerNombre = data.pn;
            if (typeof data.sn !== "undefined" && data.sn !== null) segundoNombre = data.sn;
            if (typeof data.pa !== "undefined" && data.pa !== null) primerApellido = data.pa;
            if (typeof data.sa !== "undefined" && data.sa !== null) segundoApellido = data.sa;

            let nombre = "";
            if (primerNombre !== "") nombre = primerNombre;
            if (segundoNombre !== "") nombre += " " + segundoNombre;
            if (primerApellido !== "") nombre += " " + primerApellido;
            if (segundoApellido !== "") nombre += " " + segundoApellido;

            return nombre;

        }
    },
    string: {

        clean: function (value, boolBr) {
            if (app.config.development.verbose == 2) {
                console.log("nata.fx.string.clean");
            }
            if (app.config.development.verbose == 2) {
                console.log("nata.fx.string.clean");
            }

            if (typeof value == "undefined") {
                return "";
            }
            //console.log(value);
            value = value.replace("<br/>", " ");
            if (value.indexOf("<br/>") != -1) {
                return nata.fx.string.clean(value);
            }

            if (boolBr) {
                value = value.replace(/<br\s*\/?>/gi, "");
            }

            return value;
        },

        left: function (str, chr) {
            console.log("nata.fx.string.left");
            return str.slice(0, chr - str.length);
        },

        right: function (str, chr) {
            console.log("nata.fx.string.right");
            return str.slice(str.length - chr, str.length);
        }
    },
    url: {

        base: {
            getBaseUrl: function () {
                if (app.config.development.verbose == 2) {
                    console.log("nata.fx.url.base.getBaseUrl");
                }

                var re = new RegExp(/^.*\//);
                var result = re.exec(window.location.href)[0];
                result = result.replace("///", "/");

                result = result.replace("index.html", "");

                if (result == "http://localhost:9090/") {
                    result += "index.html";
                }

                return result;
            }
        },

        friendly: {
            get: function () {
                console.log("nata.fx.url.friendly.get");
                const arrUrl = window.location.href.split("/");
                if (arrUrl.length == 0) {
                    return "";
                }
                else {
                    return (arrUrl[arrUrl.length-1]);
                }
            }
        },

        param: {
            get: function(param) {
                console.log("nata.fx.url.param.get", param);
                const href = window.location.href.toString();
                var value = null, temp;
                if (href.includes("?" + param + "=")) {
                    temp = href.substring(href.indexOf("?" + param));
                    temp = temp.replace("?" + param + "=", "");
                }
                if (href.includes("&" + param + "=")) {
                    temp = href.substring(href.indexOf("?" + param));
                    temp = temp.replace("&" + param + "=", "");
                }
                if (typeof temp != "undefined") {
                    if (temp.includes("?")) {
                        value = temp.substring(0, temp.indexOf("?"));
                    }
                    if (temp.includes("&")) {
                        value = temp.substring(0, temp.indexOf("&"));
                    }
                }
                return value;
            }
        }
    }
};

// eslint-disable-next-line no-unused-vars
const dollarUS = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
});

// eslint-disable-next-line no-unused-vars
const numberDecimal = Intl.NumberFormat("en-US", {
    style: "decimal",
    currency: "USD",
    maximumFractionDigits: 0
});

// eslint-disable-next-line no-unused-vars
const percent = Intl.NumberFormat("en-US", {
    style: "percent",
    currency: "USD",
    maximumFractionDigits: 2
});

Date.prototype.toDateInputValue = (function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
});

Date.prototype.isValid = function () {
              
    // If the date object is invalid it
    // will return 'NaN' on getTime() 
    // and NaN is never equal to itself.
    return this.getTime() === this.getTime();
};

Array.prototype.sum = function ( prop ) {
    return nata.fx.array.sum( this, prop );
};

function uniqueID(){
    function chr4(){
        return Math.random().toString(16).slice(-4);
    }
    return chr4() + chr4() +
      "-" + chr4() +
      "-" + chr4() +
      "-" + chr4() +
      "-" + chr4() + chr4() + chr4();
}

nata.fx.async = function (u, c) {
    const d = document, t = "script",
        o = d.createElement(t),
        s = d.getElementsByTagName(t)[0];
    o.src = u;
    if (c) { o.addEventListener("load", function (e) { c(null, e); }, false); }
    s.parentNode.insertBefore(o, s);
};

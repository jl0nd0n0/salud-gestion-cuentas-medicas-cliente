/* globals nata, app, $, session */

nata.dev = {

    robot: {

        config: {
            // nata.dev.robot.config.time
            time: 0.5
        },

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

        helper: {

            fill: async function (ip, id, type, value) {
                console.log("nata.dev.robot.helper.fill");
                console.log(ip, id, type, value);
                var element;
                if (id != "") {
                    console.log("id ..");
                    element = document.getElementById(id);
                }
                else {
                    console.log("ip ..");
                    element = document.getElementById("control-" + ip);
                }

                if (typeof value != "undefined") value = value.replace(/(\r\n|\n|\r)/gm, "");
                if (value === null) {
                    return false;
                }

                //console.log(element);
                if (type == "combo") {
                    console.log(element, value);
                    //element.style.background = "#f1f1f1";
                    console.log(value.toString());
                    if (element === null) {
                        return false;
                    }
                    element.value = "" + value.toString().trim();
                    element.dispatchEvent(new Event("change"));
                }

                else if (type == "datepicker") {
                    //console.log(element, value);
                    //element.value = value;
                    element.click();
                    await new Promise(r => setTimeout(r, 1 * 1000));
                    session.datepicker[ip].setDate(new Date(), true);
                    session.guardar(new Date(), element, session.dataset.apuntador.documento.is, ip, undefined);
                    await new Promise(r => setTimeout(r, 1 * 1000));
                }

                else if (type == "text") {
                    element.value = "" + value.toString().trim();
                    setTimeout(function () {
                        element.focus();
                        element.select();
                        //$(element).trigger("blur");

                        setTimeout(function () {
                            nata.ui.form.text.blur(element);
                            //element.blur();
                            //$(element).trigger("focusout");
                            //element.dispatchEvent(new Event("change"));
                        }, 0.5 * 1000);

                    }, 0.25 * 1000);

                    /*
					element.focus();
					element.select();
					await new Promise(r => setTimeout(r, 1 * 1000));
					element.blur();
					*/
                    /*
					setTimeout(() => {

					}, 1 * 1000);
					*/

                    //
                }

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
                    while (document.getElementById("buttonSeccionContinuar").disabled);
                    document.getElementById("buttonSeccionContinuar").click();
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
            },

            scroll: function (element) {
                $("html, body").animate({
                    scrollTop: $(element).offset().top
                }, 2000);
            }
        },

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
        },

        show: function () {
            console.log("nata.dev.robot.show");
            const devToolbar = document.getElementById("devToolbar");
            devToolbar.render("templateButtonRobot");
            devToolbar.style.display = "inline-block";
            document.getElementById("buttonRobot").style.display = "block";
        }

    },

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
        session.product.name = app.fx.string.clean(dataDocumento.t);
        session.product.description = dataDocumento.d;
        session.order.amount = dataDocumento.p;
        //#endregion

        session.documento = dataDocumento;

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
    openWindow: function (width, height, url = "http://localhost:8080/") {
        console.log("nata.dev.openWindow");

        return new Promise(function (resolve, reject) {
            var vheight = "900";
            if (typeof height != "undefined") {
                vheight = height;
            }

            setTimeout(function () {
                const myWindow = window.open(url, "window" + nata.dev.dataset.instances++, "Height = " + vheight + ", width = " + width + ", estado = si, toolbar = si, menubar = si, location = no, top = " + (nata.dev.dataset.instances * 5) + ", left = " + (nata.dev.dataset.instances * 5));
                //const myWindow = window.open ("http://localhost:8080", "window" + nata.dev.dataset.instances++, "Height = 900, width = " + width + ", estado = si, toolbar = si, menubar = si, location = no, top = " + (nata.dev.dataset.instances*5) + ", left = " + (nata.dev.dataset.instances*3));
                //myWindow.opener.document.title = size;
                //alert(myWindow.opener.document.title);
            }, 1 * 1000);
            resolve();
        });
    },

    responsive: {
        mobile: function () {
            console.log("nata.dev.responsive.mobile");
            nata.dev.openWindow(412)
            .then(() => nata.dev.openWindow(320))
            .then(() => nata.dev.openWindow(340))
            .then(() => nata.dev.openWindow(360))
            .then(() => nata.dev.openWindow(375))
            .then(() => nata.dev.openWindow(480))
            .then(() => nata.dev.openWindow(575))
            .then(() => nata.dev.openWindow(768));
        },

        laptop: function () {
            console.log("nata.dev.responsive.laptop");
            nata.dev.openWindow(800)
                .then(() => nata.dev.openWindow(991))
                .then(() => nata.dev.openWindow(1200))
                .then(() => nata.dev.openWindow(1366))
                .then(() => nata.dev.openWindow(1440))
                .then(() => nata.dev.openWindow(1680))
                .then(() => nata.dev.openWindow(1920));
        }
    }
};

/*
const accountCreate = nata.dev.robot.api.accountCreate;
const api = ["accountCreate"];
*/
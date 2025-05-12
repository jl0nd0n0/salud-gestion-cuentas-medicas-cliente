/* globals app */

app.electra = {

    chat: function (mensaje) {
        console.log("app.electra.chat");
        const chatMensaje = document.querySelector("#chatBubble");
        chatMensaje.style.display = "block";
        chatMensaje.innerHTML = mensaje;

        setTimeout(() => {
            chatMensaje.style.display = "none";
            chatMensaje.innerHTML = "";
        }, 25 * 1000);
    } 

    /*
    say: function () {
        session.protocol = [
            {
                s: 1,
                bubbleElectra: {
                    m: `
                        <b>Hola!, soy Electra</b><br>
                        Puedo analizar la cartera consolidada para ti<br>
                        <div class="w-100 text-center">
                            <button type="button"
                                class="btn btn-primary min-width-240px mt-2 button-cartera-analizar">
                                Analiza la cartera
                            </button>
                        </div>

                        <div class="w-100 mt-2">
                            O si deseas puedo analizar la cartera para cada administradora
                            <div class="w-100 text-center mt-2">
                                <button type="button"
                                    class="btn btn-primary min-width-240px d-inline-block button-muestrame">
                                    Muestrame
                                </button>
                                <div id="containerMuestrame" class="mt-1"></div>
                            </div>
                        </div>
                    `,
                    h: 260

                },
                c: "#F1FAFF"
            },
            {
                s: 2,
                bubbleElectra: {
                    e1: {
                        m: `
                            <span class="line-height-19em">
                                <b>
                                    La <span class="badge text-bg-secondary">IPS</span> ha reportado
                                    <span class="badge rounded-pill ${session.dataset.bgClass} badge-circular30-diferencia">
                                        $${numberDecimal.format(session.dataset.totalDiferencia)}
                                    </span> pesos
                                    que corresponde a un
                                    <span class="badge rounded-pill ${session.dataset.bgClass} badge-circular30-diferencia">
                                        ${numberDecimal2.format(session.dataset.porcentajeDiferencia)}%
                                    </span>
                                    más que lo reportado por las
                                    <span class="badge text-bg-secondary">administradoras</span> en los convenios.
                                </b>
                            </span>
                            Esto puede ser explicado por:<br><br>
                            <ul>
                                <li>
                                    Tu cartera ha sido devuelta o presenta glosa total o parcial
                                </li>
                                <li>
                                    <b>Devoluciones</b> por problemas en la radicación de las cuentas médicas
                                </li>
                                <li>
                                    Tus cuentas presentan glosa administrativa
                                </li>
                                <li>
                                    Tus cuentas presentan glosa de pertinencia
                                </li>
                            </ul>
                        `,
                    },
                    w: 150,
                    h: 315
                },

                c: "#F8F5FF",
                callbackEnter: function () {
                    console.log("callback ...");
                    const elements = document.querySelectorAll(".badge-circular30-diferencia");
                    console.log(elements);

                    let i;
                    for (i=0; i<elements.length; i++) {
                        elements[i].classList.remove("pulse", "red");
                        elements[i].classList.add("pulse", "red");
                    }
                },
                callbackExit: function () {
                    console.log("callback ...");
                    const elements = document.querySelectorAll(".badge-circular30-diferencia");
                    console.log(elements);

                    let i;
                    for (i=0; i<elements.length; i++) {
                        elements[i].classList.remove("pulse", "red");
                    }
                }
            },
            {
                s: 3,
                bubbleTitle: {
                    m: `
                        En <b>Crescend</b> te ayudamos a gestionar más fácil tu cartera, mejorando los indicadores
                        financieros.<br><b>Tu tienes el control!</b><br>
                    `,
                },
                bubbleElectra: {
                    e1: {
                        m: `
                            <ul>
                                <li>
                                    <span class="badge badge bg-dark">Generamos tus cuentas médicas</span>
                                    ajustadas a la reglamentación vigente, sus anexos técnicos y los protocolos de las administradoras en
                                    sus convenios.
                                </li>
                                <li>
                                    <span class="badge badge badge-whitespace-pre bg-dark">Optimizamos tu proceso administrativo de prestación</span>
                                    asegurando la correspondencia entre los servicios prestados y
                                    las cuentas médicas radicadas.
                                    <b>evitando glosa administrativa</b>.
                                </li>
                                <li>
                                    <span class="badge badge badge-whitespace-pre bg-dark text-left">Te informamos cómo ajustar tu protocolo médico</span>
                                    <b>Auditaremos</b> tus cuentas médicas y <b>ajustaremos</b> tu proceso de prestación, asegurando
                                    que los servicios prestados se ajusten a los protocolos médicos establecidos.
                                    <b>Evitando glosa de pertinencia</b>.
                                </li>
                            </ul>
                        `,
                    },
                    w: 150,
                    h: 370
                },
                c: "#F1FAFF"
            }
        ];
    },
    play: function (step) {
        console.log("app.electra.play");
        const parameters = session.protocol.filter(function (record) {
            return record.s == step;
        })[0];
        console.log(parameters.s);
        console.log(session.protocol.length);

        let boolSiguiente = true;
        if (parameters.s == session.protocol.length) {
            boolSiguiente = false;
        }

        //#region message bubble main
        let element = document.querySelector("#bubbleTitle");
        if (element !== null) {
            if (typeof parameters.bubbleTitle == "undefined") {
                element.style.display = "none";

            }
            else {
                element.style.display = "block";
                element.innerHTML = parameters.bubbleTitle.m;
            }
        }
        //#endregion message bubble main

        element = document.querySelector("#bubbleElectra");
        let message;
        if (session.dataset.totalDiferencia > 0) {
            if (typeof parameters.bubbleElectra.e1 == "undefined") {
                message = parameters.bubbleElectra.m;
            }
            else {
                message = parameters.bubbleElectra.e1.m;
            }
        }
        else {
            console.error("No se ha implementado el escenario 2 en el paso: " + step);
            //message = parameters.bubbleElectra.e2.m;
        }

        if (step > 1) {
            if (boolSiguiente) {
                message += `
                    <div class="w-100 text-center">
                        <button type="button"
                            id="buttonAnterior"
                            class="btn btn-primary min-width-110px mt-2 d-inline-block">
                            Anterior
                        </button>&nbsp;&nbsp;
                        <button type="button"
                            id="buttonSiguiente"
                            class="btn btn-primary min-width-110px mt-2 d-inline-block">
                            Siguiente
                        </button>
                    </div>
                `;
            }
            else {
                message += `
                    <div class="w-100 text-center">
                        <button type="button"
                            id="buttonAnterior"
                            class="btn btn-primary min-width-110px mt-2 d-inline-block">
                            Anterior
                        </button>
                    </div>
                `;
            }
        }

        if (element !== null) {
            element.innerHTML = message;
            const style = element.style;
            style.witdh = parameters.bubbleElectra.w + "px";
            style.height = parameters.bubbleElectra.h + "px";
            if (typeof parameters.c == "undefined") console.error("No ha llegado el color en el step " + step);
            style.setProperty("--bg-bubble-after", parameters.c);
            style.backgroundColor = parameters.c;
        }

        console.log(parameters);
        if (typeof parameters.callbackEnter == "function") {
            parameters.callbackEnter();
        }

        element = document.querySelector("#buttonSiguiente");
        if (element !== null) {
            element.addEventListener("click", function() {
                console.log("#buttonSiguiente.click");
                if (typeof parameters.callbackExit == "function") {
                    parameters.callbackExit();
                }
                app.electra.play(++session.step);
            });
        }

        element = document.querySelector("#buttonAnterior");
        if (element !== null) {
            element.addEventListener("click", function() {
                console.log("#buttonAnterior.click");
                if (typeof parameters.callbackExit == "function") {
                    parameters.callbackExit();
                }
                app.electra.play(--session.step);
                console.log(session.step);
            });
        }

        //#region evento delegado

        document.addEventListener("click", function(event) {
            console.log("document.click");
            const element = event.target;
            if (element.classList.contains("button-cartera-analizar")) {
                console.log(".button-cartera-analizar.click");
                session.step = 1;
                app.electra.play(++session.step);
            }
            else if (element.classList.contains("button-muestrame")) {
                console.log(".button-muestrame.click");
                const elements = document.querySelectorAll(".button-analizar-administrador");
                for (let i = 0; i < elements.length; i++) {
                    elements[i].classList.remove("pulse", "blue");
                    elements[i].classList.add("pulse", "blue");
                }
                document.querySelector("#containerMuestrame").innerHTML = "Haz click en el botón Analizar de la administradora ...";
            }
        });
        //#endregion evento delegado

        element = null;
    }
    */
};

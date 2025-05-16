/* globals */

// eslint-disable-next-line no-unused-vars
class nataUIElectra extends HTMLElement {
    constructor() {
        // Siempre llamar primero a super en el constructor
        super();

        //const options = nata.sessionStorage.getItem("widget");

        const self = this;
        /*
        if (typeof options == "undefined") {
            console.error("No se han recibido opciones para electra");
            return false;
        }

        if (typeof options.protocol == "undefined") {
            console.error("No se ha recibido el protocolo para electra");
            return false;
        }
        */

        //self.element = options.element;
        //self.protocol = options.protocol;
        //self.step = 1;

        self.render();

        //#region update styles
        /*
        if (typeof options.style !== "undefined") {
            let prop;
            for (prop in options.style) {
                if (Object.prototype.hasOwnProperty.call(options.style, prop)) {
                    //console.log(document.querySelector("#imageRobot").style);
                    document.querySelector("#imageRobot").style[prop] = options.style[prop];
                    if (prop == "top") {
                        document.querySelector("#chatBubble").style[prop] = "174px";
                    }
                    else {
                        document.querySelector("#chatBubble").style[prop] = options.style[prop];
                    }
                    
                    
                }
            }
        }
        */
        //#endregion update styles
    }

    message(message, bgColor = "") {
        const element = document.querySelector("#chatBubble");
        if (element !== null) {
            if (bgColor !== "") {
                element.classList.remove(bgColor);
                element.classList.add(bgColor);
            }
            element.style.display = "block";
            element.innerHTML = message;
        }
    }

    render() {
        console.log("%c index", "background:red;color:white;font-weight:bold;font-size:11px");
        const self = this;
        //console.log(self.element);
        const htmlStyle = `
            <style>

                :root {
                    --bgcolor-bubble-1: #F1FAFF;
                    --bgcolor-bubble-2: rgba(255, 0, 16, 0.05);
                }

                nata-ui-electra {
                    z-index: 999999;
                    position: fixed;
                    top: 30px;
                    right: 4px;
                    display: none;
                }

                .robot {
                    position:relative;
                }

                .image-robot {
                    width: 89px;
                    height: 157px;
                }

                #chatBubble {
                    position: absolute;
                    padding: 20px;
                    width:300px;
                    z-index: 2;

                    right: 28px;
                    top: 155px;

                    display: none;

                }
                
                .ui-bubble {
                    background: #F1FAFF;
                    border-radius: 10px;
                    color: #071437;
                    font-size: 1rem;
                    line-height: 1.5em;
                    padding: 15px 20px;
                    text-align: left;
                }

                .bubble:after {
                    content: '';
                    position: absolute;
                    display: block;
                    width: 0;
                    z-index: 1;
                    border-style: solid;
                    border-width: 0 0 20px 20px;
                    border-color: transparent transparent  #F1FAFF transparent;
                    top: -20px;
                    left: 50%;
                    margin-left: -10px;
                }

                .bgcolor-1 {
                    background-color: var(--bgcolor-bubble-1)!important;
                }

                .bgcolor-2 {
                    background-color: var(--bgcolor-bubble-2);
                }
            </style>
        `;
        self.innerHTML = `
            ${htmlStyle}
            <div class="w-100 position-relative">
                <!--
                <lottie-player
                    src="robot.json"
                    autoplay
                    loop
                ></lottie-player>
                !-->
                <img id="imageRobot" class="image-robot" src="assets/nata/ui/electra/robot.gif" alt="Electra">
                <div id="chatBubble" class="ui-bubble bubble scale-in-center"></div>
            </div>
        `;
        //self.play();
        console.log(self.element);
    }

    play() {
        console.log("app.electra.play");
        const self = this;
        const parameters = self.protocol.filter(function (record) {
            return record.s == self.step;
        })[0];
        console.log(parameters);
        console.log(self.protocol.length);

        let boolSiguiente = true;
        console.log(boolSiguiente);
        if (parameters.s == self.protocol.length) {
            boolSiguiente = false;
        }

        console.log(parameters);
        let message = parameters.chatBubble.m;
        console.log(self.step);
        if (self.step > 1) {
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
        else{
            message += `
                <div class="w-100 text-center">
                    <button type="button"
                        id="buttonSiguiente"
                        class="btn btn-primary min-width-110px mt-2 d-inline-block">
                        Siguiente
                    </button>
                </div>
            `;
        }

        element = document.querySelector("#chatBubble");
        if (element !== null) {
            //console.log(message);
            element.innerHTML = message;
            const style = element.style;
            style.witdh = parameters.chatBubble.w + "px";
            style.height = parameters.chatBubble.h + "px";
            if (typeof parameters.c == "undefined") console.error("No ha llegado el color en el step " + self.step);
            style.setProperty("--bg-bubble-after", parameters.c);
            style.backgroundColor = parameters.c;
        }

        console.log(parameters);
        if (typeof parameters.callbackEnter == "function") {
            parameters.callbackEnter();
        }

        element = document.querySelector("#buttonSiguiente");
        if (element !== null) {
            console.log("1");
            element.addEventListener("click", function () {
                console.log("#buttonSiguiente.click");
                if (typeof parameters.callbackExit == "function") {
                    parameters.callbackExit();
                }
                self.play(++self.step);
            });
        }

        element = document.querySelector("#buttonAnterior");
        if (element !== null) {
            element.addEventListener("click", function () {
                console.log("#buttonAnterior.click");
                if (typeof parameters.callbackExit == "function") {
                    parameters.callbackExit();
                }
                self.play(--self.step);
            });
        }

        //#region evento delegado
        document.addEventListener("click", function (event) {
            console.log("document.click");
            const element = event.target;
            if (element.classList.contains("button-cartera-analizar")) {
                console.log(".button-cartera-analizar.click");
                self.step = 1;
                self.play(++self.step);
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
}

customElements.define("nata-ui-electra", nataUIElectra);

/*
(function() {

    session.height = window.innerHeight;
    session.width = window.innerWidth;

    const options = {
        element: document.querySelector("#container"),
        style: {
            top: "0px",
            left: "10px"
        },
        protocol: [
            {
                s: 1,
                chatBubble: {
                    m: `
                        <h6>Hola!, soy Electra</h6><br>
                        Soy un avatar, puedo ser usada como asistente en las aplicaciones o para
                        implementar AI.<br><br>
                        Voy a enseñarte cómo puedes usarme
                    `,
                    h: 260

                },
                c: "#F1FAFF",
                //c: "#F8F5FF",
                callbackEnter: function () {},
                callbackExit: function () {}
            },
            {
                s: 2,
                chatBubble: {
                    m: `
                        Vamos a instalar mis librerias en el proyecto
                    `,
                    w: 150,
                    h: 120
                },
                c: "#F1FAFF",
                callbackEnter: function () {
                    const options = {
                        showButtons: false,
                        step: self.step,
                        style: {
                            height: "650px",
                            right: "35px",
                            top: "75px",                            
                            width: "880px"
                        }
                    };
                    new nataUIDocumentacion("electra", options);
                },
                callbackExit: function () {
                }
            },
            {
                s: 3,
                chatBubble: {
                    m: `
                        Ahora vas a mostrarme en tu app html 5
                    `,
                    w: 150,
                    h: 120
                },
                c: "#F1FAFF",
                callbackEnter: function () {
                    const options = {
                        showButtons: false,
                        step: 2,
                        style: {
                            height: "650px",
                            right: "35px",
                            top: "75px",                            
                            width: "880px"
                        }
                    }
                    new nataUIDocumentacion("electra", options);
                },
                callbackExit: function () {
                }
            }
        ]
    };
    new nataUIElectra(options);
})();
*/
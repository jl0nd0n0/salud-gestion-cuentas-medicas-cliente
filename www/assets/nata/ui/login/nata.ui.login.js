/* globals app, session, nata, swal ,axios*/

class nataUILogin extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();
        console.log("*** nataUILogin ***");
        session.flujo.push("nataUILogin constructor");
        const self = this;

        //document.querySelector("#loader").style.display = "block";
        setTimeout(function () {
            // manejar session
            console.time("inicio");
            if (typeof nata.localStorage.getItem("user") === "object" && !Array.isArray(nata.localStorage.getItem("user"))) {
                session.user = nata.localStorage.getItem("user");
                const html = "";
                self.innerHTML = html;
                self.hide();
            }
            else {
                //#region class
                document.body.style.visibility = "hidden";
                setTimeout(function () {
                    self.render();
                    document.querySelector("#loader").style.display = "none";
                }, 0.5 * 1000);
                //#endregion
            }
        }, 0.5 * 1000);
    }

    connectedCallback() {
    }

    events() {
        session.flujo.push("nataUILogin events");
        const self = this;
        const buttonPassword = document.getElementById("buttonPasswordShow");
        if (buttonPassword !== null) {
            buttonPassword.addEventListener("click", function () {
                if (document.getElementById("txtPassword").type == "text") {
                    document.getElementById("txtPassword").type = "password";
                }
                else {
                    document.getElementById("txtPassword").type = "text";
                }
            });
        }

        document.getElementById("inlineRadio1").addEventListener("click", function () {
            self.querySelector("#panelLogin").style.display = "block";
            self.querySelector("#panelRecuperar").style.display = "none";
        });

        document.getElementById("inlineRadio2").addEventListener("click", function () {
            self.querySelector("#panelLogin").style.display = "none";
            self.querySelector("#panelRecuperar").style.display = "block";
        });


        if (self.querySelector("#frmLogin") !== null) {
            self.querySelector("#frmLogin").addEventListener("submit", function (event) {
                document.querySelector("#loader").style.display = "block";
                event.stopPropagation();
                event.preventDefault();

                //document.getElementById("loader").style.display = "block";
                session.email = self.querySelector("#txtEmail").value;
                session.password = self.querySelector("#txtPassword").value;

                const data = {
                    u: session.email,
                    p: session.password
                };

                const dataSend = JSON.stringify(data);
                // const config = {
                //     headers: {
                //         "Content-Type": "application/json"
                //     }
                // };
                console.log(dataSend);
                axios.post(app.config.login.endpoint, dataSend)
                    .then(function (response) {
                        console.log(response.data);

                        const fx = function () {
                            swal(app.config.title, "No tienes acceso a esta aplicación", "error");
                            document.querySelector("#loader").style.display = "none";
                            return false;
                        };

                        if (!Array.isArray(response.data)) {
                            return fx();
                        }

                        if (response.data[0].err) {
                            return fx();
                        }
                        // document.querySelector("#imageRobot").style.display = "block";

                        session.user = response.data[0];
                        nata.localStorage.setItem("user", session.user);
                        self.hide();
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            }, true);
        }

        self.querySelector("#frmRecuperar").addEventListener("submit", function (event) {
            event.stopPropagation();
            event.preventDefault();

            document.getElementById("loader").style.display = "block";
            const email = self.querySelector("#txtEmail").value;

            if (!app.config.login.recover) {
                swal(app.config.title, "Esta opción no ha sido activada por el Equipo de Artemisa", "error");
                document.getElementById("loader").style.display = "none";
                return false;
            }

            const data = {
                e: email
            };
            const callback = function (data) {
                console.log(data);
                if (data.length > 0) {
                    swal(app.config.title, "Te hemos enviado los datos de acceso al correo", "success");
                    document.getElementById("loader").style.display = "none";
                }
                else {
                    swal(app.config.title, "No se ha creado tu cuenta. Por favor comunicate con nuestro servicio de soporte", "error");
                }
                setTimeout(function() {
                    location.reload(true);
                }, 2 * 1000);
            };
            const callbackError = function () {
                swal(app.config.title, "Ups....\nEstamos experimentando fallas, por favor comunicate con nuestro servicio de soporte", "error");
                document.getElementById("loader").style.display = "none";
                /*
                setTimeout(function() {
                    location.reload(true);
                }, 2 * 1000);
                */
            };
            nata.ajax("post", app.config.server.php + "user/sendLoginData", data, "json", callback, callbackError);

        }, true);
    }

    hide () {
        console.log("*** nataUILogin.hide ***");
        const self = this;
        session.flujo.push("nataUILogin hide");
        document.querySelector("#containerArtemisa").innerHTML = "<nata-ui-electra id=\"robot\"></nata-ui-electra>";
        self.userInfo();

        const layout = document.getElementById("layout");
        if (layout !== null){
            if (session.width <= 768) {
                layout.style.display = "block";
            }
            else {
                layout.style.display = "grid";
            }
        }

        if (typeof app.config.dev.atajo == "function") {
            app.config.dev.atajo();
        }
        else {
            app.index();
        }

        const elContainerLogin = document.querySelector("#containerLogin");
        if (elContainerLogin !== null) elContainerLogin.remove();
    }

    render() {
        session.flujo.push("nataUILogin render");
        const self = this;
        //document.querySelector("#imageRobot").style.display = "none";
        const html = `
            <style>

                #panelRecuperar {
                    display: none;
                }


                nata-ui-login {
                    display: block;
                    width: 100%;
                }

                nata-ui-login header {
                    margin: 10px;
                }

                nata-ui-login .wrapper, #panelRecuperar {
                    text-align: center;
                    max-width: 360px;
                    margin: 0 auto;
                }

                #panelLogin .logo {
                    width: 250px;
                    height: 250px;
                    overflow: hidden;
                    border-radius: 50%;
                    margin: 0 auto;
                    box-shadow: 0 4px 8px rgba(0,0,0,.05);
                    position: relative;
                    z-index: 1;
                }

                #buttonPasswordShow {
                    font-size: 12px;
                    position: absolute;
                    padding: 0.11rem 0.5rem;
                    bottom: 8px;
                    right: 10px;
                }

                #buttonLogin {
                    height: 45px;
                }

                .login .form-group {
                    margin-bottom: 20px;
                    position: relative;
                }

                .logo-artemisa {
                    width: 225px;
                }

                #iconWhatsapp {
                    height: 50px;
                    width: 50px;
                    margin: 0 auto;
                }

                #frmLogin {
                    text-align: left;
                }

                #logoApp {
                    margin: 0 auto;
                    width: 180px;
                    text-align: center;
                }

                img.icon-login {
                    height: 180px;
                    width: 180px;
                }

                img.icon-whatsapp {
                    height: 55px;
                    width: 55px;
                    margin: 0 auto;
                }

                @media only screen and(max-width: 2560px) {
                    #panelLogin {
                        width: 90%;
                        margin: 0 auto;
                    }
                }

                @media all and (max-width: 768px) {
                    #panelLogin {
                        display: inline-block;
                        padding-top: 20px;
                        width: 90%;
                        margin: 0;
                    }
                }
            </style>
            <header class="w-100">
                <img class="logo-artemisa" src="assets/images/logos/logo-producto.svg" alt="Artemisa 2023">
            </header>

            <div class="wrapper text-start">
                <div id="logoApp" class="logo">
                    <img class="icon-login" src="assets/images/icons/animate/icon.gif" alt="">
                </div>

                <div class="w-100 my-2 text-center">
                    <img src="assets/images/logos/logo-cliente.png?dev=5" alt="Crescend">
                </div>

                <div class="form-check form-check-inline mt-3">
                    <input id="inlineRadio1" class="form-check-input" type="radio" name="inlineRadioOptions" value="1" checked>
                    <label class="form-check-label" for="inlineRadio1">Login</label>
                    </div>
                    <div class="form-check form-check-inline">
                    <input id="inlineRadio2" class="form-check-input" type="radio" name="inlineRadioOptions" value="2">
                    <label class="form-check-label" for="inlineRadio2">Recuperar datos de acceso</label>
                </div>

                <div id="panelLogin" class="panel-index">
                    <form id="frmLogin">
                        <div class="form-group">
                            <label for="txtEmail" class="nata-ui-login-label">Email</label>
                            <input id="txtEmail" type="email" class="form-control" required>
                        </div>
                        <div class="form-group position-relative">
                            <label for="txtPassword" class="nata-ui-login-label">
                                Password
                            </label>
                            <!--
                            <small class="float-end">
                                <a id="buttonPasswordForgot" href="javascript:void(0);" class="float-right">
                                    Olvidé el Password
                                </a>
                            </small>
                            !-->
                            <input id="txtPassword" type="password" class="form-control" required>
                            <button type="button" id="buttonPasswordShow" class="btn btn-primary btn-sm">Ver </button>
                        </div>
                        <button id="buttonLogin" type="submit" class="btn btn-primary w-100 mt-2">
                            Login
                        </button>
                    </form>
                </div>
            </div>

            <div id="panelRecuperar" class="panel-index">
                <form id="frmRecuperar" class="text-start">
                    <label for="txtEmail" class="nata-ui-login-label">Email</label>
                    <input id="txtEmail" type="email" class="form-control" required>
                    <button id="buttonRecuperar" type="submit" class="btn btn-primary w-100 mt-2">
                        Enviar Datos al Email
                    </button>
                </form>
            </div>

            <div class="w-100 text-center login mt-3">
                <a class="d-inline-block" href="https://api.whatsapp.com/send?phone=573052303947&text=Hola!" target="_whatsapp">
                    <div id="iconWhatsapp">
                        <img class="icon-whatsapp" src="assets/images/icons/animate/whatsapp.svg" alt="">
                    </div>
                </a>
            </div>
        `;

        self.innerHTML = html;
        self.events();
        document.body.style.visibility = "visible";
        //document.getElementById("loader").style.display = "none";
    }

    userInfo() {
        document.querySelectorAll(".user-nombre").forEach(function (element) {
            element.innerHTML = session.user.p + " " + session.user.n;
        });

        document.querySelectorAll(".user-cargo").forEach(function (element) {
            element.innerHTML = session.user.c;
        });

        const template = `
            <div class="w-100 text-center">
                {{? it.f !== ""}}
                <img class="d-inline-block user-info" src="assets/images/users/{{=it.f}}" alt=""><br>
                {{?}}
                <strong>
                    <span class="user-nombre">{{=it.un}}</span><br>
                </strong>
                <small><span class="user-cargo">{{=it.c}}</span></small>
            </div>
        `;

        window.tag = doT.template(template)(session.user);

        const elContainerUserDropDown = document.getElementById("containerDropdownUser");
        if (elContainerUserDropDown !== null) {
            elContainerUserDropDown.innerHTML = `
                <nata-ui-dropdown class="ms-4"
                    data-animate="true"
                    data-text='<img class="icon-account" src="assets/images/icons/account-circle.svg" alt="">'
                    data-button="btn-white"
                    data-class="btn-circle"
                    data-class-panel="min-width-250px"
                >
                </nata-ui-dropdown>
            `;
            return false;
        }
    }

}

// Define the new element
customElements.define("nata-ui-login", nataUILogin);

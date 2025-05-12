/* globals app, nata, doT, session */

// eslint-disable-next-line no-unused-vars
class nataUIMenu extends HTMLElement {
    constructor() {

        // Siempre llamar primero a super en el constructor
        super();

        const self = this;

        self.style.height = "100%";
        self.style.width = "100%";

        session.menuUser = app.config.menu["perfil" + nata.localStorage.getItem("user").ir];
        //console.log(session.menuUser);
        if (typeof session.menuUser == "undefined") {
            session.menuUser = app.config.menu["perfil0"];
        }
        else {
            if (typeof session.menuUser.menu == "undefined") {
                console.error("No se ha creado el perfil para el usuario perfil: " + session.user.ir);
                return false;
            }
        }

        const oMenuCore = app.config.menu["core"];
        // console.log(oMenuCore);
        const oMenu = session.menuUser.menu.concat(oMenuCore);
        // console.log(oMenu);
        self.render(oMenu);
    }

    render (dataMenu) {
        console.log("%c nata.ui.menu.render ", "background:blue;color:white;font-weight:bold;font-size:11px");
        //console.trace("nata.ui.menu.render");
        //console.log(dataMenu);
        //console.log( this );
        const self = this;

        const template = `
            <style>

                img.icon {
                    height: 75px;
                    width: 75px;
                }

                .container-version {
                    text-align: center;
                }

                .container-logo {
                    display: inline-block;
                    width: 100%;
                    text-align: center;
                }

                .shadow-box {
                    box-shadow: 0 1px 15px 1px rgb(69 65 78 / 10%);
                }

                .ui-menu {
                    height: 100vh;
                    width: 100px;
                    background: #fff;
                    border-right: solid 1px #f1f1f1;
                    z-index: 2;
                }

                .ui-menu nata-ui-menu {

                }

                .ui-menu .ui-dropdown-basic, .ui-menu .ui-dropdown-basic-submenu {
                    cursor: pointer;
                    position: relative;
                }

                .ui-menu .btn-menu {
                    margin-bottom: 10px;
                    margin-top: 10px;
                    border: 1px solid #e8e7f4!important;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    padding: 0;
                    margin-top: 15px;
                    margin-bottom: 13px;
                }

                .ui-menu .ui-dropdown-basic-container {
                    display: none;
                    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                    /*height: 43px;*/
                    width: 275px;
                    z-index: 10;
                    position: absolute;
                    background: #fff;
                    border-radius: 5px;
                    left: 70px;
                    text-align: left;
                    top: 29px;
                    font-size: 14px;
                    animation: menu-fade-in .4s ease 1, move-up .6s ease-out 1;
                    vertical-align: middle;
                    color: #676c7b!important;
                }

                .ui-menu .ui-dropdown-basic-container .ui-dropdown-basic-container {
                    left: 35px;
                }

                .ui-menu .ui-dropdown-basic:hover {
                    background: #f9f9f9;
                }

                .ui-menu .btn-menu:hover {
                    background: #22b9ff;
                }

                .btn-menu:hover svg path {
                    stroke: #fff;
                }

                .ui-menu .ui-dropdown-basic:hover > .ui-dropdown-basic-container {
                    display: block;
                }

                .ui-menu .list-group .list-group-item:hover {
                    background: #eee;
                }

                .list-menu > .list-group-item {
                    border: none;
                }

                @keyframes menu-fade-in {
                    from {
                        opacity: 0
                    }
                    to {
                        opacity: 1
                    }
                }

                @-webkit-keyframes menu-fade-in {
                    from {
                        opacity: 0
                    }
                    to {
                        opacity: 1
                    }
                }

                @keyframes move-up {
                    from {
                        margin-top: 10px
                    }
                    to {
                        margin-top: 0
                    }
                }

                @-webkit-keyframes move-up {
                    from {
                        margin-top: 10px
                    }
                    to {
                        margin-top: 0
                    }
                }



            </style>
            <div class="container-logo"
                class="text-center">

                <!--
                <dotlottie-player
                    class="d-inline-block"
                    src="assets/images/icons/animate/icon.json"
                    background="transparent"
                    speed="1"
                    style="width: 75px; height: 75px"
                    direction="1"
                    mode="normal"
                    loop
                    autoplay>
                </dotlottie-player>
                !-->

                <img class="icon" src="assets/images/icons/animate/icon.gif?v=1" lat="">

            </div>


            <ul class="list-group list-menu">
                {{~ it.detail: obj:i}}
                {{? typeof obj.submenu == "undefined"}}
                <!-- list 01 !-->
                <li class="list-group-item text-center">
                    <button type="button" class="btn btn-menu d-inline-block button-circle {{?typeof obj.class != 'undefined'}}{{=obj.class}}{{?}}"
                        {{? typeof obj.onclick !== "undefined"}}onclick="{{=obj.onclick}}"{{?}}>
                        {{? typeof obj.image !== "undefined"}}
                        <img class="icon-image-16" src="assets/images/icons/{{=obj.image}}" alt="">
                        {{?}}

                        {{? typeof obj.svg !== "undefined"}}
                        {{=obj.svg}}
                        {{?}}

                        {{? typeof obj.icon !== "undefined"}}
                        <span class="material-symbols-rounded">{{=obj.icon}}</span>
                        {{?}}
                    </button>
                </li>
                {{??}}
                <!-- list 02 !-->
                <li class="list-group-item text-center ui-dropdown-basic">
                    <!-- button 03 !-->
                    <button type="button" class="btn btn-menu d-inline-block button-circle {{?typeof obj.class != 'undefined'}}{{=obj.class}}{{?}}"
                        {{? typeof obj.onclick !== "undefined"}}onclick="{{=obj.onclick}}"{{?}}>

                        {{? typeof obj.image !== "undefined"}}
                        <img class="icon-image-16" src="assets/images/icons/{{=obj.image}}" alt="">
                        {{?}}

                        {{? typeof obj.svg !== "undefined"}}
                        {{=obj.svg}}
                        {{?}}

                        {{? typeof obj.icon !== "undefined"}}
                        <span class="material-symbols-rounded">{{=obj.icon}}</span>
                        {{?}}
                        <!-- aqui debe cerrar el boton !-->
                    </button>

                    <!-- container 01 !-->
                    <div class="ui-dropdown-basic-container animation-menu fade-in">
                        <ul class="list-group">
                            {{~ obj.submenu: os:is}}
                                <li class="list-group-item {{? typeof os.submenu != "undefined"}}ui-dropdown-basic{{?}}"
                                    {{? typeof os.onclick !== "undefined"}}onclick="{{=os.onclick}}"{{?}}>
                                    {{=os.text}}

                                    {{? typeof os.submenu != "undefined"}}
                                    <div class="ui-dropdown-basic-container animation-menu">
                                        <ul class="list-group">
                                            {{~ os.submenu: oss:iss}}
                                            <li class="list-group-item {{? typeof oss.submenu != "undefined"}}ui-dropdown-basic{{?}}"
                                                {{? typeof oss.onclick !== "undefined"}}onclick="{{=oss.onclick}}"{{?}}>
                                                {{=oss.text}}

                                                {{? typeof oss.submenu != "undefined"}}
                                                <div class="ui-dropdown-basic-container animation-menu">
                                                    <ul class="list-group">
                                                        {{~ oss.submenu: osss:isss}}
                                                        <li class="list-group-item {{? typeof osss.submenu != "undefined"}}ui-dropdown-basic{{?}}"
                                                            {{? typeof osss.onclick !== "undefined"}}onclick="{{=osss.onclick}}"{{?}}>
                                                            {{=osss.text}}

                                                            {{? typeof osss.submenu != "undefined"}}
                                                            <div class="ui-dropdown-basic-container animation-menu">
                                                                <ul class="list-group">
                                                                    {{~ osss.submenu: ossss:issss}}
                                                                    <li class="list-group-item {{? typeof ossss.submenu != "undefined"}}ui-dropdown-basic{{?}}"
                                                                        {{? typeof ossss.onclick !== "undefined"}}onclick="{{=ossss.onclick}}"{{?}}>
                                                                        {{=ossss.text}}

                                                                        {{? typeof ossss.submenu != "undefined"}}
                                                                        <div class="ui-dropdown-basic-container animation-menu">
                                                                            <ul class="list-group">
                                                                                {{~ ossss.submenu: osssss:isssss}}
                                                                                <li class="list-group-item {{? typeof osssss.submenu != "undefined"}}ui-dropdown-basic{{?}}"
                                                                                    {{? typeof osssss.onclick !== "undefined"}}onclick="{{=osssss.onclick}}"{{?}}>
                                                                                    {{=osssss.text}}

                                                                                    {{? typeof osssss.submenu != "undefined"}}
                                                                                    <div class="ui-dropdown-basic-container animation-menu">
                                                                                        <ul class="list-group">
                                                                                            {{~ osssss.submenu: ossssss:issssss}}
                                                                                            <li class="list-group-item" onclick="{{=ossssss.onclick}}">
                                                                                                {{=ossssss.text}}
                                                                                            </li>
                                                                                            {{~}}
                                                                                        </ul>
                                                                                    </div>
                                                                                    {{?}}
                                                                                </li>
                                                                                {{~}}
                                                                            </ul>
                                                                        </div>
                                                                        {{?}}
                                                                    </li>
                                                                    {{~}}
                                                                </ul>
                                                            </div>
                                                            {{?}}
                                                        </li>
                                                        {{~}}
                                                    </ul>
                                                </div>
                                                {{?}}
                                            </li>
                                            {{~}}
                                        </ul>
                                    </div>
                                    {{?}}
                                </li>
                                {{~}}
                            </li>
                        </ul>
                    </div>
                </li>

                {{?}}
                {{~}}
            </ul>
            <div class="container-version">
                ${app.config.version.check.version}
            </div>
        `;

        //self.style.display = "block";
        const html = doT.template(template)({detail: dataMenu});
        //console.log(html);
        console.log(dataMenu);
        self.innerHTML = html;

        //const elLogo = document.querySelector(".container-logo");
        //if (elLogo !== null) elLogo.iconAnimate("assets/images/icons/animate/icon.json");

        const elMenuMobile = document.querySelector("#menu-mobile");
        if (elMenuMobile !== null) {
            elMenuMobile.addEventListener("click", function (event) {
                event.preventDefault();
                this.style.display = "none";
            }, true);
        }

    }
}

customElements.define("nata-ui-menu", nataUIMenu);

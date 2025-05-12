/* globals doT */

class artemisaUIMenuHistoriaClinica extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // eslint-disable-next-line no-unused-vars
        const self = this;
        this._state = {};
        //this._state.datosBasicos = false;
        this.dataset.registroDatosBasicos = false;

        const typeMenu = this.dataset.type;

        // eslint-disable-next-line no-unused-vars
        let templateEvolucion = `
            {{
                if ( typeof d == "undefined" ) d = it;
                let cantidadDatosBasicos = 0;
                if ( typeof d.cdb != "undefined" ) {
                    cantidadDatosBasicos = d.cdb;
                }
            }}

            <!--@todo todo poner aqui class d-none!-->
            <div class="btn-group" role="group">
                <!-- button hc 1 -->
                <button type="button" class="btn btn-warning button-historia-clinica-1"
                    data-ipa="{{=d.ipa}}" data-ios="{{=d.ios}}">
                    <img class="icon-button button-historia-clinica-1" src="assets/images/icons/paciente-white.svg"
                        alt="Historia Clínica"
                        data-ipa="{{=d.ipa}}" data-ios="{{=d.ios}}">
                    {{=app.config.ui.labels[session.user.ipe][1]}}
                </button>

                <div class="btn-group" role="group">
                    <button id="dropdownHistoriaClinica-1" class="btn btn-warning dropdown-toggle" type="button"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        <img class='icon-button' src='assets/images/icons/clipboard-white.svg' alt='{{=label5_4}}'> {{=label5_4}} <span aria-hidden='true'>↓</span>
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownHistoriaClinica-1">
                        <li>
                            <a class="dropdown-item button-hc-evolucion-basica button-hc-evolucion"
                                href="javascript:void(0);"
                                data-ipa="{{=d.ipa}}" data-ios="{{=d.ios}}">
                                Básica
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item button-hc-diagnostico button-hc-evolucion {{? cantidadDatosBasicos == 0}}disabled{{?}}"
                                href="javascript:void(0);"
                                data-ipa="{{=d.ipa}}" data-ios="{{=d.ios}}">
                                Diagnóstico
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item button-hc-evolucion button-hc-prescripcion {{? cantidadDatosBasicos == 0}}disabled{{?}}"
                                href="javascript:void(0);"
                                data-ipa="{{=d.ipa}}" data-ios="{{=d.ios}}">
                                Prescripción
                            </a>
                        </li>
                    </ul>
                </div>

                <div class="btn-group" role="group">
                    <button id="buttonDropdownEscalas" type="button" class="btn btn-warning dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        <img class="icon-button" src="assets/images/icons/ruler.svg" alt="Escalas">
                        {{=app.config.ui.labels[session.user.ipe][5]}} <span aria-hidden='true'>↓</span>
                    </button>
                    <ul class="dropdown-menu left-0" aria-labelledby="buttonDropdownEscalas">
                        <li>
                            <a class="dropdown-item button-hc-glasgow menu-hc glasgow hc-menu-{{=d.ios}}
                                button-hc-evolucion {{? cantidadDatosBasicos == 0}}disabled{{?}}"
                                href="javascript:void(0);" data-ipa="{{=d.ipa}}" data-ios="{{=d.ios}}">
                                Glasgow
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item button-hc-barthel menu-hc barthel hc-menu-{{=d.ios}}
                                button-hc-evolucion {{? cantidadDatosBasicos == 0}}disabled{{?}}"
                                href="javascript:void(0);" data-ipa="{{=d.ipa}}" data-ios="{{=d.ios}}">
                                Barthel
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item button-hc-karnofsky menu-hc karnofsky hc-menu-{{=d.ios}}
                                button-hc-evolucion {{? cantidadDatosBasicos == 0}}disabled{{?}}"
                                href="javascript:void(0);" data-ipa="{{=d.ipa}}" data-ios="{{=d.ios}}">
                                Karnofsky
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item button-hc-news menu-hc news hc-menu-{{=d.ios}}
                                button-hc-evolucion {{? cantidadDatosBasicos == 0}}disabled{{?}}"
                                href="javascript:void(0);" data-ipa="{{=d.ipa}}" data-ios="{{=d.ios}}">
                                News
                            </a>
                        </li>
                    </ul>
                </div
            </div>
        `;

        if ( typeMenu == 1) {
            templateEvolucion += `
                {{? app.config.dev.mode && session.width > 575}}
                <div class="btn-group" role="group">
                    <!-- dropdownFormatos 1 -->
                    <button id="buttonDropdownFormatos" type="button" class="btn btn-warning dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        <img class="icon-button dropdown-toggle" src="assets/images/icons/file-document-edit-white.svg" alt="Formatos">
                        {{=app.config.ui.labels[session.user.ipe][7]}} <span aria-hidden='true'>↓</span>
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="buttonDropdownFormatos">
                        <li>
                            <a class="dropdown-item menu-hc button-form-incapacidad
                                {{? cantidadDatosBasicos == 0}}disabled{{?}}"
                                href="javascript:void(0);" data-ipa="{{=d.ipa}}" data-ios="{{=d.ios}}">
                                Incapacidad
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item menu-hc button-form-aislamiento
                                {{? cantidadDatosBasicos == 0}}disabled{{?}}"
                                href="javascript:void(0);" data-ipa="{{=d.ipa}}" data-ios="{{=d.ios}}">
                                Aislamiento
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item menu-hc button-form-sivigila
                                {{? cantidadDatosBasicos == 0}}disabled{{?}}"
                                href="javascript:void(0);" data-ipa="{{=d.ipa}}" data-ios="{{=d.ios}}">
                                Sivigila
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item menu-hc button-form-consentimiento
                                {{? cantidadDatosBasicos == 0}}disabled{{?}}"
                                href="javascript:void(0);" data-ipa="{{=d.ipa}}" data-ios="{{=d.ios}}">
                                Consentimiento Informado
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item menu-hc button-form-disentimiento
                                {{? cantidadDatosBasicos == 0}}disabled{{?}}"
                                href="javascript:void(0);" data-ipa="{{=d.ipa}}" data-ios="{{=d.ios}}">
                                Disentimiento Informado
                            </a>
                        </li>
                    </ul>
                </div>
                {{?}}
            `;
        }

        let template = `
            {{ const d = it;}}
            <div class="btn-group" role="group">

                <div class="btn-group" role="group">
                    <button id="dropdownConsultaRemota" type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        <img class="icon-button" src="assets/images/icons/cloud_circle_black_24dp.svg" alt="Consulta Remota">
                        {{=app.config.ui.labels[session.user.ipe][0]}}
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownConsultaRemota">
                        <a class="dropdown-item" href="https://meet.google.com/fth-ytvi-oce?pli=1&authuser=0" target="_meeting">
                            <img class="icon-button" src="assets/images/icons/google-meet-icon.svg" alt="" /> Google Meeting
                        </a>
                        <a class="dropdown-item" href="https://api.whatsapp.com/send?phone=57{{=d.pm1}}&text=Teleconsulta AM Salud" target="_meeting">
                            <img class="icon-button" src="assets/images/icons/icons8-whatsapp.svg" alt="" /> Whatsapp
                        </a>
                        <a class="dropdown-item" href="tel:57{{=d.pm1}}">
                            <img class="icon-button" src="assets/images/icons/cellphone-sound.svg" alt="" /> Llamada
                        </a>
                    </ul>
                </div>

                <!-- apertura evolucion historia clinica -->`;

        template += templateEvolucion;

        if ( typeMenu == 1) {
            template +=  `
                    <!-- cierre evolucion historia clinica -->

                    <div class="btn-group ui-dropdown-nested" role="group">

                        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Historia Clinica »
                        </button>
                        <ul class="dropdown-menu">
                            <li>
                                <a class="dropdown-item" href="javascript:void(0);">
                                    Consultar
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item" href="#">Evolución »</a>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#">Submenu 01</a></li>
                                </ul>
                            </li>
                        </ul>

                        <button id="buttonDropdownGestionConsulta" type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            <img class="icon-button" src="assets/images/icons/account-multiple-check-white.svg" alt=""/>
                            {{=app.config.ui.labels[session.user.ipe][2]}}
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="buttonDropdownGestionConsulta">
                            <li>
                                <a class="dropdown-item menu-paciente-no-efectivo" href="javascript:void(0);"
                                    data-ipa="{{=d.ipa}}" data-sc="{{=d.ios}}">
                                    {{=app.config.ui.labels[session.user.ipe][3]}}
                                </a>
                            </li>
                        </ul>
                    </div>

                    <!-- button cerrar 1-->
                    <button type="button" class="btn btn-success button-hc-cerrar disabled"
                        data-ios="{{=d.ios}}">
                        <img class="icon-button" src="assets/images/icons/exit-to-app.svg" alt="Cerrar">
                        {{=app.config.ui.labels[session.user.ipe][6]}}
                    </button>

                </div>
            `;
        }

        this.innerHTML = doT.template( template )( window["menu-data"] );

    }

    connectedCallback() {}

    datosBasicos() {
        //this._state.datosBasicos = val;
        this.dataset.registroDatosBasicos = true;
    }

}

// Define the new element
customElements.define("artemisa-menu-historia-clinica", artemisaUIMenuHistoriaClinica);
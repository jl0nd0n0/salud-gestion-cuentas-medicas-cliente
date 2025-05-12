/* globals app, iconHome, iconRefresh, iconMonitor, iconExit, iconProcess, iconDocument, iconRobot2,
    iconUpload, app */

if (typeof app.config == "undefined") app.config = {};
if (typeof app.config.ui == "undefined") app.config.ui = {};
if (typeof app.config.ui.labels == "undefined") app.config.ui.labels = [];

app.config = {

    // app.config.client
    client: "homi",

    agendamiento: {
        jornada: {
            // app.config.agendamiento.jornada.mañana
            mañana: {
                inicio: 6,
                fin: 12
            },
            tarde: {
                inicio: 12,
                fin: 18
            },
            noche: {
                inicio: 18,
                fin: 6
            }
        },
        // en minutos
        //app.config.agendamiento.tiempoEstimadoConsulta
        tiempoEstimadoConsulta: 45
    },

    ajax: {
        // app.config.ajax.timeout
        timeout: 40
    },

    /*
    cliente: {
        nombre: "sinergia",
        logo: "logo.jpg"
    },
    */

    //DANGER: AQUI
    cliente: {
        nombre: "AM Salud IPS"
        //nombre: "Christus Sinergia"
        //nombre: "Sooring"
    },

    dashboard: {
        // app.config.dashboard.mesInicial
        mesInicial: 5
    },

    db: {
        // app.config.db.adapter couchdb|mysql|mysql-nosql
        adapter: "mysql-nosql"
    },

    dev: {
        // app.config.dev.atajo
        atajo: undefined,
        // app.config.dev.mode
        // habilitar el modo de desarrollo
        // app.config.dev.mode
        //DANGER: AQUI
        mode: true, // para encriptar con el mode es false
        // app.config.dev.online
        online: true,
        toolbar: true,
        // app.config.dev.timestamp
        timestamp: 1645110798198,
        verbose: {
            // app.config.dev.verbose.core
            core: false,
            principal: false,
            // app.config.dev.verbose.secundario
            secundario: false
        }
    },

    // app.config.diasSemana
    calendario: {
        diasSemana: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"],
        // app.config.calendario.mes
        mes: ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        week: {
            // app.config.calendario.week.days
            days: ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"]
        }
    },

    //app.config.cripto.secretKey
    cripto: {
        secretKey: "#B#dJT8Y74EvfgjJmX@98TINy&!oTo!9R@orF^vpyG6z%2S22VXsMR*9W2B%FXGtmmY7sS*B&8L5yiBNtqzYC6^Bs%7Ipz#mytf#"
    },

    // app.config.mes
    mes: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],

    offline: {
        time: {
            // app.config.offline.time.send
            send: 10
        }
    },

    // app.config.sound.play
    // app.config.sound.file
    sound: {
        //app.config.sound.play
        //DANGER: AQUI
        play: true,
        file: "https://amsalud.crescend.software/cdn/sirena.mp3",
    },

    // app.config.server
    server: {},

    vars: [
        {
            v: "%year%",
            t: "2021"
        }
    ],

    version: {
        check: {
            // app.config.version.check.review
            review: true,
            // app.config.version.check.time
            time: 60,
            // app.config.version.check.login
            login: 20,
            // app.config.version.check.version
            version: "v0.2.41"
        }
    },

    // app.config.webworker
    //TODO: AQUI
    webworker: false
};

// app.config.title
const year = new Date().getFullYear();
app.config.title = `
    Artemisa ${app.config.client} ${year}
`,

// DANGER: AQUI
//PRODUCCION
//app.config.server.path = "http://172.26.0.6/";

//#region PRODUCCION
app.config.server.path = "https://homi.artemisaips.com/";
//app.config.server.path = "https://172.26.0.4/";
app.config.server.php1 = app.config.server.path + "server/php/index.php?";
//#endregion PRODUCCION

//#region desarrollo
// app.config.server.php1 = app.config.server.path + "server/php/desarrollo/index.php?";
//#endregion desarrollo

app.config.login = {
    endpoint: app.config.server.php1 + "x=usuario&y=login",
    recover: false
};

// LOCAL 
//app.config.server.path = "http://artemisa.local/",

// DANGER: AQUI
app.config.server.cdnPathBase = "https://cdn1.artemisaips.com/";
app.config.server.cdnPathBaseFiles = app.config.server.cdnPathBase + "5cb3f764_e920_45a2_a60a_db50418e8ffa/";



app.config.server.cdn = app.config.server.cdnPathBase + "server/index.php?";
app.config.server.php = app.config.server.path + "server/php/backend/public/";
// app.config.server.php1 = app.config.server.path + "server/php/index.php?";

// DANGER: AQUI
//control de uso de servidor externo, subida de archivos
app.config.server.upload = "https://nata.crescend.software/";
app.config.server.upload = app.config.server.upload + "server/php/index.php?";

//DANGER: AQUI
// servicio de control de versiones
//produccion
app.config.version.check.server = app.config.server.php1 + "x=servidor&y=version";
//night
//app.config.version.check.server = app.config.server.php + "version/nightGet";


app.config.server.docs = app.config.server.php + "7084dcc5-671c-4292-841e-5b8141099bd0/";
app.config.server.docs1 = app.config.server.path + "server/php/7084dcc5-671c-4292-841e-5b8141099bd0/temporal/";

app.config.menu = {

    core: [
        // {
        //     svg: iconManual,
        //     submenu: [
        //         {
        //             text: "Radicación Adres",
        //             onclick: "app.documentacion.wizard.render('radicacion-adres', 'Radicación Adres');"
        //         }
        //     ]
        // },
        {
            svg: iconRefresh,
            onclick: "app.core.refresh();"
        },
        {
            svg: iconExit,
            onclick: "app.core.exit();"
        }
    ],
    
    perfil0: {
        menu: [
            {
                svg: iconHome,
                onclick: "app.monitor.index();"
            },
            {

                svg: iconDocument,
                submenu: [
                    {
                        text: "Intranet",
                        submenu: [
                            {
                                text: "Flujo datos prestación SOAT",
                                onclick: "app.documentacion.intranet.prestacionSOAT('prestacion-soat', 'Prestación SOAT');"
                            },
                            {
                                text: "Liquidación por cobertura",
                                onclick: "app.documentacion.intranet.liquidacionCobertura('liquidacion-cobertura', 'Liquidación Cobertura');"
                            }
                        ]
                    },
                    {
                        text: "Documentación",
                        submenu: [
                            {
                                text: "Auditoria",
                                submenu: [
                                    {
                                        text: "Carga",
                                        onclick: "app.documentacion.wizard.render('cargar-auditoria', 'Carga de auditorias');"
                                    },
                                    {
                                        text: "Solicitud Soportes",
                                        onclick: "app.documentacion.wizard.render('solicitar-soportes', 'Solicitar soportes');"
                                    }
                                ]
                            },
                            {
                                text: "Inducción",
                                onclick: "app.documentacion.wizard.render('induccion', 'Inducción');"
                                
                            },
                            {
                                text: "Software Utilidades",
                                submenu: [
                                    {
                                        text: "Comprimir Archivos 7Zip",
                                        onclick: "app.documentacion.wizard.render('7zip', 'Comprimir Archivos 7zip');"
                                    }
                                ]
                            },
                            {
                                text: "Grabar Pantalla",
                                onclick: "app.documentacion.wizard.render('grabar-pantalla', 'Grabar Pantalla');"
                            },
                            {
                                text: "Descarga De Soportes",
                                onclick: "app.documentacion.soportes.descarga();"
                            },
                            {
                                text: "Descarga De Soportes Furips",
                                onclick: "app.documentacion.soportes.descarga.furips();"
                            },
                            {
                                text: "Subir Soportes",
                                onclick: "app.documentacion.wizard.render('soportes-crescend', 'Subir soportes');"
                            },
                            {
                                text: "Crear Estados Paralelos",
                                onclick: "app.documentacion.estadosParalelos.insertar('crear-estado-paralelo', 'Crear Estado Paralelo');"
                            }
                        ]
                    }
                ]
            },
            {
                svg: iconProcess,
                submenu: [
                    {
                        text: "Buscar",
                        onclick: "app.monitor.buscar.index();"
                    },
                    {
                        text: "SOAT",
                        submenu: [
                            {
                                text: "Buscar",
                                onclick: "app.monitor.buscar.index();"
                            },
                            // {
                            //     text: "Furips",
                            //     onclick: "app.core.furips.gestion.buscar();"
                            // },
                            {
                                text: "Control",
                                submenu: [
                                    {
                                        text: "Monitor",
                                        onclick: "app.monitor.index();"
                                    },
                                    {
                                        text: "Carga auditorias",
                                        onclick: "app.monitor.auditorias.control();"
                                    }
                                ]
                            }, 
                            // {
                            //     text: "Informes",
                            //     submenu: [
                            //         {
                            //             text: "Generar informe ADRES",
                            //             onclick: "app.monitor.informes.adres();"
                            //         },
                            //         {
                            //             text: "Generar informe cartera",
                            //             onclick: "app.monitor.informes.cartera();"
                            //         },
                            //         {
                            //             text: "Generar informe 1",
                            //             onclick: "app.monitor.informes.informe1();"
                            //         },
                            //         {
                            //             text: "Generar informe cruce cartera HOMI",
                            //             onclick: "app.monitor.informes.cruceCarteraHomi();"
                            //         }
                            //     ]
                            // },
                            {
                                text: "Descargar cobros realizados",
                                onclick: "app.monitor.facturacion.cobros();"
                            },
                            {
                                text: "Radicar Cuentas",
                                submenu: [
                                    {
                                        text: "Descarga de Soportes",
                                        onclick: "app.documentacion.soportes.descarga();"
                                    },
                                    /*{
                                        text: "Adres",
                                        onclick: "app.cartera.soat.glosa.adres();"
                                    },
                                    {
                                        text: "Facturas Nuevas",
                                        onclick: "app.cartera.soat.facturasNuevas();"
                                    },*/
                                ]
                            },
                            {
                                text: "Actualizar Datos Artemisa",
                                onclick: "app.upload.soportes.subir('" + app.config.server.path + "server/php/index.php?x=upload&y=fileExcelDataUpdate&ts=" + new Date().getTime() + "')"
                            },
                            // {
                            //     text: "Glosas ADRES",
                            //     submenu: [
                            //         {
                            //             text: "Upload",
                            //             onclick: "app.cartera.soat.glosa.adres.upload();"
                            //         },
                            //         {
                            //             text: "Revisar",
                            //             onclick: "app.cartera.soat.glosa.adres.revisar();"
                            //         }
                            //     ]
                            // }
                        ]
                    },
                    {
                        text: "OTROS ASEGURADORES",
                        submenu: [
                            {
                                text: "Pendiente Por Radicar",
                                onclick: "app.cartera.otroAseguradores();"
                            },
                        ]
                    },
                    // {
                    //     text: "Generar Furips",
                    //     submenu:[
                    //         // {
                    //         //     text: "Por factura",
                    //         //     onclick: "app.furips.porFactura.render();"
                    //         // },
                    //         {
                    //             text: "Por factura",
                    //             onclick: "app.furips.porFactura.renderV1();"
                    //         },
                    //         // {
                    //         //     text: "Cargar Lote 1",
                    //         //     onclick: "app.furips.render();"
                    //         // },
                    //         // {
                    //         //     text: "Cargar Lote 2",
                    //         //     onclick: "app.furips.renderV1();"
                    //         // }
                    //     ]
                    // },

                ]
            },
            {
                svg: iconUpload,
                submenu: [
                    {
                        text: "Subir",
                        submenu: [
                            {
                                text: "Subir Datos",
                                onclick: "app.upload.index();"
                            },
                            {
                                text: "Subir Flujo efectivo",
                                onclick: "app.upload.soportes.flujoEfectivo();"
                            },
                            {
                                text: "Cargar Furips Lote 1",
                                onclick: "app.furips.render();"
                            },
                            {
                                text: "Cargar Furips Lote 2",
                                onclick: "app.furips.renderV1();"
                            }
                        ]
                    },
                ]
            },
        ],
        optionMenu: [0, 1, 2, 3, 4, 5, 6, 7]
    },

    // Omega admin
    perfil24: {
        menu: [
            {
                svg: iconRobot2,
                submenu: [
                    {
                        text: "Asistente",
                        submenu: [
                            {
                                text: "Responder Glosa",
                                onclick: "app.wizard_V1.glosa.contestar.index();"
                            }
                        ]
                    },
                ]
            },
            {
                svg: iconProcess,
                submenu: [
                    {
                        text: "Cartera",
                        submenu: [
                            {
                                text: "Buscar",
                                onclick: "app.monitor.buscar.index();"
                            },
                            {
                                text: "Utilidades",
                                submenu: [
                                    {
                                        text: "Corregir RIPS",
                                        onclick: "app.rips.cargar();"
                                    },
                                    {
                                        text: "Generar RIPS",
                                        onclick: "app.rips.generar();"
                                    }
                                ]
                            },
                            {
                                text: "Asistente",
                                onclick: "app.asistente.render('asistente', 'Asistente Artemisa');"   
                            }
                        ]
                    },
                    {
                        text: "Auditoría",
                        submenu: [
                            {
                                text: "Generar Plantilla Primera Vez",
                                onclick: "app.auditoriaSoporte.primeraVez.options();"
                            },
                            {
                                text: "Generar Plantilla Glosa",
                                onclick: "app.auditoriaSoporte.glosa.options();"
                            },
                            {
                                text: "Control Auditoria",
                                onclick: "app.auditoria.control.index_v1();"
                            }
                        ]
                    },
                    {
                        text: "Aseguradoras",
                        onclick: "app.aseguradora.index();"
                    },
                    {
                        text: "SOAT",
                        submenu: [
                            {
                                text: "Furips",
                                submenu: [
                                    {
                                        text: "Generar por factura",
                                        onclick: "app.furips.buscar();"
                                    },
                                    {
                                        text: "Generar por lote",
                                        onclick: "app.furips.generarLote();"
                                    }
                                ]
                            },
                            {
                                text: "Glosa estado",
                                onclick: "app.monitor.glosa.detalle.estado('APROBADO');",
                                class: "color-red"
                            },
                            {
                                text: "Control",
                                submenu: [
                                    {
                                        text: "Monitor",
                                        onclick: "app.monitor.index();"
                                    },
                                    {
                                        text: "Actualización aseguradoras",
                                        onclick: "app.monitor.aseguradoras.control();"
                                    }
                                    ,
                                    {
                                        text: "Carga auditorias",
                                        onclick: "app.monitor.auditorias.control();"
                                    }
                                ]
                            },
                            {
                                text: "Radicar Cuentas",
                                submenu: [
                                    {
                                        text: "Descarga de Soportes",
                                        onclick: "app.documentacion.soportes.descarga();"
                                    },
                                ]
                            },
                            {
                                text: "Glosas ADRES",
                                submenu: [
                                    {
                                        text: "Upload",
                                        onclick: "app.cartera.soat.glosa.adres.upload();"
                                    },
                                    {
                                        text: "Revisar",
                                        onclick: "app.cartera.soat.glosa.adres.revisar();"
                                    },
                                    {
                                        text: "Documentación",
                                        onclick: "app.documentacion.wizard.adres('manual-adres', 'Subir soportes');"
                                    }
                                ]
                            },
                            {
                                text: "Solicitar Conciliación",
                                onclick: "app.monitor.conciliacion.solicitar();"
                            }
                        ]
                    },
                    {
                        text: "Monitor",
                        submenu: [
                            {
                                text: "Aseguradoras",
                                onclick: "app.aseguradora.monitor();"
                            },
                            {
                                text: "Gestión Cartera",
                                onclick: "app.monitor.render();"
                            },
                            {
                                text: "Principal Cartera",
                                onclick: "app.monitor.index();"
                            },
                            {
                                text: "Seguimiento",
                                onclick: "app.monitor.seguimiento();"
                            }
                        ]
                    },
                    // {
                    //     text: "OTROS ASEGURADORES",
                    //     submenu: [
                    //         {
                    //             text: "Pendiente Por Radicar",
                    //             onclick: "app.cartera.otroAseguradores();"
                    //         },
                    //     ]
                    // },
                    {
                        text: "EXPORTAR DATA",
                        submenu: [
                            {
                                text: "Informes",
                                submenu: [
                                    {
                                        text: "Generar informe cruce cartera",
                                        onclick: "app.monitor.informes.cruceCartera();"
                                    },
                                    {
                                        text: "Generar informe cartera incobrable",
                                        onclick: "app.monitor.informes.carteraIncobrable();"
                                    },
                                    {
                                        text: "Descargar Facturas por asegurador",
                                        onclick: "app.monitor.informes.descargarAsegurador();"
                                    },
                                    {
                                        text: "Generar informe glosas",
                                        onclick: "app.wizard.informes.glosa();"
                                    }
                                ]
                            },
                            {
                                text: "Actualizacion cartera corte",
                                submenu: [
                                    {
                                        text: "Generar informe cruce cartera",
                                        onclick: "app.monitor.informes.cruceCarteraHomi();"
                                    },
                                    {
                                        text: "Generar informe ADRES",
                                        onclick: "app.monitor.informes.adres();"
                                    },
                                    {
                                        text: "Generar informe cartera",
                                        onclick: "app.monitor.informes.cartera();"
                                    },
                                    {
                                        text: "Generar informe 1",
                                        onclick: "app.monitor.informes.informe1();"
                                    },

                                ]
                            },
                        ]
                    },
                    // {
                    //     text: "CRESCEND FACTURACIÓN",
                    //     submenu: [
                    //         {
                    //             text: "Generar informe",
                    //             onclick: "app.monitor.facturacion.generar();"
                    //         },
                    //         {
                    //             text: "Descargar cobros realizados",
                    //             onclick: "app.monitor.facturacion.cobros();"
                    //         }
                    //     ]
                    // },
                    // {
                    //     text: "Subir",
                    //     submenu: [
                    //         {
                    //             text: "Subir Datos",
                    //             onclick: "app.upload.index();"
                    //         },
                    //         {
                    //             text: "Subir Flujo efectivo",
                    //             onclick: "app.upload.soportes.flujoEfectivo();"
                    //         },
                    //         {
                    //             text: "Cargar Furips Lote 1",
                    //             onclick: "app.furips.render();"
                    //         },
                    //         {
                    //             text: "Cargar Furips Lote 2",
                    //             onclick: "app.furips.renderV1();"
                    //         },
                    //         {
                    //             text: "Subir soportes",
                    //             onclick: "app.upload.soportes.subirSoportes('" + app.config.server.php1 + "x=upload&y=fileZipDataUpdate&ts=" + new Date().getTime() + "')"
                    //         }
                    //     ]
                    // }
                ]
            },
            {

                svg: iconDocument,
                submenu: [
                    {
                        text: "Documentación",
                        submenu: [
                            {
                                text: "Auditoria",
                                submenu: [
                                    {
                                        text: "Carga",
                                        onclick: "app.documentacion.wizard.render('cargar-auditoria', 'Carga de auditorias');"
                                    },
                                    {
                                        text: "Manual Auditoria ADRES",
                                        onclick: "app.documentacion.wizard.render('manual-auditoria-adres', 'Manual de Auditoria ADRES');"
                                    },
                                    {
                                        text: "Solicitud Soportes",
                                        onclick: "app.documentacion.wizard.render('solicitar-soportes', 'Solicitar soportes');"
                                    }
                                ]
                            },
                            {
                                text: "Drive Flujo Efectivo",
                                onclick: "app.documentacion.wizard.render('drive-flujo-efectivo', 'Drive Flujo Efectivo');"

                            },
                            {
                                text: "Gestión",
                                submenu: [
                                    {
                                        text: "Crear Estados Paralelos",
                                        onclick: "app.documentacion.estadosParalelos.insertar('crear-estado-paralelo', 'Crear Estado Paralelo');"
                                    },
                                    {
                                        text: "Cargar Facturas Anuladas",
                                        onclick: "app.documentacion.wizard.render('anuladas', 'Cargar archivo de anulacion');"
                                    }
                                ]
                            },
                            {
                                text: "Inducción",
                                onclick: "app.documentacion.wizard.render('induccion', 'Inducción');"

                            },
                            {
                                text: "Poderes",
                                onclick: "app.documentacion.wizard.render('poderes', 'Poderes');"
                            },
                            {
                                text: "Radicacion",
                                submenu: [
                                    {
                                        text: "Archivo radicacion general",
                                        onclick: "app.core.radicacion();"
                                    },
                                    {
                                        text: "Manuales",
                                        onclick: "app.documentacion.wizard.render('manuales-radicacion', 'Manuales radicacion aseguradores');"
                                    },
                                    {
                                        text: "Radicacion AXA Colpatria",
                                        onclick: "app.documentacion.wizard.render('radicacion-colpatria', 'Radicación correcta de AXA Colpatria');"
                                    },
                                    {
                                        text: "Videos",
                                        onclick: "app.documentacion.wizard.render('radicacion-videos', 'Videos radicacion');"

                                    },
                                ]

                            },
                            {
                                text: "Soportes",
                                submenu: [
                                    {
                                        text: "Descarga De Soportes",
                                        onclick: "app.documentacion.soportes.descarga();"
                                    },
                                    {
                                        text: "Descarga De Soportes Furips",
                                        onclick: "app.documentacion.soportes.furips();"
                                    },
                                    {
                                        text: "Subir Soportes",
                                        onclick: "app.documentacion.wizard.render('soportes-crescend', 'Subir soportes');"
                                    }
                                ]
                            },
                            {
                                text: "Utilidades",
                                submenu: [
                                    {
                                        text: "Software Utilidades",
                                        submenu: [
                                            {
                                                text: "Comprimir Archivos 7Zip",
                                                onclick: "app.documentacion.wizard.render('7zip', 'Comprimir Archivos 7zip');"
                                            }
                                        ]
                                    },
                                    {
                                        text: "Grabar Pantalla",
                                        onclick: "app.documentacion.wizard.render('grabar-pantalla', 'Grabar Pantalla');"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        text: "Plantillas",
                        submenu: [
                            {
                                text: "Auditoria Primera vez",
                                onclick: "window.open('https://cdn1.artemisaips.com/docs/plantillas/temporal_auditoria.xlsx', '_blank')"
                            },
                            {
                                text: "Auditoria Glosa",
                                onclick: "window.open('https://cdn1.artemisaips.com/docs/plantillas/temporal_auditoria_glosa.xlsx', '_blank')"
                            },
                            {
                                text: "Derechos de petición",
                                submenu: [
                                    {
                                        text: "Fallos en plantaforma de radicacion",
                                        onclick: "app.documentacion.intranet.prestacionSOAT('formato-derecho-peticion', 'Formato derecho de petición');" 
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        text: "Intranet",
                        submenu: [
                            {
                                text: "Flujo datos prestación SOAT",
                                onclick: "app.documentacion.intranet.prestacionSOAT('prestacion-soat', 'Prestación SOAT');"
                            },
                            {
                                text: "Liquidación por cobertura",
                                onclick: "app.documentacion.intranet.liquidacionCobertura('liquidacion-cobertura', 'Liquidación Cobertura');"
                            }
                        ]
                    },
                    {
                        text: "Validación Soportes",
                        onclick: "app.documentacion.wizard.render('validar-soportes', 'Validar Soportes');"
                    },
                    {
                        text: "Tablas de Referencia",
                        submenu: [
                            {
                                text: "CUMS",
                                submenu: [
                                    {
                                        text: "Link Cums",
                                        onclick: "app.core.cums.link();"
                                    },
                                    {
                                        text: "Cums",
                                        onclick: "app.cums.index();"
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        text: "Documentos Gestión",                        
                        submenu: [
                            {
                                text: "Auditoria Integral Soportado Cuentas (armado)",
                                onclick: "window.open('https://cdn1.artemisaips.com/docs/armado-cuentas.xlsx', '_blank')"
                            },
                            {
                                text: "Topes Cobertura Soat",
                                onclick: "window.open('https://cdn1.artemisaips.com/docs/topes/artemisa-referencia-cobertura-topes-soat-2023-2025.xlsx', '_blank')"
                            }
                        ]
                    },
                ]
            },
            {
                svg: iconUpload,
                submenu: [
                    {
                        text: "Importar",
                        submenu: [
                            {
                                text: "Cargar Excel",
                                onclick: "app.upload.soportes.subir('" + app.config.server.php1 + "x=upload&y=fileExcelDataUpdate&ts=" + new Date().getTime() + "')"
                            },
                            {
                                text: "Carga Temporales",
                                submenu: [
                                    {
                                        text: "ADRES",
                                        submenu: [
                                            {
                                                text: "Carga Manual Auditoria",
                                                onclick: "app.documentacion.wizard.render('manual-auditoria-adres', 'Manual Auditoria ADRES');"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        text: "Subir ZIP RIPS",
                        onclick: "app.rips.cargar();"
                    },
                    {
                        text: "Facturas",
                        submenu: [
                            {
                                text: "Excel ZIP",
                                onclick: "app.upload.soportes.subir('" + app.config.server.php1 + "x=upload&y=fileExcelDataUpdate&ts=" + new Date().getTime() + "')"
                            },
                            {
                                text: "XML ZIP",
                                onclick: "app.upload.soportes.subirFacturasZip('" + app.config.server.php1 + "x=upload&y=fileZipDataUpdate&ts=" + new Date().getTime() + "')"
                            }
                        ]
                    },
                    {
                        text: "Subir Facturas Zip",
                        onclick: "app.upload.soportes.subirFacturasZip('" + app.config.server.php1 + "x=upload&y=fileZipDataUpdate&ts=" + new Date().getTime() + "')"
                    },
                    {
                        text: "Subir pagos",
                        onclick: "app.cartera.soat.pago()"
                    }
                ]
            }
        ],
        optionMenu: [
            0, 1, 2, 3, 4, 5, 6
        ]
    }
};

/* documentos */
app.config.documentos = {
    //app.config.documentos.sivigila
    sivigila: {
        "form-combo-nacionalidad": "170"
    }
};

app.config.soat = {
    //app.config.config.soat.mesInicial
    mesInicial: 5
};

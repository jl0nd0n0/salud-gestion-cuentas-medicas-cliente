/* globals app, iconHome, iconRefresh, iconMonitor, iconExit, iconProcess, iconDocument, iconRobot2,
    iconUpload, app */

if (typeof app.config == "undefined") app.config = {};
if (typeof app.config.ui == "undefined") app.config.ui = {};
if (typeof app.config.ui.labels == "undefined") app.config.ui.labels = [];

app.config = {

    title: "Artemisa Cuentas Médicas",

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
            version: "v0.2.47"
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
app.config.version.check.server = app.config.server.php1 + "x=servidor&y=versionRobots";
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
                submenu: [
                    {
                        text: "Gestión Cuentas Médicas",
                        onclick: "app.monitor.index();"
                    }
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
                            }
                        ]
                    },
                ]
            },
        ],
        optionMenu: [0, 1, 2, 3, 4, 5, 6, 7]
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

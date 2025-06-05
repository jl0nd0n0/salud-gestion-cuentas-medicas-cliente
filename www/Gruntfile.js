/* global module */

//var pngquant = require("imagemin-pngquant");
//var mozjpeg = require("imagemin-mozjpeg");
//var gifsicle = require("imagemin-gifsicle");

module.exports = function (grunt) {

    grunt.initConfig({
        //pkg: grunt.file.readJSON('package.json'), //load configuration

        realFavicon: {

            dev: {
                src: "icon.png",
                dest: "./",
                options: {
                    iconsPath: "/",
                    html: ["index.html"],
                    design: {
                        ios: {
                            pictureAspect: "backgroundAndMargin",
                            backgroundColor: "#ffffff",
                            margin: "14%",
                            assets: {
                                ios6AndPriorIcons: true,
                                ios7AndLaterIcons: true,
                                precomposedIcons: false,
                                declareOnlyDefaultIcon: true
                            }
                        },
                        desktopBrowser: {},
                        windows: {
                            pictureAspect: "noChange",
                            backgroundColor: "#da532c",
                            onConflict: "override",
                            assets: {
                                windows80Ie10Tile: true,
                                windows10Ie11EdgeTiles: {
                                    small: true,
                                    medium: true,
                                    big: true,
                                    rectangle: true
                                }
                            }
                        },
                        androidChrome: {
                            pictureAspect: "noChange",
                            themeColor: "#ffffff",
                            manifest: {
                                display: "standalone",
                                orientation: "notSet",
                                onConflict: "override",
                                declared: true
                            },
                            assets: {
                                legacyIcon: false,
                                lowResolutionIcons: true
                            }
                        },
                        safariPinnedTab: {
                            pictureAspect: "silhouette",
                            themeColor: "#5bbad5"
                        }
                    },
                    settings: {
                        scalingAlgorithm: "Mitchell",
                        errorOnImageTooSmall: false
                    }
                }
            },

            build: {
                src: "icon.png",
                dest: "./release/build/",
                options: {
                    iconsPath: "/",
                    html: ["index-release.html"],
                    design: {
                        ios: {
                            pictureAspect: "backgroundAndMargin",
                            backgroundColor: "#ffffff",
                            margin: "14%",
                            assets: {
                                ios6AndPriorIcons: true,
                                ios7AndLaterIcons: true,
                                precomposedIcons: false,
                                declareOnlyDefaultIcon: true
                            }
                        },
                        desktopBrowser: {},
                        windows: {
                            pictureAspect: "noChange",
                            backgroundColor: "#da532c",
                            onConflict: "override",
                            assets: {
                                windows80Ie10Tile: true,
                                windows10Ie11EdgeTiles: {
                                    small: true,
                                    medium: true,
                                    big: true,
                                    rectangle: true
                                }
                            }
                        },
                        androidChrome: {
                            pictureAspect: "noChange",
                            themeColor: "#ffffff",
                            manifest: {
                                display: "standalone",
                                orientation: "notSet",
                                onConflict: "override",
                                declared: true
                            },
                            assets: {
                                legacyIcon: false,
                                lowResolutionIcons: true
                            }
                        },
                        safariPinnedTab: {
                            pictureAspect: "silhouette",
                            themeColor: "#5bbad5"
                        }
                    },
                    settings: {
                        scalingAlgorithm: "Mitchell",
                        errorOnImageTooSmall: false
                    }
                }
            }
        },

        /*
        imagemin: {
            // Task
            // static: {                          // Target
            //    options: {                       // Target options
            //        optimizationLevel: 7,
            //        use: [mozjpeg()]
            //    },
            //    files: {}
            // },
            dynamic: {                        // Another target
                options: {                       // Target options
                    optimizationLevel: 3,
                    use: [mozjpeg(), pngquant()]
                },
                files: [
                    // banner documento
                    {
                        expand: true,      								// Enable dynamic expansion
                        cwd: "assets/images/portal/temporal/",       	// Src matches are relative to this path
                        src: ["*.png"],
                        dest: "assets/images/portal/"					// Destination path prefix
                    }
                ]
            },
        },
		*/

        svgmin: {
            options: {
                plugins: [
                    { removeViewBox: false },               // Don't remove the viewbox attribute from the SVG
                    { removeUselessStrokeAndFill: false },  // Don't remove Useless Strokes and Fills
                    { removeEmptyAttrs: false }
                    /*{
          removeAttrs: {
            attrs: ["xmlns"]
          }
        }*/
                ]
            },
            dist: {
                svg: {
                    files: {
                        "assets/minerva/images/logo-legis-circular.svg": "assets/minerva/images/logo-legis-circular.svg",
                        "assets/minerva/images/footer.svg": "assets/minerva/images/footer.svg",
                        "assets/images/logo.svg": "assets/images/logo.svg",
                        "assets/minerva/icons/group.svg": "assets/minerva/icons/group.svg",
                        "assets/minerva/icons/pyme.svg": "assets/minerva/icons/pyme.svg",
                        "assets/minerva/icons/icon-home.svg": "assets/minerva/icons/icon-home.svg",
                        "assets/minerva/icons/icon-key.svg": "assets/minerva/icons/icon-key.svg",
                        "assets/minerva/icons/icon-car.svg": "assets/minerva/icons/icon-car.svg",
                        "assets/minerva/icons/icon-documento.svg": "assets/minerva/icons/icon-documento.svg"
                    }
                }
            }
            /*dist: {
                files: {
                    "release/build/assets/images/logo.svg": "assets/images/logo.svg",
                    "release/build/assets/images/icons/whatsapp.svg": "assets/images/icons/whatsapp.svg",
                    "release/build/assets/images/logos/logo-autopartes.svg": "assets/images/logos/logo-autopartes.svg",
                    "release/build/assets/images/aside-table/bi.svg": "assets/images/aside-table/bi.svg",
                    "release/build/assets/images/aside-table/geo.svg": "assets/images/aside-table/geo.svg",
                    "release/build/assets/images/aside-table/help.svg": "assets/images/aside-table/help.svg",
                    "release/build/assets/images/aside-table/sfa.svg": "assets/images/aside-table/sfa.svg",
                    "release/build/assets/images/icons/analytics.svg": "assets/images/icons/analytics.svg",
                    "release/build/assets/images/icons/process.svg": "assets/images/icons/process.svg",
                    "release/build/assets/images/icons/business-team.svg": "assets/images/icons/business-team.svg",
                    "release/build/assets/images/icons/data.svg": "assets/images/icons/data.svg"
                }
            }*/
        },

        responsive_images: {
            portal: {
                options: {
                    sizes: [
                        {
                            name: "458",
                            width: 458,
                            suffix: "",
                            quality: 100
                        },
                        {
                            name: "482",
                            width: 482,
                            suffix: "",
                            quality: 100
                        },
                        {
                            name: "402",
                            width: 402,
                            suffix: "",
                            quality: 100
                        },
                        {
                            name: "343",
                            width: 343,
                            suffix: "",
                            quality: 100
                        },
                        {
                            name: "332",
                            width: 332,
                            suffix: "",
                            quality: 100
                        },
                        {
                            name: "268",
                            width: 268,
                            suffix: "",
                            quality: 100
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        //src: ["**/*.{png,jpg,gif}"],
                        src: ["*.{png,jpg,gif}"],
                        cwd: "assets/images/portal/source/",
                        dest: "assets/images/portal/temporal/"
                    }
                ]
            },

        },

        cwebp: {
            static: {
                files: {}
            },

            portal: {
                options: {
                    q: 75
                },
                files: [
                    // products
                    {
                        expand: true,
                        cwd: "assets/images/portada/temporal/",
                        src: ["*.{png,jpg,gif}"],
                        dest: "assets/images/portada/"
                    },
                ]
            },

        },

        /*
        "image": {
            products: {
                options: {
                    pngquant: true,
                    optipng: true,
                    zopflipng: true,
                    jpegRecompress: false,
                    jpegoptim: false,
                    mozjpeg: false,
                    guetzli: false,
                    gifsicle: false,
                    svgo: false
                },
                files: [{
                    expand: true,
                    cwd: "assets/images/product/temporal/",
                    src: ["*.{png,jpg,gif,svg}"],
                    dest: "assets/images/product/"
                }]
            }
        },
        */

        concat: {
            options: {
                separator: "\n"
            },

            libraries: {
                src: [
                ],
                dest: "source/libraries.js"
            },

            js: {
                src: [
                    "assets/js/library/flatpickr.min.js",
                    "assets/js/library/lottie.min.js",
                    "assets/js/library/bootstrap.bundle.min.js",
                    "assets/js/library/localforage.min.js",
                    "assets/js/library/axios.min.js",
                    "assets/js/library/doT.js",
                    "assets/js/library/alasql.js",
                    "assets/js/library/clusterize.min.js",
                    "assets/js/library/sweetalert.min.js",
                    "assets/js/library/jets.min.js",
                    "assets/js/library/echarts.min.js",
                    "assets/js/api/globals.js",
                    "assets/nata/chart/echarts/doughnutChart.js",
                    "assets/nata/ui/chart/nata.ui.chart.donut.class.js",
                    "assets/nata/ui/chart/nata.ui.chart.line.class.js",
                    "assets/nata/ui/chart/nata.widget.percent.js",
                    "assets/js/api/templates.js",
                    "assets/js/nata.ajax.js",
                    "assets/nata/nata.version.js",
                    "assets/nata/nata.ui.upload.class.js",
                    "assets/nata/nata.ui.upload.multiple.class.js",
                    "assets/js/api/app.config.js",
                    "assets/js/app.monitor.js",
                    "assets/js/api/app.aseguradora.js",
                    "assets/js/app.auditoriaSoporte.js",
                    "assets/nata/nata.localStorage.js",
                    "assets/nata/nata.localforage.js",
                    "assets/nata/nata.localforage.js",
                    "assets/nata/nata.sessionStorage.js",
                    "assets/nata/ui/nata.ui.dialog.class.js",
                    "assets/nata/ui/nata.ui.list.class.js",
                    "assets/nata/ui/nata.ui.todo.class.js",
                    "assets/nata/ui/nata.scrollYHeightPlugin.js",
                    "assets/nata/ui/nata.ui.table.class.js",
                    "assets/js/api/app.js",
                    "assets/js/api/app.glosa.js",
                    "assets/js/api/app.fx.js",
                    "assets/js/api/app.core.js",
                    "assets/js/api/app.electra.js",
                    "assets/nata/ui/electra/nata.ui.electra.class.js",
                    "assets/nata/ui/menu/nata.ui.menu.class.js",
                    "assets/nata/ui/nata.ui.responsive.js",
                    "assets/nata/ui/login/nata.ui.login.js",
                    "assets/js/api/app.usuario.js",
                    "assets/js/api/app.auditoria.js",
                    "assets/js/api/app.server.js",
                    "assets/js/api/app.cartera.js",
                    "assets/js/api/app.gestion.js",
                    "assets/js/api/app.furips.js",
                    "assets/js/api/app.furips.dos.js",
                    "assets/js/app.documentacion.js",
                    "assets/js/app.soportes.js",
                    "assets/js/api/app.upload.js",
                    "assets/js/app.cums.js",
                    "assets/js/app.rips.js",
                    "assets/js/app.adres.js",
                    "assets/js/app.asistente.js",
                    "assets/js/app.wizard.js",
                    "assets/js/app.wizard_v1.js",
                    "assets/js/app.wizard.class.js",
                    "assets/js/wizardEngine.class.js",
                    "assets/js/session.class.js",
                    "assets/js/app.robot.js"
                    
                ],
                dest: "source/apps.js"
            },

            data: {
                src: [

                ],
                dest: "source/data.js"
            },

            css: {
                src: [
                    "assets/css/bootstrap/bootstrap.min.css",
                    "assets/css/clusterize.css",
                    "assets/components/nata/ui/nata.ui.bootstrap.dropdown.nested.css",
                    "assets/nata/ui/login/nata.ui.login.css",
                    "assets/components/nata/ui/dialog/nata.ui.dialog.css",
                    "assets/css/flatpickr.min.css",
                    "assets/css/loader.css",
                    "assets/nata/nata.ui.search.css",
                    "assets/css/app.documentacion.css",
                    "assets/css/app.css",
                    "assets/css/theme.css",
                    "assets/css/scrollbar.css",
                    "assets/css/helper.css",
                    "assets/css/mq.css",
                    "assets/css/animista.css"
                ],
                dest: "source/apps.css"
            },

            portal_js_libraries: {
                src: [
                ],
                dest: "release/build/assets/js/portal_libraries.min.js"
            },

        },

        cssmin: {
            css: {
                src: "source/apps.css",
                dest: "release/build/assets/css/app.min.css"
            },
            portal: {
                src: "source/portal.css",
                dest: "release/build/assets/css/portal.min.css"
            }
        },

        /*
        uglify: {
            options: {
                sourceMapIncludeSources: true,
                compress: true
            },
            libraries: {
                files: {
                    "release/build/assets/js/libraries2.min.js": ["source/libraries.js"]
                }
            },
            index: {
                files: {
                    //'release/assets/js/app.min.js': ['release/assets/js/*.js']
                    "release/build/assets/js/app.min.js": ["source/apps.js"]
                }
            },
            data: {
                files: {
                    "release/build/assets/js/data.min.js": ["source/data.js"]
                }
            },
            portal: {
                files: {
                    //'release/assets/js/app.min.js': ['release/assets/js/*.js']
                    "release/build/assets/js/portal.min.js": ["source/portal.js"]
                }
            }
        },
        */

        terser: {
            options: {
                compress: {
                    drop_console: false   // remove console.log, console.info, ...
                },
                /*
                mangle: {
                    properties: false
                },
                sourceMap: false
                */
            },
            libraries: {
                files: {
                    "release/build/assets/js/libraries.min.js": ["source/libraries.js"]
                }
            },
            data: {
                files: {
                    "release/build/assets/js/data.min.js": ["source/data.js"]
                }
            },
            index: {
                files: {
                    "./release/build/assets/js/app.min.js": ["source/apps.js"],
                }
            }
        },

        htmlclean: {
            options: {
                /*protect: /<\!--%fooTemplate\b.*?%-->/g,*/
                /*edit: function(html) {
                    return html.replace("\n", "");
                }*/
            },
            index: {
                expand: false,
                //cwd: '',
                src: "index-release.html",
                dest: "release/build/index.html"
            },
            portal: {
                expand: false,
                //cwd: '',
                src: "index-portal.html",
                dest: "release/build/portal.html"
            }
        },

        // OJO NO USAR * EN UNA CARPETA LAS BORRA TODAS !!!
        clean: {
            portal_pre:
				[
				    "assets/images/portal/temporal/*.png",
				    "assets/images/portal/*.png",
				    "assets/images/portal/*.webp",
				    "release/build/assets/images/portal/*.png",
				    "release/build/assets/images/portal/*.webp"
				],

            portal_pos: [
                "assets/images/portal/temporal/*.png"
            ]
        },

        copy: {
            images: {
                expand: true,
                cwd: "assets/images/",
                src: "**",
                dest: "release/build/assets/images/",
                flatten: true,
                filter: "isFile",
            },
            portal: {
                files: [
                    // includes files without path
                    {
                        expand: true, cwd: "assets/images/portal/", src: ["*.png", "*.webp"], dest: "release/build/assets/images/portal/",
                        flatten: true, filter: "isFile"
                    },
                    {
                        expand: true, cwd: "assets/images/", src: ["**"], dest: "release/build/assets/images/"
                    },
                    /*,
                    {
                        expand: true, cwd: "assets/images/product/source", src: ["logo-birra-black.png"], dest: "release/build/assets/images/product/",
                        flatten: true, filter: "isFile"
                    },
                    */
                    //{ expand: false, cwd: "assets/images/product/", src: ["*.webp"], dest: "release/build/assets/images/product/"},

                    // includes files within path and its sub-directories
                    //{expand: true, src: ["path/**"], dest: "dest/"},

                    // makes all src relative to cwd
                    //{expand: true, cwd: "path/", src: ["**"], dest: "dest/"},

                    // flattens results to a single level
                    //{expand: true, flatten: true, src: ["path/**"], dest: "dest/", filter: "isFile"},
                ],
            }
        },

        "string-replace": {
            dist: {
                files: {
                    "release/build/index.html": "release/build/index.html"
                },
                options: {
                    replacements: [
                        {
                            pattern: /(\r\n|\n|\r|\t)/gm,
                            replacement: ""
                        },
                        {
                            pattern: "        ",
                            replacement: ""
                        },
                        {
                            pattern: "        ",
                            replacement: ""
                        }
                    ]
                }
            }
        },

        appcache: {
            options: {
                basePath: "release/build/assets/"
            },
            all: {
                dest: "release/build/manifest.appcache",
                cache: "release/build/assets/**/*",
                network: "*",
                fallback: "/ /offline.html"
            }
        },

        "replace": {
            apk: {
                options: {
                    patterns: [
                        {
                            // replace apk
                            match: /0.0.2/g,
                            //replacement: "<%= pkg.version %>"
                            replacement: function () {
                                return "0.0.3";
                            }
                        }
                    ]
                },
                files: [
                    { src: ["../cordova/pelaez/config.xml"], dest: "../cordova/pelaez/config.xml" }
                ]
            },
            app: {
                options: {
                    patterns: [
                        {
                            // replace web
                            match: /v0.2.60/g,
                            //replacement: "<%= pkg.version %>"
                            replacement: function () {
                                return "v0.2.61";
                            }
                        }
                    ]
                },
                files: [
                    //{expand: true, flatten: true, src: ["build/release/index.html"], dest: "build/release/index.html"},
                    //{expand: true, flatten: true, src: ["index.html"], dest: "build/release/index.html"},
                    { src: ["index.html"], dest: "index.html" },
                    { src: ["assets/js/api/app.config.js"], dest: "assets/js/api/app.config.js" },
                    { src: ["index-release.html"], dest: "index-release.html" },
                    { src: ["index-portal.html"], dest: "index-portal.html" },
                    { src: ["release/build/version.txt"], dest: "release/build/version.txt" },
                    { src: ["../cordova/pelaez/package.json"], dest: "../cordova/pelaez/package.json" }
                ]
            }
        },

        /*
        htmlmin: {  // Task
            dist: { // Target
                options: { // Target options
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyCSS: true,
                    html5: true,
                    caseSensitive: true,
                    minifyURLs: true
                },
                files: { // Dictionary of files
                    "release/build/index.html": "index-release.html"    // 'destination': 'source'
                }
            },
            //    dev: { // Another target
            //        files: {
            //        'dist/index.html': 'src/index.html',
            //        'dist/contact.html': 'src/contact.html'
            //        }
            //    }
        }
        */
    });

    grunt.loadNpmTasks("grunt-responsive-images");
    grunt.loadNpmTasks("grunt-contrib-imagemin");
    grunt.loadNpmTasks("grunt-svgmin");
    grunt.loadNpmTasks("grunt-real-favicon");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-htmlclean");
    grunt.loadNpmTasks("grunt-string-replace");
    grunt.loadNpmTasks("grunt-cwebp");
    grunt.loadNpmTasks("grunt-appcache");
    grunt.loadNpmTasks("grunt-replace");
    //grunt.loadNpmTasks("grunt-contrib-htmlmin");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-terser");

    grunt.loadNpmTasks("grunt-contrib-copy");

    /*
    grunt.loadNpmTasks("grunt-image");
    grunt.loadNpmTasks("grunt-debug-task");
    grunt.loadNpmTasks("grunt-contrib-concat"); // which NPM packages to load
    */

    grunt.registerTask("files", ["concat", "cssmin", "uglify", "htmlclean", "string-replace", "appcache", "copy:main", "copy:icons", "copy:htaccess", "copy:service", "copy:iconRoot"]); // which packages to run
    grunt.registerTask("vector", ["svgmin"]); // which packages to run
    grunt.registerTask("banner", ["responsive_images:banner", "imagemin", "cwebp"]); // which packages to run
    grunt.registerTask("images-only", ["cwebp"]);
    //grunt.registerTask("images", ["responsive_images","copy", "realFavicon", "concat"]);

    grunt.registerTask("svg", ["copy:svg", "svgmin"]);

    //"copy:html"
    grunt.registerTask("afan", ["replace", "concat", "cssmin", "uglify", "htmlclean", "string-replace", "appcache", "copy"]);

    grunt.registerTask("fix", ["copy:html", "string-replace"]);

    /*grunt.registerTask("default", ["replace", "copy:svg", "realFavicon", "concat", "cssmin", "uglify", "htmlclean", "string-replace", "appcache", "copy"]);*/

    grunt.registerTask("images", ["responsive_images:images", "imagemin"]); //, "cwebp"]); // which packages to run

    grunt.registerTask("favicon:build", ["realFavicon:build"]);
    grunt.registerTask("favicon:dev", ["realFavicon:dev"]);

    grunt.registerTask("portal_images", ["clean:portal_pre", "responsive_images:portal", "cwebp:portal", "imagemin", "copy:portal"]); // which packages to run

    // genera data y libraries, solo cuando cambien !!
    grunt.registerTask("libraries", ["replace:app", "concat:libraries", "concat:js", "concat:data", "concat:css", "cssmin:css", "terser:libraries", "terser:index", "terser:data", "htmlclean", "string-replace"]);
    grunt.registerTask("portal", ["replace:app", "concat:libraries", "concat:js", "concat:css", "cssmin:css", "uglify:portal", "htmlclean", "string-replace"]);
    grunt.registerTask("replace_app", ["replace:app"]);

    grunt.registerTask("copiar", ["copy:images"]);

    grunt.registerTask("default", ["replace:app", "concat:js", "concat:css", "cssmin:css", "terser:index", "htmlclean", "string-replace"]);
    //grunt.registerTask("default", ["replace:app", "concat:js", "concat:css", "cssmin:css", "terser:index", "copiar"]);
    // final final
};

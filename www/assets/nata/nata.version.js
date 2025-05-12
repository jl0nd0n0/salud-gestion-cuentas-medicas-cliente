/* globals nata, app, swal, session,axios */

nata.version = {
    // nata.version.check
    check: function () {
        console.log("nata.version.check");
        if (app.config.version.check.review) {

            axios.get(app.config.version.check.server)
                .then(function (response) {
                    console.log("SERVIDOR: " + response.data.v);
                    console.log("APP.CONFIG: " + app.config.version.check.version);
                    //console.log(app.config.version.check.version.toString().trim() !== response.data.v.toString().trim());
                    if (app.config.version.check.version.toString().trim() !== response.data.v.toString().trim()) {
                        console.log("SERVIDOR: " + response.data.v);
                        console.log("APP.CONFIG: " + app.config.version.check.version);
                        swal({
                            title: "Hay una actualización disponible",
                            text: "Por favor actualiza la aplicación",
                            icon: "warning",
                            buttons: ["NO", "SI, Actualizar"],
                            dangerMode: true,
                        }).then((response) => {
                            if (response) {
                                location.reload(true);
                            }
                        });
                    }
                }).catch(function (error) {
                    console.log(error);
                });
        }
    },
    login: function(){
        
        if(session.user !== undefined){
            if(session.user.ir.toString() == 12 || session.user.ir.toString() == 0){
                swal("informacion", "Su sesión ha expirado", "info");
                setTimeout(() => {
                    sessionStorage.clear();
                    localStorage.clear();
                    location.reload(true);
                }, "3000");
            }
        }
    }
};

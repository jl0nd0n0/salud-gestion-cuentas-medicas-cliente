/* globals app, session, nata */

app.telemetria = {
    usuario: {
        activo: function () {
            console.log("app.telemetria.usuario.activo");

            const timestamp = new Date().getTime();
            const oTelemetria = {
                iu: session.user.i,
                il: timestamp,
                v: app.config.version.check.version
            };

            const url = app.config.server.php + "core/telemetriaUsuarioActivo?ts=" + timestamp;
            nata.ajax("post", url, oTelemetria, "json", function (response) {
                console.log(response);
            });

        }
    }
};
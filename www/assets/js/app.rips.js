/* globals app, nataUIDialog, session, axios */

app.rips = {
    cargar: function () {
        console.log("%c app.rips.cargar", "background:red;color:white;font-weight:bold;font-size:11px");
        const title = "Subir Soportes";
        const url = app.config.server.php1 + "x=rips&y=cargar&z=" + session.user.i + "&ts=" + new Date().getTime();

        new nataUIDialog({
            height: 450,
            width: 400,
            html: `
                    <nata-ui-upload
                        data-title = "${title}"
                        data-subtitle = "Solo archivos con extensión zip"
                        data-accept = ".zip"
                        data-url = "${url}"
                        data-etl = ""
                        data-consola=1
                        ></nata-ui-upload>
            `,
            title: title
        });
    },
    generar: function (){
        axios.get(app.config.server.php1 + "k=rips&x=generar&z=" + session.user.ir)
            .then(function(response){
                console.log(response.data);

                const file = app.config.server.path + response.data;
                window.open(file, "_blank");
            })
            .catch(function(error){
                console.error(error);
            });
    }
};
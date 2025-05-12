/* globals app, nataUIDialog */

app.upload = {
    index: function () {
        new nataUIDialog({
            html: `
                <nata-ui-upload-multiple data-url='${app.config.server.php1}v=upload&x=index'></nata-ui-upload-multiple>
            `,
            title: "Subir Datos"
        });
    },
    soportes: {
        subir: function (urlUpload = app.config.server.upload) {
            console.log("%c app.upload.soportes.subir", "background:red;color:white;font-weight:bold;font-size:11px");
            const title = "Subir Archivo";
            new nataUIDialog({
                height: 450,
                width: 400,
                html: `
                      <nata-ui-upload
                        data-title="${title}"
                        data-subtitle="Solo archivos con extensión xlsx"
                        data-accept="xlsx"
                        data-url="${urlUpload}"
                        data-consola=2
                        data-etl=""
                      ></nata-ui-upload>
                `,
                title: title
            });
        },
        subirFacturasZip: function (urlUpload = app.config.server.upload) {
            console.log("%c app.upload.soportes.subir", "background:red;color:white;font-weight:bold;font-size:11px");
            const title = "Subir Facturas";
            new nataUIDialog({
                height: 450,
                width: 400,
                html: `
                      <nata-ui-upload
                        data-title="${title}"
                        data-subtitle="Solo archivos con extensión zip"
                        data-accept=".zip"
                        data-url="${urlUpload}"
                        data-etl=""
                      ></nata-ui-upload>
                `,
                title: title
            });
        },
        subirSoportes: function (urlUpload = app.config.server.upload) {
            console.log("%c app.upload.soportes.subir", "background:red;color:white;font-weight:bold;font-size:11px");
            
            const title = "Subir Soportes";
            new nataUIDialog({
                height: 450,
                width: 400,
                html: `
                      <nata-ui-upload
                        data-title="${title}"
                        data-subtitle="Solo archivos con extensión zip"
                        data-accept=".zip,application/zip"
                        data-url="${urlUpload}"
                        data-etl=""
                      ></nata-ui-upload>
                `,
                title: title
            });
        },
        
    }
};

/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* globals app, nataUIDialog, axios,swal,session */

app.furips.dos = {
    render: function () {
        console.log("%c app.furips.dos.render","background:red;color:white;font-weight:bold;font-size:11px");
        app.core.dialog.removeAll();

        const template = `
            <div class="container mt-7">
                <h1 class="mb-4">Subida furips anexo 2 </h1>
                <form id="frmUpload" enctype="multipart/form-data">
                    <div class="mb-3">
                        <div class="alert alert-info" role="alert">
                          Por favor no olvide cargar el archivo de furips anexo 2 con el nombre:
                          <strong>furips.xlsx</strong>
                        </div>
                        <label for="excelFile" class="form-label">Archivos tipo Excel:</label>
                        <input id="inputExcelFile" name="inputExcelFile" type="file" class="form-control" accept=".xls, .xlsx">
                    </div>
                    <button type="submit" class="btn btn-primary">Subir</button>
                </form>
            </div>
        `;
        new nataUIDialog({
            height: 400,
            width: 500,
            html: template,
            title: "Generar Furips Anexo 2",
            events: {
                render: function() {},
                close: function() {}
            }
        });

      document.querySelector("#frmUpload").addEventListener("submit", function(event) {
          event.stopPropagation();
          event.preventDefault();

          const formData = new FormData();
          const excelFile = document.querySelector("#inputExcelFile");
          formData.append("excel", excelFile.files[0]);

          //document.getElementById("loader").style.display = "block";
          axios.post(app.config.server.php1 + "x=module=furipsDos&y=upload&userid=" + session.user.i + "&etl=etlFuripsAnexo2", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then(response => {
          document.getElementById("loader").style.display = "none";
            swal("Registro Exitoso", "Se registraron los datos", "success");
            console.log("Carga exitosa");
            console.log(response.data);
        }).catch(error => {
            document.getElementById("loader").style.display = "none";
            swal("Fallo en la carga", "contactar a soporte", "error");
            console.error("Error al cargar el archivo");
            console.error(error);
        });


    }, true);

    }
};

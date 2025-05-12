/* globals app */

app.admin = {
    medicos: {
        render: function () {
            console.log("app.admin.medicos.render");
            fetch(app.config.server.php + "medicos/get/")
                .then(function (response) {
                    return response.json();
                }).then(function (json) {
                    console.log(json);
                    //document.getElementById("container").render("templateMedicosListar", {detail:json});
                    //template, data, elContainer, lista, callback, strNameElementSearch, strNameElementList
                    const container = document.getElementById("container");
                    const callback = function (){
                        document.querySelector("#container").style.display = "block";
                    };
                    app.core.ui.jets.iniciar("templateMedicosListar", json, container, undefined, callback, "txtSearch", "listMedicos");
                });
        }
    },
    pacientes: {
        masiva: {
            render: function () {
                console.log("app.admin.pacientes.masiva.render");
                //alert("implementar:  app.admin.pacientes.masiva.render");
            }
        }
    }
};
/* global app, atenea */

if (typeof app.adapter == "undefined") {
    app.adapter = {};
}

app.adapter.parte = {
    get: function () {
        console.log("app.adapter.parte.get");
        return {
            tipoPersona: [
                {
                    i: 1,
                    t: "Persona Natural"
                },
                {
                    i: 2,
                    t: "Persona Jurídica"
                }
            ],
            tipoIdentificacion: [
                {
                    i: 1,
                    t: "Cédula Ciudadanía"
                },
                {
                    i: 2,
                    t: "Cédula Extranjería"
                },
                {
                    i: 3,
                    t: "Pasaporte"
                },
                {
                    i: 4,
                    t: "RUT"
                }
            ]
        };
    }
};
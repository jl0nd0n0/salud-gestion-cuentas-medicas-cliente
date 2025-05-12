/* globals app, session, Appwrite, nata, session */

app.appwrite = {

    init: function () {
        console.log( "app.appwrite.init" );
        //#region appwrite

        // Init your Web SDK
        session.appwrite = new Appwrite();
        session.appwrite
            .setEndpoint( "http://amsalud.crescend.software:8081/v1" ) // Your Appwrite Endpoint
            .setProject( "628006cfc2f585eae5ee" ) // Your project ID
        ;
        app.appwrite.login();

        /*
        session.appwrite
            .account.create("unique()", "me@example.com", "password", "Jane Doe")
            .then(response => {
                console.log(response);
            }, error => {
                console.log(error);
            });

        */

        //#endregion
    },

    document: {
        create: async function ( idCollection, data) {
            console.log( "app.appwrite.document.create" );
            try {
                const response = await session.appwrite.database.createDocument( idCollection, "unique()", data );
                console.log("Se ha creado la appwrite colección", response); // Success
            } catch (e) {
                console.error( e );
            }
        }
    },

    historiaClinica: {
        actualizar: function ( data) {
            console.log( "app.appwrite.historiaClinica.actualizar" );
            app.appwrite.document.create( "6280135d35cac2bbe305", data );
        }
    },

    login: async function () {
        try {

            console.log( session.email, session.password );

            let response = await session.appwrite.account.createSession(
                nata.localStorage.getItem("user").e,
                nata.localStorage.getItem("user").p
            );
            console.log(response);
            //app.appwrite.test.document();

        } catch (e) {
            console.error( e );
        }
    },

    test: {
        document: function () {
            console.log( "app.appwrite.test.document" );

            const promise = session.appwrite.database.createDocument( "6280135d35cac2bbe305", "unique()", { test: "hola" } );
            promise.then(function (response) {
                console.log("Se ha creado la appwrite colección", response); // Success
            }, function (error) {
                console.error( error );
            });
        }
    }
};
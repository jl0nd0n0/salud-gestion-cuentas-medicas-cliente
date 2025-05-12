/* globals nata, Parse */

if ( typeof nata.backend == "undefined") nata.backend = {};
nata.backend.parse = {
    init: function () {
        console.log( "nata.backend.parse.init" );
        Parse.initialize("artemisa", "HcsN7TwvVJwPHqUQSErEIDgNTR2rjY71gIiqn8ZzODqOkTY5ki");
        //javascriptKey is required only if you have it on server.
        Parse.serverURL = "https://amsalud.crescend.software:1337/parse";
        console.log( Parse );
    },

    test: function () {
        console.log( "nata.backend.parse.test" );

        const GameScore = Parse.Object.extend("GameScore");
        const gameScore = new GameScore();

        gameScore.set("score", 1337);
        gameScore.set("playerName", "Sean Plott");
        gameScore.set("cheatMode", false);

        gameScore.save()
            .then((gameScore) => {
            // Execute any logic that should take place after the object is saved.
                alert("New object created with objectId: " + gameScore.id);
            }, (error) => {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
                alert("Failed to create new object, with error code: " + error.message);
            });
    }
};
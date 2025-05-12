/* globals app, session */

app.sound = {
    load: function () {
        console.log("app.sound.load");
        //createjs.Sound.registerSound("assets/sounds/beat.wav", "beat");
        session.audio.beat = new Audio("assets/sounds/beat-1.mp3");
    },
    play: function () {
        console.log("app.sound.play");
        /*
        createjs.Sound.registerSound("assets/sounds/beat.wav", "beat");
        createjs.Sound.play("beat", {loop: true});
        */
        if (app.config.sound.play) {
            session.audio.beat.play();
        }
    },
    playDev: function () {
        console.log("app.sound.playDev");
        /*
        createjs.Sound.registerSound("assets/sounds/beat.wav", "beat");
        createjs.Sound.play("beat", {loop: true});
        */
        if (app.config.sound.play) {
            session.audio.dev = new Audio("assets/sounds/alarma-dev.mp3");
            session.audio.dev.play();
        }
    }
};
/* globals app, nata, session */

(function () {
    console.log("***** document ready *****");

    session.height = window.innerHeight;
    session.width = window.innerWidth;

    setInterval(nata.version.check, app.config.version.check.time * 1000);
    // cerrar sesion
    // setInterval(nata.version.login, app.config.version.check.time * 1000);
}());

app.index = function () {
    console.trace("app.index");
    document.querySelector("#containerLogin").remove();
    document.querySelector("#containerDashboard").style.display = "block";
    document.querySelector("#container-menu").innerHTML = "<nata-ui-menu></nata-ui-menu>";

    const idPerfil = nata.localStorage.getItem("user").ir;
    const appIniciada = nata.localStorage.getItem("app-iniciada");    
    if (appIniciada == "1") {
        app.monitor.index();
        document.getElementById("loader").style.display = "none";
    }
    else {
        app.server.data.get(idPerfil);
    }
};




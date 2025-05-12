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
    console.log("app.index");
    document.querySelector("#containerLogin").remove();
    document.querySelector("#containerDashboard").style.display = "block";

    document.querySelector("#container-menu").innerHTML = "<nata-ui-menu></nata-ui-menu>";

    const idPerfil = nata.localStorage.getItem("user").ir;
    app.server.data.get(idPerfil);
};




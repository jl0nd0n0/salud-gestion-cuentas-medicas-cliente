/* globals app, nata */

app.debug = {
    /**
     *
     * @param {string} label label message
     * @param {object} objectData objet to print in console
     * @param {bool} boolTrace show trace ?
     */
    log: function ( label, objectData, boolTrace = false) {
        const timestamp = new Date().getTime();
        if ( typeof label == "undefined") label = timestamp;
        nata.sessionStorage.setItem( "debug-" + timestamp, objectData );
        nata.fx.log( "DEBUG " + label, "danger", nata.sessionStorage.getItem( "debug-" + timestamp ), boolTrace );
        sessionStorage.removeItem ( "debug-" + timestamp );
    }
};
/* globals nata, app */

if ( typeof nata.form == "undefined" ) nata.form = {};

nata.form.adapter = function ( self ) {
    console.log( "nata.form.adapter" );

    //@audit deprecate -> self.events.formSend
    if (typeof self.events.afterSend == "function") self.events.afterSend();
    if (typeof self.events.formSend == "function") self.events.formSend( self.data );

    // guardar la data en offline
    const url = app.config.server.php + "core/actualizar_v1?ts=" + new Date().getTime();

    //#region recuperar la fecha
    let date;
    if ( typeof self.options.config.index.date !== "undefined" ) {
        if ( typeof  self.options.config.index.date.prop !== "undefined" ) {
            date = self.data[ self.options.config.index.date.prop ];
        }
        else {
            date = self.options.config.index.date.value;
        }
    }
    //#endregion recuperar la fecha

    //#endregion guardar localmente la data
    const objectLocal = {};
    let i;
    for (i=0; i<self.options.config.index.keys.length; i++) {
        objectLocal[self.options.config.index.keys[i].prop] = self.options.config.index.keys[i].value;
    }
    console.log( objectLocal );
    console.log( self.data );
    const timestamp = new Date().getTime().toString();
    const dataLocal = {
        ios: objectLocal.ios,
        order: timestamp,
        m: self.options.config.index.key,
        i: timestamp,
        f: date,
        ft: date,
        dy: date.substr( 0, 4, date ),
        dm: date.substr( 5, 2, date ),
        dd: date.substr( 7, 2, date ),
        json: JSON.stringify( self.data )
    };
    console.log( dataLocal );
    //dataHistoriaClinica
    let dataSesionConsulta = nata.sessionStorage.getItem( self.options.config.index.tableCollection );
    if ( dataSesionConsulta === null) dataSesionConsulta = [];
    //app.debug.log("data completa", dataHistoriaClinica );
    //app.debug.log("key", self.options.config.index.key );
    //dataHistoriaClinicaAdapter
    let dataSesionConsultaFilter = dataSesionConsulta.filter(function ( record ) {
        return ( record.ios + "-" + record.m ) !== ( objectLocal.ios + "-" + self.options.config.index.key );
    });
    dataSesionConsultaFilter.push( dataLocal );
    nata.sessionStorage.setItem( self.options.config.index.tableCollection, dataSesionConsultaFilter );
    //#endregion

    console.log( self.options.config.index );
    const objectSend = {};
    objectSend.index = self.options.config.index;
    objectSend.index.date = date;
    objectSend.index.order = new Date().getTime().toString();
    objectSend.data = self.data;
    objectSend.url = url;

    console.log( self.options );
    console.log( objectSend );

    if (typeof self.events.afterSaveRecordLocal == "function") {
        self.events.afterSaveRecordLocal( self.options );
    }

    // soporte offline
    app.offline.setItem(timestamp, url, objectSend);

    if( app.config.dev.online ) {
        nata.ajax("post", url, objectSend, "json", function ( response ) {
            console.log( response );
            app.offline.removeItem( timestamp );
        });
    }

    /*
    // recuperamos la data del formulario
    const data = self.data;
    console.log( data );

    // abrir dialogo mensaje confirmacion
    if (self.options.form.boolShowDialogMessage) swal(app.config.title, "Registro Exitoso\nHas actualizado la información", "success");
    */

    // agregar el registro localmente
    // guardar datos localmente
    /*
    console.log( data );
    const objectSend = {};
    let i;
    for (i=0; i<self.options.config.index.keys.length; i++) {
        objectSend[self.options.config.index.keys[i].prop] = self.options.config.index.keys[i].value;
    }
    const timestamp = new Date().getTime().toString();
    const index = {
        key: self.options.config.index.key,
        date: date,
        order: timestamp,
        data: data
    };
    objectSend.config = self.options.config;
    objectSend.config.index = index;
    console.log( objectSend );
    */

};

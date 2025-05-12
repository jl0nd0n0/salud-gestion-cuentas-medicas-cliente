/* globals artemisaState, app, nata */


// eslint-disable-next-line no-unused-vars
class artemisaHistoriaClinica {

    constructor() {
        // eslint-disable-next-line no-unused-vars
        const self = this;
        self.oState = new artemisaState();
        this.requeridos = app.config.historiaClinica.modulos.obligatorios;
    }

    get evolucionGet () {
        const data = this.oState.get( "historiaClinicaEvolucion" );
        if ( Array.isArray( data ) ) return data;
        else return [];
    }

    evolucionUpdate ( idOrdenServicio, modulo ) {
        console.log( "evolucionUpdate" );
        console.log ( idOrdenServicio, modulo );
        const self = this;

        console.log( self.evolucionGet );

        const data = self.evolucionGet.filter(function ( record ) {
            return record.ios == idOrdenServicio;
        });

        const dataState = self.evolucionGet.filter(function ( record ) {
            return record.ios != idOrdenServicio;
        });

        if ( data.length == 0 ) {
            console.log( "paso 01" );
            dataState.push({
                ios: idOrdenServicio,
                modulos: modulo
            });
        }
        else {
            console.log( "paso 01" );
            let modulos = data[0].modulos;
            if ( modulos.indexOf( modulo ) === -1 ) {
                modulos += "," + modulo;
            }
            data[0].modulos = modulos;
            dataState.push( data[0] );
        }

        console.log( dataState );
        self.oState.setProp( "historiaClinicaEvolucion", dataState, false );
    }

    test () {
        // 1 instanciar el estado
        console.group( "artemisa historia clinica state" );
        console.log( this.evolucionGet );
        this.evolucionUpdate( 48, "basica" );
        this.evolucionUpdate( 48, "dx" );
        this.evolucionUpdate( 48, "dx" );
        console.log( nata.localStorage.getItem( "artemisaState" ) );
        console.groupEnd( "artemisa historia clinica state" );
    }

    activateCloseItem ( idOrdenServicio ) {
        console.log( "activateCloseItem" );
        const self = this;

        // sacar los modulos
        //console.log( idOrdenServicio );
        let data = self.evolucionGet.filter(function ( record ) {
            return record.ios == idOrdenServicio;
        });
        console.log( data );
        let modulos;
        if ( data.length == 0 ) modulos = "";
        else modulos = data[0].modulos;
        //console.log( modulos );

        let i, boolReturn = true;
        for ( i=0; i < self.requeridos.length; i++ ) {
            console.log( self.requeridos[i] );
            if ( modulos.toString().indexOf( self.requeridos[i].toString().trim() ) === -1 ) {
                boolReturn = false;
                break;
            }
        }
        //console.log( boolReturn );

        if (boolReturn) {
            const elements = document.querySelectorAll(".button-hc-cerrar");
            console.log(elements);
            let i;
            for (i=0; i<elements.length; i++) {
                elements[i].classList.remove("disabled");
            }
        }

        return boolReturn;
    }

    activateCloseDetail () {
        console.log( "activateCloseDetail" );
        const self = this;

        let i;
        const dataEvolucion = self.evolucionGet;
        for ( i=0; i < dataEvolucion.length; i++ ) {
            self.activateCloseItem( dataEvolucion[i].ios );
        }
    }
}
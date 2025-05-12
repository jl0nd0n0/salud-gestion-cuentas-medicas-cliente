/* globals nata, debugContador */

// eslint-disable-next-line no-unused-vars
class artemisaState {

    constructor () {
        this._session = {
            datosBasicos: {}
        };
    }

    get state () {
        return nata.localStorage.getItemObject( "artemisaState" );
    }

    get ( key ) {
        let retorno, data = this.state;
        // eslint-disable-next-line no-unused-vars
        if (typeof data[key] == "undefined") {
            retorno = {};
        }
        else {
            retorno = data[key];
        }
        return retorno;
    }

    setProp (key = "", data = {}, boolSynchronizeProps = true ) {
        nata.fx.log( "setProp debug", "danger", key );
        
        //console.log(debugContador);
        //console.trace("aqui es");
        //DANGER: para Debug
        //const timestamp = new Date().getTime();
        //nata.sessionStorage.setItem( "debug-" + (debugContador++) + "-"+ timestamp, data );
        //console.trace( "setProp", timestamp, oState.state );
        
        const self = this;
        //let dataHistorial;

        if (key != "") {
            if ( boolSynchronizeProps ) {
                //@audit corregir esta logica
                const dataState = self.state;
                if ( typeof dataState[ key ] == "undefined" ) {
                    dataState[ key ] = {};
                }
                else {
                    let dataProp = dataState[key];
                    console.log( dataProp );
                    console.trace( data );
                    //app.debug.log( "debug 99", data );
                    console.log( dataState);
                    console.log( key );

                    let prop;
                    for (prop in data) {
                        if (Object.prototype.hasOwnProperty.call(data, prop)) {
                            dataProp[ prop ] = data[ prop ];
                        }
                    }
                    dataState[ key ] = dataProp;
                }
                console.log( dataState );
                nata.localStorage.setItem( "artemisaState", dataState );
            }
            else {
                const dataState = this.state;
                /*
                if ( typeof dataState[ key ] == "undefined" ) {
                    dataState[ key ] = {};
                }
                else {
                    dataState[ key ]  = data;
                }
                */
                dataState[ key ]  = data;
                nata.localStorage.setItem( "artemisaState", dataState );
            }
        }
    }

    binding() {
        const self = this;
        console.log( "artemisaUIMenuHistoriaClinica.state" );

        Object.defineProperty( self._session.evolucion, "registro", {
            get: function () {
                console.log("Getter called");
                return "";
            },
            set: function ( value ) {
                console.log("Setter called");
                const elements = document.querySelectorAll( ".button-hc-evolucion" );
                for (let i = 0; i < elements.length; i++) {
                    elements[i].classList.remove( "disabled" );
                }
                console.log( value );
            }
        });
        //self._state.registroDatosBasicos = 1; // triggers setter function
        //const someValue = data.prop; // t
    }
}
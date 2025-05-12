/* globals doT, localforage, nata  */

class nataUIDropdown extends HTMLElement {

    constructor() {
        // Always call super first in constructor
        super();
        console.log("*** nataUIDropdown ***");

    }

    get open() {
        return this._open;
    }

    set open( value ) {
        this._open = value;
    }

    toggle () {
        console.log( "nataUIDropdown.toggle" );

        const self = this;

        const element = self.querySelector( ".dropdown-menu" );
        if ( element.classList.contains ( "hide" ) ) {
            element.classList.remove( "hide" );
            self.querySelector( ".dropdown-menu" ).style.display = "block";
        }
        else {
            element.classList.add( "hide" );
            self.querySelector( ".dropdown-menu" ).style.display = "none";
        }
    }

    connectedCallback() {
        const self = this;

        let boolAnimate = false;
        //animate
        if ( typeof this.dataset.animate !== "undefined" ) {
            boolAnimate = true;
        }

        let strAlign = "left";
        // align
        if (typeof self.dataset.align !== "undefined") {
            strAlign = self.dataset.panelAlign;
        }

        // dialog
        console.log(self.dataset.dialog);
        let dialog;
        if (self.dataset.dialog !== null) {
            dialog = document.querySelector(self.dataset.dialog);
            console.log(dialog);
            self.dialog = dialog;
        }

        console.log(self.dialog);

        console.log( self.getAttribute("id") );
        console.log( this.dataset.data );

        let html = `
            <style>
                nata-ui-dropdown .dropdown-menu  .dropdown-item {
                    padding: 6px 12px;
                }
            </style>
            <div class="dropdown position-relative">
                <!-- Button -->

                ${ boolAnimate ? "<div class='button-nata-ui-animate'></div>" : ""}

                <button
                    type="button"
                    class="btn btn-nata-ui-dropdown ${self.dataset.button || "btn-primary"} ${self.dataset.class || ""}"
                    type="button" data-bs-toggle="dropdown" aria-expanded="false">

                    ${self.dataset.text || "text"}
                </button>
        `;

        let tagEnd;

        if ( typeof self.dataset.data == "undefined" ) {

            if (typeof self.html != "undefined") {

                html += `
                    <div class="dropdown-menu hide ${self.dataset.classPanel || ""} ${strAlign == "left" ? "left-0" : "right-0"}">
                        ${self.html}
                `;

                tagEnd = "</div>";
            }
            else {

                html += `<ul class="dropdown-menu hide ${strAlign == "left" ? "left-0" : "right-0"}">`;
                tagEnd = "</ul>";

                // render data
                const template = self.dataset.template;
                console.log(template, self.dataset);
                if (typeof template === "undefined") {
                    console.log( window.tag );
                    html += window.tag;
                    window.tag = null;
                }
                else {

                    if ( self.dataset.storageType == "localforage" ) {
                        localforage.getItem( self.dataset.storageKey ).then(function( data ) {
                            nata.sessionStorage.setItem( "debug", data );
                            console.log( nata.sessionStorage.getItem( "debug" ) );
                            data = data.filter(function(record) {
                                return record[ self.dataset.storageIndex ] == self.dataset.storageValue;
                            })[0];
                            console.log( data );
                            const htmlTemplate = doT.template( document.getElementById(template).innerHTML )( data );
                            console.log( htmlTemplate );
                            console.log ( html );
                            html += htmlTemplate;
                            console.log( html );
                            html +=     tagEnd;
                            html += "</div>";

                            self.innerHTML = html;

                            self.querySelector( ".btn-nata-ui-dropdown" ).addEventListener("click", function (event) {
                                event.preventDefault();
                                event.stopPropagation();
                                self.toggle();
                            }, true);
                        });
                    }
                }
            }
        } else {

            const data = JSON.parse( self.dataset.data );
            console.log ( data );

            html += `
                <ul class="dropdown-menu hide ${strAlign == "left" ? "left-0" : "right-0"}">
            `;

            const template = `
                {{~ it.detail: d:id}}
                    <li class="dropdown-item {{=d.class}}" data-id="{{= d.id}}"
                        data-ipa="{{=d.ipa}}" data-ios="{{=d.ios}}">
                        {{= d.text}}
                    </li>
                {{~}}
            `;

            const htmlTemplate = doT.template( template )( { detail: data } );
            html += htmlTemplate;

            self.innerHTML = html;

            self.querySelector( ".btn-nata-ui-dropdown" ).addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                self.toggle();
            }, true);
        }

        if ( self.querySelector(".button-nata-ui-animate") !== null ) {
            setTimeout(() => {
                self.querySelector(".button-nata-ui-animate").classList.add("ball");
            }, 1.25 * 1000);
            setTimeout(() => {
                self.querySelector(".button-nata-ui-animate").classList.remove("ball");
            }, 3 * 1000);
        }

    }

}

// Define the new element
customElements.define("nata-ui-dropdown", nataUIDropdown);
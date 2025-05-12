/* globals session */

// eslint-disable-next-line no-unused-vars
class nataUIDialog {

    constructor( options = {} ) {

        const settings = {
            id: new Date().getTime(),
            height: "",
            title: "title",
            top: 0,
            width: "100%",
            left: 0,
            close: {
                remove: true
            }
        };

        this.options = Object.assign( settings, options );
        this.options.close = Object.assign(settings.close, options.close);
        //console.trace(options);
        this.prefixID = "uiDialog-";
        //console.log( this.options );
        this.render( options.html );
    }

    get getID() {
        return "#" + this.prefixID + this.options.id;
    }

    closeAll () {
        const self = this;
        const elements = document.querySelectorAll("#" + self.id);
        let i;
        for (i=0; i < elements.length; i++) {
            elements[i].remove();
        }
    }

    destroy() {
        const self = this;
        const element = document.querySelector( "#" + self.prefixID + this.options.id );
        if (element !== null) element.remove();
    }

    hide() {
        const self = this;
        document.querySelector( "#" + self.prefixID + self.options.id ).style.display = "none";
    }

    render( html = "" ) {
        console.log("render");
        //alert("render");

        const self = this;

        const div = document.createElement("div");
        self.id = self.prefixID + self.options.id;
        div.setAttribute( "id", this.prefixID + this.options.id );
        div.setAttribute( "class", "ui-dialog ui-animation-open" );

        /* styles */
        div.style.visibility = "hidden";
        div.style.display = "block";
        //let styleHeightBody = "";
        if (self.options.height == "") {
            div.style.height = "100%";
        }
        else if (typeof self.options.height == "number") {
            div.style.height = self.options.height + "px";
            //styleHeightBody = "max-height:" + (self.options.height-50) + "px;";
        }
        /*
        else {
            //div.style.height = this.options.height;
            //styleHeightBody = "max-height:calc(100% - 75px);";
            div.style.height = (session.height - self.options.top * 2) + "px";
        }
        */

        //alert(this.options.width);
        if (isNaN(this.options.width)) {
            div.style.width = this.options.width;
        }
        else {
            div.style.width = this.options.width +"px";
        }

        let html_ = `
			<div class="ui-dialog-header d-flex justify-content-between">
                <div>
                    <h6 class="vertical-middle d-inline-block me-3">${self.options.title}</h6>                    
        `;

        if (typeof self.options.toolbar !== "undefined") {
            html_ += `
                    <div class="d-inline-block ms-3">
                        ${self.options.toolbar}
                    </div>
                </div>
            `;
        }
        else {
            html_ += `
                </div>
            `;
        }

        html_ += `
                <div>
                    <button id="close-dialog-nata" type="button" class="btn btn-circle btn-primary btn-sm float-end ui-button-dialog-close btn-circle btn-primary btn-sm float-end ui-button-dialog-close">
                        <img id="close-dialog-nata" src="assets/images/icons/close.svg?ts=2" alt="Cerrar" title="Cerrar">
                    </button>
			    </div>
            </div>
			<div class="ui-dialog-body">${html}</div>
		`;


        div.innerHTML = html_;

        console.log( div );

        if (self.options.top > 0) {
            div.style.top = self.options.top + "px";
        }
        else {
            div.style.top = "0px";
        }

        if (self.options.left > 0) {
            div.style.left = self.options.left + "px";
        }
        else {
            div.style.left = "0px";
        }

        console.log( self.options.top,  self.options.left );
        if ( self.options.width != "100%" && self.options.height != "") {
            console.log( self.options.top, self.options.left );
            if ( self.options.top == 0 && self.options.left == 0 ) {
                const top = (window.pageYOffset || document.documentElement.scrollTop)  - (document.documentElement.clientTop || 0);
                let height;
                if ( isNaN( self.options.height ) ) {
                    console.log( self );
                    height = div.querySelector( ".ui-dialog-body" ).offsetHeight;
                }
                else {
                    height = self.options.height;
                }
                const topPosition = ( ( window.innerHeight - parseInt( height )  ) / 2 ) + top;
                div.style.top =  topPosition + "px";
                div.style.left = ( session.width - parseInt( self.options.width ) ) / 2 + "px";
            }
        }

        div.style.visibility = "visible";

        self.closeAll();
        document.body.append(div);
        // document.body.style.overflowY = "hidden";
        this.dialog = document.querySelector("#" + self.prefixID + this.options.id);

        self.dialog.querySelector(".ui-button-dialog-close").addEventListener("click", function (event) {
            event.stopPropagation();
            event.preventDefault();

            if (self.options.close.remove) {
                self.dialog.remove();
            }
            else {
                self.dialog.style.display = "none";
            }
            // document.body.style.overflowY = "auto";
            if (typeof self.options.events.close == "function") self.options.events.close();

        }, true);

        if (typeof self.options.callback == "function") self.options.callback();
        if (typeof self.options.events == "undefined") self.options.events = {};
        if (typeof self.options.events.render == "function") self.options.events.render();

    }

    show() {
        const self = this;
        document.querySelector("#" + self.prefixID + self.options.id).style.display = "block";
    }

}

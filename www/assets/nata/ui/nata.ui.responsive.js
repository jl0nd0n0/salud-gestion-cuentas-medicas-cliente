/* globals */
// eslint-disable-next-line no-unused-vars
class nataUIResponsive {



    constructor() {
        this.instances = 0;
    }

    openWindow (width, height, url = "http://localhost:5539/") {
        console.log("nata.dev.openWindow");
        window.open(url, "window" + this.instances++, "Height = " + height + ", width = " + width + ", estado = si, toolbar = si, menubar = si, location = no, top = " + (this.instances * 5) + ", left = " + (this.instances * 5));
    }

}

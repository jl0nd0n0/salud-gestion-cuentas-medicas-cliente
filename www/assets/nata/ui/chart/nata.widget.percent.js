/* global  doT, session, app */

class nataWidgetPercent extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        const self = this;

        const canvas = document.createElement('canvas');
        canvas.height = self.dataset.width;
        canvas.width = self.dataset.width;

        // requestAnimationFrame Shim
        (function () {
            var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
            window.requestAnimationFrame = requestAnimationFrame;
        })();


        const context = canvas.getContext('2d');
        const x = canvas.width / 2;
        const y = canvas.height / 2;
        const radius = (parseFloat(self.dataset.width) / 2) - 6;
        const endPercent = self.dataset.percent;
        let curPerc = 0;
        const counterClockwise = false;
        const circ = Math.PI * 2;
        const quart = Math.PI / 2;

        // draw linea de fondo
        context.beginPath();
        context.strokeStyle = "#f1f1f1";
        context.lineWidth = 5;
        context.arc(x, y, radius, 0, Math.PI * 2, false);
        //you can see the arc now
        //context.fillStyle = "#fff";
        //context.fill();
        context.stroke();

        // config line percent
        context.lineWidth = 9;
        context.strokeStyle = "#ff0000";
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.lineCap = "round";
        context.shadowBlur = 10;
        context.shadowColor = '#fff';

        //Lets add the text
        context.shadowBlur = 1;
        context.fillStyle = "#ff0000";
        //console.log(settings.fontSize + "px verdana");
        context.font = "bold 10.5pt Helvetica";
        const text = parseFloat(endPercent).toFixed(2) + "%";
        //Lets center the text
        var width = context.measureText(text).width;
        var height = context.measureText("w").width; // this is a GUESS of height
        context.fillText(text, (canvas.width / 2) - (width / 2), (canvas.width / 2) + (height / 2));

        function animate(current) {
            //context.clearRect(0, 0, canvas.width, canvas.height);
            context.beginPath();
            context.arc(x, y, radius, -(quart), ((circ) * current) - quart, false);
            context.stroke();
            curPerc++;
            if (curPerc < endPercent) {
                requestAnimationFrame(function () {
                    animate(curPerc / 100)
                });
            }
        }

        self.appendChild(canvas);

        animate();
    }

    connectedCallback() {
    }

}

// Define the new element
customElements.define("nata-widget-percent", nataWidgetPercent);


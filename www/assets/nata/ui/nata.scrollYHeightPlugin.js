/* globals nata, session */

nata.scrollYHeightPlugin = function(html, tolerancia = 120) {
    console.log("nata.scrollYHeightPlugin");
    const self = this;
    self.innerHTML = html;
    const element = self.querySelector(".scroll-y");
    // 1. traer el top del elemento
    console.log(self.getBoundingClientRect());
    const {
        top: t
    } = self.getBoundingClientRect();
    console.log(t);
    // 2. calcular el alto del elemento 
    const height = session.height - t;
    element.style.height = (height - tolerancia) + "px";
};

HTMLElement.prototype.render = nata.scrollYHeightPlugin;
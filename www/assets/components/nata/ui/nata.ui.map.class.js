/* globals  L, nata */

// eslint-disable-next-line no-unused-vars
class nataUIMap extends HTMLElement {
    constructor() {
        // Siempre llamar primero a super en el constructor
        super();

        const html = `
            <div id="map"></div>
        `;
        this.innerHTML = html;

    }

    connectedCallback() {

        //var map = L.map("map").setView([51.505, -0.09], 13);
        const map = L.map("map");

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
        }).addTo(map);

        const data = nata.sessionStorage.getItem( this.dataset.key );
        const array = [];
        let arrBound;
        let i;
        for (i=0; i<data.length; i++) {
            arrBound = [];
            arrBound[0] = parseFloat( data[i].lat );
            arrBound[1] = parseFloat( data[i].lng );
            array.push( arrBound );

            L.marker( [data[i].lat, data[i].lng] ).addTo( map );

            //.bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
            //.openPopup();
        }

        console.log( array );
        const bounds = new L.LatLngBounds( array );
        map.fitBounds( bounds );

        //

        //map.fitBounds( array );
        //map.fitBounds([[1,1],[2,2],[3,3]]);

        /*
        
        */

        /*
        L.marker([51.5, -0.09]).addTo(map)
            .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
            .openPopup();
        */
    }
}

customElements.define("nata-ui-map", nataUIMap);
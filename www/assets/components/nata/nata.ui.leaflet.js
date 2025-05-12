/* globals nata L, nataUIDialog */
nata.ui.leaflet = {
    map: {
        render: function () {
            console.log("nata.ui.leaflet.map.render");
            // initialize the map on the "map" div with a given center and zoom

            new nataUIDialog({
                html: `
                    <div id="map"></div>
                `,
                title: "Mapa de rutas por profesional",
                events: {
                    render: function () {},
                    close: function () {}
                }
            });
            document.querySelector("#map").style.display = "block";
            document.querySelector(".ui-dialog-body").style.padding = "0px";
            requestAnimationFrame(function () {
                const map = L.map("map", {
                    // Set latitude and longitude of the map center (required)
                    center: [4.7259270285334685, -74.02848313103681],
                    // Set the initial zoom level, values 0-18, where 0 is most zoomed-out (required)
                    zoom: 18
                });
                 
                // Create a Tile Layer and add it to the map
                const tiles = new L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
                    minZoom: "18"}).addTo(map);
                
                const marker = L.marker(
                    [4.7259270285334685, -74.02848313103681],
                    { 
                        draggable: false,
                        title: "",
                        opacity: 0.75
                    });
                
                marker.addTo(map).bindPopup("<p1><b>The White House</b><br>Landmark, historic home & office of the United States president, with tours for visitors.</p1>") .openPopup();
            });
        }
    }
};
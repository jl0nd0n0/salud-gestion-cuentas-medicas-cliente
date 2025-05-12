/* globals nata, axios, app, session */

nata.geolocation = {
    get: function ( callback ) {
        console.log("nata.geolocation.get");
        navigator.geolocation.getCurrentPosition(function( position ) {
            let lat = position.coords.latitude;
            let lng = position.coords.longitude;
            console.log( position );
            return  {
                lat: lat,
                lng: lng
            };
        });
    },

    watchPosition: function () {
        console.log("nata.geolocation.watchPosition");
        if (typeof session.position == "undefined") session.position = {};

        //let target;
        let options;

        function success(pos) {
            const crd = pos.coords;

            const coordinate = {};
            coordinate.accuracy = pos.coords.accuracy;
            coordinate.altitude = pos.coords.altitude;
            coordinate.altitudeAccuracy = pos.coords.altitudeAccuracy;
            coordinate.heading = pos.coords.heading;
            coordinate.latitude = pos.coords.latitude;
            coordinate.longitude = pos.coords.longitude;
            coordinate.speed = pos.coords.speed;

            if (typeof session.position.latitude == "undefined") session.position.latitude = 0;
            if (typeof session.position.longitude == "undefined") session.position.longitude = 0;

            console.log(session.position.latitude, session.position.longitude);
            console.log(coordinate.latitude, coordinate.longitude);

            const distanceMeters = nata.fx.geo.calculateDistanceCoordinate(
                session.position.latitude, 
                session.position.longitude, 
                coordinate.latitude, 
                coordinate.longitude, 
                "m"
            );

            /*
            if (target.latitude === crd.latitude && target.longitude === crd.longitude) {
                console.log("Felicidades, has llegado a tu destino.");
                navigator.geolocation.clearWatch(id);
            }
            */

            if (distanceMeters > 50 || session.position.latitude == 0) {
                //alert(coordinate.latitudeñl + "," + coordinate.longitude);
                console.log(coordinate);
                console.log(crd);
                const oDataSend = {
                    iu: session.user.i,
                    c: coordinate
                };
                axios.post(app.config.server.php + "geotracking/insertar", oDataSend)
                    .then(function (response) {
                        console.log(response.data);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }

            session.position.latitude = coordinate.latitude;
            session.position.longitude = coordinate.longitude;
        }

        function error(err) {
            console.error(`ERROR(${err.code}): ${err.message}`);
        }

        /*
        target = {
            latitude : 0,
            longitude: 0
        };
        */

        options = {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 0
        };

        navigator.geolocation.watchPosition(success, error, options);
    }

    /*
    getAddress: function () {
        // notice, no then(), cause await would block and
        // wait for the resolved result
        const position = this.getCoordinates();
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        let url = Constants.OSMAP_URL + latitude + "&lon=" + longitude;
        // Actually return a value
        return this.reverseGeoCode(url);
    }
    */
};
/* globals nata */

if ( typeof nata.structure == "undefined" ) nata.structure = {};
nata.structure = {
    array: {
        /**
         *
         * @param {array} oArr array where to save the object
         * @param {object} object object to save in array
         * @param {string} propKey prop key on the object for filter
         */
        addObject: function ( oArr, oObject, propKey ) {
            console.log( "nata.structure.array.addObject" );
            console.log( oArr );
            const data = oArr.filter(function ( record ) {
                return record[propKey] == oObject[propKey];
            });
            data.push( oObject );
            return data;
        },

        /**
         *
         * @param {*} oArr array to update
         * @param {*} propKey prop object collection to update
         * @param {*} propValue  value of prop of collection to update
         * @param {*} propUpdate prop to update
         * @param {*} proValue value to update
         * @returns
         */
        updateProp: function ( oArr, propKey, propValue, propUpdate, proValue ) {
            console.log( "nata.structure.array.updateProp" );

            let i;
            for (i=0; i<oArr.length; i++) {
                if ( oArr[i][propKey] == proValue) {
                    oArr[i][propUpdate] = proValue;
                }
                break;
            }

            return oArr;
        },

        /**
         * 
         * @param {array} oArr
         * @param {string} propKey
         * @param {string} propValue
         */
        removeObject: function ( oArr, propKey, propValue ) {
            console.log( "nata.structure.array.removeObject" );
            return oArr.filter( function ( record ) {
                console.log( propKey, propValue, record[propKey] != propValue );
                return record[propKey] != propValue;
            });
        }
    }
};
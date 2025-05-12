/* globals nata, CryptoJS, oState, app */

nata.crypto = {

    decript: function (index, data) {
        console.log("nata.crypto.decript");
        const key = CryptoJS.SHA256(index, app.config.cripto.secretKey).toString();
        data = CryptoJS.AES.decrypt( data, key ).toString();
        console.log(data);
        data = data.toString(CryptoJS.enc.Utf8);
        return data;
    },

    decriptString: function (value) {
        console.log("nata.crypto.decriptString");
        let data = CryptoJS.AES.decrypt( value, app.config.cripto.secretKey );
        console.log(data.toString());
        data = data.toString(CryptoJS.enc.Utf8);
        console.log(data);
        return data;
    },

    encript: function (index, data) {
        console.log("nata.crypto.encript");
        const key = CryptoJS.SHA256(index, app.config.cripto.secretKey).toString();
        if (typeof data == "object") data = JSON.stringify(data);
        return CryptoJS.AES.encrypt( data, key ).toString();
    },

    test: function () {
        nata.state.testing(1);
        let data = JSON.stringify(oState.state);
        data = nata.crypto.encript("test", data);
        console.log("encript: " + data);
        data = nata.crypto.decript("test", data);
        console.log("decript: " + data);
    }
};
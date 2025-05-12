/* globals app */

// eslint-disable-next-line no-undef
const Clipboard = require("@capacitor/clipboard");

// eslint-disable-next-line no-unused-vars
app.clipboard = {};
app.clipboard.write = async (text) => {
    await Clipboard.write({
        string: text
    });
};

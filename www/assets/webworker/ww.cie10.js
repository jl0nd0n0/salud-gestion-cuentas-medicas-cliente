/* globals localforage, dataCie, importScripts */

importScripts("../js/data/cie.js", "../js/library/localforage.js");

//console.log(dataCie);
//console.log("webworker *****************************");
let i, html, values;
for (i=0; i < dataCie.length; ++i) {
    values = [];
    html = `<li class="list-group-item button-list-create" data-codigo="${dataCie[i].c}" data-text="${dataCie[i].d}">${dataCie[i].c}-${dataCie[i].d}</li>`;
    dataCie[i].markup = html;
    values.push(dataCie[i].c);
    values.push(dataCie[i].d);
    dataCie[i].values = values;
}
localforage.setItem("webworker-cie10", dataCie);

/* globals localforage, importScripts, cums */

importScripts("../js/data/cums.js", "../js/library/localforage.js");  

//console.log(cums);
let i, html, values;
for (i=0; i < cums.length; ++i) {
    values = [];
    html = `<li class="list-group-item button-list-create" data-codigo="${cums[i].c}" data-text="${cums[i].d}">${cums[i].c}-${cums[i].d}</li>`;
    cums[i].markup = html;
    values.push(cums[i].c);
    values.push(cums[i].d);
    cums[i].values = values;
}
localforage.setItem("webworker-cums", cums);

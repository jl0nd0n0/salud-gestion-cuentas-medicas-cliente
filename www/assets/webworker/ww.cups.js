/* globals localforage, importScripts, cups */

importScripts("../js/data/cups.js", "../js/library/localforage.js");  

//console.log(cups);
let i, html, values;
for (i=0; i < cups.length; ++i) {
	values = [];
	html = `<li class="list-group-item button-list-create" data-codigo="${cups[i].c}" data-text="${cups[i].d}">${cups[i].c}-${cups[i].d}</li>`;
	cups[i].markup = html;
	values.push(cups[i].c);
	values.push(cups[i].d);
	cups[i].values = values;
}
localforage.setItem("webworker-cups", cups);

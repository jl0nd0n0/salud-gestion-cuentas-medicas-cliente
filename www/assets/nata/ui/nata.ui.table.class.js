/* globals nata, doT, numberDecimal */

class nataUITable extends HTMLElement {
    constructor() {
        // Siempre llamar primero a super en el constructor
        super();
        const self = this;
        const options = nata.sessionStorage.getItem("widget");
        //const titleColspan = nata.sessionStorage.getItem("colspan");
        if (Array.isArray(options) && options.length == 0) {
            console.error("No se ha enviado el sessionStorage('widget')");
            self.innerHTML = "No hay HTML para mostrar ..";
            return self;
        }

        console.log(options);

        let htmlColGroup = "";
        let i;
        for (i=0; i<options.columns.length; i++) {
            htmlColGroup += `
                <col width="${options.columns[i].width}"></col>
            `;
        }
        //console.log(htmlColGroup);

        let htmlTableheader = "";
        for (i=0; i<options.columns.length; i++) {
            htmlTableheader += `
                <th class="text-center">${options.columns[i].title}</th>
            `;
        }
        //console.log(htmlTableheader);

        const fxWidgetBadge = function (column, class_, text) {
            //console.log(column.widget.c);
            let html = `
                <td class="${class_}">
            `;

            if (text === null || typeof text == "undefined") text = "";
            if (text.trim() !== "") {
                html += `
                    <span class="badge rounded-pill ${class_} ${column.widget.c}">
                        ${text}
                    </span>
                `;
            }

            html += `
                </td>
            `

            return html;
        };

        // eslint-disable-next-line no-unused-vars
        const fxTableBodyGet = function (object) {
            console.log(object);
            let i, htmlTableBody = "", class_ = "", align = "";
            for (i=0; i<options.columns.length; i++) {
                //console.log(options.columns[i].prop);
                const text = object[options.columns[i].prop];
                //console.log(options.columns[i].class);
                if (typeof options.columns[i].class !== "undefined") {
                    class_ = options.columns[i].class;
                }
                else {
                    class_ = "";
                }

                // console.log(options.columns);
                if (typeof options.columns[i].prop != "undefined") {
                    // console.log(typeof options.columns[i].render);
                    if (typeof options.columns[i].render == "function") {
                        alert("paso 01");
                        return options.columns[i].render(object[options.columns[i].prop], object);
                    }
                    else if (options.columns[i].type == "number") {

                        if (typeof options.columns[i].widget !== "undefined") {
                            if (typeof options.columns[i].widget !== "undefined") {
                                if (options.columns[i].widget.w == "badge") {
                                    htmlTableBody += fxWidgetBadge(options.columns[i], class_, numberDecimal.format(object[options.columns[i].prop]));
                                }
                            }
                        }
                        else {
                            htmlTableBody += `
                                <td  class="text-end ${class_} ${align}">${numberDecimal.format(object[options.columns[i].prop])}</td>
                            `;
                        }
                    }
                    else if (options.columns[i].type == "title") {
                        htmlTableBody += `
                            <td>
                                <h6>${object[options.columns[i].prop]}</h6>
                            </td>
                        `;
                    }
                    else {

                        if (typeof options.columns[i].class !== "undefined") {
                            class_ = options.columns[i].class;
                        }

                        if (typeof options.columns[i].widget !== "undefined") {
                            if (typeof options.columns[i].widget !== "undefined") {
                                if (options.columns[i].widget.w == "badge") {
                                    htmlTableBody += fxWidgetBadge(options.columns[i], class_, text);
                                }
                            }
                        }

                        else {
                            htmlTableBody += `
                                <td class="${class_}">${text}</td>
                            `;
                        }
                    }
                }

                else {
                    let html = options.columns[i].html;
                    html = html.replaceAll("[id]", object.id);
                    html = html.replaceAll("[p1]", object.p1);
                    //console.log(html);
                    htmlTableBody += `
                        <td class='${class_}'>
                            ${html}
                        </td>
                    `;
                }
            }
            return htmlTableBody;
        };

        const template = `
            <style>
                nata-ui-table {
                    display: block;
                    font-size: 14px;
                }

                #${options.id} {
                    table-layout: fixed;
                    width: {{=it.total}}px;
                }

                .nata-ui-table svg {
                    height: 24px;
                    width: 24px;
                    cursor: pointer
                }

                .nata-ui-table svg path {
                    stroke: #fff;
                }

                .nata-ui-table tr th {
                    font-size: 12px;
                }

                .nata-ui-table tr td {
                    line-height: 1em;
                }
            </style>
            {{? typeof it.title !== "undefined"}}<h6>{{=it.title}}</h6>{{?}}
            <table id="${options.id}" class="table table-striped table-hover nata-ui-table">
                <colgroup>
                   ${htmlColGroup}
                </colgroup>
                <thead>
                  <tr>
                      ${htmlTableheader}
                  </tr>

                </thead>
                <tbody>
                {{~ it.detail: d:di}}
                {{
                    console.log("****************************************");
                    console.log(d);
                    console.log("****************************************");
                }}
                  <tr>
                      {{=it.fxTableBodyGet(d)}}
                  </tr>                
                {{~}}
                </tbody>
            </table>
        `;

        //console.log(options.data);
        let total = 0;
        for (i=0; i<options.columns.length; i++) {
            if (typeof options.columns[i].prop != "undefined") {
                //console.log(options.columns[i].width);
                total += parseFloat(options.columns[i].width);
            }
        }
        //console.log(total);
        const html = doT.template(template)({
            detail: options.data,
            fxTableBodyGet: fxTableBodyGet,
            total: total,
            title: options.title
        });

        i = null;
        total = null;
        htmlColGroup = null;
        htmlTableheader = null;

        //console.log(html);
        this.innerHTML = html;
    }
}

customElements.define("nata-ui-table", nataUITable);

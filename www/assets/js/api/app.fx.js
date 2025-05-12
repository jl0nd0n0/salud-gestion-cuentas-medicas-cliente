/* globals app, mes, doT */

app.fx = {
    // app.fx.classByEstadoGet
    classByEstadoGet: function (estadoEtapa, estado) {
        console.log("app.fx.classByEstadoGet");

        let classBG = "";

        if (estado == 424 || estado == 419) {
            classBG = "bg-orange";
        }
        else {
            if (estadoEtapa == 0) {
                classBG = "bg-blue";
            }
            else if (estadoEtapa == 5) {
                classBG = "bg-green";
            }
            else {
                classBG = "bg-red";
            }
        }

        return classBG;

    },
    template: {
        cartera: {
            // app.fx.template.cartera.columnsRender
            columnsRender: function (mesInicial, columna, colWidth, data, TDBgColor) {
                console.log("app.fx.template.cartera.columnsRender");
                let i, html = "";
                for(i=mesInicial;i<=new Date().getMonth()+1;i++) {
                    if (columna == 1) {
                        if (i < new Date().getMonth()+1) {
                            html += "<col width='" + colWidth + "'></col>";
                        }
                    } else if (columna == 2) {
                        if (i == 5) {
                            html += "<th>" + new Date().getFullYear() + "-" + mes[5] +"</th>";
                        } else {
                            html += "<th>" + mes[i] + "</th>";
                        }
                    }
                    else if (columna == 3) {
                        const template = `
                            <td class="text-end ${TDBgColor}">
                                {{
                                    const classBG = app.fx.classByEstadoGet(it.d.iee);
                                }}
                                {{? it.d["m" + i] > 0}}
                                <span class="badge rounded-pill {{=classBG}} {{=classColor}} button-ver-detalle-periodo"
                                    data-y="{{=new Date().getFullYear()}}"
                                    data-m="{{=new Date().getMonth()+1}}"
                                    data-ie="{{=it.d.ie}}"
                                >
                                    {{=numberDecimal.format(it.d["m" + i])}}
                                </span>
                                {{?}}
                            </td>
                        `;
                        html += doT.template(template)(data);
                    }
                }
                return html;
            },
            totales: {
                calcular: function (mesInicial, data) {
                    console.log("app.fx.template.cartera.totales.render");
                    let i;
                    const arr = [];

                    for (i=0; i<(mesInicial-1); i++) {
                        arr.push(0);
                    }

                    for (i=mesInicial; i<=new Date().getMonth()+1; i++) {
                        arr.push(app.fx.cartera.estado.calcularTotal(data, i, arr, mesInicial));
                    }
                    console.log(arr);
                    return arr;
                },
                render: function (mesInicial, data) {
                    console.log("app.fx.template.cartera.totales.render");
                    const arr = app.fx.template.cartera.totales.calcular(mesInicial, data);
                    console.log(arr);
                    let html = "", i;
                    for (i=mesInicial; i<=new Date().getMonth()+1; i++) {
                        html += `
                            <td class='text-end bg-blue-opacity'>
                                <span class="badge rounded-pill bg-blue color-blue ui-badge-value">
                                    ${numberDecimal.format(arr[i-1])}
                                </span>
                            </td>
                        `;
                    }
                    i = null;
                    console.log(html);
                    return html;
                }
            }
        }
    },
    cartera: {
        estado: {
            calcularTotal: function (data, mes, arrTotales, mesInicial) {
                console.log("app.fx.cartera.estado.calcularTotal");
                console.log(data);

                let i, arr = [], valor;
                for (i=0; i < data.length; i++) {
                    if (data[i].iee == 0) {
                        valor = parseFloat(data[i]["v" + mes]);
                    }
                    arr.push({
                        e: data[i].e,
                        iee: data[i].iee
                    });
                    arr[i]["v" + mes] = data[i]["v" + mes];
                }

                //console.log(arr);

                /* aqui se calculan los totales .. */
                for (i=0; i < arr.length; i++) {
                    console.warn("OJO AQUI HAY QUE TENER EN CUENTA EL AÑO");
                    if (mes != mesInicial) {
                        console.log(parseFloat(arr[i]["v" + mes]));
                        if (data[i].iee == 5) {
                            valor = valor - parseFloat(arr[i]["v" + mes]);
                        }
                    }
                    //if (mesInicial >)
                }

                if (mes > mesInicial) {
                    //console.log(valor);
                    //console.log(mes, arrTotales);
                    valor = valor + parseFloat(arrTotales[mes-2]);
                    //alert(valor);
                }

                //console.log(valor);
                i = null;
                return valor;
            }
        }
    }
};

// eslint-disable-next-line no-unused-vars
const dollarUS = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
});

// eslint-disable-next-line no-unused-vars
const numberDecimal = Intl.NumberFormat("en-US", {
    style: "decimal",
    currency: "USD",
    maximumFractionDigits: 0
});

// eslint-disable-next-line no-unused-vars
const percent = Intl.NumberFormat("en-US", {
    style: "percent",
    currency: "USD",
    maximumFractionDigits: 2
});

// eslint-disable-next-line no-unused-vars
const numberDecimal2 = Intl.NumberFormat("en-US", {
    style: "decimal",
    currency: "USD",
    maximumFractionDigits: 2
});


Array.prototype.total = function () {
    const self = this;
    console.log(self);
    const arr = self;
    let i, value, total = 0;
    for (i = 0; i < arr.length; i++) {
        value = parseFloat(arr[i]);
        console.log(value);
        total += parseFloat(value);
    }
    return total;
};


Array.prototype.totalObject = function (prop) {
    const self = this;
    let i, value, total = 0;
    for (i = 0; i < self.length; i++) {
        value = parseFloat(self[i][prop]);
        total += parseFloat(value);
    }
    return total;
};
/* globals echarts, nata */

// eslint-disable-next-line no-unused-vars
class nataUIChartDonut extends HTMLElement {
    constructor() {

        // Siempre llamar primero a super en el constructor
        super();

        const self = this;
        const data = nata.localStorage.getItem("cartera-soat-informe-gestion-catalogo-0");
        let dataColor = data.map(record =>  record.c );
        console.log(dataColor);
        const settings = {
            title: {
                text: "Título del Gráfico",
                subtext: "texto del título",
                left: "center"
            },
            tooltip: {
                trigger: "item"
            },
            legend: {
                orient: "horizontal",
                top: "10%",
                left: "center",
                show: false
            },
            series: [
                {
                    name: "Nombre de la data",
                    type: "pie",
                    radius: ["25%", "45%"],
                    top: "5%",
                    color: dataColor,
                    //avoidLabelOverlap: true,
                    label: {
                        show: true,
                        formatter(param) {
                            // correct the percentage
                            console.log(param);
                            //return " (" + param.percent * 2 + "%)\n" + dollarUS.format(param.value);
                            return `{myDudes|${param.data.name}}` + "\n " + "" + `$ {myDudes|${numberDecimal.format(param.data.value)}}` + "\n(" + param.percent + "%)";
                        },
                        rich: {
                            a: {
                                fontWeight: "bold",
                            },
                            myDudes: {
                                color: "#000",
                                fontWeight: "bold",
                                fontSize: "14px"
                            },
                            currency: {
                                color: "#fff",
                                fontWeight: "bold",
                                fontSize: "13px",
                                backgroundColor: "red"
                            },
                        }
                    },
                    data: [
                        { value: 1048, name: "Search Engine" },
                        { value: 735, name: "Direct" },
                        { value: 580, name: "Email" },
                        { value: 484, name: "Union Ads" },
                        { value: 300, name: "Video Ads" }
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)"
                        }
                    }
                }
            ]
        };

        // get id 
        console.log(self);
        const id = self.getAttribute("id");
        let options = nata.sessionStorage.getItem(id);
        if (Array.isArray(options) && options.length == 0) {
            options = {};
        }
        console.log("**************************************************");
        console.log(options);
        console.log("**************************************************");

        settings.series[0].data = options.series[0].data;

        if (typeof self.dataset.titleText !== "undefined") {
            settings.title.text = self.dataset.titleText;

            if (typeof self.dataset.titleSubtext !== "undefined") {
                settings.title.subtext = self.dataset.titleSubtext;
            }
        }
        else {
            if (typeof options.title !== "undefined") {
                settings.title.text = options.title.text;
                settings.title.subtext = options.title.subtext;
            }
            else {
                console.error("No se ha recibido el titulo ni el subtitulo: options.title.text, options.title.subtext");
                return false;
            }
        }

        if (typeof options.series !== "undefined") {
            console.log(options.series[0]);

            if (typeof self.dataset.titleSubtext !== "undefined") {
                settings.series[0].name = self.dataset.seriesName;
            }
            else {
                settings.series[0].name = options.series[0].name;
            }
        }
        else {
            console.error("No se ha recibido el nombre ni la data del chart");
            return false;
        }

        self.style.height = "100%";
        self.style.width = "100%";

        self.render(settings);
    }

    render(options) {
        console.log("%c index", "background:red;color:white;font-weight:bold;font-size:11px");
        const self = this;
        
        const myChart = echarts.init(self, null, { renderer: 'svg' });
        // Specify the configuration items and data for the chart
        
        // Display the chart using the configuration items and data just specified.
        myChart.setOption(options);
    }
}

customElements.define("nata-ui-chart-donut", nataUIChartDonut);

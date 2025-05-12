/* globals echarts, nata */

// eslint-disable-next-line no-unused-vars
class nataUIChartLine extends HTMLElement {
    constructor() {

        // Siempre llamar primero a super en el constructor
        super();

        const self = this;

        const settings = {
            title: {
                text: "Stacked Line"
            },
            tooltip: {
                trigger: "axis"
            },
            legend: {
                data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"]
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: "category",
                boundaryGap: false,
                data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            },
            yAxis: {
                type: "value"
            },
            series: [
                {
                    name: "Email",
                    type: "line",
                    stack: "Total",
                    data: [120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name: "Union Ads",
                    type: "line",
                    stack: "Total",
                    data: [220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name: "Video Ads",
                    type: "line",
                    stack: "Total",
                    data: [150, 232, 201, 154, 190, 330, 410]
                },
                {
                    name: "Direct",
                    type: "line",
                    stack: "Total",
                    data: [320, 332, 301, 334, 390, 330, 320]
                },
                {
                    name: "Search Engine",
                    type: "line",
                    stack: "Total",
                    data: [820, 932, 901, 934, 1290, 1330, 1320]
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
        console.log(options);

        self.style.height = "100%";
        self.style.width = "100%";

        self.render(settings);
    }

    render(options) {
        console.log("%c index", "background:red;color:white;font-weight:bold;font-size:11px");
        const self = this;
        
        const myChart = echarts.init(self);
        // Specify the configuration items and data for the chart
        
        // Display the chart using the configuration items and data just specified.
        myChart.setOption(options);
    }
}

customElements.define("nata-ui-chart-line", nataUIChartLine);

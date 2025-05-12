/* globals nata, echarts, numberDecimal */

if (typeof nata.ui.charts == "undefined") nata.ui.charts = {};
if (typeof nata.ui.charts.echarts == "undefined") nata.ui.charts.echarts = {};

nata.ui.charts.echarts.doughnutChart = {
    render: function (idSelector, title = "", data, serieName) {
        console.log("nata.ui.charts.echarts.doughnutChart.render");
        // Initialize the echarts instance based on the prepared dom
        const myChart = echarts.init(document.getElementById(idSelector), null, { renderer: "svg" });
        // Specify the configuration items and data for the chart

        const option = {
            legend: {
                type: "scroll",
                orient: "vertical",
                right: 10,
                top: 20,
            },
            series: [
                {
                    color: ["#b4edc8", "#f7e1e1", "#f99090", "#91CD76"],
                    name: serieName,
                    type: "pie",
                    radius: ["40%", "70%"],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: "#fff",
                        borderWidth: 1
                    },
                    labelLine: {
                        //show: false
                        line: 30
                    },
                    
                    label: {
                        //formatter: "{b}: ${c} ({d}%)"
                        formatter: function(params) {
                            console.log(params);
                            return `${params.data.name}: ${numberDecimal.format(params.data.value)} (${params.percent}%)`;
                        }
                    },
                   
                    /*
                    data: [
                        { value: 1048, name: "Search Engine" },
                        { value: 735, name: "Direct" },
                        { value: 580, name: "Email" },
                        { value: 484, name: "Union Ads" },
                        { value: 300, name: "Video Ads" }
                    ]
                    */
                    data: data
                }
            ],
            title: {
                textt: title
            },
            tooltip: {
                trigger: "item",
                formatter: function(params) {
                    //console.log(params);
                    return `${params.seriesName}<br>${numberDecimal.format(params.value)} (${params.percent}%)`;
                }
            }
        };

        // Display the chart using the configuration items and data just specified.
        myChart.setOption(option);
    
    }
};
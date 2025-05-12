/* globals nata, echarts */

if (typeof nata.ui.charts == "undefined") nata.ui.charts = {};
if (typeof nata.ui.charts.echarts == "undefined") nata.ui.charts.echarts = {};

nata.ui.charts.echarts.doughnutChart = {
    render: function (idSelector, data, propText, propValue, serieName) {
        console.log("nata.ui.charts.echarts.doughnutChart.render");
        // Initialize the echarts instance based on the prepared dom
        const myChart = echarts.init(document.getElementById(idSelector));
        // Specify the configuration items and data for the chart

        const temporal = data.map(function (record) {
            return {
                name: record[propText],
                value: record[propValue]
            };
        });

        const option = {
            tooltip: {
                trigger: "item"
            },
            legend: {
                type: "scroll",
                orient: "vertical",
                right: 10,
                top: 20,
            },
            series: [
                {
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
                        formatter: "{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ",
                        backgroundColor: "#f5f5f5",
                        borderColor: "#8C8D8E",
                        borderWidth: 1,
                        borderRadius: 4,
                        rich: {
                            a: {
                                color: "#6E7079",
                                lineHeight: 22,
                                align: "center"
                            },
                            hr: {
                                borderColor: "#8C8D8E",
                                width: "100%",
                                borderWidth: 1,
                                height: 0
                            },
                            b: {
                                color: "#4C5058",
                                fontSize: 14,
                                fontWeight: "bold",
                                lineHeight: 33
                            },
                            per: {
                                color: "#fff",
                                backgroundColor: "#4C5058",
                                padding: [3, 4],
                                borderRadius: 4
                            }
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: "40",
                            fontWeight: "bold"
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
                    data: temporal
                }
            ]
        };

        // Display the chart using the configuration items and data just specified.
        myChart.setOption(option);
    
    }
};
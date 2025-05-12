/* globals nata, $, app */

if (typeof nata.ui == "undefined") nata.ui = {};

nata.ui.listFilter = {
    dataset: {
        list: [],
        showParam: undefined
    },
    event: {
        activate: function (indice) {
            console.log("nata.ui.listFilter.event.activate", indice);
            const data = app.config.listFilter.params.filter(function(record) {
                return record.i == indice;
            })[0];
            if (typeof data === "undefined") {
                return false;
            }

            nata.ui.listFilter.dataset.list = data.dataset();
            nata.ui.listFilter.dataset.showParam = data.showParam;

            $("#txtListFilter")
                .off()
                .on("input", function () {
                    console.log("txtListFilter.change");

                    $("#listGroupFilter").html("");

                    const value = $(this).val().toString().toLowerCase();
                    if (value.length > 3) {
                        const newData = nata.ui.listFilter.dataset.list.filter(function (record) {
                            return record[nata.ui.listFilter.dataset.showParam].toString().toLowerCase().includes(value);
                        });
                        var html = '', i;
                        for (i = 0; i < newData.length && i < 20; ++i) {
                            const index = nata.ui.listFilter.dataset.list.indexOf(newData[i]);
                            html += `<li class="list-group-item listFilter-option" 
                                        data-id="${index}">
                                    ${newData[i][nata.ui.listFilter.dataset.showParam]}
                                </li>`;
                        }
                        $("#listGroupFilter").html(html);
                    }

                });
        },
        option: {
            selected: function () {
                console.log("nata.ui.listFilter.event.option.selected");
                const id = $(this).data("id");
                const record = nata.ui.listFilter.dataset.list[id];
                console.log(record);
                $(".button-dialog-close").trigger("click");
                alert("Callback? " + record[nata.ui.listFilter.dataset.showParam]);
            }
        }
    },
    html: {
        get: function () {
            console.log("nata.ui.listFilter.html.get");
            return `
                <style>
                    nata-ui-listfilter {
                        width: 100%;
                        height: 100%;
                    }
                    .listFilter-option {
                        cursor: pointer;
                    }
                </style>
                <div id="listFilterContainer">
                    <div class="input-group">
                        <span class="input-group-text"><img src="assets/images/icons/magnify.svg"></span>
                        <input id="txtListFilter" class="form-control" type="text" placeholder="Busqueda" aria-label="Busqueda" aria-describedby="busqueda-addon"/>
                    </div>
                    <ul id="listGroupFilter" class="list-group">
                    </ul>
                </div>
            `;
        }
    }
};

$(document).on("click", ".listFilter-option", nata.ui.listFilter.event.option.selected);
/* globals nata, $, doT */

if (typeof nata.ui == "undefined") nata.ui = {};

nata.ui.listTree = {

    callback: undefined,

    dataset: {
        //nata.ui.listTree.dataset.data
        data: [],
        child: {
            data: []
        }
    },

    event: {
        detail: {
            show: function (id) {
                console.log("nata.ui.listTree.event.detail.show");
                const data = nata.ui.listTree.dataset.child.data.filter(function (record) {
                    return record.ip == id;
                });
                //console.log("#row-detail" + id, $("#row-detail" + id));
                $("#row-detail-" + id).toggleClass("show");
                $("#detail-" + id).html(nata.ui.listTree.html.detail.get(data));
            }
        }
    },

    html: {
        detail: {
            get: function (data) {
                console.log("nata.ui.listTree.html.detail.get");
                const html = `
                    <table class="table table-border table-striped table-sm">
                        {{~ it.detail:d:i }}
                        <tr class="nata-ui-listTree-detail" data-id="{{=d.c}}">
                            <td class="w-25px">
                                <img class="icon-list" src="assets/images/icons/circle-medium.svg" alt="" />
                            </td>
                            <td class="w-75px font-monospace">
                                {{=d.c}}
                            </td>
                            <td class="w-380px">
                                {{=d.d}}
                            </td>
                        </tr>
                        {{~}}
                    </table>
                `;

                return doT.template(html)({ detail: data });
            }
        },
        get: function (data) {
            console.log("nata.ui.listTree.html.get");

            const html = `
                <table class="table table-border table-sm nata-ui-listTree-table">
                    {{~ it.detail:d:i }}
                    <tr {{?i % 2 == 0}}class="zebra"{{?}}>
                        <td class="w-25px cursor-pointer nata-ui-listTree-button-detail" data-id="{{=d.c}}">
                            <img class="icon-list" src="assets/images/icons/plus-thick.svg" alt="" />
                        </td>
                        <td class="w-75px font-monospace">
                            {{=d.c}}
                        </td>
                        <td class="w-400px">
                            {{=d.d}}
                        </td>
                    </tr>
                    <tr id="row-detail-{{=d.c}}" class="row-detail">
                        <td id="detail-{{=d.c}}" colspan="3"></td>
                    </tr>
                    {{~}}
                </table>
            `;

            return doT.template(html)({ detail: data });
        }
    }

};

$(document).on("click", ".nata-ui-listTree-button-detail", function () {
    nata.ui.listTree.event.detail.show(this.dataset.id);
});

$(document).on("click", ".nata-ui-listTree-detail", function() {
    const id = $(this).data("id");
    const data = nata.ui.listTree.dataset.child.data.filter(function (record) {
        return record.c == id;
    })[0];

    if(typeof nata.ui.listTree.callback === "function") {
        nata.ui.listTree.callback(data);
    } else {
        alert("Debe definir nata.ui.listTree.callback");
    }
});
/* globals app, doT, session,nata */

app.soportes = {

    index: {
        render: function (data = nata.localStorage.getItem("archivos-soportes")) {
            console.log(data);
            const template = `
              <style>
                  #tableAditoria {
                      table-layout: fixed;
                      width: 1000px;
                  }
            </style>
              </style>
              <div class=" scroll-y px-1" style="height:${session.height-130}px">
                  <h6>Soportes</h6>
                  <table id="tableSoportes"
                      class="table nata-ui-table table-sm">
                      <colgroup>
                          <col width="10"></col>
                          <col width="100"></col>
                          <col width="50"></col>
                      </colgroup>
                      <tr>
                          <th>#</th>
                          <th>Tipo de soporte</th>
                          <th></th>
                      </tr>

                      <tbody id="tableSoportes-body">
                      {{~ it.detail: d:id}}
                          <tr>
                              <td>Flujo de efectivo</td>
                              <td class="">
                                <button type="button"
                                    class="btn btn-primary btn-sm btn-soportes btn-facturas-glosa">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                    </svg>
                                </button>
                              </td>
                          </tr>
                          {{~}}
                      </tbody>
                  </table>
          `;
            const html = doT.template(template)({detail: data});
            document.querySelector("#container").innerHTML = html;
        }
    }

};

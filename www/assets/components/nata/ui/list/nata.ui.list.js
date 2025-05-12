/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* globals , doT, Clusterize*/

// eslint-disable-next-line no-unused-vars
class nataUIList {
  constructor(options) {
      const self = this;

      self.options = options;

      self.dataset = self.datasetGet(self.options.data);
      console.log(self.dataset);

      const oMarkups = self.htmlGet(self.dataset);
      console.log(oMarkups);
      self.render(oMarkups);
  }

  htmlGet(data) {
      console.log("nataUIList.htmlGet");
      //console.log(data);
      const self = this;
      const results = [];
      var i;
      for (i = 0; i < data.length; i++) {
          if (data[i].active) results.push(data[i].markup);
      }

      const element = document.getElementById("count-" + self.index);
      if (element !== null) element.innerHTML = results.length;

      //console.log(results);

      return results;

  }

  datasetGet (data = []) {
      console.log("nataUIList.getRows");
      //console.log(data);
      const self = this;

      let template = `
          <li class="list-group-item">{{=it.t}}</li>
      `;

      let rows = [], i, tmp;
      if (data.length > 0) {
          rows = data.map(function (record) {
              tmp = "";
              //row.contador = ++contador;
              for (i=0; i<self.options.searchFields.length; ++i) {
                  tmp += record[self.options.searchFields[i]] + " ";
              }
              return {
                  dataset: record,
                  values: tmp,
                  markup: doT.template(template)({ t: tmp.trim() }).toString().trim(),
                  active: true
              };
          });
      }
      //console.log(rows);
      return rows;
  }

  render (oMarkup) {
      const self = this;
      console.log(self);
      self.clusterize = new Clusterize({
          rows: oMarkup,
          scrollId: "scrollArea",
          contentId: "contentArea",
      });

      // Attach listener to search input tag and filter list on change
      const search = document.getElementById("txtSearchLayout");
      const buttonClear = document.getElementById("buttonSearchClear");

      const onSearch = function () {
          const arr = [];
          self.dataset.map(function (record) {
              return arr.push(record.values);
          });
          console.log(arr);

          let i, tmp;

          const temporal = self.dataset.filter(function (record) {
              return (record.values.toString().toLowerCase().indexOf(search.value.toString().toLowerCase()) !== -1);
          });
          console.log(temporal);
          const oMarkups = self.htmlGet(temporal);
          console.log(oMarkups);
          self.render(oMarkups);

      };
      if (search !== null) {
          search.oninput = onSearch;
      }
  }

}

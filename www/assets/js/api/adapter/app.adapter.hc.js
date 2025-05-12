/* globals app, nata, swal, session, localforage */

if (typeof app.adapter == "undefined") app.adapter = {};
app.adapter.hc = {
    insert: {

        attributoGet: function (jsonData) {
            console.log("%c Aquí se ajustan los datos de HC ...", "background:red;color:white;font-weight:bold;font-size:12px");
            let i, response = {};
            for (i = 0; i < jsonData.length; ++i) {
                console.log(jsonData[i]);

                if (typeof jsonData[i].r != undefined) {
                    if (typeof jsonData[i].atr == "undefined") {
                        swal("Error Configuracion", "No se han asignado los atributos de este formulario", "error");
                        break;
                    }
                    console.log(jsonData[i].atr.toString().trim());
                    if (typeof jsonData[i].r == "undefined") jsonData[i].r = "";

                    if (jsonData[i].tr == "tension-arterial") {
                        console.log(jsonData[i]);
                        response["ta"] = jsonData[i].r.s + "/" + jsonData[i].r.d;
                    }
                    else {
                        console.log(jsonData[i].r.toString().trim());
                        response[jsonData[i].atr.toString().trim()] = jsonData[i].r;
                        console.log(response[jsonData[i].atr.toString().trim()]);
                    }
                }
            }	
            console.log(response);
            return response;
        },

        core: async function (dataLocal, escala) {
            console.log("app.adapter.hc.insert.core");
            console.log(dataLocal);
            let i;
            for (i = 0; i < dataLocal.json.length; ++i) {
                if (typeof dataLocal.json[i].atr == "undefined") {
                    console.error("Digale a Paola que cargue lo que ya le habia dicho !!!");
                    alert("Digale a Paola que cargue lo que ya le habia dicho !!!");
                    return false;
                }
            }

            const jsonAtributos = app.adapter.hc.insert.attributoGet(dataLocal.json);
            console.log(jsonAtributos);

            const data = Object.assign({}, jsonAtributos);
            console.log(data);

            // paso 1, convertir el datalocal
            let temporal = {};
            let item, value;
            for (i = 0; i < dataLocal.json.length; ++i) {
                item = dataLocal.json[i].atr;
                value = dataLocal.json[i]["r"];
                console.log(item, value);
				
                temporal[item] = value;
				
            }
            console.log(temporal);

            // paso 2, asignar los atributos
            for (item in data) {
                console.log(item);
                console.log(temporal[item]);
                data[item] = temporal[item];
            }

            // paso 3, asignar datos de session
            data.ios = dataLocal.ios;
            data.if = dataLocal.if;
            data.dd = nata.fx.date.getDay();
            data.dm = nata.fx.date.getMonth();
            data.dy = nata.fx.date.getYear();

            if (escala == "news") {
                console.log(dataLocal.json[0].r);
                let total = 0, prop;
                for (prop in dataLocal.json[0].r) {
                    console.log(prop);
                    total += parseInt(dataLocal.json[0].r[prop].value);
                }
                data.nt = total;
            }
            /*
			data.cs = dataLocal.cs;
			data.ipa = dataLocal.ipa;
			data.nos = dataLocal.nos;
			data.s = dataLocal.s;
			*/

            console.log(data);
            return data;
        },

        indice: async function (idOrdenServicio, idFormulario, modulo) {
            console.log("app.adapter.hc.insert.indice");

            let dataAgenda = await localforage.getItem("agenda");
            if (dataAgenda === null) dataAgenda = [];
            dataAgenda = dataAgenda.filter(function (record) {
                return record.ios == idOrdenServicio;
            })[0];

            const data = {
                ios: idOrdenServicio,
                cs: dataAgenda.cs,
                nos: dataAgenda.nos,
                s: dataAgenda.s,
                i: "",
                if: idFormulario,
                m: modulo,
                ipa: dataAgenda.ipa,
                f: app.historiaClinica.core.consulta.fechaGet( idOrdenServicio ),
                dy: nata.fx.date.getYear(),
                dm: nata.fx.date.getMonth(),
                dd: nata.fx.date.getDay(),
                il: new Date().getTime()
            };
            return data;
        }
    }
};
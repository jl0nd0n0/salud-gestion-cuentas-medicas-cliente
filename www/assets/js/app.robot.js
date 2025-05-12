/* globals app, nataUIDialog, axios, doT */

app.robot = {

    cuentaMedica: {
        index: function () {
            console.log("app.robot.cuentaMedica.index");

            const url = app.config.server.php1 + "x=sanitas&y=facturas-dia";
            axios.get(url)
                .then((function (response) {
                    console.log(response.data);
                    
                    const templateBox1 = `
                        <style>
                            #tableMonitorArmadoCuentas {
                                table-layout: fixed;
                                width: 820px;
                            }
                        </style>
                        <table id="tableMonitorArmadoCuentas" class="table table-sm table-borderless">
                            <colgroup>
                                <col width="260" />
                                <col width="80" />
                                <col width="150" />
                                <col width="80" />
                                <col width="150" />
                                <col width="100" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th class="text-center">Paso</th>
                                    <th class="text-center">Facturas procesar</th>
                                    <th class="text-center">Saldo procesar</th>
                                    <th class="text-center">Facturas procesadas</th>
                                    <th class="text-center">Saldo procesadas</th>
                                    <th class="text-center">%</th>
                                </tr>
                            </thead>
                            <tbody>
                                {{~ it.detail: d:id}}
                                <tr>
                                    <td><b>{{=d.n}}<b></td>
                                    <td class="text-end">
                                        <span id="c-{{=d.i}}" class="badge rounded-pill text-bg-danger">{{=d.c}}</span>
                                    </td>
                                    <td class="text-end">
                                        <span id="v-{{=d.i}}" class="badge rounded-pill text-bg-danger">{{=numberDecimal.format(d.v)}}</span>
                                    </td>
                                    <td class="text-end">
                                        <span id="cp-{{=d.i}}"
                                            class="badge rounded-pill text-bg-success">
                                            {{=d.cp}}
                                        </span>
                                    </td>
                                    <td class="text-end">
                                        <span id="vp-{{=d.i}}"
                                            class="badge rounded-pill text-bg-success">
                                            {{=numberDecimal.format(d.vp)}}
                                        </span>
                                    </td>
                                </tr>
                                {{~}}
                            </tbody>
                        </table>
                    `;

                    const html = doT.template(templateBox1)({
                        detail: response.data
                    });
                    document.getElementById("box-1").innerHTML = html;

                })).catch((function (error) {
                    console.error(error);
                }));

            const template = `
                <div id="container-cuentaMedicaArmado" class="container-grid mt-3">
                    <div class="row h-100">
                        <div class="col">
                            <h5 class="my-3">Armado Automático</h5>
                            <div id="box-1"></div>
                        </div>
                        <div class="col"></div>
                    </div>
                </div>
            `;
            document.getElementById("container").innerHTML = template;
            
        }
    },

    facturacion: {
        index() {
            console.log("app.robot.facturacion.index");
    
            const facturacion = nata.localStorage.getItem("robot-facturacion");
            if (!facturacion || !Array.isArray(facturacion)) {
                console.error("Datos inválidos");
                return;
            }
    
            this.data = facturacion;
            const fechas = facturacion.map(item => new Date(item.f));
            this.minDate = new Date(Math.min(...fechas));
            this.maxDate = new Date(Math.max(...fechas));
            this.currentWeekOffset = 0;
    
            this.generateTable();
        },
    
        generateTable() {
            const elements = document.querySelectorAll(".ui-dialog");
            elements.forEach(element => element.remove());
    
            const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    
            const today = new Date();
            const startOfWeek = this.getStartOfWeek(new Date(today.setDate(today.getDate() + this.currentWeekOffset * 7)));
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
    
            const filteredData = this.data.filter(item => {
                const [y, m, d] = item.f.split('-').map(Number);
                const itemDate = new Date(y, m - 1, d);
                return itemDate >= startOfWeek && itemDate <= endOfWeek && itemDate <= new Date();
            });
    
            const dataByDay = Object.fromEntries(daysOfWeek.map(day => [day, { c: "-", f: "-", v: "" }]));
    
            filteredData.forEach(item => {
                const [y, m, d] = item.f.split('-').map(Number);
                const date = new Date(y, m - 1, d);
                const dayIndex = (date.getDay() + 6) % 7;
                const dayName = daysOfWeek[dayIndex];
                dataByDay[dayName] = item;
            });
    
            const dayDates = daysOfWeek.map((_, i) => {
                const date = new Date(startOfWeek);
                date.setDate(startOfWeek.getDate() + i);
                return date.getDate();
            });
    
            const formatDate = (date) => date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }).replace(/ de$/, '');
    
            const html = doT.template(`
                <style>
                    #tableFacturacion { 
                        table-layout: fixed;
                        width: 840px; 
                    }
                    .flatpickr-day.week-hover {
                        background-color: #e0f7fa !important;
                    }
                    .calendar-container {
                        display: flex;
                        gap: 20px;
                    }
                </style>
                <div class="calendar-container">
                    <div>
                        <input id="calendar" type="text" class="form-control mb-3" placeholder="Selecciona una semana" />
                    </div>
                    <div>
                        <table id="tableFacturacion" class="table table-striped table-sm">
                            <thead><tr>{{~it.dS :day:index}}<th>{{=day}} ({{=it.dayDates[index]}})</th>{{~}}</tr></thead>
                            <tbody>
                                <tr>{{~it.dS :day}}<td>{{=it.d[day].c}}</td>{{~}}</tr>
                                <tr>{{~it.dS :day}}<td>{{=numberDecimal.format(it.d[day].v)}}</td>{{~}}</tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `)({
                dS: daysOfWeek,
                d: dataByDay,
                dayDates: dayDates
            });
    
            const enabledWeeks = this.getEnabledWeeks(this.data);
    
            const self = this; // <== capturar contexto correctamente
    
            new nataUIDialog({ 
                html: html,
                title: "Monitor Facturación",
                events: {
                    render: () => {
                        flatpickr("#calendar", {
                            locale: "es",
                            mode: "single",
                            dateFormat: "Y-m-d",
                            firstDayOfWeek: 1,
                            minDate: self.minDate,
                            maxDate: self.maxDate,
                            disable: [
                                function(date) {
                                    return !enabledWeeks.some(week => week.isSameWeek(date));
                                }
                            ],
                            defaultDate: self.getStartOfWeek(new Date()),
                            onReady: (_, __, fp) => {
                                // Mostrar el calendario por defecto al renderizar
                                fp.open();
                            },
                            onChange: function (selectedDates) {
                                if (selectedDates.length > 0) {
                                    self.selectWeek(selectedDates[0]);
                                }
                            }
                        });
    
                        const calendarContainer = document.querySelector(".flatpickr-days");
                        if (calendarContainer) {
                            calendarContainer.addEventListener("mouseover", (e) => {
                                const dayElem = e.target.closest(".flatpickr-day");
                                if (!dayElem || dayElem.classList.contains("flatpickr-disabled")) return;
    
                                const allDays = [...calendarContainer.querySelectorAll(".flatpickr-day")];
                                const index = allDays.indexOf(dayElem);
                                const weekStart = Math.floor(index / 7) * 7;
    
                                allDays.slice(weekStart, weekStart + 7).forEach(el => el.classList.add("week-hover"));
                            });
    
                            calendarContainer.addEventListener("mouseout", () => {
                                calendarContainer.querySelectorAll(".flatpickr-day.week-hover")
                                    .forEach(el => el.classList.remove("week-hover"));
                            });
                        }
                    }
                }
            });
        },
    
        getEnabledWeeks(data) {
            const weeks = [];
            data.forEach(item => {
                const [y, m, d] = item.f.split('-').map(Number);
                const date = new Date(y, m - 1, d);
                const startOfWeek = this.getStartOfWeek(date);
                const weekFound = weeks.find(week => week.isSameWeek(startOfWeek));
    
                if (!weekFound) {
                    weeks.push({
                        start: startOfWeek,
                        isSameWeek: (date) => this.getStartOfWeek(date).getTime() === startOfWeek.getTime()
                    });
                }
            });
            return weeks;
        },
    
        selectWeek(selectedDate) {
            const startOfWeek = this.getStartOfWeek(selectedDate);
            this.currentWeekOffset = this.getWeekOffset(startOfWeek);
            this.generateTable();
        },
    
        getWeekOffset(date) {
            const diffTime = date - this.getStartOfWeek(this.minDate);
            return Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000));
        },
    
        getStartOfWeek(date = new Date()) {
            const copiedDate = new Date(date);
            copiedDate.setHours(0, 0, 0, 0);
            const day = copiedDate.getDay();
            const diff = (day === 0 ? -6 : 1 - day);
            copiedDate.setDate(copiedDate.getDate() + diff);
            return copiedDate;
        }
    },
       
    glosa: {
        responder: function () {
            console.log("app.robot.glosa.responder");
            app.core.robot.message("Vamos a responder glosa", 5);
            document.querySelector("#loader").style.display = "block";
            let time = 5;
            setTimeout(function () {
                app.core.robot.message("Estoy respondiendo la glosa, he encontrado 175 items glosados", time);
                setTimeout(function () {
                    time = 6;
                    app.core.robot.message("He logrado responder la glosa totalmente", 5);
                    const html = `
                        <div class="my-3">
                            <small>Aquí puedes descargar la respuesta de la glosa</small><br>
                            <a href="https://cdn1.artemisaips.com/homi/glosa/crescend-homi-glosa-IND312607.xlsx?ts=${new Date().getTime} target="_new"
                                class="btn btn-link">
                                Descargar Respuesta Glosa
                            </a>
                        </div>
                    `;
                    new nataUIDialog({
                        html: html,
                        title: "Radicar Factura",
                        height: 220,
                        width: 400,
                        events: {
                            render: function () {},
                            close: function () {}
                        }
                    });
                }, time * 1000);
                /*
                const html = `
                    <div class="mb-3">
                        <label for="txtFactura" class="form-label">Ingresa la factura</label>
                        <input id="txtFactura" class="form-control" maxlength="15" required>                            
                    </div>
                    <button type="submit" class="btn btn-primary">Continuar</button>
                `
                new nataUIDialog({
                    html: html,
                    title: "Radicar Factura",
                    height: 220,
                    width: 400,
                    events: {
                        render: function () {},
                        close: function () {}
                    }
                });
                */
                
                document.querySelector("#loader").style.display = "none";
            }, time * 1000);
        }
    }
}

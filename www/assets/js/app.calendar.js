/* globals app, $, session */

const eventos = [
    {
        y: 2021,
        m: 2,
        d: 23,
        cantidad: 3
    }
];

// TODO: se puede usar agenda por semana
app.calendar = {

    //callback: undefined,

    dataset: {},

    daily: {

        render: function (element, hours, events, year, month, day) {
            console.log("**** app.calendar.daily.render ****");
            document.getElementById("container").style.display = "none";

            let html = `
                <table class="table table-sm table-striped agenda-semana">
                    <thead>
                    <tr>
                        <th scope="col" colspan="2" class="text-center">Consulta</th>
            `;

            html += `
                    </tr>
                </thead>
            `;

            let i, x, temporal;
            for (i = 0; i < hours.length; ++i) {
                temporal = events.filter(function (record) {
                    return ( parseInt(record.h) - parseInt(hours[i].h) == 0 )
                        && record.y == year
                        && record.m == month
                        && record.d == day;
                });

                if (temporal.length > 0) {
                    console.log(temporal);

                    for (x = 0; x < temporal.length; ++x) {
                        html += `
                            <tr>
                                <td colspan="2">
                                    <h6><span class="badge badge-primary">${temporal[x].hl}</span></h6>
                                    <div class="row">
                                        <div class="col">
                                            <div class="ps-3 d-inline-block">
                                                <strong>${temporal[x].p}</strong><br>
                                                ${temporal[x].mv}<br>
                                                ${temporal[x].e}
                                            </div>
                                        </div>
                                        <div class="col">
                                            <strong>
                                                <h6><span class="badge bg-secondary">${temporal[x].dr} ${temporal[x].es}</span></h6>
                                            </strong>
                                            Consultorio: ${temporal[x].c}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }
                }
                else {
                    html += `
                        <tr>
                            <td class="font-size-11px" colspan="2">
                                <b>${hours[i].l}</b>
                            </td>
                        </tr>
                    `;
                }

            }

            html += `
                </table>
            `;

            element.innerHTML = html;
            console.log(element);
            element.style.height = (session.height - 120) + "px";
        }
    },

    semana: {
        get: function (day, dayWeek, lastNumberDay) {
            console.log("*** app.calendar.semana.get ***");
            console.log(day, dayWeek, lastNumberDay);
            var startDay = day - dayWeek;
            const arrDays = [];
            var i, contador = 0;
            for (i=startDay;i<(startDay+7);++i, ++contador) {
                if (i>lastNumberDay || i <= 0) {
                    arrDays.push(
                        "&nbsp;"
                    );
                }
                else {
                    arrDays.push(
                        app.config.calendario.week.days[contador] + " " + i
                    );
                }

            }

            console.log(arrDays);
            app.calendar.semana.render(document.getElementById("agenda-container"), arrDays, session.agend.hours);
            //app.calendar.daily.render(document.getElementById("agenda-container"), arrDays, session.agend.hours, session.agend.events);
        },

        render: function (element, semana, horario) {
            console.log("**** app.calendar.semana.render ****");
            var html = `
                <table class="table table-sm table-striped agenda-semana">
                    <thead>
                    <tr>
                        <th scope="col" class="text-center">Hora</th>
            `;
            var i;
            for (i = 0; i < semana.length; ++i) {
                html += `
                        <th scope="col" class="text-center">
                            ${( semana[i].replace( /^\D+/g, "") == new Date().getDate() ) ? "<h6 class=\"d-inline-block\"><span class=\"badge badge-primary\">" + semana[i] + "</span></h6>" : "<h6 class=\"d-inline-block\"><span class=\"badge bg-light text-dark\">" + semana[i] + "</span></h6>"}
                        </th>
                `;
            }

            html += `
                    </tr>
                </thead>
            `;

            var x;
            for (i = 0; i < horario.length; ++i) {
                html += `<tr><td class="line-height-35px strong"><b>${horario[i].l}</b></td>`;
                for (x = 0; x < semana.length; ++x) {
                    html += "<td>&nbsp;</td>";
                }
            }

            html += "</tr>";

            html += `
          </table>
        `;

            element.innerHTML = html;
            $(element).height(session.height - 120);
        }
    },

    render: function (element = document.querySelector(".ui-dialog-body"), options = {}, callback, htmlDefault = "") {
        console.log("%c app.calendar.render", "background: orange; color: #fff;");
        //console.log(options);

        if ( typeof options.show == "undefined" ) {
            options.show = true;
        }

        if ( typeof options.blockPreviousDays == "undefined" ) {
            options.blockPreviousDays = 0;
        }

        if (typeof session.agend == "undefined") session.agend = {};

        element.innerHTML = `
            <div id="ui-calendar" data-app="calendar-app" class="w-100"></div>
        `;

        if ( options.show ) element.style.display = "block";

        // Months array
        const months = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
        // Days of the Week
        const gridsize = 42; //Total number of date boxes in the grid

        // Default the state to current month and year
        app.calendar.dataset = {
            date: new Date(),
            y: new Date().getFullYear(),
            m: new Date().getMonth() + 1,
            d: new Date().getDate()
        };

        if (typeof options.date !== "undefined") {
            console.log(options.date);
            // cargando la fecha en el dataset del calendar
            app.calendar.dataset = {
                date: new Date(),
                y: options.date.getFullYear(),
                m: options.date.getMonth() + 1,
                d: options.date.getDate(),
            };
        }

        // The following function builds an array of objects with dates to be displayed in the grid
        function datesForGrid(year, month) {
            console.log(year, month);
            // days array holds all the days to be populated in the grid
            const dates = [];

            // Day on which the month starts
            var firstDay = new Date(year, month).getDay();
            // Total number of days in the month
            var totalDaysInMonth = new Date(year, parseInt(month)+1, 0).getDate();
            console.log(year, month, totalDaysInMonth);
            // Total number of days in the previous month
            var totalDaysInPrevMonth = new Date(year, month, 0).getDate();
            var i, key;

            // Days from prev month to show in the grid
            for (i = 1; i <= firstDay; i++) {
                var prevMonthDate = totalDaysInPrevMonth - firstDay + i;
                key = new Date(year, month-1, prevMonthDate).toLocaleString();
                dates.push({ 
                    year: year, month: month, key: key, date: prevMonthDate, monthClass: "prev", 
                    numberDay: new Date(year, month-1, prevMonthDate).getDay() 
                });
            }

            // Days of the current month to show in the grid
            var today = new Date(), temporal = [];
            var dayPrevious, dayNext;

            for (i = 1; i <= totalDaysInMonth; i++) {
                // recuperar asignaciones para esta fecha
                temporal = eventos.filter(function (record) {
                    return record.y == app.calendar.dataset.y
						&& record.m == app.calendar.dataset.m + 1
						&& record.d == i;
                });

                key = new Date(year, month, i).toLocaleString();
                //console.log(key);
                //console.log(today.getMonth());
                if ( i < today.getDate() && app.calendar.dataset.m === (today.getMonth() + 1) && app.calendar.dataset.y === today.getFullYear()
                    || app.calendar.dataset.m < (today.getMonth() + 1)
                    || app.calendar.dataset.y < (today.getFullYear() ) ) {
                    dayPrevious = "day-previous";
                    dayNext = "";
                }
                else {
                    dayPrevious = "";
                    dayNext = "day-next";
                }

                //console.log(app.calendar.dataset.m, (today.getMonth() + 1));
                if (i === today.getDate() && app.calendar.dataset.m === (today.getMonth() + 1) && app.calendar.dataset.y === today.getFullYear()) {
                    if (temporal.length > 0) {
                        dates.push({ 
                            year: year, month: month, key: key, date: i, monthClass: "current", todayClass: "today", cx: temporal, previous: dayPrevious, next: dayNext,
                            numberDay: new Date(year, month, i).getDay()
                        });
                    }
                    else {
                        dates.push({ 
                            year: year, month: month, key: key, date: i, monthClass: "current", todayClass: "today", previous: dayPrevious, next: dayNext,
                            numberDay: new Date(year, month, i).getDay()
                        });
                    }
                } else {
                    if (temporal.length > 0) {
                        dates.push({ 
                            year: year, month: month, key: key, date: i, monthClass: "current", cx: temporal, previous: dayPrevious, next: dayNext,
                            numberDay: new Date(year, month, i).getDay()
                        });
                    }
                    else {
                        dates.push({ 
                            year: year, month: month, key: key, date: i, monthClass: "current", previous: dayPrevious, next:dayNext,
                            numberDay: new Date(year, month, i).getDay()
                        });
                    }
                }
            }

            // If there is space left over in the grid, then show the dates for the next month
            if (dates.length < gridsize) {
                var count = gridsize - dates.length;
                for (i = 1; i <= count; i++) {
                    key = new Date(year, month + 1, i).toLocaleString();
                    dates.push({ 
                        year: year, month: month, key: key, date: i, monthClass: "next",
                        numberDay: new Date(year, month, i).getDay()
                    });
                }
            }
            return dates;
        }

        function render( options ) {

            const calendarApp = document.querySelector("[data-app=calendar-app]");
            // Building the calendar app HTML from the data
            var i;

            if (typeof options == "undefined") options = {};
            if (typeof options.controls == "undefined") options.controls = {};

            if (typeof options.controls.day == "undefined") options.controls.day = {};
            if (typeof options.controls.month == "undefined") options.controls.month = {};

            if (typeof options.controls.day.previous == "undefined") options.controls.day.previous = true;
            
            if (typeof options.controls.month.previous == "undefined") options.controls.month.previous = true;
            if (typeof options.controls.month.next == "undefined") options.controls.month.next = true;

            //#region procesar html dias calendario
            let htmlCalendarDays = "", classInitial = "", classEnd = "";
            for (i=0; i<app.config.calendario.week.days.length; i++) {
                if ( i == 0) {
                    classInitial = "edge-left";
                }
                else {
                    classInitial = "";
                }

                if ( i == 6) {
                    classEnd = "edge-right";
                }
                else {
                    classEnd = "";
                }

                htmlCalendarDays += `<div class="day-name ${classInitial} ${classEnd}">${app.config.calendario.week.days[i]}</div>`;
            }
            //#endregion

            let html = `
                <div class="calendar-nav">
                    <div class="row">
            `;

            //console.log(options);
            if (options.controls.month.previous) {
                html += `
                        <div class="col-2 align-middle">
                            <button id="prev-month" type="button" class="btn btn-light btn-circle float-start button-direction">
                                <img src="assets/images/icons/arrow-left-drop-circle.svg" alt="">
                            </button>
                        </div>
                `;
            }
            else {
                html += `
                        <div class="col-2 align-middle"></div>
                `;
            }

            html += `
                        <div class="col-8 text-center">
                            <h6 class="d-inline-block align-middle m-0">
                                ${(typeof options.title != "undefined") ? options.title : ""}
                            </h6>
                            <span class="badge badge-primary rounded-pill badge-medium my-2">
                                ${months[app.calendar.dataset.m-1]} ${app.calendar.dataset.y}
                            </span>
                        </div>
            `;

            if (options.controls.month.next) {
                html += `
                        <div class="col-2 align-middle">
                            <button id="next-month" type="button" class="btn btn-light btn-circle float-end button-direction">
                                <img src="assets/images/icons/arrow-right-drop-circle.svg" alt="">
                            </button>
                        </div>
                `;
            }
            else {
                html += `
                        <div class="col-2 align-middle"></div>
                `;
            }

            html += `
                </div>
                </div>

                <!-- grid 1 !-->
                <div class='calendar-grid'>
                    ${htmlCalendarDays}
            `;

            const temporal = datesForGrid(app.calendar.dataset.y, parseInt(app.calendar.dataset.m)-1);
            console.log(temporal);

            const fxGetSunday = (year, month, day) => {
                const oDate = new Date(year, month, day);
                if ( oDate.getDay() == 0) {
                    return true;
                }
                else {
                    return false;
                }
            };

            const fxGetSaturday = (year, month, day) => {
                const oDate = new Date(year, month, day);
                //console.log( oDate );

                if ( oDate.getDay() == 6) {
                    return true;
                }
                else {
                    return false;
                }
            };

            let todayClass = "", classEdgeLeft = "", classEdgeRight = "";
            const actualDay = new Date().getDate();
            for (i = 0; i < temporal.length; i++) {
                //console.log(temporal[i]["date"]);
                if ( i == 0) {
                    console.log( app.calendar.dataset.y, app.calendar.dataset.m-1, temporal[i]["date"] );
                }

                if ( fxGetSunday(  app.calendar.dataset.y, app.calendar.dataset.m-1, temporal[i]["date"] ) ) {
                    // aqui estoy en la primera columna
                    classEdgeLeft = "edge-left";
                }
                else {
                    classEdgeLeft = "";
                }

                if ( fxGetSaturday(  app.calendar.dataset.y, app.calendar.dataset.m-1, temporal[i]["date"] ) ) {
                    // aqui estoy en la ultima columna
                    classEdgeRight = "edge-right";
                }
                else {
                    classEdgeRight = "";
                }

                if (typeof temporal[i]["todayClass"] != "undefined") {
                    todayClass = "today";
                }
                else {
                    todayClass = "";
                }

                if (temporal[i]["monthClass"] == "prev") {
                    html += `
                        <div id="${temporal[i]["key"]}" class="${temporal[i]["monthClass"]} ${todayClass != "" ? todayClass : ""}" ${temporal[i]["next"]}></div>
                    `;
                }
                else if (temporal[i]["monthClass"] == "current") {
                    if (!options.controls.day.previous) {
                        html += `
                            <div id="day-${temporal[i]["date"]}"
                                class="ui-datepicker-container-day ui-datepicker-day ${classEdgeLeft} ${classEdgeRight} ${temporal[i]["monthClass"]} ${todayClass != "" ? todayClass : ""} ${temporal[i].previous} ${temporal[i]["next"]}"
                                data-day="${temporal[i]["date"]}" data-month="${parseInt(temporal[i].month)+1}" data-year="${temporal[i].year}">
                                <span class="badge badge-circle badge-day ui-datepicker-day"
                                    data-day="${temporal[i]["date"]}" data-month="${parseInt(temporal[i].month)+1}" data-year="${temporal[i].year}">
                                    ${temporal[i]["date"]}<br>
                                    <span style="color:#000">${actualDay}</span>
                                </span>
                                <div id="container-day-${temporal[i]["date"]}"
                                    class="w-100 ui-datepicker-day container-day ${temporal[i].previous}"
                                    data-day="${temporal[i]["date"]}" data-month="${parseInt(temporal[i].month)+1}" data-year="${temporal[i].year}">
                                </div>
                        `;
                    }
                    else {
                        html += `
                            <div id="day-${temporal[i]["date"]}"
                                class="ui-datepicker-container-day ui-datepicker-day 
                                    ${classEdgeLeft} ${classEdgeRight} ${temporal[i]["monthClass"]} ${todayClass != "" ? todayClass : ""} ${temporal[i]["next"]}"
                                data-day="${temporal[i]["date"]}" data-month="${parseInt(temporal[i].month)+1}" data-year="${temporal[i].year}">
                        `;

                        html += `
                                <span class="badge badge-circle badge-day ui-datepicker-day"
                                    data-day="${temporal[i]["date"]}" data-month="${parseInt(temporal[i].month)+1}" data-year="${temporal[i].year}">
                                    ${temporal[i]["date"]}
                                </span>
                            `;

                        html += `
                                <div id="container-day-${temporal[i]["date"]}"
                                    class="w-100 container-day ui-datepicker-day"
                                    data-day="${temporal[i]["date"]}" data-month="${parseInt(temporal[i].month)+1}" data-year="${temporal[i].year}">
                        `;

                        const oDate = new Date(temporal[i].year, temporal[i].month, temporal[i]["date"]);
                        //console.log(oDate.getDay());

                        if ((options.showFromToday && temporal[i]["date"] >= actualDay) && (options.blockSundays && oDate.getDay() != 0)) {
                            html += `
                                    ${htmlDefault}
                            `;
                        }
                        else {
                            html += "";
                        }

                        html += `
                            </div>
                        `;
                    }

                    if (typeof temporal[i]["cx"] !== "undefined") {
                        html += `
                            <div class="w-100 text-start ms-1 align-middle">
                                <span class="badge rounded-pill badge-primary">${temporal[i]["cx"][0]["cantidad"]}</span>
                            </div>
                        `;
                    }
                    html += `
                        </div>
                    `;
                }
            }

            html += `
                </div>
            `;
            calendarApp.innerHTML = html;

            document.querySelector("#loader").style.display = "none";

            //#region customize
            if ( options.blockPreviousDays == 1 ) {
                const elements = document.querySelectorAll(".ui-datepicker-container-day");
                let i;
                for (i=0; i < elements.length; i++) {
                    elements[i].classList.add("disabled");
                }

                const dayToday = new Date().getDate();
                let  dayYesterday = dayToday - 1;
                if ( dayYesterday == 0) dayYesterday = 1;
                console.log ( dayToday, dayYesterday );
                document.querySelector( "#day-" + dayToday ).classList.remove("disabled");
                document.querySelector( "#day-" + dayYesterday  ).classList.remove("disabled");

                document.querySelector( "#prev-month" ).remove();
            }

            if ( options.blockFutureDays == 1 ) {
                document.querySelector( "#next-month" ).remove();
            }

            // selected
            if ( typeof options.dateSelected != "undefined" ) {
                $("#ui-calendar .ui-datepicker-day").removeClass( "selected" );
                console.log( "paso 1");
                if ( app.calendar.dataset.y == options.dateSelected.toString().substring(0,4) ) {
                    console.log( "paso 2");
                    if ( ( parseInt(app.calendar.dataset.m)-1 ) == options.dateSelected.toString().substring(5,2) ) {
                        console.log( "paso 3");
                        document.querySelector( "#day-" + options.dateSelected.toString().substring(8,2) ).classList.add("selected");
                    }
                }
            }

            //#endregion

            //#region  events
            //console.log( calendarApp.querySelector( ".calendar-grid" ) );
            calendarApp.querySelector( ".calendar-grid" ).addEventListener( "click", function( e ) {
                console.log( e.target );
                if (e.target.classList.contains("ui-datepicker-day")) {
                    console.log( "click", e.target.dataset.day, e.target.dataset.month, e.target.dataset.year );
                    //e.preventDefault();
                    //e.stopPropagation();

                    if ( typeof options.events == "undefined") options.events = {};
                    if ( typeof options.events.onSelectDay == "function" ) {
                        options.events.onSelectDay( e.target.dataset.year, e.target.dataset.month, e.target.dataset.day );
                    }
                }
            }, true );
            //#endregion events
        }

        function showCalendar(prevNextIndicator, options) {
            //console.log("showCalendar");
            console.log("%c showCalendar", "background: orange; color: #fff;");
            console.log(prevNextIndicator);
            app.calendar.dataset.m = parseInt(app.calendar.dataset.m) + prevNextIndicator;
            if (app.calendar.dataset.m == 0) {
                app.calendar.dataset.m = 12;
                --app.calendar.dataset.y;
            }
            else if (app.calendar.dataset.m >= 13) {
                app.calendar.dataset.m = 1;
                ++app.calendar.dataset.y;
            }
            app.calendar.dataset.date = new Date(app.calendar.dataset.y, app.calendar.dataset.m-1, 1);

            //ojo EL MES es -1 asi trabaja javascript las fechas
            //console.log(options);
            render(options);

            if (typeof callback == "function") {
                callback();
            }

            $("#prev-month").click(function () {
                showCalendar(-1, options);
            });

            $("#next-month").click(function () {
                showCalendar(1, options);
            });
        }

        // Show the current month by default
        showCalendar(0, options);
    }
};

/* globals app, dayjs, session, $ */

class nataUIDatePicker extends HTMLElement {

    constructor() {
        // Always call super first in constructor
        super();
        console.log("*** nataUIDatePicker ***");

        const self = this;

        let date;
        if ( typeof self.dataset.value == "undefined" ) {
            date = dayjs().format("YYYY-MM-DD");
        }
        else {
            date = self.dataset.value;
        }

        let id;
        if ( typeof self.dataset.id == "undefined" ) {
            id = "datepicker";
        }
        else {
            id = self.dataset.id;
        }

        self.innerHTML = `
            <style>
                nata-ui-datepicker {
                    display: block;
                }

                .container-datepicker {
                    min-width: 300px;
                    border: none;
                }

                .container-datepicker .button-circle {
                    margin: 0;
                }

                .container-datepicker .ui-datepicker-calendar {
                    display: none;
                    min-height: 300px;
                    background-color: #fff;
                    border: 1px solid #ccc;
                    border-radius: 7px;
                    padding: 8px;
                    z-index: 2;
                    position: absolute;
                    left: 0;
                    top: 43px;
                    font-size: 12px;
                    box-shadow: 5px 0 15px 0 rgba(0, 0, 0, .25), -5px 0 15px 0 rgba(0, 0, 0, .25);
                }

                .badge-day {
                    padding: 0.35em 0.55em;
                }

                .ui-datepicker-input {
                    cursor: pointer;
                }
            </style>

            <div class="container-datepicker">
                <div class="input-group">
                    <input id="control-${id}" data-id="${id}" type="text"
                        class="form-control ui-datepicker-input ui-datepicker-control noselect" readonly
                        value="${date}">
                    <button type="button" class="btn btn-primary ui-datepicker-control button-circle">
                        <img src="assets/images/icons/calendar-white.svg"
                            class="ui-datepicker-control" alt="" title="">
                    </button>
                </div>
                <div class="w-100 ui-datepicker-calendar"></div>
            </div>
        `;

        //self.querySelector( ".panel" ).innerHTML = "HOLA MUNDO";
        const elementCalendar = self.querySelector( ".ui-datepicker-calendar" );
        const elementInput = self.querySelector( "#control-" + id );

        const options = {
            show: false,
            blockPreviousDays: 1,
            blockFutureDays: true,
            events: {
                onSelectDay: function ( year, month, day ) {
                    console.log( "onSelectDay" );
                    console.log( year, month, day );
                    const oDate = new Date( year, month - 1, day );
                    elementInput.value = dayjs( oDate ).format( "YYYY-MM-DD" );
                    elementCalendar.classList.remove( "ui-open" );
                    //FIXME: hay que generalizar este código
                    if ( typeof self.dataset.formIndex !== "undefined" ) {
                        session.forms[self.dataset.formIndex].fieldChange( elementInput );
                    }
                }
            }
        };

        if ( elementInput.value !== "" ) {
            options.dateSelected = elementInput.value;
        }
        console.log( options.date );
        app.calendar.render( elementCalendar, options );

        self.addEventListener( "click", function(e) {
            console.log( e.target );
            if (e.target.classList.contains("ui-datepicker-control")) {
                console.log( ".ui-datepicker-control.click" );
                e.preventDefault();
                e.stopPropagation();

                console.log ( elementCalendar );
                console.log ( elementCalendar.classList );
                if ( elementCalendar.classList.contains( "ui-open" ) ) {
                    elementCalendar.classList.remove( "ui-open" );
                }
                else {
                    elementCalendar.classList.add( "ui-open" );
                }

                // refresh calendar day
                //const $days = $("#ui-calendar .ui-datepicker-container-day");
                //$days.removeClass( "selected" );
                const day = parseInt( elementInput.value.substr(8, 2) ) ;
                const parent = document.querySelector( "#ui-calendar" );
                const daySelected = parent.querySelector( " .selected" );
                if ( daySelected !== null )  {
                    daySelected.classList.remove( "selected" );
                }
                document.querySelector( "#day-" + day ).classList.add( "selected" );
            }
        }, true );

        elementInput.addEventListener("select", function() {
            this.selectionStart = this.selectionEnd;
        }, false);

    }

    connectedCallback() {
    }

}

// Define the new element
customElements.define("nata-ui-datepicker", nataUIDatePicker);
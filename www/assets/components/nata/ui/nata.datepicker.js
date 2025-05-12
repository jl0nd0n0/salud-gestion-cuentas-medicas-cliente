/* globals $, session */

// eslint-disable-next-line no-unused-vars
class nataUIDatePickerMonth extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();
        
        console.log("*** nataUIDatePicker ***");

    }

    connectedCallback() {

        const self = this;
        self.dataset.year = new Date().getFullYear();
        self.dataset.month = new Date().getMonth() + 1;

        if (typeof session.datepicker == "undefined") session.datepicker = {};
        session.datepicker.month = new Date().getMonth() + 1;

        const html = `
            <style>
                .datepicker-grid {
                    display: grid;
                    grid-gap: 10px;
                    grid-template-columns: 60px 60px 60px;
                    grid-template-rows: 30px 30px 30px;
                    text-align: center;
                    font-size: 13px;
                    cursor: pointer;
                }

                .datepicker-grid > div {
                    border-radius: 5px;
                }

            </style>

            <div class="dropdown">
                <button id="nataUIDatepicker" class="btn btn-primary btn-circle dropdown-toggle button-datepicker" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <img class="icon-button" src="assets/images/icons/calendar-white.svg">
                </button>
                <div class="dropdown-menu p-2">
                    <div class="w-100">
                        <label for="datepickerYear" class="form-label">Año</label>
                        <select id="datepickerYear" class="form-select border-none d-inline-block width-auto" aria-label="Seleccione el año ..">
                            <option value="2022">2022</option>
                        </select>
                    </div>
                    <div class="w-100 datepicker-grid">
                        <div id="datepickerMonth-1" class= "datepicker-month">Ene</div>
                        <div id="datepickerMonth-2" class= "datepicker-month">Feb</div>
                        <div id="datepickerMonth-3" class= "datepicker-month">Mar</div>

                        <div id="datepickerMonth-4" class= "datepicker-month">Abr</div>
                        <div id="datepickerMonth-5" class= "datepicker-month">May</div>
                        <div id="datepickerMonth-6" class= "datepicker-month">Jun</div>

                        <div id="datepickerMonth-7" class= "datepicker-month">Jul</div>
                        <div id="datepickerMonth-8" class= "datepicker-month">Ago</div>
                        <div id="datepickerMonth-9" class= "datepicker-month">Sep</div>

                        <div id="datepickerMonth-10" class= "datepicker-month">Oct</div>
                        <div id="datepickerMonth-11" class= "datepicker-month">Nov</div>
                        <div id="datepickerMonth-12" class= "datepicker-month">Dic</div>
                    </div>
                </ul>
            </div>
        `;

        this.innerHTML = html;

        const elements = document.querySelectorAll(".datepicker-month");
        let i;
        for (i=0; i<elements.length; ++i) {
            elements[i].addEventListener("click", function () {

                const self = this;

                $(".datepicker-month").removeClass("ui-box-active");
                self.classList.add("ui-box-active");


            }, true);
        }

        document.getElementById("datepickerMonth-" + self.dataset.month).classList.add("ui-box-active");
    }
}

customElements.define("nata-ui-datepicker-month", nataUIDatePickerMonth);
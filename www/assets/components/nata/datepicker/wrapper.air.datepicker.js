/* globals */
// eslint-disable-next-line no-unused-vars
class nataUIDatepickerWrapperAir  {
    constructor(datepicker) {
        this.oDatepicker = datepicker;
    }

    hide () {
        this.oDatepicker.$el.style.display = "none";        
    }

    show () {
        this.oDatepicker.$el.style.display = "block";
    }
}
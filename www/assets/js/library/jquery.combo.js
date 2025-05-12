/* globals jQuery */

(function ($) {
    $.fn.combo = function (data, id, text, title, appendText) {
        console.log("select plugin");

        if (typeof title == "undefined") {
            title = "";
        }

        const $select = $(this);
        $select.empty();

        if (typeof appendText != "undefined") {
            $select.append($("<option selected />").val("").text(title + " " + appendText));
        }

        $.each(data, function () {
            $select.append($("<option />").val(this[id]).text(this[text]));
        });

        return $(this);
    };
  
}(jQuery));
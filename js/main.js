var $scope = {};
$(function () {
    var remDatabase = new Firebase("https://updatemessage.firebaseio.com/");
    remDatabase.child("message").on("value", function (snapshot) {
        $("#text_display").text(snapshot.val());
    });
    $scope.sendData = function (text_message) {
        remDatabase.update({
            "message": text_message
        });
    }
    $scope.centerElementOnPage = function (element, element_value, css_size_word) {
        if (css_size_word == "em") {
            var css_word = "em";
        }
        if (css_size_word == "px") {
            var css_word = "px";
        }
        $(element).css("position", "relative");
        $(element).css("left", $(window).innerWidth() / 2 - (element_value * 0.5) + css_word);
    }
    $scope.centerElementOnPage($("#text_display"), 500, "px");
    $scope.centerElementOnPage($("#send_btn"), 65, "px");
    $scope.centerElementOnPage($("#textarea"), 300, "px");
    $("#textarea").keyup(function (e) {
        if (e.keyCode == 13) {
            $scope.sendData($("#textarea").val());
        }
    });
});
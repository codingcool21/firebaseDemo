// initialize an object which will contain all variables and functions
var $scope = {};
// run the function when the DOM is ready and thew page has loaded
$(function () {
    bootbox.alert("Hi there!");
    
    // new variable that will link to Firebase database
    $scope.remDatabase = new Firebase("https://updatemessage.firebaseio.com/");
    
    // when somethings changed in the Firebase, instantly update the text display
    $scope.remDatabase.child("message").on("value", function (snapshot) {
        $("#text_display").text(snapshot.val());
    });
    
    // sendData function to store data in Firebase and update all clients
    $scope.sendData = function (text_message) {
        // local function to update and send changes
        // 
        $scope.remDatabase.update({
            "message": text_message
        });
    }
    
    // used to center element on page horizontally
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
    //$scope.centerElementOnPage($("#text_display"), 500, "px");
    $scope.centerElementOnPage($("#send_btn"), 65, "px");
    $scope.centerElementOnPage($("#textarea"), 300, "px");
    $("#textarea").keyup(function (e) {
        if (e.keyCode === 13) {
            var text = $("#textarea").val();
            $scope.sendData(text);
            $("#textarea").val("");
        }
    });
    $(window).resize(function() {
        $scope.centerElementOnPage($("#send_btn"), 65, "px");
        $scope.centerElementOnPage($("#textarea"), 300, "px");
        //$("#textarea").val($(window).innerWidth());
    });
});

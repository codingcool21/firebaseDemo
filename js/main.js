// initialize an object which will contain all variables and functions
var $scope = {};
// run the function when the DOM is ready and thew page has loaded
$(function () {
    $scope.yoyo = "";
    $scope.find_out_param_url == "";
    $scope.find_out_param_url = function (key_param, callback) {
        var search_param = location.search;
        if (search_param.indexOf(key_param) == -1) {
            if (callback == undefined) {
                return false;
            } else {
                callback(false);
            }
        }
        search_param = search_param.split(key_param + "=");
        yoyo = search_param[0];
        var search_param_tmp = search_param[1];
        if (search_param_tmp == undefined) {
            if (callback == undefined) {
                return false;
            } else {
                callback(false);
            }
        } else {
            var search_param_tmp_boyo = search_param_tmp.split("&");
            //search_param_tmp = search_param_tmp_boyo[1];
            if (callback == undefined) {
                return decodeURI(search_param_tmp_boyo[0]);
            } else {
                callback(decodeURI(search_param_tmp_boyo[0]));
            }
        }
    };
    $scope.groupParam = $scope.find_out_param_url("groupname");

    bootbox.alert("Hi there!");

    // new variable that will link to Firebase database
    $scope.remDatabase = new Firebase("https://updatemessage.firebaseio.com/");
    // when somethings changed in the Firebase, instantly update the text display
    $scope.remDatabase.child($scope.groupParam).on("value", function (snapshot) {
        $("#text_display").text(snapshot.val());
    });

    // sendData function to store data in Firebase and update all clients
    $scope.sendData = function (text_message) {
        // local function to update and send changes
        var object = {};
        object[$scope.groupParam] = text_message;
        $scope.remDatabase.update(object);
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
    $(window).resize(function () {
        $scope.centerElementOnPage($("#send_btn"), 65, "px");
        $scope.centerElementOnPage($("#textarea"), 300, "px");
        //$("#textarea").val($(window).innerWidth());
    });
});

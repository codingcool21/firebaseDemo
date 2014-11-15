// initialize an object which will contain all variables and functions
var $scope = {};
// new variable that will link to Firebase database
$scope.remDatabase = new Firebase("https://updatemessage.firebaseio.com/clientdata/");
$scope.dialogUI = {
    create: function ($html) {
        //$($html).appendTo("#ui-dialog")
        $("#ui-dialog").css("top", $(window).innerHeight() / 2 - ($("#ui-dialog").height() * 0.5) + "px").css("position", "absolute").css("left", $(window).innerWidth() / 2 - ($("#ui-dialog").width() * 0.5) + "px");
        $("#dialog-overlay").show();
        $("#ui-dialog").show();
    },
    close: function () {
        $("#ui-dialog").hide();
        $("#dialog-overlay").hide();
    }
}
$scope.authWithLogin = function () {
    var username_input = $("#username_txtinp").val();
    var password_input = $("#password_txtinp").val();
    var key_input = $("#key_txtinp").val();
    var getHashFirebase = new Firebase("https://updatemessage.firebaseio.com/serverdata/auth-hash");
    var decryptedHash;
    var getUserFirebase
    getHashFirebase.authWithCustomToken("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJpYXQiOjE0MTU5ODM1NDEsImQiOnsidWlkIjoiYXV0aHNlbGVjdG9yIiwicmVhZEFuZFdyaXRlQXV0aCI6InRydWUifX0.-dbdqPona_sOT4f1W87K4ePH00wI_apt8cDivykoZ9M", function (error, authdata) {
        if (!error) {
            getHashFirebase.on('value', function (data) {
                decryptedHash = CryptoJS.AES.decrypt(data.val(), key_input);
                decryptedHash = decryptedHash.toString(CryptoJS.enc.Utf8);
                getUserFirebase = new Firebase("https://updatemessage.firebaseio.com/serverdata/users/" + username_input + "/");
                getUserFirebase.authWithCustomToken(decryptedHash, function (error, authd) {
                    getUserFirebase.child("password").on("value", function (datas) {
                        var decryptedPassword = CryptoJS.AES.decrypt(datas.val(), key_input);
                        decryptedPassword = decryptedPassword.toString(CryptoJS.enc.Utf8);
                        if (decryptedPassword == password_input) {
                            //alert("Password correct!");
                            getUserFirebase.child("key").on("value", function (keyu) {
                                var jjj = keyu.val();
                                var keyToSeeValue = CryptoJS.AES.decrypt(jjj, key_input);
                                keyToSeeValue = keyToSeeValue.toString(CryptoJS.enc.Utf8);
                                //alert(keyToSeeValue);
                                $scope.remDatabase.authWithCustomToken(keyToSeeValue, function (error, authdd) {
                                    //alert(error);
                                    if (!error) {
                                        //alert("yes it works...");
                                        $scope.dialogUI.close();
                                        location.reload();
                                    }
                                });
                            });
                        }
                    });
                });
            });


        }
    });

}
// run the function when the DOM is ready and the page has loaded
$(function () {
    localStorage.setItem("auth", "false");
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
    if ($scope.groupParam == false) {
        $scope.groupParam = "message";
    }

    //bootbox.alert("Hi there!");



    // when somethings changed in the Firebase, instantly update the text display
    $scope.remDatabase.child($scope.groupParam).on("value", function (snapshot) {
        localStorage.setItem("auth", "true");
        $("#text_display").text(snapshot.val().value);
    }, function (error) {
        //alert(error);
        $scope.dialogUI.create();

    });
    //$scope.checkIfAuthIsLocal = function () {
    // if ($("[data-popup = 'true'") == "") {
    //    return;
    // } else {
    //     if (localStorage.getItem("auth") == "false") {
    $("[data-popup = 'true']").css("display", "block").appendTo("#ui-dialog");
    //          $scope.dialogUI.create()
    //   }
    //  }
    //  }

    //setTimeout(function () {
    //    $scope.checkIfAuthIsLocal()
  //  }, 1300);

    // sendData function to store data in Firebase and update all clients
    $scope.sendData = function (text_message) {
        // local function to update and send changes
        var object = {};
        object[$scope.groupParam] = {
            "value": text_message,
            "type": $("#type_select").val()
        };
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
    $scope.centerElementOnPage($("#type_select"), 125, "px");
    $("#textarea").keyup(function (e) {
        if (e.keyCode === 13) {
            var text = $("#textarea").val();
            $scope.sendData(text);
            $("#textarea").val("");
        }
    });
    $(window).resize(function () {
        $("#ui-dialog").css("top", $(window).innerHeight() / 2 - ($("#ui-dialog").height() * 0.5) + "px").css("position", "absolute").css("left", $(window).innerWidth() / 2 - ($("#ui-dialog").width() * 0.5) + "px");
        $scope.centerElementOnPage($("#send_btn"), $("#send_btn").height(), "px");
        $scope.centerElementOnPage($("#textarea"), 300, "px");
        $scope.centerElementOnPage($("#type_select"), 125, "px");
        //$("#textarea").val($(window).innerWidth());
    });
});
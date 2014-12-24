var $scope = {};
$scope.remDatabase = new Firebase("https://updatemessage.firebaseio.com/clientdata/");
$scope.authWithLogin = function () {
    var username_input = $("#username_txtinp").val();
    var password_input = $("#password_txtinp").val();
    var key_input = $("#key_txtinp").val();
    var getHashFirebase = new Firebase("https://updatemessage.firebaseio.com/serverdata/auth-hash");
    var decryptedHash;
    var getUserFirebase = new Firebase("https://updatemessage.firebaseio.com/serverdata/users/" + username_input + "/");
    getHashFirebase.authWithCustomToken("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJpYXQiOjE0MTkwNzIwNjYsImQiOnsidWlkIjoiYXV0aHNlbGVjdG9yIiwicmVhZEFuZFdyaXRlQXV0aCI6InRydWUiLCJyZWFkVXNlck5hbWUiOnRydWV9fQ.79xFOzUtMIwVoSymTtNeeGq_224VkJWNDZOT7dTF_Oc", function (error, authdata) {
        //alert(error);
        //alert(!error);
        if (!error) {
            // alert("got in to if");
            getHashFirebase.on("value", function (data) {
                // alert("got in to getHashFirebase");
                decryptedHash = CryptoJS.AES.decrypt(data.val(), key_input);
                decryptedHash = decryptedHash.toString(CryptoJS.enc.Utf8);
                //getUserFirebase = new Firebase("https://updatemessage.firebaseio.com/serverdata/users/" + username_input + "/");
                getUserFirebase.authWithCustomToken(decryptedHash, function (error, authd) {
                    //alert(error);
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
                                        //$scope.dialogUI.close();
                                        $scope.closeLoginDialog();
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
$scope.centerElementOnPage = function (element, element_value, css_size_word, top_or_left) {
    //alert(element + " " + element_value + " " + css_size_word + " "+ top_or_left);
    var windowmeasure;
    if (css_size_word == "em") {
        var css_word = "em";
    }
    if (css_size_word == "px") {
        var css_word = "px";
    }
    if (top_or_left == "top") {
        windowmeasure = $(window).innerHeight()
    } else {
        windowmeasure = $(window).innerWidth()
    }
    //alert(windowmeasure);
    $(element).css("position", "relative");
    $(element).css(top_or_left, windowmeasure / 2 - (element_value * 0.5) + css_word);
}
$scope.setButtonAction = function (button_object_string, function_to_call) {
    $(button_object_string).click(function_to_call);
}
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
        $("#textdisplay").html("&nbsp;");
        localStorage.setItem("auth", "true");
        switch (snapshot.val().type) {
        case "message":
            $("#textdisplay").html(snapshot.val().value);
            break;
        case "youtube": //$("#textdisplay").html("<iframe width='560' height='315' src='//www.youtube.com/embed/" + snapshot.val().value +"' frameborder='0' allowfullscreen></iframe>");
            jwplayer("textdisplay").setup({
                file: "http://www.youtube.com/watch?v=" + snapshot.val().value,
                width: 800,
                height: 420,
                skin: "vapor.xml"
            });
            $("#textdisplay").attr("position", "relative");
            $scope.centerElementOnPage("#textdisplay", 800, "px", "left");
            jwplayer("textdisplay").onReady(function () {
                $scope.centerElements();
            });
        }
    }, function (error) {
        //alert(error);
        //
        $("[data-targetn='login']").show()
        $scope.dialogIsHiddenOrShown = 0;
        $("#overlay").show();

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

    $scope.centerElements = function () {
        //alert("Page width is " + $(window).innerWidth() + " and height is " + $(window).innerHeight());

        $scope.centerElementOnPage("#textdisplay", 800, "px", "left");
        $scope.centerElementOnPage("#statusBar", $("#statusBar").width() + 150, "px", "left");
        $scope.centerElementOnPage("[data-targetn='login']", 550, "px", "left");
        $scope.centerElementOnPage("[data-targetn='login']", 300 + 185, "px", "top");
        $scope.dialogIsHiddenOrShown = 1;
        var pawidth = $(window).innerWidth();
        //switch(pawidth) {
        //   case 768:
        //        $("#topbar").attr("height", "10%").attr("bottom", "90%");
        //       break;
        //  case 1024:
        //     $("#topbar").attr("height", "14.5%").attr("bottom", "85.5%");
        //       break;
        //}
    }
    $scope.setButtonAction("#log_in_btn", function () {
        //alert(show_or_hide);
        if ($scope.dialogIsHiddenOrShown == 0) {
            $("[data-targetn='login']").hide()
            $scope.dialogIsHiddenOrShown = 1;
            $("#overlay").hide();
        } else {
            $("[data-targetn='login']").show()
            $scope.dialogIsHiddenOrShown = 0;
            $("#overlay").show();
        }
    });
    $scope.centerElements();
    $(window).resize($scope.centerElements);
    $scope.closeLoginDialog = function () {
        $("[data-targetn='login']").hide();
        $scope.dialogIsHiddenOrShown = 1;
        $("#overlay").hide();
    }
});

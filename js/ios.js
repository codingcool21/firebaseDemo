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
    alert(error);
    alert(!error);
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
$(function() {

});

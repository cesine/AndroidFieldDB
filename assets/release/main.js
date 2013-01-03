var urlIsTouchDBReady = localStorage.getItem("urlIsTouchDBReady")
    || "https://localhost:6984/ginalocal4-secondcorpus/_design/pages/index.html";
var authURL = localStorage.getItem("authURL") || "https://localhost:6984";
// alert("Loading...");

if (OPrime.isAndroidApp()) {
  var tempUrlIsTouchDBReady = Android.getLocalCouchAppURL();
  if (tempUrlIsTouchDBReady) {
    urlIsTouchDBReady = tempUrlIsTouchDBReady;
  }
  console.log("contacting urlIsTouchDBReady is " + urlIsTouchDBReady);
  var tempAuthUrl = Android.getRemoteServerDomain();
  if (tempAuthUrl) {
    authURL = "https://" + tempAuthUrl;
  }
//  alert("AuthURL from android " + authURL);
}
/*
 * Initialize the form with the user's information
 */
$("#username").val(localStorage.getItem("username") || "public");
$("#password").val(localStorage.getItem("password") || "none");
$("#authURL").val(localStorage.getItem("authURL") || authURL);

var checkToSeeIfTouchDBReady = function(failcallback) {
  $
      .ajax({
        type : 'GET',
        url : urlIsTouchDBReady,
        data : {},
        beforeSend : function(xhr) {
          // alert("before send" + JSON.stringify(xhr));

          xhr.setRequestHeader('Accept', 'application/json');
        },
        success : function(serverResults) {
          console.log("serverResults" + JSON.stringify(serverResults));
          alert("Your offline database is ready.");
        },// end successful fetch
        error : function(response) {
          console.log("error response." + JSON.stringify(response));
          // alert("error response." + JSON.stringify(response));

          if (response.responseText) {
            if (response.responseText.indexOf("<html") >= 0) {
              localStorage.setItem("urlIsTouchDBReady", urlIsTouchDBReady);
//              alert("Your offline databse is ready, not authenticating you online.");
              window.location.replace(urlIsTouchDBReady);
              return;
            }
            var error = JSON.parse(response.responseText);
            if (error.error == "unauthorized") {
              alert("CouchDB ready but you need to get a session token, this can only happen when you are online.")
            } else {
              alert("Waiting for CouchDB to load...");
              // Loop every 2 sec waiting for the database to load
            }
            window.setTimeout(checkToSeeIfTouchDBReady, 2000);
          }

          $("#user-welcome-modal").modal("show");

        },
        dataType : "json"
      });

};

$(".submit").click(
    function() {
      authURL = document.getElementById("authURL").value;
      $.couch.urlPrefix = document.getElementById("authURL").value;
      var username = document.getElementById("username").value;
      var password = document.getElementById("password").value;
      $.couch.login({
        name : username,
        password : password,
        success : function() {
          localStorage.setItem("username", username);
          localStorage.setItem("password", password);
          localStorage.setItem("authURL", authURL);
          $(".error").html("Downloading your firstcorpus database...");
          if (OPrime.isAndroidApp()) {
            Android.setCredentialsAndReplicate(username + "-firstcorpus",
                username, password, authURL.replace("https://", "").replace(
                    "http://", ""));
          } else {
            urlIsTouchDBReady = authURL + "/" + username
                + "-firstcorpus/_design/pages/index.html";
          }
          checkToSeeIfTouchDBReady();
        },
        error : function(code, error, reason) {
          console.log("Here is error code " + code + " error: "
              + JSON.stringify(error) + " reason: " + JSON.stringify(reason));
          // if (code == "401") {
          $(".error").html(reason);
          // }
        }
      });

    });

checkToSeeIfTouchDBReady();
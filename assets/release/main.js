var urlIsTouchDBReady = "";

/* override the url using a parameter from the url if present */
var urlInParameter = window.location.hash;
if(urlInParameter){
  //Java: .replaceAll("/", "ssslashhh").replaceAll("\\.", "dddottt").replaceAll(":", "sssemicolonnn")
  urlIsTouchDBReady = urlInParameter.replace(/ssslashhh/g,"/").replace(/dddottt/g,".").replace(/sssemicolonnn/g,":").replace("#/","");
}
console.log("urlIsTouchDBReady: "+urlIsTouchDBReady);
console.log("checking db: "+urlIsTouchDBReady)
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
              // alert("Your offline databse is ready, not authenticating you
              // online.");
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
          }
          window.setTimeout(checkToSeeIfTouchDBReady, 2000);


        },
        dataType : "json"
      });

};

checkToSeeIfTouchDBReady();
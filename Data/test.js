function obtainSpecificContentRepresentation(value, credentials) {
  url = "http://localhost:8080/rest/id/1/" + id + "?representation=" + value;
  console.log(url);
  fetch(url, {
    method: "get",
    headers: {
      Authorization: "next " + credentials,
    },
  }).then((response) => {
    var iframe = document.getElementById("iframeDoc");
    iframe.src = response.url;
  });
}

}
function obtainCC(value, credentials) {
  var iframe = document.getElementById("iframeDoc");
  url =
    "http://localhost:8080/rest/id/1/" +
    id +
    "?cred=" +
    credentials +
    "&representation=" +
    value;
  console.log(url);
  iframe.src = url;
}

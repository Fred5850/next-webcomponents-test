function FetchingCredentials() {
  console.log("TeFetchingCredentialsst called: Start");
  var credentials = "";
  fetch("http://localhost:8080/rest/authenticate", {
    method: "get",
    headers: new Headers({
      Authorization: "Basic " + btoa("admin:admin"),
      "Content-Type": "application/json",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      credentials = data.ticket;
      console.log(credentials);
      console.log("FetchingCredentials called: End");
    });
}
//dagens credentials 05-11
//9S2NGN2ZENS6WEKDENP78TB1E9HPGTBPCMX7AWV5E8X42H2D9570_GDVWF5B82EKJGAHSWV5AQG0
function TakeCrednetialsAndGo(credentials) {
  console.log("TakeCrednetialsAndGo called: Start");
  var url =
    "http://localhost:8080/rest/list/1/items/YEL/0/10/InvoiceId/385987?cred=" +
    credentials;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log("TakeCrednetialsAndGo called: End");
    });
}

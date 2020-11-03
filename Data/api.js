function CallWebApi() {
  var customer = new Customer(
    "admin",
    "admin",
    "https://nixtst01:35000/rest/authenticate"
  );
  var request = new XMLHttpRequest();
  var request2 = new request.open("GET", customer.url, true);
  request.setRequestHeader(
    "Authorization",
    authenticateUser(customer.username, customer.password)
  );
  request.setRequestHeader("Accept", "application/json");
  request.setRequestHeader("Access-Control-Allow-Credentials", true);

  request.onreadystatechange = function () {
    // add logic here?
    if (request.readyState === 4 && request.status === 200) {
      console.log(request.responseText);
    } else {
      console.log(request.status);
    }
  };

  request.send();

  console.log("status: " + request.status);
  console.log("response: " + request.responseText);
}

function authenticateUser(user, password) {
  var token = user + ":" + password;
  var hash = btoa(token);

  return "Basic " + hash;
}

function fetchingCredentials(invoiceId) {
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
      credentials = data.ticket;
      console.log(data);
      console.log("credentials : " + credentials);
      obtainMetaData(credentials, invoiceId);
      obtainContent(credentials, invoiceId);
    });
}

function obtainContent(credentials, invoiceId) {
  obtainItem(credentials, invoiceId).then((data) => {
    contents = data.result[0].contents;
    if (contents.length == 1) {
      id = contents[0].id; //urn:multiarchive:content:YEL:36965-36968#1-1
      console.log(id);
      representations = contents[0].representations;

      var previewfound = false;
      representations.forEach((obj) => {
        Object.entries(obj).forEach(([key, value]) => {
          if ("preview" == `${value}`) {
            previewfound = true;
            return;
          }
        });
      });
      if (previewfound) {
        obtainSpecificContentRepresentation("preview", credentials);
      } else {
        obtainSpecificContentRepresentation("original", credentials);
      }
    } else {
      console.log("no content viable or more than 2 - error");
    }
  });
}

function obtainMetaData(credentials, invoiceId) {
  obtainItem(credentials, invoiceId).then((data) => {
    test = data.result[0].metadata;
    var table = document.getElementById("next-metadata");
    table.innerHTML = "";
    test.forEach((obj) => {
      var row = table.insertRow(0);
      row.insertCell(0).innerHTML = obj.label;
      row.insertCell(1).innerHTML = obj.value;
    });
  });
}

function obtainItem(credentials, invoiceId) {
  var url =
    "http://localhost:8080/rest/list/1/items/YEL/0/10/InvoiceId/" + invoiceId;

  return fetch(url, {
    method: "get",
    headers: {
      Authorization: "Next " + credentials,
    },
  }).then((response) => response.json());
}

function obtainSpecificContentRepresentation(value, credentials) {
  url =
    "http://localhost:8080/rest/id/1/" +
    id +
    "?representation=" +
    value +
    "&cred=" +
    credentials;
  console.log(url);
  fetch(url, {
    method: "get",
    headers: {
      Authorization: "Next " + credentials,
    },
  }).then((response) => {
    console.log(response);
    var iframe = document.getElementById("iframeDoc");
    if (response.status == 200) {
      iframe.src = url;
    } else {
      console.log("response status is not 200, error");
    }
  });
}
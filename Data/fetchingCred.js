function FetchingCredentials(invoiceId) {
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
      credentials = data.ticket;
      console.log(data);
      console.log(credentials);
      obtainMetaData(credentials, invoiceId);
      obtainContent(credentials, invoiceId);
    });
}

function obtainContent(credentials, invoiceId) {
  obtainItem(credentials, invoiceId).then((data) => {
    contents = data.result[0].contents;
    if (contents.length == 1) {
      id = contents[0].id;
      console.log(id);
      representations = contents[0].representations;

      representations.forEach((obj) => {
        Object.entries(obj).forEach(([key, value]) => {
          if ("preview" == `${value}`) {
            obtainSpecificContentRepresentation(`${value}`, credentials);
          } else if ("fulltext" == `${value}`) {
            obtainSpecificContentRepresentation(`${value}`, credentials);
          }
        });
      });
    } else {
      console.log("no content viable or more than 2 - error");
    }
  });
}

function obtainMetaData(credentials, invoiceId) {
  obtainItem(credentials, invoiceId).then((data) => {
    test = data.result[0].metadata;
    var table = document.getElementById("metadata");
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
      Authorization: "next " + credentials,
    },
  }).then((response) => response.json());
}

function obtainSpecificContentRepresentation(value, credentials) {
  url = "http://localhost:8080/rest/id/1/" + id + "?representation=" + value;
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

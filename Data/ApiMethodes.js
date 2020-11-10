class ApiMethodes {
  const customer = new Customer("admin", "admin", "http://localhost:8080");


  FetchingCredentials() {
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

  obtainContent(credentials) {
    obtainItem(credentials).then((data) => {
      //console.log(data); // whole json object
      contents = data.result[0].contents;
      if (contents.length == 1) {
        console.log(contents); //content
        id = contents[0].id;
        console.log(id);
        representations = contents[0].representations;
        //console.log(representations);

        representations.forEach((obj) => {
          Object.entries(obj).forEach(([key, value]) => {
            //console.log(`${key} = ${value}`); //each key value pair in repesentation
            if ("fulltext" == `${value}`) {
              obtainSpecificContentRepresentation(`${value}`, credentials);
            } else if ("preview" == `${value}`) {
              obtainSpecificContentRepresentation(`${value}`, credentials);
            }
          });
        });
      } else {
        console.log("no content viable or more than 2 - error");
      }
    });
  }
  obtainMetaData(credentials) {
    obtainItem(credentials).then((data) => {
      console.log(data); // whole object
      test = data.result[0].metadata;
      var table = document.getElementById("metadata");
      test.forEach((obj) => {
        var row = table.insertRow(0);
        row.insertCell(0).innerHTML = obj.label;
        row.insertCell(1).innerHTML = obj.value;
      });
    });
  }

  obtainItem(credentials) {
    var url =
      "http://localhost:8080/rest/list/1/items/YEL/0/10/InvoiceId/385987";

    return fetch(url, {
      method: "get",
      headers: {
        Authorization: "next " + credentials,
      },
    }).then((response) => response.json());
  }

  obtainSpecificContentRepresentation(value, credentials) {
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
}

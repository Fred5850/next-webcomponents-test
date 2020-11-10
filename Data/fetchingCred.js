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
      //GetMetaData(credentials);
      console.log("FetchingCredentials called: End");
    });
}

function getContent(credentials) {
  getItem(credentials).then((data) => {
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
            getSpecificContentRepresentation(`${value}`, credentials);
          } else if ("preview" == `${value}`) {
            getSpecificContentRepresentation(`${value}`, credentials);
          }
        });
      });
    } else {
      console.log("no content viable or more than 2 - error");
    }
  });
}
//dagens credentials 05-11
//9S2NGN2ZENS6WEKDENP78TB1E9HPGTBPCMX7AWV5E8X42H2D9570_GDVWF5B82EKJGAHSWV5AQG0
function GetMetaData(credentials) {
  console.log("GetMetaData called: Start");
  getItem(credentials).then((data) => {
    //console.log(data); // whole object
    test = data.result[0].metadata;
    test.forEach((obj) => {
      //console.log(obj); //metadata
      Object.entries(obj).forEach(([key, value]) => {
        console.log(`${key} = ${value}`); //each key value pair in meta data
        //#TODO do stuff with meta data
      });
      console.log("-------------------");
    });
    console.log(test);
    console.log("GetMetaData called: End");
  });
}

function getItem(credentials) {
  var url = "http://localhost:8080/rest/list/1/items/YEL/0/10/InvoiceId/385987";

  return fetch(url, {
    method: "get",
    headers: {
      Authorization: "next " + credentials,
    },
  }).then((response) => response.json());
}

function getSpecificContentRepresentation(value, credentials) {
  url = "http://localhost:8080/rest/id/1/" + id + "?representation=" + value;
  console.log("getSpecificContent url: " + url);
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

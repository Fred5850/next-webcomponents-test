var credentials = "";
var invoiceId = "";

function doMagic() {
  var obtainContentTest = obtainContent(
    "9S2NGN2ZENS6WEKDENP78TB1E9HPGTBPCMX7AWV5E8X42H2D9570_VV3Z7S4CXAWGZM9XRM",
    "385987"
  );
  obtainContentTest.then((result) => {
    console.log(result); //nailed it
  });
}

function fetchingCredentials() {
  return new Promise(function (resolve, reject) {
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
        Promise.resolve(credentials);
        //console.log("credentials : " + credentials);
        //obtainMetaData(credentials, invoiceId);
        //obtainContent(credentials, invoiceId);
      });
  });
}

function obtainContent(credentials, invoiceId) {
  return new Promise(function (resolve, reject) {
    return obtainItem(credentials, invoiceId).then((data) => {
      var contents = data.result[0].contents;
      if (contents.length == 1) {
        var id = contents[0].id; //urn:multiarchive:content:YEL:36965-36968#1-1
        var representations = contents[0].representations;
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
          resolve(
            obtainSpecificContentRepresentation(id, "preview", credentials)
          );
        } else {
          resolve(
            obtainSpecificContentRepresentation(id, "original", credentials)
          );
        }
      } else {
        console.log("no content viable - error");
        reject();
      }
    });
  });
}

function obtainMetaData() {
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
//return an json object (next Item)
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
// returns a url for a content
function obtainSpecificContentRepresentation(id, value, credentials) {
  return new Promise(function (resolve, reject) {
    var url =
      "http://localhost:8080/rest/id/1/" +
      id +
      "?representation=" +
      value +
      "&cred=" +
      credentials;
    //console.log("generated url: " + url);

    //i guess i could technically just return the url here, the fetch is just to check if it credentials is working
    fetch(url, {
      method: "get",
      headers: {
        Authorization: "Next " + credentials,
      },
    }).then((response) => {
      if (response.status == 200) {
        resolve(url);
      } else {
        console.log("response status is not 200, error");
        Preject();
      }
    });
  });
}

function clickclick() {
  console.log(invoiceId);
  invoiceId = "35303";
  console.log(invoiceId);
}
export {
  invoiceId,
  credentials,
  doMagic,
  fetchingCredentials,
  obtainContent,
  obtainMetaData,
  obtainItem,
  obtainSpecificContentRepresentation,
  clickclick,
};

function doMagic() {
  var cred =
    "9S2NGN2ZENS6WEKDENP78TB1E9HPGTBPCMX7AWV5E8X42H2D9570_SVC6WK3HP0DYH84MZCJ9R ";
  //get credentials
  fetchingCredentials().then((result) => console.log(result)); //credentials
  //get url
  obtainContent(cred, "385987").then((result) => console.log(result)); //logs "content url"
  //get array of metadata
  obtainMetaData(cred, "385987").then((result) => console.log(result));
}

function fetchingCredentials() {
  return fetch("http://localhost:8080/rest/authenticate", {
    method: "get",
    headers: new Headers({
      Authorization: "Basic " + btoa("admin:admin"),
      "Content-Type": "application/json",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      var credentials = data.ticket;
      return credentials;
    });
}

function obtainContent(credentials, invoiceId) {
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
        return obtainSpecificContentRepresentation(id, "preview", credentials);
      } else {
        return obtainSpecificContentRepresentation(id, "original", credentials);
      }
    } else {
      throw new genericError("no content viable - error");
    }
  });
}

function obtainMetaData(credentials, invoiceId) {
  return obtainItem(credentials, invoiceId).then((data) => {
    var metadataList = data.result[0].metadata;
    let metadataMap = new Map();
    metadataList.forEach((obj) => {
      metadataMap.set(obj.label, obj.value);
    });
    return metadataMap;
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
  var url =
    "http://localhost:8080/rest/id/1/" +
    id +
    "?representation=" +
    value +
    "&cred=" +
    credentials;

  return fetch(url, {
    method: "get",
    headers: {
      Authorization: "Next " + credentials,
    },
  }).then((response) => {
    if (response.status !== 200) {
      throw new genericError("Response status is not 200, Error");
    }
    return url;
  });
}
function changeAttributesForNextComponents() {
  var invoiceId = "387061";
  console.log(invoiceId);
  var components = document.getElementsByClassName("nextComponent");
  for (var counter = 0; components[counter]; counter++) {
    components[counter].setAttribute("invoiceId", invoiceId);
  }
}
export {
  doMagic,
  fetchingCredentials,
  obtainContent,
  obtainMetaData,
  obtainItem,
  obtainSpecificContentRepresentation,
  changeAttributesForNextComponents,
};

function doMagic() {
  var cred =
    "9S2NGN2ZENS6WEKDENP78TB1E9HPGTBPCMX7AWV5E8X42H2D9570_AXZ71XTQ98938R3YBXA0 ";
  //get credentials
  //fetchingCredentials().then((result) => console.log(result)); //credentials
  //get array of url
  obtainContent(cred, "141099").then((result) => console.log(result)); //logs "content url"
  //get array of metadata
  //obtainMetaData(cred, "385987").then((result) => console.log(result));
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

//returns an url
function obtainContent(credentials, invoiceId) {
  return obtainItem(credentials, invoiceId).then((data) => {
    var contents = data.result[0].contents;
    if (contents.length >= 1) {
      const promises = contents.map((content) => {
        return {
          url: convertContentsToURL(content, credentials),
          name: convertContentsToName(content, credentials),
        };
      });
      return Promise.all(promises);
    } else {
      throw new genericError("no content viable - error");
    }
  });
}

function convertContentsToName(content, credentials) {
  return "fisk";
}
function convertContentsToURL(content, credentials) {
  const hasPreview = content.representations.some((representation) => {
    return Object.values(representation).some(
      (value) => value.toString() === "preview"
    );
  });
  if (hasPreview) {
    return obtainContentUrl(content.id, "preview", credentials);
  } else {
    return obtainContentUrl(content.id, "original", credentials);
  }
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
function obtainContentUrl(id, value, credentials) {
  return (
    "http://localhost:8080/rest/id/1/" +
    id +
    "?representation=" +
    value +
    "&cred=" +
    credentials
  );
}
function changeAttributesForNextComponents(invoiceId) {
  //doMagic();
  var components = document.getElementsByClassName("nextComponent");
  for (var counter = 0; components[counter]; counter++) {
    components[counter].setAttribute("invoiceId", invoiceId);
  }
}
export {
  fetchingCredentials,
  obtainContent,
  obtainMetaData,
  changeAttributesForNextComponents,
};

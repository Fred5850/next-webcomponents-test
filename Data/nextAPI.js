/*
 * Fetching Next credentials, for use in other functions
 */
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
/*
 *  Obtain an item, and returns an json Object which contains content url and name.
 */
function obtainContent(credentials, invoiceId) {
  return obtainItem(credentials, invoiceId).then((data) => {
    var contents = data.result[0].contents;
    if (contents.length >= 1) {
      const promises = contents.map((content) => {
        return {
          url: convertContentsToURL(content, credentials),
          name: convertContentsToName(content),
        };
      });
      return Promise.all(promises);
    } else {
      throw new genericError("no content viable - error");
    }
  });
}
/*
 * return content name
 */
function convertContentsToName(content) {
  return content.name;
}
/*
 * for each content on the item, it returns a specific url.
 */
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
/*
 * returns a map of metaData, with help of invoiceId and credentials
 */
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
/*
 *  Return an json object (next Item) with help of Credentials and Invoice ID
 */
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
/*
 *  trims and url and returns the correct formatted url for a content
 */
function obtainContentUrl(id, value, credentials) {
  var myRe = new RegExp("(.*)(?:#.*)");
  var trimId = myRe.exec(id)[1];

  return (
    "http://localhost:8080/rest/id/1/" +
    trimId +
    "?representation=" +
    value +
    "&cred=" +
    credentials
  );
}
/*
 * service for obtainInvoiceList, returns a json object containing 10 items
 */
function obtainItemList(credentials, max) {
  //fix later?
  var url =
    "http://localhost:8080/rest/list/1/items/YEL/0/" +
    max +
    "?sort=-$InvoiceId:long";
  return fetch(url, {
    method: "get",
    headers: {
      Authorization: "Next " + credentials,
    },
  }).then((response) => response.json());
}
/*
 * from the obtainItemList, it returns an array with invoiceIds.
 */
function obtainInvoiceList(credentials, max) {
  return obtainItemList(credentials, max).then((data) => {
    var metadataList;
    var newResult = data.result;
    let invoiceMap = new Array();
    Array.from(newResult).map((value, index) => {
      metadataList = value.metadata;
      metadataList.forEach((obj) => {
        if ("InvoiceId" == obj.name) {
          invoiceMap.push(obj.value);
        }
      });
    });
    return invoiceMap;
  });
}
/*
 * Deletes an item and returns response.status
 */
function deleteItem(invoiceId, credentials) {
  return obtainItem(credentials, invoiceId).then((result) => {
    if (result.length == 0) {
      return "No items with that ID";
    }
    var urn = result.result[0].id;
    return deleteRequest(urn, credentials).then((response) => {
      if (response.status != 200) {
        console.log(response.status + " : " + response.statusText);
        return response.status;
      }
      changeAttributesForNextComponents("");
      return response.status;
    });
  });
}
/*
 * calls the Delete request on the item and retruns the response.
 */
function deleteRequest(urn, credentials) {
  var newUrn = urn.replace("#", "%23");
  var url = "http://localhost:8080/rest/id/latest/" + newUrn;

  return fetch(url, {
    method: "delete",
    headers: {
      Accept: "application/xml",
      Authorization: "Next " + credentials,
    },
  }).then((response) => {
    return response;
  });
}
/*
 * Loobs through all NextComponents and changes the "invoiceId"
 */
function changeAttributesForNextComponents(invoiceId) {
  var components = document.getElementsByClassName("nextComponent");
  for (var counter = 0; components[counter]; counter++) {
    components[counter].setAttribute("invoiceId", invoiceId);
  }
}

/*
 *  All functions which can be used outside the module
 */
export {
  fetchingCredentials,
  obtainContent,
  obtainMetaData,
  changeAttributesForNextComponents,
  obtainInvoiceList,
  deleteItem,
};

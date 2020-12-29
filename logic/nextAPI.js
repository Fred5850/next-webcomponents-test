const CompanyUrl = "http://localhost:8080";
const username = "admin";
const password = "admin";
const archive = "YEL";

/*
 * Fetching Next credentials, for use in other functions
 */
function fetchingCredentials() {
  return fetch(CompanyUrl + "/rest/authenticate", {
    method: "get",
    headers: new Headers({
      Authorization: "Basic " + btoa(username + ":" + password),
      "Content-Type": "application/json",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      let credentials = data.ticket;
      return credentials;
    });
}
/*
 *  Obtain an item, and returns an json Object which contains content url and name.
 */
function obtainContent(credentials, invoiceId) {
  return obtainItem(credentials, invoiceId).then((data) => {
    let contents = data.result[0].contents;
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
    let metadataMap = new Map();

    // Check if there is an item
    if (data.result.length === 0) {
      console.error("no item viable - Metadata");
      return metadataMap;
    }

    let metadataList = data.result[0].metadata;

    //check if there is metadata
    if (metadataList === 0) {
      console.error("no metadata viable - Metadata");
      return metadataMap;
    }

    // add Metadata to map
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
  let url =
    CompanyUrl +
    "/rest/list/1/items/" +
    archive +
    "/0/10/InvoiceId/" +
    invoiceId;
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
  let removeRevision = new RegExp("(.*)(?:#.*)");
  let trimId = removeRevision.exec(id)[1];

  return (
    CompanyUrl +
    "/rest/id/1/" +
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
  let url =
    CompanyUrl +
    "/rest/list/1/items/" +
    archive +
    "/0/" +
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
    let metadataList;
    let newResult = data.result;
    let invoiceArray = new Array();
    Array.from(newResult).map((value, index) => {
      metadataList = value.metadata;
      metadataList.forEach((obj) => {
        if ("InvoiceId" === obj.name) {
          invoiceArray.push(obj.value);
        }
      });
    });
    return invoiceArray;
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
    let urn = result.result[0].id;
    return deleteRequest(urn, credentials).then((response) => {
      if (response.status !== 200) {
        console.error(response.status + " : " + response.statusText);
        return response.status;
      }
      return response.status;
    });
  });
}
/*
 * calls the Delete request on the item and retruns the response.
 */
function deleteRequest(urn, credentials) {
  let newUrn = urn.replace("#", "%23");
  let url = CompanyUrl + "/rest/id/latest/" + newUrn;

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
 *  All functions which can be used outside the module
 */
export {
  fetchingCredentials,
  obtainContent,
  obtainMetaData,
  obtainInvoiceList,
  deleteItem,
};

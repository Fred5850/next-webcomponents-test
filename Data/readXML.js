function readXML() {
  var xml = new XMLHttpRequest();
  xml.open("Get", "385987.xml", false);
  xml.send();
  var xmlData = xml.responseXML;
  if (!xmlData) {
    xmlData = new DOMParser().parseFromString(xml.responseText, "text/xml");
  }

  var result = xmlData.getElementsByTagName("results");
  var id = result[0].getElementsByTagName("id")[0].firstChild.data;
  console.log(id);
}

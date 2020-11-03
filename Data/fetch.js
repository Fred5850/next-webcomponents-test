function Test() {
  console.log("Test called: Start");

  fetch("https://nixtst01:35000/rest/authenticate", {
    method: "get",
    headers: new Headers({
      Authorization: "Basic " + btoa("admin:admin"),
      "Content-Type": "application/json",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log(response);
      })

      .catch(function (err) {
        console.log(err);
      }),
  });
  console.log("Test called: End");
}

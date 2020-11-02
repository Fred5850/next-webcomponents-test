<script src="customer.js"></script>

var token_ // variable will store the token


var username = "admin"; // app clientID
var password = "admin"; // app clientSecret
var url = "http://nixtst01:15000/rest/authenticate"; // Your application token endpoint  
var request = new XMLHttpRequest(); 

function Test() {
    console.log("test called");
    request.open('GET', url, true, username,password);
    request.onreadystatechange = function() {
        // D some business logics here if you receive return
        if(request.readyState === 4 && request.status === 200) {
            console.log(request.responseText);
        } else {
            console.log(request.status);
        }
    }
    request.send()
}

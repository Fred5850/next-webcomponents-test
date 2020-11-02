function CallWebApi(){
    var customer = new Customer('admin', 'admin', 'http://nixtst01:15000/rest/authenticate')
    var request = new XMLHttpRequest()
    request.open('GET', customer.url, false, customer.username, customer.username);
    //request.setRequestHeader('Authorization', authenticateUser('admin', 'admin'));
    //request.setRequestHeader("Accept", "application/xml");
    //request.setRequestHeader('Access-Control-Allow-Credentials',true);
        
    request.send();
    alert(request.status);
    console.log(request.responseText);
    console.log("hello");
}
    
function authenticateUser(user, password) {
    var token = user + ":" + password;

    // Should i be encoding this value????? does it matter???
    // Base64 Encoding -> btoa
    var hash = btoa(token);

    return "Basic " + hash;
}
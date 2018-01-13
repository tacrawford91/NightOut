// Initialize Firebase
var config = {
    apiKey: "AIzaSyBMPRyBKIBX_3MQAF0oFP8tUlOw0nU0Yn4",
    authDomain: "project1-d2ee8.firebaseapp.com",
    databaseURL: "https://project1-d2ee8.firebaseio.com",
    projectId: "project1-d2ee8",
    storageBucket: "project1-d2ee8.appspot.com",
    messagingSenderId: "544845178446"
  };
  firebase.initializeApp(config);


  //set up query url
  var userCity = "chicago";
  var userDate ="2018-01-20T15:00:00Z"
  var endDate = "2018-01-21T15:00:00Z"
  var budget = 100;
  var tmAPIKey = "azBYRomG6It2EA4V0vjcXjBjD9vYNY1b"
  var queryOneURL = `https://app.ticketmaster.com/discovery/v2/events.json?city=${userCity}&startDateTime=${userDate}&endDateTime=${endDate}&apikey=${tmAPIKey}`
  var eventID =  "vv178ZfYGkn1XoB7";
  var queryTwoURL = `https://app.ticketmaster.com/commerce/v2/events/${eventID}/offers.json?apikey=${tmAPIKey}`
  //make api call
$.ajax({
  url: queryOneURL,
  method: "GET"
}) .done(function(response1){
  //generate image for each response1

  // response1._embedded.events.length
//  console.log(response1._embedded.events[0]);
    for (var i = 0; i < 1; i++) {
      eventID = response1._embedded.events[i].id
      console.log(response1._embedded.events[i].name + response1._embedded.events[i].dates.start.localDate + "      " + eventID)
  }
  })

  $.ajax({
    url: queryTwoURL,
    method: "GET"
  }) .done(function(response2){
    console.log (`event price = ${response2.prices.data[0].attributes.value}`)
})


//   //set up query url
//   var queryTwoURL;
//   //make api call
// $.ajax({
//   url: queryTwoURL,
//   method: "GET"
// }) .done(function(response1){
//   //generate image for each response1
//  console.log(response1.data);
//   }
// });
//user inputs
// $("#budget-input")
// $("#date-input")
// $("#budget-input")
// $("#zip-input")

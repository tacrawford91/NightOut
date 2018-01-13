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

  //set db varible 
  var database = firebase.database();
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

  // 
//  console.log(response1._embedded.events[0]);
    for (var i = 0; i < response1._embedded.events.length; i++) {
      var eventID = response1._embedded.events[i].id
      var eventName = response1._embedded.events[i].name;
      var eventDate = response1._embedded.events[i].dates.start.localDate;

      console.log(response1._embedded.events[i].name + response1._embedded.events[i].dates.start.localDate + "      " + eventID)
      database.ref(`search${i}`).set ({
        name: eventName,
        eventDate: eventDate,
        eventID: eventID
      })
      }
      
  })

//Code Example of getting id from database, ajax call2 to get price, and then add back to db

  $.ajax({
    url: queryTwoURL,
    method: "GET"
  }) .done(function(response2){
    for (var j = 0; j < response2._embedded.events.length; j++) {
    console.log (`event price = ${response2.prices.data[j].attributes.value}`)
    }
})



//user inputs
// $("#budget-input")
// $("#date-input")
// $("#budget-input")
// $("#zip-input")

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
  var tmAPIKey = "wUcrA6tbANpAMWxRSlf4FNsKsWLbgzhG"
//wUcrA6tbANpAMWxRSlf4FNsKsWLbgzhG - TROY api KEY
//azBYRomG6It2EA4V0vjcXjBjD9vYNY1b - Shawn api KEY
  var queryOneURL = `https://app.ticketmaster.com/discovery/v2/events.json?city=${userCity}&startDateTime=${userDate}&endDateTime=${endDate}&size=50&apikey=${tmAPIKey}`
  var eventID =  "vv178ZfYGkn1XoB7";
  var searchNumber = 0;
  var eventIDArray = [];
  var eventPriceArray = [];
  var eventPriceObjectArray = [];
  var noPriceObjectArray = [];
  var eventPriceCounter = 0


$.ajax({
  url: queryOneURL,
  method: "GET"
}) .done(function(response1){

//  console.log(response1._embedded.events[0]);
    for (var i = 0; i < response1._embedded.events.length; i++) {
      searchNumber++
      var eventID = response1._embedded.events[i].id
      eventIDArray.push(eventID);
      var eventName = response1._embedded.events[i].name;
      var eventDate = response1._embedded.events[i].dates.start.localDate;
      console.log(response1._embedded.events[i].name + response1._embedded.events[i].dates.start.localDate + "      " + eventID)
      database.ref(`search/${eventID}`).set ({
        name: eventName,
        eventDate: eventDate,
        eventID: eventID
      })
    } 
  })

  database.ref(`search`).on("child_added", function(snapshot) {
      if (snapshot.val() == null) {
    return;
}
  var eventIDSearch = snapshot.val().eventID;
  var queryTwoURL = `https://app.ticketmaster.com/commerce/v2/events/${eventIDSearch}/offers.json?apikey=${tmAPIKey}`
    $.ajax({
      url: queryTwoURL,
      method: "GET"
    }) .done(function(response2){
      //grab good responses and update db price, push into priced array and sort.
      database.ref(`search/${eventIDSearch}`).update({price:Number(response2.prices.data[0].attributes.value)})
      //create div for each and add to html
      eventPriceObjectArray.push({
        eventName: snapshot.val().name,
        eventDate: snapshot.val().eventDate,
        price: Number(response2.prices.data[0].attributes.value)
      })
      eventPriceCounter++
      eventPriceObjectArray.sort(function(a,b) {
        return a.price-b.price
      })
    })
    .fail(function(){
      noPriceObjectArray.push({
        eventName: snapshot.val().name,
        eventDate: snapshot.val().eventDate
      })
    })   
  });










//user inputs
// $("#budget-input")
// $("#date-input")
// $("#budget-input")
// $("#zip-input")

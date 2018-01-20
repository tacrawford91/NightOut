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
  // var userDate ="2018-01-27T15:00:00Z"
  var userDate;
  var endDate;
  var budget = 100;

  
  var tmAPIKey = "azBYRomG6It2EA4V0vjcXjBjD9vYNY1b"
  //wUcrA6tbANpAMWxRSlf4FNsKsWLbgzhG - TROY api KEY
  //azBYRomG6It2EA4V0vjcXjBjD9vYNY1b - Shawn api KEY
  var queryOneURL = `https://app.ticketmaster.com/discovery/v2/events.json?city=${userCity}&startDateTime=${userDate}&endDateTime=${endDate}&size=20&apikey=${tmAPIKey}`
  var eventID =  "vv178ZfYGkn1XoB7";
  var searchNumber = 0;
  var eventIDArray = [];
  var eventPriceArray = [];
  var eventPriceObjectArray = [];
  var noPriceObjectArray = [];
  var eventPriceCounter = 0;
  var htmladded = false 
  
  
  database.ref().set("");

//===================================================================
//===================================================================

// function pleaseGodLetItWork() {
 
// };
// });


  
  
  $(".searchBtn").on("click", function(event){
  database.ref(`search`).off("child_added")
      searchNumber = 0;
      eventIDArray = [];
      eventPriceArray = [];
      eventPriceObjectArray = [];
      noPriceObjectArray = [];
      eventPriceCounter = 0;
      htmladded = false 

      database.ref().set("");
      event.preventDefault();
      userDateInput = $("#date").val();
      userDate = userDateInput + "T17:00:00Z";
      endDate = userDateInput + "T23:59:59Z";
      queryOneURL = `https://app.ticketmaster.com/discovery/v2/events.json?city=${userCity}&startDateTime=${userDate}&endDateTime=${endDate}&size=50&apikey=${tmAPIKey}`
      console.log(userDate);
      console.log(endDate);
      // pleaseGodLetItWork();
         
    $.ajax({
      url: queryOneURL,
      method: "GET"
    }) .done(function(response1){
  
  //  console.log(response1._embedded.events[0]);
    for (var i = 0; i < response1._embedded.events.length; i++) {
      searchNumber++
       //event ID
      var eventID = response1._embedded.events[i].id
      eventIDArray.push(eventID);
      //event name
      var eventName = response1._embedded.events[i].name;
      //event date
      var eventDate = response1._embedded.events[i].dates.start.localDate;
      // event image
      var eventImage = response1._embedded.events[i].images[6].url;
      //Name of the venue
      var venueName = response1._embedded.events[i]._embedded.venues[0].name;
      //Coordinates: location returns an object with longitude and latitude properties
      var eventCoordinates = response1._embedded.events[i]._embedded.venues[0].location;
      //address of event
      var eventAddress = response1._embedded.events[i]._embedded.venues[0].address.line1;
      //city
      var eventCity = response1._embedded.events[i]._embedded.venues[0].city.name;
      //state
      var eventState = response1._embedded.events[i]._embedded.venues[0].state.name;
      //Postal Code
      var eventZip = response1._embedded.events[i]._embedded.venues[0].postalCode;
  
      var eventLocation = {
        venue: venueName,
        coordinates: eventCoordinates,
        address: eventAddress,
        city: eventCity,
        state: eventState,
        zip: eventZip
      };
      //console.log('run')
      database.ref(`search/${eventID}`).set ({
        name: eventName,
        eventDate: eventDate,
        eventID: eventID,
        eventImage: eventImage,
        eventLocation: eventLocation
      })
    }
  })


  database.ref(`search`).on("child_added", function(snapshot) {
      //console.log('child')
    if (snapshot.val() == null) {
    return;
}
  var eventIDSearch = snapshot.val().eventID;
  //console.log(eventIDSearch)
  var queryTwoURL = `https://app.ticketmaster.com/commerce/v2/events/${eventIDSearch}/offers.json?apikey=${tmAPIKey}`
    $.ajax({
      url: queryTwoURL,
      method: "GET"
    }) .done(function(response2){
      //grab good responses and update db price, push into priced array and sort.
      database.ref(`search/${eventIDSearch}`).update({price:Number(response2.prices.data[0].attributes.value)})


      eventPriceObjectArray.push({
        eventName: snapshot.val().name,
        eventDate: snapshot.val().eventDate,
        price: Number(response2.prices.data[0].attributes.value),
        eventImage: snapshot.val().eventImage
      })
      eventPriceCounter++
      eventPriceObjectArray.sort(function(a,b) {
        return a.price-b.price
      })
    })
    .fail(function(){
      database.ref(`search/${eventIDSearch}`).update({price: "No price!"})
      
      noPriceObjectArray.push({
        eventName: snapshot.val().name,
        eventDate: snapshot.val().eventDate,
        eventImage: snapshot.val().eventImage
      })
    })

  // database.ref("search").on("child_changed", function() {
  //   if (snapshot.val() == null) {
  //     return;
  // }
  //   if (eventPriceObjectArray.length + noPriceObjectArray.length === eventIDArray.length && htmladded === false) {
  //     //create html
  //     eventPriceObjectArray.forEach(function(element){
  //       //create content div
  //       var priceContent = $("<p>").html(`event name: ${element.eventName} ---- price: ${element.price}`)
  //       $(".priced").append(priceContent);
  //     })
  //     htmladded = true
  //   } else {
  //     //show loading, finding the best eventss
  //   }  
  // })
 
  });
 

  $(document).ajaxStop(function() {
      // if  (eventPriceObjectArray.length + noPriceObjectArray.length === eventIDArray.length && htmladded === false) {
        //create html
        eventPriceObjectArray.forEach(function(element){
          //create content div
          var priceContent = $("<p>").html(`<img src="${element.eventImage}"><h1>---- event name: ${element.eventName} ---- price: ${element.price} --</h1)`)
          $(".priced").append(priceContent);
        })
        htmladded = true
        // } else {
        //  console.log("NOOOOO HTMLLLLLL") //show loading, finding the best eventss

        // }  
  })
  });

  //===================================================================
  //===================================================================

  
// console.log(response1._embedded.events[i].name + response1._embedded.events[i].dates.start.localDate + "      " + eventID)

  
  
  




//user inputs
// $("#budget-input")
// $("#date-input")
// $("#budget-input")
// $("#zip-input")

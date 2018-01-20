{/* <div id="map"></div>

<style>
  #map {
      height: 400px;
      width: 100%;
  }
</style> */}

//===================================================================
//===================================================================


// Initialize Firebase
//REAL PROJECT FIREBASE
// var config = {
//     apiKey: "AIzaSyBMPRyBKIBX_3MQAF0oFP8tUlOw0nU0Yn4",
//     authDomain: "project1-d2ee8.firebaseapp.com",
//     databaseURL: "https://project1-d2ee8.firebaseio.com",
//     projectId: "project1-d2ee8",
//     storageBucket: "project1-d2ee8.appspot.com",
//     messagingSenderId: "544845178446"
//   };

var config = {
  apiKey: "AIzaSyAQKnxSSrY9lj0x9FswEP-p3etJW1i212E",
  authDomain: "testproject-78bfd.firebaseapp.com",
  databaseURL: "https://testproject-78bfd.firebaseio.com",
  projectId: "testproject-78bfd",
  storageBucket: "testproject-78bfd.appspot.com",
  messagingSenderId: "265041291051"
};
  firebase.initializeApp(config);

  //set db varible 
  var database = firebase.database();
  // //set up query url
  // var userCity = "chicago";
  // var userDate ="2018-01-20T15:00:00Z"
  // var endDate = "2018-01-21T15:00:00Z"
  // var budget = 100;

  //set up query url
  var userCity = $("#zip").val();
  var userDate = $("#date").val();
  var budget = $("#budget").val();


  $(".searchBtn").on("click", function(event){
    event.preventDefault();
    console.log(userCity);
    console.log(userDate);
    console.log(budget);
  });

  var tmAPIKey = "wUcrA6tbANpAMWxRSlf4FNsKsWLbgzhG"
  var tmAPIKey2 = "hcJu0dpfx8cQR1PDzfetBNqxUXE3otpA";
  //wUcrA6tbANpAMWxRSlf4FNsKsWLbgzhG - TROY api KEY
  //azBYRomG6It2EA4V0vjcXjBjD9vYNY1b - Shawn api KEY
  // hcJu0dpfx8cQR1PDzfetBNqxUXE3otpA - Shawn api KEY #2
  // var queryOneURL = `https://app.ticketmaster.com/discovery/v2/events.json?city=${userCity}&startDateTime=${userDate}&endDateTime=${endDate}&size=2&apikey=${tmAPIKey2}`
  var queryOneURL = `https://app.ticketmaster.com/discovery/v2/events.json?city=${userCity}&startDateTime=${userDate}&size=2&apikey=${tmAPIKey2}`

  var eventID =  "vv178ZfYGkn1XoB7";
  var searchNumber = 0;
  var eventIDArray = [];
  var eventPriceArray = [];
  var eventPriceObjectArray = [];
  var noPriceObjectArray = [];
  var eventPriceCounter = 0

  // https://app.ticketmaster.com/discovery/v2/events.json?city=chicago&startDateTime=2018-01-20T15:00:00Z&endDateTime=2018-01-21T15:00:00Z&size=50&apikey=azBYRomG6It2EA4V0vjcXjBjD9vYNY1b

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

      console.log(response1._embedded.events[i].name + "      " + response1._embedded.events[i].dates.start.localDate + "      " + eventID)
      database.ref(`search/${eventID}`).set ({
        name: eventName,
        eventDate: eventDate,
        eventID: eventID,
        eventLocation: eventLocation
      });
    } 
  });

  database.ref(`search`).on("child_added", function(snapshot) {
      if (snapshot.val() == null || snapshot.val() == undefined) {
    return;
}
  var eventIDSearch = snapshot.val().eventID;
  var queryTwoURL = `https://app.ticketmaster.com/commerce/v2/events/${eventIDSearch}/offers.json?apikey=${tmAPIKey2}`

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




var query = database.ref("search").orderByKey();
query.once("value")
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      // key will be "ada" the first time and "alan" the second time
      var key = childSnapshot.key;
      // childData will be the actual contents of the child
      var childData = childSnapshot.val();
      console.log(key);
      console.log(childData);

  });
});






//Google Maps API Key -Shawn
// AIzaSyAhEbzeYarWUO61Vc1RyoKDnIDvCZ6rmzU
 
function initMap() {
  var options = {
    zoom: 12,
    center: {lat: 41.8781, lng: -87.6298}
  }
  
  var map = new google.maps.Map(document.getElementById('map'), options);

  var marker = new google.maps.Marker({
    position: {lat: 41.88124412, lng: -87.67427375},
    // position: {lat: 41.8781, lng: -87.6298},
    map: map 
  })
};

//Google Maps Geocoding link w/ API key (address --> coordinates)
// "https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyAhEbzeYarWUO61Vc1RyoKDnIDvCZ6rmzU"

//Reverse Geocoding link w/ API key (coordinates --> address)
// "https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY"



//Each generated panel in the results page should have its own unique identifier 
//either an ID or Class. On clicking each panel, it will open up and show the content
//price, address, venue, link to ticketmaster
//On clicking the panel, a function will fire that generates the google map from their api
//that populates the unique panels latitude and longitude coordinates


  
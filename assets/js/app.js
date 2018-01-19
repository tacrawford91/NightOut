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
  var userDate ="2018-01-27T15:00:00Z"
  var endDate = "2018-01-28T15:00:00Z"
  var budget = 100;
  var tmAPIKey = "azBYRomG6It2EA4V0vjcXjBjD9vYNY1b"
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
  var htmladded = false 

  
  database.ref().set("");




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
      var eventImage = response1._embedded.events[i].images[6].url;

      // console.log(response1._embedded.events[i].name + response1._embedded.events[i].dates.start.localDate + "      " + eventID)
      database.ref(`search/${eventID}`).set ( {
        name: eventName,
        eventDate: eventDate,
        eventID: eventID,
        eventImage: eventImage
      })
    } 
  }).then(function(){ database.ref(`search`).on("child_added", function(snapshot) {
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

    //html function
  });

  database.ref("search").child().on("child_changed", function() {
    if (snapshot.val() == null) {
      return;
  }
    if (eventPriceObjectArray.length + noPriceObjectArray.length === eventIDArray.length && htmladded === false) {
      //create html
      eventPriceObjectArray.forEach(function(element){
        //create content div
        var priceContent = $("<p>").html(`event name: ${element.eventName} ---- price: ${element.price}`)
        $(".priced").append(priceContent);
      })
      htmladded = true
    } else {
      //show loading, finding the best eventss
    }  
  })




  });
})

  $(document).ajaxStop(function() {
      if  (eventPriceObjectArray.length + noPriceObjectArray.length === eventIDArray.length && htmladded === false) {
        //create html
        eventPriceObjectArray.forEach(function(element){
          //create content div
          var priceContent = $("<p>").html(`<img src="${element.eventImage}"><h1>---- event name: ${element.eventName} ---- price: ${element.price} --</h1)`)
          $(".priced").append(priceContent);
        })
        htmladded = true
        } else {
         console.log("NOOOOO HTMLLLLLL") //show loading, finding the best eventss

        }  
  })




//user inputs
// $("#budget-input")
// $("#date-input")
// $("#budget-input")
// $("#zip-input")

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
  // var queryTwoURL = `https://app.ticketmaster.com/commerce/v2/events/${eventIDtoBePushed}/offers.json?apikey=${tmAPIKey}`
  var eventID =  "vv178ZfYGkn1XoB7";
  var searchNumber = 0;
  var eventIDArray = [];
  var eventPriceArray = [];



//PREVIOUS TRYS KEEP FOR REFERENCE
//   //make api call
// $.ajax({
//   url: queryOneURL,
//   method: "GET"
// }) .done(function(response1){
//   //generate image for each response1
//   //increment search number
//   searchNumber++
// //  console.log(response1._embedded.events[0]);
//     for (var i = 0; i < response1._embedded.events.length; i++) {
//       var eventID = response1._embedded.events[i].id
//       var eventName = response1._embedded.events[i].name;
//       var eventDate = response1._embedded.events[i].dates.start.localDate;
//       console.log(response1._embedded.events[i].name + response1._embedded.events[i].dates.start.localDate + "      " + eventID)
//       database.ref(`search/event${i}`).set ({
//         name: eventName,
//         eventDate: eventDate,
//         eventID: eventID
//       })
//     } 
//   })



//must set search results to be keys, as to access them as a array
// database.ref(`search`).on("value", function(snapshot) {
//   if (snapshot.val() == null) {
//     return;
// }
//   var dbEventIDs = snapshot.val();
//   var keys = Object.keys(dbEventIDs);
//   for (var j = 0; j < keys.length; j++) {
//       var aKey = keys[j];
//       // console.log(dbEventIDs[aKey].eventID)
//       var eventIDtoBePushed = dbEventIDs[aKey].eventID
//       eventIDArray.push(eventIDtoBePushed);
//       // database.ref(`search/event${j}`).update({event2: eventIDtoBePushed});
//     }
// })


// database.ref("search").on("value", function() {
//   // eventIDArray.forEach(function(element) {
//     for(var j = 0; j < eventIDArray.length; j++){
//   var queryTwoURL = `https://app.ticketmaster.com/commerce/v2/events/${eventIDArray[j]}/offers.json?apikey=${tmAPIKey}`
//         $.ajax({
//           url: queryTwoURL,
//           method: "GET"
//         }) .done(function(response2){
//           // console.log (`event price = ${response2.prices.data[element].attributes.value}`)
//           console.log(response2.prices.data[0].attributes.value)
//           var eventPrice = response2.prices.data[0].attributes.value
//           eventPriceArray.push(eventprice);
//           // database.ref(`search/event${j}`).update({eventPrice: eventPrice})
//           })
//     }
// })

//  database.ref("search/event9").on("value", function(snapshot) {
//    for(var j = 0; j < eventIDArray.length; j++){
//     console.log("I FIRED")
//     var queryTwoURL = `https://app.ticketmaster.com/commerce/v2/events/${eventIDArray[j]}/offers.json?apikey=${tmAPIKey}`
//           $.ajax({
//             url: queryTwoURL,
//             method: "GET"
//           }) .done(function(response2){
//             // console.log (`event price = ${response2.prices.data[element].attributes.value}`)
//             console.log(response2.prices.data[0].attributes.value) 
//             // if(typeof response2.errors[0].status === "400") {
//             //     eventPriceArray.push("");
//             // } else 
//             if (typeof response2.prices.data[0].attributes.value !== "string") {
//                  eventPriceArray.push("");
//             } else { 
//             eventPriceArray.push(response2.prices.data[0].attributes.value);
//             // database.ref(`search/event${j}`).update({eventPrice: eventPrice})
//             }
//           })
//         }
//       })
 //END OF PREVIOUS TRYS    
//END OFPREVIOUS TRYS
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
      // console.log (`event price = ${response2.prices.data[element].attributes.value}`)
      console.log(database.ref(`search/${eventIDSearch}/name`) + "equals "+ response2.prices.data[0].attributes.value) 
      database.ref(`search/${eventIDSearch}`).update({price:Number(response2.prices.data[0].attributes.value)})
      //create div for each and add to html
      // var resultsDiv = $("<div>").html(`event name:${snapshot.val().name}  <br>  event price:$${Number(response2.prices.data[0].attributes.value)}`)
      // $(".row").append(resultsDiv);
    })
    // eventIDArray.forEach( function(element){
    //   console.log("SORT IS WORKINGGGG")
    //   database.ref(`search/${element}`).orderByChild(`price`);
  // })
})

database.ref("search").on("child_added", function(){
  eventIDArray.forEach( function(element){
  database.ref(`search/${element}`).orderByChild(`price`);
  console.log("SORT IS WORKINGGGG")
  })
})


// database.ref(`search`).on("child_changed", function() {
//   eventIDArray.forEach( function(element){
//     console.log("SORT IS WORKINGGGG")
//     database.ref(`search/${element}`).orderByChild("price");
//   })
// })


        





//user inputs
// $("#budget-input")
// $("#date-input")
// $("#budget-input")
// $("#zip-input")

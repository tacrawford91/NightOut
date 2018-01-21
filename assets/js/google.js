
//Google Maps API Key -Shawn
// AIzaSyAhEbzeYarWUO61Vc1RyoKDnIDvCZ6rmzU

var latitude = $('#google-map').data('latitude');
var longitude = $('#google-map').data('longitude');
function initialize_map() {
  var myLatlng = new google.maps.LatLng(latitude,longitude);
  var mapOptions = {
    zoom: 14,
    scrollwheel: false,
    disableDefaultUI: true,
    center: myLatlng
  };
  var map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
  var contentString = '';
  var infowindow = new google.maps.InfoWindow({
    content: '<div class="map-content"><ul class="address">' + $('.address').html() + '</ul></div>'
  });
  
  var marker = new google.maps.Marker({
    position: myLatlng,
    map: map
  });
  
  
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });
}

  initialize_map();
  $('#map').on('hidden.bs.collapse', function () {
    initialize_map();
  })
  $('#map').on('shown.bs.collapse', function () {
    initialize_map(); 
  })
  
google.maps.event.addDomListener(window, 'resize', function() {
   
  });




//Google Maps Geocoding link w/ API key (address --> coordinates)
// "https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyAhEbzeYarWUO61Vc1RyoKDnIDvCZ6rmzU"

//Reverse Geocoding link w/ API key (coordinates --> address)
// "https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY"



//Each generated panel in the results page should have its own unique identifier 
//either an ID or Class. On clicking each panel, it will open up and show the content
//price, address, venue, link to ticketmaster
//On clicking the panel, a function will fire that generates the google map from their api
//that populates the unique panels latitude and longitude coordinates


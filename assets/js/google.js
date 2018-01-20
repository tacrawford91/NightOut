{/* <div id="map"></div>

<style>
  #map {
      height: 400px;
      width: 100%;
  }
</style> */}

//===================================================================
//===================================================================

  
  
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

  $("#accordion").on("click", function () {
    initMap();
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
  
  
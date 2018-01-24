
//Google Maps API Key -Shawn
// AIzaSyAhEbzeYarWUO61Vc1RyoKDnIDvCZ6rmzU

    /*
     *  render_map
     *
     *  This function will render a Google Map onto the selected jQuery element
     *
     *  @type	function
     *  @date	8/11/2013
     *  @since	4.3.0
     *
     *  @param	$el (jQuery element)
     *  @return	n/a
     */
    var map;

    function initMap($el) {

        // var
        var $markers = $el.find('.marker');

        var myLatlng = new google.maps.LatLng(latitude,longitude);

        // vars
        var args = {
            zoom: 14,
            scrollwheel: false,
            draggable: false,
            center: myLatlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
            
        };

        // create map	        	
        map = new google.maps.Map($el[0], args);

        // add a markers reference
        map.markers = [];

        // add markers
        $markers.each(function () {

            add_marker($(this), map);

        });

        // center map
        center_map(map);
        return map;
    }

    /*
     *  add_marker
     *
     *  This function will add a marker to the selected Google Map
     *
     *  @type	function
     *  @date	8/11/2013
     *  @since	4.3.0
     *
     *  @param	$marker (jQuery element)
     *  @param	map (Google Map object)
     *  @return	n/a
     */

    function add_marker($marker, map) {

        // var
        var latlng = new google.maps.LatLng($marker.attr('data-latitude'), $marker.attr('data-longitude'));

        // create marker
        var marker = new google.maps.Marker({
            position: latlng,
            map: map
        });

        // add to array
        map.markers.push(marker);

        // if marker contains HTML, add it to an infoWindow
        if ($marker.html()) {
            // create info window
            var infowindow = new google.maps.InfoWindow({
                content: $marker.html()
            });

            // show info window when marker is clicked
            google.maps.event.addListener(marker, 'click', function () {

                infowindow.open(map, marker);

            });
        }

    }

    /*
     *  center_map
     *
     *  This function will center the map, showing all markers attached to this map
     *
     *  @type	function
     *  @date	8/11/2013
     *  @since	4.3.0
     *
     *  @param	map (Google Map object)
     *  @return	n/a
     */

    function center_map(map) {

        // vars
        var bounds = new google.maps.LatLngBounds();

        // loop through all markers and create bounds
        $.each(map.markers, function (i, marker) {

            var latlng = new google.maps.LatLng(marker.position.lat(), marker.position.lng());

            bounds.extend(latlng);

        });

        // only 1 marker?
        if (map.markers.length == 1) {
            // set center of map
            map.setCenter(map.markers[0].getPosition());
            map.setZoom(15);
        } else {
            // fit to bounds
            map.fitBounds(bounds);
        }

    }

    /*
     *  document ready
     *
     *  This function will render each map when the document is ready (page has loaded)
     *
     *  @type	function
     *  @date	8/11/2013
     *  @since	5.0.0
     *
     *  @param	n/a
     *  @return	n/a
     */

    $(document).ready(function () {
        var maps =[];
        $('.map').each(function (i,val) {
            console.log(i+" ,val:"+val);
            maps.push(initMap($(this)));
        });
        $(function () {
            $(".map-button").accordion({
                collapsible: true,
                activate: function (event, ui) {
                    for (var i=0;i<maps.length;i++) {
                    google.maps.event.trigger(maps[i], "resize");
                    center_map(maps[i]);
                    }
                }
            });
        });
    });

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


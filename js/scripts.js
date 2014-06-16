/* google maps */
function initialize() {
	var var_location = new google.maps.LatLng(42.9633333,-85.6680556);
	
	roadAtlasStyles = [ { "featureType": "administrative", "stylers": [ { "visibility": "off" } ] },{ "featureType": "landscape", "stylers": [ { "visibility": "off" } ] },{ "featureType": "road", "stylers": [ { "visibility": "simplified" }, { "color": "#102E14" } ] },{ "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] },{ "elementType": "labels.text", "stylers": [ { "visibility": "off" } ] },{ } ]
	
	var var_mapoptions = {
	  scrollwheel: false,
	  draggable: false,
	  center: var_location,
	  disableDefaultUI: true,
	  zoom: 12
	};

	var var_map = new google.maps.Map(document.getElementById("map-container"),
		var_mapoptions);
	
	var styledMapOptions = {
                
            };

	var usRoadMapType = new google.maps.StyledMapType(
		roadAtlasStyles, styledMapOptions);

	var_map.mapTypes.set('usroadatlas', usRoadMapType);
	var_map.setMapTypeId('usroadatlas');
	
	var mapText = document.createElement('button');
	mapText.className = "btn btn-info btn-lg";
	mapText.innerHTML = 'Located in West Michigan';
	var mapTextA = document.createElement('a');
	mapTextA.setAttribute('href', "#about");
	mapTextA.appendChild(mapText);
	var_map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(mapTextA);
 
}
google.maps.event.addDomListener(window, 'load', initialize);

/* end google maps */


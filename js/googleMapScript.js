/* google maps */
function initialize() {
	var varLocation = new window.google.maps.LatLng(42.9633333,-85.6680556);
	
	var roadAtlasStyles = [ { "featureType": "administrative", "stylers": [ { "visibility": "off" } ] },{ "featureType": "landscape", "stylers": [ { "visibility": "off" } ] },{ "featureType": "road", "stylers": [ { "visibility": "simplified" }, { "color": "#102E14" } ] },{ "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] },{ "elementType": "labels.text", "stylers": [ { "visibility": "off" } ] },{ } ];
	
	var varMapoptions = {
	  scrollwheel: true,
	  draggable: true,
	  center: varLocation,
	  disableDefaultUI: true,
	  zoom: 12
	};

	var varMap = new window.google.maps.Map(document.getElementById("map-container"), varMapoptions);
	
	var styledMapOptions = {};

	var usRoadMapType = new window.google.maps.StyledMapType(
		roadAtlasStyles, styledMapOptions);

	varMap.mapTypes.set('usroadatlas', usRoadMapType);
	varMap.setMapTypeId('usroadatlas');
	
	var mapText = document.createElement('button');
	mapText.className = "btn btn-info btn-lg";
	mapText.innerHTML = 'Located in West Michigan';
	var mapTextA = document.createElement('a');
	mapTextA.setAttribute('href', "contact.html");
	mapTextA.setAttribute('target', "_self");
	mapTextA.appendChild(mapText);
	varMap.controls[window.google.maps.ControlPosition.BOTTOM_CENTER].push(mapTextA);
}
google.maps.event.addDomListener(window, 'load', initialize);
/* end google maps */
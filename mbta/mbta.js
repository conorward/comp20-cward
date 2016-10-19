/*
Closest MBTA Station
COMP20 Assignment #2
Author: Conor Ward

Script that dislays all MBTA Red Line Stops
*/

/* 
Calulating the Distance Between Two Geopoints via Haversine Formula
This JavaScript implementation is derived from the Haversine Formula on Stasck Overflow
*/
Number.prototype.toRad = function() {
	return this * Math.PI / 180;
}


// Variable declarations
var myLat = 0;
var myLng = 0;
// var myLat = 42.359968;
// var myLng = -71.060093;
var request = new XMLHttpRequest();
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
	zoom: 10, // The larger the zoom number, the bigger the zoom
	center: me,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map;
var marker;
var infowindow = new google.maps.InfoWindow();
redLineStation = {};
redLineStation.name = "";
redLineStation.distance = 1;
redLineStation.lat = 0;
redLineStation.lng = 0;

function init()
{
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	getMyLocation();
}
			
function getMyLocation() {
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
		myLat = position.coords.latitude;
		myLng = position.coords.longitude;
		renderMap();
		});
	}
	else {
		alert("Geolocation is not supported by your web browser.  What a shame!");
		}
	}

function renderMap()
	{
	me = new google.maps.LatLng(myLat, myLng);
				
	// Update map and go there...
	map.panTo(me);
	
	// Create a marker
	marker = new google.maps.Marker({
		position: me,
		title: "Here I Am!"
		});
	marker.setMap(map);
					
	// Open info window on click of marker
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
		});
	}

// Places MBTA Red Line Stations on the map
function displayStations(data) {
	mbtaImage = { // MBTA Red Line station marker icon
		url: 'mbta_logo.png',
		scaledSize: new google.maps.Size(40, 40)
	};

	for (i in redLineStation) {
		st_name = redLineStation[i].properties.Location_Name;
		st_details = redLineStation[i].properties.Details;
		st_coor = redLineStation[i].geometry.coordinates;	
		new_st = new google.maps.LatLng(st_coor[1],st_coor[0]);
		markers = new google.maps.Marker({
			position: new_st,
			title: st_details,
			icon: mbtaImage
		});
		markers.setMap(map);

		// Open info window on click of marker
		google.maps.event.addListener(markers, 'click', function() {
			infowindow.setContent(this.title);
			infowindow.open(map,this);
		});
	}
}
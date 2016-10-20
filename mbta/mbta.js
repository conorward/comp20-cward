/*
Closest MBTA Station
COMP20 Assignment #2
Author: Conor Ward
*/

// Global variable declarations
var map;
var myLocation = {};
var infowindow = new google.maps.InfoWindow;


/* main function which calls the various other functions in the program */
function init () {
	getMyLocation(function () { /* CALLBACK that gets called after user location retrieved */
		createMap();
		createStationMarkers();
		drawPolyline();
	});
}



/* get the users location */
function getMyLocation(callback) {
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			myLocation.lat = position.coords.latitude;
			myLocation.lng = position.coords.longitude;
			callback();
		});
	} else {
		alert("Geolocation is not supported by your web browser.  What a shame!");
		callback();
	}
}

/* creates the map as well as a marker with an info window at my location */
function createMap() {
	var myOptions = {
		zoom: 10, // The larger the zoom number, the bigger the zoom
		center: me,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	/* first, create map and pan to my location */
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	var me = new google.maps.LatLng(myLocation.lat, myLocation.lng)
	map.panTo(me);

	/* then create marker at my location to mark it */
	marker = new google.maps.Marker({
		position: me,
		title: "Here I Am!"
	});
	marker.setMap(map);

	/* Finally, open info window on click of marker */
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});
}

/* draw all the station markers */
function createStationMarkers() {
	mbtaImage = { // MBTA Red Line station marker icon
		url: '/mbta_logo.png',
		scaledSize: new google.maps.Size(40, 40)
	};

	function addInfoWindow(marker) {
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(marker.title);
			infowindow.open(map, marker);
		});
	}

	for (i = 0; i < stops.length; i++) {
		var marker = new google.maps.Marker({
			position: {lat: stops[i].lat, lng: stops[i].lng},
			title: stops[i].name,
			icon: mbtaImage
		});
		marker.setMap(map);
		addInfoWindow(marker);
	}
}

/* Draws the polyline that connects all of the Red Line stations */
function drawPolyline() {
	
	function drawLineBetweenTwoStops(stop1, stop2) {
		stop1 = returnStationLocation(stop1);
		stop2 = returnStationLocation(stop2);
		var coordinates = [
			{lat: stop1.lat, lng: stop1.lng}, 
			{lat: stop2.lat, lng: stop2.lng}
		];

        var mbtaPath = new google.maps.Polyline({
			path: coordinates,
			geodesic: true,
			strokeColor: '#FF0000',
			strokeOpacity: 1.0,
			strokeWeight: 5
        });
		mbtaPath.setMap(map);
	}

	for (var i = 0; i < stopsOrder.length - 1; i++) {
		drawLineBetweenTwoStops(stopsOrder[i], stopsOrder[i+1]);
	}

	for (var i = 0; i < stopsBraintree.length - 1; i++) {
		drawLineBetweenTwoStops(stopsBraintree[i], stopsBraintree[i+1]);	
	}

	for (var i = 0; i < stopsAshmont.length - 1; i++) {
		drawLineBetweenTwoStops(stopsAshmont[i], stopsAshmont[i+1]);
	}  
}

// Hard-coded Red Line station names and coordinates
var stopsOrder = [
	"Alewife", 
	"Davis", 
	"Porter Square", 
	"Harvard Square", 
	"Central Square", 
	"Kendall/MIT", 
	"Charles/MGH",
	"Park Street",
	"Downtown Crossing",
	"South Station",
	"Broadway",
	"Andrew", 
	"JFK/UMass"
];
var stopsBraintree = [
	"JFK/UMass",
	"North Quincy",
	"Wollaston",
	"Quincy Center",
	"Quincy Adams",
	"Braintree"
];
var stopsAshmont = [
	"JFK/UMass",
	"Savin Hill",
	"Fields Corner",
	"Shawmut",
	"Ashmont"
];
var stops = [
	{
		name: "South Station", 
		lat: 42.352271,
		lng: -71.05524200000001
	}, {
		name: "Andrew", 
		lat: 42.330154, 
		lng: -71.057655
	}, {
		name: "Porter Square", 
		lat: 42.3884, 
		lng: -71.11914899999999
	}, {
		name: "Harvard Square", 
		lat: 42.373362, 
		lng: -71.118956
	}, {
		name: "JFK/UMass", 
		lat: 42.320685, 
		lng: -71.052391
	}, {
		name: "Savin Hill", 
		lat: 42.31129, 
		lng: -71.053331
	}, {
		name: "Park Street", 
		lat: 42.35639457, 
		lng: -71.0624242
	}, {
		name: "Broadway", 
		lat: 42.342622, 
		lng: -71.056967
	}, {
		name: "North Quincy", 
		lat: 42.275275, 
		lng: -71.029583
	}, {
		name: "Shawmut", 
		lat: 42.29312583, 
		lng: -71.06573796000001
	}, {
		name: "Davis", 
		lat: 42.39674, 
		lng: -71.121815
	}, {
		name: "Alewife", 
		lat: 42.395428, 
		lng: -71.142483
	}, {
		name: "Kendall/MIT", 
		lat: 42.36249079, 
		lng: -71.08617653
	}, {
		name: "Charles/MGH", 
		lat: 42.361166, 
		lng: -71.070628
	}, {
		name: "Downtown Crossing", 
		lat: 42.355518, 
		lng: -71.060225
	}, {
		name: "Quincy Center", 
		lat: 42.251809, 
		lng: -71.005409
	}, {
		name: "Quincy Adams", 
		lat: 42.233391, 
		lng: -71.007153
	}, {
		name: "Ashmont", 
		lat: 42.284652, 
		lng: -71.06448899999999
	}, {
		name: "Wollaston", 
		lat: 42.2665139, 
		lng: -71.0203369
	}, {
		name: "Fields Corner", 
		lat: 42.300093, 
		lng: -71.061667
	}, {
		name: "Central Square", 
		lat: 42.365486, 
		lng: -71.103802
	}, {
		name: "Braintree", 
		lat: 42.2078543, 
		lng: -71.0011385
	}
];

// returnStationLocation("Alewife") => { name: "Alewife",  lat: 42.395428, lng: -71.142483 }
function returnStationLocation(stationName) {
	for (i = 0; i < stops.length; i++) {
		if (stops[i].name === stationName) {
			return stops[i];
		}
	}
}

			
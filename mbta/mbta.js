/*
Closest MBTA Station
COMP20 Assignment #2
Author: Conor Ward
*/

// Global variable declarations
var map;
var myLocation = {};
var stop_distances = {};
var current_stop = {};
var infowindow = new google.maps.InfoWindow;
var my_lat = 0;
var my_lng = 0;
closestStop = {};
closestStop.name = "";
closestStop.distance = 1;
closestStop.lat = 0;
closestStop.lng = 0;


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
			my_lat = myLocation.lat;
			myLocation.lng = position.coords.longitude;
			my_lng = myLocation.lng;
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
		zoom: 13, // The larger the zoom number, the bigger the zoom
		center: me,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	/* first, create map and pan to my location */
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	var me = new google.maps.LatLng(myLocation.lat, myLocation.lng)
	map.panTo(me);

	calculateDistance(my_lat,my_lng);

	findClosestStop();
	
	/* then create marker at my location to mark it */
	marker = new google.maps.Marker({
		position: me,
		title: "<div id='infowindow'>" + "Closest Red Line Station: " + closestStop.name +
			"<br />Distance: " + closestStop.distance.toFixed(2) + " miles</div>"
	});
	marker.setMap(map);

	closestPolyline();

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
			current_stop = stops[i];
			upcomingTrains(current_stop);
			infowindow.open(map, marker);
		});
	}

	
	for (i = 0; i < stops.length; i++) {
		var marker = new google.maps.Marker({
			position: {lat: stops[i].lat, lng: stops[i].lng},
			// Before adding the JSON data to the infowindow, this is where I was setting the infowindow content
			// title: "<div id='infowindow'>" + "Station: " + stops[i].name +
			// 	"<br />Distance: " + stop_distances[i].toFixed(2) + " miles</div>",
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

/* Draw a polyline between me and the nearest Red Line station */
function closestPolyline() {
	var closest_coor = [ 
		{lat: my_lat, lng: my_lng},
		{lat: closestStop.lat, lng: closestStop.lng}
	]
	var myPath = new google.maps.Polyline({
			path: closest_coor,
			geodesic: true,
			strokeColor: '#0000FF',
			strokeOpacity: 1.0,
			strokeWeight: 5
    });
	myPath.setMap(map);
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

// returns stop coordinates
function returnStationLocation(stationName) {
	for (i = 0; i < stops.length; i++) {
		if (stops[i].name === stationName) {
			return stops[i];
		}
	}
}


/* 
Calculating the Distance Between Two Geopoints via Haversine Formula 
Thanks to talkol on Stack Overflow for this JavaScript implementation of the Haversine Formula
*/
function calculateDistance(lat,lng) {

	Number.prototype.toRad = function() {
	   return this * Math.PI / 180;
	}

	stop_lat = Number(lat);
	stop_lng = Number(lng);

	var R = 6371; // km 
	var x1 = stop_lat-my_lat;
	var dLat = x1.toRad();  
	var x2 = stop_lng-my_lng;
	var dLon = x2.toRad();  
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
	                Math.cos(my_lat.toRad()) * Math.cos(stop_lat.toRad()) * 
	                Math.sin(dLon/2) * Math.sin(dLon/2);  
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // this is the distance in km

	// Converts km to miles
	mile_distance = d * 0.621371;
}	

/* Finds the Red Line station closest to my current location */
function findClosestStop() {
	for (i = 0; i < stops.length; i++) {
		calculateDistance(stops[i].lat,stops[i].lng);
		stop_distances[i] = mile_distance;
		if (mile_distance < closestStop.distance) {
			closestStop.distance = mile_distance;
			closestStop.name = stops[i].name;
			closestStop.lat = stops[i].lat;
			closestStop.lng = stops[i].lng;
		}
	}
}	

/* Gets the JSON data */
/* Thanks to MikeySkullivan on Stack Overflow for the help */
/* http://stackoverflow.com/questions/12460378/how-to-get-json-from-url-in-javascript */
function upcomingTrains(stop) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", "http://enigmatic-earth-12119.herokuapp.com/redline.json", true);
    xhr.responseType = "json";
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        parse_json(xhr.response, stop);
      } else {
      }
    };
    xhr.send();
};

/* Parses JSON and prints upcoming train times to infowindow */
function parse_json(json_data, stop) {
		var trips = stop.name;
		for (i in json_data.TripList.Trips) {
			for (j in json_data.TripList.Trips[i].Predictions) {
				if (json_data.TripList.Trips[i].Predictions[j].Stop == stop.name) {
					trips += "<p> Destination: " + json_data.TripList.Trips[i].Destination + "</p>";
					trips += "<p> ETA: " + json_data.TripList.Trips[i].Predictions[j].Seconds + " seconds </p>";
			}
		}
		infowindow.setContent(trips);
	}
	
}
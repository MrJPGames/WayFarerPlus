//For cirlce mod
var lowDistCircle, longDistCirle;

function setupMapMods(){
	var lat = nSubCtrl.pageData.lat;
	var lng = nSubCtrl.pageData.lng;
	if (settings["revPreciseMarkers"])
		addPreciseMarkers();
	if (settings["revLowestDistCircle"]){
		addLowestDistCircle(nSubCtrl.map, lat, lng);
		lowDistCircle = addLowestDistCircle(nSubCtrl.map2, lat, lng);
			hookLowestDistLocEdit();
	}
	if (settings["revAccessDistCircle"]){
		addAccessDistCircle(nSubCtrl.map, lat, lng);
		longDistCirle = addAccessDistCircle(nSubCtrl.map2, lat, lng);
			hookLongDistLocEdit();
	}
	if (settings["revMinDistCircle"]){
		hookMinDistCircle();
	}
	if (settings["revLowestDistCircle"] || settings["revAccessDistCircle"] || settings["revMap2ZoomLevel"] !== "-1")
		hookResetMapFuncs();

	if (settings["revS2Cell"] !== "-1" || settings["revSecondS2Cell"] !== "-1"){
		if (nSubCtrl.pageData.type === "NEW") {
			addS2Overlay(nSubCtrl.map, settings["revS2Cell"], settings["revS2Color"], settings["revSecondS2Cell"], settings["revS2SecondColor"]);
			addS2Overlay(nSubCtrl.map2, settings["revS2Cell"], settings["revS2Color"], settings["revSecondS2Cell"], settings["revS2SecondColor"]);
			if (settings["revHighlightCell"]) {
				addS2Highlight(nSubCtrl.map, settings["revS2Cell"], settings["revS2Color"], nSubCtrl.pageData.lat, nSubCtrl.pageData.lng);
				addS2Highlight(nSubCtrl.map2, settings["revS2Cell"], settings["revS2Color"], nSubCtrl.pageData.lat, nSubCtrl.pageData.lng);
			}
		}

		if (nSubCtrl.pageData.type === "EDIT") {
			addS2Overlay(nSubCtrl.locationEditsMap, settings["revS2Cell"], settings["revS2Color"], settings["revSecondS2Cell"], settings["revS2SecondColor"]);
			if (settings["revHighlightCell"]) {
				addS2Highlight(nSubCtrl.locationEditsMap, settings["revS2Cell"], settings["revS2Color"], nSubCtrl.pageData.lat, nSubCtrl.pageData.lng);
			}
		}
	}

    if (settings["revEditOrigLoc"] && nSubCtrl.pageData.type === "EDIT" && nSubCtrl.needsLocationEdit && !settings["revPreciseMarkers"])
    	addOrigLocation(nSubCtrl.locationEditsMap);
	if (settings["ctrlessZoom"])
		mapsRemoveCtrlToZoom();
	if (settings["revBigMaps"])
		makeMapsBigger();
	if (settings["rev3DMap"])
		makeMap3D();

	if (nSubCtrl.pageData.type === "NEW") {
		if (settings["revMap2ZoomLevel"] !== "-1")
			zoomMap2();
		if (settings["revDupeMapZoomLevel"] !== "-1")
			zoomDupeMap();
		if (settings["revTransparentMarker"])
			makeMarkersTransparent();
	}
}

function addPreciseMarkers(){
	if (nSubCtrl.needsLocationEdit){
	    var nSubCtrlScope = angular.element(document.getElementById("NewSubmissionController")).scope();
		var editMarkers = nSubCtrlScope.getAllLocationMarkers();
		function setEditMarkersIcon(markers) {
			for (var i = 0; i < editMarkers.length; i++) {
				editMarkers[i].setIcon(extURL + "assets/precise_map-spot.svg");
				if (settings["revEditOrigLoc"] && editMarkers[i].position.lat()  == nSubCtrl.pageData.lat && editMarkers[i].position.lng() == nSubCtrl.pageData.lng){
					editMarkers[i].setIcon(extURL + "assets/precise_custom_map-spot.svg");
				}
			}
		}
		setEditMarkersIcon(editMarkers);
		for (var i = 0; i< editMarkers.length; i++){
			function addMarkerListner(m){
				m.addListener("click", function(){
					var nSubCtrlScope = angular.element(document.getElementById("NewSubmissionController")).scope();
					var editMarkers = nSubCtrlScope.getAllLocationMarkers();
					setEditMarkersIcon(editMarkers);
					m.setIcon(extURL + "assets/precise_green_map-spot.svg");
				});
			}
			addMarkerListner(editMarkers[i]);
		}
	}else{
		//Map1 all excluding "main/current" marker
		var locationMarkers;
		if (nSubCtrl.pageData.type === "NEW"){
			locationMarkers = nSubCtrl.markers;
		}else{
			locationMarkers = nSubCtrl.allLocationMarkers;
		}
	    for (var i = 0; i < locationMarkers.length; i++){
	        locationMarkers[i].setIcon(extURL + "assets/precise_map-spot.svg");
	    }
	 }

	//Do map2 (satelite) markers (by recreating the map as we can't hook nicely)
	function createCustomStreetView() {
		var map2 = new google.maps.Map(document.getElementById("street-view"), {
			tilt: 0,
			center: {
				lat: nSubCtrl.pageData.lat,
				lng: nSubCtrl.pageData.lng
			},
			mapTypeId: "hybrid",
			zoom: 15,
			scaleControl: true,
			mapTypeControl: false
		});
		var marker = new google.maps.Marker({
			map: map2,
			position: {
				lat: parseFloat(nSubCtrl.pageData.lat),
				lng: parseFloat(nSubCtrl.pageData.lng)
			},
			title: nSubCtrl.pageData.title,
			icon: "/img/marker-orange.svg"
		});
		nSubCtrl.originalMap2Marker = marker;
		for (var i = 0; i < nSubCtrl.activePortals.length; i++) {
			var nearby = nSubCtrl.activePortals[i];
			var temp = new google.maps.Marker({
				map: map2,
				position: {
					lat: parseFloat(nearby.lat),
					lng: parseFloat(nearby.lng)
				},
				title: nearby.title,
				icon: extURL + "assets/precise_map-spot.svg"
			})
		}
		var panorama = map2.getStreetView();
		var client = new google.maps.StreetViewService;
		client.getPanoramaByLocation({
			lat: nSubCtrl.pageData.lat,
			lng: nSubCtrl.pageData.lng
		}, 50, function (result, status) {
			if (status === "OK") {
				var point = new google.maps.LatLng(nSubCtrl.pageData.lat, nSubCtrl.pageData.lng);
				var oldPoint = point;
				point = result.location.latLng;
				var heading = google.maps.geometry.spherical.computeHeading(point, oldPoint);
				panorama.setPosition(point);
				panorama.setPov({
					heading: heading,
					pitch: 0,
					zoom: 1
				});
				panorama.setMotionTracking(false);
				panorama.setVisible(true);
				nSubCtrl.imageDate = result.imageDate;
			} else
				;
		});
		nSubCtrl.panorama = panorama;
		nSubCtrl.map2 = map2;
	}

	if (nSubCtrl.pageData.type === "NEW") {
		createCustomStreetView();

		var originalResetStreetView = nSubCtrl.resetStreetView;
		//Hook the reset map2 function
		nSubCtrl.resetStreetView = function () {
			originalResetStreetView(); //Restore original internal state
			createCustomStreetView(); //Change map to our custom map with custom markers!
		}
	}
}



function makeMap3D(){
	var options = {
		tilt: 45
	};
	applyMapOptions(options);
}

function makeMarkersTransparent(){
	nSubCtrl.originalMap2Marker.setOpacity(0.5);
	nSubCtrl.originalMap2Marker.addListener('mouseover', function() {
		nSubCtrl.originalMap2Marker.setOpacity(0);
	});
	nSubCtrl.originalMap2Marker.addListener('mouseout', function() {
		nSubCtrl.originalMap2Marker.setOpacity(0.5);
	});
}

function zoomMap2(){
	var newZoomLevel = parseInt(settings["revMap2ZoomLevel"]);
	nSubCtrl.map2.setZoom(newZoomLevel);
}

function zoomDupeMap(){
	//Wait for load to finish (then the idle event is triggered)
	google.maps.event.addListenerOnce(
		nSubCtrl.map,
		"idle",
		function(){ //On event set zoom level
			//This is to hide the quite jarring animation Google Maps API V3 forcefully plays (make it invisible until "load" is done once more)
			var mapContainer = document.getElementById("map");
			google.maps.event.addListenerOnce(
				nSubCtrl.map,
				"idle",
				function () {
					mapContainer.style.visibility = "";
				}
			);
			mapContainer.style.visibility = "hidden";
			//Change the zoom level
			var newZoomLevel = parseInt(settings["revDupeMapZoomLevel"]);
			nSubCtrl.map.setZoom(newZoomLevel);
		}
	);
}

function hookResetMapFuncs(){
	var lat =  nSubCtrl.pageData.lat;
	var lng = nSubCtrl.pageData.lng;
	let originalResetStreetView = nSubCtrl.resetStreetView;
    nSubCtrl.resetStreetView = function() {
		originalResetStreetView()
		if (settings["revLowestDistCircle"])
			lowDistCircle = addLowestDistCircle(nSubCtrl.map2, lat, lng);
		if (settings["revAccessDistCircle"])
			longDistCirle = addAccessDistCircle(nSubCtrl.map2, lat, lng);
		if (settings["revMap2ZoomLevel"] !== "-1")
			zoomMap2();
		if (settings["revS2Cell"] !== "-1" || settings["revSecondS2Cell"] !== "-1") {
			addS2Overlay(nSubCtrl.map2, settings["revS2Cell"], settings["revS2Color"], settings["revSecondS2Cell"], settings["revS2SecondColor"]);
			if (settings["revHighlightCell"])
				addS2Highlight(nSubCtrl.map2, settings["revS2Cell"], settings["revS2Color"], nSubCtrl.pageData.lat, nSubCtrl.pageData.lng);
		}
		if (settings["revTransparentMarker"])
			makeMarkersTransparent();
    }
}

function addOrigLocation(gMap){
	function setEditMarkersIcon(editMarkers) {
		var oPos = new google.maps.LatLng(nSubCtrl.pageData.lat, nSubCtrl.pageData.lng);
		for (var i = 0; i < editMarkers.length; i++) {
			if (editMarkers[i].position.lat() === oPos.lat() && editMarkers[i].position.lng() === oPos.lng()) {
				editMarkers[i].setIcon(extURL + "assets/custom_map-spot.svg");
			}
		}
	}

	var nSubCtrlScope = angular.element(document.getElementById("NewSubmissionController")).scope();
	var editMarkers = nSubCtrlScope.getAllLocationMarkers();
	setEditMarkersIcon(editMarkers);

    //Persistent:
	for (var i = 0; i< editMarkers.length; i++){
		function addMarkerListner(m){
			m.addListener("click", function(){
				var nSubCtrlScope = angular.element(document.getElementById("NewSubmissionController")).scope();
				var editMarkers = nSubCtrlScope.getAllLocationMarkers();
				setEditMarkersIcon(editMarkers);
				m.setIcon("/img/marker-green.svg");
			});
		}
		addMarkerListner(editMarkers[i]);
	}
}

function mapsRemoveCtrlToZoom(){
	if (nSubCtrl.reviewType === "NEW"){
		mapRemoveCtrlZoom(nSubCtrl.map);
		mapRemoveCtrlZoom(nSubCtrl.map2);
	}
	if (nSubCtrl.reviewType === "EDIT")
		mapRemoveCtrlZoom(nSubCtrl.locationEditsMap);
}

function hookLowestDistLocEdit(){
	if (nSubDS.getNewLocationMarker() === undefined || nSubDS.getNewLocationMarker() ==  null){
		setTimeout(hookLowestDistLocEdit, 500);
		return;
	}
	google.maps.event.addListener(nSubDS.getNewLocationMarker(), 'dragend', function () {
    	lowDistCircle.setCenter(nSubDS.getNewLocationMarker().position)
    });
}

function hookLongDistLocEdit(){
	if (nSubDS.getNewLocationMarker() === undefined || nSubDS.getNewLocationMarker() ==  null){
		setTimeout(hookLongDistLocEdit, 500);
		return;
	}
	google.maps.event.addListener(nSubDS.getNewLocationMarker(), 'dragend', function () {
    	longDistCirle.setCenter(nSubDS.getNewLocationMarker().position)
    });
}

function hookMinDistCircle(){
	if (nSubDS.getNewLocationMarker() === undefined || nSubDS.getNewLocationMarker() ==  null){
		setTimeout(hookMinDistCircle, 500);
		return;
	}
	addMinDistCircle(nSubCtrl.map2, nSubCtrl.pageData.lat, nSubCtrl.pageData.lng);
}

function makeMapsBigger(){
	var dupeCardElem = document.getElementById(divNames.duplicates);
	var accuracyCardElem = document.getElementById(divNames.location);

	dupeCardElem.style.height = "600px";
	accuracyCardElem.style.height = "600px";

	var duplicateMapElem = document.getElementById("map");
	var accuracyMapElem = document.getElementById("street-view");

	duplicateMapElem.style.height = "500px";
	accuracyMapElem.style.height = "100%";
}

function applyMapOptions(options){
	if (nSubCtrl.pageData.type === "NEW"){
		nSubCtrl.map.setOptions(options);
		nSubCtrl.map2.setOptions(options);
	}
	if (nSubCtrl.pageData.type === "EDIT")
		nSubCtrl.locationEditsMap.setOptions(options);
}

document.addEventListener("WFPAllRevHooked", setupMapMods);

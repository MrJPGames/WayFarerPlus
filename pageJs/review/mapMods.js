//For cirlce mod
var lowDistCircle, longDistCirle;

function setupMapMods(){
	if (settings["revLowestDistCircle"]){
		addLowestDistCircle(nSubCtrl.map);
		addLowestDistCircle(nSubCtrl.map2, true);
			hookLowestDistLocEdit();
	}
	if (settings["revAccessDistCircle"]){
		addAccessDistCircle(nSubCtrl.map);
		addAccessDistCircle(nSubCtrl.map2, true);
			hookLongDistLocEdit();
	}
	if (settings["revLowestDistCircle"] || settings["revAccessDistCircle"] || settings["revMap2ZoomLevel"] != -1)
		hookResetMapFuncs();
	if (settings["revS2Cell"] != -1){
		var lat = nSubCtrl.pageData.lat;
	    var lng = nSubCtrl.pageData.lng;

        addS2(nSubCtrl.map, lat, lng, settings["revS2Cell"]);
        addS2(nSubCtrl.map2, lat, lng, settings["revS2Cell"]);
        if (ansCtrl.needsLocationEdit)
        	addS2(nSubCtrl.locationEditsMap, lat, lng, settings["revS2Cell"]);
        hookS2LocEdit();
    }
    if (settings["revEditOrigLoc"] && ansCtrl.needsLocationEdit)
    	addOrigLocation(nSubCtrl.locationEditsMap);
	if (settings["ctrlessZoom"])
		mapsRemoveCtrlToZoom();
	if (settings["revMap2ZoomLevel"] != -1)
		zoomMap2();
	if (settings["revTransparentMarker"])
		makeMarkersTransparent();
	if (settings["revBigMaps"])
		makeMapsBigger();
	if (settings["rev3DMap"]){
		makeMap3D();
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

function hookResetMapFuncs(){
	let originalResetStreetView = nSubCtrl.resetStreetView;
    nSubCtrl.resetStreetView = function() {
		originalResetStreetView()
		if (settings["revLowestDistCircle"])
			addLowestDistCircle(nSubCtrl.map2, true);
		if (settings["revAccessDistCircle"])
			addAccessDistCircle(nSubCtrl.map2, true);
		if (settings["revMap2ZoomLevel"] != -1)
			zoomMap2();
		if (settings["revS2Cell"] != -1)
			addS2(nSubCtrl.map2, nSubCtrl.pageData.lat, nSubCtrl.pageData.lng, settings["revS2Cell"]);
		if (settings["revTransparentMarker"])
			makeMarkersTransparent();
    }
}

function addOrigLocation(gMap){
	var oPos = new google.maps.LatLng(nSubCtrl.pageData.lat, nSubCtrl.pageData.lng);
	
    var nSubCtrlScope = angular.element(document.getElementById("NewSubmissionController")).scope();
	var editMarkers = nSubCtrlScope.getAllLocationMarkers();
    for (var i = 0; i < editMarkers.length; i++){
    	if (editMarkers[i].position.lat() == oPos.lat() && editMarkers[i].position.lng() == oPos.lng()){
        	editMarkers[i].setIcon(extURL + "assets/custom_map-spot.svg");
    	}
    }
}


function addS2(map, lat, lng, lvl){
    var cell = window.S2.S2Cell.FromLatLng({lat: lat, lng: lng}, lvl);

    var cellCorners = cell.getCornerLatLngs();
    cellCorners[4] = cellCorners[0]; //Loop it

    var polyline = new google.maps.Polyline({
        path: cellCorners,
        geodesic: true,
        fillColor: 'grey',
        fillOpacity: 0.2,
        strokeColor: '#00FF00',
        strokeOpacity: 1.0,
        strokeWeight: 1,
        map: map
    });
}

function hookS2LocEdit(){
	if (nSubDS.getNewLocationMarker() == undefined || nSubDS.getNewLocationMarker().position ==  null){
		setTimeout(hookS2LocEdit, 200);
		return;
	}
	google.maps.event.addListener(nSubDS.getNewLocationMarker(), 'dragend', function () {
		var pos = nSubDS.getNewLocationMarker().position;
		addS2(nSubCtrl.map2, pos.lat(), pos.lng(), settings["revS2Cell"]);
	});
}

function mapsRemoveCtrlToZoom(){
	var options = {
		scrollwheel: true,
		gestureHandling: 'greedy'
	};
	applyMapOptions(options);
}

function applyMapOptions(options){
	if (nSubCtrl.reviewType == "NEW"){
		nSubCtrl.map.setOptions(options);
		nSubCtrl.map2.setOptions(options);
	}
	if (nSubCtrl.reviewType == "EDIT")
		nSubCtrl.locationEditsMap.setOptions(options);
}

function addLowestDistCircle(gMap, hook = false){ 
	var latLng = new google.maps.LatLng(nSubCtrl.pageData.lat, nSubCtrl.pageData.lng);
	var c = new google.maps.Circle({
        map: gMap,
        center: latLng,
        radius: 20,
        strokeColor: 'red',
        fillColor: 'red',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillOpacity: 0.2
  	});
	if (hook)
		lowDistCircle = c;
}

function hookLowestDistLocEdit(){
	if (nSubDS.getNewLocationMarker() == undefined || nSubDS.getNewLocationMarker() ==  null){
		setTimeout(hookLowestDistLocEdit, 500);
		return;
	}
	google.maps.event.addListener(nSubDS.getNewLocationMarker(), 'dragend', function () {
    	lowDistCircle.setCenter(nSubDS.getNewLocationMarker().position)
    });
}


function addAccessDistCircle(gMap, hook = false){
	var latLng = new google.maps.LatLng(nSubCtrl.pageData.lat, nSubCtrl.pageData.lng);
	var c = new google.maps.Circle({
        map: gMap,
        center: latLng,
        radius: 40,
        strokeColor: 'green',
        strokeOpacity: 1,
        strokeWeight: 2,
        fillOpacity: 0
  	});
  	if (hook)
  		longDistCirle = c;
}

function hookLongDistLocEdit(){
	if (nSubDS.getNewLocationMarker() == undefined || nSubDS.getNewLocationMarker() ==  null){
		setTimeout(hookLongDistLocEdit, 500);
		return;
	}
	google.maps.event.addListener(nSubDS.getNewLocationMarker(), 'dragend', function () {
    	longDistCirle.setCenter(nSubDS.getNewLocationMarker().position)
    });
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

document.addEventListener("WFPAllRevHooked", setupMapMods);
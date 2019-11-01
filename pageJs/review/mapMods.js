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
}

function zoomMap2(){
	var newZoomLevel = parseInt(settings["revMap2ZoomLevel"]);
	nSubCtrl.map2.setZoom(newZoomLevel);
}

function hookResetMapFuncs(){
	let originalResetStreetView = nSubCtrl.resetStreetView
    nSubCtrl.resetStreetView = function() {
		originalResetStreetView()
		if (settings["revLowestDistCircle"])
			addLowestDistCircle(nSubCtrl.map2, true);
		if (settings["revAccessDistCircle"])
			addAccessDistCircle(nSubCtrl.map2, true);
		if (settings["revMap2ZoomLevel"] != -1)
			zoomMap2();
		if (settings["revS2Cell"] != -1)
			addS2(nSubCtrl.map2, settings["revS2Cell"]);
    }
}

function addOrigLocation(gMap){
	var oPos = new google.maps.LatLng(nSubCtrl.pageData.lat, nSubCtrl.pageData.lng);
	
    var nSubCtrlScope = angular.element(document.getElementById("NewSubmissionController")).scope();
	var editMarkers = nSubCtrlScope.getAllLocationMarkers();
    for (var i = 0; i < editMarkers.length; i++){
    	console.log(editMarkers[i].position.lat(), editMarkers[i].position.lng(), oPos.lat(), oPos.lng(), editMarkers[i].position.lat() == oPos.lat(), editMarkers[i].position.lng() == oPos.lng());
    	if (editMarkers[i].position.lat() == oPos.lat() && editMarkers[i].position.lng() == oPos.lng()){
        	editMarkers[i].setIcon(extURL + "assets/custom_map-spot.svg");
        	console.log(editMarkers[i]);
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

document.addEventListener("WFPAllRevHooked", setupMapMods, false);

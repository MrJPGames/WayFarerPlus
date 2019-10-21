var nSubCtrl, lowDistCircle, longDistCirle, nSubDS;

setupPage();

function setupPage(){
	nSubCtrl = angular.element(document.getElementById("NewSubmissionController")).scope().subCtrl;
	if (nSubCtrl == undefined || nSubCtrl.pageData == undefined || nSubCtrl.pageData.expires == undefined || nSubCtrl.loaded == false){
		//Retry setup later
		setTimeout(setupPage, 100);
	}else{
		console.log("[WayFarer+] NewSubmissionController was hooked to nSubCtrl")
		//Do page setup
		angular.element(document.getElementsByTagName("html")[0]).injector().invoke(["NewSubmissionDataService", function (nSF) {nSubDS = nSF;}]);
		if (settings["revExpireTimer"])
			updateTimer();
		if (nSubCtrl.reviewType == "NEW")
			if (nSubCtrl.pageData.nearbyPortals[0] != undefined)
				checkNearby();
		if (settings["revTranslate"])
			addTranslationButtons();
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
		if (settings["revLowestDistCircle"] || settings["revAccessDistCircle"])
			hookResetMapFuncs();
		if (settings["ctrlessZoom"])
			mapsRemoveCtrlToZoom();
	}
}

function hookResetMapFuncs(){
	let originalResetStreetView = nSubCtrl.resetStreetView
    nSubCtrl.resetStreetView = function() {
		originalResetStreetView()
		if (settings["revLowestDistCircle"])
			addLowestDistCircle(nSubCtrl.map2, true);
		if (settings["revAccessDistCircle"])
			addAccessDistCircle(nSubCtrl.map2, true);
    }
}

function mapsRemoveCtrlToZoom(){
	var options = {
		scrollwheel: true,
		gestureHandling: 'greedy'
	};
	nSubCtrl.map.setOptions(options);
	nSubCtrl.map2.setOptions(options);
}

function addLowestDistCircle(gMap, hook = false){
	var c = new google.maps.Circle({
        map: gMap,
        center: gMap.center,
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
	var c = new google.maps.Circle({
        map: gMap,
        center: gMap.center,
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

function addTranslationButtons(){
	var elems = document.getElementsByClassName("title-description");

	var style = "background-image: url(" + extURL + "assets/translate.svg);"

	for (i = 0; i < elems.length; i++){
		var translateButton = document.createElement("a");
		translateButton.setAttribute("target", "_BLANK");
		translateButton.setAttribute("class", "translateButton");
		translateButton.setAttribute("style", style);
		translateButton.href = "https://translate.google.com/?sl=auto&q=" + encodeURI(elems[i].innerText);

		elems[i].appendChild(translateButton);
	}

	if (nSubCtrl.hasSupportingImageOrStatement){
		var elem = document.getElementsByClassName("supporting-statement-central-field")[0];

		var translateButton = document.createElement("a");
		translateButton.setAttribute("target", "_BLANK");
		translateButton.setAttribute("class", "translateButton");
		translateButton.setAttribute("style", style);
		translateButton.href = "https://translate.google.com/?sl=auto&q=" + encodeURI(elem.innerText);

		elem.children[0].appendChild(translateButton);
	}
}

function updateTimer(){
	var timeElem = document.getElementById("portalReviewTimer");

	var tDiff = nSubCtrl.pageData.expires - Date.now();

	if (tDiff > 0){
		var tDiffMin = Math.floor(tDiff/1000/60);
		var tDiffSec = Math.floor(tDiff/1000 - 60*tDiffMin);

		timeElem.innerText = pad(tDiffMin,2) + ":" + pad(tDiffSec,2);
		//Retrigger function in 1 second
		setTimeout(updateTimer, 1000);
	}else{
		timeElem.innerText = "EXPIRED!";
		timeElem.setAttribute("style", "color: red;");
	}
}

function checkNearby(){
	var d = distance(nSubCtrl.pageData.lat, nSubCtrl.pageData.lng, nSubCtrl.pageData.nearbyPortals[0].lat, nSubCtrl.pageData.nearbyPortals[0].lng);
	if (d < 20){
		console.log("[WayFarer+] WARNING: Portal nomination too close, will not go live!");

		if (settings["revTooCloseWarn"]){
			var warningDiv = document.createElement("div");
			warningDiv.style = "color: red; font-size: 1em; display: block; font-weight: bold;";
			warningDiv.innerText = "NOTE: Wayspot TOO CLOSE to go online in ANY current Niantic game!";

			var ansHeader = document.getElementsByClassName("answer-header")[0];
			ansHeader.parentNode.insertBefore(warningDiv, ansHeader);
		}
	}
}


//Helper functions
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function distance(lat1, lon1, lat2, lon2) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;

		dist = dist * 1609.344 
		return dist;
	}
}
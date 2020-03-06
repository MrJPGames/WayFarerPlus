var nSubCtrl, ansCtrl, nSubDS, whatCtrl, whatCtrlScope;

var hooked = 0;

//Global const for any mod
const divNames = {shouldBePortal: "photo-card", titleAndDescription: "descriptionDiv", duplicates: "duplicates-card", historicOrCultural: "histcult-card", visuallyUnique: "uniqueness-card", safeAccess: "safety-card", location: "map-card", whatIsIt: "what-is-it-card-review", additionalComment: "additional-comments-card", locationAccuracy: "map-card"};

setupPage();
function setupPage(){
	hookSubCtrl();
	hookAnsCtrl();
	hookDataService();
	hookWhatCtrl();
	hookedAll();
}

function onHooked(){
	addDescriptionLink();
	filmStripScroll();
	if (nSubCtrl.reviewType == "NEW")
		if (nSubCtrl.pageData.nearbyPortals[0] != undefined)
			checkNearby();
}
document.addEventListener("WFPAllRevHooked", onHooked);

function hookedAll(){
	if (hooked < 4){
		setTimeout(hookedAll, 50);
	}else{
		console.log("[WayFarer+] Review has hooked all relevant controllers!");

		var modEvent = new Event("WFPAllRevHooked");
        document.dispatchEvent(modEvent);
	}
}

function hookSubCtrl(){
	nSubCtrl = angular.element(document.getElementById("NewSubmissionController")).scope().subCtrl;
	
	if (nSubCtrl == undefined || nSubCtrl.pageData == undefined || nSubCtrl.pageData.expires == undefined || nSubCtrl.loaded == false || nSubCtrl.pageData.description == undefined){
		setTimeout(hookSubCtrl, 50);
	}else{
		hooked++;
		console.log("[WayFarer+] NewSubmissionController was hooked to nSubCtrl");

		var modEvent = new Event("WFPNSubCtrlHooked");
        document.dispatchEvent(modEvent);

		//Auto select first possible duplicate
		if (nSubCtrl.reviewType == "NEW" && nSubCtrl.activePortals.length > 0 && settings["revAutoSelectDupe"])
			nSubCtrl.displayLivePortal(0);
	}
}

function hookAnsCtrl(){
	ansCtrl = angular.element(document.getElementById("AnswersController")).scope().answerCtrl;

	if (ansCtrl == undefined){
		setTimeout(hookAnsCtrl, 50);
	}else{
		hooked++;
		console.log("[WayFarer+] AnswersController was hooked to ansCtrl");

		var modEvent = new Event("WFPAnsCtrlHooked");
        document.dispatchEvent(modEvent);
	}
}

function hookWhatCtrl(){
	whatCtrl = angular.element(document.getElementById('WhatIsItController')).scope().whatCtrl;
	whatCtrlScope = angular.element(document.getElementById('WhatIsItController')).scope();

	if (whatCtrl == undefined){
		setTimeout(hookWhatCtrl, 50);
	}else{
		hooked++;
		console.log("[WayFarer+] WhatIsItController was hooked to whatCtrl");
		console.log("[WayFarer+] WhatIsItController scope was hooked to whatCtrlScope");

		var modEvent = new Event("WFPWhatCtrlHooked");
        document.dispatchEvent(modEvent);
	}
}

function hookDataService(){
	angular.element(document.getElementsByTagName("html")[0]).injector().invoke(["NewSubmissionDataService", function (nSF) {nSubDS = nSF;}]);
	if (nSubDS == undefined){
		setTimeout(hookDataService, 50);
	}else{
		hooked++;
		console.log("[WayFarer+] NewSubmissionDataService was hooked to nSubDS");

		var modEvent = new Event("WFPNSubDSHooked");
        document.dispatchEvent(modEvent);
	}
}

//Always on mods:
function addDescriptionLink(){
	var description = document.getElementsByClassName("title-description")[1];

	var linkElem = document.createElement("a");
	linkElem.href = "http://www.google.com/search?q=" + encodeURI(nSubCtrl.pageData.description);
	linkElem.setAttribute("target", "_BLANK");

	linkElem.appendChild(description.cloneNode(true));
	description.parentNode.replaceChild(linkElem, description);
}

function filmStripScroll(){
	//Make film strip (duplicates) scrollable
	var filmStripElem = document.getElementById("map-filmstrip");

	function horizontalScroll(e){
		filmStripElem.scrollLeft += e.deltaY;
		e.preventDefault(); //Stop regular scroll
	}

	//Hook function to scroll event in filmstrip
	filmStripElem.addEventListener("wheel", horizontalScroll, false);
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
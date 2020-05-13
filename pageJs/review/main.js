var nSubCtrl, ansCtrl, nSubDS, whatCtrl, whatCtrlScope;

var hooked = 0;

//Global const for any mod
const divNames = {shouldBePortal: "photo-card", titleAndDescription: "descriptionDiv", duplicates: "duplicates-card", historicOrCultural: "histcult-card", visuallyUnique: "uniqueness-card", safeAccess: "safety-card", location: "map-card", whatIsIt: "what-is-it-card-review", additionalComment: "additional-comments-card", locationAccuracy: "map-card"};

setupPage();
function setupPage(){
	hookSubCtrl();
	hookAnsCtrl();
	hookDataService();
	hookedAll();
}

function onHooked(){
	if (settings["revDescLink"])
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
	tempNSubCtrl = angular.element(document.getElementById("NewSubmissionController")).scope().subCtrl;
	tempNSubCtrlScope = angular.element(document.getElementById("NewSubmissionController")).scope();
	
	if (tempNSubCtrl == undefined || tempNSubCtrl.pageData == undefined || tempNSubCtrl.pageData.expires == undefined || tempNSubCtrl.loaded == false || tempNSubCtrl.pageData.description == undefined){
		if (tempNSubCtrl != undefined && tempNSubCtrl.errorMessage != "") {
			autoretry = true;
			var modEvent = new Event("WFPNSubCtrlError");
			document.dispatchEvent(modEvent);
		}else {
			setTimeout(hookSubCtrl, 50);
		}
	}else{
		nSubCtrl = tempNSubCtrl;
		nSubCtrlScope = tempNSubCtrlScope;
		hooked++;
		console.log("[WayFarer+] NewSubmissionController was hooked to nSubCtrl");
		console.log("[WayFarer+] NewSubmissionController's scope was hooked to nSubCtrlScope");

		var modEvent = new Event("WFPNSubCtrlHooked");
        document.dispatchEvent(modEvent);

		//Auto select first possible duplicate
		if (nSubCtrl.reviewType == "NEW" && nSubCtrl.activePortals.length > 0 && settings["revAutoSelectDupe"])
			nSubCtrl.displayLivePortal(0);

		//Only hook what ctrl AFTER sub ctrl
		hookWhatCtrl();
	}
}

function hookAnsCtrl(){
	tempAnsCtrl = angular.element(document.getElementById("AnswersController")).scope().answerCtrl;

	if (tempAnsCtrl == undefined){
		setTimeout(hookAnsCtrl, 50);
	}else{
		ansCtrl = tempAnsCtrl;
		hooked++;
		console.log("[WayFarer+] AnswersController was hooked to ansCtrl");

		var modEvent = new Event("WFPAnsCtrlHooked");
        document.dispatchEvent(modEvent);
	}
}

function hookWhatCtrl(){
	var cardId;
	if (nSubCtrl.reviewType == "EDIT"){
		cardId = "what-is-it-card-edit";
	}else{
		cardId = "what-is-it-card-review";
	}
	if (document.getElementById(cardId) == undefined){
		setTimeout(hookWhatCtrl, 50);
		return;
	}
	tempWhatCtrl = angular.element(document.getElementById(cardId).children[0]).scope().whatCtrl;
	tempWhatCtrlScope = angular.element(document.getElementById(cardId).children[0]).scope();

	if (tempWhatCtrl == undefined){
		setTimeout(hookWhatCtrl, 50);
	}else{
		whatCtrl = tempWhatCtrl;
		whatCtrlScope = tempWhatCtrlScope;
		hooked++;
		console.log("[WayFarer+] WhatIsItController was hooked to whatCtrl");
		console.log("[WayFarer+] WhatIsItController scope was hooked to whatCtrlScope");

		var modEvent = new Event("WFPWhatCtrlHooked");
        document.dispatchEvent(modEvent);
	}
}

function hookDataService(){
	angular.element(document.getElementsByTagName("html")[0]).injector().invoke(["NewSubmissionDataService", function (nSF) {tempNSubDS = nSF;}]);
	if (tempNSubDS == undefined){
		setTimeout(hookDataService, 50);
	}else{
		nSubDS = tempNSubDS;
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
		console.log("[WayFarer+] WARNING: Portal nomination too close, will not go live in any current Niantic game!");

		if (settings["revTooCloseWarn"]){
			var warningDiv = document.createElement("div");
			warningDiv.style = "color: red; font-size: 1em; display: block; font-weight: bold;";
			warningDiv.innerText = "NOTE: Wayspot within 20m of another, possibly a duplicate?";

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
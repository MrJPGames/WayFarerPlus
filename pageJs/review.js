var nSubCtrl;

setupPage();

function setupPage(){
	nSubCtrl = angular.element(document.getElementById("NewSubmissionController")).scope().subCtrl;
	if (nSubCtrl == undefined || nSubCtrl.pageData == undefined ||  nSubCtrl.pageData.expires == undefined){
		//Retry setup later
		setTimeout(setupPage, 100);
	}else{
		console.log("[WayFarer+] NewSubmissionController was hooked to nSubCtrl")
		//Do page setup
		if (settings["revExpireTimer"])
			updateTimer();
		if (nSubCtrl.reviewType == "NEW"){
			if (nSubCtrl.pageData.nearbyPortals[0] != undefined)
				checkNearby();
		}
		if (settings["revTranslate"]){
			addTranslationButtons();
		}
	}
}

function addTranslationButtons(){
	var elems = document.getElementsByClassName("title-description");

	for (i = 0; i < elems.length; i++){
		var translateButton = document.createElement("a");
		translateButton.setAttribute("target", "_BLANK");
		translateButton.href = "https://translate.google.com/?sl=auto&q=" + encodeURI(elems[i].innerText);

		var translateImage = document.createElement("img");
		translateImage.src = extURL + "assets/translate.svg";
		translateImage.setAttribute("class", "translateImg");

		translateButton.appendChild(translateImage);

		elems[i].appendChild(translateButton);
	}

	if (nSubCtrl.hasSupportingImageOrStatement){
		var elem = document.getElementsByClassName("supporting-statement-central-field")[0];

		var translateButton = document.createElement("a");
		translateButton.setAttribute("target", "_BLANK");
		translateButton.href = "https://translate.google.com/?sl=auto&q=" + encodeURI(elem.innerText);

		var translateImage = document.createElement("img");
		translateImage.src = extURL + "assets/translate.svg";
		translateImage.setAttribute("class", "translateImg");

		translateButton.appendChild(translateImage);

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
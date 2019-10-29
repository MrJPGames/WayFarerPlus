var nSubCtrl;

//For cirlce mod
var lowDistCircle, longDistCirle, nSubDS;

//For keyboard mod
var revPos = 0;
var revFields = [];
var starButtons = [];
var inReject = false;
var inDuplicate = false;
var maxRevPos = 5;
var colCode = "20B8E3";
var rejectComplete = false;
var menuPtr = null;

setupPage();

function setupPage(){
	nSubCtrl = angular.element(document.getElementById("NewSubmissionController")).scope().subCtrl;
	ansCtrl = angular.element(document.getElementById("AnswersController")).scope().answerCtrl;
	if (nSubCtrl == undefined || nSubCtrl.pageData == undefined || nSubCtrl.pageData.expires == undefined || nSubCtrl.loaded == false
		|| ansCtrl == undefined){
		//Retry setup later
		setTimeout(setupPage, 100);
	}else{
		console.log("[WayFarer+] NewSubmissionController was hooked to nSubCtrl")
		console.log("[WayFarer+] AnswersController was hooked to ansCtrl")
		//Do page setup
		angular.element(document.getElementsByTagName("html")[0]).injector().invoke(["NewSubmissionDataService", function (nSF) {nSubDS = nSF;}]);
		if (!settings["darkMode"])
			colCode = "DF471C";
		if (settings["revKeyboard"])
			initKeyboardControls();

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
		if (settings["revLowestDistCircle"] || settings["revAccessDistCircle"] || settings["revMap2ZoomLevel"] != -1)
			hookResetMapFuncs();
		if (settings["ctrlessZoom"])
			mapsRemoveCtrlToZoom();
		if (settings["revMap2ZoomLevel"] != -1)
			zoomMap2();

		if (settings["revGoogleMaps"])
			addGoogleMapsButton();
		if (settings["revIntelButton"])
			addIntelButton();

	    if (settings["revS2Cell"] != -1){
		    var lat = nSubCtrl.pageData.lat;
		    var lng = nSubCtrl.pageData.lng;

	        addS2(nSubCtrl.map, lat, lng, settings["revS2Cell"]);
	        addS2(nSubCtrl.map2, lat, lng, settings["revS2Cell"]);
	        if (ansCtrl.needsLocationEdit)
	        	addS2(nSubCtrl.locationEditsMap, lat, lng, settings["revS2Cell"]);
	        hookS2LocEdit();
	    }

	    if (settings["revLowRes"])
	    	setupLowRes();
	    if (settings["revNoTaskDesc"] || settings["revLowRes"])
	    	removeRedundantDescriptions();

	    if (settings["revEditOrigLoc"] && ansCtrl.needsLocationEdit)
	    	addOrigLocation(nSubCtrl.locationEditsMap);

		addDescriptionLink();
		filmStripScroll();
		//Auto select first possible duplicate
		nSubCtrl.displayLivePortal(0);
	}
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

function addOrigLocation(gMap){
	var latLng = new google.maps.LatLng(nSubCtrl.pageData.lat, nSubCtrl.pageData.lng);
	var m = new google.maps.Marker({
        map: gMap,
        position: latLng,
        zIndex: 100
  	});
}

function removeRedundantDescriptions() {
    for (var i = document.getElementsByClassName('card-header__description').length - 1; i >= 0; i--) {
        document.getElementsByClassName('card-header__description')[i].remove();
    }
}

function setupLowRes() {
	const divNames = {shouldBePortal: "photo-card", titleAndDescription: "descriptionDiv", historicOrCultural: "histcult-card", visuallyUnique: "uniqueness-card", safeAccess: "safety-card", location: "map-card"};

	//TODO: replace with interaction with nSubCtrl.loaded and nSubCtrl.hasSupportingImageOrStatement
	setTimeout(function () {
        if (document.getElementById("supporting-card").classList.contains("ng-hide")) {
            document.getElementById("supporting-card").classList.remove("ng-hide");
            document.getElementById("supporting-card").getElementsByClassName("supporting-statement-central-field")[0].remove();
            document.getElementById("supporting-card").getElementsByClassName("supporting-image")[0].remove();
            document.getElementById("supporting-card").getElementsByClassName("card__body")[0].innerHTML = '<h4 class="ng-binding">This nomination was made using Scanner [REDACTED], which means that no Support Photo or Support Text were given.</h4>';
        }
    }, 1500);

    var fragment = document.createDocumentFragment();
    fragment.appendChild(document.getElementById(divNames.titleAndDescription));
    document.getElementById('three-card-container').appendChild(fragment);
    document.getElementById(divNames.titleAndDescription).classList.remove("card--expand");
    document.getElementById(divNames.titleAndDescription).classList.add("small-card");
    document.getElementById(divNames.titleAndDescription).style.height = "193pt";
    document.getElementById(divNames.titleAndDescription).getElementsByClassName('card__body')[0].style.paddingTop = "0pt";
    document.getElementById(divNames.titleAndDescription).getElementsByTagName("h1")[0].style.fontSize = "26pt";
    document.getElementById(divNames.titleAndDescription).getElementsByTagName("h4")[1].style.fontSize = "16pt";
    document.getElementById(divNames.historicOrCultural).classList.add("middle-card");
    document.getElementById(divNames.visuallyUnique).classList.remove("middle-card");
    document.getElementById(divNames.safeAccess).classList.add("middle-card");

    document.getElementById(divNames.historicOrCultural).getElementsByClassName('card-header__title')[0].style.padding = "0pt";
    document.getElementById(divNames.historicOrCultural).getElementsByClassName('card-header__title')[0].style.margin = "2pt 0pt -1pt";
    document.getElementById(divNames.historicOrCultural).getElementsByClassName('card-header')[0].style.marginBottom = "-25pt";
    document.getElementById(divNames.visuallyUnique).getElementsByClassName('card-header__title')[0].style.padding = "0pt";
    document.getElementById(divNames.visuallyUnique).getElementsByClassName('card-header__title')[0].style.margin = "2pt 0pt -1pt";
    document.getElementById(divNames.visuallyUnique).getElementsByClassName('card-header')[0].style.marginBottom = "-25pt";
    document.getElementById(divNames.safeAccess).getElementsByClassName('card-header__title')[0].style.padding = "0pt";
    document.getElementById(divNames.safeAccess).getElementsByClassName('card-header__title')[0].style.margin = "2pt 0pt -1pt";
    document.getElementById(divNames.safeAccess).getElementsByClassName('card-header')[0].style.marginBottom = "-25pt";

    document.getElementById(divNames.historicOrCultural).getElementsByClassName("card-header__title")[0].innerHTML = "Historic/Cultural";

    document.getElementById("duplicates-card").classList.remove("card--double-width");
    document.getElementById("duplicates-card").classList.add("card--expand");
    document.getElementById("duplicates-card").style.order = 4;

    document.getElementById(divNames.location).classList.remove("card--double-width");
    document.getElementById(divNames.location).classList.add("card--expand");
    document.getElementById(divNames.location).style.order = 6;

    document.getElementById("three-card-container").style.order = 2;
    document.getElementById(divNames.titleAndDescription).style.order = 1;
    document.getElementById(divNames.historicOrCultural).style.order = 2;
    document.getElementById(divNames.visuallyUnique).style.order = 3;
    document.getElementById(divNames.safeAccess).style.order = 4;

    document.getElementById("what-is-it-card").remove();
    document.getElementsByClassName("what-is-it-card")[0].remove();
    document.getElementById("additional-comments-card").remove();
    document.getElementsByClassName("comments-card")[0].remove();

    removeRedundantDescriptions();

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

function addIntelButton(){
	var latLng = nSubCtrl.pageData.lat + "," + nSubCtrl.pageData.lng;
    addMapButton("https://intel.ingress.com/intel?z=18&pll=" + latLng + "&ll=" + latLng,
                 "Open in Intel");
}

function addGoogleMapsButton(){
    addMapButton("https://maps.google.com/maps?q=" + nSubCtrl.pageData.lat + "," + nSubCtrl.pageData.lng,
                 "Open in Google Maps");
}

function addMapButton(mapUrl, text, buttonID){
	//Create button
    var button = document.createElement("a");
    button.setAttribute("class", "customMapButton");
    button.setAttribute("target", "_BLANK");
    button.setAttribute("id", buttonID);
    button.href = mapUrl;
    button.innerText = text;

    //Add elem to page
    switch (nSubCtrl.reviewType){
    	case "NEW":
		    var cardFooterElems = document.getElementsByClassName("card__footer");
		    var cardFooterElem = cardFooterElems[cardFooterElems.length-1];
		    cardFooterElem.insertBefore(button, cardFooterElem.children[0]);
		    break;
		case "EDIT":
			var infoCard = document.getElementsByClassName("known-information-card")[0];
			infoCard.style.display = "inline-block";
			infoCard.appendChild(button);
	}
}


function addDescriptionLink(){
	var description = document.getElementsByClassName("title-description")[1];

	var linkElem = document.createElement("a");
	linkElem.href = "http://www.google.com/search?q=" + encodeURI(nSubCtrl.pageData.description);
	linkElem.setAttribute("target", "_BLANK");

	linkElem.appendChild(description.cloneNode(true));
	description.parentNode.replaceChild(linkElem, description);
}

function zoomMap2(){
	var newZoomLevel = parseInt(settings["revMap2ZoomLevel"]);
	nSubCtrl.map2.setZoom(newZoomLevel);
}

function initKeyboardControls(){
	//Register to the key press event
	document.addEventListener('keydown', keyDownEvent);

	revFields = document.getElementsByClassName("five-stars");
	starButtons = document.getElementsByClassName("button-star");

	revFields[0].focus();
	revFields[0].setAttribute("style", "border-color: #" + colCode + ";");

	//Bind to opening and closing of reject modal
	var openModal = ansCtrl.showLowQualityModal;
	ansCtrl.showLowQualityModal = function(){
		inReject = true;
		openModal();
		setTimeout(function (){
			menuPtr = document.getElementById("reject-reason").children[0].children[2]; //Gets <ul> checkedG1
			//Number the options
			var i = 0;
			for (i=0; i < menuPtr.children.length; i++){
				var elem = menuPtr.children[i];
				elem.children[1].innerText = (i+1) + ". " + elem.children[1].innerText;
			}
		}, 20);
	}

	var closeModal = ansCtrl.resetLowQuality;
	ansCtrl.resetLowQuality = function(){
		inReject = false;
		closeModal();
	}
}

function keyDownEvent(e){
	//If typing in a text field ignore ALL input (except for enter to confirm rejection)
	if (document.activeElement.nodeName == "TEXTAREA"){
		if (rejectComplete && e.keyCode == 13){
			//Stop the enter from creating a new line in the textarea
			e.preventDefault();
			ansCtrl.confirmLowQuality();
		}
		return;
	}

	console.log(e.keyCode);

	if (ansCtrl.reviewComplete){
		if (e.keyCode == 13) //Enter Key
			ansCtrl.reloadPage();
		if (e.keyCode == 8) //Backspace
			window.location.href = "/";
	}else{
		if (!inReject && !inDuplicate){
			if (e.keyCode == 37 || e.keyCode == 8){ //Left arrow key or backspace
				changeRevPos(-1);
			}else if (e.keyCode == 39){ //Right arrow key
				changeRevPos(1);
			}else if (e.keyCode >= 97 && e.keyCode <= 101){ // 1-5 Num pad
				var rating = e.keyCode - 97;
				setRating(revPos, rating);
			}else if (e.keyCode >= 49 && e.keyCode <= 53){ // 1-5 normal
				var rating = e.keyCode - 49;
				setRating(revPos, rating);
			}else if (e.keyCode == 13){ //Enter key
				if (ansCtrl.readyToSubmit())
					ansCtrl.submitForm();
			}else if (e.keyCode == 68){ // D key
				document.getElementById("markDuplicateButton").click();
				inDuplicate = true;

				//Hook on close (including with mouse)
				var elem = document.getElementsByClassName("modal-dialog modal-med")[0].children[0].children[0];
				var ansCtrl2 = angular.element(elem).scope().answerCtrl2;
				var func = ansCtrl2.resetDuplicate;
				ansCtrl2.resetDuplicate = function(){
					inDuplicate = false;
					func();
				}
			}
		}else if (inDuplicate){
			var elem = document.getElementsByClassName("modal-dialog modal-med")[0].children[0].children[0];
			var ansCtrl2 = angular.element(elem).scope().answerCtrl2;
			if (e.keyCode == 8){
				ansCtrl2.resetDuplicate();
			}else if (e.keyCode == 13){
				ansCtrl2.confirmDuplicate();
				ansCtrl.reviewComplete = true;
			}
		}else{
			//In rejection
			if (e.keyCode == 37 || e.keyCode == 8){ //Left arrow or backspace
				//Reject selection complete but not typing in reason
				if (rejectComplete){
					//Click the element for the user (the top "menu" in reject reason screen)
					document.getElementById("root-label").parentNode.children[0].click();
					//Reset menu ptr
					menuPtr = document.getElementById("reject-reason").children[0].children[2];
					rejectComplete = false;
				}else if (menuPtr.getAttribute("class") == "sub-group-list"){ //Check if in a submenu
					menuPtr.parentNode.children[0].click(); //Minimizes submenu
					menuPtr = menuPtr.parentNode.parentNode; //Reset menuPtr to main menu
				}else{
					//Close modal
					ansCtrl.resetLowQuality();
				}
			}
			var menuPos = -1;
			if (e.keyCode >= 97 && e.keyCode <= 105){
				menuPos = e.keyCode - 97;
			}
			if (e.keyCode >= 49 && e.keyCode <= 57){
				menuPos = e.keyCode - 49;
			}
			if (menuPos != -1){
				//A number was pressed
				if (menuPtr.children[menuPos] != undefined){
					menuPtr.children[menuPos].children[0].click();

					if (menuPtr.getAttribute("class") == "group-list"){ //Check if in main menu
						menuPtr = menuPtr.children[menuPos].children[2];

						var i = 0;
						for (i=0; i < menuPtr.children.length; i++){
							var elem = menuPtr.children[i];

							//Avoid readding numbers
							if (isNaN(elem.children[0].innerText[0]))
								elem.children[0].innerText = (i+1) + ". " + elem.children[0].innerText;
						}
					}else{
						//An option was chosen of the submenu. 
						//Submenus only go 1 deep meaning a choice in a submenu must be the last choice
						rejectComplete = true;

						//Stop the number just entered from being typed in the soon to be selected text box
						e.preventDefault();
						document.getElementsByTagName("textarea")[0].focus();
					}
				}
			}
		}
	}
}

function setRating(pos, rate){
	var buttonPos = pos*5+rate;
	starButtons[buttonPos].click();
	if (!(rate == 0 && pos == 0))
		changeRevPos(1);
}

function changeRevPos(diff){
	revFields[revPos].setAttribute("style", "");
	revPos += diff;
	if (revPos < 0)
		revPos = 0;
	if (revPos > maxRevPos)
		revPos = maxRevPos;

	//Set appropriate style
	revFields[revPos].setAttribute("style", "border-color: #" + colCode + ";");

	//Focus on currently rating stars
	revFields[revPos].focus();
	revFields[revPos].scrollIntoView(false);
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

function mapsRemoveCtrlToZoom(){
	var options = {
		scrollwheel: true,
		gestureHandling: 'greedy'
	};
	nSubCtrl.map.setOptions(options);
	nSubCtrl.map2.setOptions(options);
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
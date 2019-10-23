var nSubCtrl;

//For cirlce mod
var lowDistCircle, longDistCirle, nSubDS;

//For keyboard mod
var revPos = 0;
var revFields = [];
var starButtons = [];
var inReject = false;
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

		if (!settings["darkMode"])
			colCode = "DF471C";
		if (settings["revKeyboard"])
			initKeyboardControls();
	}
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

	if (ansCtrl.reviewComplete){
		if (e.keyCode == 13) //Enter Key
			ansCtrl.reloadPage();
		if (e.keyCode == 8) //Backspace
			window.location.href = "/";
	}else{
		if (!inReject){
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
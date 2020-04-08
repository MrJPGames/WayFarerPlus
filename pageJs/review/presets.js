var presetContainer; //Needed in multiple functions

function setupPresets(){
	if (nSubCtrl.reviewType == "EDIT")
		return; //No edit presets obviously!
	//Init for first run
	if (localStorage.wfpPresets == undefined){
		var defaultPresets = [];
		localStorage.wfpPresets = JSON.stringify(defaultPresets);
	}
	addPresetsBar();
}

function addPresetsBar(){
	var presetBox = document.createElement("div");
	if (!settings["darkMode"])
		presetBox.style.boxShadow = "grey 1px 1px 5px";
	presetBox.innerText = "Presets: ";
	presetBox.setAttribute("class", "presetBox");

	//Add optional styling (have it be expanded or not)
	if (settings["revCardView"] != "extended"){
		presetBox.style.maxWidth = "1170px"; //The px value used by Niantic in main.min.css
	}

	var addButton = document.createElement("button");
	addButton.innerText = "+";
	addButton.onclick = addPreset;
	addButton.setAttribute("class", "presetAddButton");
	if (settings["darkMode"]){
		addButton.style.background = "#20B8E3";
	}else{
		addButton.style.background = "#DF471C";
		addButton.style.color = "white";
	}
	presetBox.appendChild(addButton);

	presetContainer = document.createElement("container");
	addAllPresetButtons();
	presetBox.appendChild(presetContainer);

	var ansCtrlDiv = document.getElementById("AnswersController");
	ansCtrlDiv.insertBefore(presetBox, ansCtrlDiv.children[0]);
}

function addAllPresetButtons(){
	var presets = JSON.parse(localStorage.wfpPresets);
	for (var i=0; i<presets.length; i++){
		addButtonToBar(presets[i], i);
	}
}

function addButtonToBar(preset, id){
	var presetButton = document.createElement("button");
	presetButton.setAttribute("presetID", id);
	presetButton.setAttribute("class", "presetButton");
	presetButton.innerText = preset.name;
	presetButton.onclick = presetClick;
	presetButton.oncontextmenu = removePreset;
	if (preset.rng)
		presetButton.style.fontWeight = "bold";
	presetContainer.appendChild(presetButton);
}

function presetClick(e){
	var pID = e.srcElement.getAttribute("presetID");
	var presets = JSON.parse(localStorage.wfpPresets);
	var preset = presets[pID];


	var shouldBePortal = preset.shouldBePortal;
	var titleAndDescription = preset.titleAndDescription;
	var historicOrCultural = preset.historicOrCultural;
	var visuallyUnique = preset.visuallyUnique;
	var safeAccess = preset.safeAccess;
	var locationAccuracy = preset.locationAccuracy;

	if (preset.rng){
		//These are the values we assume can be changed by 1 star up or down and still be "essentially" the same review
		if (titleAndDescription > 0) titleAndDescription = keepInBounds(parseInt(titleAndDescription)+randomRange(-1,1));
		if (historicOrCultural > 0) historicOrCultural = keepInBounds(parseInt(historicOrCultural)+randomRange(-1,1));
		if (visuallyUnique > 0) visuallyUnique = keepInBounds(parseInt(visuallyUnique)+randomRange(-1,1));
		if (safeAccess > 0) safeAccess = keepInBounds(parseInt(safeAccess)+randomRange(-1,1));
	}

	ansCtrl.formData.quality = shouldBePortal;
	ansCtrl.formData.description = titleAndDescription;
	ansCtrl.formData.cultural = historicOrCultural;
	ansCtrl.formData.uniqueness = visuallyUnique;
	ansCtrl.formData.safety = safeAccess;
	ansCtrl.formData.location = locationAccuracy;

	if (shouldBePortal > 0) document.getElementById(divNames.shouldBePortal).getElementsByClassName("five-stars")[0].children[shouldBePortal-1].click();
	if (titleAndDescription > 0) document.getElementById(divNames.titleAndDescription).getElementsByClassName("five-stars")[0].children[titleAndDescription-1].click();
	if (historicOrCultural > 0) document.getElementById(divNames.historicOrCultural).getElementsByClassName("five-stars")[0].children[historicOrCultural-1].click();
	if (visuallyUnique > 0) document.getElementById(divNames.visuallyUnique).getElementsByClassName("five-stars")[0].children[visuallyUnique-1].click();
	if (safeAccess > 0) document.getElementById(divNames.safeAccess).getElementsByClassName("five-stars")[0].children[safeAccess-1].click();
	if (locationAccuracy > 0) document.getElementById(divNames.locationAccuracy).getElementsByClassName("five-stars")[0].children[locationAccuracy-1].click();

	if (preset.whatIsItPath != undefined){
		for (var i=0; i < preset.whatIsItPath.length; i++){ //Go through all nodes stored for the path to the final setting (from root to deepest child set)
			whatCtrl.setWhatNode(preset.whatIsItPath[i]); //Set node
		}

		//After setting the deepest child node we want to sync this change to the DOM
		whatCtrlScope.$apply();
	}else{
		//Reassign focus function to prevent presets from focusing the WhatIsIt Box search field
		var tempFunc = whatCtrl.focusOnCategoryInput;
		whatCtrl.focusOnCategoryInput = function(){console.log("Captured function call")};

		//If not defined reset WhatIsIt Box
		whatCtrl.backToRootNode();

		//Reset the focus function so regular use of the backToRootFunction can properly set focus to the search field.
		whatCtrl.focusOnCategoryInput = tempFunc;

		//Sync changes to DOM
		whatCtrlScope.$apply();

		e.srcElement.focus();
	}
}

function removePreset(e){
	e.preventDefault();

	if (confirm("Are you sure you want to remove this preset?")){
		var pID = e.srcElement.getAttribute("presetID");
		var presets = JSON.parse(localStorage.wfpPresets);
		presets.splice(pID, 1); //Remove from array
		localStorage.wfpPresets = JSON.stringify(presets); //Store removal

		//Remove all "old" buttons
		while (presetContainer.firstChild) {
			presetContainer.removeChild(presetContainer.firstChild);
		}
		//Readd buttons
		addAllPresetButtons();
	}
}

function keepInBounds(val){
	if (val > 5)
		return 5;
	if (val < 1)
		return 1;
	return val;
}

function randomRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function addPreset(){
	var presetName = prompt("Please enter the name for this preset:", "");
	if (presetName == null || presetName == ""){
		//Failed to enter a name
	}else{
		var preset = {};
		preset.name = presetName;
		preset.shouldBePortal = ansCtrl.formData.quality;
		preset.titleAndDescription = ansCtrl.formData.description;
		preset.historicOrCultural = ansCtrl.formData.cultural;
		preset.visuallyUnique = ansCtrl.formData.uniqueness;
		preset.safeAccess = ansCtrl.formData.safety;
		preset.locationAccuracy = ansCtrl.formData.location;
		
		if (whatCtrl.whatNode.id != "0"){
			var whatIsItPath = [whatCtrl.whatNode.id]; //Init with (and will be end of list/array) the final node ID
			var parent = whatCtrl.whatNode.parent;
			while (parent.id != "0" && parent.id != null){ //Either root, or just in case no more parent is found
				whatIsItPath.unshift(parent.id);
				parent = parent.parent;
			}
			preset.whatIsItPath = whatIsItPath;
		}


		if (confirm("Do you want to have small random mutations applied?\n\n- These should not affect the outcome of the review.\n- These might make it less likely to get a cooldown while using presets.")){
			preset.rng = true;
		}else{
			preset.rng = false;
		}

		var presets = JSON.parse(localStorage.wfpPresets);
		presets[presets.length] = preset;
		localStorage.wfpPresets = JSON.stringify(presets);

		addButtonToBar(preset, presets.length-1);
	}
}

document.addEventListener("WFPAllRevHooked", setupPresets);
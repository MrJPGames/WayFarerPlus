var presetContainer; //Needed in multiple functions

function setupPresets(){
	if (nSubCtrl.reviewType == "EDIT")
		return; //No edit presets obviously!
	//Init for first run
	if (localStorage.wfpPresets == undefined){
		var defaultPresets = [];
		localStorage.wfpPresets = JSON.stringify(defaultPresets);
	}
	var presets = JSON.parse(localStorage.wfpPresets);
	addPresetsBar(presets);
}

function addPresetsBar(presets){
	var presetBox = document.createElement("div");
	if (!settings["darkMode"])
		presetBox.style.boxShadow = "grey 1px 1px 5px";
	presetBox.innerText = "Presets: ";
	presetBox.setAttribute("class", "presetBox");
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
	presetContainer = document.createElement("div");
	presetContainer.setAttribute("class", "presetContainer");
	for (var i=0; i<presets.length; i++){
		addButtonToBar(presets[i], i);
	}
	presetBox.appendChild(presetContainer);
	var ansCtrlDiv = document.getElementById("AnswersController");
	ansCtrlDiv.insertBefore(presetBox, ansCtrlDiv.children[0]);
}

function addButtonToBar(preset, id){
	var presetButton = document.createElement("button");
	presetButton.setAttribute("presetID", id);
	presetButton.setAttribute("class", "presetButton");
	presetButton.innerText = preset.name;
	presetButton.onclick = presetClick;
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

	if (shouldBePortal > 0) document.getElementById(divNames.shouldBePortal).getElementsByClassName("five-stars")[0].children[shouldBePortal-1].click();
	if (titleAndDescription > 0) document.getElementById(divNames.titleAndDescription).getElementsByClassName("five-stars")[0].children[titleAndDescription-1].click();
	if (historicOrCultural > 0) document.getElementById(divNames.historicOrCultural).getElementsByClassName("five-stars")[0].children[historicOrCultural-1].click();
	if (visuallyUnique > 0) document.getElementById(divNames.visuallyUnique).getElementsByClassName("five-stars")[0].children[visuallyUnique-1].click();
	if (safeAccess > 0) document.getElementById(divNames.safeAccess).getElementsByClassName("five-stars")[0].children[safeAccess-1].click();
	if (locationAccuracy > 0) document.getElementById(divNames.locationAccuracy).getElementsByClassName("five-stars")[0].children[locationAccuracy-1].click();
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
		preset.whatIsIt = whatCtrl.whatNode.id;

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

document.addEventListener("WFPAllRevHooked", setupPresets, false);
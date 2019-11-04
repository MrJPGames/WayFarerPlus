var presetContainer; //Needed in multiple functions

function setupPresets(){
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
	presetContainer.appendChild(presetButton);
}

function presetClick(e){
	var pID = e.srcElement.getAttribute("presetID");
	var presets = JSON.parse(localStorage.wfpPresets);
	var preset = presets[pID];
	if (preset.shouldBePortal > 0) document.getElementById(divNames.shouldBePortal).getElementsByClassName("five-stars")[0].children[preset.shouldBePortal-1].click();
	if (preset.titleAndDescription > 0) document.getElementById(divNames.titleAndDescription).getElementsByClassName("five-stars")[0].children[preset.titleAndDescription-1].click();
	if (preset.historicOrCultural > 0) document.getElementById(divNames.historicOrCultural).getElementsByClassName("five-stars")[0].children[preset.historicOrCultural-1].click();
	if (preset.visuallyUnique > 0) document.getElementById(divNames.visuallyUnique).getElementsByClassName("five-stars")[0].children[preset.visuallyUnique-1].click();
	if (preset.safeAccess > 0) document.getElementById(divNames.safeAccess).getElementsByClassName("five-stars")[0].children[preset.safeAccess-1].click();
	if (preset.locationAccuracy > 0) document.getElementById(divNames.locationAccuracy).getElementsByClassName("five-stars")[0].children[preset.locationAccuracy-1].click();
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

		var presets = JSON.parse(localStorage.wfpPresets);
		presets[presets.length] = preset;
		localStorage.wfpPresets = JSON.stringify(presets);

		addButtonToBar(preset, presets.length-1);
	}
}

document.addEventListener("WFPAllRevHooked", setupPresets, false);
savedMaps = [];

var localSettings;

function changeBoolSetting(elem){
	var key = elem.id;
	var value = elem.checked;

	//One time special setting (if more special settings are added in the future a refactor will be needed)
	if (key === "revPresets" && value === true){
		turnOnPresets();
	}else if (key === "accLowIngress"){
		document.getElementById("ingressExtra").style.display = value ? "block" : "none";
		store(key, value);
	}else{
		store(key, value);
	}
}

function changeSelectSetting(elem){
	var key = elem.id;
	var value = elem.value;

	store(key, value);
}

function changeNumberSetting(elem){
	var key = elem.id;
	var value = parseInt(elem.value);

	store(key, value);
}

function store(k, v){
	var obj = {};
	obj[k] = v;
	localSettings[k] = v;
	chrome.storage.local.set(obj, function() {
	    console.log('[Wayfarer+] Setting \"' + k + '\" set to \"' + v + '\"');
	});
}

function turnOnPresets(){
	var startTime = Date.now();
	if (confirm("WARNING! The use of presets can lead to cooldowns!\nThis is due to having multiple reviews with the same responses, this can cause the system to detect 'irregular patterns'. This means using this feature is at YOUR OWN RISK.\n\n(Note if you click OK to quickly (<4 secs) the setting will not change, this is to ensure this message was read)")){
		endTime = Date.now();
		if (endTime-startTime >= 4000){
			store("revPresets", true);
			return
		}
	}
	//Else
	var elem = document.getElementById("revPresets");
	elem.checked = false;
}

getData();

function getData(){
	chrome.storage.local.get(null, function (data){
		if (data["options_set"] == undefined || data["options_set"] < settingsVersion)
			setTimeout(getData, 10); //Really fast but not instant
		else
			init(data);
	});
}

function init(settings){
	localSettings = settings;

	var inputs = document.getElementsByTagName("input");

	for(var i = 0; i < inputs.length; i++){
		if ((inputs[i]).getAttribute("type") == "checkbox"){
			if (inputs[i].getAttribute("class") == "toggle")
				continue; //This is the input for opening and closing submenus!
			if (settings[inputs[i].id]){
				inputs[i].checked = true;
			}
			if (inputs[i].getAttribute("id") == "accIngress")
				document.getElementById("ingressExtra").style.display = inputs[i].checked ? "block" : "none";
			inputs[i].onclick = function(e){changeBoolSetting(e.srcElement)};
		}else if (inputs[i].getAttribute("type") == "number"){
			inputs[i].value = settings[inputs[i].id];
			inputs[i].onchange = function(e){changeNumberSetting(e.srcElement)};
		}
	};

	var selectInputs = document.getElementsByTagName("select");

	for (var i = 0; i < selectInputs.length; i++){
		selectInputs[i].onchange = function(e){changeSelectSetting(e.srcElement)};
		selectInputs[i].value = settings[selectInputs[i].id];
	}

	//Init map manager
	savedMaps = JSON.parse(settings["customMaps"]);
	document.getElementById("addMapButton").onclick = addMap;
	document.getElementById("importMapButton").onclick = importMap;
	document.getElementById("resetMapButton").onclick = resetMap;
	displaySavedMaps();
}

/* Open In Map management code */
function addMap(){
	var mapURL = prompt("Please enter the map URL:\n\nThe following can be used in the URL:\n%lat% - Latitude\n%lng% - Longitude\n%title% - Wayspot title\n\nExample URL: https://maps.google.com/maps?q=%lat%,%lng%");
	if (mapURL == null)
		return;

	var mapTitle = prompt("Please enter the name of this map:");
	if (mapTitle == null)
		return;

	if (confirm("Do you want to add the following map?\n\n" + mapTitle + "\n" + mapURL)){
		//Only actually add the map when everything was OK
		var mapObj = {
			title: mapTitle,
			url: mapURL
		};
		savedMaps.push(mapObj);
		store("customMaps", JSON.stringify(savedMaps));
		updateMapsDisplay();
	}
}

function importMap(){
	var input = document.createElement("input");
	input.setAttribute("type", "file");
	input.setAttribute("accept", ".wfpm");
	input.click(); // opening dialog
	console.log(input);
	input.onchange = function (e){
		var reader = new FileReader();
		reader.onload = function(){
			var text = reader.result;
			var mapData = JSON.parse(text);
			savedMaps.push(mapData);
			store("customMaps", JSON.stringify(savedMaps));
			updateMapsDisplay();
		};
		reader.readAsText(input.files[0]);
	}
}

function resetMap(){
	var trueReset = confirm("Are you sure you want to return \"Open In\" settings to default values?");
	if (trueReset){
		savedMaps = JSON.parse(defaultMapSettings);
		store("customMaps", JSON.stringify(savedMaps));
		updateMapsDisplay();
	}
}

function displaySavedMaps(){
	var baseElem = document.getElementById("openInList");
	for (var i=0; i < savedMaps.length; i++){
		var container = document.createElement("div");
		var titleElem = document.createElement("p");
		var urlText = document.createElement("p");
		var destroyButton = document.createElement("button");
		var exportButton = document.createElement("a");

		container.setAttribute("class", "customMapContainer");

		destroyButton.onclick = function(e){deleteMap(e.srcElement);}; //Works because we re-render upon every addition/deletion
		destroyButton.setAttribute("assocMapId", i);
		destroyButton.setAttribute("class", "destroyButton");
		destroyButton.innerText = "X";

		exportButton.onclick = function(e){exportMap(e.srcElement);};
		exportButton.setAttribute("download", savedMaps[i].title + ".wfpm"); //WayFarer Plus Map
		exportButton.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedMaps[i])));
		exportButton.setAttribute("class", "export");
		exportButton.innerText = "Export " + savedMaps[i].title;

		titleElem.innerText = savedMaps[i].title;
		urlText.innerText = savedMaps[i].url;
		urlText.setAttribute("class", "italic");

		container.appendChild(destroyButton);
		container.appendChild(titleElem);
		container.appendChild(urlText);
		container.appendChild(exportButton);
		baseElem.appendChild(container);
	}
}

function deleteMap(srcElem){
	var id = srcElem.getAttribute("assocMapId");
	if (confirm("Are you sure you want to remove " + savedMaps[id].title + "?")){
		savedMaps.splice(id, 1);
		updateMapsDisplay();
		store("customMaps", JSON.stringify(savedMaps));
	}
}

function updateMapsDisplay(){
	clearSavedMapsDisplay();
	displaySavedMaps();
}

function clearSavedMapsDisplay(){
	document.getElementById("openInList").innerHTML = null;
}

function downloadFile(type, name, content) {
	const hiddenElement = document.createElement("a");
	hiddenElement.href =
		`data:${type};charset=utf-8,` + encodeURIComponent(content);
	hiddenElement.target = "_blank";
	hiddenElement.download = name;
	hiddenElement.click();
}

//Export settings
document.getElementById("settingsExporter").onclick = function(){
	downloadFile("text", "wfpSettings.wfps", JSON.stringify(localSettings));
};

//Import settings
document.getElementById("settingsImporter").onchange = function(elem){
	var URI = elem.target;
	var reader = new FileReader();
	reader.onload = function(){
		var importData = JSON.parse(reader.result);
		console.log(importData);
		if (importData["options_set"] !== undefined){
			for (let [key, value] of Object.entries(importData)) {
				store(key, value);
			}
			window.location.reload();
		}else{
			alert("The selected file was not a valid WayFarer+ config file");
		}
	};
	reader.readAsText(URI.files[0]);
};

document.getElementById("settingsReset").onclick = function(){
	if (confirm("Are you sure you want to reset all settings?")){
		store("options_set", 0);
		setDefaults();
		window.location.reload();
	}
}
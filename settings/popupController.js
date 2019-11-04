function changeBoolSetting(elem){
	var key = elem.id;
	var value = elem.checked;

	//One time special setting (if more special settings are added in the future a refactor will be needed)
	if (key == "revPresets" && value == true){
		turnOnPresets();
	}else{
		store(key, value);
	}
}

function changeSelectSetting(elem){
	var key = elem.id;
	var value = elem.value;

	store(key, value);
}

function store(k, v){
	var obj = {};
	obj[k] = v;
	chrome.storage.local.set(obj, function() {
	    console.log('[Wayfarer+] Setting \"' + k + '\" set to \"' + v + '\"');
	});
}

function turnOnPresets(){
	if (!confirm("WARNING! The use of presets can lead to timeouts!\nThis is due to having multiple reviews with the same responses, this can cause the system to detect 'irregular patterns'. This means using this feature is at YOUR OWN RISK.\n\nPlease click cancel to confirm you want to enable presets.")){
		store("revPresets", true);
	}else{
		var elem = document.getElementById("revPresets");
		elem.checked = false;
	}
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
	var inputs = document.getElementsByTagName("input");

	for(var i = 0; i < inputs.length; i++){
		if ((inputs[i]).getAttribute("type") == "checkbox"){
			if (settings[inputs[i].id]){
				inputs[i].checked = true;
			}
			inputs[i].onclick = function(e){changeBoolSetting(e.srcElement)};
		}
	};

	var selectInputs = document.getElementsByTagName("select");

	for (var i = 0; i < selectInputs.length; i++){
		selectInputs[i].onchange = function(e){changeSelectSetting(e.srcElement)};
		selectInputs[i].value = settings[selectInputs[i].id];
	}
}
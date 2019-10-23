function changeBoolSetting(elem){
	var key = elem.id;
	var value = elem.checked;

	store(key, value);
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
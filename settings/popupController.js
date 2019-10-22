function changeBoolSetting(elem){
	var key = elem.id;
	var value = elem.checked;

	var obj = {};
	obj[key] = value;
	chrome.storage.local.set(obj, function() {
	    console.log('[Wayfarer+] Setting \"' + key + '\" set to \"' + value + '\"');
	});
}

getData();

function getData(){
	chrome.storage.local.get(null, function (data){
		if (data["options_set"] == undefined)
			setTimeout(getData, 20); //Really fast but not instant
		else
			init(data);
	});
}

function init(settings){
	var inputs = document.getElementsByTagName("input");

	for(var i = 0; i<inputs.length; i++){
		if ((inputs[i]).getAttribute("type") == "checkbox"){
			if (settings[inputs[i].id]){
				inputs[i].checked = true;
			}
			inputs[i].onclick = function(e){changeBoolSetting(e.srcElement)};
		}
	};
}
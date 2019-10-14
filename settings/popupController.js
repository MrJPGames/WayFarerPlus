function changeBoolSetting(elem){
	var key = elem.id;
	var value = elem.checked;

	var obj = {};
	obj[key] = value;
	chrome.storage.local.set(obj, function() {
	    console.log('Settings saved');
	});
}
console.log("start");
chrome.storage.local.get(null, function (data){
	init(data);
});

function init(settings){
	var inputs = document.getElementsByTagName("input");
	console.log(inputs);
	console.log(settings);
	for(var i = 0; i<inputs.length; i++){
		console.log(inputs[i]);
		if ((inputs[i]).getAttribute("type") == "checkbox"){
			if (settings[inputs[i].id]){
				inputs[i].checked = true;
			}
			inputs[i].onclick = function(e){console.log(e);changeBoolSetting(e.srcElement)};
		}
	};
}
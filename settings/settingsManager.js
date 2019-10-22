//Sets up default settings on first launch or upgrade

chrome.storage.local.get("options_set", function (data){
	var opt_ver = (data["options_set"] != undefined) ? data["options_set"] : 0;
	switch(opt_ver){
		case 0:
			setOption("darkMode", true);
			setOption("nomStreetView", true);
			setOption("revTooCloseWarn", true);
			setOption("revExpireTimer", true);
		case 1:
			setOption("nomStats", true);
		case 2:
			setOption("accPoGo", false);
			setOption("accIngress", true);
		case 3:
			setOption("revTranslate", true);
			setOption("profExtendedStats", true);
			setOption("revLowestDistCircle", true);
			setOption("revAccessDistCircle", true);
		case 4:
			setOption("ctrlessZoom", false);
			setOption("options_set", 5);
	}
});

function setOption(option_name, value) {
  var obj= {};
  obj[option_name] = value;

	chrome.storage.local.set(obj, function() {
	    console.log('[Wayfarer+] Setting \"' + option_name + '\" set to \"' + value + '\"');
	});
}
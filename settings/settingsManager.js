//Sets up default settings on first launch or upgrade
var settingsVersion = 11;

chrome.storage.local.get("options_set", function (data){
	var opt_ver = (data["options_set"] != undefined) ? data["options_set"] : 0;
	switch(opt_ver){
		case 0:
			setOption("darkMode", false);
			setOption("nomStreetView", true);
			setOption("revTooCloseWarn", true);
			setOption("revExpireTimer", true);
		case 1:
			setOption("nomStats", true);
		case 2:
			setOption("accPoGo", true);
			setOption("accIngress", false);
		case 3:
			setOption("revTranslate", true);
			setOption("revLowestDistCircle", true);
			setOption("revAccessDistCircle", true);
		case 4:
			setOption("ctrlessZoom", false);
		case 5:
			setOption("revKeyboard", true);
			setOption("nomLowestDistCircle", true);
			setOption("nomAccessDistCircle", true);
			setOption("revMap2ZoomLevel", -1);
		case 6:
			setOption("headProgress", true);
			setOption("nomIntelButton", true);
			setOption("nomGoogleMaps", true);
		case 7:
			setOption("revIntelButton", true);
			setOption("revGoogleMaps", true);
		case 8:
			setOption("nomS2Cell", 17);
			setOption("revS2Cell", 17);
			setOption("revNoTaskDesc", false);
			setOption("revEditOrigLoc", true);
		case 9:
			setOption("revCardView", "normal");
			setOption("revPresets", false);
		case 10:
			setOption("profExtendedStats", "aprox");
			setOption("revTransparentMarker", true);
			setOption("revSubmitTimer", 0);
			setOption("revQuickSubmit", true);
			setOption("options_set", settingsVersion);
	}
});

function setOption(option_name, value) {
  var obj= {};
  obj[option_name] = value;

	chrome.storage.local.set(obj, function() {
	    console.log('[Wayfarer+] Setting \"' + option_name + '\" set to \"' + value + '\"');
	});
}
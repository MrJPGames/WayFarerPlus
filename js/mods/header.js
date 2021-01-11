function modHeader(settings){
	if (settings["headProgress"])
		addPageJS("header/upgradeProgress.js",true);
	if (settings["headRevCounter"])
		addPageJS("header/reviewCounter.js");
	console.log("[WayFarer+] Header injection successful!");
}
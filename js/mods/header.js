function modHeader(settings){
	if (settings["headProgress"])
		addPageJS("header/upgradeProgress.js");

	console.log("[WayFarer+] Header injection successful!");
}
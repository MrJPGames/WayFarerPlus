function modHeader(settings){
	if (settings["headProgress"])
		addPageJS("header/upgradeProgress.js",true);

	console.log("[WayFarer+] Header injection successful!");
}
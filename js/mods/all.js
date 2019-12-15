function modAll(settings){
	if (settings["updateDot"])
		addPageJS("all/criteriaUpdateDot.js",true);

	console.log("[WayFarer+] Site wide page injection successful!");
}
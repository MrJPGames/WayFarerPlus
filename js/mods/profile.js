function modProfilePage(settings){
	if (settings["profExtendedStats"])
		addPageJS("profile/extendedStats.js");

	addPageJS("profile/main.js");
	
	console.log("[WayFarer+] Profile page injection successful!");
}
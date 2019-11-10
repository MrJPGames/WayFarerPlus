function modProfilePage(settings){
	if (settings["profExtendedStats"] != "off")
		addPageJS("profile/extendedStats.js");

	addPageJS("profile/main.js");
	
	console.log("[WayFarer+] Profile page injection successful!");
}
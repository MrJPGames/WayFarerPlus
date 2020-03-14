function modProfilePage(settings){
	if (settings["profExtendedStats"] != "off")
		addPageJS("profile/extendedStats.js");

	if (settings["profRecordNominations"]) {
		addPageJS("profile/recordNominations.js");
	}

	addPageJS("profile/main.js", true);
	
	console.log("[WayFarer+] Profile page injection successful!");
}
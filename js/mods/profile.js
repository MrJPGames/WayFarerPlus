function modProfilePage(settings){
	if (settings["profExtendedStats"] != "off")
		addPageJS("profile/extendedStats.js");

	if (settings["profRecordReviews"]) {
		addPageJS("profile/recordReviews.js");
	}

	addPageJS("profile/main.js", true);
	
	console.log("[WayFarer+] Profile page injection successful!");
}
function modProfilePage(settings){
	if (settings["profExtendedStats"] != "off")
		addPageJS("profile/extendedStats.js");

	if (settings["profRecordReviews"]) {
		const newCss = document.createElement("link");
		newCss.setAttribute("rel", "stylesheet");
		newCss.setAttribute("href", chrome.extension.getURL("assets/datatables.css"));
	  	document.getElementsByTagName("head")[0].appendChild(newCss);
		addPageJS("libs/markerclusterer.js");
		addPageJS("libs/jquery.js");
		addPageJS("libs/datatables.js");
		addPageJS("profile/recordReviews.js");
	}

	addPageJS("profile/main.js", true);
	
	console.log("[WayFarer+] Profile page injection successful!");
}
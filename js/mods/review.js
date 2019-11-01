function modReviewPage(settings){
	if (settings["revS2Cell"] != -1)
		addPageJS("libs/S2.js");

	var newCss = document.createElement("link");
	newCss.setAttribute("rel", "stylesheet");
	newCss.setAttribute("href", chrome.extension.getURL("assets/review.css"));
	document.getElementsByTagName("head")[0].appendChild(newCss);

	if (settings["revExpireTimer"]){
		addPageJS("review/expireTimer.js");
	}

	if (settings["revLowRes"])
		addPageJS("review/compactCards.js");
	if (settings["revGoogleMaps"] || settings["revIntelButton"])
		addPageJS("review/mapButtons.js");
	if (settings["revTranslate"])
		addPageJS("review/translationButtons.js");
	if (settings["revLowestDistCircle"] || settings["revAccessDistCircle"] || settings["revMap2ZoomLevel"] || settings["revS2Cell"] || settings["revEditOrigLoc"] || settings["ctrlessZoom"] || settings["revMap2ZoomLevel"] != -1)
		addPageJS("review/mapMods.js");
	if (settings["revKeyboard"])
		addPageJS("review/keyboardCtrl.js");
	
	addPageJS("review/main.js");

	console.log("[WayFarer+] Review page injection successful!");
}
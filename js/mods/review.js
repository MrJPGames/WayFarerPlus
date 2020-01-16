function modReviewPage(settings){
	if (settings["revS2Cell"] != -1)
		addPageJS("libs/S2.js");

	var newCss = document.createElement("link");
	newCss.setAttribute("rel", "stylesheet");
	newCss.setAttribute("href", chrome.extension.getURL("assets/review.css"));
	document.getElementsByTagName("head")[0].appendChild(newCss);

	if (settings["revExpireTimer"] || settings["revSubmitTimer"] > 0)
		addPageJS("review/timerMods.js");
	if (settings["revCardView"] == "compact")
		addPageJS("review/compactCards.js");
	if (settings["revCardView"] == "extended")
		addPageJS("review/expandedCards.js");
	if (settings["revOpenIn"])
		addPageJS("review/mapButtons.js");
	if (settings["revTranslate"])
		addPageJS("review/translationButtons.js");
	if (settings["revLowestDistCircle"] || settings["revAccessDistCircle"] || settings["revMap2ZoomLevel"] || settings["revS2Cell"] || settings["revEditOrigLoc"] || settings["ctrlessZoom"] || settings["revMap2ZoomLevel"] != -1 || settings["revBigMaps"])
		addPageJS("review/mapMods.js");
	if (settings["revKeyboard"])
		addPageJS("review/keyboardCtrl.js");
	if (settings["revPresets"])
		addPageJS("review/presets.js");
	if (settings["revQuickSubmit"])
		addPageJS("review/quickSubmit.js");
	
	addPageJS("review/main.js", true);

	console.log("[WayFarer+] Review page injection successful!");
}
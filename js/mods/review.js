function modReviewPage(settings){
	if (settings["revS2Cell"] != -1 || settings["revSecondS2Cell"] != -1)
		addPageJS("libs/S2.js");

	var newCss = document.createElement("link");
	newCss.setAttribute("rel", "stylesheet");
	newCss.setAttribute("href", chrome.extension.getURL("assets/review.css"));
	document.getElementsByTagName("head")[0].appendChild(newCss);

	if (settings["profRecordReviews"]) {
		addPageJS("general/reviewHistory.js");
		addPageJS("review/recordReviews.js");
	}
	if (settings["revExpireTimer"] || settings["revSubmitTimer"] > 0)
		addPageJS("review/timerMods.js");
	if (settings["revCardView"] === "compact")
		addPageJS("review/compactCards.js");
	if (settings["revCardView"] === "extended")
		addPageJS("review/expandedCards.js");
	if (settings["revOpenIn"]) {
		addPageJS("general/mapButtons.js");
		addPageJS("review/mapButtons.js");
	}
	if (settings["revTranslate"] || settings["revTranslateAll"])
		addPageJS("review/translationButtons.js");
	if (settings["revLowestDistCircle"] || settings["revAccessDistCircle"] || settings["revMap2ZoomLevel"] || settings["revS2Cell"] != -1 || settings["revSecondS2Cell"] != -1 || settings["revEditOrigLoc"] || settings["ctrlessZoom"] || settings["revMap2ZoomLevel"] != -1 || settings["revBigMaps"] || settings["rev3DMap"]) {
		addPageJS("general/mapMods.js");
		addPageJS("review/mapMods.js");
	}
	if (settings["revKeyboard"])
		addPageJS("review/keyboardCtrl.js");
	if (settings["revPresets"])
		addPageJS("review/presets.js");
	if (settings["revQuickSubmit"])
		addPageJS("review/quickSubmit.js");
	if (settings["revAutoRetry"])
		addPageJS("review/autoRetry.js");
	if (settings["revLoadNotify"])
		addPageJS("review/loadNotify.js");
	
	addPageJS("review/main.js", true);

	console.log("[WayFarer+] Review page injection successful!");
}
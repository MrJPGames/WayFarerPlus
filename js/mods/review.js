function modReviewPage(settings){
	var newScript = document.createElement("script");
	newScript.src = chrome.extension.getURL("pageJs/libs/S2.js");
	document.getElementsByTagName("head")[0].appendChild(newScript);

	var newScript = document.createElement("script");
	newScript.src = chrome.extension.getURL("pageJs/review.js");
	document.getElementsByTagName("head")[0].appendChild(newScript);

	var newCss = document.createElement("link");
	newCss.setAttribute("rel", "stylesheet");
	newCss.setAttribute("href", chrome.extension.getURL("assets/review.css"));
	document.getElementsByTagName("head")[0].appendChild(newCss);

	if (settings["revExpireTimer"]){
		var header = document.getElementsByClassName("niantic-wayfarer-logo")[0];
		var headerTimer = document.createElement("div");
		headerTimer.innerText = "Time remaining: ";
		headerTimer.setAttribute("style", "display: inline-block; margin-left: 5em;");
		headerTimer.setAttribute("class", "revExprTimer");
		var timerDiv = document.createElement("div");
		timerDiv.id = "portalReviewTimer";
		headerTimer.appendChild(timerDiv);
		header.parentNode.appendChild(headerTimer);
	}
	
	console.log("[WayFarer+] Review page mod loaded!");
}
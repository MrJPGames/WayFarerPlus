function modReviewPage(){
	var newScript = document.createElement("script");
	newScript.src = chrome.extension.getURL("pageJs/review.js");
	document.getElementsByTagName("head")[0].appendChild(newScript);

	var header = document.getElementsByClassName("niantic-wayfarer-logo")[0];
	var headerTimer = document.createElement("div");
	headerTimer.innerText = "Time remaining: ";
	headerTimer.setAttribute("style", "display: inline-block; margin-left: 5em; color: white;");
	var timerDiv = document.createElement("div");
	timerDiv.id = "portalReviewTimer";
	headerTimer.appendChild(timerDiv);
	header.parentNode.appendChild(headerTimer);

	console.log("[WayFarer+] Review page mod loaded!");
}
function modHeader(settings){
	var newScript = document.createElement("script");
	newScript.src = chrome.extension.getURL("pageJs/header.js");
	document.getElementsByTagName("head")[0].appendChild(newScript);

	console.log("[WayFarer+] Header mod loaded!");
}
function modProfilePage(settings){
	var newScript = document.createElement("script");
	newScript.src = chrome.extension.getURL("pageJs/profile.js");
	document.getElementsByTagName("head")[0].appendChild(newScript);
	
	console.log("[WayFarer+] Profile page mod loaded!");
}
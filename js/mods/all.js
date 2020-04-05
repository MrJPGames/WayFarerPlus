function modAll(settings){
	var newCss = document.createElement("link");
	newCss.setAttribute("rel", "stylesheet");
	newCss.setAttribute("href", chrome.extension.getURL("assets/all.css"));
	document.getElementsByTagName("head")[0].appendChild(newCss);

	addPageJS("all/changelog.js");

	console.log("[WayFarer+] Global script initiated!");
}
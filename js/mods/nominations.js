function modNominationPage(){
	var newScript = document.createElement("script");
	newScript.src = chrome.extension.getURL("pageJs/nominations.js");
	document.getElementsByTagName("head")[0].appendChild(newScript);

	console.log("[WayFarer+] Nominations page mod loaded!");

	//Get map elem, and add custom StreetView element
	var newMapElem = document.createElement("div");
	newMapElem.setAttribute("id", "pano");
	newMapElem.setAttribute("class", "nomination-map");

	//Add to document
	var map = document.getElementById("map");
	map.parentNode.insertBefore(newMapElem, map.nextSibling);

	//Create street view title element
	var svTitleElem = document.createElement("div");
	svTitleElem.setAttribute("class", "nomination-category-header");
	svTitleElem.innerText = "Streetview: (Review preview)";

	//Add title to page:
	map.parentNode.insertBefore(svTitleElem, newMapElem);

	var observer = new MutationObserver(function (mutations) {
	    mutations.forEach(function (mutation) {
	        if (!mutation.addedNodes) {
	            return;
	        }
	        var nodes = mutation.addedNodes;
	        nodes.forEach(function(node,i){
	        	if (node.className == "nomination card ng-scope" || node.className == "nomination card ng-scope --selected"){
	        		node.setAttribute("onclick", "setStreetView();");
	        	}
	        });
	    });
	});

	observer.observe(document.body, {
	    childList: true,
	    subtree: true,
			queries: [{element: "#map"}]
	});
}
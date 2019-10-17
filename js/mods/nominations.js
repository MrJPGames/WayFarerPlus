function modNominationPage(settings){
	var newScript = document.createElement("script");
	newScript.src = chrome.extension.getURL("pageJs/nominations.js");
	document.getElementsByTagName("head")[0].appendChild(newScript);

	var newCss = document.createElement("link");
	newCss.setAttribute("rel", "stylesheet");
	newCss.setAttribute("href", chrome.extension.getURL("assets/nominations.css"));
	document.getElementsByTagName("head")[0].appendChild(newCss);

	console.log("[WayFarer+] Nominations page mod loaded!");

	//In separate function for future readability if more mods are added
	if (settings["nomStreetView"]){
		addStreetView();
	}
	if (settings["nomStats"]){
		addStats();
	}
}

function addStreetView(){
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

function addStats(){
	//Create required HTML (Content is written from the pageJS as NominationController access is required!)
	var container = document.createElement("div");
	container.setAttribute("class", "wrap-collabsible");

	var collapsibleInput = document.createElement("input");
	collapsibleInput.id = "collapsible";
	collapsibleInput.setAttribute("class", "toggle");
	collapsibleInput.type = "checkbox";

	var collapsibleLabel = document.createElement("label");
	collapsibleLabel.setAttribute("class", "lbl-toggle");
	collapsibleLabel.innerText = "View Nomination Stats";
	collapsibleLabel.setAttribute("for", "collapsible");

	var collapsibleContent = document.createElement("div");
	collapsibleContent.setAttribute("class", "collapsible-content");

	var contentInner = document.createElement("div");
	contentInner.setAttribute("class", "content-inner");
	contentInner.id = "nomStats";
	contentInner.innerText = "Loading...";

	collapsibleContent.appendChild(contentInner);

	container.appendChild(collapsibleInput);
	container.appendChild(collapsibleLabel);
	container.appendChild(collapsibleContent);

	var elem = document.getElementsByTagName("section")[0];
	elem.insertBefore(container, elem.children[0]);
}
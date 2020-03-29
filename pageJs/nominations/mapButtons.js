var customMapContainer;

function initMapButtons(){
	//Create main dropdown menu ("button")
	var mainButton = document.createElement("div");
	mainButton.setAttribute("class", "dropdown");

	var buttonText = document.createElement("span");
	buttonText.innerText = "Open in ...";

	var dropdownContainer = document.createElement("div");
	dropdownContainer.setAttribute("class", "dropdown-content");

	mainButton.appendChild(buttonText);
	mainButton.appendChild(dropdownContainer);

	var mapElem = document.getElementById("map");
	mapElem.parentNode.insertBefore(mainButton, mapElem.nextSibling);


	customMapContainer = dropdownContainer;
}

function updateCustomMaps(){
	customMapContainer.innerHTML = null;

    var customMaps = JSON.parse(settings["customMaps"]);

    for (var i=0; i < customMaps.length; i++){
    	var title = customMaps[i].title;
    	var link = customMaps[i].url;

    	//Link editing:
    	link = link.replaceAll("%lat%", nomCtrl.currentNomination.lat);
    	link = link.replaceAll("%lng%", nomCtrl.currentNomination.lng);
    	link = link.replaceAll("%title%", nomCtrl.currentNomination.title);

    	var button = document.createElement("a");
    	button.href = link;
    	if (settings["keepTab"])
            button.setAttribute("target", getStringHash(customMaps[i].url)); //On URL with placeholders as those are the same between different wayspots but not between different maps!
        else
            button.setAttribute("target", "_BLANK");
    	button.innerText = title;
    	customMapContainer.appendChild(button);
    }

    if (customMaps.length == 0){
    	var emptySpan = document.createElement("span");
    	emptySpan.innerText = "No custom maps set!";
    	customMapContainer.appendChild(emptySpan);
    }
}

//NON-SECURE (But good enough for uniqueID on URLs)
function getStringHash(str){
	var hash = 0;
	if (str.length == 0) {
	    return hash;
	}
	for (var i = 0; i < str.length; i++) {
	    var char = str.charCodeAt(i);
	    hash = ((hash<<5)-hash)+char;
	    hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}

document.addEventListener("WFPNomCtrlHooked", initMapButtons, false);
document.addEventListener("WFPNomSelected", updateCustomMaps, false);

//Needed entering variables into URLs
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'gi'), replacement);
};
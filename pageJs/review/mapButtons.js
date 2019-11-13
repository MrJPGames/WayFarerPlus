function loadMapButtons(){
    if (settings["revGoogleMaps"])
        addGoogleMapsButton();
    if (settings["revIntelButton"])
        addIntelButton();
}

function addIntelButton(){
	var latLng = nSubCtrl.pageData.lat + "," + nSubCtrl.pageData.lng;
    addMapButton("https://intel.ingress.com/intel?z=18&pll=" + latLng + "&ll=" + latLng,
                 "Open in Intel");
}

function addGoogleMapsButton(){
    addMapButton("https://maps.google.com/maps?q=" + nSubCtrl.pageData.lat + "," + nSubCtrl.pageData.lng,
                 "Open in Google Maps");
}

function addMapButton(mapUrl, text, buttonID){
	//Create button
    var button = document.createElement("a");
    button.setAttribute("class", "customMapButton");
    button.setAttribute("target", "_BLANK");
    button.setAttribute("id", buttonID);
    button.href = mapUrl;
    button.innerText = text;

    //Add elem to page
    switch (nSubCtrl.reviewType){
    	case "NEW":
		    var cardFooterElems = document.getElementsByClassName("card__footer");
		    var cardFooterElem = cardFooterElems[cardFooterElems.length-1];
		    cardFooterElem.insertBefore(button, cardFooterElem.children[0]);
		    break;
		case "EDIT":
			var infoCard = document.getElementsByClassName("known-information-card")[0];
			infoCard.style.display = "inline-block";
			infoCard.appendChild(button);
	}
}

document.addEventListener("WFPNSubCtrlHooked", loadMapButtons);
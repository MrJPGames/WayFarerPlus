function initMapButtons(){
	//Create main dropdown menu ("button")
	var mainButton = getMapDropdown(nomCtrl.currentNomination.lat, nomCtrl.currentNomination.lng, nomCtrl.currentNomination.title);

	var mapElem = document.getElementById("map");
	mapElem.parentNode.insertBefore(mainButton, mapElem.nextSibling);
}

document.addEventListener("WFPNomCtrlHooked", initMapButtons, false);
document.addEventListener("WFPNomSelected", updateCustomMaps, false);
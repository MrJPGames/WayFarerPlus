function setMapButtons(){
	setIntelButton();
	setGoogleMapsButton();
}

function setIntelButton(){
    var latLng = nomCtrl.currentNomination.lat + "," + nomCtrl.currentNomination.lng;
    setMapButtonURL("https://intel.ingress.com/intel?z=18&ll=" + latLng + "&pll=" + latLng,
                    "IIButton");
}

function setGoogleMapsButton(){
    setMapButtonURL("https://maps.google.com/maps?q=" + nomCtrl.currentNomination.lat + "," + nomCtrl.currentNomination.lng + "%20(" + encodeURI(nomCtrl.currentNomination.title) + ")",
                    "gMapButton");
}

function setMapButtonURL(mapUrl, id){
    var elem = document.getElementById(id);

    elem.href = mapUrl;
}


document.addEventListener("WFPNomSelected", setMapButtons, false);
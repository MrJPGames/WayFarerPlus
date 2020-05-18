let S2MainMapOverlay, S2SVMapOverlay;

function applyMapMods(){
    var lat = nomCtrl.currentNomination.lat;
    var lng = nomCtrl.currentNomination.lng;
    //Map circles
    if (settings["nomLowestDistCircle"]){
        addLowestDistCircle(nomCtrl.map, lat, lng);
        //SVMap is exported by the nomStreetView mod when active
        if (SVMap !== undefined)
            addLowestDistCircle(SVMap, lat, lng);
    }
    if (settings["nomAccessDistCircle"]){
        addAccessDistCircle(nomCtrl.map, lat, lng);
        //SVMap is exported by the nomStreetView mod when active
        if (SVMap !== undefined)
            addAccessDistCircle(SVMap, lat, lng);
    }
    if (settings["nomMinDistCircle"]){
        addMinDistCircle(nomCtrl.map, lat, lng);
        //SVMap is exported by the nomStreetView mod when active
        if (SVMap !== undefined)
            addMinDistCircle(SVMap, lat, lng);
    }

    //Ctrl-less zoom
    if (settings["ctrlessZoom"])
        mapsRemoveCtrlToZoom();

    //S2 cell
    if (settings["nomS2Cell"] !== -1 || settings["nomSecondS2Cell"] !== -1){
        addS2Overlay(nomCtrl.map, settings["nomS2Cell"], "#00FF00", settings["nomSecondS2Cell"], "#E47252");

        //SVMap is exported by the nomStreetView mod when active
        if (SVMap !== undefined){
            addS2Overlay(SVMap, settings["nomS2Cell"], "#00FF00", settings["nomSecondS2Cell"], "#E47252");
        }
    }
}

function mapsRemoveCtrlToZoom(){
    mapRemoveCtrlZoom(nomCtrl.map);
    //SVMap is exported by the nomStreetView mod when active
    if (SVMap !== undefined)
        mapRemoveCtrlZoom(SVMap);
}

document.addEventListener("WFPNomSelected", applyMapMods, false);
document.addEventListener("WFPNomCtrlHooked", function(){
    S2MainMapOverlay = new S2Overlay();
    S2SVMapOverlay = new S2Overlay();
}, false);
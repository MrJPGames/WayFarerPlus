let S2MainMapOverlay, S2SVMapOverlay;

function applyMapMods(){
    var lat = nomCtrl.currentNomination.lat;
    var lng = nomCtrl.currentNomination.lng;
    //Map circles
    if (settings["nomLowestDistCircle"]){
        addLowestDistCircle(nomCtrl.map, lat, lng);
        //SVMap is exported by the nomStreetView mod when active
        if (typeof SVMap !== 'undefined')
            addLowestDistCircle(SVMap, lat, lng);
    }
    if (settings["nomAccessDistCircle"]){
        addAccessDistCircle(nomCtrl.map, lat, lng);
        //SVMap is exported by the nomStreetView mod when active
        if (typeof SVMap !== 'undefined')
            addAccessDistCircle(SVMap, lat, lng);
    }
    if (settings["nomMinDistCircle"]){
        addMinDistCircle(nomCtrl.map, lat, lng);
        //SVMap is exported by the nomStreetView mod when active
        if (typeof SVMap !== 'undefined')
            addMinDistCircle(SVMap, lat, lng);
    }

    //Ctrl-less zoom
    if (settings["ctrlessZoom"])
        mapsRemoveCtrlToZoom();

    //S2 cell
    if (settings["nomS2Cell"] !== -1 || settings["nomSecondS2Cell"] !== -1){
        addS2Overlay(nomCtrl.map, settings["nomS2Cell"], settings["nomS2Color"], settings["nomSecondS2Cell"], settings["nomS2SecondColor"]);
        if (settings["nomHighlightCell"]){
            addS2Highlight(nomCtrl.map, settings["nomS2Cell"], settings["nomS2Color"], nomCtrl.currentNomination.lat, nomCtrl.currentNomination.lng);
        }

        //SVMap is exported by the nomStreetView mod when active
        if (typeof SVMap !== 'undefined'){
            addS2Overlay(SVMap, settings["nomS2Cell"], settings["nomS2Color"], settings["nomSecondS2Cell"], settings["nomS2SecondColor"]);
            if (settings["nomHighlightCell"]){
                addS2Highlight(SVMap, settings["nomS2Cell"], settings["nomS2Color"], nomCtrl.currentNomination.lat, nomCtrl.currentNomination.lng);
            }
        }


    }
}

function mapsRemoveCtrlToZoom(){
    console.log("rem");
    mapRemoveCtrlZoom(nomCtrl.map);
    //SVMap is exported by the nomStreetView mod when active
    if (typeof SVMap !== 'undefined')
        mapRemoveCtrlZoom(SVMap);
}

document.addEventListener("WFPNomSelected", applyMapMods, false);
document.addEventListener("WFPNomCtrlHooked", function(){
    S2MainMapOverlay = new S2Overlay();
    S2SVMapOverlay = new S2Overlay();
}, false);
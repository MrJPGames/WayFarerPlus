function applyMapMods(){
    //Map circles
    if (settings["nomLowestDistCircle"]){
        addLowestDistCircle(nomCtrl.map);
        //SVMap is exported by the nomStreetView mod when active
        if (SVMap != undefined)
            addLowestDistCircle(SVMap);
    }
    if (settings["nomAccessDistCircle"]){
        addAccessDistCircle(nomCtrl.map);
        //SVMap is exported by the nomStreetView mod when active
        if (SVMap != undefined)
            addAccessDistCircle(SVMap);
    }

    //Ctrl-less zoom
    if (settings["ctrlessZoom"])
        mapsRemoveCtrlToZoom();

    //S2 cell
    if (settings["nomS2Cell"] != -1){
        addS2(nomCtrl.map, settings["nomS2Cell"]);
        //SVMap is exported by the nomStreetView mod when active
        if (SVMap != undefined)
            addS2(SVMap, settings["nomS2Cell"]);
    }
    if (settings["nomSecondS2Cell"] != -1){
        addS2(nomCtrl.map, settings["nomSecondS2Cell"], "#E47252");
        //SVMap is exported by the nomStreetView mod when active
        if (SVMap != undefined)
            addS2(SVMap, settings["nomSecondS2Cell"], "#E47252");
    }
}

function addLowestDistCircle(gMap){ 
    var latLng = new google.maps.LatLng(nomCtrl.currentNomination.lat, nomCtrl.currentNomination.lng);
    var c = new google.maps.Circle({
        map: gMap,
        center: latLng,
        radius: 20,
        strokeColor: 'red',
        fillColor: 'red',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillOpacity: 0.2
    });
}

function addAccessDistCircle(gMap){
    var latLng = new google.maps.LatLng(nomCtrl.currentNomination.lat, nomCtrl.currentNomination.lng);
    var c = new google.maps.Circle({
        map: gMap,
        center: latLng,
        radius: 40,
        strokeColor: 'green',
        strokeOpacity: 1,
        strokeWeight: 2,
        fillOpacity: 0
    });
}


function mapsRemoveCtrlToZoom(){
    var options = {
        scrollwheel: true,
        gestureHandling: 'greedy'
    };
    nomCtrl.map.setOptions(options);
    //SVMap is exported by the nomStreetView mod when active
    if (SVMap != undefined)
        SVMap.setOptions(options);
}

function addS2(map, lvl, colCode = '#00FF00'){
    var lat = nomCtrl.currentNomination.lat;
    var lng = nomCtrl.currentNomination.lng;

    var cell = window.S2.S2Cell.FromLatLng({lat: lat, lng: lng}, lvl);

    var cellCorners = cell.getCornerLatLngs();
    cellCorners[4] = cellCorners[0]; //Loop it

    var polyline = new google.maps.Polyline({
        path: cellCorners,
        geodesic: true,
        fillColor: 'grey',
        fillOpacity: 0.2,
        strokeColor: colCode,
        strokeOpacity: 1.0,
        strokeWeight: 1,
        map: map
    });
}


document.addEventListener("WFPNomSelected", applyMapMods, false);
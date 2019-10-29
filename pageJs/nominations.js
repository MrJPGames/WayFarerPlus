var nomCtrl, SVMap;

setupPage();

function setupPage(){
    var nomCtrlDiv = document.getElementsByClassName("nominations-controller")[0];
    nomCtrl = angular.element(nomCtrlDiv).scope().nomCtrl;
    if (nomCtrl == undefined){
        //Retry until page is loaded far enough to grab nomination controller
        setTimeout(setupPage, 100);
    }else{
        console.log("[WayFarer+] Hooked NominationsController to nomCtrl");
        if (settings["nomStats"])
            loadStats();
    }
}

function selectNomination(){
    if (settings["nomStreetView"])
        setStreetView();
    if (settings["nomLowestDistCircle"]){
        addLowestDistCircle(nomCtrl.map);
        addLowestDistCircle(SVMap);
    }
    if (settings["nomAccessDistCircle"]){
        addAccessDistCircle(nomCtrl.map);
        addAccessDistCircle(SVMap);
    }
    if (settings["nomIntelButton"]){
        addIntelButton();
    }
    if (settings["nomGoogleMaps"]){
        addGoogleMapsButton();
    }

    if (settings["nomS2Cell"] != -1)
        addS2(nomCtrl.map, settings["nomS2Cell"]);

    //Add lat long to page
    var locationTitle = document.getElementById("map").parentNode.children[0];
    locationTitle.innerText = "Location (" + nomCtrl.currentNomination.lat + ", " + nomCtrl.currentNomination.lng + "):";
}

function addS2(map, lvl){
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
        strokeColor: '#00FF00',
        strokeOpacity: 1.0,
        strokeWeight: 1,
        map: map
    });
}

function addIntelButton(){
    setMapButtonURL("https://intel.ingress.com/intel?z=18&ll=" + nomCtrl.currentNomination.lat + "," + nomCtrl.currentNomination.lng,
                    "IIButton");
}

function addGoogleMapsButton(){
    setMapButtonURL("https://maps.google.com/maps?q=" + nomCtrl.currentNomination.lat + "," + nomCtrl.currentNomination.lng + "%20(" + encodeURI(nomCtrl.currentNomination.title) + ")",
                    "gMapButton");
}

function setMapButtonURL(mapUrl, id){
    var elem = document.getElementById(id);

    elem.href = mapUrl;
}

function setStreetView(){ 
	var lat = nomCtrl.currentNomination.lat; 
	var lng = nomCtrl.currentNomination.lng;

	SVMap = new google.maps.Map(document.getElementById("pano"),{
        center: {
            lat: lat,
            lng: lng
        },
        mapTypeId: "hybrid",
        zoom: 17,
        scaleControl: true,
        scrollwheel: true,
        gestureHandling: 'greedy',
        mapTypeControl: false
    });
    var marker = new google.maps.Marker({
        map: SVMap,
        position: {
            lat: parseFloat(lat),
            lng: parseFloat(lng)
        },
        title: nomCtrl.currentNomination.title
    });
    var panorama = SVMap.getStreetView();
    var client = new google.maps.StreetViewService;
    client.getPanoramaByLocation({
        lat: lat,
        lng: lng
    }, 50, function(result, status) {
        if (status === "OK") {
            var point = new google.maps.LatLng(lat,lng);
            var oldPoint = point;
            point = result.location.latLng;
            var heading = google.maps.geometry.spherical.computeHeading(point, oldPoint);
            panorama.setPosition(point);
            panorama.setPov({
                heading: heading,
                pitch: 0,
                zoom: 1
            });
            panorama.setMotionTracking(false);
            panorama.setVisible(true);
        }
    });

    if (settings["ctrlessZoom"])
        mapsRemoveCtrlToZoom();

    console.log("[WayFarer+] Setting Nomination Streetview image"); 
}

function mapsRemoveCtrlToZoom(){
    var options = {
        scrollwheel: true,
        gestureHandling: 'greedy'
    };
    nomCtrl.map.setOptions(options);
    SVMap.setOptions(options);
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

function loadStats(){
    if (!nomCtrl.loaded){
        setTimeout(loadStats, 100);
        return;
    }

    var elem = document.getElementById("nomStats");

    var nomCount = nomCtrl.nomList.length;

    var acceptedCount = 0;
    var deniedCount = 0;
    var inVoteCount = 0;
        var inVoteUpgradeCount = 0;
    var inQueueCount = 0;
        var inQueueUpgradeCount = 0;
    var dupeCount = 0;
    var withdrawnCount = 0;

    var availableNominations = 0;
    if (settings["accIngress"])
        availableNominations += 14;
    if (settings["accPoGo"])
        availableNominations += 7;


    var unlocks = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]; // Array that stores the amount of nomination unlocks for every day for the upcomming 14 days

    for(var i = 0; i < nomCount; i++){
        //Keep track of basic counting stats
        switch (nomCtrl.nomList[i].status){
            case "NOMINATED":
                inQueueCount++;
                if (nomCtrl.nomList[i].upgraded)
                    inQueueUpgradeCount++;
                break;
            case "VOTING":
                inVoteCount++;
                if (nomCtrl.nomList[i].upgraded)
                    inVoteUpgradeCount++;
                break;
            case "REJECTED":
                deniedCount++;
                break;
            case "ACCEPTED":
                acceptedCount++;
                break;
            case "DUPLICATE":
                dupeCount++;
                break;
            case "WITHDRAWN":
                withdrawnCount++;
                break;
            default:
                console.log("[WayFarer+] Encountered unknown status: " + nomCtrl.nomList[i].status);
                break;
        }

        //Available nomination determinations & new unlock date determinations
        var nomAge = daysSince(nomCtrl.nomList[i].day);
        if (nomAge < 14 && nomCtrl.nomList[i].status != "WITHDRAWN"){
            availableNominations--;

            unlocks[13-nomAge]++;
        }
    }

    var html =  "Total Nominations: " + parseInt(nomCount) +
                "<br/>Accepted: " + parseInt(acceptedCount) +
                "<br/>Rejected: " + parseInt(deniedCount) +
                "<br/>Withdrawn: " + parseInt(withdrawnCount) +
                "<br/>Duplicates: " + parseInt(dupeCount) +
                "<br/>In Voting: " + parseInt(inVoteCount) + " (" + parseInt(inVoteUpgradeCount) + " upgraded)" +
                "<br/>In Queue: " + parseInt(inQueueCount) + " (" + parseInt(inQueueUpgradeCount) + " upgraded)" +
                "<br/><br/>Nominations available: " + parseInt(availableNominations) +
                "<br/>Nomination unlocks:";


    var currentDay = new Date();
    if (unlocks != [0,0,0,0,0,0,0,0,0,0,0,0,0,0]){
        //Start table and create header
        html += "<table><thead><tr><th>Date (Y-M-D)</th><th># of unlocks</th></tr></thead><tbody>";

        for (var i = 0; i < unlocks.length; i++){
            if (unlocks[i] != 0){
                html += "<tr><td>" + currentDay.toISOString().substring(0, 10) + "</td><td>" + unlocks[i] + "</td></tr>";
            }
            currentDay.setDate(currentDay.getDate()+1);
        }
        //end table
        html += "</tbody></table>";
    }

    elem.innerHTML = html;

}

function daysSince(date2){
    var date1 = Date.now();
    date2 = new Date(date2);
    var diffTime = Math.abs(date2 - date1);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}
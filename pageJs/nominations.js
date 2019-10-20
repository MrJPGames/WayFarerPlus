var nomCtrl;

setupPage();

function setupPage(){
    var nomCtrlDiv = document.getElementsByClassName("nominations-controller")[0];
    nomCtrl = angular.element(nomCtrlDiv).scope().nomCtrl;
    if (nomCtrl == undefined){
        //Retry until page is loaded far enough to grab nomination controller
        setTimeout(setupPage, 100);
    }else{
        console.log("[WayFarer+] Hooked NominationsController to nomCtrl");
        if (settings["nomStats"]){
            loadStats();
        }
    }
}

function setStreetView(){ 
	var lat = nomCtrl.currentNomination.lat; 
	var lng = nomCtrl.currentNomination.lng;

	var map = new google.maps.Map(document.getElementById("pano"),{
        center: {
            lat: lat,
            lng: lng
        },
        mapTypeId: "hybrid",
        zoom: 17,
        scaleControl: true,
        mapTypeControl: false
    });
    var marker = new google.maps.Marker({
        map: map,
        position: {
            lat: parseFloat(lat),
            lng: parseFloat(lng)
        },
        title: nomCtrl.currentNomination.title
    });
    var panorama = map.getStreetView();
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
            //imageDate = result.imageDate;
            //$scope.$apply
        }
    });
    panorama = panorama;
    map = map;


    console.log("[WayFarer+] Setting Nomination Streetview image"); 
};

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

    var oldestRecentNomination = -1;

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

        //Available nomination determinations
        var nomAge = daysSince(nomCtrl.nomList[i].day);
        if (nomAge < 14){
            availableNominations--;

            if (nomAge > oldestRecentNomination){
                oldestRecentNomination = nomAge;
            }
        }
    }    

    elem.innerHTML = "Total Nominations: " + parseInt(nomCount) +
                     "<br/>Accepted: " + parseInt(acceptedCount) +
                     "<br/>Rejected: " + parseInt(deniedCount) +
                     "<br/>Withdrawn: " + parseInt(withdrawnCount) +
                     "<br/>Duplicates: " + parseInt(dupeCount) +
                     "<br/>In Voting: " + parseInt(inVoteCount) + " (" + parseInt(inVoteUpgradeCount) + " upgraded)" +
                     "<br/>In Queue: " + parseInt(inQueueCount) + " (" + parseInt(inQueueUpgradeCount) + " upgraded)" +
                     "<br/><br/>Nominations available: " + parseInt(availableNominations);

    if (oldestRecentNomination != -1){
        elem.innerHTML += "<br/>Day(s) until new nomination unlocks: " + (13-parseInt(oldestRecentNomination));
    }
}

function daysSince(date2){
    var date1 = Date.now();
    date2 = new Date(date2);
    var diffTime = Math.abs(date2 - date1);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}
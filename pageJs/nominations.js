var nomCtrl;

setupPage();

function setupPage(){
    var nomCtrlDiv = document.getElementsByClassName("nominations-controller")[0];
    nomCtrl = angular.element(nomCtrlDiv).scope().nomCtrl;
    if (nomCtrl == undefined){
        //Retry until page is loaded far enough to grab nomination controller
        setTimeout(setupPage, 250);
    }else{
        console.log("[WayFarer+] Hooked NominationsController to nomCtrl");
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
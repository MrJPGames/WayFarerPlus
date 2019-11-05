var pCtrl;

setupPage();

function setupPage(){
    pCtrl = angular.element(document.getElementById("ProfileController")).scope().profileCtrl;
    if (pCtrl == undefined || pCtrl.loaded == false){
        //Retry until page is loaded far enough to grab nomination controller
        setTimeout(setupPage, 100);
    }else{
        console.log("[WayFarer+] Hooked ProfileController to pCtrl");

        var modEvent = new Event("WFPPCtrlHooked");
        document.dispatchEvent(modEvent);
    }
}
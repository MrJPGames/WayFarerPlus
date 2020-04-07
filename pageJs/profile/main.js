var pCtrl;

setupPage();
function setupPage(){
    tempPCtrl = angular.element(document.getElementById("ProfileController")).scope().profileCtrl;
    if (tempPCtrl == undefined || tempPCtrl.loaded == false){
        //Retry until page is loaded far enough to grab nomination controller
        setTimeout(setupPage, 100);
    }else{
    	pCtrl = tempPCtrl;
        console.log("[WayFarer+] Hooked ProfileController to pCtrl");

        var modEvent = new Event("WFPPCtrlHooked");
        document.dispatchEvent(modEvent);
    }
}
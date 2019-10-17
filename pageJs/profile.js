var pCtrl;

setupPage();

function setupPage(){
    pCtrl = angular.element(document.getElementById("ProfileController")).scope().profileCtrl;
    if (pCtrl == undefined){
        //Retry until page is loaded far enough to grab nomination controller
        setTimeout(setupPage, 250);
    }else{
        console.log("[WayFarer+] Hooked ProfileController to pCtrl");
        init();
    }
}

function init(){
	var agreementTotal = (pCtrl.rewards.total + pCtrl.rewards.available) * pCtrl.rewards.interval + pCtrl.rewards.progress;
}
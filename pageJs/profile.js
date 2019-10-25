var pCtrl;

setupPage();

function setupPage(){
    pCtrl = angular.element(document.getElementById("ProfileController")).scope().profileCtrl;
    if (pCtrl == undefined || pCtrl.loaded == false){
        //Retry until page is loaded far enough to grab nomination controller
        setTimeout(setupPage, 100);
    }else{
        console.log("[WayFarer+] Hooked ProfileController to pCtrl");
        if (settings["profExtendedStats"])
        	init();
    }
}

function init(){
	//Segment for "Processed _and_ Agreement stat"
	var agreementTotal = (pCtrl.rewards.total + pCtrl.rewards.available) * pCtrl.rewards.interval + pCtrl.rewards.progress;

	var agreementStatElem = document.createElement("h4");

	var agreementStatLeft = document.createElement("span");
	agreementStatLeft.setAttribute("class", "stats-left");
	var agreementStatRight = document.createElement("span");
	agreementStatRight.setAttribute("class", "stats-right");

	agreementStatLeft.innerHTML = "Processed <u>and</u> Agreement";
	agreementStatRight.innerText = agreementTotal;

	agreementStatElem.appendChild(agreementStatLeft);
	agreementStatElem.appendChild(agreementStatRight);

	var profileStats = document.getElementById("profile-stats");
	profileStats.insertBefore(agreementStatElem, profileStats.children[1]);

	//Segment for "Other Agreements"
	var normalAgreements = parseInt(profileStats.children[2].children[1].innerText) + parseInt(profileStats.children[3].children[1].innerText);

	var otherAgreements = agreementTotal - normalAgreements;

	var otherAgreementsElem = document.createElement("h4");

	var otherAgreementsElem = document.createElement("span");
	otherAgreementsElem.setAttribute("class", "stats-left");
	var otherAgreementStatRight = document.createElement("span");
	otherAgreementStatRight.setAttribute("class", "stats-right");

	otherAgreementsElem.innerHTML = "Other Agreements";
	otherAgreementStatRight.innerText = otherAgreements;

	otherAgreementsElem.appendChild(otherAgreementsElem);
	otherAgreementsElem.appendChild(otherAgreementStatRight);

	profileStats.insertBefore(otherAgreementsElem, profileStats.children[2]);
}
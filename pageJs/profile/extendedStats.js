function addExtendedStats(){
	//Get data from page before modifying it
	var profileStats = document.getElementById("profile-stats");
	var normalAgreements = parseInt(profileStats.children[1].children[1].children[1].innerText) + parseInt(profileStats.children[1].children[2].children[1].innerText) + parseInt(profileStats.children[1].children[3].children[1].innerText);

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

	profileStats.children[1].insertBefore(agreementStatElem, profileStats.children[1].children[1]);

	//Segment for "Other Agreements"
	

	var otherAgreements = agreementTotal - normalAgreements;
	console.log(normalAgreements);

	var otherAgreementsElem = document.createElement("h4");

	var otherAgreementStatLeft = document.createElement("span");
	otherAgreementStatLeft.setAttribute("class", "stats-left");
	var otherAgreementStatRight = document.createElement("span");
	otherAgreementStatRight.setAttribute("class", "stats-right");

	otherAgreementStatLeft.innerHTML = "Other Agreements";
	otherAgreementStatRight.innerText = otherAgreements;

	otherAgreementsElem.appendChild(otherAgreementStatLeft);
	otherAgreementsElem.appendChild(otherAgreementStatRight);

	profileStats.children[1].appendChild(otherAgreementsElem);

	//if Ingress agent add recon badge progress to page:
	if (settings["accIngress"]){
		const reconBadge = { 100: 'Bronze', 750: 'Silver', 2500: 'Gold', 5000: 'Platin', 10000: 'Black' }
	}
}


document.addEventListener("WFPPCtrlHooked", addExtendedStats, false);
function addExtendedStats(){
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

	var otherAgreementStatLeft = document.createElement("span");
	otherAgreementStatLeft.setAttribute("class", "stats-left");
	var otherAgreementStatRight = document.createElement("span");
	otherAgreementStatRight.setAttribute("class", "stats-right");

	otherAgreementStatLeft.innerHTML = "Other Agreements";
	otherAgreementStatRight.innerText = otherAgreements;

	otherAgreementsElem.appendChild(otherAgreementStatLeft);
	otherAgreementsElem.appendChild(otherAgreementStatRight);

	profileStats.insertBefore(otherAgreementsElem, profileStats.children[4]);

	//if Ingress agent add recon badge progress to page:
	if (settings["accIngress"]){
		const reconBadges = [ [0, 'None'], [100, 'Bronze'], [750, 'Silver'], [2500, 'Gold'], [5000, 'Platinum'], [10000, 'Onyx'] ];

		var badge = 0;
		for (var i=1; i < reconBadges.length; i++){
			if (normalAgreements >= reconBadges[i][0]){
				badge = i;
			}
		}

		var curBadgeElem = document.createElement("h4");

		var curBadgeLeftElem = document.createElement("span");
		curBadgeLeftElem.setAttribute("class", "stats-left");
		var curBadgeRightElem = document.createElement("span");
		curBadgeRightElem.setAttribute("class", "stats-right");

		curBadgeLeftElem.innerText = "Recon Medal";
		curBadgeRightElem.innerText = reconBadges[badge][1];

		curBadgeElem.appendChild(curBadgeLeftElem);
		curBadgeElem.appendChild(curBadgeRightElem);

		profileStats.insertBefore(curBadgeElem, profileStats.children[2]);

		//Check if you don't already have the highest badge
		if (badge+1 <= reconBadges.length){
			var diff = reconBadges[badge+1][0]-reconBadges[badge][0]; //Agreements for next tier - agreements for current tier (= diff in agreements between tiers)
			var currDiff = normalAgreements-reconBadges[badge][0]; //User's current agreements - current badge tier agreement requirement (= agreements since last badge)

			var progress = Math.round((currDiff/diff)*100); //Get Progress %

			var badgeProgressElem = document.createElement("h4");

			var badgeProgressLeftElem = document.createElement("span");
			badgeProgressLeftElem.setAttribute("class", "stats-left");
			var badgeProgressRightElem = document.createElement("span");
			badgeProgressRightElem.setAttribute("class", "stats-right");

			badgeProgressLeftElem.innerText = "Progress to " + reconBadges[badge+1][1];
			badgeProgressRightElem.innerText = progress + "%";

			badgeProgressElem.appendChild(badgeProgressLeftElem);
			badgeProgressElem.appendChild(badgeProgressRightElem);

			profileStats.insertBefore(badgeProgressElem, profileStats.children[3]);
		}
	}
}


document.addEventListener("WFPPCtrlHooked", addExtendedStats, false);
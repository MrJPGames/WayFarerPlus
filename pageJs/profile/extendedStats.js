function addExtendedStats(){
	//Get data from page before modifying it
	var profileStats = document.getElementById("profile-stats");
	var reviewTotal = parseInt(profileStats.children[0].children[0].children[1].innerText);
	var acceptedAgreements = parseInt(profileStats.children[1].children[1].children[1].innerText);
	var rejectedAgreements = parseInt(profileStats.children[1].children[2].children[1].innerText);
	var duplicateAgreements = parseInt(profileStats.children[1].children[3].children[1].innerText);
	var normalAgreements =  acceptedAgreements + rejectedAgreements + duplicateAgreements;


	//Segment for "Processed _and_ Agreement stat"
	var agreementTotal = (pCtrl.profile.total + pCtrl.profile.available) * pCtrl.profile.interval + pCtrl.profile.progress;

	var agreementStatElem = document.createElement("h4");

	var agreementStatLeft = document.createElement("span");
	agreementStatLeft.setAttribute("class", "stats-left");
	var agreementStatRight = document.createElement("span");
	agreementStatRight.setAttribute("class", "stats-right");

	var underlinedText = document.createElement("span");
	underlinedText.style.textDecoration = "underline";
	underlinedText.innerText = "and";

	var procElem = document.createElement("span");
	procElem.innerText = "Processed ";
	agreementStatLeft.appendChild(procElem);
	agreementStatLeft.appendChild(underlinedText);
	var agreeElem = document.createElement("span");
	agreeElem.innerText = " Agreement";
	agreementStatLeft.appendChild(agreeElem);
	if (settings["profExtendedStats"] === "aprox")
		agreementStatRight.innerText = agreementTotal + " (" + Math.round(agreementTotal/reviewTotal*100) + "%)";
	else
		agreementStatRight.innerText = normalAgreements + " (" + Math.round(normalAgreements/reviewTotal*100) + "%)";


	agreementStatElem.appendChild(agreementStatLeft);
	agreementStatElem.appendChild(agreementStatRight);

	profileStats.children[1].insertBefore(agreementStatElem, profileStats.children[1].children[1]);

	var otherAgreements = agreementTotal - normalAgreements;
	if (settings["profExtendedStats"] === "aprox"){
		//Segment for "Other Agreements" display
		var otherAgreementsElem = document.createElement("h4");

		var otherAgreementStatLeft = document.createElement("span");
		otherAgreementStatLeft.setAttribute("class", "stats-left");
		var otherAgreementStatRight = document.createElement("span");
		otherAgreementStatRight.setAttribute("class", "stats-right");

		otherAgreementStatLeft.innerText = "Other Agreements";
		otherAgreementStatRight.innerText = otherAgreements;

		otherAgreementsElem.appendChild(otherAgreementStatLeft);
		otherAgreementsElem.appendChild(otherAgreementStatRight);

		profileStats.children[1].appendChild(otherAgreementsElem);
	}

	//if Ingress agent add recon badge progress to page:
	if (settings["accLowIngress"] || settings["accIngress"]){
		//For this segment we want to add the recon badge offset to normalAgreements
		normalAgreements += settings["profReconOffset"];
		const reconBadges = [ [0, 'None'], [100, 'Bronze'], [750, 'Silver'], [2500, 'Gold'], [5000, 'Platinum'], [10000, 'Onyx'] ];

		var badge = 0;
		for (var i=1; i < reconBadges.length; i++)
			if (normalAgreements >= reconBadges[i][0])
				badge = i;

		var curBadgeElem = document.createElement("h4");

		var curBadgeLeftElem = document.createElement("span");
		curBadgeLeftElem.setAttribute("class", "stats-left");
		var curBadgeRightElem = document.createElement("span");
		curBadgeRightElem.setAttribute("class", "stats-right");

		curBadgeLeftElem.innerText = "Recon Medal";
		curBadgeRightElem.innerText = reconBadges[badge][1];

		curBadgeElem.appendChild(curBadgeLeftElem);
		curBadgeElem.appendChild(curBadgeRightElem);

		profileStats.children[0].appendChild(curBadgeElem);

		//Check if you don't already have the highest badge
		if (badge+1 < reconBadges.length){
			var diff = reconBadges[badge+1][0]-reconBadges[badge][0]; //Agreements for next tier - agreements for current tier (= diff in agreements between tiers)
			var currDiff = normalAgreements-reconBadges[badge][0]; //User's current agreements - current badge tier agreement requirement (= agreements since last badge)

			var progress = Math.round((currDiff/diff)*100); //Get Progress %

			var badgeProgressElem = document.createElement("h4");

			var badgeProgressLeftElem = document.createElement("span");
			badgeProgressLeftElem.setAttribute("class", "stats-left");
			var badgeProgressRightElem = document.createElement("span");
			badgeProgressRightElem.setAttribute("class", "stats-right");

			badgeProgressLeftElem.innerText = "Progress to " + reconBadges[badge+1][1];
			badgeProgressRightElem.innerText = progress + "% (" + normalAgreements + ")";

			badgeProgressElem.appendChild(badgeProgressLeftElem);
			badgeProgressElem.appendChild(badgeProgressRightElem);

			profileStats.children[0].appendChild(badgeProgressElem);
		}else{
			//Still display agreement total+offset
			var offsetAgreementElem = document.createElement("h4");

			var offsetAgreementLeftElem = document.createElement("span");
			offsetAgreementLeftElem.setAttribute("class", "stats-left");
			var offsetAgreementRightElem = document.createElement("span");
			offsetAgreementRightElem.setAttribute("class", "stats-right");

			offsetAgreementLeftElem.innerText = "Badge agreement stat: ";
			offsetAgreementRightElem.innerText = normalAgreements;

			offsetAgreementElem.appendChild(offsetAgreementLeftElem);
			offsetAgreementElem.appendChild(offsetAgreementRightElem);

			profileStats.children[0].appendChild(offsetAgreementElem);
		}
	}

	var exportData;
	if (settings["profExtendedStats"] === "aprox") {
		exportData = {
			"current_rating": document.getElementsByClassName("rating-bar__segment--active")[0].innerText,
			"total_nominations": reviewTotal,
			"total_agreements": agreementTotal,
			"accepted": acceptedAgreements,
			"rejected": rejectedAgreements,
			"duplicates": duplicateAgreements,
			"other": otherAgreements,
			"upgrades_available": pCtrl.profile.available,
			"upgrades_redeemed": pCtrl.profile.total,
			"current_progress": pCtrl.profile.progress,
			"extended_type": "aprox"
		};
	}else{
		exportData = {
			"current_rating": document.getElementsByClassName("rating-bar__segment--active")[0].innerText,
			"total_nominations": reviewTotal,
			"total_agreements": normalAgreements,
			"accepted": acceptedAgreements,
			"rejected": rejectedAgreements,
			"duplicates": duplicateAgreements,
			"other": 0,
			"upgrades_available": pCtrl.profile.available,
			"upgrades_redeemed": pCtrl.profile.total,
			"current_progress": pCtrl.profile.progress,
			"extended_type": "facts"
		};
	}
	var copyElem = document.createElement("a");
	copyElem.innerText = "Copy rating stats to clipboard";

	copyElem.onclick = function() {
		navigator.clipboard.writeText(JSON.stringify(exportData));
	}

	document.getElementById("performance").parentElement.appendChild(copyElem);
}
document.addEventListener("WFPPCtrlHooked", addExtendedStats);
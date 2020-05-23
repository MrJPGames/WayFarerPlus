function autoFilter(){
	console.log(nomCtrl.nomList);
	var filterValues = {
		"approved": settings["nomFilterApproved"],
		"notApproved": settings["nomFilterRejected"],
		"upgraded": settings["nomFilterUpgraded"],
		"nextUpgraded": settings["nomFilterNextUpgrade"],
		"nominated": settings["nomFilterNominated"],
		"voting": settings["nomFilterInVoting"],
		"withdrawn": settings["nomFilterWithdrawn"],
		"duplicate": settings["nomFilterDuplicate"]
	};
	console.log(filterValues);
	nomCtrl.filterValues = filterValues;
	nomCtrl.nomList = nomCtrl.nomList.filter(
		function(nom){
			return filterValues.approved && nom.status === "ACCEPTED" ||
				filterValues.notApproved && nom.status === "REJECTED" ||
				filterValues.upgraded && nom.upgraded ||
				filterValues.nextUpgraded && nom.nextUpgrade ||
				filterValues.nominated && nom.status === "NOMINATED" ||
				filterValues.voting && nom.status === "VOTING" ||
				filterValues.withdrawn && nom.status === "WITHDRAWN" ||
				filterValues.duplicate && nom.status === "DUPLICATE";
		}
	);
	nomCtrl.scrollController.reload();
	console.log(nomCtrl.nomList);
}


document.addEventListener("WFPNomCtrlHooked", autoFilter);
function autoFilter(){
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

	addSelectDeselectAll();
}

function addSelectDeselectAll(){
	var orig = nomCtrl.openOptionsModal;
	nomCtrl.openOptionsModal = function(){
		orig();

		setTimeout(function(){
			var nomOptWindow = document.getElementById("nom-options-modal");

			var filterDiv = nomOptWindow.querySelector("#nom-filter");


			var selectButton = document.createElement("button");
			selectButton.innerText = "Select all";
			selectButton.onclick = function(){
				var inputs = filterDiv.getElementsByTagName("input");
				for (var i = 0; i < inputs.length; i++){
					if (!inputs[i].checked)
						inputs[i].click();
				}
			};
			var deselectButton = document.createElement("button");
			deselectButton.innerText = "Deselect all";
			deselectButton.onclick = function(){
				var inputs = filterDiv.getElementsByTagName("input");
				for (var i = 0; i < inputs.length; i++){
					if (inputs[i].checked)
						inputs[i].click();
				}
			};

			filterDiv.insertBefore(deselectButton, filterDiv.children[1]);
			filterDiv.insertBefore(selectButton, filterDiv.children[1]);
		}, 1); //This 1ms timeout should make it so the scheduler always puts us after the element has been added to the DOM
	}
}


document.addEventListener("WFPNomCtrlHooked", autoFilter);
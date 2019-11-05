function removeRedundantDescriptions() {
    for (var i = document.getElementsByClassName('card-header__description').length - 1; i >= 0; i--) {
        document.getElementsByClassName('card-header__description')[i].remove();
    }
}

function setupExpandedCards(){
	var cardRowContainer = document.getElementsByClassName("card-row-container")[0];
	cardRowContainer.style.maxWidth = "2264px"; //Maximum width current layout actually works at

	//Reorder cards
	var titleDescElem = document.getElementById("descriptionDiv");
	titleDescElem.style.order = "2";
	var threeCardsElem = document.getElementById("three-card-container");
	threeCardsElem.style.order = "3";
	var supportCardElem = document.getElementById("supporting-card");
	supportCardElem.style.order = "4";
	if (!nSubCtrl.hasSupportingImageOrStatement) {
        document.getElementById("supporting-card").classList.remove("ng-hide");
        document.getElementById("supporting-card").getElementsByClassName("supporting-image")[0].remove();
        document.getElementById("supporting-card").getElementsByClassName("card__body")[0].innerHTML = '<h4 class="ng-binding">This nomination was made using Scanner [REDACTED], which means that no supporting photo or supporting statement were given.</h4>';
    }
	var duplicatesCard = document.getElementById("duplicates-card");
	duplicatesCard.style.order = "5";

	removeRedundantDescriptions();
}

document.addEventListener("WFPNSubCtrlHooked", setupExpandedCards, false);
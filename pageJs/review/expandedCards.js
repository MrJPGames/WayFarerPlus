function setupHighRes(){
	var cardRowContainer = document.getElementsByClassName("card-row-container")[0];
	cardRowContainer.style.minWidth = "100%";

	//Reorder cards
	var threeCardsElem = document.getElementById("duplicates-card");
	threeCardsElem.style.order = "2";
	var supportCard = document.getElementById("supporting-card");
	supportCard.style.order = "2";
	if (!nSubCtrl.hasSupportingImageOrStatement){
		document.getElementById("supporting-card").classList.remove("ng-hide");
        document.getElementById("supporting-card").getElementsByClassName("supporting-statement-central-field")[0].remove();
        document.getElementById("supporting-card").getElementsByClassName("supporting-image")[0].remove();
        document.getElementById("supporting-card").getElementsByClassName("card__body")[0].innerHTML = '<h4 class="ng-binding">This nomination was made using Scanner [REDACTED], which means that no Support Photo or Support Text were given.</h4>';
	}
	var titleDescElem = document.getElementById("descriptionDiv");
	titleDescElem.style.order = "3";
}
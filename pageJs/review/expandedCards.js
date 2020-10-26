function removeRedundantDescriptions() {
    for (var i = document.getElementsByClassName('card-header__description').length - 1; i >= 0; i--) {
        document.getElementsByClassName('card-header__description')[i].remove();
    }
}

function setupExpandedCards(){
    if (nSubCtrl.pageData.type !== "NEW")
        return; //Only works for new submissions
    
    //Inject CSS to hide sidebar where convinient for use of this option on medium sized screens
    var css = `@media (max-width: 1754px) {
			            .header .hamburger {
			                align-items: center;
			                display: flex;
			                justify-content: center;
			                margin: 0 5px;
			            }
			            .sidebar.hide-mobile {
			                display: none;
			            }
			            .sidebar {
			                position: absolute;
			                max-width: 100vw;
			                width: 180px;
			                z-index: 2;
			            }
			        }`;

	var style=document.createElement('style');
	style.type='text/css';
	if(style.styleSheet){
	    style.styleSheet.cssText=css;
	}else{
	    style.appendChild(document.createTextNode(css));
	}
	var insertBefore = (document.body || document.head || document.documentElement).getElementsByTagName("style")[0];
	(document.body || document.head || document.documentElement).insertBefore(style, insertBefore);

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
        
        var replaceContent = document.createElement("h4");
        replaceContent.setAttribute("class", "ng-binding");
        replaceContent.innerText = "This nomination was made using Scanner [REDACTED], which means that no supporting photo or supporting statement were given.";

        document.getElementById("supporting-card").getElementsByClassName("card__body")[0].appendChild(replaceContent);
    }
	var duplicatesCard = document.getElementById("duplicates-card");
	duplicatesCard.style.order = "5";

	removeRedundantDescriptions();
}

document.addEventListener("WFPAllRevHooked", setupExpandedCards);
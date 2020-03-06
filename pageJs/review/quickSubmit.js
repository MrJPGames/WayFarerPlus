//Adds quick submit buttons
function initQuickSubmit(){
	var elems = document.querySelectorAll('.button-primary');;
	for (var i = 0; i < elems.length; i++){
		var elem = elems[i];
		if (elem.getAttribute("ng-click") == "answerCtrl.submitForm()"){
			var button = createQuickSubmitButton();
			var parent = elem.parentNode.parentNode;
			//console.log(parent.children[1]); //.insertBefore(button, elem.parentNode);
			parent.insertBefore(button, parent.children[1]);
		}
	}

	createObserver();
	hookDupeModal();
	hookLowQualityModal();
}

function hookLowQualityModal(){
	var origFunc = ansCtrl.showLowQualityModal;
	ansCtrl.showLowQualityModal = function(){
		origFunc();
		setTimeout(function (){
			var button = createQuickRejectButton();
			var modalContent = document.getElementById("low-quality-modal");
			var submitButton = modalContent.getElementsByClassName("button-primary")[0];
			button.disabled = submitButton.disabled;
			var submitButtonParent = submitButton.parentNode;
			submitButtonParent.insertBefore(button, submitButton);

			//Fix style of cancel button
			var cancelButton = modalContent.getElementsByClassName("button-secondary")[0];
			cancelButton.style.marginRight = "0.2em";

			createRejectObserver(button);
		}, 10); //We need to give it time to create the modal
	}
}

function hookDupeModal(){
	var origFunc = markDuplicatePressed;
	markDuplicatePressed = function (guid){
		origFunc(guid);
		setTimeout(function (){
			var button = createQuickDuplicateButton();
			button.disabled = false;
			var modalContent = document.getElementsByClassName("modal-content")[0];
			var submitButton = modalContent.getElementsByClassName("button-primary")[0];
			var submitButtonParent = submitButton.parentNode;
			submitButtonParent.insertBefore(button, submitButton);
		}, 10);
	}
}

function createRejectObserver(button){
	//Used to keep disabled/enabled-ness of button in sync with official submit buttons
	const subButtons = document.getElementById('low-quality-modal').getElementsByClassName("button-primary");
	const subButton = subButtons[subButtons.length-1];

	//We only care about attribute updates
	const config = { attributes: true, childList: false, subtree: false };

	const callback = function(mutationsList, observer) {
	    for(let mutation of mutationsList) {
	        if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
	            updateSpecificButton(button, mutation.target.disabled);
	        }
	    }
	};
	const observer = new MutationObserver(callback);
	observer.observe(subButton, config);
}

function updateSpecificButton(elem, value){
	elem.disabled = value;
}


function createObserver(){
	//Used to keep disabled/enabled-ness of button in sync with official submit buttons
	const subButton = document.getElementById('submit-top').children[0]; //Top right sub button

	//We only care about attribute updates
	const config = { attributes: true, childList: false, subtree: false };

	const callback = function(mutationsList, observer) {
	    for(let mutation of mutationsList) {
	        if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
	            updateButtonsEnabled(mutation.target.disabled);
	        }
	    }
	};
	const observer = new MutationObserver(callback);
	observer.observe(subButton, config);
}

function updateButtonsEnabled(disable){
	var buttons = document.getElementsByClassName("button-primary");
	for (var i = 0; i < buttons.length; i++){
		if (buttons[i].id == "quickSubButton"){
			buttons[i].disabled = disable;
		}
	}
}

function quickSubmit(){
	if (ansCtrl.readyToSubmit()){
		ansCtrl.submitForm();
		ansCtrl.reloadPage();
	}
}

function quickRejectModal(e){
	var ansCtrl2Elem = document.getElementById("low-quality-modal");
	var ansCtrl2 = angular.element(ansCtrl2Elem).scope().answerCtrl2;
	if (ansCtrl2.readyToSubmitSpam()){
		ansCtrl2.confirmLowQuality();
		ansCtrl2.reloadPage();
	}
}

function quickDuplicateModal(e){
	console.log("dupe!");
	var ansCtrl2Elem = document.getElementsByClassName("modal-body")[0].parentNode;
	var ansCtrl2 = angular.element(ansCtrl2Elem).scope().answerCtrl2;
	ansCtrl2.confirmDuplicate()
	ansCtrl2.reloadPage();
}

function createQuickSubmitButton(){
	var button = document.createElement("button");
	button.onclick = quickSubmit;
	button.setAttribute("class", "button-primary");
	button.id = "quickSubButton";
	button.style.marginRight = "1em";
	button.style.minWidth = "2em";
	button.disabled = true;

	addQuickSubmitImages(button);

	return button;
}

function createQuickRejectButton(){
	var button = document.createElement("button");
	button.onclick = quickRejectModal;
	button.setAttribute("class", "button-primary");
	button.id = "quickRejectButton";
	button.style.marginRight = "0.2em";
	button.style.minWidth = "2em";

	addQuickSubmitImages(button);

	return button;
}

function createQuickDuplicateButton(){
	var button = document.createElement("button");
	button.onclick = quickDuplicateModal;
	button.setAttribute("class", "button-primary");
	button.id = "quickDuplicateButton";
	button.style.marginRight = "0.2em";
	button.style.minWidth = "2em";

	addQuickSubmitImages(button);

	return button;
}

//Separate function so it can easily be called from the timer mod. This allows the timer to update and then set the correct image
function addQuickSubmitImages(button){
	var saveIcon = document.createElement("span");
	saveIcon.setAttribute("class", "glyphicon glyphicon-floppy-disk");

	var rightIcon = document.createElement("span");
	rightIcon.setAttribute("class", "glyphicon glyphicon-forward");

	button.appendChild(saveIcon);
	button.appendChild(rightIcon);
}

document.addEventListener("WFPAllRevHooked", initQuickSubmit);
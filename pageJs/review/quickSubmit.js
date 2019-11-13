//Adds quick submit buttons
function initQuickSubmit(){
	var elems = document.getElementsByClassName("button-primary");
	var length = elems.length; //NEEDED
	for (var i = 0; i < length; i++){
		var elem = elems[i*2];
		var button = createQuickSubmitButton();
		var parent = elem.parentNode.parentNode;
		//console.log(parent.children[1]); //.insertBefore(button, elem.parentNode);
		parent.insertBefore(button, parent.children[1]);
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
			var button = createQuickModalButton();
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
			var button = createQuickModalButton();
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
	const subButton = document.getElementById('submitDiv').children[0]; //Top right sub button

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
	var buttonDiv = e.srcElement.parentNode;
	while (buttonDiv.getAttribute("class") != "button-container" && buttonDiv.getAttribute("class") != "text-center"){ //Find the correct container (as the spans could also be the source element)
		buttonDiv = buttonDiv.parentNode;
	}
	buttonDiv.children[2].click();
	setTimeout(function(){ansCtrl.reloadPage()}, 10);
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

function createQuickModalButton(){
	var button = document.createElement("button");
	button.onclick = quickRejectModal;
	button.setAttribute("class", "button-primary");
	button.id = "quickModalButton";
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
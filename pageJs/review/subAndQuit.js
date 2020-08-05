//This is largely based on the deprecated "Quick Submit" code

//Adds "Submit & Quit" buttons
function initSubAndQuit(){
	var elems = document.querySelectorAll('.button-primary');
	for (var i = 0; i < elems.length; i++){
		var elem = elems[i];
		if (elem.getAttribute("ng-click") === "answerCtrl.submitForm()"){
			var button = createSubAndQuitButton();
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
			var button = createRejectAndQuitButton();
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
			var button = createDupeAndQuitButton();
			var modalContent = document.getElementsByClassName("modal-content")[0];
			var submitButton = modalContent.getElementsByClassName("button-primary")[0];
			button.disabled = submitButton.disabled;
			var submitButtonParent = submitButton.parentNode;
			submitButtonParent.insertBefore(button, submitButton);

			createDupeObserver(button);
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

function createDupeObserver(button){
	//Used to keep disabled/enabled-ness of button in sync with official submit buttons
	const subButtons = document.getElementsByClassName("modal-body")[0].getElementsByClassName("button-primary");
	const subButton = subButtons[subButtons.length-1]; //Take last elem

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
		if (buttons[i].classList.contains("quickSubButton")){
			buttons[i].disabled = disable;
		}
	}
}

function subAndQuit(){
	if (ansCtrl.readyToSubmit()){
		//Replace reloading with changing page to Wayfarer home page (So reload is now redirect)
		ansCtrl.reloadPage = function(){
			window.location.replace("https://wayfarer.nianticlabs.com/");
		};
		ansCtrl.submitForm();
	}
}

function rejectModalSubAndQuit(e){
	var ansCtrl2Elem = document.getElementById("low-quality-modal");
	var ansCtrl2 = angular.element(ansCtrl2Elem).scope().answerCtrl2;
	if (ansCtrl2.readyToSubmitSpam()){
		ansCtrl2.reloadPage = function(){
			window.location.replace("https://wayfarer.nianticlabs.com/");
		};
		ansCtrl2.confirmLowQuality();
	}
}

function dupeModalRejectAndQuit(e){
	var ansCtrl2Elem = document.getElementsByClassName("modal-body")[0].parentNode;
	var ansCtrl2 = angular.element(ansCtrl2Elem).scope().answerCtrl2
	ansCtrl2.reloadPage = function(){
		window.location.replace("https://wayfarer.nianticlabs.com/");
	};
	ansCtrl2.confirmDuplicate();
}

function createSubAndQuitButton(){
	var button = document.createElement("button");
	button.onclick = subAndQuit;
	button.setAttribute("class", "button-primary quickSubButton");
	button.style.marginRight = "1em";
	button.style.minWidth = "2em";
	button.disabled = true;

	addSaveAndQuitIcon(button);

	return button;
}

function createRejectAndQuitButton(){
	var button = document.createElement("button");
	button.onclick = rejectModalSubAndQuit;
	button.setAttribute("class", "button-primary");
	button.id = "quickRejectButton";
	button.style.marginRight = "0.2em";
	button.style.minWidth = "2em";

	addSaveAndQuitIcon(button);

	return button;
}

function createDupeAndQuitButton(){
	var button = document.createElement("button");
	button.onclick = dupeModalRejectAndQuit;
	button.setAttribute("class", "button-primary");
	button.id = "quickDuplicateButton";
	button.style.marginRight = "0.2em";
	button.style.minWidth = "2em";

	addSaveAndQuitIcon(button);

	return button;
}

//Separate function so it can easily be called from the timer mod. This allows the timer to update and then set the correct image
function addSaveAndQuitIcon(button){
	var saveIcon = document.createElement("span");
	saveIcon.setAttribute("class", "glyphicon glyphicon-open");

	var ampText = document.createElement("span");
	ampText.setAttribute("class", "glyphicon glyphicon-plus");


	var rightIcon = document.createElement("span");
	rightIcon.setAttribute("class", "glyphicon glyphicon-home");

	button.appendChild(saveIcon);
	button.appendChild(ampText);
	button.appendChild(rightIcon);
}

document.addEventListener("WFPAllRevHooked", initSubAndQuit);
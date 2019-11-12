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
}

function createObserver(){
	//Used to keep disabled/enabled-ness of button in sync with official submit buttons
	const subButton = document.getElementById('submitDiv').children[0]; //Top right sub button

	//We only care about attribute updates
	const config = { attributes: true, childList: false, subtree: false };

	// Callback function to execute when mutations are observed
	const callback = function(mutationsList, observer) {
	    for(let mutation of mutationsList) {
	        if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
	            console.log('The ' + mutation.attributeName + ' attribute was modified.');
	            updateButtonsEnabled(mutation.target.disabled);
	        }
	    }
	};

	// Create an observer instance linked to the callback function
	const observer = new MutationObserver(callback);

	// Start observing the target node for configured mutations
	observer.observe(subButton, config);
}

function updateButtonsEnabled(disable){
	console.log("test1");
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

function quickDuplicateSubmit(){
	ansCtrl.confirmDuplicate();
	ansCtrl.reloadPage();
}

function createQuickSubmitButton(){
	var button = document.createElement("button");
	button.onclick = quickSubmit;
	button.setAttribute("class", "button-primary");
	button.id = "quickSubButton";
	button.style.marginRight = "1em";
	button.disabled = true;

	addQuickSubmitImages(button);

	return button;
}

function createQuickDuplicateButton(){
	var button = document.createElement("button");
	button.onclick = quickDuplicateSubmit;
	button.setAttribute("class", "button-primary");
	button.id = "quickSubButton";
	button.style.marginRight = "1em";
	button.disabled = true;

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
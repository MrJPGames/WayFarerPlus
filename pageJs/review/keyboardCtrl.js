var revPos = 0;
var revFields = [];
var starButtons = [];
var inReject = false;
var inDuplicate = false;
var maxRevPos = 5;
var colCode = "20B8E3";
var rejectComplete = false;
var menuPtr = null;
var dupePtr = 0;

function setupKeyboardControl(){
	if (!settings["darkMode"])
		colCode = "DF471C";
	initKeyboardControls();
}

//This function initializes the revFields and starButtons variables
//This stores the different star entries in order of keyboard flow
//This is done by hand to make visual customizations not change the order when unintended
function initStars(){
	revFields[0] = document.getElementById(divNames.shouldBePortal).getElementsByClassName("five-stars")[0];
	revFields[1] = document.getElementById(divNames.titleAndDescription).getElementsByClassName("five-stars")[0];
	revFields[2] = document.getElementById(divNames.historicOrCultural).getElementsByClassName("five-stars")[0];
	revFields[3] = document.getElementById(divNames.visuallyUnique).getElementsByClassName("five-stars")[0];
	revFields[4] = document.getElementById(divNames.safeAccess).getElementsByClassName("five-stars")[0];
	revFields[5] = document.getElementById(divNames.locationAccuracy).getElementsByClassName("five-stars")[0];
}

function initKeyboardControls(){
	//Register to the key press event
	document.addEventListener('keydown', keyDownEvent);

	initStars();

	revFields[0].focus();
	revFields[0].setAttribute("style", "border-color: #" + colCode + ";");

	//Bind to opening and closing of reject modal
	var openModal = ansCtrl.showLowQualityModal;
	ansCtrl.showLowQualityModal = function(){
		inReject = true;
		openModal();
		setTimeout(function (){
			menuPtr = document.getElementById("reject-reason").children[0].children[2]; //Gets <ul> checkedG1
			//Number the options
			var i = 0;
			for (i=0; i < menuPtr.children.length; i++){
				var elem = menuPtr.children[i];
				elem.children[1].innerText = (i+1) + ". " + elem.children[1].innerText;
			}
		}, 20);
	}

	//Hook closing of modal
	var closeModal = ansCtrl.resetLowQuality;
	ansCtrl.resetLowQuality = function(){
		inReject = false;
		closeModal();
	}

	//Create custom duplicate click events (in addition to default behavior to update our local state of things)
	var duplicateElems = document.getElementById("duplicates-card").getElementsByClassName("filmstrip-image");
	for (var i=0; i < duplicateElems.length; i++){
		duplicateElems[i].setAttribute("onclick", "dupePtr = " + i + ";");
	}
}

function keyDownEvent(e){	
	//If typing in a text field ignore ALL input (except for enter to confirm rejection)
	if (document.activeElement.nodeName === "TEXTAREA" || document.activeElement.nodeName === "INPUT"){
		if (rejectComplete && e.keyCode === 13){
			//Allow for new line if shift is held
			if (e.shiftKey)
				return;
			//Stop the enter from creating a new line in the textarea
			e.preventDefault();
			var ansCtrl2Elem = document.getElementById("low-quality-modal");
			var ansCtrl2 = angular.element(ansCtrl2Elem).scope().answerCtrl2;
			ansCtrl2.confirmLowQuality();
			if (e.ctrlKey){
				ansCtrl2.reloadPage();
			}else {
				ansCtrl.reviewComplete = true;
			}
		}
		return;
	}
	if (ansCtrl.reviewComplete){
		if (e.keyCode === 13) //Enter Key
			ansCtrl.reloadPage();
		if (e.keyCode === 8) //Backspace
			window.location.href = "/";
	}else{
		if (!inReject && !inDuplicate){
			//Normal review state (not in modal)
			if (e.keyCode === 37 || e.keyCode === 8){ //Left arrow key or backspace
				changeRevPos(-1, true);
			}else if (e.keyCode === 39){ //Right arrow key
				changeRevPos(1, true);
			}else if (e.keyCode >= 97 && e.keyCode <= 101){ // 1-5 Num pad
				var rating = e.keyCode - 97;
				setRating(revPos, rating);
			}else if (e.keyCode >= 49 && e.keyCode <= 53){ // 1-5 normal
				var rating = e.keyCode - 49;
				setRating(revPos, rating);
			}else if ( (e.keyCode === 48 || e.keyCode === 96) && nSubCtrl.reviewType === "NEW"){ //0 normal/Num pad
				setRating(0,0);
			}else if (e.keyCode === 32 || (e.keyCode === 13 && e.ctrlKey) ){ //Space bar or ctrl+enter
				if (ansCtrl.readyToSubmit()){
					ansCtrl.submitForm();
					ansCtrl.reloadPage();
				}
			}else if (e.keyCode === 13){ //Enter key
				if (ansCtrl.readyToSubmit())
					ansCtrl.submitForm();
			}else if (e.keyCode === 68){ // D key
				var dupeButton = document.getElementById("markDuplicateButton");
				if (dupeButton === undefined){
					if (nSubCtrl.reviewType === "NEW" && nSubCtrl.activePortals.length > 0)
						nSubCtrl.displayLivePortal(0);
					else
						return;
				}
				document.getElementById("markDuplicateButton").click();
				inDuplicate = true;

				//Hook on close (including with mouse)
				var elem = document.getElementsByClassName("modal-dialog modal-med")[0].children[0].children[0];
				var ansCtrl2 = angular.element(elem).scope().answerCtrl2;
				var func = ansCtrl2.resetDuplicate;
				ansCtrl2.resetDuplicate = function(){
					inDuplicate = false;
					func();
				}
			}else if (e.keyCode === 188){
				selectDuplicateRelative(-1);
			}else if (e.keyCode === 190){
				selectDuplicateRelative(1);
			}
		}else if (inDuplicate){
			var elem = document.getElementsByClassName("modal-dialog modal-med")[0].children[0].children[0];
			var ansCtrl2 = angular.element(elem).scope().answerCtrl2;
			if (e.keyCode === 8){ //Backspace
				ansCtrl2.resetDuplicate();
			}else if (e.keyCode === 32 || (e.keyCode === 13 && e.ctrlKey) ){ //Space bar or ctrl+enter
				ansCtrl2.confirmDuplicate();
				ansCtrl2.reloadPage();
			}else if (e.keyCode === 13){
				ansCtrl2.confirmDuplicate();
				ansCtrl.reviewComplete = true;
			}
		}else{
			//In rejection
			if (e.keyCode === 37 || e.keyCode === 8){ //Left arrow or backspace
				//Reject selection complete but not typing in reason
				if (rejectComplete){
					//Click the element for the user (the top "menu" in reject reason screen)
					document.getElementById("root-label").parentNode.children[0].click();
					//Reset menu ptr
					menuPtr = document.getElementById("reject-reason").children[0].children[2];
					rejectComplete = false;
				}else if (menuPtr.getAttribute("class") === "sub-group-list"){ //Check if in a submenu
					menuPtr.parentNode.children[0].click(); //Minimizes submenu
					menuPtr = menuPtr.parentNode.parentNode; //Reset menuPtr to main menu
				}else{
					//Close modal
					ansCtrl.resetLowQuality();
				}
			}
			var menuPos = -1;
			if (e.keyCode >= 97 && e.keyCode <= 105){
				menuPos = e.keyCode - 97;
			}
			if (e.keyCode >= 49 && e.keyCode <= 57){
				menuPos = e.keyCode - 49;
			}
			if (menuPos !== -1){
				//A number was pressed
				if (menuPtr.children[menuPos] !== undefined){
					menuPtr.children[menuPos].children[0].click();

					if (menuPtr.getAttribute("class") === "group-list"){ //Check if in main menu
						menuPtr = menuPtr.children[menuPos].children[2];

						var i = 0;
						for (i=0; i < menuPtr.children.length; i++){
							var elem = menuPtr.children[i];

							//Avoid readding numbers
							if (isNaN(elem.children[0].innerText[0]))
								elem.children[0].innerText = (i+1) + ". " + elem.children[0].innerText;
						}
					}else{
						//An option was chosen of the submenu. 
						//Submenus only go 1 deep meaning a choice in a submenu must be the last choice
						rejectComplete = true;

						//Stop the number just entered from being typed in the soon to be selected text box
						e.preventDefault();
						document.getElementsByTagName("textarea")[0].focus();
					}
				}
			}
		}
	}
}

function setRating(pos, rate){
	starButtons = revFields[pos].getElementsByClassName("button-star");
	starButtons[rate].click();
	if (!(rate == 0 && pos == 0))
		changeRevPos(1);
}

function changeRevPos(diff, manual = false){
	revFields[revPos].setAttribute("style", "");
	revPos += diff;
	if (revPos < 0)
		revPos = 0;
	if (revPos > maxRevPos){
		revPos = maxRevPos;
		if (manual)
			document.getElementById("category-input").focus(); //Focus on what is it box
	}

	//Set appropriate style
	revFields[revPos].setAttribute("style", "border-color: #" + colCode + ";");

	//Focus on currently rating stars
	revFields[revPos].focus();
	revFields[revPos].scrollIntoView(false);
}

function selectDuplicateRelative(diff){
	var index = dupePtr+diff;
	if (index >= 0 && index < nSubCtrl.activePortals.length){
		nSubCtrl.displayLivePortal(index);
		dupePtr = index;
	}
}

document.addEventListener("WFPAllRevHooked", setupKeyboardControl);
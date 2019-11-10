var timeElem;

function initTimerMods(){
	if (settings["revExpireTimer"])
		createTimer();
	if (settings["revSubmitTimer"] > 0)
		lockSubmitButton();
}

function lockSubmitButton(){
	var buttons = document.getElementsByClassName("button-primary");
	var tDiff = nSubCtrl.pageData.expires - Date.now();
	for (var i = 0; i < buttons.length; i++){
		if(buttons[i].innerText == "SUBMIT" || buttons[i].id == "subButton"){
			buttons[i].setAttribute("id", "subButton"); //Mark for next itteration
			var seconds = Math.round(tDiff/1000) - (1200-settings["revSubmitTimer"]);
			buttons[i].innerText = seconds + "S";
			buttons[i].disabled = true;
		}
	}
	if (tDiff/1000 < 1200-parseInt(settings["revSubmitTimer"])){
		for (var i = 1; i < buttons.length; i++){
			buttons[i].disabled = false;
			buttons[i].innerText = "SUBMIT";
		}
	}else{
		setTimeout(lockSubmitButton, 100); //Updates 10x a second to avoid other things (AnsCtrl) enabling the button too long
	}
}

function createTimer(){
	var header = document.getElementsByClassName("niantic-wayfarer-logo")[0];
	var headerTimer = document.createElement("div");
	headerTimer.innerText = "Time remaining: ";
	headerTimer.setAttribute("style", "display: inline-block; margin-left: 5em;");
	headerTimer.setAttribute("class", "revExprTimer");
	timeElem = document.createElement("div");
	timeElem.innerText = "??:??";
	timeElem.style.display = "inline-block";
	headerTimer.appendChild(timeElem);
	header.parentNode.appendChild(headerTimer);
	updateTimer();
}

function updateTimer(){
	var tDiff = nSubCtrl.pageData.expires - Date.now();

	if (tDiff > 0){
		var tDiffMin = Math.floor(tDiff/1000/60);
		var tDiffSec = Math.floor(tDiff/1000 - 60*tDiffMin);

		timeElem.innerText = pad(tDiffMin,2) + ":" + pad(tDiffSec,2);
		//Retrigger function in 1 second
		setTimeout(updateTimer, 1000);
	}else{
		timeElem.innerText = "EXPIRED!";
		timeElem.setAttribute("style", "color: red;");
	}
}

document.addEventListener("WFPNSubCtrlHooked", initTimerMods, false);

//Helper functions
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}
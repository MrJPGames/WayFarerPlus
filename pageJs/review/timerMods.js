var timeElem;

function initTimerMods(){
	if (settings["revExpireTimer"])
		createTimer();
	if (settings["revSubmitTimer"] > 0){
		markSubmitButtons();
		lockSubmitButton();
		hookSubmitFunction();
	}
}

function hookSubmitFunction(){
	var originalReadyToSubmit = ansCtrl.readyToSubmit;
	ansCtrl.readyToSubmit = function(){
		var tDiff = nSubCtrl.pageData.expires - Date.now();
		if (tDiff/1000 < 1200-parseInt(settings["revSubmitTimer"])){
			return originalReadyToSubmit();
		}else{
			return false;
		}
	}
}

function markSubmitButtons(){
	var buttons = document.getElementsByClassName("button-primary");
	for (var i = 0; i < buttons.length; i++){
		if (buttons[i].innerText == "SUBMIT"){
			buttons[i].id = "subButton";
			var disableRule = buttons[i].getAttribute("ng-disabled");
			buttons[i].setAttribute("ng-disabled-temp", disableRule);
			buttons[i].setAttribute("ng-disabled", "");
			buttons[i].style.color = "#666";
		}
	}
}

function lockSubmitButton(){
	var buttons = document.getElementsByClassName("button-primary");
	var tDiff = nSubCtrl.pageData.expires - Date.now();
	if (tDiff/1000 < 1200-parseInt(settings["revSubmitTimer"])){
		for (var i = 0; i < buttons.length; i++){
			if(buttons[i].id == "subButton"){
				buttons[i].innerText = "SUBMIT";
				var disableRule = buttons[i].getAttribute("ng-disabled-temp");
				buttons[i].setAttribute("ng-disabled", disableRule);
				buttons[i].setAttribute("ng-disabled-temp", "");
				buttons[i].style.color = "";
				buttons[i].disabled = !(!ansCtrl.reviewComplete && ansCtrl.readyToSubmit());
			}
		}
	}else{
		for (var i = 0; i < buttons.length; i++){
			if(buttons[i].id == "subButton"){
				var seconds = Math.ceil(tDiff/1000 - (1200-parseInt(settings["revSubmitTimer"])));
				buttons[i].innerText = seconds + "S";
			}
		}
		setTimeout(lockSubmitButton, 1000);
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
		var tDiffSec = Math.ceil(tDiff/1000 - 60*tDiffMin);

		timeElem.innerText = pad(tDiffMin,2) + ":" + pad(tDiffSec,2);
		//Retrigger function in 1 second
		setTimeout(updateTimer, 1000);
	}else{
		timeElem.innerText = "EXPIRED!";
		timeElem.setAttribute("style", "color: red;");
	}
}

document.addEventListener("WFPAllRevHooked", initTimerMods);

//Helper functions
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}
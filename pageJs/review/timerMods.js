var timeElem;

function initTimerMods(){
	if (settings["revExpireTimer"])
		createTimer();
	if (settings["revSubmitTimer"] > 0){
		markSubmitButtons();
		lockSubmitButton();
		hookSubmitReadyFunction();
		hookLowQualityModalOpen();
	}
}

function hookLowQualityModalOpen(){
	var orig = ansCtrl.showLowQualityModal;
	ansCtrl.showLowQualityModal = function(){
		orig();
		//The modal needs time to load
		setTimeout(function(){
			//Only make changes if the timer hasn't already ran out (as it's useless at that point, and will cause minor visual bugs)
			var tDiff = nSubCtrl.pageData.expires - Date.now();
			if (tDiff/1000 >= 1200-parseInt(settings["revSubmitTimer"])) {
				markSubmitButtons();
				hookRejectReadyFunction();
			}
		}, 10);
	}
}

function hookRejectReadyFunction(){
	var ansCtrl2Elem = document.getElementById("low-quality-modal");
	var ansCtrl2 = angular.element(ansCtrl2Elem).scope().answerCtrl2;
	var orig = ansCtrl2.readyToSubmitSpam;
	ansCtrl2.readyToSubmitSpam = function(){
		var tDiff = nSubCtrl.pageData.expires - Date.now();
		if (tDiff/1000 < 1200-parseInt(settings["revSubmitTimer"])){
			return orig();
		}else{
			return false;
		}
	}
}

function hookSubmitReadyFunction(){
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
			buttons[i].setAttribute("wfpLock", "on");
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
			if(buttons[i].getAttribute("wfpLock") == "on"){
				buttons[i].innerText = "SUBMIT";
				var disableRule = buttons[i].getAttribute("ng-disabled-temp");
				buttons[i].setAttribute("ng-disabled", disableRule);
				buttons[i].setAttribute("ng-disabled-temp", "");
				buttons[i].style.color = "";
				if (disableRule == "!(!answerCtrl.reviewComplete && answerCtrl.readyToSubmit())") {
					buttons[i].disabled = !(!ansCtrl.reviewComplete && ansCtrl.readyToSubmit());
				}else if (disableRule == "!(answerCtrl2.readyToSubmitSpam())") {
					var ansCtrl2Elem = document.getElementById("low-quality-modal");
					var ansCtrl2 = angular.element(ansCtrl2Elem).scope().answerCtrl2;
					buttons[i].disabled = !(ansCtrl2.readyToSubmitSpam());
				}
			}
		}
	}else{
		for (var i = 0; i < buttons.length; i++){
			if(buttons[i].getAttribute("wfpLock") == "on"){
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
var timeElem, headerTimer;
let delaySubmitTimeout;
let delaySubmitTiming = 0;

//Simple Sound object
function Sound(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.style.display = "none";
	document.body.appendChild(this.sound);
	this.play = function(){
		this.sound.play();
	};
	this.stop = function(){
		this.sound.pause();
	};
}

function initTimerMods(){
	if (settings["revExpireTimer"])
		createTimer("Time remaining: ");
	if (settings["revSubmitTimer"] > 0){
		markSubmitButtons();
		lockSubmitButton();
		hookSubmitReadyFunction();
		hookLowQualityModalOpen();
		hookDuplicateModalOpen();
	}

	if(settings["revDelaySubmitFor"] > 0) {
		if (settings["revSubmitTimer"] === 0){
			if (!settings["revExpireTimer"]) {
				createTimer("");
			}
			hookDelaySubmitLowQualityModalOpen();
			hookDelaySubmitDuplicateModalFunction();
			hookDelaySubmitReadyFunction();
		} else {
			console.log("[WayFarer+] Delay Submit does not work with Submit Timer. Disable the Timer to use Delay.");
		}
	}
}

function hookDuplicateModalOpen(){
	var origFunc = markDuplicatePressed;
	markDuplicatePressed = function (guid){
		origFunc(guid);
		setTimeout(function(){
			//Only make changes if the timer hasn't already ran out (as it's useless at that point, and will cause minor visual bugs)
			var tDiff = nSubCtrl.pageData.expires - Date.now();
			if (tDiff/1000 >= 1200-parseInt(settings["revSubmitTimer"])) {
				markSubmitButtons();
			}
		}, 10);
	}
}

function getDelayTime() {
	const ms = (time) => (parseInt(time, 10) * 1000) || 0;
	const MAX_REVIEW_DURATION_IN_MS = ms(settings['revDelaySubmitMaxDurationInSeconds']);
	const MAX_VARIANCE_IN_MS = ms(settings["revDelaySubmitVarianceInSeconds"]);
	const variance = Math.floor(Math.random() * MAX_VARIANCE_IN_MS);
	const waitTimeInMs = ms(settings["revDelaySubmitFor"]) + variance - MAX_REVIEW_DURATION_IN_MS;
	return nSubCtrl.pageData.expires + waitTimeInMs;
}

function monkeyPatchAndWait(fn, context) {
	return function(...args){
		const delayTime = getDelayTime();
		const now = Date.now();
		const delta = delayTime - now;
		clearTimeout(delaySubmitTimeout);
		if (delta <= 0){
			return fn.apply(context, args);
		} else {
			console.log("[WayFarer+] Delaying submit until ", new Date(delayTime));
			delaySubmitTiming = delayTime;
			markSubmitButtons();
			delaySubmitTimeout = setTimeout(function() {
				fn.apply(context, args);
			}, delta);
		}
	}.bind(context);
}

function hookDelaySubmitReadyFunction(){
	ansCtrl.submitForm = monkeyPatchAndWait(ansCtrl.submitForm, this);
}

function hookDelaySubmitLowQualityModalOpen(){
	var orig = ansCtrl.showLowQualityModal;
	ansCtrl.showLowQualityModal = function(){
		orig();
		//The modal needs time to load
		setTimeout(function(){
			const ansCtrl2Elem = document.getElementById("low-quality-modal");
			const ansCtrl2 = angular.element(ansCtrl2Elem).scope().answerCtrl2;
			ansCtrl2.confirmLowQuality = monkeyPatchAndWait(ansCtrl.confirmLowQuality, this);
		}, 10);
	}
}

function hookDelaySubmitDuplicateModalFunction(){
	const markDuplicate = nSubCtrl.markDuplicate;
	nSubCtrl.markDuplicate = function (id) {
		markDuplicate(id);
		setTimeout(function() {
			const ansCtrl2Elem = document.getElementsByClassName("modal-content")[0].children[0];
			const ansCtrl2 = angular.element(ansCtrl2Elem).scope().$ctrl;
			const ok = ansCtrl2.ok;
			ansCtrl2.ok = monkeyPatchAndWait(ok, this);
		}, 10);
	};
}

function hookLowQualityModalOpen(){
	var orig = nSubCtrl.showLowQualityModal;
	nSubCtrl.showLowQualityModal = function(){
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
	var ansCtrl2 = angular.element(ansCtrl2Elem).scope().$ctrl;
	var orig = ansCtrl2.readyToSubmitSpam;
	ansCtrl2.readyToSubmitSpam = function() {
		var tDiff = nSubCtrl.pageData.expires - Date.now();
		if (tDiff / 1000 < 1200 - parseInt(settings["revSubmitTimer"])) {
			return orig();
		} else {
			return false;
		}
	};
}

function hookSubmitReadyFunction(){
	ansCtrl.readyToSubmit = function(){
		var tDiff = nSubCtrl.pageData.expires - Date.now();
		if (tDiff/1000 < 1200-parseInt(settings["revSubmitTimer"])){
			return ansCtrl.isFormDataValid;
		}else{
			return false;
		}
	}
}

function markSubmitButtons(){
	var buttons = document.getElementsByClassName("button-primary");
	for (var i = 0; i < buttons.length; i++){
		if (buttons[i].innerText.toUpperCase() === "SUBMIT"){
			buttons[i].setAttribute("wfpLock", "on");
			var disableRule = buttons[i].getAttribute("ng-disabled");
			buttons[i].setAttribute("ng-disabled-temp", disableRule);
			buttons[i].setAttribute("ng-disabled", "");
			buttons[i].disabled = true;
			buttons[i].style.color = "#666";
		}
	}
}

function lockSubmitButton(){
	var buttons = document.getElementsByClassName("button-primary");
	var tDiff = nSubCtrl.pageData.expires - Date.now();
	if (tDiff/1000 < 1200-parseInt(settings["revSubmitTimer"])){
		for (var i = 0; i < buttons.length; i++){
			if(buttons[i].getAttribute("wfpLock") === "on"){
				buttons[i].innerText = "SUBMIT";
				var disableRule = buttons[i].getAttribute("ng-disabled-temp");
				buttons[i].setAttribute("ng-disabled", disableRule);
				buttons[i].setAttribute("ng-disabled-temp", "");
				buttons[i].style.color = "";
				if (disableRule === "!reviewCtrl.isFormDataValid") {
					buttons[i].disabled = !ansCtrl.isFormDataValid;
				}else if (disableRule === "!($ctrl.readyToSubmitSpam())") {
					var ansCtrl2Elem = document.getElementById("low-quality-modal");
					var ansCtrl2 = angular.element(ansCtrl2Elem).scope().$ctrl;
					buttons[i].disabled = !(ansCtrl2.readyToSubmitSpam());
				}else{
					buttons[i].disabled = false;
				}
			}
		}
		if (settings["revSubmitTimerSound"]){
			var sound = new Sound(extURL + "assets/sounds/ping.mp3");
			sound.play();
		}
	}else{
		for (var i = 0; i < buttons.length; i++){
			if(buttons[i].getAttribute("wfpLock") === "on"){
				var seconds = Math.ceil(tDiff/1000 - (1200-parseInt(settings["revSubmitTimer"])));
				buttons[i].innerText = seconds + "S";
				buttons[i].disabled = true;
			}
		}
		setTimeout(lockSubmitButton, 1000);
	}
}

function createTimer(message){
	var header = document.getElementsByClassName("niantic-wayfarer-logo")[0];
	var headerTimerWrapper = document.createElement("div");
	headerTimer = document.createElement("span");
	headerTimer.innerText = message;
	headerTimerWrapper.appendChild(headerTimer);
	headerTimerWrapper.setAttribute("style", "display: inline-block; margin-left: 5em;");
	headerTimerWrapper.setAttribute("class", "revExprTimer");
	timeElem = document.createElement("div");
	timeElem.innerText = "??:??";
	timeElem.style.display = "inline-block";
	headerTimerWrapper.appendChild(timeElem);
	header.parentNode.appendChild(headerTimerWrapper);
	updateTimer();
}

function updateTimer(){
	const hasDelayActive = delaySubmitTiming > 0;
	const hasExpireTimer = settings["revExpireTimer"];
	const hasDelayFeature = settings["revDelaySubmitFor"] > 0;
	const now = Date.now();
	const tDiff = (hasDelayActive ? delaySubmitTiming : nSubCtrl.pageData.expires) - now;

	if (tDiff > 0){
		if (hasExpireTimer || hasDelayFeature) {
			if (hasExpireTimer || hasDelayActive) {
				var tDiffMin = Math.floor(tDiff/1000/60);
				var tDiffSec = Math.ceil(tDiff/1000 - 60*tDiffMin);
				timeElem.innerText = pad(tDiffMin,2) + ":" + pad(tDiffSec,2);
				headerTimer.innerText = hasDelayActive ? "Countdown: " : "Time remaining: ";
			} else {
				timeElem.innerText = '';
				headerTimer.innerText = '';
			}
			//Retrigger function in 1 second
			setTimeout(updateTimer, 1000);
		}
	} else {
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
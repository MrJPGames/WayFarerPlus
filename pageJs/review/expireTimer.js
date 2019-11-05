var timeElem;

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

document.addEventListener("WFPNSubCtrlHooked", createTimer, false);

//Helper functions
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}
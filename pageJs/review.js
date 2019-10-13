var nSubCtrl;

setupPage();

function setupPage(){
	nSubCtrl = angular.element(document.getElementById("NewSubmissionController")).scope().subCtrl;
	if (nSubCtrl.pageData.expires == undefined){
		setTimeout(setupPage, 250);
	}else{
		updateTimer();
	}
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function updateTimer(){
	var timeElem = document.getElementById("portalReviewTimer");

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
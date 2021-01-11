setupReviewCounter();
function setupReviewCounter(){
	//Make sure it's initialized
	if (window.sessionStorage["wfpReviewCount"] === undefined)
		window.sessionStorage["wfpReviewCount"] = 0;

	var header = document.getElementsByClassName("niantic-wayfarer-logo")[0];
	var headerReviewCounter = document.createElement("div");
	headerReviewCounter.innerText = "Session review count: " + window.sessionStorage["wfpReviewCount"];
	headerReviewCounter.setAttribute("style", "display: inline-block; margin-left: 5em;");
	header.parentNode.appendChild(headerReviewCounter);
}

//Hook submits
document.addEventListener("WFPAllRevHooked", () => {
	const submitForm = ansCtrl.submitForm;
	const skipToNext = ansCtrl.skipToNext;
	const showLowQualityModal = nSubCtrl.showLowQualityModal;
	const markDuplicate = nSubCtrl.markDuplicate;

	ansCtrl.submitForm = function (bool) {
		window.sessionStorage["wfpReviewCount"] = parseInt(window.sessionStorage["wfpReviewCount"]) + 1;
		submitForm(bool);
	};

	nSubCtrl.showLowQualityModal = function () {
		showLowQualityModal();
		setTimeout(() => {
			const ansCtrl2Elem = document.getElementById("low-quality-modal");
			const ansCtrl2 = angular.element(ansCtrl2Elem).scope().$ctrl;
			const oldConfirm = ansCtrl2.confirmLowQuality;
			ansCtrl2.confirmLowQuality = function () {
				window.sessionStorage["wfpReviewCount"] = parseInt(window.sessionStorage["wfpReviewCount"]) + 1;
				oldConfirm();
			};
		}, 10);
	};

	nSubCtrl.markDuplicate = function (id) {
		markDuplicate(id);
		setTimeout(() => {
			const ansCtrl2Elem = document.getElementsByClassName("modal-content")[0].children[0];
			const ansCtrl2 = angular.element(ansCtrl2Elem).scope().$ctrl;
			const confirmDuplicate = ansCtrl2.confirmDuplicate;
			ansCtrl2.confirmDuplicate = function () {
				var customFormData = ansCtrl2.formData;
				customFormData.duplicate = true; //This is because we want to store before we actually let Wayfarer itself set this to true
				window.sessionStorage["wfpReviewCount"] = parseInt(window.sessionStorage["wfpReviewCount"]) + 1;
				confirmDuplicate();
			};
		}, 10);
	};
});
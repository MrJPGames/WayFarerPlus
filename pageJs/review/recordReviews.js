///Review History

const saveReview = (pageData, submitData) => {
	if (nSubCtrl.pageData.type !== "NEW") {
		console.log("Not a new review. Skipping the save.");
		return;
	}

	const {
		title,
		description,
		imageUrl,
		lat,
		lng,
		statement,
		supportingImageUrl,
	} = pageData;
	const toSave = {
		title,
		description,
		imageUrl,
		lat,
		lng,
		statement,
		supportingImageUrl,
		ts: +new Date(),
		review: submitData,
	};

	const currentItems = getReviews();
	const lastItem = currentItems.length
		? currentItems[currentItems.length - 1]
		: null;
	const isSameReview = lastItem && lastItem.imageUrl === imageUrl;
	if (isSameReview) {
		// update the result
		currentItems[currentItems.length - 1] = toSave;
	} else {
		// push the new result
		currentItems.push(toSave);
	}
	storeReviewHistory(currentItems);
};

document.addEventListener("WFPAllRevHooked", () => {
	if (ansCtrl.reviewType !== "NEW") {
		return;
	}
	saveReview(nSubCtrl.pageData, false)

	const submitForm = ansCtrl.submitForm;
	const skipToNext = ansCtrl.skipToNext;
	const showLowQualityModal = nSubCtrl.showLowQualityModal;
	const markDuplicate = nSubCtrl.markDuplicate;

	ansCtrl.submitForm = function (bool) {
		// This only works for accepts
		saveReview(nSubCtrl.pageData, nSubDS.getReviewSubmissionFormData());
		submitForm(bool);
	};

	nSubCtrl.showLowQualityModal = function () {
		showLowQualityModal();
		setTimeout(() => {
			const ansCtrl2Elem = document.getElementById("low-quality-modal");
			const ansCtrl2 = angular.element(ansCtrl2Elem).scope().$ctrl;
			const oldConfirm = ansCtrl2.confirmLowQuality;
			ansCtrl2.confirmLowQuality = function () {
				saveReview(nSubCtrl.pageData, {
					...ansCtrl2.formData,
					review: {
						...nSubDS.getReviewSubmissionFormData()
					}
				});
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
				saveReview(nSubCtrl.pageData, {
					...nSubDS.getReviewSubmissionFormData()
				}); // duplicateOf is not marked in vm or formData
				confirmDuplicate();
			};
		}, 10);
	};

	ansCtrl.skipToNext = function () {
		saveReview(nSubCtrl.pageData, "skipped");
		skipToNext();
	};
});
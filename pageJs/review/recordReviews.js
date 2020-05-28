///Review History

const saveReview = (pageData, submitData) => {
	let toSave = {};


	let edit = false;
	if (nSubCtrl.reviewType !== "NEW") {
		edit = true;
	} else {
	const {
		title,
		description,
		imageUrl,
		lat,
		lng,
		statement,
		supportingImageUrl,
	} = pageData;

	toSave = {
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
	}

	const currentItems = getReviews(edit);

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
	storeReviewHistory(currentItems, edit);
};

document.addEventListener("WFPAllRevHooked", () =>
	saveReview(nSubCtrl.pageData, false)
);
document.addEventListener("WFPAnsCtrlHooked", () => {
	const {
		submitForm,
		skipToNext,
		showLowQualityModal,
		markDuplicate,
	} = ansCtrl;

	ansCtrl.submitForm = function () {
		// This only works for accepts
		saveReview(nSubCtrl.pageData, ansCtrl.formData);
		submitForm();
	};

	ansCtrl.showLowQualityModal = function () {
		showLowQualityModal();
		setTimeout(() => {
			const ansCtrl2Elem = document.getElementById("low-quality-modal");
			const ansCtrl2 = angular.element(ansCtrl2Elem).scope().answerCtrl2;
			const oldConfirm = ansCtrl2.confirmLowQuality;
			ansCtrl2.confirmLowQuality = function () {
				saveReview(nSubCtrl.pageData, {
					...ansCtrl2.formData,
					review: {
						...ansCtrl2.formData.review,
						comment: ansCtrl2.rejectComment,
					},
				});
				oldConfirm();
			};
		}, 10);
	};

	ansCtrl.markDuplicate = function (id) {
		markDuplicate(id);
		setTimeout(() => {
			const ansCtrl2Elem = document.querySelector(
				".modal-content > [ng-controller]"
			);
			const ansCtrl2 = angular.element(ansCtrl2Elem).scope().answerCtrl2;
			const confirmDuplicate = ansCtrl2.confirmDuplicate;
			ansCtrl2.confirmDuplicate = function () {
				var customFormData = ansCtrl2.formData;
				customFormData.duplicate = true; //This is because we want to store before we actually let Wayfarer itself set this to true
				saveReview(nSubCtrl.pageData, {
					...customFormData,
					duplicateOf: id,
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
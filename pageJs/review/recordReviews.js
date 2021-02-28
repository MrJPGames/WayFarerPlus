///Review History
const saveReview = (nSubCtrl, submitCtrl) => {
	let toSave = {};

	let edit = false;
	if (nSubCtrl.pageData.type === "EDIT") {
		edit = true;
		const {
			titleEdits,
			descriptionEdits,
			imageUrl,
			lat,
			lng,
			locationEdits
		} = nSubCtrl.pageData;

		let title = "";
		let description = "";

		if (nSubCtrl.pageData.titleEdits.length === 0) {
			title = nSubCtrl.pageData.title;
		} else {
			title = nSubCtrl.selectedTitleDisplay;
		}

		if (nSubCtrl.pageData.descriptionEdits.length === 0) {
			description = nSubCtrl.pageData.description;
		} else {
			description = nSubCtrl.selectedDescriptionDisplay;
		}

		let selLat = lat;
		let selLng = lng;
		if (nSubCtrl.selectedEditLocationLatLng) {
			const selectedLocationSplit = nSubCtrl.selectedEditLocationLatLng.split(',');
			selLat = selectedLocationSplit[0];
			selLng = selectedLocationSplit[1];
		}

		toSave = {
			selectedTitle: title,
			titleEdits,
			selectedDescription: description,
			descriptionEdits,
			imageUrl,
			lat,
			lng,
			selectedLat: selLat,
			selectedLng: selLng,
			locationEdits,
			ts: +new Date(),
		};
	} else if (nSubCtrl.pageData.type === "NEW"){
		const {
			title,
			description,
			imageUrl,
			lat,
			lng,
			statement,
			supportingImageUrl,
		} = nSubCtrl.pageData;
		toSave = {
			title,
			description,
			imageUrl,
			lat,
			lng,
			statement,
			supportingImageUrl,
			ts: +new Date(),
			review: submitCtrl,
		};
	}else{
		console.log("[WayFarer+] Cannot store this type of review at this time!");
		return;
	}

	const currentItems = getReviews(null, edit);

	const lastItem = currentItems.length
		? currentItems[currentItems.length - 1]
		: null;
	
	const isSameReview = lastItem && lastItem.imageUrl && lastItem.imageUrl === toSave.imageUrl || false;
	if (isSameReview) {
		// update the result
		currentItems[currentItems.length - 1] = toSave;
	} else {
		// push the new result
		currentItems.push(toSave);
	}
	storeReviewHistory(currentItems, null, edit);
};

document.addEventListener("WFPAllRevHooked", () =>
	saveReview(nSubCtrl, false)
);
document.addEventListener("WFPAllRevHooked", () => {
	const submitForm = ansCtrl.submitForm;
	const skipToNext = ansCtrl.skipToNext;
	const showLowQualityModal = nSubCtrl.showLowQualityModal;
	const markDuplicate = nSubCtrl.markDuplicate;

	ansCtrl.submitForm = function (bool) {
		// This only works for accepts
		saveReview(nSubCtrl, nSubDS.getReviewSubmissionFormData());
		submitForm(bool);
	};

	nSubCtrl.showLowQualityModal = function () {
		showLowQualityModal();
		setTimeout(() => {
			const ansCtrl2Elem = document.getElementById("low-quality-modal");
			const ansCtrl2 = angular.element(ansCtrl2Elem).scope().$ctrl;
			const oldConfirm = ansCtrl2.confirmLowQuality;
			ansCtrl2.confirmLowQuality = function () {
				saveReview(nSubCtrl, {
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
			const ok = ansCtrl2.ok;
			ansCtrl2.ok = function () {
				var customFormData = ansCtrl2.formData;
				customFormData.duplicate = true; //This is because we want to store before we actually let Wayfarer itself set this to true
				saveReview(nSubCtrl, {
					...nSubDS.getReviewSubmissionFormData()
				}); // duplicateOf is not marked in vm or formData
				ok();
			};
		}, 10);
	};

	ansCtrl.skipToNext = function () {
		saveReview(nSubCtrl, "skipped");
		skipToNext();
	};
});
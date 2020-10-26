function initImageMods(){
	if (settings["revImageLinks"])
		addFullSizeImageLinks();
	if (settings["revImageDate"] && nSubCtrl.pageData.type === "NEW")
		addImageDateLabel(10);
}

function addFullImageButton(elem, url, target, style = ""){
	let a = document.createElement("a");
	let span = document.createElement("span");
	
	span.className = "glyphicon glyphicon-search";
	a.appendChild(span);
	a.setAttribute("style", style);
	a.className = "button btn btn-default";
	a.style.width = "min-content";
	a.style.position = "absolute";
	a.target = target;
	a.href = url;

	elem.insertAdjacentElement("afterBegin",a);
}

function addFullSizeImageLinks() {
	if ("NEW" === nSubCtrl.pageData.type){
		// main image
		let elem = document.getElementById("photo-card").querySelector("div.card__body");
		let imageUrl = nSubCtrl.pageData.imageUrl + "=s0";

		addFullImageButton(elem,imageUrl,'mainImage');
		
		//Supporting Image
		if (nSubCtrl.hasSupportingImageOrStatement){
			elem = document.getElementById("supporting-card").querySelector("div.card__body");
			imageUrl = nSubCtrl.pageData.supportingImageUrl + "=s0";
		
			addFullImageButton(elem,imageUrl,'supportingImage')
		}
	} else if ("EDIT" === nSubCtrl.pageData.type){
		let elem = document.querySelector("div.known-information.known-information__image.clickable");
		let imageUrl = nSubCtrl.pageData.imageUrl + "=s0";
		
		addFullImageButton(elem,imageUrl,'mainImage', "position: relative; top: -125px; left: 25px;");
	}
}

function addImageDateLabel(attempts){
	console.log(nSubCtrl.imageDate, attempts);
	if (attempts <= 0) {
		return;
	}
	if (nSubCtrl.imageDate === "") {
		setTimeout(function(){
			addImageDateLabel(attempts-1);
		}, 10);
	}else {
		var adressLabelElem = document.getElementsByClassName("street-address small")[0];

		var dateTextElem = document.createElement("SPAN");
		dateTextElem.innerText = "Image Date: " + nSubCtrl.imageDate + "?";

		//Add newline and the date label
		adressLabelElem.appendChild(document.createElement("BR"));
		adressLabelElem.appendChild(dateTextElem);
	}
}

document.addEventListener("WFPAllRevHooked", initImageMods);

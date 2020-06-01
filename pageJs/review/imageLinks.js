function addFullImageButton(elem,url, target){
	let a = document.createElement("a")
	let span = document.createElement("span")
	
	span.className = "glyphicon glyphicon-search"
	span.innerHTML = " "
	a.appendChild(span)
	a.className = "button btn btn-default"
	a.style.width = "min-content"
	a.style.position = "absolute"
	a.target = target
	a.href = url

	elem.insertAdjacentElement("afterBegin",a)
}

function addFullSizeImageLinks() {

	if ("NEW" === nSubCtrl.reviewType){
		// main image
		let elem = document.getElementById("photo-card").querySelector("div.card__body")
		let imageUrl = nSubCtrl.pageData.imageUrl + "=s0"

		addFullImageButton(elem,imageUrl,'mainImage')
		
		//Supporting Image
		if (nSubCtrl.hasSupportingImageOrStatement){
			elem = document.getElementById("supporting-card").querySelector("div.card__body")
			imageUrl = nSubCtrl.pageData.supportingImageUrl + "=s0"
		
			addFullImageButton(elem,imageUrl,'supportingImage')
		}
	} else if ("EDIT" === nSubCtrl.reviewType){
		let elem = document.querySelector("div.known-information.known-information__image.clickable")
		let imageUrl = nSubCtrl.pageData.imageUrl + "=s0"
		
		addFullImageButton(elem,imageUrl,'mainImage')
	}
}

document.addEventListener("WFPNSubCtrlHooked", addFullSizeImageLinks)

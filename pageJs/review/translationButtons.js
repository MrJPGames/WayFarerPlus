function addTranslationButtons(){
	var elems = document.getElementsByClassName("title-description");

	var style = "background-image: url(" + extURL + "assets/translate.svg);"

	for (i = 0; i < elems.length; i++){
		var translateButton = document.createElement("a");
		translateButton.setAttribute("target", "_BLANK");
		translateButton.setAttribute("class", "translateButton");
		translateButton.setAttribute("style", style);
		translateButton.href = "https://translate.google.com/?sl=auto&q=" + encodeURI(elems[i].innerText);

		elems[i].appendChild(translateButton);
	}

	if (nSubCtrl.hasSupportingImageOrStatement){
		var elem = document.getElementsByClassName("supporting-statement-central-field")[0];

		var translateButton = document.createElement("a");
		translateButton.setAttribute("target", "_BLANK");
		translateButton.setAttribute("class", "translateButton");
		translateButton.setAttribute("style", style);
		translateButton.href = "https://translate.google.com/?sl=auto&q=" + encodeURI(elem.innerText);

		elem.children[0].appendChild(translateButton);
	}
}

document.addEventListener("WFPNSubCtrlHooked", addTranslationButtons, false);
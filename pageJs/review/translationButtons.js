function addTranslationButtons(){
	var elems = document.getElementsByClassName("title-description");

	var style = "background-image: url(" + extURL + "assets/translate.svg);";

	var allText = "";

	for (i = 0; i < elems.length; i++){
		var translateButton = document.createElement("a");
		if (settings["keepTab"])
            translateButton.setAttribute("target", "wfpTranslate");
        else
            translateButton.setAttribute("target", "_BLANK");
		translateButton.setAttribute("class", "translateButton");
		translateButton.setAttribute("style", style);
		translateButton.href = "https://translate.google.com/?sl=auto&q=" + encodeURI(elems[i].innerText);

		allText += elems[i].innerText + "\n\n";

		elems[i].appendChild(translateButton);
	}

	if (nSubCtrl.hasSupportingImageOrStatement){
		var elem = document.getElementsByClassName("supporting-statement-central-field")[0];

		var translateButton = document.createElement("a");
		if (settings["keepTab"])
            translateButton.setAttribute("target", "wfpTranslate");
        else
            translateButton.setAttribute("target", "_BLANK");
		translateButton.setAttribute("class", "translateButton");
		translateButton.setAttribute("style", style);
		translateButton.href = "https://translate.google.com/?sl=auto&q=" + encodeURI(elem.innerText);

		allText += elem.innerText + "\n\n";

		elem.children[0].appendChild(translateButton);
	}

	if (settings["revTranslateAll"]){
/*	<a target="wfpTranslate" class="translateButton" style="background-image: url();display: inline;color: black;" href="https://translate.google.com/?sl=auto&amp;q=TV%20Wessem"><img src="chrome-extension://gcdjeanajknpabohephnljoofpnjlmla/assets/translate.svg" style="
		max-height: fit-content;
		">
		Translate all</a>
*/
		var translateButton = document.createElement("a");
		if (settings["keepTab"])
			translateButton.setAttribute("target", "wfpTranslate");
		else
			translateButton.setAttribute("target", "_BLANK");
		translateButton.setAttribute("class", "translateButton");
		translateButton.setAttribute("style", "display: inline; color: black;");
		translateButton.href = "https://translate.google.com/?sl=auto&q=" + encodeURI(allText);

		var translateText = document.createElement("span");
		translateText.innerText = "Translate all";

		var translateImage = document.createElement("img");
		translateImage.setAttribute("style", "height: 1.3em;");
		translateImage.src = extURL + "assets/translate.svg";

		translateButton.appendChild(translateImage);
		translateButton.appendChild(translateText);

		var titleDiv = document.getElementById("descriptionDiv").children[0].children[0];
		titleDiv.appendChild(translateButton);
		titleDiv.children[0].setAttribute("style", "display: inline");
	}
}

document.addEventListener("WFPNSubCtrlHooked", addTranslationButtons);
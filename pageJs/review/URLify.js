//Function by Zuhair Taha on CodePen
function URLify(string){
	const urls = string.match(/((http(s?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)/g);
	if (urls) {
		urls.forEach(function (url) {
			string = string.replace(url, '<a target="_blank" href="' + url + '">' + url + "</a>");
		});
	}
	return string;
}

//Scope these functions
{
	function init() {
		if (nSubCtrl.hasSupportingImageOrStatement) {
			var elem = document.getElementsByClassName("supporting-statement-central-field")[0];
			elem.children[0].innerHTML = URLify(elem.children[0].innerHTML);
		}
	}


	document.addEventListener("WFPNSubCtrlHooked", addTranslationButtons);
}
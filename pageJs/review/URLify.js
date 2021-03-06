//Function by Zuhair Taha on CodePen
function URLify(string){
	newStr = string;
	const urls = string.match(/((http(s?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)/g);
	if (urls) {
		urls.forEach(function (url) {
			newStr = newStr.replace(url, '<a target="_blank" href="' + url + '">' + url + "</a>");
		});
	}
	return newStr;
}

document.addEventListener("WFPNSubCtrlHooked", () => {
	if (nSubCtrl.hasSupportingImageOrStatement) {
		var elem = document.getElementsByClassName("supporting-statement-central-field")[0];
		elem.children[0].innerHTML = URLify(elem.children[0].innerHTML);
	}
});
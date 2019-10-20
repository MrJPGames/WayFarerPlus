chrome.storage.local.get("options_set", function (data){
	var opt_ver = (data["options_set"] != undefined) ? data["options_set"] : 0;
	switch(opt_ver){
		case 0:
			setOption("darkMode", true);
			setOption("nomStreetView", true);
			setOption("revTooCloseWarn", true);
			setOption("revExpireTimer", true);
		case 1:
			setOption("nomStats", true);
		case 2:
			setOption("accPoGo", false);
			setOption("accIngress", true);
		case 3:
			setOption("revTranslate", true);
			setOption("profExtendedStats", true);
			setOption("revLowestDistCircle", true);
			setOption("revAccessDistCircle", true);
		default:
			setOption("options_set", 4);
	}
});

chrome.storage.local.get(null, function (data){
	init(data);
});

function init(settings){
	if (settings["darkMode"] == true){
		applyPublicStyle();
	}

	$(document).ready(function(){
		var head = document.getElementsByTagName("head")[0];
		var setInject = document.createElement("script");
		setInject.innerText = "var settings = " + JSON.stringify(settings) + "; var extURL = \"" + chrome.extension.getURL("") + "\";";
		head.appendChild(setInject);

		switch (window.location.pathname){
			case "/nominations":
				modNominationPage(settings);
				break;
			case "/review":
			case "/review#":
				modReviewPage(settings);
				break;
			case "/profile":
				modProfilePage(settings);
				break;
		}
	});
}
chrome.storage.local.get("options_set", function (data){
	if (data["options_set"] == undefined || data["options_set"] < 1){
		console.log("[WayFarer+] Settings have not been set before. Starting configuration...");
		setOption("options_set", 2);
		setOption("darkMode", true);
		setOption("nomStreetView", true);
		setOption("revTooCloseWarn", true);
		setOption("revExpireTimer", true);
		setOption("nomStats", true);
		console.log("[WayFarer+] Setup finished!");
	}else if (data["options_set"] < 2){
		console.log("[WayFarer+] Some new settings seem to be missing. Adding them now...");
		setOption("options_set", 2);
		setOption("nomStats", true);
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
		setInject.innerText = "var settings = " + JSON.stringify(settings) + ";";
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
getData();

function getData(){
	chrome.storage.local.get(null, function (data){
		if (data["options_set"] == undefined || data["options_set"] < settingsVersion)
			setTimeout(getData, 20); //Really fast but not instant
		else
			init(data);
	});
};

function init(settings){
	if (settings["useMods"] == false){
		return;
		//Do not apply any mods
	}
	if (settings["darkMode"] == true){
		applyPublicStyle();
	}

	document.addEventListener('DOMContentLoaded', function(){
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

		//Always
		modHeader(settings);
		modAll(settings);
	});
}

//Helper functions
function addPageJS(file, defer = false){
	var newScript = document.createElement("script");
	newScript.src = chrome.extension.getURL("pageJs/" + file);
	if (defer){
		newScript.setAttribute("defer", "");
	}
	document.getElementsByTagName("head")[0].appendChild(newScript);
}
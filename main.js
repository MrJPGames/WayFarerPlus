chrome.storage.local.get(null, function (data){
	init(data);
});

function init(settings){
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
	});
}
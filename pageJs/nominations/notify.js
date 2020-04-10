(function(){
	function setup(){
		createNotificationArea();
		detectChange();
	}

	function detectChange(){
		console.log(localStorage.wfpNomList);
		if (localStorage.wfpNomList === undefined){
			localStorage.wfpNomList = JSON.stringify(makeNominationDictionary(nomCtrl.nomList));
		}else{
			//Only makes sense to look for change if we have data of the previous state!

			var historyDict = JSON.parse(localStorage.wfpNomList);

			for (var i = 0; i < nomCtrl.nomList.length; i++){
				var nom = nomCtrl.nomList[i];
				var historicalData = historyDict[nom.id];

				if (historicalData === undefined)
					continue; //Skip to next as this is a brand new entry so we don't know it's previous state

				//In queue -> In voting
				if (historicalData.status !== "VOTING" && nom.status === "VOTING"){
					createNotification(`${nom.title} went into voting!`);
				}else if (historicalData.upgraded === false && nom.upgraded === true){
					createNotification(`${nom.title} was upgraded!`)
				}
			}

			//Store the new state
			localStorage.wfpNomList = JSON.stringify(makeNominationDictionary(nomCtrl.nomList));
		}
	}

	//Useful to make comparing easier. Essentially this function iterates over all nominations
	//and uses it's unique ID as key and stores relevant values under that key.
	//This way on checking we can simply find the ID when looking at a current state nomination
	//and immediately find it's previous state.
	function makeNominationDictionary(nomList){
		var dict = {};
		for (var i = 0; i < nomList.length; i++){
			var nom = nomList[i];
			dict[nom.id] = nom;
		}
		return dict;
	}

	function createNotification(message){
		var notification = document.createElement("div");
		notification.setAttribute("class", "wfpNotification");

		var content = document.createElement("p");
		content.innerText = message;

		var closeButton = document.createElement("div");
		closeButton.innerText = "X";
		closeButton.setAttribute("class", "wfpNotifyCloseButton");
		closeButton.onclick = function(){
			notification.remove();
		};

		notification.appendChild(closeButton);
		notification.appendChild(content);

		document.getElementById("wfpNotify").appendChild(notification);
	}

	function createNotificationArea() {
		var container = document.createElement("div");
		container.id = "wfpNotify";

		document.getElementsByTagName("html")[0].appendChild(container);
	}

	document.addEventListener("WFPNomCtrlHooked", setup, false);
})();

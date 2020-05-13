//Code used to handle saving and retrieving of review history data

var localStorageFailed = false;
//Because the storage format was updated we need to check (at least for quite some time) whether someone has
//updated and in case they have convert the old storage system to the new system!
(function(){
	if (localStorage.wfpSaved !== undefined){
		//User used an older function and hasn't updated yet, let's do so!
		storeReviewHistory(JSON.parse(localStorage.wfpSaved));
		safeLocalStorageAssign("wfpSaveBackup", localStorage.wfpSaved);
		localStorage.removeItem("wfpSaved");
	}
})();

function storeReviewHistory(data){
	var userID = (document.getElementById("upgrades-profile-icon").getElementsByTagName("image")[0].href.baseVal).substr(37);
	safeLocalStorageAssign("wfpSaved" + userID, JSON.stringify(data));
}

function getReviewHistory(){
	var userID = (document.getElementById("upgrades-profile-icon").getElementsByTagName("image")[0].href.baseVal).substr(37);
	var ret = localStorage["wfpSaved" + userID];
	if (ret === undefined || ret === null){
		return [];
	}else{
		return JSON.parse(ret);
	}
}

function removeReviewHistory(){
	var userID = (document.getElementById("upgrades-profile-icon").getElementsByTagName("image")[0].href.baseVal).substr(37);
	localStorage.removeItem("wfpSaved" + userID);
}

function safeLocalStorageAssign(key, value){
	try{
		//Do a simple save, this will throw an exception if the localStorage is full
		localStorage[key] = value;
	} catch (e){
		//When the localStorage is full generate a one time (per session) notification to inform the user of this fact.
		if (!localStorageFailed && sessionStorage["historyFull"] === undefined){
			//Store we displayed the warning this session
			sessionStorage["historyFull"] = true;

			let container = document.createElement("div");
			container.id = "wfpNotify";

			document.getElementsByTagName("html")[0].appendChild(container);

			let notification = document.createElement("div");
			notification.setAttribute("class", "wfpNotification");

			let content = document.createElement("p");
			content.innerText = "Your Review History is full.\nNo new reviews will be stored, please export and remove the current history to keep storing new reviews!";

			let closeButton = document.createElement("div");
			closeButton.innerText = "X";
			closeButton.setAttribute("class", "wfpNotifyCloseButton");
			closeButton.onclick = function(){
				notification.remove();
			};

			notification.appendChild(closeButton);
			notification.appendChild(content);

			document.getElementById("wfpNotify").appendChild(notification);
		}
		localStorageFailed = true;
	}
}

function getReviews() {
	const currentItems = getReviewHistory();
	return currentItems;
};
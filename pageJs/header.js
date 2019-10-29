if (settings["headProgress"])
	setupHeader();

function setupHeader(){
    var upgradesProfile = document.getElementById("upgrades-profile-icon");
    var progress = upgradesProfile.getAttribute("value");

    var progressElem = document.createElement("div");
    progressElem.innerText = progress + "%";
    if (settings["darkMode"])
    	progressElem.setAttribute("style", "color: white;");

    var profileElem = document.getElementsByClassName("inner-container")[1];

    profileElem.insertBefore(progressElem, profileElem.children[0]);
}
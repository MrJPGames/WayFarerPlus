if (window.localStorage.getItem("wfpVersion") === null){
	window.localStorage.setItem("wfpVersion", settings["options_set"]);
	if (settings["options_set"] === 20){
		//The version in which changelogs are new we should still show the changelog! (We assume they updated from the previous version)
		showChangelog(19);
	}
}else {
	const ver = parseInt(window.localStorage.getItem("wfpVersion"));
	if (ver < settings["options_set"]) {
		showChangelog(ver);
		window.localStorage.setItem("wfpVersion", settings["options_set"]);
	}
}

function showChangelog(version){
	var changelogStr = "";
	switch(version){
		case 19:
			changelogStr += "1.12.3:\n\
							- On-site changelogs!\n\
							- Improvements to Review History display\n\
							- Option to turn on Open In for Review History\n\
							- Lock submit timer now works for rejections\n\
							- Minor improvements to settings UX\n\n";
		case 20:
			changelogStr += "1.12.4:\n\
							- An additional S2 cell level can be enabled\n\
							  at the same time.\n\n";
		case 21:
			changelogStr += "1.13:\n\
							- Major Review History update by mariomc:\n\
							-> Search by title/date\n\
							-> Filtered exports are now possible!\n\
							-> Marking a review as 'accepted' no longer refreshes the page\n\
							-> Details can be viewed inline with the table\n\
							-> GeoJSON now has colour-coding\n\n";
		case 22:
			changelogStr += "1.14:\n\
							- Improved keyboard controls (ctr+enter or spacebar to quick submit)\n\
							- More detailed nomination stats";
		default:
			break;
	}

	var changelogDiv = document.createElement("DIV");
	changelogDiv.setAttribute("class", "floatMessage");

	var header = document.createElement("h3");
	header.innerText = "WayFarer+ has updated!";

	var changelogContent = document.createElement("p");

	changelogContent.innerText = changelogStr;

	changelogDiv.appendChild(header);
	changelogDiv.appendChild(changelogContent);

	changelogDiv.onclick = function(){
		changelogDiv.remove();
	};

	document.getElementsByTagName("body")[0].appendChild(changelogDiv);
}
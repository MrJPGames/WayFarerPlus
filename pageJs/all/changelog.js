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
							- Nomination notifications (ONLY when on nominations page!) notifies\n\
							  when a nomination goes in voting or gets an upgrade\n\
							- Nominations can now be exported to CSV and GeoJSON (Thanks to mariomc!)\n\
							- Review history will be account specific from now on\n\
							  your current history will be transferred to only 1 account!\n\
							- Improved keyboard controls (ctr+enter or spacebar to quick submit)\n\
							- More detailed nomination stats\n\n";
		case 23:
			changelogStr += "1.14.1\n\
							- A translate all button has been added. This button will translate all\n\
							three fields at the same time!\n\
							- Nomination data export now includes a account specific UID\n\
							- UX/UI improvements to Review History\n\
							- If 2 different S2 cell levels are used they now use different colours\n\
							- A major issue that broke Review History was fixed!\n\n";
		case 24:
			changelogStr += "1.14.2\n\
							- WayFarer+ settings can now be exported, imported or reset to default values.\n\
							- For users affected by very long loading times, you can now enable a notification\n\
							sound in settings that will notify you when a nomination has loaded\n\
							- By default a small circle will appear when moving a nomination, this will indicate\n\
							the area where wayfarer won't allow you to move it to, as it's too close to the original\n\
							location\n\n";
		case 25:
			changelogStr += "1.14.3:\n\
							- Recon badge progress can now be seen on profile, you'll need to configure your account settings\n\
							in order for this change to take effect.\n\
							- Filtering nominations will now filter them on the Nominations map too!\n\
							- A character count for description and supporting statements are now available during a\n\
							nomination edit\n\
							- A 2m circle can now be activated for the nominations page\n\
							- Behind the scenes improvements";
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
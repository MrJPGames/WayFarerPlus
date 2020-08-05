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
							- Behind the scenes improvements\n\n";
		case 26:
			changelogStr += "1.14.4:\n\
							- Review History S2 cell overlay was added. (Thanks to tehstone!)\n\
							- Review and nomination maps that had S2 cells now also use the\n\
							new cell overlay!\n\
							- Submitting duplicates can now also be locked with the review lock timer.\n\n";
		case 27:
			changelogStr += "1.14.5:\n" +
				"- You can now switch between multiple review histories if you want. Reviews histories are based on account UUIDs.\n" +
				"These were recently changed so this change will allow you to view the old history. \n" +
				"- All S2 grids can now have custom colours!\n" +
				"- On the nomination page if you have the nominations map enabled it will now also have an S2 grid.\n" +
				"- You can now set a custom default zoom level for the duplicates map\n" +
				"- When using S2 grids, the current S2 cell of a Waypoint will be highlighted\n" +
				"- S2 Grid should work better on lower end hardware\n" +
				"- You can configure a default filter for your nominations to be automatically applied\n\n";
		case 28:
			changelogStr += "1.14.6:\n" +
				"- Give friendly names to your review histories. Making it easier to tell them apart.\n" +
				"- Report abuse straight from the review page!\n" +
				"-> Be sure to configure your email in WF+ settings.\n" +
				"-> Before reporting abuse familiarise yourself with what is classified as abuse by Niantic!\n\n";
		case 29:
			changelogStr += "1.14.7:\n" +
				"- RAW review history export added\n" +
				"- Import of RAW review history added\n\n";
		case 30:
			changelogStr += "1.14.8:\n" +
				"- \"Quick full-size image open button\" can be added to the review page from review settings\n" +
				"(Thanks to AlterTobi for this feature!)\n\n";
		case 31:
			changelogStr += "1.14.9:\n" +
				"- Submit and Home added\n" +
				"- Review History can now be marked 'Accepted', 'Unknown' or 'Rejected' (instead of just (not) accepted)\n" +
				"(Please note old markings will not be displayed, but can still be exported to JSON/CSV if not changed)\n" +
				"- You can now enable a sound notification for when the 'Submit lock button' timer runs out in settings\n" +
				"- Minor QoL updates";
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
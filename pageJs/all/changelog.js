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
				"- Minor QoL updates\n\n";
		case 32:
			changelogStr += "1.14.10:\n" +
				"- Compatibility fix with recent Wayfarer (review page) update\n" +
				"- Removed 'Submit & Quit' as it's a default feature now\n" +
				"- Fixed minor dark mode issues caused by the latest update\n\n";
		case 33:
			changelogStr += "1.14.11:\n" +
				"- Bug fixes (inconsistent loading of mods/some broken features)\n" +
				"- Experimental 'image date' feature, showing the reported date of the image\n" +
				"used for the submission.\n\n";
		case 34:
			changelogStr += "1.14.11.3:\n" +
				"- Bug fixes:\n" + 
				"-> Record reviews should work properly again\n" + 
				"-> Photo reviews (might) not cause issues anymore\n" + 
				"-> Improved overall WF+ extension stability\n\n";
		case 35:
			changelogStr += "1.14.12:\n" + 
				"- Compatibility with Wayfarer 3.1\n" +
				"-> WF+ Dark mode is tested to work with vanilla 'Light Mode'\n" + 
				"   so you might encounter issues using both dark modes at the same time.\n" + 
				"- Fixed issue causing 'Open In' to be unusable.\n\n";
		case 36:
			changelogStr += "1.15:\n" +
				"- Better compatibility with vanilla Dark Mode\n" +
				"- WF+ Dark Mode now includes dark-themed maps (same as vanilla dark mode)\n" +
				"- Wider range of S2 cells can be used on the review history map\n" +
				"- Edit reviews now also include translation buttons!\n" +
				"- Donation button added to WF+ settings, for those who feel like donating\n\n";
		case 37:
			changelogStr += "2.0:\n" +
				"- Happy 2021!\n" +
				"- (The long awaited) edit review history has been added!\n" +
				"-> If you encounter any bugs, please report them on GitHub!\n" +
				"-> Thanks to tehstone for helping with this feature!" +
				"- New option to turn on a session review counter\n" +
				"-> Useful to see how much you review in one go\n\n";
		case 38:
			changelogStr += "2.0.2:\n" +
				"- Profile stats can be exported easily from the profile page\n\n" +
				"2.1:\n" +
				"- URLs are now clickable in supporting statements (can be turned off)\n" +
				"- Nomination notifications are now also shown when a decision is reached";
		case 39:
			changelogStr += "2.2:\n" +
				"- Submit delay: An alternative to \"Submit Timer\"!\n" +
				"-> Complete your review and hit submit, the review will be submitted\n" +
				"automatically based on your timing settings!\n" +
				"Huge thanks to @mariomc for creating this feature!";
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
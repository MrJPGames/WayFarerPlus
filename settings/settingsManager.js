//Sets up default settings on first launch or upgrade
var settingsVersion = 26;

var defaultMapSettings = '[{"title":"Google Maps","url":"https://maps.google.com/maps?q=%lat%,%lng%"},{"title":"Ingress Intel","url":"https://intel.ingress.com/intel?ll=%lat%,%lng%&z=18"},{"title":"OSM","url":"https://www.openstreetmap.org/?mlat=%lat%&mlon=%lng%#map=18/%lat%/%lng%"}]';

//This is a function because it is used when importing settings (which might be from an older version)
function setDefaults() {
	chrome.storage.local.get("options_set", function (data) {
		var opt_ver = (data["options_set"] != undefined) ? data["options_set"] : 0;
		switch (opt_ver) {
			case 0:
				setOption("darkMode", false);
				setOption("nomStreetView", true); //Street view preview on the nomination page
				setOption("revTooCloseWarn", true); //Warning text when wayspot is within 20m of another wayspot on review page
				setOption("revExpireTimer", true); //Timer in header with remaining time for the current review on review page
			case 1:
				setOption("nomStats", true); //Adds the nomination stats widget to the nomination page
			case 2:
				setOption("accPoGo", true);
				setOption("accIngress", false);
			case 3:
				setOption("revTranslate", true); //Add translate buttons to the review page
				setOption("revLowestDistCircle", true);
				setOption("revAccessDistCircle", true);
			case 4:
				setOption("ctrlessZoom", true);
			case 5:
				setOption("revKeyboard", true);
				setOption("nomLowestDistCircle", true);
				setOption("nomAccessDistCircle", true);
				setOption("revMap2ZoomLevel", 17); //Satellite/streetview map on review page custom zoom level
			case 6:
				setOption("headProgress", true); //Upgrade percentage in header next to profile picture
			case 8:
				setOption("nomS2Cell", 17);
				setOption("revS2Cell", 17);
				setOption("revNoTaskDesc", false);
				setOption("revEditOrigLoc", true); //Display current location on the review page of location edits
			case 9:
				setOption("revCardView", "normal");
				setOption("revPresets", false);
			case 10:
				setOption("profExtendedStats", "aprox");
				setOption("revTransparentMarker", true);
				setOption("revSubmitTimer", 0);
				setOption("revQuickSubmit", true);
			case 11:
				setOption("revAutoSelectDupe", true);
			case 12:
				setOption("profReconOffset", 0); //Agreement offset for Ingress Recon badge
				setOption("revOpenIn", true);
				setOption("nomOpenIn", true);
			case 13:
				setOption("customMaps", defaultMapSettings);
			case 14:
				setOption("keepTab", true);
				setOption("revBigMaps", false);
			case 15:
				setOption("useMods", true);
			case 16:
				setOption("nominationMap", false);
				setOption("rev3DMap", false);
				setOption("profRecordReviews", true);
			case 17:
				setOption("revPreciseMarkers", true);
			case 18:
				setOption("revAutoRetry", true);
			case 19:
				setOption("profOpenIn", false);
			case 20:
				setOption("nomSecondS2Cell", -1);
				setOption("revSecondS2Cell", -1);
			case 21:
				setOption("revDescLink", true);
			case 22:
				setOption("nomNotify", true);
				setOption("nomExportButtons", true);
			case 23:
				setOption("revTranslateAll", true);
			case 24:
				setOption("revLoadNotify", false);
				setOption("revMinDistCircle", true);
			case 25:
				setOption("accLowIngress", false);
				setOption("nomEditAid", true);
				setOption("nomMinDistCircle", false);
				setOption("options_set", settingsVersion);
		}
	});
}
setDefaults(); //Call the function on load

function setOption(option_name, value) {
  var obj= {};
  obj[option_name] = value;

	chrome.storage.local.set(obj, function() {
	    console.log('[Wayfarer+] Setting \"' + option_name + '\" set to \"' + value + '\"');
	});
}
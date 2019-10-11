if (getOption("options_set") == undefined ){
	console.log("NOT DEFINED!");
	setOption("options_set", 1);
	setOption("custom_intranet", 1);
	setOption("custom_main", 1);
	setOption("hide_notification", 0);
	setOption("reserve_hax", 1);
}else{
	console.log("DEFINED!");

}

console.log(getOption("options_set"));
//Currently options are not working (aka wip)

//Check if page is loaded (excluding external style?)
$(document).ready(function() {
	//If on intranet subdomain
	if (window.location.href.substring(0,24) == "https://intranet.hml.nl/"){
		//if (getOption("custom_intranet") == 1){
			applyIntranetStyle();
		//}
		//If on reserveren page
		if (window.location.href == "https://intranet.hml.nl/leerlingen-&-medewerkers/reserveringen/reserveren/"){
			//Add force reserveren option to page via "js/reserveren.js"
		//	if (getOption("reserve_hax") == 1){
				reserverenAdd();
		//	}
		}
	}else{
	//	if (getOption("custom_main") == 1){
			applyPublicStyle();
	//	}
	}
});
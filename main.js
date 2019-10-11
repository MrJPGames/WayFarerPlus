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

applyPublicStyle();
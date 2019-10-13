if (getOption("options_set") == undefined ){
	console.log("NOT DEFINED!");
	setOption("options_set", 1);
}else{
	console.log("DEFINED!");
}

console.log(getOption("options_set"));
//Currently options are not working (aka wip)

applyPublicStyle();

$(window).load(function (){
	if (window.location.pathname == "/nominations"){
		modNominationPage();
	}
});

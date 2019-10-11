function applyPublicStyle(){
	//var ballenimgURL = chrome.extension.getURL("/assets/ballen.png");
	//var spriteimgURL = chrome.extension.getURL("/assets/custom_sprite.7.png");

	var cssInject='body{background:black;} \
	h1,h2,h3,h4,h5,h6,h7,h8,h9{color:white !important;} \
	#gallery-info{background: #0F0F0F;} \
	.niantic-wayfarer-logo img{filter: invert(1);} \
	.header{background:black;} \
	.card{background: black;} \
	.card-header__title{color:white;} \
	.supporting-central-field{background: black;} \
	.title-description{color:white;} \
	#WhatIsItController .categories-display .categories-display-container ul li .categories-display-name{color: white;} \
	textarea{color: white;} \
	.modal-content, .modal-body{background:black !important;color:white;} \
	.supporting-statement-central-field{background: black; color: white;} \
	.known-information-need-edit {background: black;} \
	.modal-body {background: black; box-shadow: #1F1F1F 2px 2px 10px;} \
	input, text-input {color: white;} \
	.button-primary {background: #1B8DAD;} \
	.button-primary:focus,.button-primary:hover {background: #28A8CB;} \
	.nomination-title, .nomination-category-body {color: white;} \
	#nom-search-title {background: black; color: white;} \
	.supporting-statement-central-field p, .item-text, .supporting-statement-central-field {color: white !important;} \
	#nom-options-button {filter: invert(1);} \
	.gm-style .gm-style-iw-c, .gm-style .gm-style-iw-d, .duplicate-map-popup-title {color:black !important;}';

	var style=document.createElement('style');
	style.type='text/css';
	if(style.styleSheet){
	    style.styleSheet.cssText=cssInject;
	}else{
	    style.appendChild(document.createTextNode(cssInject));
	}
	document.getElementsByTagName('head')[0].appendChild(style);
}
function applyPublicStyle(){

	var cssInject='body{background:black !important;} \
	h1,h2,h3,h4,h5,h6,h7,h8,h9{color:white !important;} \
	#gallery-info{background: #0F0F0F !important;} \
	.niantic-wayfarer-logo img{filter: invert(1) !important;} \
	.header{background:black !important;} \
	.card{background: black !important;} \
	.card-header__title{color:white !important;} \
	.supporting-central-field{background: black !important;} \
	.title-description{color:white !important;} \
	#WhatIsItController .categories-display .categories-display-container ul li .categories-display-name{color: white !important;} \
	textarea{color: white !important;} \
	.modal-content, .modal-body{background:black !important;color:white !important;} \
	.supporting-statement-central-field{background: black !important; color: white !important;} \
	.known-information-need-edit {background: black !important;} \
	.modal-body {background: black; box-shadow: #1F1F1F 2px 2px 10px !important;} \
	input, text-input {color: white !important;} \
	.button-primary {background: #1B8DAD !important;} \
	.button-primary:focus,.button-primary:hover {background: #28A8CB !important;} \
	.nomination-title, .nomination-category-body {color: white !important;} \
	#nom-search-title {background: black !important; color: white !important;} \
	.supporting-statement-central-field p, .item-text, .supporting-statement-central-field {color: white !important;} \
	#nom-options-button {filter: invert(1) !important;} \
	.gm-style .gm-style-iw-c, .gm-style .gm-style-iw-d, .duplicate-map-popup-title {color:black !important;} \
	.showcase-container, .niantic-loader {background: black !important;} \
	.niantic-loader__logo {filter: none !important;} \
	.switch-label {filter: invert();} \
	.sidebar .sidebar-item.--selected, .sidebar .sidebar-item:hover {background: #1F1F1F !important; border-left: #20B8E3 5px solid !important;} \
	.sidebar {background: #0C0C0C !important;} \
	.star-red-orange, .selected>.star-gray {color: #20B8E3 !important;}';

	var style=document.createElement('style');
	style.type='text/css';
	if(style.styleSheet){
	    style.styleSheet.cssText=cssInject;
	}else{
	    style.appendChild(document.createTextNode(cssInject));
	}
	(document.body || document.head || document.documentElement).appendChild(style);
}
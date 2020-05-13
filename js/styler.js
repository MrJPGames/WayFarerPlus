function applyPublicStyle(){

	var cssInject=`body{background:black !important; color: grey !important; } 
	h1,h2,h3,h4,h5,h6,h7,h8,h9{color:white !important;} 
	#gallery-info{background: #0F0F0F !important;} 
	.niantic-wayfarer-logo img{filter: invert(1) !important;} 
	.header{background: black !important;} 
	.card{background: black !important;} 
	.card-header__title{color: white !important;} 
	.supporting-central-field{background: black !important;} 
	.title-description{color: white !important;} 
	#WhatIsItController .categories-display .categories-display-container ul li .categories-display-name{color: white !important;} 
	textarea{color: white !important; background: #0F0F0F !important;} 
	.modal-content, .modal-body{background:black !important;color:white !important;} 
	.supporting-statement-central-field{background: black !important; color: white !important;} 
	.known-information-need-edit {background: black !important;} 
	.modal-body {background: black; box-shadow: #1F1F1F 2px 2px 10px !important;} 
	input, text-input {color: white !important;} 
	.button-primary {background: #1B8DAD !important;} 
	.button-primary:focus,.button-primary:hover {background: #28A8CB !important;} 
	.nomination-title, .nomination-category-body {color: white !important;} 
	#nom-search-title {background: black !important; color: white !important;} 
	.supporting-statement-central-field p, .item-text, .supporting-statement-central-field {color: white !important;} 
	#nom-options-button {filter: invert(1) !important;} 
	.gm-style .gm-style-iw-c, .gm-style .gm-style-iw-d, .duplicate-map-popup-title {color:black !important;} 
	.showcase-container, .niantic-loader {background: black !important;} 
	.niantic-loader__logo {filter: none !important;} 
	.switch-label {filter: invert();} 
	.sidebar .sidebar-item.--selected, .sidebar .sidebar-item:hover {background: #1F1F1F !important; border-left: #20B8E3 5px solid !important;} 
	.sidebar {background: #0C0C0C !important;} 
	.star-red-orange, .selected>.star-gray {color: #20B8E3 !important;} 
	@keyframes shadow2 {  
		from,to {background: rgba(255,255,255,.4); filter: blur(4px); } 
        55% {background: rgba(255,255,255,.2); filter: blur(6px); } 
    } 
    .niantic-loader__shadow {animation: shadow2 2.2s ease-in-out infinite !important;} 
    p {color: #C0C0C0 !important;} 
    #WhatIsItController .categories-display .categories-display-result::before {filter: invert() !important;} 
    #WhatIsItController .categories-display .categories-display-result {color: white !important;} 
    .reset-map-icon {filter: invert();} 
    .hydrated {background: black; color: white;} 
    button {color: black;} 
    .select-menu {background: #0F0F0F !important;} 
    .arrow-element {filter: invert();} 
    .lbl-toggle {background: #20B8E3 !important; color: black;} 
    .collapsible-content .content-inner {color: white !important; border-bottom: 1px solid white !important; border-left: 1px solid white !important; border-right: 1px solid white !important;} 
    #nom-table-title--arrow::before {filter: invert();} 
    .cancel-btn::before {background: url('/img/cancel.svg') white !important; filter: invert();} 
    .modal-body .modal-close {background-color: black !important;} 
    p.ng-binding {background: black;} 
    .translateImg {filter: invert(1);} 
    .revExprTimer { color: white; } 
    .nom-edit-input {background-color: #0F0F0F !important; border-bottom: 2px solid #20B8E3 !important;} 
    .category__display-name {color: white !important;} 
    .category__arrow-element {filter: invert();} 
    #gallery-info-not-title p {background: none !important;} 
    .nomination-status--queue, .nomination-status--voting { background: #000000; border: #FFF 1px solid; }
    .nomination-status--accepted { background: #00c853; border: #FFF 1px solid; }
    .nomination-status--duplicate, .nomination-status--rejected, .nomination-status--withdrawn { background: #d50000; border: #FFF 1px solid; }
    .nomination-status--upgrade, .nomination-status--next-upgrade { background: #aa00ff; border: #FFF 1px solid; }
    .card, .card-style {border: 1pt solid white; box-shadow: none;}
    .nomination.card {border: none; border-bottom: 1pt solid white;}
    #SettingsController .settings-content .settings-item .item-edit {filter: invert();}
    #SettingsController h3 .breadcrumb {color: black;}
    #SettingsController .settings-subpage .map-input-container .text-input {background: #0F0F0F;}
    .dropdown #simple-dropdown {color: white; background: #0F0F0F;}
    .dropdown .dropdown-menu li {background: #0F0F0F; color: white;}
    .dropdown .dropdown-menu li:hover {background: #090909;}
	.known-information__title>div {color: white;}
	.known-information__description>div {color: white;}
	.categories-display-result span:not(:first-child)::before {color: white !important;}
	.hamburger {filter: invert();}
	.nom-edit-input__text-field {background-color: inherit !important;}
	.container {background: black !important;}
	.supporting-statement-central-field, .title-description-central-field {background: black !important;}
	.table-striped>tbody>tr:nth-of-type(odd) {background-color:black !important;}
	.table-striped>tbody>tr:nth-of-type(even) {background-color:#222 !important;}
	.table-responsive {color: white !important;}
	#review-history .panel-body, #review-history .scores, #review-history .scores tr {background-color: black !important; }
	.row-input input { background-color: black !important; }
	tr.success{color: black !important;}
	div.dts div.dataTables_scrollBody {background: repeating-linear-gradient(45deg, #000, #222 10px, #555 10px, #888 20px) !important;}
	#help-section-content h3 b{color: #FFF !important;}
	#submit-abuse a {color: rgba(255,255,255,.8) !important;}`;



	var style=document.createElement('style');
	style.type='text/css';
	if(style.styleSheet){
	    style.styleSheet.cssText=cssInject;
	}else{
	    style.appendChild(document.createTextNode(cssInject));
	}
	var insertBefore = (document.body || document.head || document.documentElement).getElementsByTagName("style")[0];
	(document.body || document.head || document.documentElement).insertBefore(style, insertBefore);
}
if (settings["darkMode"] || UtilityService().isDarkModeOn()) {
	var link = document.createElement('link');
	link.type = 'text/css';
	link.rel = 'stylesheet';
	link.href = extURL + 'assets/darkmode.css';
	document.head.appendChild(link);

	//Remove default "light-theme" to stop interference between the two modes
	document.documentElement.classList.remove('theme--light');

	console.log("[WayFarer+] Loaded DarkMode CSS");
}
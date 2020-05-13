function Sound(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.style.display = "none";
	document.body.appendChild(this.sound);
	this.play = function(){
		this.sound.play();
	};
	this.stop = function(){
		this.sound.pause();
	};
}

function playSound(){
	var sound = new Sound(extURL + "assets/sounds/ping.mp3");
	sound.play();
}

document.addEventListener("WFPNSubCtrlHooked", playSound);
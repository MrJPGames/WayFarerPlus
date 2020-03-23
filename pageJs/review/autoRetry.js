// Adds AutoRetry mode
function autoRetry() {
	var autoRetryWarning = '<div class="error-message__autoretry"><i class="glyphicon glyphicon-repeat"></i><span class="ng-binding">Retrying in <span id="countdown">5</span> seconds</span></div>'
    document.getElementsByClassName("error-message__actions")[0].insertAdjacentHTML('afterend', autoRetryWarning);

    var seconds = document.getElementById("countdown").textContent;
    var countdown = setInterval(function() {
		if (seconds > 0) {
			seconds--;
			document.getElementById("countdown").textContent = seconds;
		} else {
			window.location.reload();
		}
    }, 1000);
}

document.addEventListener("WFPNSubCtrlError", autoRetry);
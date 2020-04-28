document.addEventListener("WFPNSubCtrlHooked", function() {
    var mainButton = getMapDropdown(nSubCtrl.pageData.lat, nSubCtrl.pageData.lng, nSubCtrl.pageData.title);
    //Add elem to page
    switch (nSubCtrl.reviewType) {
        case "NEW":
            var cardFooterElems = document.getElementsByClassName("card__footer");
            var cardFooterElem = cardFooterElems[cardFooterElems.length - 1];
            cardFooterElem.insertBefore(mainButton, cardFooterElem.children[0]);
            break;
        case "EDIT":
            var infoCard = document.getElementsByClassName("known-information-card")[0];
            infoCard.style.display = "inline-block";
            infoCard.appendChild(mainButton);
            break;
    }
});


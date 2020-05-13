function removeRedundantDescriptions() {
    while (document.getElementsByClassName('card-header__description').length > 0) {
        document.getElementsByClassName('card-header__description')[0].remove();
    }
}

function setupCompactCard() {
    if (nSubCtrl.reviewType != "NEW")
        return; //Only works for new submissions

    if (!nSubCtrl.hasSupportingImageOrStatement) {
        document.getElementById("supporting-card").classList.remove("ng-hide");
        document.getElementById("supporting-card").getElementsByClassName("supporting-image")[0].remove();

        var replaceContent = document.createElement("h4");
        replaceContent.setAttribute("class", "ng-binding");
        replaceContent.innerText = "This nomination was made using Scanner [REDACTED], which means that no supporting photo or supporting statement were given.";

        document.getElementById("supporting-card").getElementsByClassName("card__body")[0].appendChild(replaceContent);
    }

    var fragment = document.createDocumentFragment();
    fragment.appendChild(document.getElementById(divNames.titleAndDescription));
    document.getElementById('three-card-container').appendChild(fragment);
    document.getElementById(divNames.titleAndDescription).classList.remove("card--expand");
    document.getElementById(divNames.titleAndDescription).classList.add("small-card");
    document.getElementById(divNames.titleAndDescription).style.minHeight = "232pt";
    document.getElementById(divNames.titleAndDescription).getElementsByClassName('card__body')[0].style.paddingTop = "0pt";
    document.getElementById(divNames.titleAndDescription).getElementsByTagName("h1")[0].style.fontSize = "26pt";
    document.getElementById(divNames.titleAndDescription).getElementsByTagName("h4")[1].style.fontSize = "16pt";
    document.getElementById(divNames.titleAndDescription).getElementsByClassName("five-stars")[0].style.marginBottom = "-1em";
    document.getElementById(divNames.titleAndDescription).getElementsByClassName("five-stars")[0].style.marginTop = "-0.2em";
    document.getElementById(divNames.historicOrCultural).classList.add("middle-card");
    document.getElementById(divNames.visuallyUnique).classList.remove("middle-card");
    document.getElementById(divNames.safeAccess).classList.add("middle-card");

    document.getElementById(divNames.historicOrCultural).getElementsByClassName('card-header__title')[0].style.padding = "0pt";
    document.getElementById(divNames.historicOrCultural).getElementsByClassName('card-header__title')[0].style.margin = "5.5pt 0pt -1pt";
    document.getElementById(divNames.historicOrCultural).getElementsByClassName('card-header')[0].style.marginBottom = "-20pt";
    document.getElementById(divNames.historicOrCultural).getElementsByClassName('card-header')[0].style.marginTop = "-6pt";
    document.getElementById(divNames.historicOrCultural).style.maxHeight = "3em";
    document.getElementById(divNames.visuallyUnique).getElementsByClassName('card-header__title')[0].style.padding = "0pt";
    document.getElementById(divNames.visuallyUnique).getElementsByClassName('card-header__title')[0].style.margin = "5.5pt 0pt -1pt";
    document.getElementById(divNames.visuallyUnique).getElementsByClassName('card-header')[0].style.marginBottom = "-20pt";
    document.getElementById(divNames.visuallyUnique).getElementsByClassName('card-header')[0].style.marginTop = "-6pt";
    document.getElementById(divNames.visuallyUnique).style.maxHeight = "3em";
    document.getElementById(divNames.safeAccess).getElementsByClassName('card-header__title')[0].style.padding = "0pt";
    document.getElementById(divNames.safeAccess).getElementsByClassName('card-header__title')[0].style.margin = "5.5pt 0pt -1pt";
    document.getElementById(divNames.safeAccess).getElementsByClassName('card-header')[0].style.marginBottom = "-20pt";
    document.getElementById(divNames.safeAccess).getElementsByClassName('card-header')[0].style.marginTop = "-6pt";
    document.getElementById(divNames.safeAccess).style.maxHeight = "3em";

    document.getElementById(divNames.historicOrCultural).getElementsByClassName("card-header__title")[0].innerText = "Historic/Cultural";

    document.getElementById(divNames.duplicates).classList.remove("card--double-width");
    document.getElementById(divNames.duplicates).classList.add("card--expand");
    document.getElementById(divNames.duplicates).style.order = 4;

    document.getElementById(divNames.location).classList.remove("card--double-width");
    document.getElementById(divNames.location).classList.add("card--expand");
    document.getElementById(divNames.location).style.order = 6;

    document.getElementById("three-card-container").style.order = 2;
    document.getElementById(divNames.titleAndDescription).style.order = 1;
    document.getElementById(divNames.historicOrCultural).style.order = 2;
    document.getElementById(divNames.visuallyUnique).style.order = 3;
    document.getElementById(divNames.safeAccess).style.order = 4;
    document.getElementById(divNames.whatIsIt).style.order = 7;
    document.getElementById(divNames.whatIsIt).style.minWidth = "40%";

    removeRedundantDescriptions();
}

document.addEventListener("WFPNSubCtrlHooked", setupCompactCard);
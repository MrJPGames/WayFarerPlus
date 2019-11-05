function loadStats(){
    if (!nomCtrl.loaded){
        setTimeout(loadStats, 100);
        return;
    }

    var elem = document.getElementById("nomStats");

    var nomCount = nomCtrl.nomList.length;

    var acceptedCount = 0;
    var deniedCount = 0;
    var inVoteCount = 0;
        var inVoteUpgradeCount = 0;
    var inQueueCount = 0;
        var inQueueUpgradeCount = 0;
    var dupeCount = 0;
    var withdrawnCount = 0;

    var availableNominations = 0;
    if (settings["accIngress"])
        availableNominations += 14;
    if (settings["accPoGo"])
        availableNominations += 7;

    if (localStorage.wfpNominationTypes == undefined){
        localStorage.wfpNominationTypes = JSON.stringify({});
    }

    var nomTypes = JSON.parse(localStorage.wfpNominationTypes);
    var unlocks = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]; // Array that stores the amount of nomination unlocks for every day for the upcomming 14 days

    for(var i = 0; i < nomCount; i++){
        //Keep track of basic counting stats
        switch (nomCtrl.nomList[i].status){
            case "NOMINATED":
                inQueueCount++;
                if (nomCtrl.nomList[i].upgraded)
                    inQueueUpgradeCount++;
                break;
            case "VOTING":
                inVoteCount++;
                if (nomCtrl.nomList[i].upgraded)
                    inVoteUpgradeCount++;
                break;
            case "REJECTED":
                deniedCount++;
                break;
            case "ACCEPTED":
                acceptedCount++;
                break;
            case "DUPLICATE":
                dupeCount++;
                break;
            case "WITHDRAWN":
                withdrawnCount++;
                break;
            default:
                console.log("[WayFarer+] Encountered unknown status: " + nomCtrl.nomList[i].status);
                break;
        }

        //Available nomination determinations & new unlock date determinations
        var nomAge = daysSince(nomCtrl.nomList[i].day);
        if (settings["accIngress"] && settings["accPoGo"]){
            var nomType = nomTypes[nomCtrl.nomList[i].id];
            if (nomType == "pogo"){
                nomPeriod = 15;
            }else{
                //Both when Ingress is set, and otherwise this is our default assumption
                nomPeriod = 14;
            }
        }else if (settings["accIngress"]){
            nomPeriod = 14; //Only ingress noms
        }else{
            nomPeriod = 15; //Only pogo noms
        }
        if (nomAge < nomPeriod){
            availableNominations--;

            unlocks[(nomPeriod-1)-nomAge]++;
        }
    }

    var html =  "Total Nominations: " + parseInt(nomCount) +
                "<br/>Accepted: " + parseInt(acceptedCount) +
                "<br/>Rejected: " + parseInt(deniedCount) +
                "<br/>Withdrawn: " + parseInt(withdrawnCount) +
                "<br/>Duplicates: " + parseInt(dupeCount) +
                "<br/>In Voting: " + parseInt(inVoteCount) + " (" + parseInt(inVoteUpgradeCount) + " upgraded)" +
                "<br/>In Queue: " + parseInt(inQueueCount) + " (" + parseInt(inQueueUpgradeCount) + " upgraded)" +
                "<br/><br/>Nominations available: " + parseInt(availableNominations) +
                "<br/>Nomination unlocks:";


    var currentDay = new Date();
    if (unlocks != [0,0,0,0,0,0,0,0,0,0,0,0,0,0]){
        //Start table and create header
        html += "<table><thead><tr><th>Date (Y-M-D)</th><th># of unlocks</th></tr></thead><tbody>";

        for (var i = 0; i < unlocks.length; i++){
            if (unlocks[i] != 0){
                html += "<tr><td>" + currentDay.toISOString().substring(0, 10) + "</td><td>" + unlocks[i] + "</td></tr>";
            }
            currentDay.setDate(currentDay.getDate()+1);
        }
        //end table
        html += "</tbody></table>";
    }

    elem.innerHTML = html;

}

function updateNomTypeButtons(){
    if (localStorage.wfpNominationTypes == undefined){
        localStorage.wfpNominationTypes = "";
    }
    var nomType = JSON.parse(localStorage.wfpNominationTypes)[nomCtrl.currentNomination.id];
    if (nomType == undefined){
        document.getElementById("pogo").checked = false;
        document.getElementById("ingress").checked = false;
    }else if (nomType == "pogo"){
        document.getElementById("pogo").checked = true;
        document.getElementById("ingress").checked = false;
    }else{
        document.getElementById("pogo").checked = false;
        document.getElementById("ingress").checked = true;
    }
}

function setNomType(e){
    //e is the ID of the element that calls the function ("pogo" or "ingress")

    //Get current storage
    var nomTypes = JSON.parse(localStorage.wfpNominationTypes);
    //Set entry
    nomTypes[nomCtrl.currentNomination.id] = e;
    //Store changes
    localStorage.wfpNominationTypes = JSON.stringify(nomTypes);
}

document.addEventListener("WFPNomCtrlHooked", loadStats, false);

if (settings["accIngress"] && settings["accPoGo"])
    document.addEventListener("WFPNomSelected", updateNomTypeButtons, false);

//Helper functions
function daysSince(date2){
    var date1 = Date.now();
    date2 = new Date(date2);
    var diffTime = Math.abs(date2 - date1);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

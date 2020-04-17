(function () {
  function downloadFile(type, name, content) {
    const hiddenElement = document.createElement("a");
    hiddenElement.href =
      `data:${type};charset=utf-8,` + encodeURIComponent(content);
    hiddenElement.target = "_blank";
    hiddenElement.download = name;
    hiddenElement.click();
  }
  function escapeValue(value) {
    return `"${`${value}`.replace(/"/g, '""')}"`;
  }

  function convertToCSV(arr) {
    const array = [Object.keys(arr[0])].concat(arr);

    return "sep=,\n" + array
      .map((it) => {
        return Object.values(it).map(escapeValue).toString();
      })
      .join("\n");
  }

  function initButtons() {
    const nominationHeader = document.querySelector(".nomination-header");
    nominationHeader.insertAdjacentHTML(
      "afterend",
      `<div class="nomination-header-buttons" style="display: block;">
            <div class="nom-buttons">
                <button class="button-secondary export-csv">Export CSV</button>
                <button class="button-secondary export-geojson">Export GeoJSON</button>
            </div>
        </div>`
    );
    const csvButton = document.querySelector(".export-csv");
    const geojsonButton = document.querySelector(".export-geojson");

    const colorMap = {
      ACCEPTED: "#008000",
      NOMINATED: "#0000FF",
      WITHDRAWN: "#FFA500",
      VOTING: "#FFFF00",
      REJECTED: "#FF0000",
      DEFAULT: "#FFFFFF",
    };

    // nomCtrl.nomList
    csvButton.addEventListener("click", () => {
      const nominationList = addUserID(nomCtrl.nomList) || [];

      if (!nominationList.length) {
        alert("No nominations to export!");
        return;
      }

      const csv = convertToCSV(nominationList);
      downloadFile("text/csv", "nominations.csv", csv);
    });

    geojsonButton.addEventListener("click", () => {
      const nominationList = addUserID(nomCtrl.nomList) || [];
      if (!nominationList.length) {
        alert("No nominations to export!");
        return;
      }
      const geojson = {
        type: "FeatureCollection",
        features: nominationList.map(({ lat, lng, ...props }) => {
          return {
            properties: {
              "marker-color": colorMap[props.status] || colorMap["DEFAULT"],
              ...props,
            },
            geometry: {
              coordinates: [lng, lat],
              type: "Point",
            },
            type: "Feature",
          };
        }),
      };
      downloadFile("text/json", "nominations.json", JSON.stringify(geojson));
    });
  }

  function addUserID(nomList){
    nomList.forEach(elem => elem["userID"] = userID);
    return nomList;
  }

  var userID = (document.getElementById("upgrades-profile-icon").getElementsByTagName("image")[0].href.baseVal).substr(37);

  document.addEventListener("WFPNomCtrlHooked", initButtons, false);
})();

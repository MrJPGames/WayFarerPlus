(function() {
  const getNominations = () => {
    const currentItemsText = localStorage.getItem("wfpSaved") || "[]";
    const currentItems = JSON.parse(currentItemsText);
    return currentItems;
  };
  const saveNomination = () => {
    if (nSubCtrl.reviewType !== "NEW") {
      console.log("Not a new review. Skipping the save.");
      return;
    }

    const {
      title,
      description,
      imageUrl,
      lat,
      lng,
      statement,
      supportingImageUrl
    } = nSubCtrl.pageData;
    const toSave = {
      title,
      description,
      imageUrl,
      lat,
      lng,
      statement,
      supportingImageUrl,
      ts: +new Date()
    };

    const currentItems = getNominations();
    const lastItem = currentItems.length
      ? currentItems[currentItems.length - 1]
      : null;
    const isSameNomination = lastItem && lastItem.imageUrl === imageUrl;
    if (isSameNomination) {
      // update the result
      currentItems[currentItems.length - 1] = toSave;
    } else {
      // push the new result
      currentItems.push(toSave);
    }
    localStorage.setItem("wfpSaved", JSON.stringify(currentItems));
  };

  const buildLine = ({ ts, description, title, imageUrl, lat, lng }, index) => {
    const date = new Date(ts);
    const dateTimeFormat = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    });
    const formattedDate = dateTimeFormat.format(date);

    return `
    <tr>
        <td>${formattedDate}</th>
        <td><a href="${imageUrl}=s0" target="_blank"><img style="width: 50px" title="${title} - ${description}" src="${imageUrl}" /></a></td>
        <td>${title}</td>
        <td data-index="${index}" style="cursor:pointer">📍${lat},${lng}</td>
    </tr>
    `;
  };

  function buildMap(nominationList, mapElement) {
    const mapSettings = settings["ctrlessZoom"]
      ? { scrollwheel: true, gestureHandling: "greedy" }
      : {};
    const gmap = new google.maps.Map(mapElement, {
      zoom: 8,
      ...mapSettings
    });

    const bounds = new google.maps.LatLngBounds();
    const markers = nominationList.map(nomination => {
      const latLng = {
        lat: nomination.lat,
        lng: nomination.lng
      };
      const marker = new google.maps.Marker({
        map: gmap,
        position: latLng,
        title: nomination.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8.5,
          fillColor: "#F00",
          fillOpacity: 0.4,
          strokeWeight: 0.4
        }
      });

      bounds.extend(latLng);
      return marker;
    });

    gmap.fitBounds(bounds);
  }

  const downloadObjectAsJson = (exportObj, exportName) => {
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const formatAsGeojson = nominations => {
    return {
      type: "FeatureCollection",
      features: nominations.map(nomination => {
        const { lat, lng, ...props } = nomination;
        return {
          properties: {
            ...nomination
          },
          geometry: {
            coordinates: [lng, lat],
            type: "Point"
          },
          type: "Feature"
        };
      })
    };
  };

  const showEvaluated = () => {
    const profileStats = document.getElementById("profile-main-contain");
    const nominations = getNominations();
    profileStats.insertAdjacentHTML(
      "beforeend",
      `
        <div>
            <h3>Reviewed</h3>
            <div id="reviewed-map" style="height:300px"></div>
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody id="nomination-list">
                    ${nominations
                      .map(buildLine)
                      .reverse()
                      .join("")}
                </tbody>
            </table>
            <button id="export-geojson">Export GeoJSON</button>
            <button id="clean-history">Clean History</button>
        </div>`
    );
    buildMap(nominations, document.getElementById("reviewed-map"));
    const nominationListElement = document.getElementById("nomination-list");
    const exportButton = document.getElementById("export-geojson");

    exportButton.addEventListener("click", () => {
      const geoJson = formatAsGeojson(nominations);
      downloadObjectAsJson(geoJson, "nominations.geojson");
    });

    nominationListElement.addEventListener("click", ({ target }) => {
      if (!(target.dataset && target.dataset.index)) {
        return;
      }
    });
  };

  document.addEventListener("WFPAllRevHooked", saveNomination);
  document.addEventListener("WFPPCtrlHooked", showEvaluated);
})();

(function() {
  const infoWindow = new google.maps.InfoWindow({
    content: "TODO"
  });
  let markers = [];

  const getReviews = () => {
    const currentItemsText = localStorage.getItem("wfpSaved") || "[]";
    const currentItems = JSON.parse(currentItemsText);
    return currentItems;
  };

  const clearLocalStorage = () => {
    const confirmation = confirm(
      "This will delete all your review history! Are you sure?"
    );
    if (confirmation) {
      localStorage.removeItem("wfpSaved");
      window.location.reload();
    }
  };

  const saveReview = submitData => {
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
      ts: +new Date(),
      review: submitData
    };

    const currentItems = getReviews();
    const lastItem = currentItems.length
      ? currentItems[currentItems.length - 1]
      : null;
    const isSameReview = lastItem && lastItem.imageUrl === imageUrl;
    if (isSameReview) {
      // update the result
      currentItems[currentItems.length - 1] = toSave;
    } else {
      // push the new result
      currentItems.push(toSave);
    }
    localStorage.setItem("wfpSaved", JSON.stringify(currentItems));
  };

  const formatTs = ts => {
    const date = new Date(ts);
    const dateTimeFormat = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    });
    return dateTimeFormat.format(date);
  };

  const buildLine = ({ ts, description, title, review, lat, lng }, index) => {
    const formattedDate = formatTs(ts);
    let quality = "";
    let moreInfo = "";

    if (review === "skipped") {
      quality = "Skipped";
    } else if (!review) {
      quality = "Unknown";
    } else if (review.quality) {
      // was not a reject
      quality = review.quality;
      // const { uniqueness, cultural, description, location, safety } = review;
      // moreInfo = `(${[ quality, description, cultural, uniqueness, safety, location ].join('/')})`;
    } else if (review.spam) {
      // was a reject
      quality = 1;
      moreInfo = `(${review.rejectReason})`;
    }

    return `
    <tr>
        <td>${formattedDate}</td>
        <td>${quality}${moreInfo}</td>
        <td>${title}</td>
        <td data-index="${index}" style="cursor:pointer">📍${lat},${lng}</td>
    </tr>
    `;
  };

  function buildMap(reviewList, mapElement) {
    const mapSettings = settings["ctrlessZoom"]
      ? { scrollwheel: true, gestureHandling: "greedy" }
      : {};
    const gmap = new google.maps.Map(mapElement, {
      zoom: 8,
      ...mapSettings
    });

    const bounds = new google.maps.LatLngBounds();
    const gradedColors = [
      "#888888",
      "#ff3d00",
      "#ff8e01",
      "#fece00",
      "#8ac51f",
      "#00803b"
    ];

    markers = reviewList.map(review => {
      const latLng = {
        lat: review.lat,
        lng: review.lng
      };
      const reviewPoints = review.review || { quality: 0 };
      const quality = reviewPoints.quality || 1; // Rejected have quality at 0
      const marker = new google.maps.Marker({
        map: gmap,
        position: latLng,
        title: review.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8.5,
          fillColor: gradedColors[quality],
          fillOpacity: 0.8,
          strokeWeight: 0.4
        }
      });

      bounds.extend(latLng);
      return marker;
    });

    const markerClusterer = new MarkerClusterer(gmap, markers, {
      imagePath:
        "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
      gridSize: 30,
      zoomOnClick: true,
      maxZoom: 10
    });
    gmap.fitBounds(bounds);
    return gmap;
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

  const formatAsGeojson = reviews => {
    return {
      type: "FeatureCollection",
      features: reviews.map(review => {
        const { lat, lng, ...props } = review;
        return {
          properties: {
            ...props
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

  const getReviewData = reviewData =>
    typeof reviewData === "object" ? reviewData : {};

  const getDD = (term, definition) =>
    definition ? `<dt>${term}</dt><dd>${definition}</dd>` : "";

  const buildInfoWindowContent = review => {
    console.log({ review });
    const {
      title,
      imageUrl,
      description,
      statement,
      supportingImageUrl
    } = review;
    const { comment, newLocation, quality, spam, rejectReason } = getReviewData(
      review.review
    );
    const score = spam ? 1 : quality || 0;
    const scoreString = Array(5)
      .fill(0)
      .map((_, i) => (i + 1 <= score ? "★" : "☆"))
      .join("");
    const status = review.review === "skipped" ? "Skipped" : "Pending";

    return `<div class="panel panel-default">
    <div class="panel-heading">${title} <div class="pull-right star-red-orange">${
      score ? scoreString : status
    }</div></div>
    <div class="panel-body">
        <div class="row">
          <div class="col-xs-4"><a target="_blank" href="${imageUrl}=s0"><img style="max-width: 100%" src="${imageUrl}" class="img-responsive" alt="${title}"></a></div>
          <div class="col-xs-8">
            <dl class="dl-horizontal">
              ${getDD("Title", title)}
              ${getDD("Description", description)}
              ${getDD("Statement", statement)}
              <dt>Supporting Image</dt>
              <dd><a target="_blank" href="${supportingImageUrl}=s0">View</a></dd>
              ${getDD("Comment", comment)}
              ${getDD("New Location", newLocation)}
              ${getDD("Reject Reason", rejectReason)}
            </dl>
          </div>
        </div>
      </div>
  </div>`;
  };

  const showEvaluated = () => {
    const reviews = getReviews();

    if (!reviews.length) return;
    const profileStats = document.getElementById("profile-main-contain");
    profileStats.insertAdjacentHTML(
      "beforeend",
      `
        <div class="container">
            <h3>Reviewed</h3>
            <div id="reviewed-map" style="height:400px"></div>
            <div class="table-responsive" style="margin-top:1rem">
              <table class="table table-striped table-condensed">
                  <thead>
                      <tr>
                          <th>Date</th>
                          <th>Score</th>
                          <th>Title</th>
                          <th>Location</th>
                      </tr>
                  </thead>
                  <tbody id="review-list">
                      ${reviews
                        .map(buildLine)
                        .reverse()
                        .join("")}
                  </tbody>
              </table>
            </div>
            <button class="button-secondary" id="export-geojson">Export GeoJSON</button>
            <button class="button-secondary" id="clean-history">Clean History</button>
        </div>`
    );
    const map = buildMap(reviews, document.getElementById("reviewed-map"));
    const reviewListElement = document.getElementById("review-list");
    const exportButton = document.getElementById("export-geojson");
    const cleanHistoryButton = document.getElementById("clean-history");

    exportButton.addEventListener("click", () => {
      const geoJson = formatAsGeojson(reviews);
      downloadObjectAsJson(geoJson, "reviews.geojson");
    });

    cleanHistoryButton.addEventListener("click", clearLocalStorage);

    reviewListElement.addEventListener("click", ({ target }) => {
      const index = target.dataset && target.dataset.index;
      if (!index) {
        return;
      }

      const currentMarker = markers[index];
      const currentReview = reviews[index];

      infoWindow.open(map, currentMarker);
      infoWindow.setContent(buildInfoWindowContent(currentReview));
      map.panTo({ lat: currentReview.lat, lng: currentReview.lng });
    });
  };

  document.addEventListener("WFPAllRevHooked", () => saveReview(false));
  document.addEventListener("WFPPCtrlHooked", showEvaluated);
  document.addEventListener("WFPAnsCtrlHooked", () => {
    const {
      submitForm,
      skipToNext,
      showLowQualityModal,
      markDuplicate
    } = ansCtrl;

    ansCtrl.submitForm = function() {
      // This only works for accepts
      submitForm();
      saveReview(ansCtrl.formData);
    };

    ansCtrl.showLowQualityModal = function() {
      showLowQualityModal();
      setTimeout(() => {
        const ansCtrl2Elem = document.getElementById("low-quality-modal");
        const ansCtrl2 = angular.element(ansCtrl2Elem).scope().answerCtrl2;
        const oldConfirm = ansCtrl2.confirmLowQuality;
        ansCtrl2.confirmLowQuality = function() {
          oldConfirm();
          saveReview(ansCtrl2.formData);
        };
      }, 10);
    };

    ansCtrl.markDuplicate = function() {
      debugger;
      // TODO. Need to find a duplicate to test this first!
      markDuplicate();
    };
    ansCtrl.skipToNext = function() {
      saveReview("skipped");
      skipToNext();
    };
  });
})();

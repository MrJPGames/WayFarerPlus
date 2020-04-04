(function () {
  const infoWindow = new google.maps.InfoWindow({
    content: "Loading...",
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

  const saveReview = (pageData, submitData) => {
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
      supportingImageUrl,
    } = pageData;
    const toSave = {
      title,
      description,
      imageUrl,
      lat,
      lng,
      statement,
      supportingImageUrl,
      ts: +new Date(),
      review: submitData,
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

  const dateSettings = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };

  const getQuality = review => {
    const isSkipped = review.review === "skipped";
    const isPending = review.review === false;
    const hasReview = Boolean(review.review);
    const quality =
      hasReview && !isSkipped && !isPending ? review.review.quality || 1 : 0;

    return quality;
  };

  const gradedColors = [
    "#888888",
    "#ff3d00",
    "#ff8e01",
    "#fece00",
    "#8ac51f",
    "#00803b",
  ];

  const getColor = review => gradedColors[getQuality(review)];

  function buildMap(reviewList, mapElement) {
    const mapSettings = settings["ctrlessZoom"]
      ? { scrollwheel: true, gestureHandling: "greedy" }
      : {};
    const gmap = new google.maps.Map(mapElement, {
      zoom: 8,
      ...mapSettings,
    });

    const bounds = new google.maps.LatLngBounds();
  
    markers = reviewList.map((review) => {
      const latLng = {
        lat: review.lat,
        lng: review.lng,
      };

      const marker = new google.maps.Marker({
        map: gmap,
        position: latLng,
        title: review.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8.5,
          fillColor: getColor(review),
          fillOpacity: 0.8,
          strokeWeight: 0.4,
        },
      });

      marker.addListener("click", () => {
        infoWindow.open(gmap, marker);
        infoWindow.setContent(buildInfoWindowContent(review));
      });

      bounds.extend(latLng);
      return marker;
    });

    new MarkerClusterer(gmap, markers, {
      imagePath:
        "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
      gridSize: 30,
      zoomOnClick: true,
      maxZoom: 10,
    });
    gmap.fitBounds(bounds);
    return gmap;
  }

  const formatAsGeojson = (reviews) => {
    return {
      type: "FeatureCollection",
      features: reviews.map((review) => {
        const { lat, lng, ...props } = review;
        const reviewData = getReviewData(review.review);
        return {
          properties: {
            "marker-color": getColor(review),
            ...props,
            ...reviewData,
          },
          geometry: {
            coordinates: [lng, lat],
            type: "Point",
          },
          type: "Feature",
        };
      }),
    };
  };

  const getReviewData = (reviewData) =>
    typeof reviewData === "object" ? reviewData : {};

  const getFormattedDate = (ts, fullDate) => {
    const date = new Date(ts);

    if (fullDate) {
      return date.toString();
    }

    return new Intl.DateTimeFormat("default", dateSettings).format(date);
  };
  const getDD = (term, definition) =>
    definition ? `<dt>${term}</dt><dd>${definition}</dd>` : "";

  const getIntelLink = (lat, lng, content) =>
    `<a target="_blank" rel="noreferrer" title="Open in Intel" href="https://intel.ingress.com/intel?ll=${lat},${lng}&z=21">${content}</a>`;

  const getScores = ({ review }) => {
    if (!review || typeof review === "string" || !review.quality) {
      return "";
    }
    return `
    <table class="table table-condensed">
      <thead>
          <tr>
              <th class="text-center">Score</th>
              <th class="text-center">Title</th>
              <th class="text-center">Cultural</th>
              <th class="text-center">Unique</th>
              <th class="text-center">Safety</th>
              <th class="text-center">Location</th>
          </tr>
      </thead>
      <tbody class="review-list">
        <tr>
          <td class="text-center">${review.quality}</td>
          <td class="text-center">${review.description}</td>
          <td class="text-center">${review.cultural}</td>
          <td class="text-center">${review.uniqueness}</td>
          <td class="text-center">${review.safety}</td>
          <td class="text-center">${review.location}</td>
        </tr>
      </tbody>
    </table>
`;
  };
  const buildInfoWindowContent = (review) => {
    const {
      title,
      imageUrl,
      description,
      statement,
      supportingImageUrl,
      lat,
      lng,
      index,
      ts,
    } = review;
    const {
      comment,
      newLocation,
      quality,
      spam,
      rejectReason,
      what,
      duplicate,
    } = getReviewData(review.review);

    const score = spam ? 1 : quality || 0;
    const scoreString = Array(5)
      .fill(0)
      .map((_, i) => (i + 1 <= score ? "★" : "☆"))
      .join("");
    const status = duplicate
      ? "Duplicate"
      : review.review === "skipped"
      ? "Skipped"
      : "Timed Out/Pending";

    return `<div class="panel panel-default">
    <div class="panel-heading">${title} <div class="pull-right star-red-orange">${
      score ? scoreString : status
    }</div></div>
    <div class="panel-body">
        <div class="row">
          <div class="col-xs-12 col-sm-4"><a target="_blank" href="${imageUrl}=s0"><img style="max-width: 100%" src="${imageUrl}" class="img-responsive" alt="${title}"></a></div>
          <div class="col-xs-12 col-sm-8">
            <dl class="dl-horizontal">
              ${getDD("Title", title)}
              ${getDD("Description", description)}
              ${getDD("Statement", statement)}
              ${getDD("Comment", comment)}
              ${getDD("New Location", newLocation)}
              ${getDD("Reject Reason", rejectReason)}
              ${getDD("Comment", rejectReason)}
              ${getDD("What is it?", what)}
              ${getDD(
                "Supporting Image",
                supportingImageUrl &&
                  `<a target="_blank" href="${supportingImageUrl}=s0">View</a>`
              )}
              ${getDD("Location", getIntelLink(lat, lng, "Open in Intel"))}
              ${getDD("Review Date", getFormattedDate(ts, true))}
              ${getDD("Review #", index)}
              ${getDD(
                "Open in Map",
                `<span class="focus-in-map" title="Focus in map" data-index="${index}" style="cursor:pointer" >📍</span>`
              )}
              ${getDD(
                "Mark Accepted",
                `<span class="text-center toggle" data-index="${index}" style="cursor:pointer" title="Toggle Accepted">✅</span>`
              )}
            </dl>
            ${getScores(review)}
          </div>
        </div>
      </div>
  </div>`;
  };

  const showEvaluated = () => {
    const reviews = getReviews().map((review, index) => ({ ...review, index }));

    if (!reviews.length) return;
    const profileStats = document.getElementById("profile-main-contain");
    profileStats.insertAdjacentHTML(
      "beforeend",
      `
        <div class="container">
            <h3>Reviewed</h3>
            <div id="reviewed-map" style="height:600px"></div>
            <div class="table-responsive">
              <table class="table table-striped table-condensed" id="review-history">
              </table>
            </div>
        </div>`
    );
    const $reviewHistory = $("#review-history");
    $reviewHistory.DataTable({
      initComplete: () => {
        $(document).trigger("resize"); // fix for recalculation of columns
      },
      data: reviews,
      order: [[0, "desc"]],
      dom: "PBfrtip",
      buttons: [
        "copy",
        "csv",
        {
          text: "geojson",
          action: (_ev, data) => {
            const filteredReviews = data.buttons
              .exportData()
              .body.map(([index]) => reviews[index]);
            const geoJson = formatAsGeojson(filteredReviews);
            $.fn.dataTable.fileSave(
              new Blob([JSON.stringify(geoJson)]),
              "reviews.geojson"
            );
          },
        },
        { text: "Delete History", action: clearLocalStorage },
      ],
      deferRender: true,
      scrollY: 400,
      scrollCollapse: true,
      scroller: true,
      responsive: {
        details: {
          renderer: (_api, rowIdx, _columns) =>
            buildInfoWindowContent(reviews[rowIdx]),
        },
      },
      searchPanes: {
        columns: [
          9, // score
          17, // Reject Reason
          20, // What is it
        ],
      },
      columns: [
        {
          title: "#",
          data: "index",
          visible: false,
        },
        {
          title: "Date",
          data: "ts",
          render: (ts, type) => {
            if (type === "display" || type === "filter") {
              return getFormattedDate(ts);
            }
            return ts;
          },
        },
        { title: "Title", data: "title", responsivePriority: 1 },
        { title: "Description", data: "description" },
        { title: "Latitude", data: "lat" },
        { title: "Longitude", data: "lng" },
        { title: "Statement", data: "statement" },
        {
          title: "Image URL",
          data: "imageUrl",
        },
        {
          title: "Supporting Image URL",
          data: "supportingImageUrl",
        },
        // General Score
        {
          title: "Score",
          data: "review.quality",
          defaultContent: false,
          render: (score, type, { review }) => {
            if (review === "skipped") {
              return "Skipped";
            }
            if (!review) {
              // Latest result without a review will count as pending
              return "Expired";
            }
            if (review.quality) {
              return review.quality;
            }
            if (review.duplicate) {
              return "Duplicate";
            }
            if (review.spam) {
              // was a reject
              return 1;
            }
            return "?";
          },
        },
        {
          title: "Description Score",
          data: "review.description",
          defaultContent: "?",
        },
        {
          title: "Cultural Score",
          data: "review.cultural",
          defaultContent: "?",
        },
        {
          title: "Uniqueness Score",
          data: "review.uniqueness",
          defaultContent: "?",
        },
        {
          title: "Safety Score",
          data: "review.safety",
          defaultContent: "?",
        },
        {
          title: "Location Score",
          data: "review.location",
          defaultContent: "?",
        },
        // Review Data
        {
          title: "Duplicate",
          data: "review.duplicate",
          defaultContent: false,
        },
        {
          title: "Spam",
          data: "review.spam",
          defaultContent: false,
        },
        {
          title: "Reject Reason",
          data: "review.rejectReason",
          defaultContent: "NOT_REJECTED",
        },
        {
          title: "Comment",
          data: "review.comment",
          defaultContent: false,
        },
        {
          title: "New Location",
          data: "review.newLocation",
          defaultContent: false,
        },
        {
          title: "What is it?",
          data: "review.what",
          defaultContent: false,
        },
      ],
    });
    $reviewHistory.on("draw.dt", function () {
      console.log("Table redrawn");
    });
    const mapElement = document.getElementById("reviewed-map");
    const map = buildMap(reviews, mapElement);

    $("#content-container").on("click", ".toggle[data-index]", (ev) => {
      const { target } = ev;
      const { index } = target.dataset;
      const currentItems = getReviews();
      currentItems[index].accepted = !currentItems[index].accepted;
      localStorage.setItem("wfpSaved", JSON.stringify(currentItems));
    });

    $("#content-container").on("click", ".focus-in-map[data-index]", (ev) => {
      const { target } = ev;
      const { index } = target.dataset;
      const currentMarker = markers[index];
      const currentReview = reviews[index];

      mapElement.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
      infoWindow.open(map, currentMarker);
      infoWindow.setContent(buildInfoWindowContent(currentReview));
      map.setZoom(12);
      map.panTo({ lat: currentReview.lat, lng: currentReview.lng });
    });
  };

  document.addEventListener("WFPAllRevHooked", () =>
    saveReview(nSubCtrl.pageData, false)
  );
  document.addEventListener("WFPPCtrlHooked", showEvaluated);
  document.addEventListener("WFPAnsCtrlHooked", () => {
    const {
      submitForm,
      skipToNext,
      showLowQualityModal,
      markDuplicate,
    } = ansCtrl;

    ansCtrl.submitForm = function () {
      // This only works for accepts
      submitForm();
      saveReview(nSubCtrl.pageData, ansCtrl.formData);
    };

    ansCtrl.showLowQualityModal = function () {
      showLowQualityModal();
      setTimeout(() => {
        const ansCtrl2Elem = document.getElementById("low-quality-modal");
        const ansCtrl2 = angular.element(ansCtrl2Elem).scope().answerCtrl2;
        const oldConfirm = ansCtrl2.confirmLowQuality;
        ansCtrl2.confirmLowQuality = function () {
          oldConfirm();
          saveReview(nSubCtrl.pageData, {
            ...ansCtrl2.formData,
            review: {
              ...answerCtrl2.formData.review,
              comment: ansCtrl2.rejectComment,
            },
          });
        };
      }, 10);
    };

    ansCtrl.markDuplicate = function (id) {
      markDuplicate(id);
      setTimeout(() => {
        const ansCtrl2Elem = document.querySelector(
          ".modal-content > [ng-controller]"
        );
        const ansCtrl2 = angular.element(ansCtrl2Elem).scope().answerCtrl2;
        const confirmDuplicate = ansCtrl2.confirmDuplicate;
        ansCtrl2.confirmDuplicate = function () {
          confirmDuplicate();

          saveReview(nSubCtrl.pageData, {
            ...ansCtrl2.formData,
            duplicateOf: id,
          }); // duplicateOf is not marked in vm or formData
        };
      }, 10);
    };

    ansCtrl.skipToNext = function () {
      saveReview(nSubCtrl.pageData, "skipped");
      skipToNext();
    };
  });
})();

(function () {
  String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, "gi"), replacement);
  };
  //NON-SECURE (But good enough for uniqueID on URLs)
  function getStringHash(str) {
    var hash = 0;
    if (str.length == 0) {
      return hash;
    }
    for (var i = 0; i < str.length; i++) {
      var char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }
  function getOpenInButton(lat, lng, title) {
    //Create main dropdown menu ("button")
    var mainButton = document.createElement("div");
    mainButton.setAttribute("class", "dropdown");

    var buttonText = document.createElement("span");
    buttonText.innerText = "Open in ...";

    var dropdownContainer = document.createElement("div");
    dropdownContainer.setAttribute("class", "dropdown-content");

    mainButton.appendChild(buttonText);
    mainButton.appendChild(dropdownContainer);

    dropdownContainer.innerHTML = null;

    var customMaps = JSON.parse(settings["customMaps"]);

    for (var i = 0; i < customMaps.length; i++) {
      var title = customMaps[i].title;
      var link = customMaps[i].url;

      //Link editing:
      link = link.replaceAll("%lat%", lat);
      link = link.replaceAll("%lng%", lng);
      link = link.replaceAll("%title%", title);

      var button = document.createElement("a");
      button.href = link;
      if (settings["keepTab"])
        button.setAttribute("target", getStringHash(customMaps[i].url));
      //On URL with placeholders as those are the same between different wayspots but not between different maps!
      else button.setAttribute("target", "_BLANK");
      button.innerText = title;
      dropdownContainer.appendChild(button);
    }

    if (customMaps.length == 0) {
      var emptySpan = document.createElement("span");
      emptySpan.innerText = "No custom maps set!";
      dropdownContainer.appendChild(emptySpan);
    }

    return mainButton;
  }

  const debounce = (callback, time) => {
    let interval;
    return (...args) => {
      clearTimeout(interval);
      interval = setTimeout(() => {
        interval = null;
        callback(...args);
      }, time);
    };
  };

  const emptyArray = Array(5).fill(0);
  function getStarRating(score) {
    return `<span style="white-space:nowrap">${emptyArray
      .map((_, i) =>
        i + 1 <= score
          ? `<span class="glyphicon glyphicon-star star-gray"></span>`
          : `<span class="glyphicon glyphicon-star-empty star-gray"></span>`
      )
      .join("")}</span>`;
  }
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

  const getQuality = (review) => {
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

  const getColor = (review) => gradedColors[getQuality(review)];

  const buildMap = (mapElement) => {
    const mapSettings = settings["ctrlessZoom"]
      ? { scrollwheel: true, gestureHandling: "greedy" }
      : {};
    const gmap = new google.maps.Map(mapElement, {
      zoom: 8,
      center: { lat: 0, lng: 0 },
      ...mapSettings,
    });

    return gmap;
  };

  const formatAsGeojson = (reviews) => {
    return {
      type: "FeatureCollection",
      features: reviews.map((review) => review.getGeojson()),
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

  class Review {
    constructor({ review, map, index, cluster }) {
      this.review = review;
      this.index = index;
      this.map = map;
      this.onMap = true;
      this.cluster = cluster;
      this.marker = new google.maps.Marker({
        map,
        position: { lat: review.lat, lng: review.lng },
        title: review.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8.5,
          fillColor: getColor(review),
          fillOpacity: 0.8,
          strokeWeight: 0.4,
        },
      });

      this.marker.addListener("click", () => {
        infoWindow.open(this.gmap, this.marker);
        infoWindow.setContent(buildInfoWindowContent(review));
      });
    }

    hideMarker() {
      this.onMap = false;
      this.marker.setMap(null);
    }

    showMarker() {
      this.onMap = true;
      this.marker.setMap(this.map);
    }

    getScore() {
      const review = this.review.review;
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
    }

    buildInfoWindowContent() {
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
      } = this.review;
      const {
        comment,
        newLocation,
        quality,
        spam,
        rejectReason,
        what,
        duplicate,
      } = getReviewData(this.review.review);

      const score = spam ? 1 : quality || 0;
      const status = duplicate
        ? "Duplicate"
        : this.review.review === "skipped"
        ? "Skipped"
        : "Timed Out/Pending";

      return `<div class="panel panel-default review-details">
      <div class="panel-heading">${title} <div class="pull-right">${
        score ? getStarRating(score) : status
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
                ${getDD(
                  "Location",
                  settings["profOpenIn"]
                    ? getOpenInButton(lat, lng, title).outerHTML
                    : getIntelLink(lat, lng, `Open in Intel`)
                )}
                ${getDD("Review Date", getFormattedDate(ts, true))}
                ${getDD("Review #", index)}
                ${getDD(
                  "Focus in Map",
                  `<span class="focus-in-map" title="Focus in map" data-index="${index}" style="cursor:pointer" >📍</span>`
                )}
                ${getDD(
                  "Toggle Accepted",
                  `<span class="text-center toggle" data-index="${index}" style="cursor:pointer" title="Toggle Accepted">✅</span>`
                )}
              </dl>
              ${getScores(this.review)}
            </div>
          </div>
        </div>
    </div>`;
    }

    getGeojson() {
      const { lat, lng, review, ...props } = this.review;
      const reviewData = getReviewData(review);
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
    }
  }

  const getMarkers = (reviews) => reviews.map((review) => review.marker);

  const showEvaluated = () => {
    const localstorageReviews = getReviews();

    if (!localstorageReviews.length) return;
    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
      const minVal = $("#min").val();
      const maxVal = $("#max").val();
      const min = new Date(minVal || 0);
      const max = maxVal ? new Date(maxVal) : new Date();
      min.setHours(0, 0, 0); // start of the day
      max.setHours(23, 59, 59); // end of the day
      const ts = data[1] || 0;
      return +min <= ts && ts <= +max;
    });
    const profileStats = document.getElementById("profile-main-contain");
    profileStats.insertAdjacentHTML(
      "beforeend",
      `
        <div class="container">
            <h3>Reviewed</h3>
            <div id="reviewed-map" style="height:600px"></div>
            <div class="row row-input">
              <div class="col-xs-6">
                <div class="input-group">
                <label class="input-group-addon" for="max">Start Date</label>
                  <input id="min" type="date" class="form-control">
                </div>
              </div>
              <div class="col-xs-6">
                <div class="input-group">
                  <label class="input-group-addon" for="max">End Date</label>
                  <input id="max" type="date" class="form-control">
                </div>
              </div>
            </div><!-- /.row -->
            <div class="table-responsive">
              <table class="table table-striped table-condensed" id="review-history">
              </table>
            </div>
        </div>`
    );

    const $reviewHistory = $("#review-history");
    const mapElement = document.getElementById("reviewed-map");
    const map = buildMap(mapElement);
    const cluster = new MarkerClusterer(map, [], {
      imagePath:
        "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
      gridSize: 30,
      zoomOnClick: true,
      maxZoom: 10,
    });
    const reviews = localstorageReviews.map(
      (review, index) => new Review({ review, map, index, cluster })
    );
    cluster.addMarkers(getMarkers(reviews));
    cluster.fitMapToMarkers();

    const table = $reviewHistory.DataTable({
      initComplete: () => {
        $(document).trigger("resize"); // fix for recalculation of columns
      },
      rowCallback: (row, { accepted }) => {
        row.classList.remove("success");
        if (accepted) {
          row.classList.add("success");
        }
      },
      drawCallback: () => {
        console.log("drawn");
      },
      data: reviews,
      order: [[0, "desc"]],
      dom: "frtipB",
      buttons: [
        {
          extend: "copy",
          title: "Copy",
          exportOptions: {
            columns: ":not(:last-child)",
          },
        },
        {
          extend: "csv",
          title: "CSV",
          exportOptions: {
            columns: ":not(:last-child)",
          },
        },
        {
          text: "geojson",
          action: (_ev, data) => {
            const filteredReviews = data.buttons
              .exportData()
              .body.map(([index]) => reviews[index]);
            const geoJson = formatAsGeojson(filteredReviews);
            $.fn.dataTable.fileSave(
              new Blob([JSON.stringify(geoJson)]),
              "reviews.json"
            );
          },
        },
        {
          text: "Delete History",
          action: clearLocalStorage,
          className: "btn-danger",
        },
      ],
      deferRender: true,
      scrollY: 400,
      scrollCollapse: true,
      scroller: true,
      responsive: {
        details: {
          renderer: (table, rowIdx, _columns) => {
            const reviewInstance = table.rows(rowIdx).data()[0];
            return reviewInstance.buildInfoWindowContent();
          },
        },
      },
      columns: [
        {
          title: "#",
          data: "index",
          visible: false,
        },
        {
          title: "Date",
          data: "review.ts",
          responsivePriority: 1,
          render: (ts, type, data) => {
            if (type === "display") {
              return getFormattedDate(ts);
            }
            return ts;
          },
        },
        { title: "Title", data: "review.title", responsivePriority: 1 },
        { title: "Description", data: "review.description", visible: false },
        { title: "Latitude", data: "review.lat", visible: false },
        { title: "Longitude", data: "review.lng", visible: false },
        { title: "Statement", data: "review.statement" },
        {
          title: "Image URL",
          data: "review.imageUrl",
        },
        {
          title: "Supporting Image URL",
          data: "review.supportingImageUrl",
        },
        // General Score
        {
          title: "Score",
          data: "review.review.quality",
          defaultContent: false,
          responsivePriority: 2,
          render: (_score, _type, data) => data.getScore(),
        },
        {
          title: "Description Score",
          data: "review.review.description",
          defaultContent: "?",
        },
        {
          title: "Cultural Score",
          data: "review.review.cultural",
          defaultContent: "?",
        },
        {
          title: "Uniqueness Score",
          data: "review.review.uniqueness",
          defaultContent: "?",
        },
        {
          title: "Safety Score",
          data: "review.review.safety",
          defaultContent: "?",
        },
        {
          title: "Location Score",
          data: "review.review.location",
          defaultContent: "?",
        },
        // Review Data
        {
          title: "Duplicate",
          data: "review.review.duplicate",
          defaultContent: false,
        },
        {
          title: "Spam",
          data: "review.review.spam",
          defaultContent: false,
        },
        {
          title: "Reject Reason",
          data: "review.review.rejectReason",
          defaultContent: "NOT_REJECTED",
        },
        {
          title: "Comment",
          data: "review.review.comment",
          defaultContent: false,
        },
        {
          title: "New Location",
          data: "review.review.newLocation",
          defaultContent: false,
        },
        {
          title: "What is it?",
          data: "review.review.what",
          defaultContent: false,
        },
        {
          title: "Accepted?",
          data: "review.accepted",
          defaultContent: false,
        },
        {
          title: "Map",
          responsivePriority: 3,
          render: (_score, _type, { index }) => {
            return `<span class="focus-in-map" title="Focus in map" data-index="${index}" style="cursor:pointer" >📍</span>`;
          },
        },
      ],
    });
    window.table = table; // TODO delete this

    $("#min, #max").on(
      "change",
      debounce(() => {
        table.draw();
      }, 250)
    );

    const filterShown = (review) => review.onMap;

    $reviewHistory.on("draw.dt", function () {
      console.log("Table redrawn");
      // Hide all
      reviews.forEach((review) => review.hideMarker());
      // Show visible
      table
        .rows({ search: "applied" })
        .data()
        .each((review) => review.showMarker());
      cluster.fitMapToMarkers();
    });

    $("#content-container").on("click", ".toggle[data-index]", (ev) => {
      const { target } = ev;
      const { index } = target.dataset;
      const currentItems = getReviews();
      currentItems[index].accepted = !currentItems[index].accepted;
      reviews[index].accepted = !reviews[index].accepted;
      table.row(parseInt(index, 10)).data(reviews[index]).draw();
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
      infoWindow.setContent(currentReview.buildInfoWindowContent());
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

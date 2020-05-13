document.addEventListener("WFPPCtrlHooked", function deferLegacyCode() {
	if (window.jQuery !== undefined) {
		mainLoad();
	} else {
		setTimeout(deferLegacyCode, 500);
	}
});

function mainLoad() {
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

	function clearLocalStorage() {
		const confirmation = confirm(
			"This will delete all your review history! Are you sure?"
		);
		if (confirmation) {
			removeReviewHistory();
			window.location.reload();
		}
	};

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


	const infoWindow = new google.maps.InfoWindow({
		content: "Loading...",
	});

	String.prototype.replaceAll = function (search, replacement) {
		var target = this;
		return target.replace(new RegExp(search, "gi"), replacement);
	};
	//NON-SECURE (But good enough for uniqueID on URLs)
	function getStringHash(str) {
		var hash = 0;
		if (str.length === 0) {
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

		if (customMaps.length === 0) {
			var emptySpan = document.createElement("span");
			emptySpan.innerText = "No custom maps set!";
			dropdownContainer.appendChild(emptySpan);
		}
		return mainButton;
	}


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
		`<a target="${getTarget(
			"intel"
		)}" rel="noreferrer" title="Open in Intel" href="https://intel.ingress.com/intel?ll=${lat},${lng}&z=21">${content}</a>`;

	const renderScores = ({ review }) => {
		if (!review || typeof review === "string" || !review.quality) {
			return "";
		}
		return `
    <table class="table table-condensed scores">
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

	const getTarget = (target) => {
		if (!settings["keepTab"]) {
			return "_blank";
		}
		return getStringHash(target);
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
				infoWindow.setContent(this.buildInfoWindowContent());
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

		toggleAccepted() {
			this.review.accepted = !this.review.accepted;
			const localStorageReviews = getReviews();
			const localStorageReview = localStorageReviews[this.index];
			localStorageReview.accepted = !localStorageReview.accepted;
			storeReviewHistory(localStorageReviews);
		}

		renderScore(type) {
			const review = this.review.review;
			if (review === "skipped") {
				if (type === "sort") return 0;
				return "Skipped";
			}
			if (!review) {
				if (type === "sort") return -1;
				// Latest result without a review will count as pending
				return "Expired";
			}
			if (review.quality) {
				return type === "sort" || type === "export"
					? review.quality
					: getStarRating(review.quality);
			}
			if (review.duplicate) {
				if (type === "sort") return -2;
				return "Duplicate";
			}
			if (review.spam) {
				// was a reject
				return type === "sort" || type === "export" ? 1 : getStarRating(1);
			}
			return "?";
		}

		renderActions() {
			const {
				index,
				review: { lat, lng },
			} = this;
			return `
      <span class="toggle-details"></span>
      <span class="focus-in-map" title="Focus in map" data-index="${index}" style="cursor:pointer" >📍</span>
      ${getIntelLink(
				lat,
				lng,
				`<img src="https://intel.ingress.com/favicon.ico" />`
			)}
      <span class="text-center toggle" data-index="${index}" style="cursor:pointer;" title="Toggle Accepted">✅</span>
      `;
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
				ts,
			} = this.review;
			const index = this.index;
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
            <div class="col-xs-12 col-sm-4"><a target="${getTarget(
				"images"
			)}" href="${imageUrl}=s0"><img style="max-width: 100%; max-height: 300px;" src="${imageUrl}" class="img-responsive" alt="${title}"></a></div>
            <div class="col-xs-12 col-sm-8">
              <dl class="dl-horizontal">
                ${getDD("Title", title)}
                ${getDD("Description", description)}
                ${getDD("Statement", statement)}
                ${getDD("Comment", comment)}
                ${getDD("New Location", newLocation)}
                ${getDD("Reject Reason", rejectReason)}
                ${getDD("What is it?", what)}
                ${getDD(
				"Supporting Image",
				supportingImageUrl &&
				`<a target="${getTarget(
					"images"
				)}" href="${supportingImageUrl}=s0">View</a>`
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
              ${renderScores(this.review)}
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
					"marker-color": getColor(this.review),
					...props,
					index: this.index,
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

		const profileStats = document.getElementById("profile-main-contain");
		profileStats.insertAdjacentHTML(
			"beforeend",
			`
        <div class="container">
            <h3>Review History</h3>
            <div class="row row-input">
              <div class="col-xs-6">
                <div class="input-group">
                <label class="input-group-addon" for="date-range">Start Date</label>
                  <input id="date-range" type="text" class="form-control">
                </div>
              </div>
              <div class="col-xs-6">
              <div class="input-group">
                <label class="input-group-addon" for="search">Search</label>
                <input id="search" type="text" autocomplete="off" class="form-control">
              </div>
            </div>
            </div>
            <div id="reviewed-map" style="height:600px"></div>
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
			rowCallback: (row, review) => {
				const accepted = review.review && review.review.accepted;
				row.classList.remove("success");
				if (accepted) {
					row.classList.add("success");
				}
			},
			data: reviews,
			order: [[0, "desc"]],
			dom: "rtiB",
			buttons: [
				{
					extend: "csvHtml5",
					title: "CSV",
					exportOptions: {
						orthogonal: "export",
						columns: ":not(:last-child)",
					},
				},
				{
					text: "GeoJSON",
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
			scrollY: 500,
			scrollCollapse: true,
			scroller: true,
			columns: [
				{
					title: "#",
					data: "index",
					visible: false,
				},
				{
					title: "Date",
					data: "review.ts",
					render: (ts, type) => {
						if (type === "display") {
							return getFormattedDate(ts);
						}
						return ts;
					},
				},
				{ title: "Title", data: "review.title" },
				// General Score
				{
					title: "Score",
					data: "review.review.quality",
					defaultContent: false,
					render: (_score, type, data) => data.renderScore(type),
				},
				{ title: "Description", data: "review.description", visible: false },
				{
					title: "Supporting Statement",
					data: "review.statement",
					visible: false,
				},
				{ title: "Image URL", data: "review.imageUrl", visible: false },
				{
					title: "Supporting Image URL",
					data: "review.supportingImageUrl",
					visible: false,
				},
				{
					title: "Description Score",
					data: "review.review.description",
					defaultContent: "?",
					visible: false,
				},
				{
					title: "Cultural Score",
					data: "review.review.cultural",
					defaultContent: "?",
					visible: false,
				},
				{
					title: "Uniqueness Score",
					data: "review.review.uniqueness",
					defaultContent: "?",
					visible: false,
				},
				{
					title: "Safety Score",
					data: "review.review.safety",
					defaultContent: "?",
					visible: false,
				},
				{
					title: "Location Score",
					data: "review.review.location",
					defaultContent: "?",
					visible: false,
				},
				// Review Data
				{
					title: "Duplicate",
					data: "review.review.duplicate",
					defaultContent: false,
					visible: false,
				},
				{
					title: "Spam",
					data: "review.review.spam",
					defaultContent: false,
					visible: false,
				},
				{
					title: "Reject Reason",
					data: "review.review.rejectReason",
					defaultContent: "NOT_REJECTED",
					visible: false,
				},
				{
					title: "Comment",
					data: "review.review.comment",
					defaultContent: false,
					visible: false,
				},
				{
					title: "New Location",
					data: "review.review.newLocation",
					defaultContent: false,
					visible: false,
				},
				{
					title: "What is it?",
					data: "review.review.what",
					defaultContent: false,
					visible: false,
				},
				{
					title: "Accepted?",
					data: "review.accepted",
					defaultContent: false,
					visible: false,
				},
				{
					title: "Actions",
					className: "review-actions",
					sortable: false,
					render: (_score, _type, review) => {
						return review.renderActions();
					},
				},
			],
		});

		$('.dataTables_scrollBody').css('min-height', '500px');

		const debouncedDraw = debounce(() => {
			table.draw();
		}, 250);

		$("#search").on("change", debouncedDraw);

		let startDate = moment(reviews[0].review.ts);
		let endDate = moment();
		$("#date-range").daterangepicker(
			{
				showDropdowns: true,
				timePicker: false,
				timePicker24Hour: true,
				autoApply: true,
				ranges: {
					Today: [moment().startOf("day"), moment()],
					Yesterday: [
						moment().subtract(1, "days").startOf("day"),
						moment().subtract(1, "days").endOf("day"),
					],
					"Last 7 Days": [moment().subtract(6, "days"), moment()],
					"Last 30 Days": [moment().subtract(29, "days"), moment()],
					"This Month": [moment().startOf("month"), moment().endOf("month")],
					"Last Month": [
						moment().subtract(1, "month").startOf("month"),
						moment().subtract(1, "month").endOf("month"),
					],
				},
				alwaysShowCalendars: true,
				startDate,
				endDate,
				maxDate: moment(),
				locale: {
					format: "DD/MM/YYYY",
				},
			},
			(start, end) => {
				startDate = start;
				endDate = end;
				window.endDate = end;
				debouncedDraw();
			}
		);

		$.fn.dataTable.ext.search.push((_settings, data, _dataIndex) => {
			const ts = moment(parseInt(data[1]));
			return +ts >= +startDate && +ts <= +endDate;
		});

		$.fn.dataTable.ext.search.push((_settings, data, _dataIndex) => {
			const searchValue = $("#search").val();
			return data[2].toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
		});

		const filterShown = (review) => review.onMap;

		$reviewHistory.on("draw.dt", function () {
			// Hide all
			reviews.forEach((review) => review.hideMarker());
			// Show visible
			table
			.rows({ search: "applied" })
			.data()
			.each((review) => review.showMarker());

			const shownReviews = reviews.filter(filterShown);
			cluster.clearMarkers();
			cluster.addMarkers(getMarkers(shownReviews));

			cluster.fitMapToMarkers();
		});

		$reviewHistory.on("click", ".review-actions .toggle-details", (ev) => {
			var tr = $(ev.target).closest("tr");
			var row = table.row(tr);
			const review = row.data();

			if (row.child.isShown()) {
				// This row is already open - close it
				row.child.hide();
				tr.removeClass("shown");
			} else {
				// Open this row
				row.child(review.buildInfoWindowContent()).show();
				tr.addClass("shown");
			}
		});

		$("#content-container").on("click", ".toggle[data-index]", (ev) => {
			const { target } = ev;
			const { index } = target.dataset;
			const currentReview = reviews[index];
			currentReview.toggleAccepted();
			const rowElem = ev.currentTarget.parentElement.parentElement;
			if (rowElem.classList.contains("success")){
				rowElem.classList.remove("success");
			}else{
				rowElem.classList.add("success");
			}
		});

		$("#content-container").on("click", ".focus-in-map[data-index]", (ev) => {
			const { target } = ev;
			const { index } = target.dataset;
			const currentReview = reviews[index];
			const currentMarker = currentReview.marker;

			mapElement.scrollIntoView({
				behavior: "smooth",
				block: "end",
				inline: "nearest",
			});
			infoWindow.open(map, currentMarker);
			infoWindow.setContent(currentReview.buildInfoWindowContent());
			map.setZoom(12);
			map.panTo({ lat: currentReview.review.lat, lng: currentReview.review.lng });
		});
	};

	showEvaluated();
}
const colorMap = {
	"ACCEPTED": "green",
	"NOMINATED": "blue",
	"WITHDRAWN": "grey",
	"VOTING": "yellow",
	"DUPLICATE": "orange",
	"REJECTED": "red",
};

function getIconUrl(nomination) {
	return `https://maps.google.com/mapfiles/ms/icons/${colorMap[nomination.status] || 'blue'}.png`;
}

function addMap(nominationList, mapElement) {
	const mapSettings = settings["ctrlessZoom"] ? { scrollwheel: true, gestureHandling: 'greedy' } : {};
	const gmap = new google.maps.Map(mapElement, {
		zoom: 8,
		...mapSettings,
	  });

	const bounds = new google.maps.LatLngBounds();
	const markers = nominationList.map((nomination) => {
			const latLng = {
			lat: nomination.lat,
			lng: nomination.lng
		};
		const marker =  new google.maps.Marker({
			map: gmap,
			position: latLng,
			title: nomination.title,
			icon: {
				url: getIconUrl(nomination)
			}
		});

		marker.addListener('click', () => {
			nomCtrl.showNominationDetail(nomination);
			selectNomination();
			const nominationTitle = document.querySelector('.nomination-title');
			if ( nominationTitle ) {
				nominationTitle.scrollIntoView();
			}
		});
		bounds.extend(latLng);
		return marker;
	});
	const markerClusterer = new MarkerClusterer(gmap, markers, {
		imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
		gridSize: 30,
		zoomOnClick: true,
		maxZoom: 10,
	});

	gmap.fitBounds(bounds);
}

function createElements() {
	const container = document.createElement('div');
	container.setAttribute('class', 'wrap-collabsible')

	const collapsibleInput = document.createElement("input");
	collapsibleInput.id = "collapsed-map";
	collapsibleInput.setAttribute("class", "toggle");
	collapsibleInput.type = "checkbox";
	collapsibleInput.checked = true;

	const collapsibleLabel = document.createElement("label");
	collapsibleLabel.setAttribute("class", "lbl-toggle");
	collapsibleLabel.innerText = "View Nomination Map";
	collapsibleLabel.setAttribute("for", "collapsed-map");

	const collapsibleContent = document.createElement("div");
	collapsibleContent.setAttribute("class", "collapsible-content");

	const mapElement = document.createElement("div");
	mapElement.style = "height: 400px;";
	mapElement.setAttribute("class", "map-element");
	mapElement.innerText = "Loading...";

	collapsibleContent.appendChild(mapElement);

	container.appendChild(collapsibleInput);
	container.appendChild(collapsibleLabel);
	container.appendChild(collapsibleContent);

	const sectionElement = document.querySelector("section");
	sectionElement.insertBefore(container, sectionElement.children[0]);

	return mapElement;
}

function loadMap() {
	if (!nomCtrl.loaded){
		setTimeout(loadMap, 100);
		return;
	}

	addMap(nomCtrl.nomList, createElements());
	console.log("[WayFarer+] Nominations map loaded");
}

document.addEventListener("WFPNomCtrlHooked", loadMap);

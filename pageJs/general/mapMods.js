function addMinDistCircle(gMap, lat, lng){
	var latLng = new google.maps.LatLng(lat, lng);
	var c = new google.maps.Circle({
		map: gMap,
		center: latLng,
		radius: 2, //This is prone to change with wayfarer updates!
		strokeColor: 'red',
		fillColor: 'red',
		strokeOpacity: 0.8,
		strokeWeight: 1,
		fillOpacity: 0.5
	});
	return c;
}

function addLowestDistCircle(gMap, lat, lng){
	var latLng = new google.maps.LatLng(lat, lng);
	var c = new google.maps.Circle({
		map: gMap,
		center: latLng,
		radius: 20,
		strokeColor: 'red',
		fillColor: 'red',
		strokeOpacity: 0.8,
		strokeWeight: 1,
		fillOpacity: 0.2
	});
	return c;
}

function addAccessDistCircle(gMap, lat, lng){
	var latLng = new google.maps.LatLng(lat, lng);
	var c = new google.maps.Circle({
		map: gMap,
		center: latLng,
		radius: 40,
		strokeColor: 'green',
		strokeOpacity: 1,
		strokeWeight: 2,
		fillOpacity: 0
	});
	return c;
}

function addS2(map, lvl, colCode, lat, lng){
	var cell = window.S2.S2Cell.FromLatLng({lat: lat, lng: lng}, lvl);

	var cellCorners = cell.getCornerLatLngs();
	cellCorners[4] = cellCorners[0]; //Loop it

	var polyline = new google.maps.Polyline({
		path: cellCorners,
		geodesic: true,
		fillColor: 'grey',
		fillOpacity: 0.2,
		strokeColor: colCode,
		strokeOpacity: 1.0,
		strokeWeight: 1,
		map: map
	});
	return polyline;
}

function mapRemoveCtrlZoom(gMap){
	var options = {
		scrollwheel: true,
		gestureHandling: 'greedy'
	};
	gMap.setOptions(options);
}
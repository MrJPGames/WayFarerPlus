class S2Overlay{
	constructor() {
		this.polyLines = [];
	}


	check_map_bounds_ready(map){
		if (!map || map.getBounds === undefined || map.getBounds() === undefined) {
			return false;
		} else {
			return true;
		}
	};

	until(conditionFunction, map) {
		const poll = resolve => {
			if(conditionFunction(map)) resolve();
			else setTimeout(_ => poll(resolve), 400);
		};

		return new Promise(poll);
	}

	updateGrid(map, gridLevel, col, secondGridLevel = null, secondCol = null) {
		this.polyLines.forEach((line) => {
			line.setMap(null)
		});
		let ret = this.drawCellGrid(map, gridLevel, col);
		if (secondGridLevel !== null){
			this.drawCellGrid(map, secondGridLevel, secondCol, 2);
		}
		return ret;
	}

	async drawCellGrid(map, gridLevel, col, thickness = 1) {
		await this.until(this.check_map_bounds_ready, map);
		const bounds = map.getBounds();

		const seenCells = {};
		const cellsToDraw = [];



		if (gridLevel >= 6 && gridLevel < (map.getZoom() + 2)) {
			const latLng = map.getCenter()
			const cell = S2.S2Cell.FromLatLng(this.getLatLngPoint(latLng), gridLevel);
			cellsToDraw.push(cell);
			seenCells[cell.toString()] = true;

			let curCell;
			while (cellsToDraw.length > 0) {
				curCell = cellsToDraw.pop();
				const neighbors = curCell.getNeighbors();

				for (let n = 0; n < neighbors.length; n++) {
					const nStr = neighbors[n].toString();
					if (!seenCells[nStr]) {
						seenCells[nStr] = true;
						if (this.isCellOnScreen(bounds, neighbors[n])) {
							cellsToDraw.push(neighbors[n]);
						}
					}
				}

				this.drawCell(map, curCell, col, thickness);
			}
		}
	};

	drawCell(map, cell, col, thickness) {
		const cellCorners = cell.getCornerLatLngs();
		cellCorners[4] = cellCorners[0]; //Loop it

		const polyline = new google.maps.Polyline({
			path: cellCorners,
			geodesic: true,
			fillColor: 'grey',
			fillOpacity: 0.0,
			strokeColor: col,
			strokeOpacity: 1,
			strokeWeight: thickness,
			map: map
		});
		this.polyLines.push(polyline);
	};

	 getLatLngPoint(data) {
		const result = {
			lat: typeof data.lat == 'function' ? data.lat() : data.lat,
			lng: typeof data.lng == 'function' ? data.lng() : data.lng
		};

		return result;
	};

	isCellOnScreen(mapBounds, cell) {
		const corners = cell.getCornerLatLngs();
		for (let i = 0; i < corners.length; i++) {
			if (mapBounds.intersects(new google.maps.LatLngBounds(corners[i]))) {
				return true;
			}
		}
		return false;
	};
}

function addS2Overlay(map, gridLevel, smallCol, secondGridLevel, bigCol){
	let overlay = new S2Overlay();

	//To make sure bigger cells are always drawn on top of smaller cells regardless of user config order
	//If they are equal draw order doesn't matter
	let smallGridLevel, bigGridLevel;
	if (gridLevel > secondGridLevel){ //eg. L14 cells are bigger than L15 cells
		smallGridLevel = gridLevel;
		bigGridLevel = secondGridLevel;
	}else{
		smallGridLevel = secondGridLevel;
		bigGridLevel = gridLevel;
	}

	overlay.drawCellGrid(map, smallGridLevel, smallCol);
	overlay.drawCellGrid(map, bigGridLevel, bigCol, 2);

	map.addListener('bounds_changed', () => {
		overlay.updateGrid(map, smallGridLevel, smallCol, bigGridLevel, bigCol);
	});
}
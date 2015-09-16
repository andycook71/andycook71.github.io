(function( $ ){
	$.fn.rotate = function(deg) {
	    this.css({'transform': 'rotate('+deg+'deg)'});
	    return this; 
	};
})( jQuery );

function Tile() {
	this.pattern = "ripple";
	this.rotation = 0;
}

var patterns = ["ripple", "curved", "straight", "lotus"];
var $verandah = $("#verandah");
var $path = $("#path");
var $courtyard = $("#courtyard");

var tileWidthMm = 200;
var tileWidth = $verandah.outerWidth() / parseFloat($verandah.data("cols"));

var data = loadData();

if (data.outlines) $("#toggleOutlines").attr("checked", "checked");

if (!data.verandah) data.verandah = initLocation($verandah);
if (!data.path) data.path = initLocation($path);
if (!data.courtyard) data.courtyard = initLocation($courtyard);

function initLocation(location) {
	var locationData = {
		tiles: new Array(),
		rows: parseFloat(location.data("rows")),
		cols: parseFloat(location.data("cols"))
	};

	for (var i=0; i<locationData.cols; i ++) {
		locationData.tiles.push(new Array());
		for (var j=0; j<locationData.rows; j++) {
			locationData.tiles[i].push(new Tile());
		}
	}
	return locationData;
}

function shiftHandler(event) {
    if (event.shiftKey) $("html").addClass("shift");
    else $("html").removeClass("shift");
};

window.addEventListener("keydown", shiftHandler, false);
window.addEventListener("keypress", shiftHandler, false);
window.addEventListener("keyup", shiftHandler, false);

drawTiles($verandah, data.outlines, data.verandah);
drawTiles($path, data.outlines, data.path);
drawTiles($courtyard, data.outlines, data.courtyard);

function drawTiles(location, outlines, data) {
	var locationWidth = location.width();
	for (var i=0; i<data.tiles.length; i++) {
		for (var j=0; j<data.tiles[i].length; j++) {
			var div = $("<div>").attr("class", "tile");
			div.addClass(data.tiles[i][j].pattern);
			if (data.tiles[i][j].rotation) $(div).rotate(data.tiles[i][j].rotation);
			if (outlines) div.addClass("outline");
			div.data = data.tiles[i][j];
			location.append(div);
			div.css("width", Math.min(tileWidth, locationWidth - (i * tileWidth)) + "px");
			div.css("height", tileWidth + "px");
			div.css("left", i * tileWidth);
			div.css("top", j * tileWidth);
			div.on("click", div, clickTile);
		}
	}
	location.width(data.cols * tileWidth);
	location.height(data.rows * tileWidth);
	$("h2." + location[0].id).text(location[0].id + " (" + data.tiles.length * tileWidthMm + "x" + data.tiles[0].length * tileWidthMm + "mm)");
}

function clickTile(e) {
	var tile = e.data.data;
	var div = $(e.data);
	if (e.shiftKey) {
		tile.rotation = (tile.rotation + 90) % 360;
		$(e.currentTarget).rotate(tile.rotation);
	}
	else {
		div.removeClass(tile.pattern);
		tile.pattern = patterns[(patterns.indexOf(tile.pattern) + 1) % patterns.length];
		div.addClass(tile.pattern);
	}
	saveData();
}

function loadData() {
	var q = document.location.search.replace(/^\?/, "");
	if (q) {
		var decoded = LZString.decompressFromEncodedURIComponent(q);
		return rehydrateData(JSON.parse(decoded));
	}
	else return {};
}

function saveData() {
	var serialized = JSON.stringify(dehydrateData(data));
	$("#data").val(serialized);

	var encodedData = LZString.compressToEncodedURIComponent(serialized);
//	history.replaceState({ data: encodedData }, document.title, document.location.href);

    var url = window.location.protocol
        + "//"
        + window.location.host
        + window.location.pathname
        + "?" + encodedData;
//	$("#url").attr("href", url).text(url + " (" + jsonData.length + " -> " + encodedData.length + " chars)");
	$("#url").attr("href", url).text("Link to this").attr("title", "(json: " + JSON.stringify(data).length +", compressed JSON: " + LZString.compressToEncodedURIComponent(JSON.stringify(data)).length + " -> dehydrated: " + serialized.length + ", compressed dyhydrated: "+encodedData.length+")");
    history.replaceState({ data: encodedData }, jQuery(document).find('title').text(), url);
}

function dehydrateData(data) {

	var result = $.extend(true, {}, data);

	result.verandah.tiles = dehydrateTiles(data.verandah.tiles);
	result.path.tiles = dehydrateTiles(data.path.tiles);
	result.courtyard.tiles = dehydrateTiles(data.courtyard.tiles);

	return result;
}

function dehydrateTiles(tiles) {
	var result = new Array();
	for (var i=0; i<tiles.length; i++) {
		for (var j=0; j<tiles[i].length; j++) {
			result.push(tiles[i][j].pattern.charAt(0) + (tiles[i][j].rotation ? tiles[i][j].rotation : ""));
		}
	}
	return result.join("");
}

function rehydrateData(data) {
	var result = $.extend(true, {}, data);

	result.verandah.tiles = rehydrateTiles(data.verandah);
	result.path.tiles = rehydrateTiles(data.path);
	result.courtyard.tiles = rehydrateTiles(data.courtyard);

	return result;
}

function rehydrateTiles(location) {
	var tileStr = location.tiles;
	var cols = new Array();
	var row;
	$(tileStr.split(/\w\d*/g)).each(function(index, value) {
		if (index % Math.ceil(location.rows) == 0) {
			row = new Array();
			cols.push(row);
		}
		var tile = new Tile();
		var pattern = value.charAt(0);
		if (pattern == "c") tile.pattern = "curved";
		else if (pattern == "s") tile.pattern = "straight";
		else if (pattern == "l") tile.pattern = "lotus";

		tile.rotation = parseInt(value.match(/\d*$/)) || 0;
		row.push(tile);
	});
	return cols;
}

saveData();

$("#toggleOutlines").change(function() {
    if (this.checked) {
    	$(".tile").addClass("outline");
    	data.outlines = true;
    }
    else {
    	$(".tile").removeClass("outline");
    	data.outlines = false;
    }
    saveData();
});




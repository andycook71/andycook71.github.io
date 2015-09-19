(function( $ ){
	$.fn.rotate = function(deg) {
	    this.css({'transform': 'rotate('+deg+'deg)', "transition": "transform 0.25s ease-in-out"});
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
var tileWidth = ($("#verandah").innerWidth()) / parseFloat($verandah.data("cols"));

var data = loadData();

init();

window.addEventListener("keydown", shiftHandler, false);
window.addEventListener("keypress", shiftHandler, false);
window.addEventListener("keyup", shiftHandler, false);

function init() {
	if (!data.verandah) data.verandah = initLocation($verandah);
	if (!data.path) data.path = initLocation($path);
	if (!data.courtyard) data.courtyard = initLocation($courtyard);
	drawTiles($verandah, data.outlines, data.verandah);
	drawTiles($path, data.outlines, data.path);
	drawTiles($courtyard, data.outlines, data.courtyard);	

	saveData();
}

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

function randomizeTiles() {
	var allTiles = new Array();
	for (var i=0; i<166; i++) allTiles.push(new Tile());
	for (var i=0; i<23; i++) {
		var tile = new Tile();
		tile.pattern = "curved";
		allTiles.push(tile);

		tile = new Tile();
		tile.pattern = "straight";
		allTiles.push(tile);

		tile = new Tile();
		tile.pattern = "lotus";
		allTiles.push(tile);
	}

	shuffle(allTiles);

	randomizeLocation(data.verandah.tiles, allTiles);
	randomizeLocation(data.path.tiles, allTiles);
	randomizeLocation(data.courtyard.tiles, allTiles);

	init();
}

function randomizeLocation(location, allTiles) {
	for (var i=0; i<location.length; i++) {
		for (var j=0; j<location[i].length; j++) {
			var tile = allTiles.pop();
			location[i][j].pattern = tile.pattern;
			location[i][j].rotation = Math.round(Math.random() * 3) * 90;
		}
	}
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function shiftHandler(event) {
    if (event.shiftKey) $("html").addClass("shift");
    else $("html").removeClass("shift");
};


function drawTiles(location, outlines, data) {
	location.empty();
	var locationWidth = location.width();
	for (var i=0; i<data.tiles.length; i++) {
		for (var j=0; j<data.tiles[i].length; j++) {
			var div = $("<div>").attr("class", "tile");
			div.addClass(data.tiles[i][j].pattern);
			if (data.tiles[i][j].rotation) $(div).rotate(data.tiles[i][j].rotation);
			if (outlines) div.addClass("outline");
			div.data = data.tiles[i][j];
			location.append(div);
			div.attr("title", "(" + i + "," + j + ")");
//			div.css("width", Math.min(tileWidth, locationWidth - (i * tileWidth)) + "px");
			div.css("width", tileWidth + "px");
			div.css("height", tileWidth + "px");
			div.css("left", i * tileWidth);
			div.css("top", j * tileWidth);
			div.on("click", div, clickTile);
		}
	}
	location.width(data.cols * tileWidth);
	location.height(data.rows * tileWidth);
	$("h2." + location[0].id).html(location[0].id + " <span>(" + data.cols + "x" + data.rows + " tiles, " + data.tiles.length * tileWidthMm + "x" + data.tiles[0].length * tileWidthMm + "mm)</span>");
	updateCount();
}

function updateCount() {
	var rippleCount = 0, straightCount = 0, curvedCount = 0, lotusCount = 0;
	var allTiles = data.verandah.tiles.concat(data.path.tiles, data.courtyard.tiles);
		for (var i=0; i<allTiles.length; i++)
		{
			for (var j=0; j<allTiles[i].length; j++) {
				switch (allTiles[i][j].pattern) {
					case "ripple": rippleCount++; break;
					case "straight": straightCount++; break;
					case "curved": curvedCount++; break;
					case "lotus": lotusCount++; break;
				}
			}
	}

	$("ul li span.ripple").text(rippleCount);
	$("ul li span.straight").text(straightCount);
	$("ul li span.curved").text(curvedCount);
	$("ul li span.lotus").text(lotusCount);
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
	updateCount();
	saveData();
}

function loadData() {
	var q = document.location.search.replace(/^\?/, "");
	if (!q) q = Cookies.get("koi-data");
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
	$("#url").attr("href", url).attr("title", "(json: " + JSON.stringify(data).length +", compressed JSON: " + LZString.compressToEncodedURIComponent(JSON.stringify(data)).length + " -> dehydrated: " + serialized.length + ", compressed dyhydrated: "+encodedData.length+")");
    history.replaceState({ data: encodedData }, jQuery(document).find('title').text(), url);
    Cookies.set('koi-data', encodedData, { expires: 365 });
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
	$(tileStr.match(/\w\d*/g)).each(function(index, value) {
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

$("a.reset").click(function() {
	data.verandah = null;
	data.path = null;
	data.courtyard = null;
	init();
});

$("a.randomize").click(randomizeTiles);

$(".toggleOutlines").click(function() {
    if (!data.outlines) {
    	$(".tile").addClass("outline");
    	data.outlines = true;
    }
    else {
    	$(".tile").removeClass("outline");
    	data.outlines = false;
    }
    saveData();
});




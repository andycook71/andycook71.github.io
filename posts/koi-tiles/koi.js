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
		return JSON.parse(decoded);
	}
	else return {};
}

function saveData() {
	$("#data").val(JSON.stringify(data));

	var jsonData = JSON.stringify(data);
	var encodedData = LZString.compressToEncodedURIComponent(jsonData);
//	history.replaceState({ data: encodedData }, document.title, document.location.href);

    var url = window.location.protocol
        + "//"
        + window.location.host
        + window.location.pathname
        + "?" + encodedData;
//	$("#url").attr("href", url).text(url + " (" + jsonData.length + " -> " + encodedData.length + " chars)");
	$("#url").attr("href", url).text("Link to this");
    history.pushState({ data: encodedData }, jQuery(document).find('title').text(), url);
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




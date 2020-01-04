function hide(elementName) {
    document.getElementById(elementName).style.display = "none";
}

function show(elementName) {
    document.getElementById(elementName).style.display = "";
}


var ScreenType = {
    "main": 1,
    "playing": 2
}
var g_screen = ScreenType.main;


function initControls() {
    g_screen = ScreenType.main;
    //
    hideControls();
    show("menuControls");
    g_marker.setMap(g_map);
}

function hideControls() {
    hide("menuControls");
    hide("inGameControls");
    hide("inGameTime");
}


var g_timeCounterInterval;
var g_playedTime;

function startGame(difficulty) {
    g_screen = ScreenType.playing;
    initializePoints(difficulty);

    g_startTime = Math.floor(new Date().getTime() / 1000);
    g_timeCounterInterval = setInterval(function() {
        var now = Math.floor(new Date().getTime() / 1000);
        g_playedTime = now - g_startTime;
        var formattedTime = formatDuration(g_playedTime);
        document.getElementById("inGameTime").innerHTML = formattedTime;
    }, 1000);
}

function formatDuration(seconds) {
    var hours = Math.floor(seconds / 3600) + "";
    var minutes = Math.floor((seconds - hours * 3600) / 60) + "";
    var seconds = (seconds - hours * 3600 - minutes * 60) + "";

    hours = hours.padStart(2, "0");
    minutes = minutes.padStart(2, "0");
    seconds = seconds.padStart(2, "0");
    var hoursPrefix = "";
    if (hours != "00") {
        hoursPrefix = hours + ":";
    }

    return hoursPrefix + minutes + ":" + seconds;
}

var g_mapHandlerType = "all";

function handleMap() {
    try {
        switch (g_mapHandlerType) {
            case "all":
                var bounds = getBounds(g_targets.concat([g_marker]));
                g_map.fitBounds(bounds);
                break;
            case "follow":
                var bounds = getBounds(g_targets.concat([g_marker]));
                g_map.setCenter(g_marker.getPosition());
                g_map.setZoom(16);
                break;
            case "user":
                // nothing
                break;
        }
    } catch (err) {}
}

function toggleMapHandler() {
    switch (g_mapHandlerType) {
        case "all":
            g_mapHandlerType = "follow";
            break;
        case "follow":
            g_mapHandlerType = "all";
            break;
        case "user":
            g_mapHandlerType = "all";
            break;
    }
    handleMap();
}

function getBounds(markers) {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        bounds.extend(markers[i].getPosition());
    }
    return bounds;
}
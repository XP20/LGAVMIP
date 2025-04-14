function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function setGamemode(num) { //Is there a good reson for this to be in coordinateFinder?????????
    gamemode=num;
    initialize();
}

async function getCoordsFromBackend() {
    const locRes = await fetch('/api/location/' + gamemode + '?seed='+ nejausaSekla + '&roundCount=' + panoCounter, {method: "GET"});
    if (locRes.ok) {
        const buffer = await locRes.arrayBuffer();
        const view = new Float64Array(buffer);
        const latLongLiteral = {
            lat: view[0],
            lng: view[1]
        };
        console.log(latLongLiteral);
        return latLongLiteral;
    } 
}

async function getCoords() {
    return getCoordsFromBackend();  
}

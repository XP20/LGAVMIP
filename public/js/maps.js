let panorama;
let sv;
let playerMarker;
let randomMarker = null;
let panoLocation; //Warning: This is NOT a latLng, this is a google maps location object, which has panoLocation.latLng
let selctedPosition;
let distanceBetweenMarkers
let score = 0;
let roundFinalScore;
let roundCounter = 0;
let pano; //panorama data object
let resultMap;
let selectionMap;
let debugMapEnabled = false;
let debugMap;
let gettingPano = false;
let redpill = false; //flag to enable unfinished features that break gameplay experience, Windows 8 Beta style
let panoSearchradios = 50;
let panoCounter = 1; //how many times there has been a request for pano from the backend
let nejausaSekla = getRndInteger(1, 2147483647);

let PinElementRef = null;
let AdvancedMarkerElementRef = null;

async function initialize() {
  let urlParams = new URLSearchParams(window.location.search);
  if ((urlParams.get('mode')=='redpill' || window.location.href.includes('localhost')) && !(urlParams.get('mode')=='prod') && !redpill) initUnfinishedOrDebugFeatures(); //check if running in dev or prod environment
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
  PinElementRef = PinElement;
  AdvancedMarkerElementRef = AdvancedMarkerElement;
  selectionMap = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 56.951941,  lng: 24.081368 }, //have the map always centered at the true origin of the world, independent of street view position
    zoom: 7,
    disableDefaultUI: true,
    clickableIcons: false,
    mapId: "map",
  });
  google.maps.event.addListener(selectionMap, "click", (event) => {
    console.log(event);
    if (playerMarker != null){
      playerMarker.setMap(null);
    }
    selctedPosition = event.latLng
    playerMarker = new google.maps.Marker({
      position: event.latLng,
      label: 'A',
      map: selectionMap,
    });
  });
  resultMap = new google.maps.Map(document.getElementById("results-map"), {
    center: { lat: 56.951941,  lng: 24.081368 }, 
    zoom: 7,
    disableDefaultUI: true,
    clickableIcons: false,
    mapId: "resultMap"
  });
  sv = new google.maps.StreetViewService();
  panorama = new google.maps.StreetViewPanorama(
    document.getElementById("pano"),
    {
      addressControl: false,
      enableCloseButton: false,
      fullscreenControl: false,
      zoomControl: false,
      showRoadLabels: false
    },
  );
  if (!redpill) initGame();
}

async function initGame() {
  score = 0;
  roundCounter = 0;
  panoCounter = 1;
  nejausaSekla = getRndInteger(1, 2147483647);
  setElementHidden('ajaxScreen');
  pano = await getPanoData(); //get initial location
  doPanorama();
}

async function ajaxEndscreenTest(params) { //somehow this function seems to work if called from within JS but not if triggered on click of a button, then the endscreen.js errors out
  setElementHidden('results-screen');
  setElementHidden('GoToEndButton');
  setElementVisible('nextButton');
  await addScript('/public/js/endscreen.js');
  testVar = await loadHTML('/public/endscreen2.html');
  document.getElementById('ajaxScreen').innerHTML = testVar;
  setElementVisible('ajaxScreen');
  onloadCopy();
  document.getElementById('finalResult').innerText = "Rezultāts: " + roundFinalScore;
}

function selectGamemode(id) {
  gamemode = id;
  initGame();
}

async function initUnfinishedOrDebugFeatures(params) {
  redpill = true;
  document.getElementById('ajaxScreen').innerHTML = await loadHTML('/gamemodes'); //gamemode selector screen, this is jank
  setElementVisible('debugMapEnablerButton');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendValidLocationToBackend(latLng) { //generating locations is slow, crazy idea for singleplayer mode to enslave clients to generate valid locations and phone them home

}

async function doPanorama() {
  if (gettingPano) {
    await sleep(100);
    doPanorama();
    return;
  } //wait if last pano get job isn't complete, retry every 100ms
  panoLocation = pano.data.location; //true initial location of pano
  sendValidLocationToBackend(panoLocation.latLng);
  processSVLocation(panoLocation);
  selectionMap.setCenter({ lat: 56.951941,  lng: 24.081368 });
  selectionMap.setZoom(7);
  if (debugMapEnabled){
    debugMap.setCenter(panoLocation.latLng);
  };
  panorama.setZoom(0);
  if (playerMarker != null) playerMarker.setMap(null);
  setElementHidden('results-screen');
  pano = await getPanoData(); //get next panorama data
}

async function computeScore(){
  const distance = google.maps.geometry.spherical.computeDistanceBetween(playerMarker.position, panoLocation.latLng);
  const res = await fetch('/api/score', {
    method: "POST",
    body: JSON.stringify({distance: distance, gamemode: gamemode})
  });
  if (res.ok) {
    const data = await res.json();

    console.log('backend response: ', data);
    score = data.score;
  }
  const writtenDistance = (distance / (distance > 5000 ? 1000 : 1)).toFixed(2);
  document.getElementById('result-text').innerText = `Jūs bijāt ${writtenDistance}${distance > 5000 ? "km" : 'm'} attālumā no mērķa un ieguvāt ${score} punktu`
  return score; //handle special cases
}

async function Submit() {
  score += await computeScore();
  if (roundCounter < 4) {
    document.getElementById('score').innerHTML = `Punktu Skaits: ${score}`;
    roundCounter+=1;
  } else {
    roundFinalScore = score;
    document.getElementById('score').innerHTML = `Punktu Skaits`;
    document.getElementById('result-text').innerText += '\n\rBeidzamais punktu skaits: ' + score;
    roundCounter=0; //After 5 rounds, reset
    score=0;
    if (redpill) {
      setElementVisible('GoToEndButton')
      setElementHidden('nextButton')
    }
  }
  setElementVisible('results-screen');
  resultMap.setCenter({ lat: 56.951941,  lng: 24.081368 });
  resultMap.setZoom(7);
   if (playerMarker != null)
    playerMarker.setMap(null);

   if (randomMarker != null)
    randomMarker.setMap(null)

   if (distanceBetweenMarkers != null)
    distanceBetweenMarkers.setMap(null)

   const pinPlayer = new PinElementRef({
    borderColor: "#d92eff",
    background: "#e77cf7",
    glyphColor: "white"
  })

  const pinRandomSet = new PinElementRef ({
    borderColor: "#cc260c",
    background: "#ede324",
    glyphColor: "white",
  })

  const lineSymbol ={
    path: 'M 0,-1 0,1',
    strokeOpacity: 1,
    scale: 3
  };

   playerMarker = new AdvancedMarkerElementRef({
     position: selctedPosition,
     content: pinPlayer.element,
     map: resultMap,
  });

  randomMarker = new AdvancedMarkerElementRef({
    position: panoLocation.latLng,
    content: pinRandomSet.element,
    map: resultMap,
  });

  let coordinates = [
    panoLocation.latLng,
    selctedPosition
  ];

  distanceBetweenMarkers = new google.maps.Polyline({
    path: coordinates,
    strokeOpacity: 0,
    icons: [{
      icon: lineSymbol,
      offset: '0',
      repeat: '20px'
    }],
    map: resultMap
  });
  distanceBetweenMarkers.setMap(resultMap);
}


function toggleDebugMap() {
  initDbg();
  toggleElementVisibility('debugMap');
  toggleElementVisibility('debugButton');
}

async function initDbg() {
  if (!debugMapEnabled) {
    debugMap = new google.maps.Map(document.getElementById("debugMap"), { //debug map element that shows the true location of the found panorama
      center: panoLocation.latLng,
      zoom: 11,
      mapId: "debugMap",
      streetViewControl: false,
      fullscreenControl: false,
    });
    debugMapEnabled = true;
  }
  for (let index = 0; index < riga.length; index++) {
    const pos = riga[index];
    testMarker = new google.maps.Marker({
      position: pos,
      map: debugMap,
      title: "Hello World!",
    });
    await sleep(2);
  }
}

async function getPanoData() {
  gettingPano = true;
  const pos = await getCoords();
  panoCounter++;
  let result;
  result = await sv.getPanorama({location: pos, radius: 1000, source: "google"}).catch((e) =>
    getPanoData(), //hacky solution, if pano isn't found, recursively generate new location
  );
  gettingPano = false;
  return result;
}

function processSVLocation(location) {
  panorama.setPano(location.pano);
  panorama.setVisible(true);
}

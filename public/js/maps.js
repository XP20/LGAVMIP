let panorama;
let sv;
let playerMarker;
let randomMarker = null;
let panoLocation; //Warning: This is NOT a latLng, this is a google maps location object, which has panoLocation.latLng
let selctedPosition;
let distanceBetweenMarkers
let score = 0;
let roundCounter = 0;
let pano; //panorama data object
let resultMap;
let selectionMap;
let debugMapEnabled = false;
let debugMap;
let gettingPano = false;
let sessionID = 0;
let opponentID = 0;
let redpill = false; //flag to enable unfinished features that break gameplay experience, Windows 8 Beta style

let PinElementRef = null;
let AdvancedMarkerElementRef = null;

async function initialize() {
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
  await initPano();
  doPanorama();
  let urlParams = new URLSearchParams(window.location.search);
  sessionID = urlParams.get('id');
  opponentID = urlParams.get('opponent');
  if ((urlParams.get('mode')=='redpill' || window.location.href.includes('localhost')) && !(urlParams.get('mode')=='prod')) initUnfinishedOrDebugFeatures(); //check if running in dev or prod environment
}

function initUnfinishedOrDebugFeatures(params) {
  redpill = true;
  beginTimer();
  beginMultiplayerKeepalive();
  document.getElementById('debugMapEnablerButton').classList.remove('hidden');
}

async function beginMultiplayerKeepalive(){
  setInterval(async () => {
    const res = await fetch('/api/MP', {
      method: "POST",
      body: JSON.stringify({id:sessionID, score:score})
    });
    if (res.ok) {
      const data = await res.json();
      
      console.log(data);
    }
    const res2 = await fetch('/api/MP/'+opponentID, {
      method: "GET"
    });
    if (res2.ok) {
      const data2 = await res2.json();
      
      console.log(data2);
    }

  }, 2000);
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function beginTimer() {
  let secondsRemaining = 120;
  while (true) {;
    document.getElementById('timer').innerText = "Sekundes atlikušas: " + secondsRemaining;
    secondsRemaining -=1
    if (secondsRemaining == 0) break;
    await sleep(1000);
  }
}

async function doPanorama() {
  if (gettingPano) {
    await sleep(100);
    doPanorama();
    return;
  } //wait if last pano get job isn't complete, retry every 100ms
  panoLocation = pano.data.location; //true initial location of pano
  processSVLocation(panoLocation);
  selectionMap.setCenter({ lat: 56.951941,  lng: 24.081368 });
  selectionMap.setZoom(7);
  if (debugMapEnabled) debugMap.setCenter(panoLocation.latLng);
  panorama.setZoom(0);
  document.getElementById('results-screen').classList.add('hidden');
  if (playerMarker != null) playerMarker.setMap(null);
  document.getElementById('GoToEndButton').classList.add('hidden');
  pano = await getPanoData(); //get next panorama data
}
window.initMap = initialize;

async function computeScore(){
  const distance = google.maps.geometry.spherical.computeDistanceBetween(playerMarker.position, panoLocation.latLng);
  const res = await fetch('/api/score', {
    method: "POST",
    body: JSON.stringify({distance: distance})
  });
  if (res.ok) {
    const data = await res.json();
    
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
    document.getElementById('score').innerHTML = `Punktu Skaits`;
    document.getElementById('result-text').innerText += '\n\rBeidzamais punktu skaits: ' + score;
    roundCounter=0; //After 5 rounds, reset
    score=0;
    if (redpill) {
      document.getElementById('GoToEndButton').classList.remove('hidden');
      document.getElementById('nextButton').classList.add('hidden');
    }
  }
  document.getElementById('results-screen').classList.remove('hidden');
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
  document.getElementById('debugMap').classList.contains('hidden') ? document.getElementById('debugMap').classList.remove('hidden') : document.getElementById('debugMap').classList.add('hidden');
  document.getElementById('debugButton').classList.contains('hidden') ? document.getElementById('debugButton').classList.remove('hidden') : document.getElementById('debugButton').classList.add('hidden');
}

function initDbg() {
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
}

async function initPano() {
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
  pano = await getPanoData(true); //get inital panorama
}

async function getPanoData(firstTime = false) {
  gettingPano = true;
  const pos = getCoords();
  let result;
  if (firstTime) {
    result = await sv.getPanorama({location: pos, radius: 200, source: "outdoor"}).catch((e) => 
      getPanoData(true), //hacky solution, if pano isn't found, recursively generate new location
    );
  } else {
    result = await sv.getPanorama({location: pos, radius: 50, source: "outdoor"}).catch((e) => 
      getPanoData(), //hacky solution, if pano isn't found, recursively generate new location
    );
  }
  gettingPano = false;
  return result;
}

function processSVLocation(location) {
  panorama.setPano(location.pano);
  panorama.setVisible(true);
}

window.initialize = initialize;

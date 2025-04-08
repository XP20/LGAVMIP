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
let sessionID;
let opponentID;
let redpill = false; //flag to enable unfinished features that break gameplay experience, Windows 8 Beta style
let panoCounter = 1; //how many times there has been a request for pano from the backend
let nejausaSekla = getRndInteger(1, 2147483647);
let gamemode;
let gameStarted = false;
const parser = new DOMParser();

let PinElementRef = null;
let AdvancedMarkerElementRef = null;

async function initialize() {
  let urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('mode')=='redpill' && !redpill) initUnfinishedOrDebugFeatures();
  document.getElementById('ajaxScreen').innerHTML = await loadHTML('/gamemodes'); //gamemode selector screen, this is jank
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
  sv = new google.maps.StreetViewService();
  panorama = new google.maps.StreetViewPanorama(
    document.getElementById("pano"),
    {
      addressControl: false,
      enableCloseButton: false,
      fullscreenControl: false,
      zoomControl: false,
      showRoadLabels: false,
      motionTracking: false, 
      //set below params to false for no move
      clickToGo: true,
      linksControl: true, 
      //and invert these too for no zooming, idk how geoguessr disables panning tho, easiest might just be to make a transparent html element above the panorama, also none of this can be changed on the fly without a hard/full reinitialization of the panorama
      disableDoubleClickZoom: false,
      scrollwheel: true,
      focus: false,
    },
  );
}

async function goNMPZ() {
  setElementHidden('returnButton');
  setElementVisible('NMPZ');
}

async function initGame() {
  setScore(0);
  roundCounter = 0;
  panoCounter = 1;
  nejausaSekla = getRndInteger(1, 2147483647);
  if (!gameStarted) pano = await getPanoData(); //get initial location
  doPanorama();
  document.getElementById('nextButton').innerText = "Nākošais";
  setElementHidden('GoToEndButton');
  setElementVisible('nextButton');
}


//TODO implement this everywhere the score is changed
async function setScore(scoreIn){
  score = scoreIn;
  document.getElementById('score').innerHTML = `Punktu Skaits: ${score}`;
}

async function ajaxEndscreenTest() { 
  setElementHidden('results-screen');
  await addScript('/public/js/endscreen.js');
  endscreen = await loadHTML('/result');
  endscreenInner = parser.parseFromString(endscreen, "text/html").getElementById('main').innerHTML;
  document.getElementById('ajaxScreen').innerHTML = endscreenInner;
  setElementVisible('ajaxScreen');
  onloadCopy();
  document.getElementById('finalResult').innerText = "Rezultāts: " + roundFinalScore;
}

function gamemodePress() {
  gameStarted = true;
  setElementHidden('ajaxScreen');
}

function selectGamemode(id) {
  if (gamemode!=id) {
    gamemode = id;
    initGame();
  }
}

async function initUnfinishedOrDebugFeatures(params) {
  redpill = true;
  document.getElementById('multiplayerEnableButton').classList.remove('hidden');
  document.getElementById('debugMapEnablerButton').classList.remove('hidden');
  setElementVisible('debugMapEnablerButton');
  //setElementVisible('NMPZButton');
}

async function getIDFromBackend() {
  const idRes = await fetch('/api/MP/assignid/', {method: "GET"});
  if (idRes.ok) {
    idJson = await idRes.json();
    console.log(idJson);
    sessionID = idJson.assignedID;
  } 
}

async function beginMultiplayer(makeNewSession=false){
  let opponentData;
  document.getElementById('multiplayerEnableButton').classList.add('hidden');
  document.getElementById('opponentScore').classList.remove('hidden');
  document.getElementById('sessionID').classList.remove('hidden');
  document.getElementById('opponentInput').classList.remove('hidden');
  opponentID = document.getElementById('opponentInput').value;
  if (makeNewSession){
    document.getElementById('multiplayerNewGame').classList.add('hidden');
    await getIDFromBackend();
  }
  if (opponentID=='' && !makeNewSession) {
    document.getElementById('sessionID').innerText = 'Lūdzu, ievadiet pretinieka spēlētāja kodu un spiediet "Savienoties", vai izveidojiet jaunu spēles sesiju"';
    document.getElementById('multiplayerConnect').classList.remove('hidden');
    document.getElementById('multiplayerNewGame').classList.remove('hidden');
    if (opponentID!='') beginMultiplayer();
    return;
  }
  if (sessionID==undefined) await getIDFromBackend();
  document.getElementById('multiplayerNewGame').classList.add('hidden');
  document.getElementById('sessionID').innerText = "Spēlētāja kods: "+sessionID;
  if (opponentID!='') await setInterval(async () => {
    const res = await fetch('/api/MP', {
      method: "POST",
      body: JSON.stringify({id:sessionID, score:score})
    });
    if (res.ok) {
      const data = await res.json();
      console.log(data);
    }
    const opponentRes = await fetch('/api/MP/'+opponentID, {
      method: "GET"
    });
    if (opponentRes.ok) {
      opponentData = await opponentRes.json();
      console.log(opponentData);
      if (opponentData.score!=undefined) document.getElementById('opponentScore').innerText = 'Pretinieka punktu skaits: '+opponentData.score;
      else document.getElementById('opponentScore').innerText = "Nav savienojuma ar pretinieku..."
    }
  }, 125);
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function nextButton() {
  if (roundCounter==5) {
    initGame();
  } else doPanorama();
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
  if (debugMapEnabled){
    debugMap.setCenter(panoLocation.latLng);
  };
  panorama.setZoom(0);
  if (playerMarker != null) playerMarker.setMap(null);
  setElementHidden('results-screen');
  document.getElementById('result-text').innerText = ' Jūs bijāt Lādē... attālumā no mērķa un ieguvāt Lādē... punku'
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
    score = data.score;
  }
  const writtenDistance = (distance / (distance > 5000 ? 1000 : 1)).toFixed(2);
  document.getElementById('result-text').innerText = `Jūs bijāt ${writtenDistance}${distance > 5000 ? "km" : 'm'} attālumā no mērķa un ieguvāt ${score} punktu`
  return score; 
}

async function Submit(opponentFinishCondition = false) {
  setElementVisible('results-screen');
  score += await computeScore();
  if (roundCounter < 4 && !opponentFinishCondition) {
    document.getElementById('score').innerHTML = `Punktu Skaits: ${score}`;
  } else {
    roundFinalScore = score;
    document.getElementById('score').innerHTML = `Punktu Skaits: 0`;
    document.getElementById('result-text').innerText += '\n\rBeidzamais punktu skaits: ' + score;
    setElementVisible('GoToEndButton');
    document.getElementById('nextButton').innerText = "Mēģināt vēlreiz";
  }
  roundCounter+=1;
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
}

async function getPanoData() {
  gettingPano = true;
  const pos = await getCoords();
  panoCounter++;
  let result;
  result = await sv.getPanorama({location: pos, radius: 500, source: "google", preference: "nearest"}).catch((e) =>
    getPanoData(), //hacky solution, if pano isn't found, recursively generate new location
  );
  gettingPano = false;
  return result;
}

function processSVLocation(location) {
  panorama.setPano(location.pano);
  panorama.setPov({heading: getRndInteger(0, 359), pitch: 0});
  panorama.setVisible(true);
}

//escape screen code, might move to a seperate JS file

document.onkeydown = function(event) { 
  if (event.key === 'Escape' || event.key === 'Esc') {
    toggleElementVisibility('escapeScreen')
  }
};

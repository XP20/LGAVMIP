let panorama;
let sv;
let marker = null;
let panoLocation;
let score = 0;
let roundCounter = 0;
let pano; //panorama data object

async function initialize() {
  let map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 56.951941,  lng: 24.081368 }, //have the map always centered at the true origin of the world, independent of street view position
    zoom: 7,
    disableDefaultUI: true,
    clickableIcons: false
  });
  google.maps.event.addListener(map, "click", (event) => {
    console.log(event);
    if (marker != null)
      marker.setMap(null);
    marker = new google.maps.Marker({
      position: event.latLng,
      label: 'A',
      map: map,
    });
  });
  const resultMap = new google.maps.Map(document.getElementById("results-map"), {
    center: { lat: 56.951941,  lng: 24.081368 }, 
    zoom: 7,
    disableDefaultUI: true,
    clickableIcons: false
  });
  initPano();
  doPanorama();
}

async function doPanorama() {
  pano = await getPanoData(); //get panorama data
  processSVData(pano);
  panoLocation = pano.data.location.latLng; //true initial location of pano
  const debugMap = new google.maps.Map(document.getElementById("debugMap"), { //debug map element that shows the true location of the found panorama
    center: panoLocation, 
    zoom: 11,
    mapId: "debugMap",
    streetViewControl: false,
    fullscreenControl: false,
  });
  marker.setMap(null);
  document.getElementById('results-screen').classList.add('hidden');
}
window.initMap = initialize;

function computeScore(){
  const maxScore = 1000; //score value at 0 meters/100% accurate guess
  const punishmentFactor = 12; //controls how quickly the score drops off with inaccuracy, the closer to 0, the more punishing
  const distance = google.maps.geometry.spherical.computeDistanceBetween(marker.position, panoLocation);
  tempScore = maxScore/((distance/(maxScore*punishmentFactor))+1); // asymptotically goes down to 0 as distance from real guess tends to infinity, gives too high of a score for shitty guesses so need a secondary factor to take care of far-guess edge cases
  tempScore = tempScore - Math.pow(distance, 5)*Math.pow(10, -2*punishmentFactor); // high-order power that pulls down the score at extreme distances
  if (tempScore<=0) {
    return 0;
  } else return Math.ceil(tempScore);
}

function Submit() {
  score += computeScore();
  if (roundCounter < 4) {
    document.getElementById('score').innerHTML = score.toString();
    roundCounter+=1;
  } else {
    document.getElementById('score').innerHTML = "Final score: " + score.toString();
    roundCounter=0; //After 5 rounds, reset
    score=0;
  }
  document.getElementById('results-screen').classList.remove('hidden');
}

function toggleDebugMap() {
  document.getElementById('debugMap').classList.contains('hidden') ? document.getElementById('debugMap').classList.remove('hidden') : document.getElementById('debugMap').classList.add('hidden');
  document.getElementById('debugButton').classList.contains('hidden') ? document.getElementById('debugButton').classList.remove('hidden') : document.getElementById('debugButton').classList.add('hidden');
}

function initPano() {
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
}

async function getPanoData() {
  const pos = getCoords();
  const result = await sv.getPanorama({location: pos, radius: 5000, source: "outdoor"}).catch((e) => 
    getPanoData(), //hacky solution, if pano isn't found, recursively generate new location
  );
  return result;
}

function processSVData({ data }) {
  const location = data.location;
  panorama.setPano(location.pano);
  panorama.setVisible(true);
}

window.initialize = initialize;

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getCoords() {
  const latitude = parseFloat(getRndInteger(56500000, 57000000))/1000000;
  const longitude = parseFloat(getRndInteger(23000000, 24000000))/1000000; 
  return {lat: latitude, lng: longitude};
}

async function initialize() {
  const {AdvancedMarkerElement} = await google.maps.importLibrary("marker");
  const pos = getCoords();
  const userGuessPos = { lat: 0,  lng: 0 };
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 56.951941,  lng: 24.081368 }, //have the map always centered at the true origin of the world, independent of street view position
    zoom: 7,
    mapId: "DEMO_MAP_ID",
  });
  const panorama = new google.maps.StreetViewPanorama(
    document.getElementById("pano"),
    {
      position: pos,
      pov: {
        heading: 180,
        pitch: 10,
      },
      addressControl: false,
    },
  );
  const marker = new AdvancedMarkerElement({
    map: map,
    position: userGuessPos,
  });
}

window.initialize = initialize;
window.onload = () => {
  const pano = document.getElementById('pano');
  const pano_inner = pano.firstElementChild;
  for (const child of pano_inner.childNodes) {
    if (!child.classList.contains('exCVRN-size-observer-view'))
      pano_inner.removeChild(child);
  }
}

function toggleMap() {
  document.getElementById('map').classList.contains('hidden') ? document.getElementById('map').classList.remove('hidden') : document.getElementById('map').classList.add('hidden')
}

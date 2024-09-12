async function initialize() {
  const {AdvancedMarkerElement} = await google.maps.importLibrary("marker");
  const pos = { lat: 56.951941,  lng: 24.081368 };
  const userGuessPos = { lat: 0,  lng: 0 };
  const map = new google.maps.Map(document.getElementById("map"), {
    center: pos,
    zoom: 14,
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
    },
  );
  const marker = new AdvancedMarkerElement({
    map: map,
    position: userGuessPos,
  });
}

window.initialize = initialize;
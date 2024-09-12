function initialize() {
  const fenway = { lat: 56.951941,  lng: 24.081368 };
  const map = new google.maps.Map(document.getElementById("map"), {
    center: fenway,
    zoom: 14,
  });
  const panorama = new google.maps.StreetViewPanorama(
    document.getElementById("pano"),
    {
      position: fenway,
      pov: {
        heading: 180,
        pitch: 10,
      },
    },
  );

  map.setStreetView(panorama);
}

window.initialize = initialize;
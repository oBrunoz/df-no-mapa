export function initMap() {
    const dfBounds = L.latLngBounds([-16.099, -48.286], [-15.47, -47.36]);
    const map = L.map("map", {
      zoomControl: false,
      zoom: 10,
      minZoom: 10,
      maxZoom: 18,
      maxBounds: dfBounds,
      maxBoundsViscosity: 1.0
    }).setView([-15.7801, -47.9292], 12);
  
    return map;
  }
  
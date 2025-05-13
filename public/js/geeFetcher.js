import { updateInfoPanel } from './UI.js';

export function fetchGEEData(map) {
  fetch("http://localhost:8080/api/landsat")
    .then(response => response.json())
    .then(data => {
      const tileUrl = `https://earthengine.googleapis.com/map/${data.mapid}/{z}/{x}/{y}`;
      L.tileLayer(tileUrl, {
        attribution: 'Google Earth Engine - Landsat 9',
        maxZoom: 20
      }).addTo(map);

      const bounds = L.latLngBounds(data.bounds[0][1], data.bounds[0][0]);
      map.fitBounds(bounds);
      
      updateInfoPanel(data); // Se for necessário
    })
    .catch(err => console.error("Erro ao buscar dados GEE:", err));
}

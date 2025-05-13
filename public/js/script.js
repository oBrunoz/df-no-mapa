import { initMap } from './mapInit.js';
import { addBaseLayers, setupLayerSwitcher } from './layers.js';
import { loadGeoJSON } from './geojsonLoader.js';
import { setupResizeHandler } from './resizeHandler.js';
import { fetchGEEData } from './geeFetcher.js';
import { updateInfoPanel } from './UI.js';

document.addEventListener("DOMContentLoaded", () => {
  const map = initMap();
  addBaseLayers(map);
  loadGeoJSON(map);
  setupResizeHandler(map);
  setupLayerSwitcher(map);
  updateInfoPanel(map)
  // fetchGEEData(map);
});

import { initMap } from '../map/mapInit.js';
import { addBaseLayers, setupLayerSwitcher } from '../map/layers.js';
import { loadGeoJSON } from '../map/geojsonLoader.js';
import { setupResizeHandler } from './resizeHandler.js';
import { fetchGEEData } from '../map/geeFetcher.js';
import { updateInfoPanel } from '../ui/UI.js';

document.addEventListener("DOMContentLoaded", () => {
  const map = initMap();
  const rangeInput = document.getElementById('yearRange');
  addBaseLayers(map);
  loadGeoJSON(map);
  setupResizeHandler(map);
  setupLayerSwitcher(map);
  updateInfoPanel(map)
  // fetchGEEData(rangeInput);
});

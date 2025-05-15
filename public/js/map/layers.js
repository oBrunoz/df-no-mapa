export const baseLayers = {
"osm-standard": L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
    maxZoom: 19,
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
),
"osm-humanitarian": L.tileLayer(
    "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    {
    maxZoom: 19,
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">HOT</a>',
    }
),
"carto-voyager": L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    {
    maxZoom: 19,
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }
),
"stamen-terrain": L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png",
    {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
),
"esri-satellite": L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
    maxZoom: 19,
    attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    }
),
"dark-matter": L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    {
    maxZoom: 19,
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }
)
};

export const overlayLayers = {
    "TESTE": L.tileLayer(
        "https://earthengine.googleapis.com/v1/projects/ee-alencarbdev/maps/06d867159a558d04bdb56a72a4ae6fca-65171c76205fe196de86dc8903cff588/tiles/{z}/{x}/{y}",
        {
        maxZoom: 20,
        attribution: 'Google Earth Engine - Landsat 9',
        }
    ),
    "CALOR": L.tileLayer(
        "https://earthengine.googleapis.com/v1/projects/ee-alencarbdev/maps/ac30b136e8ec5f70ceeef13ff2f3d8ee-e582c8093ea2490a271164ba71594d3e/tiles/{z}/{x}/{y}",
        {
        maxZoom: 20,
        attribution: 'Google Earth Engine - Landsat 9',
        }
    )
}

let currentBaseLayer;
let currentBaseOverlayLayer;

export function addBaseLayers(map) {
    currentBaseLayer = baseLayers["osm-standard"].addTo(map);
    currentBaseOverlayLayer = overlayLayers["CALOR"].addTo(map);
}

export function setupLayerSwitcher(map) {
  const mapLayersDropdown = document.getElementById("map-layers-dropdown");

  document.querySelectorAll(".map-layer-option").forEach((button) => {
    button.addEventListener("click", function () {
      const layerId = this.getAttribute("data-layer");

      if (baseLayers[layerId]) {
        if (currentBaseLayer) {
          map.removeLayer(currentBaseLayer);
        }
        currentBaseLayer = baseLayers[layerId].addTo(map);
      }
      
      if (overlayLayers[layerId]) {
        const layer = overlayLayers[layerId];
        if (map.hasLayer(layer)) {
          map.removeLayer(layer);
        } else {
          layer.addTo(map);
        }
      }

      mapLayersDropdown.classList.add("hidden");
    });
  });
}
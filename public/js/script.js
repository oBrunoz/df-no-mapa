document.addEventListener("DOMContentLoaded", function () {
  // Inicializar o mapa
  const map = L.map("map").setView([-15.7801, -47.9292], 5); // Centro aproximado do Brasil

  // Adicionar camada base de tiles (OpenStreetMap)
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Adicionar GeoJSON simplificado do Brasil (apenas para demonstração)
  fetch(
    "https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-53-mun.json"
  )
    .then((response) => response.json())
    .then((data) => {
      L.geoJSON(data, {
        style: {
          fillColor: "red",
          weight: 1,
          opacity: 1,
          color: "red",
          fillOpacity: 0.3,
        },
      }).addTo(map);
    })
    .catch((error) => console.error("Erro ao carregar GeoJSON:", error));

  // Simulação das camadas do MapBiomas (simplificado para demonstração)
  // Em um caso real, carregaríamos dados reais de um serviço WMS ou tiles

  // Atualizar o ano exibido quando o slider muda
  const yearSlider = document.getElementById("year-slider");
  const selectedYearSpan = document.getElementById("selected-year");

  yearSlider.addEventListener("input", function () {
    selectedYearSpan.textContent = this.value;
    // Aqui atualizaríamos as camadas do mapa com base no ano selecionado
  });

  // Ajustar o tamanho do mapa quando a janela é redimensionada
  window.addEventListener("resize", function () {
    map.invalidateSize();
  });

  // Controle do dropdown
  const mapLayersToggle = document.getElementById("map-layers-toggle");
  const mapLayersDropdown = document.getElementById("map-layers-dropdown");

  // Toggle do dropdown
  mapLayersToggle.addEventListener("click", function () {
    mapLayersDropdown.classList.toggle("hidden");
  });

  // Fechar dropdown ao clicar fora dele
  document.addEventListener("click", function (event) {
    if (
      !mapLayersToggle.contains(event.target) &&
      !mapLayersDropdown.contains(event.target)
    ) {
      mapLayersDropdown.classList.add("hidden");
    }
  });

  // Definir as diferentes camadas disponíveis
  const baseLayers = {
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
      "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 18,
        attribution:
          'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
    ),
  };

  // Adicionar a camada padrão ao inicializar o mapa
  let currentLayer = baseLayers["osm-standard"].addTo(map);

  // Adicionar listeners de eventos para os botões de camada
  document.querySelectorAll(".map-layer-option").forEach((button) => {
    button.addEventListener("click", function () {
      const layerId = this.getAttribute("data-layer");

      // Remover a camada atual
      map.removeLayer(currentLayer);

      // Adicionar a nova camada
      currentLayer = baseLayers[layerId].addTo(map);

      // Fechar o dropdown
      mapLayersDropdown.classList.add("hidden");
    });
  });
});

export function loadGeoJSON(map) {
    fetch("https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-53-mun.json")
      .then((res) => res.json())
      .then((data) => {
        L.geoJSON(data, {
          style: {
            fillColor: "transparent",
            weight: 3,
            opacity: 1,
            color: "black",
            fillOpacity: 0.3,
          },
        }).addTo(map);
      })
      .catch((err) => console.error("Erro ao carregar GeoJSON:", err));
  }
  
export function updateInfoPanel(map) {
  // Controle do dropdown
  const mapLayersToggle = document.getElementById("map-layers-toggle");
  const mapLayersDropdown = document.getElementById("map-layers-dropdown");
  // Controle do zoom
  const zoomInButton = document.getElementById("zoomIn");
  const zoomOutButton = document.getElementById("zoomOut");

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

  zoomInButton.addEventListener("click", function () {
    map.zoomIn();
  });

  zoomOutButton.addEventListener("click", function () {
    map.zoomOut();
  });


  }
  
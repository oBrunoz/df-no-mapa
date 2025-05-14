export function updateInfoPanel(map) {
  // Controle do dropdown
  const mapLayersToggle = document.getElementById("map-layers-toggle");
  const mapLayersDropdown = document.getElementById("map-layers-dropdown");
  const mapCamadasToggle = document.getElementById("map-camadas-toggle");
  const mapCamadasDropdown = document.getElementById("map-camadas-dropdown");
  // Controle do zoom
  const zoomInButton = document.getElementById("zoomIn");
  const zoomOutButton = document.getElementById("zoomOut");

  // Função utilitária para toggle e fechar dropdowns
  function setupDropdown(toggle, dropdown) {
    if (!toggle || !dropdown) return;

    toggle.addEventListener("click", function (event) {
      event.stopPropagation();
      dropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", function (event) {
      if (
        !toggle.contains(event.target) &&
        !dropdown.contains(event.target)
      ) {
        dropdown.classList.add("hidden");
      }

      if (dropdown.classList.contains("hidden")) {
        toggle.checked = false;
      }
    });
  }

  // Função utilitária para botões de zoom
  function setupZoomButton(button) {
    if (!button) return;
    button.addEventListener("click", function (event) {
      event.stopPropagation();
      if (button === zoomInButton) {
        map.zoomIn();
      } else if (button === zoomOutButton) {
        map.zoomOut();
      }
    });
    document.addEventListener("click", function (event) {
      if (!button.contains(event.target)) {
        button.checked = false;
      }
    });
  }

  setupDropdown(mapLayersToggle, mapLayersDropdown);
  setupDropdown(mapCamadasToggle, mapCamadasDropdown);

  setupZoomButton(zoomInButton);
  setupZoomButton(zoomOutButton);
}
  
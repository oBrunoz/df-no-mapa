export function updateInfoPanel(map) {
  // Controle do dropdown
  const mapLayersToggle = document.getElementById("map-layers-toggle");
  const mapLayersDropdown = document.getElementById("map-layers-dropdown");
  const mapCamadasToggle = document.getElementById("map-camadas-toggle");
  const mapCamadasDropdown = document.getElementById("map-camadas-dropdown");
  // Controle do zoom
  const zoomInButton = document.getElementById("zoomIn");
  const zoomOutButton = document.getElementById("zoomOut");
  // Controle do timeline
  const timelineContainer = document.getElementById('timeline');
  // Logica do slider
  const rangeInput = document.getElementById('yearRange');
  const sliderThumb = document.getElementById('sliderThumb');
  const currentYearLabel = document.getElementById('current_year');

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

  const startYear = 2000;
  const endYear = 2025;
  const totalYears = endYear - startYear;
  const spacing = 100 / totalYears; // Defino o espaçamento entre os pontos

  // Crio os pontos do timeline
  for (let i = 0; i <= totalYears; i++) {
      const leftPosition = i * spacing;
      const span = document.createElement('span');
      span.className = 'point_time';
      span.setAttribute('data-index', i);
      span.setAttribute('data-year', startYear + i);
      span.style.cssText = `
          left: ${leftPosition}%;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #14532d;
          display: inline-block;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
      `;
      timelineContainer.appendChild(span);
  }

  // Função para atualizar a posição do thumb
  function updateThumbPosition(year) {
      const percent = ((year - startYear) / (endYear - startYear)) * 100;
      sliderThumb.style.left = `${percent}%`;
      currentYearLabel.textContent = year;
  }

  // Adiciona o evento de input ao range
  rangeInput.addEventListener('input', function () {
      const year = parseInt(this.value, 10);
      updateThumbPosition(year);
  });

  // Inicializa o thumb na posição do ano atual
  updateThumbPosition(rangeInput.value);

  // Adiciona os eventos de mouseover e mouseout para o thumb
  setupDropdown(mapLayersToggle, mapLayersDropdown);
  setupDropdown(mapCamadasToggle, mapCamadasDropdown);

  // Adiciona os eventos de clique para os botões de zoom
  setupZoomButton(zoomInButton);
  setupZoomButton(zoomOutButton);
}
  
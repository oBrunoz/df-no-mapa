import {  } from '../ui/UI.js';

export function fetchGEEData(yearRange) {
  fetch("http://localhost:8080/process", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      year: parseInt(yearRange.value),
      layers: ["thermal"]
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log("Dados GEE recebidos:", data);
  })
  .catch(err => console.error("Erro ao buscar dados GEE:", err));
}

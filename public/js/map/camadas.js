export const overlayLayers = {
    "TESTE": L.tileLayer(
        "https://earthengine.googleapis.com/v1/projects/ee-alencarbdev/maps/baf5d41c499bf53b957d63272ae9e273-acd67b53c60ab53194c1f1ac33a12171/tiles/{z}/{x}/{y}",
        {
        maxZoom: 20,
        attribution: 'Google Earth Engine - Landsat 9',
        }
    ),
    "CALOR": L.tileLayer(
        "https://earthengine.googleapis.com/v1/projects/ee-alencarbdev/maps/dbcfe55af1eb015a4735ff320465d244-f2090219c269b14cd378e299e6e1754a/tiles/{z}/{x}/{y}",
        {
        maxZoom: 20,
        attribution: 'Google Earth Engine - Landsat 9',
        }
    )
}
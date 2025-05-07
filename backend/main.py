# main.py (FastAPI)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from landsat_processor import LandsatProcessor

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Preciso ajustar para o domínio do frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/landsat")
def get_landsat_data(region_name: str = "Distrito Federal", year: int = 2025):
    processor = LandsatProcessor(region_name=region_name, year=year)
    
    landsat_layer = processor.get_landsat_layer()
    ndvi_layer = processor.get_ndvi_layer()
    thermal_layer = processor.get_thermal_layer()

    return {
        "landsat": landsat_layer,
        "ndvi": ndvi_layer,
        "thermal": {
            "vis_params": thermal_layer["vis_params"],
            "mapid": thermal_layer["layer"].getMapId(thermal_layer["vis_params"])["mapid"],
            "token": thermal_layer["layer"].getMapId(thermal_layer["vis_params"])["token"],
            "name": thermal_layer["name"]
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", port=8080, reload=True)
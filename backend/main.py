from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from gee_utils import get_landsat_image
import uvicorn

app = FastAPI()

# Libera acesso do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/ndvi")
async def ndvi():
    result = get_landsat_image("2025-01-01", "2025-12-31", region_name="Distrito Federal")
    return {"ndvi": result}

if __name__ == "__main__":
    uvicorn.run("main:app", port=8080, reload=True)
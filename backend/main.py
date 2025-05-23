from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, Optional, List
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
import asyncio
import json
import logging

from landsat_processor import LandsatProcessor

app = FastAPI(title="Landsat GEE API", description="API para processamento de imagens Landsat usando Google Earth Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cache para resultados de processamento
processing_cache = {}

class ProcessingRequest(BaseModel):
    """
    ProcessingRequest representa um modelo de dados para requisições de processamento geográfico.

    Atributos:
        year (int): Ano de referência para o processamento.
    """
    year: int

@app.get("/")
def read_root():
    return {"message": "Landsat GEE API", "status": "online", "version": "1.0.0"}

@app.post("/teste")
def test(request: ProcessingRequest):
    year_data = request.year
    print('year_data', year_data)
    if not year_data:
        raise HTTPException(status_code=400, detail="Ano não fornecido")
    
    l_processor = LandsatProcessor(region_name="Distrito Federal", year=year_data)
    urls = l_processor.get_all_tile_urls()

    landsat = urls['landsat_tile_url']
    ndvi = urls['ndvi_tile_url']
    thermal = urls['thermal_tile_url']

    return {
        "landsat": landsat,
        "ndvi": ndvi,
        "thermal": thermal
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", port=8080, reload=True)
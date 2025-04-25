import ee
import os
from dotenv import load_dotenv

load_dotenv()

# Autentica com as credenciais da conta de serviço
service_account_credentials = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
ee.Authenticate()
ee.Initialize()

def get_landsat_image(start_date, end_date, region_name='Distrito Federal'):
    # Carrega os limites administrativos
    brasil = ee.FeatureCollection('FAO/GAUL/2015/level1').filter(
        ee.Filter.eq('ADM1_NAME', region_name)
    )
    
    # Parâmetros de visualização (true color: bandas 4, 3, 2)
    visualization = {
        'bands': ['SR_B4', 'SR_B3', 'SR_B2'],
        'min': 0.0,
        'max': 0.15
    }
    
    # Applies scaling factors
    def apply_scale_factors(image):
        optical_bands = image.select('SR_B.').multiply(0.0000275).add(-0.2)
        thermal_bands = image.select('ST_B.*').multiply(0.00341802).add(149.0)
        return image.addBands(optical_bands, None, True).addBands(thermal_bands, None, True)
    
    # Function to Mask Clouds
    def cloud_mask(image):
        cloud_shadow_bitmask = (1 << 3)
        cloud_bitmask = (1 << 5)
        qa = image.select('QA_PIXEL')
        mask = qa.bitwiseAnd(cloud_shadow_bitmask).eq(0).And(
               qa.bitwiseAnd(cloud_bitmask).eq(0))
        return image.updateMask(mask)
    
    # Processa a imagem
    image = (ee.ImageCollection("LANDSAT/LC09/C02/T1_L2")
             .filterBounds(brasil)
             .filterDate(start_date, end_date)
             .map(apply_scale_factors)
             .map(cloud_mask)
             .median()
             .clip(brasil))
    
    # Obtém os parâmetros para visualização no frontend
    map_info = image.getMapId(visualization)
    
    return {
        'mapid': map_info['mapid'],
        'token': map_info['token'],
        'visualization': visualization,
        'bounds': brasil.geometry().bounds().getInfo()['coordinates'],
        'region_name': region_name,
        'dates': {'start': start_date, 'end': end_date}
    }
import ee

class LandsatProcessor:
    """
        LandsatProcessor é uma classe utilitária para processar imagens de satélite Landsat 9 usando o Google Earth Engine (GEE).
        Ela fornece métodos para recuperar, processar e visualizar dados de satélite para uma região e ano especificados, incluindo
        o cálculo do NDVI (Índice de Vegetação por Diferença Normalizada) e da temperatura da superfície terrestre (camada térmica).
        Atributos:
            region_name (str): Nome da região administrativa a ser processada (padrão: "Distrito Federal").
            year (int): Ano para o qual as imagens serão processadas.
            region (ee.FeatureCollection): Geometria da região carregada do conjunto de dados FAO GAUL.
            image (ee.Image): Imagem Landsat processada (com máscara de nuvens, escalada e recortada).
            ndvi (ee.Image): Imagem NDVI calculada a partir da imagem Landsat processada.
            ndvi_min (float): Valor mínimo de NDVI dentro da região.
            ndvi_max (float): Valor máximo de NDVI dentro da região.
            thermal (ee.Image): Imagem de temperatura da superfície terrestre calculada a partir da imagem Landsat processada.
        Métodos:
            get_landsat_layer():
                Retorna parâmetros de visualização e URL de tiles para a imagem RGB Landsat.
            get_ndvi_layer():
                Retorna parâmetros de visualização e URL de tiles para a imagem NDVI.
            get_thermal_layer():
                Retorna parâmetros de visualização e URL de tiles para a imagem de temperatura da superfície terrestre.
            get_all_tile_urls():
                Retorna um dicionário com as URLs dos tiles para as camadas Landsat RGB, NDVI e térmica.
        Uso:
            Instancie a classe com o ano e nome da região desejados. Utilize os métodos fornecidos para acessar
            imagens processadas e URLs de visualização para integração com aplicações de mapas.
        Observação:
            Requer autenticação e disponibilidade da API Python do Google Earth Engine.
    """

    def __init__(self, year, region_name="Distrito Federal"):
        ee.Authenticate()
        ee.Initialize()
        self.region_name = region_name
        self.year = year
        self.region = self._load_region()
        self.image = self._process_image()
        self.ndvi = self.image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI')
        self.ndvi_min, self.ndvi_max = self._calculate_min_and_max_ndvi()
        self.thermal = self._calculate_thermal_layer()

    def _load_region(self):
        return ee.FeatureCollection('FAO/GAUL/2015/level1') \
                 .filter(ee.Filter.eq('ADM1_NAME', self.region_name))

    def _apply_scale_factors(self, image):
        optical = image.select('SR_B.').multiply(0.0000275).add(-0.2)
        thermal = image.select('ST_B.*').multiply(0.00341802).add(149.0)
        return image.addBands(optical, None, True).addBands(thermal, None, True)

    def _cloud_mask(self, image):
        cloud_shadow = (1 << 3)
        cloud = (1 << 5)
        qa = image.select('QA_PIXEL')
        mask = qa.bitwiseAnd(cloud_shadow).eq(0).And(
               qa.bitwiseAnd(cloud).eq(0))
        return image.updateMask(mask)

    def _process_image(self):
        return (ee.ImageCollection("LANDSAT/LC09/C02/T1_L2")
                  .filterBounds(self.region)
                  .filterDate(f'{self.year}-01-01', f'{self.year}-12-31')
                  .map(self._apply_scale_factors)
                  .map(self._cloud_mask)
                  .median()
                  .clip(self.region))

    def _calculate_min_and_max_ndvi(self):
        stats = self.ndvi.reduceRegion(
            reducer=ee.Reducer.minMax(),
            geometry=self.region.geometry(),
            scale=30,
            maxPixels=1e9
        ).getInfo()

        return stats['NDVI_min'], stats['NDVI_max']

    def get_landsat_layer(self):
        vis = {
            'bands': ['SR_B4', 'SR_B3', 'SR_B2'],
            'min': 0.0,
            'max': 0.15
        }
        
        landsat_vis = self.image.getMapId(vis)
        tile_url = landsat_vis['tile_fetcher'].url_format

        return {
            'image': self.image,
            'image': self.image,
            'tile_url': tile_url,
            'visualization': vis,
            'bounds': self.region.geometry().bounds().getInfo()['coordinates'],
            'region_name': self.region_name,
            'dates': {'start': f'{self.year}-01-01', 'end': f'{self.year}-12-31'}
        }

    def get_ndvi_layer(self):
        ndvi_vis = {
            'min': -1,
            'max': 1,
            'palette': ['blue', 'white', 'green']
        }

        ndvi_map_info = self.ndvi.getMapId(ndvi_vis)
        ndvi_tile_url = ndvi_map_info['tile_fetcher'].url_format

        return {
            'ndvi': self.ndvi,
            'ndviPallete': ndvi_vis,
            'tile_url': ndvi_tile_url,
        }

    def _calculate_thermal_layer(self):
        fv = ((self.ndvi.subtract(self.ndvi_min))
              .divide(self.ndvi_max - self.ndvi_min)).pow(2).rename('FV')
        em = fv.multiply(ee.Number(0.004)).add(ee.Number(0.986)).rename('EM')
        thermal = self.image.select('ST_B10').rename('thermal')
        lst = thermal.expression(
            '(TB / (1 + (0.00115 * (TB / 1.438)) * log(em))) - 273.15',
            {'TB': thermal, 'em': em}
        ).rename(f'Temperatura do solo do {self.region_name} - {self.year}')
        return lst

    def get_thermal_layer(self):
        thermal_vis = {
            "min": 18.47,
            "max": 42.86,
            "palette": [
                '040274', '040281', '0502a3', '0502b8', '0502ce', '0502e6',
                '0602ff', '235cb1', '307ef3', '269db1', '30c8e2', '32d3ef',
                '3be285', '3ff38f', '86e26f', '3ae237', 'b5e22e', 'd6e21f',
                'fff705', 'ffd611', 'ffb613', 'ff8b13', 'ff6e08', 'ff500d',
                'ff0000', 'de0101', 'c21301', 'a71001', '911003'
            ]
        }
        
        # Método atualizado para obter a URL de visualização
        thermal_map = self.thermal.getMapId(thermal_vis)
        tile_url = thermal_map['tile_fetcher'].url_format

        return {
            'layer': self.thermal,
            'vis_params': thermal_vis,
            'name': f'Temperatura do solo - {self.year} - {self.region_name}',
            'tile_url': tile_url
        }

    def get_all_tile_urls(self):
        landsat = self.get_landsat_layer()
        ndvi = self.get_ndvi_layer()
        thermal = self.get_thermal_layer()
        
        return {
            'landsat_tile_url': landsat['tile_url'],
            'ndvi_tile_url': ndvi['tile_url'],
            'thermal_tile_url': thermal['tile_url']
        }
    
# processor = LandsatProcessor()
# urls = processor.get_all_tile_urls()
# print("Landsat Tile URL:", urls['landsat_tile_url'])
# print("NDVI Tile URL:", urls['ndvi_tile_url'])
# print("Thermal Tile URL:", urls['thermal_tile_url'])
from pydantic import BaseModel


class PredictInput(BaseModel):
    N_INTENTOS: int
    PUNTAJE_MINEDU: float
    TIEMPO_DESDE_EGRESO: int
    EDAD: int
    ES_MIGRANTE: int
    COLEGIO_TIPO_GESTION: int
    SEXO_COD: int
    ASISTENCIA: float
    PARCIAL_1: float
    PARCIAL_2: float
    CALIF_PROMEDIO_HIST: float
    HA_INGRESADO_ANTES: int
    ANIO_POSTULA: int
    EGRESADO_RECIENTE_BIN: int
    NIVEL_DIFICULTAD: int

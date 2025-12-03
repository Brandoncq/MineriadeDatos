from pydantic import BaseModel


class PredictInput(BaseModel):
    edad: int
    genero: int | str
    departamento: int | str
    provincia: int | str
    distrito: int | str
    tiempo_estudio: int
    horas_diarias: int
    internet: int | str
    dispositivo: int
    situacion_laboral: int
    ingresos: float
    gasto_transporte: float
    gasto_materiales: float
    promedio_colegio: float
    puntaje_simulacro: int
    numero_intentos: int
    motivacion: int
    apoyo_familiar: int
    estres: int
    salud: int
    sueño: int
    tiempo_preparacion_meses: int

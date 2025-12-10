import { useState, useEffect } from "react";
import { FaGraduationCap, FaUser, FaCheckCircle, FaExclamationTriangle, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
// NOTA IMPORTANTE: Si ves errores con los iconos, debes instalar 'react-icons' con: npm install react-icons

// =============================================================================
// DATOS E INTEGRACIÓN MINEDU Y DIFICULTAD (Desde el Pipeline de Python)
// =============================================================================

const POSTULA_YEAR = 2025;
const DEFAULT_MINEDU_SCORE = 5.0; // Valor de respaldo (media)

// Data extraída del diccionario data_minedu en Python
const MINEDU_SCORES_BY_REGION_AND_YEAR = {
    'AMAZONAS': {2016: 3.2, 2017: 2.2, 2018: 2.9, 2019: 2.6, 2020: 2.9, 2021: 2.7, 2022: 3.8, 2023: 3.0, 2024: 3.1},
    'ÁNCASH': {2016: 5.5, 2017: 4.8, 2018: 4.2, 2019: 4.2, 2020: 4.6, 2021: 4.2, 2022: 4.7, 2023: 4.4, 2024: 4.4},
    'APURÍMAC': {2016: 2.6, 2017: 3.9, 2018: 2.8, 2019: 3.3, 2020: 3.8, 2021: 4.0, 2022: 4.2, 2023: 4.4, 2024: 3.9},
    'AREQUIPA': {2016: 7.9, 2017: 7.6, 2018: 7.9, 2019: 7.8, 2020: 8.2, 2021: 8.0, 2022: 8.1, 2023: 7.9, 2024: 7.9},
    'AYACUCHO': {2016: 3.7, 2017: 3.9, 2018: 3.4, 2019: 3.7, 2020: 3.7, 2021: 4.0, 2022: 4.2, 2023: 4.2, 2024: 4.3},
    'CAJAMARCA': {2016: 2.8, 2017: 2.2, 2018: 2.7, 2019: 2.3, 2020: 2.6, 2021: 2.8, 2022: 3.4, 2023: 2.7, 2024: 2.3},
    'CUSCO': {2016: 3.8, 2017: 4.6, 2018: 4.1, 2019: 4.0, 2020: 4.7, 2021: 4.8, 2022: 4.9, 2023: 4.7, 2024: 4.8},
    'HUANCAVELICA': {2016: 2.8, 2017: 3.3, 2018: 2.4, 2019: 2.7, 2020: 3.2, 2021: 3.4, 2022: 4.1, 2023: 3.9, 2024: 3.1},
    'HUÁNUCO': {2016: 2.3, 2017: 2.2, 2018: 2.1, 2019: 1.6, 2020: 2.1, 2021: 2.2, 2022: 2.6, 2023: 2.1, 2024: 2.0},
    'ICA': {2016: 8.4, 2017: 7.5, 2018: 7.6, 2019: 7.2, 2020: 7.7, 2021: 7.6, 2022: 7.5, 2023: 7.1, 2024: 7.0},
    'JUNÍN': {2016: 5.2, 2017: 4.6, 2018: 5.0, 2019: 4.8, 2020: 4.8, 2021: 4.8, 2022: 5.2, 2023: 5.2, 2024: 4.6},
    'LA LIBERTAD': {2016: 4.6, 2017: 4.8, 2018: 4.7, 2019: 4.9, 2020: 4.8, 2021: 4.9, 2022: 4.9, 2023: 4.7, 2024: 4.5},
    'LAMBAYEQUE': {2016: 4.0, 2017: 5.6, 2018: 4.8, 2019: 4.9, 2020: 5.3, 2021: 5.4, 2022: 5.5, 2023: 5.2, 2024: 5.2},
    'LIMA': {2016: 8.0, 2017: 7.9, 2018: 8.1, 2019: 8.3, 2020: 8.3, 2021: 8.2, 2022: 8.1, 2023: 8.2, 2024: 8.0}, 
    'LORETO': {2016: 1.5, 2017: 1.3, 2018: 1.6, 2019: 1.6, 2020: 1.4, 2021: 1.2, 2022: 1.6, 2023: 1.6, 2024: 1.6},
    'MADRE DE DIOS': {2016: 5.1, 2017: 3.7, 2018: 4.1, 2019: 4.3, 2020: 4.3, 2021: 3.5, 2022: 4.1, 2023: 3.8, 2024: 2.3},
    'MOQUEGUA': {2016: 8.2, 2017: 7.6, 2018: 7.3, 2019: 7.2, 2020: 7.4, 2021: 7.5, 2022: 7.8, 2023: 8.6, 2024: 8.6},
    'PASCO': {2016: 4.8, 2017: 4.0, 2018: 4.2, 2019: 3.9, 2020: 4.3, 2021: 4.5, 2022: 4.6, 2023: 4.4, 2024: 4.6},
    'PIURA': {2016: 4.8, 2017: 4.3, 2018: 3.4, 2019: 3.9, 2020: 4.4, 2021: 4.3, 2022: 4.6, 2023: 4.2, 2024: 3.9},
    'PUNO': {2016: 5.2, 2017: 4.3, 2018: 3.6, 2019: 4.0, 2020: 4.6, 2021: 4.3, 2022: 4.9, 2023: 4.8, 2024: 4.5},
    'SAN MARTÍN': {2016: 2.9, 2017: 2.7, 2018: 3.0, 2019: 3.4, 2020: 3.1, 2021: 2.9, 2022: 3.0, 2023: 2.7, 2024: 2.8},
    'TACNA': {2016: 9.4, 2017: 9.0, 2018: 8.9, 2019: 8.4, 2020: 8.9, 2021: 8.6, 2022: 9.0, 2023: 9.0, 2024: 8.1},
    'TUMBES': {2016: 6.1, 2017: 5.9, 2018: 4.7, 2019: 4.5, 2020: 5.9, 2021: 5.5, 2022: 5.5, 2023: 5.7, 2024: 5.0},
    'UCAYALI': {2016: 2.2, 2017: 2.4, 2018: 2.8, 2019: 2.9, 2020: 1.8, 2021: 2.4, 2022: 1.5, 2023: 2.0, 2024: 2.2},
    'CALLAO': {2016: 8.0, 2017: 7.9, 2018: 8.1, 2019: 8.3, 2020: 8.3, 2021: 8.2, 2022: 8.1, 2023: 8.2, 2024: 8.0}, // Usando valores de Lima
};

const REGIONS = Object.keys(MINEDU_SCORES_BY_REGION_AND_YEAR).sort();

/**
 * Calcula el PUNTAJE_MINEDU basado en la región y el año de egreso.
 */
const getMineduScore = (region, egresoYearStr) => {
    const egresoYear = parseInt(egresoYearStr, 10);
    if (!region || isNaN(egresoYear)) return DEFAULT_MINEDU_SCORE;
    
    let refYear = egresoYear;
    if (refYear >= POSTULA_YEAR) {
        refYear = 2024; 
    } else if (refYear < 2016) {
        refYear = 2016;
    }
    
    const regionScores = MINEDU_SCORES_BY_REGION_AND_YEAR[region];
    if (regionScores) {
        const score = regionScores[refYear];
        return score !== undefined ? score : DEFAULT_MINEDU_SCORE;
    }

    return DEFAULT_MINEDU_SCORE;
};

// Mapeo de Facultades a Nivel de Dificultad (de 1 a 5)
const FACULTAD_DIFICULTY_MAP = {
    'FACULTAD_C': { level: 5, label: 'Ingeniería Civil' },
    'FACULTAD_I': { level: 5, label: 'Ing. Industrial, Sistemas y Software' },
    'FACULTAD_M': { level: 5, label: 'Ingeniería Mecánica, Mecatrónica, Naval' },
    'FACULTAD_L': { level: 4, label: 'Ingeniería Eléctrica, Electrónica, Telecomunicaciones' },
    'FACULTAD_G': { level: 4, label: 'Ing. Geológica, Metalúrgica, Minas' },
    'FACULTAD_A': { level: 3, label: 'Arquitectura y Urbanismo' },
    'FACULTAD_S': { level: 3, label: 'Ing. Sanitaria, Ambiental, Higiene' },
    'FACULTAD_E': { level: 3, label: 'Ing. Económica, Estadística' },
    'SIN_DEFINIR': { level: 3, label: 'Otro / Sin especificar (Nivel Promedio)' },
    'FACULTAD_Q': { level: 2, label: 'Ing. Química y Textil' },
    'FACULTAD_N': { level: 2, label: 'Física, Matemática, Química, Ciencia de la Computación' },
    'FACULTAD_P': { level: 2, label: 'Ing. Petroquímica, Petróleo y Gas Natural' },
};

const DIFFICULTY_OPTIONS = [
    { value: "", label: "Selecciona una carrera o facultad", difficulty: 3 },
    ...Object.entries(FACULTAD_DIFICULTY_MAP)
        .map(([key, data]) => ({
            value: key,
            label: `${data.label} (Dificultad ${data.level})`,
            difficulty: data.level
        }))
        .sort((a, b) => b.difficulty - a.difficulty) 
];

// Mapeo para Asistencia (Selector Descriptivo)
const ASISTENCIA_MAP = [
    { value: 'BAJA', label: 'Baja (Menos del 70%)', numeric: 0.65 },
    { value: 'MEDIA', label: 'Media (70% - 85%)', numeric: 0.78 },
    { value: 'ALTA', label: 'Alta (85% - 95%)', numeric: 0.90 },
    { value: 'PERFECTA', label: 'Perfecta (Más del 95%)', numeric: 0.98 },
];

const getNumericAssistance = (category) => {
    const item = ASISTENCIA_MAP.find(i => i.value === category);
    return item ? item.numeric : 0.9; // 0.9 como respaldo
};

// =============================================================================
// COMPONENTE AUXILIAR
// =============================================================================
const InputGroup = ({ label, name, children, required = true, helperText = null }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
  </div>
);


// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================
function App() {
  const [formData, setFormData] = useState({
    EDAD: "",
    N_INTENTOS: "",
    // CALIF_PROMEDIO_HIST: "", // ELIMINADO
    HA_INGRESADO_ANTES: "", 
    COLEGIO_TIPO_GESTION: "",
    SEXO_COD: "",
    PARCIAL_1: "",
    PARCIAL_2: "",
    ES_MIGRANTE: 0,

    // Campos de entrada para automatización
    REGION_INTERESADA: "", 
    ANIO_EGRESO: "", 
    DIFICULTAD_COD: "", 
    ASISTENCIA: "ALTA", 

    // Campos automáticos/derivados (se envían al backend)
    TIEMPO_DESDE_EGRESO: 0, 
    EGRESADO_RECIENTE_BIN: 0, 
    PUNTAJE_MINEDU: 0.0, 
    NIVEL_DIFICULTAD: 3, 
    ANIO_POSTULA: POSTULA_YEAR, 
  });

  const [prediction, setPrediction] = useState(null);
  const [probability, setProbability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null); 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setErrorMsg(null); 
    
    const newValue = type === "checkbox" ? (checked ? 1 : 0) : value;

    setFormData((prev) => {
        const newState = { ...prev, [name]: newValue };

        // Lógica especial para NIVEL_DIFICULTAD (DIFICULTAD_COD)
        if (name === 'DIFICULTAD_COD') {
            const selectedOption = DIFFICULTY_OPTIONS.find(opt => opt.value === newValue);
            newState.NIVEL_DIFICULTAD = selectedOption ? selectedOption.difficulty : 3;
        }

        return newState;
    });
  };

  // 🤖 EFECTO PARA AUTOMATIZAR PUNTAJE MINEDU, TIEMPO Y EGRESADO_RECIENTE
  useEffect(() => {
    const { REGION_INTERESADA, ANIO_EGRESO } = formData;
    let updates = {};

    // 1. Calcular PUNTAJE_MINEDU
    if (REGION_INTERESADA && ANIO_EGRESO) {
      const minedu = getMineduScore(REGION_INTERESADA, ANIO_EGRESO);
      updates.PUNTAJE_MINEDU = minedu;
    }

    // 2. Calcular TIEMPO_DESDE_EGRESO y EGRESADO_RECIENTE_BIN
    const egresoYear = parseInt(ANIO_EGRESO, 10);
    if (!isNaN(egresoYear)) {
      const tiempoEgreso = POSTULA_YEAR - egresoYear;
      updates.TIEMPO_DESDE_EGRESO = tiempoEgreso < 0 ? 0 : tiempoEgreso; 
      updates.EGRESADO_RECIENTE_BIN = (tiempoEgreso >= 0 && tiempoEgreso <= 1) ? 1 : 0;
    }

    if (Object.keys(updates).length > 0) {
      setFormData(prev => ({ ...prev, ...updates }));
    }
  }, [formData.REGION_INTERESADA, formData.ANIO_EGRESO]);


  const validateData = (data) => {
    // Validaciones de rango
    if (Number(data.EDAD) < 16 || Number(data.EDAD) > 60) return "La Edad debe estar entre 16 y 60.";
    if (Number(data.N_INTENTOS) < 1 || Number(data.N_INTENTOS) > 10) return "El Número de Intentos debe estar entre 1 y 10.";
    
    // Validaciones de notas
    if (Number(data.PARCIAL_1) < 0 || Number(data.PARCIAL_1) > 20) return "La nota del Parcial 1 debe estar entre 0 y 20.";
    if (Number(data.PARCIAL_2) < 0 || Number(data.PARCIAL_2) > 20) return "La nota del Parcial 2 debe estar entre 0 y 20.";
    
    // Validaciones de Selectores
    if (data.REGION_INTERESADA === "") return "Debe seleccionar la Región de Egreso.";
    if (data.ASISTENCIA === "") return "Debe seleccionar el Nivel de Asistencia.";
    if (data.DIFICULTAD_COD === "") return "Debe seleccionar la Carrera/Facultad.";
    
    // Validar Año de Egreso
    const egresoYear = parseInt(data.ANIO_EGRESO, 10);
    if (!data.ANIO_EGRESO || isNaN(egresoYear) || egresoYear > POSTULA_YEAR || egresoYear < 1980) return `El Año de Egreso debe ser un año válido (máximo ${POSTULA_YEAR}).`;
    
    return null; // Todo bien
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPrediction(null);
    setProbability(null);
    setErrorMsg(null);

    const validationError = validateData(formData);
    if (validationError) {
      setErrorMsg(<><FaExclamationTriangle className="inline mr-2"/> Error de Validación: {validationError}</>);
      return;
    }

    setLoading(true);

    // Mapear campos solo a los requeridos por el backend
    const bodyToSend = {
      // Campos derivados (automáticos)
      PUNTAJE_MINEDU: parseFloat(formData.PUNTAJE_MINEDU) || 0.0,
      TIEMPO_DESDE_EGRESO: parseInt(formData.TIEMPO_DESDE_EGRESO) || 0,
      EGRESADO_RECIENTE_BIN: parseInt(formData.EGRESADO_RECIENTE_BIN) || 0,
      NIVEL_DIFICULTAD: parseInt(formData.NIVEL_DIFICULTAD) || 3,
      ANIO_POSTULA: POSTULA_YEAR,

      // Campos de entrada del usuario (convertidos)
      EDAD: parseInt(formData.EDAD) || 0,
      N_INTENTOS: parseInt(formData.N_INTENTOS) || 0,
      // CALIF_PROMEDIO_HIST: 0.0, // ELIMINADO del body
      HA_INGRESADO_ANTES: parseInt(formData.HA_INGRESADO_ANTES) || 0, 
      COLEGIO_TIPO_GESTION: parseInt(formData.COLEGIO_TIPO_GESTION) || 0,
      SEXO_COD: parseInt(formData.SEXO_COD) || 0,
      
      // Conversión de la categoría a número decimal (0.0 a 1.0)
      ASISTENCIA: getNumericAssistance(formData.ASISTENCIA),
      
      PARCIAL_1: parseFloat(formData.PARCIAL_1) || 0.0,
      PARCIAL_2: parseFloat(formData.PARCIAL_2) || 0.0,
      ES_MIGRANTE: parseInt(formData.ES_MIGRANTE) || 0,
    };

    try {
      // NOTE: Reemplaza esta URL con la URL de tu backend
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/predict`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyToSend),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(`Error ${res.status}: ${errorData.message || 'Error desconocido del servidor'}`);
      }

      const json = await res.json();
      setPrediction(json.prediction);
      setProbability(json.probability);
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg(<><FaExclamationTriangle className="inline mr-2"/> Error al predecir: {error.message}</>);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
          <FaGraduationCap className="text-blue-600 mr-3"/> Predicción de Ingreso
        </h1>
        <p className="text-sm text-center text-gray-500 mb-6 border-b pb-4">
          Cálculo para el proceso de **{POSTULA_YEAR}**.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECCIÓN DATOS PERSONALES */}
          <h2 className="text-lg font-semibold text-blue-600 border-l-4 border-blue-600 pl-2">
            <FaUser className="inline mr-2"/> Información del Postulante
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <InputGroup label="Edad (16-60)" name="EDAD">
              <input type="number" name="EDAD" min="16" max="60" value={formData.EDAD} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg mt-1" required />
            </InputGroup>

            <InputGroup label="Sexo" name="SEXO_COD">
              <select name="SEXO_COD" value={formData.SEXO_COD} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg mt-1" required >
                <option value="">Selecciona</option>
                <option value="0">Masculino</option>
                <option value="1">Femenino</option>
              </select>
            </InputGroup>

            {/* <InputGroup label="Calificación Histórica (0-20)" name="CALIF_PROMEDIO_HIST">
              <input type="number" step="0.1" min="0" max="20" name="CALIF_PROMEDIO_HIST" value={formData.CALIF_PROMEDIO_HIST} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg mt-1" required />
            </InputGroup> */}

            <InputGroup label="Número de Intentos de Postulación" name="N_INTENTOS">
              <input type="number" name="N_INTENTOS" min="1" max="10" value={formData.N_INTENTOS} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg mt-1" required />
            </InputGroup>

            <InputGroup label="Tipo de Colegio" name="COLEGIO_TIPO_GESTION">
              <select name="COLEGIO_TIPO_GESTION" value={formData.COLEGIO_TIPO_GESTION} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg mt-1" required >
                <option value="">Selecciona</option>
                <option value="0">Público</option>
                <option value="1">Privado</option>
              </select>
            </InputGroup>

            <InputGroup label="¿Ha ingresado antes?" name="HA_INGRESADO_ANTES">
              <select name="HA_INGRESADO_ANTES" value={formData.HA_INGRESADO_ANTES} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg mt-1" required >
                <option value="">Selecciona</option>
                <option value="1">Sí</option>
                <option value="0">No</option>
              </select>
            </InputGroup>
          </div>
          
          

          {/* SECCIÓN AUTOMATIZADA (MINEDU) */}
          <h2 className="text-lg font-semibold text-blue-600 border-l-4 border-blue-600 pl-2">
            <FaCalendarAlt className="inline mr-2"/> Factores Automáticos (MINEDU y Antigüedad)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            
            {/* ANIO EGRESO (Input) */}
            <InputGroup label="Año de Egreso Escolar" name="ANIO_EGRESO" helperText={`Máximo ${POSTULA_YEAR}`}>
                <input type="number" name="ANIO_EGRESO" min="1980" max={POSTULA_YEAR} value={formData.ANIO_EGRESO} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg mt-1" required />
            </InputGroup>

            {/* REGION INTERESADA (Input) */}
            <InputGroup label="Región de Egreso" name="REGION_INTERESADA">
              <select name="REGION_INTERESADA" value={formData.REGION_INTERESADA} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg mt-1" required >
                <option value="">Selecciona</option>
                {REGIONS.map(region => (<option key={region} value={region}>{region}</option>))}
              </select>
            </InputGroup>
            
            {/* DISPLAY - PUNTAJE MINEDU CALCULADO */}
            <div className="md:col-span-2 p-3 bg-yellow-100 rounded-lg border-l-4 border-yellow-500">
                <p className="text-sm font-medium text-gray-700 flex items-center">
                    <FaMapMarkerAlt className="inline mr-2 text-yellow-600"/> 
                    Puntaje MINEDU Automático: 
                    <span className="font-bold text-lg text-yellow-800 ml-2">
                        {formData.PUNTAJE_MINEDU.toFixed(2)}
                    </span>
                </p>
                <p className="text-xs text-gray-600 mt-1">
                    Antigüedad (Años desde Egreso): **{formData.TIEMPO_DESDE_EGRESO}**
                </p>
            </div>
          </div>
          
          

          {/* SECCIÓN DIFICULTAD Y NOTAS */}
          <h2 className="text-lg font-semibold text-blue-600 border-l-4 border-blue-600 pl-2">
            <FaCheckCircle className="inline mr-2"/> Nivel de Dificultad y Rendimiento
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* NIVEL DIFICULTAD (Select de Facultad/Carrera) */}
            <InputGroup label="Carrera/Facultad de Interés" name="DIFICULTAD_COD">
              <select name="DIFICULTAD_COD" value={formData.DIFICULTAD_COD} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg mt-1" required >
                {DIFFICULTY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">Nivel de Dificultad Calculado: **{formData.NIVEL_DIFICULTAD}**</p>
            </InputGroup>
            
            {/* MIGRANTE */}
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border border-gray-300 self-end h-min">
              <input type="checkbox" name="ES_MIGRANTE" id="ES_MIGRANTE" checked={formData.ES_MIGRANTE === 1} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
              <label htmlFor="ES_MIGRANTE" className="text-sm font-medium text-gray-700">
                Es migrante (Región de egreso diferente a domicilio)
              </label>
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
             {/* ASISTENCIA (SELECT DESCRIPTIVO) */}
            <InputGroup label="Nivel de Asistencia en el curso" name="ASISTENCIA">
                <select name="ASISTENCIA" value={formData.ASISTENCIA} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg mt-1" required >
                    <option value="">Selecciona un nivel</option>
                    {ASISTENCIA_MAP.map((item) => (
                        <option key={item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
            </InputGroup>
              
            <InputGroup label="Parcial 1 (0-20)" name="PARCIAL_1">
              <input type="number" step="0.1" min="0" max="20" name="PARCIAL_1" value={formData.PARCIAL_1} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg mt-1" required />
            </InputGroup>

            <InputGroup label="Parcial 2 (0-20)" name="PARCIAL_2">
              <input type="number" step="0.1" min="0" max="20" name="PARCIAL_2" value={formData.PARCIAL_2} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg mt-1" required />
            </InputGroup>
          </div>


          {/* Mensajes de Error */}
          {errorMsg && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-xl transition duration-200 flex items-center justify-center ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Calculando...
                </>
            ) : "Predecir Ingreso"}
          </button>
        </form>

        {prediction !== null && (
          <div className="mt-6 text-center border-t pt-4">
            <h3 className="text-xl font-semibold text-gray-800">Resultado de Predicción</h3>
            <p className="text-2xl mt-2">
              <span
                className={`font-extrabold p-3 rounded-xl shadow-md ${
                  prediction === 1
                    ? "text-white bg-green-500"
                    : "text-white bg-red-500"
                }`}
              >
                {prediction === 1 ? "✅ INGRESA" : "❌ NO INGRESA"}
              </span>
            </p>

            {probability !== null && (
              <p className="mt-3 text-gray-700 text-lg">
                Probabilidad:{" "}
                <b className="text-blue-600">{probability.toFixed(2)}%</b>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
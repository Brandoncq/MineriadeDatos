import { useState, useEffect } from "react";
import {
    FaGraduationCap, FaUser, FaCheckCircle, FaExclamationTriangle,
    FaCalendarAlt, FaSchool
} from "react-icons/fa";

// Importaciones locales (Rutas ajustadas según la estructura creada)
import { REGIONS, getMineduScore } from "./data/mineduData";
import { POSTULA_YEAR, DIFFICULTY_OPTIONS, ASISTENCIA_MAP, getNumericAssistance } from "./utils/constants";
import InputGroup from "./components/InputGroup";

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================
function App() {
    const [formData, setFormData] = useState({
        EDAD: "",
        SEXO_COD: "",
        N_INTENTOS: "",
        COLEGIO_TIPO_GESTION: "",
        HA_INGRESADO_ANTES: "",
        CALIF_PROMEDIO_HIST: "",
        PARCIAL_1: "",
        PARCIAL_2: "",
        ES_MIGRANTE: 0,
        
        // UI
        REGION_INTERESADA: "",
        ANIO_EGRESO: "",
        DIFICULTAD_COD: "",
        ASISTENCIA_UI: "ALTA",

        // Automáticos
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

    // --- EFECTOS (Automatización) ---
    useEffect(() => {
        const { REGION_INTERESADA, ANIO_EGRESO } = formData;
        let updates = {};
        let shouldUpdate = false;

        // 1. Calcular Puntaje Minedu
        if (REGION_INTERESADA && ANIO_EGRESO) {
            updates.PUNTAJE_MINEDU = getMineduScore(REGION_INTERESADA, ANIO_EGRESO, POSTULA_YEAR);
            shouldUpdate = true;
        }

        // 2. Calcular Tiempo Egreso
        const egresoYear = parseInt(ANIO_EGRESO, 10);
        if (!isNaN(egresoYear)) {
            const tiempo = POSTULA_YEAR - egresoYear;
            const tiempoFinal = tiempo < 0 ? 0 : tiempo;
            updates.TIEMPO_DESDE_EGRESO = tiempoFinal;
            updates.EGRESADO_RECIENTE_BIN = tiempoFinal <= 1 ? 1 : 0;
            shouldUpdate = true;
        }

        if (shouldUpdate) setFormData((prev) => ({ ...prev, ...updates }));
    }, [formData.REGION_INTERESADA, formData.ANIO_EGRESO]);

    // --- HANDLERS ---
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setErrorMsg(null);
        const newValue = type === "checkbox" ? (checked ? 1 : 0) : value;

        setFormData((prev) => {
            const newState = { ...prev, [name]: newValue };
            if (name === "DIFICULTAD_COD") {
                const selectedOption = DIFFICULTY_OPTIONS.find((opt) => opt.value === newValue);
                newState.NIVEL_DIFICULTAD = selectedOption ? selectedOption.difficulty : 3;
            }
            return newState;
        });
    };

    const validateData = (data) => {
        if (!data.EDAD || data.EDAD < 15) return "Edad inválida (min 15).";
        if (!data.REGION_INTERESADA) return "Selecciona la región de egreso.";
        if (!data.ANIO_EGRESO) return "Ingresa el año de egreso.";
        if (!data.PARCIAL_1 || !data.PARCIAL_2) return "Ingresa ambas notas parciales.";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // **********************************************
        // * MODIFICACIÓN CLAVE: MANTENER RESULTADOS *
        // **********************************************
        // Solo limpiamos el mensaje de error, NO la predicción anterior
        setErrorMsg(null); 

        const validationError = validateData(formData);
        if (validationError) { setErrorMsg(validationError); return; }

        setLoading(true);

        const bodyToSend = {
            EDAD: Number(formData.EDAD),
            N_INTENTOS: Number(formData.N_INTENTOS),
            SEXO_COD: Number(formData.SEXO_COD),
            COLEGIO_TIPO_GESTION: Number(formData.COLEGIO_TIPO_GESTION),
            HA_INGRESADO_ANTES: Number(formData.HA_INGRESADO_ANTES),
            CALIF_PROMEDIO_HIST: Number(formData.CALIF_PROMEDIO_HIST),
            PARCIAL_1: Number(formData.PARCIAL_1),
            PARCIAL_2: Number(formData.PARCIAL_2),
            ES_MIGRANTE: Number(formData.ES_MIGRANTE),
            PUNTAJE_MINEDU: parseFloat(formData.PUNTAJE_MINEDU),
            TIEMPO_DESDE_EGRESO: Number(formData.TIEMPO_DESDE_EGRESO),
            EGRESADO_RECIENTE_BIN: Number(formData.EGRESADO_RECIENTE_BIN),
            NIVEL_DIFICULTAD: Number(formData.NIVEL_DIFICULTAD),
            ANIO_POSTULA: POSTULA_YEAR,
            ASISTENCIA: getNumericAssistance(formData.ASISTENCIA_UI),
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/predict`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyToSend),
            });

            if (!res.ok) throw new Error("Error en servidor");
            const json = await await res.json();
            setPrediction(json.prediction);
            setProbability(json.probability);
        } catch (error) {
            console.error("Error:", error);
            setErrorMsg("No se pudo conectar con el servicio de IA.");
            // Solo limpiamos la predicción si hay un error de conexión/servidor.
            setPrediction(null); 
            setProbability(null);
        } finally {
            setLoading(false);
        }
    };

    // --- RENDER ---
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 font-sans">
            <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl border-t-8 border-blue-600">
                <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center flex items-center justify-center gap-3">
                    <FaGraduationCap className="text-blue-600 text-4xl" /> Predicción de Ingreso
                </h1>
                <p className="text-center text-gray-500 mb-8 border-b pb-4">Proceso {POSTULA_YEAR}</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 1. DATOS PERSONALES */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h2 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2"><FaUser /> Datos Personales</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputGroup label="Edad" name="EDAD">
                                <input type="number" name="EDAD" value={formData.EDAD} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
                            </InputGroup>
                            <InputGroup label="Sexo" name="SEXO_COD">
                                <select name="SEXO_COD" value={formData.SEXO_COD} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required>
                                    <option value="">Selecciona</option><option value="0">Masculino</option><option value="1">Femenino</option>
                                </select>
                            </InputGroup>
                            <InputGroup label="Tipo de Colegio" name="COLEGIO_TIPO_GESTION">
                                <select name="COLEGIO_TIPO_GESTION" value={formData.COLEGIO_TIPO_GESTION} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required>
                                    <option value="">Selecciona</option><option value="0">Público</option><option value="1">Privado</option>
                                </select>
                            </InputGroup>
                            <InputGroup label="Nro. Intentos" name="N_INTENTOS">
                                <input type="number" name="N_INTENTOS" min="1" max="10" value={formData.N_INTENTOS} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
                            </InputGroup>
                        </div>
                    </div>

                    {/* 2. AUTOMATIZACIÓN */}
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 relative overflow-hidden">
                        <FaCalendarAlt className="absolute top-4 right-4 text-yellow-200 text-6xl opacity-20" />
                        <h2 className="text-lg font-bold text-yellow-700 mb-4 flex items-center gap-2"><FaSchool /> Antecedentes Escolares</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputGroup label="Año de Egreso" name="ANIO_EGRESO">
                                <input type="number" name="ANIO_EGRESO" min="1980" max={POSTULA_YEAR} value={formData.ANIO_EGRESO} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
                            </InputGroup>
                            <InputGroup label="Región Colegio" name="REGION_INTERESADA">
                                <select name="REGION_INTERESADA" value={formData.REGION_INTERESADA} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required>
                                    <option value="">Selecciona</option>
                                    {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                                    <option value="OTRA">Otra</option>
                                </select>
                            </InputGroup>
                        </div>
                        <div className="mt-4 flex flex-col md:flex-row gap-4">
                            <div className="flex-1 bg-white/60 p-2 rounded border border-yellow-300 text-sm">
                                <span className="font-semibold text-gray-700 block">Puntaje MINEDU:</span>
                                <span className="text-xl font-bold text-yellow-700">{formData.PUNTAJE_MINEDU.toFixed(2)}</span>
                            </div>
                            <div className="flex-1 bg-white/60 p-2 rounded border border-yellow-300 text-sm">
                                <span className="font-semibold text-gray-700 block">Antigüedad:</span>
                                <span className="text-xl font-bold text-yellow-700">{formData.TIEMPO_DESDE_EGRESO} años</span>
                            </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                            <input type="checkbox" name="ES_MIGRANTE" id="ES_MIGRANTE" checked={formData.ES_MIGRANTE === 1} onChange={handleChange} className="w-4 h-4" />
                            <label htmlFor="ES_MIGRANTE" className="text-sm text-gray-700">Es Migrante</label>
                        </div>
                    </div>

                    {/* 3. RENDIMIENTO */}
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <h2 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2"><FaCheckCircle /> Rendimiento CEPRE</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <InputGroup label="Carrera de Interés" name="DIFICULTAD_COD">
                                    <select name="DIFICULTAD_COD" value={formData.DIFICULTAD_COD} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required>
                                        {DIFFICULTY_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                </InputGroup>
                            </div>
                            <InputGroup label="Asistencia" name="ASISTENCIA_UI">
                                <select name="ASISTENCIA_UI" value={formData.ASISTENCIA_UI} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required>
                                    {ASISTENCIA_MAP.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                                </select>
                            </InputGroup>
                            <InputGroup label="Promedio Colegio (0-20)" name="CALIF_PROMEDIO_HIST">
                                <input type="number" step="0.1" name="CALIF_PROMEDIO_HIST" value={formData.CALIF_PROMEDIO_HIST} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
                            </InputGroup>
                            <InputGroup label="¿Ingresó Antes?" name="HA_INGRESADO_ANTES">
                                <select name="HA_INGRESADO_ANTES" value={formData.HA_INGRESADO_ANTES} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required>
                                    <option value="">Selecciona</option><option value="1">Sí</option><option value="0">No</option>
                                </select>
                            </InputGroup>
                            <InputGroup label="Nota Parcial 1" name="PARCIAL_1">
                                <input type="number" step="0.1" max="20" name="PARCIAL_1" value={formData.PARCIAL_1} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded font-bold text-green-800" required />
                            </InputGroup>
                            <InputGroup label="Nota Parcial 2" name="PARCIAL_2">
                                <input type="number" step="0.1" max="20" name="PARCIAL_2" value={formData.PARCIAL_2} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded font-bold text-green-800" required />
                            </InputGroup>
                        </div>
                    </div>

                    {errorMsg && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded flex items-center gap-2">
                            <FaExclamationTriangle /><p>{errorMsg}</p>
                        </div>
                    )}

                    <button type="submit" disabled={loading} className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transition duration-200 ${loading ? "bg-gray-400" : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700"}`}>
                        {loading ? "Procesando..." : "CALCULAR PROBABILIDAD"}
                    </button>
                </form>

                {prediction !== null && (
                    <div className="mt-8 animate-fade-in-up bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
                        <h3 className="text-xl font-bold text-gray-700 mb-2">Dictamen del Modelo</h3>
                        <div className={`inline-block px-8 py-3 rounded-full text-2xl font-extrabold shadow-md mb-4 ${prediction === 1 ? "bg-green-100 text-green-600 border-green-300" : "bg-red-100 text-red-600 border-red-300"}`}>
                            {prediction === 1 ? "✅ INGRESO PROBABLE" : "❌ INGRESO POCO PROBABLE"}
                        </div>
                        {probability !== null && (
                            <div className="flex flex-col items-center">
                                <span className="text-gray-500 text-sm">Certeza:</span>
                                <div className="w-full bg-gray-200 rounded-full h-4 mt-2 max-w-xs overflow-hidden">
                                    <div className={`h-4 rounded-full ${prediction === 1 ? "bg-green-500" : "bg-red-500"}`} style={{ width: `${probability}%` }}></div>
                                </div>
                                <span className="font-bold text-lg mt-1">{probability.toFixed(2)}%</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
import { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    EDAD: "",
    N_INTENTOS: "",
    TIEMPO_DESDE_EGRESO: "",
    CALIF_PROMEDIO_HIST: "",
    HA_INGRESADO_ANTES: 0,
    PUNTAJE_MINEDU: "",
    ES_MIGRANTE: 0,
    NIVEL_DIFICULTAD: "",
    COLEGIO_TIPO_GESTION: "",
    EGRESADO_RECIENTE_BIN: "",
    SEXO_COD: "",
    ANIO_POSTULA: 2025,
    ASISTENCIA: "",
    PARCIAL_1: "",
    PARCIAL_2: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [probability, setProbability] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Convertir valores numéricos
    const bodyToSend = {
      ...formData,
      EDAD: Number(formData.EDAD),
      N_INTENTOS: Number(formData.N_INTENTOS),
      TIEMPO_DESDE_EGRESO: Number(formData.TIEMPO_DESDE_EGRESO),
      CALIF_PROMEDIO_HIST: Number(formData.CALIF_PROMEDIO_HIST),
      PUNTAJE_MINEDU: Number(formData.PUNTAJE_MINEDU),
      NIVEL_DIFICULTAD: Number(formData.NIVEL_DIFICULTAD),
      COLEGIO_TIPO_GESTION: Number(formData.COLEGIO_TIPO_GESTION),
      EGRESADO_RECIENTE_BIN: Number(formData.EGRESADO_RECIENTE_BIN),
      SEXO_COD: Number(formData.SEXO_COD),
      ASISTENCIA: Number(formData.ASISTENCIA),
      PARCIAL_1: Number(formData.PARCIAL_1),
      PARCIAL_2: Number(formData.PARCIAL_2),
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/predict`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyToSend),
        }
      );

      const json = await res.json();
      setPrediction(json.prediction);
      setProbability(json.probability);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🎓 Predicción de Ingreso a la Universidad
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* EDAD */}
          <div>
            <label className="block">Edad</label>
            <input
              type="number"
              name="EDAD"
              value={formData.EDAD}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* SEXO */}
          <div>
            <label className="block">Sexo</label>
            <select
              name="SEXO_COD"
              value={formData.SEXO_COD}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Selecciona</option>
              <option value="0">Masculino</option>
              <option value="1">Femenino</option>
            </select>
          </div>

          {/* N INTENTOS */}
          <div>
            <label className="block">Número de intentos</label>
            <input
              type="number"
              name="N_INTENTOS"
              value={formData.N_INTENTOS}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* TIEMPO DESDE EGRESO */}
          <div>
            <label className="block">Tiempo desde egreso (años)</label>
            <input
              type="number"
              name="TIEMPO_DESDE_EGRESO"
              value={formData.TIEMPO_DESDE_EGRESO}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* PUNTAJE MINEDU */}
          <div>
            <label className="block">Puntaje MINEDU</label>
            <input
              type="number"
              step="0.1"
              name="PUNTAJE_MINEDU"
              value={formData.PUNTAJE_MINEDU}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* ASISTENCIA */}
          <div>
            <label className="block">Asistencia (0 - 1)</label>
            <input
              type="number"
              step="0.01"
              name="ASISTENCIA"
              value={formData.ASISTENCIA}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* PARCIALES */}
          <div>
            <label className="block">Parcial 1</label>
            <input
              type="number"
              step="0.1"
              name="PARCIAL_1"
              value={formData.PARCIAL_1}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block">Parcial 2</label>
            <input
              type="number"
              step="0.1"
              name="PARCIAL_2"
              value={formData.PARCIAL_2}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* TIPO DE COLEGIO */}
          <div>
            <label className="block">Tipo de colegio</label>
            <select
              name="COLEGIO_TIPO_GESTION"
              value={formData.COLEGIO_TIPO_GESTION}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Selecciona</option>
              <option value="0">Público</option>
              <option value="1">Privado</option>
            </select>
          </div>

          {/* MIGRANTE */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="ES_MIGRANTE"
              checked={formData.ES_MIGRANTE === 1}
              onChange={handleChange}
            />
            <label>Es migrante</label>
          </div>

          {/* EGRESADO RECIENTE */}
          <div>
            <label className="block">Egresado reciente</label>
            <select
              name="EGRESADO_RECIENTE_BIN"
              value={formData.EGRESADO_RECIENTE_BIN}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Selecciona</option>
              <option value="1">Sí</option>
              <option value="0">No</option>
            </select>
          </div>

          {/* NIVEL DIFICULTAD */}
          <div>
            <label className="block">Nivel de dificultad</label>
            <input
              type="number"
              name="NIVEL_DIFICULTAD"
              value={formData.NIVEL_DIFICULTAD}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl mt-4"
          >
            {loading ? "Cargando..." : "Predecir"}
          </button>
        </form>

        {prediction !== null && (
          <div className="mt-6 text-center">
            <p className="text-lg">
              Resultado:{" "}
              <span
                className={`font-bold ${
                  prediction === 1 ? "text-green-600" : "text-red-600"
                }`}
              >
                {prediction === 1 ? "INGRESA" : "NO INGRESA"}
              </span>
            </p>

            {probability !== null && (
              <p className="mt-2 text-gray-700">
                Probabilidad: <b>{probability}%</b>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

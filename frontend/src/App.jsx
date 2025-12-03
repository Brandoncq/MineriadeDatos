import { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    edad: "",
    sexo: "",
    tiempo_egreso: "",
    numero_intentos: "",
    puntaje_minedu: "",
    tipo_colegio: "",
    es_migrante: false,
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/predict`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const json = await res.json();
      setPrediction(json.prediction);
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
          <div>
            <label className="block text-gray-700">Edad</label>
            <input
              type="number"
              name="edad"
              value={formData.edad}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Sexo</label>
            <select
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Selecciona</option>
              <option value="1">Masculino</option>
              <option value="2">Femenino</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700">
              Tiempo desde egreso (años)
            </label>
            <input
              type="number"
              name="tiempo_egreso"
              value={formData.tiempo_egreso}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Número de intentos</label>
            <input
              type="number"
              name="numero_intentos"
              value={formData.numero_intentos}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Tipo de colegio</label>
            <select
              name="tipo_colegio"
              value={formData.tipo_colegio}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Selecciona</option>
              <option value="publico">Público</option>
              <option value="privado">Privado</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="es_migrante"
              checked={formData.es_migrante}
              onChange={handleChange}
            />
            <label>Es migrante</label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition mt-4"
          >
            {loading ? "Cargando..." : "Predecir"}
          </button>
        </form>
        {prediction !== null && (
          <div className="text-center my-6">
            <p className="text-lg text-gray-700">
              Resultado:
              <span
                className={`font-bold ml-2 ${
                  prediction === 1 ? "text-green-600" : "text-red-600"
                }`}
              >
                {prediction === 1 ? "INGRESA" : "NO INGRESA"}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

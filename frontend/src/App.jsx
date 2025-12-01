import { useEffect, useState } from "react";

function App() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const data = {
    edad: 25,
    genero: 1,
    departamento: 5,
    provincia: 12,
    distrito: 33,
    tiempo_estudio: 3,
    horas_diarias: 4,
    internet: 1,
    dispositivo: 2,
    situacion_laboral: 0,
    ingresos: 1200,
    gasto_transporte: 150,
    gasto_materiales: 80,
    promedio_colegio: 14,
    puntaje_simulacro: 550,
    numero_intentos: 1,
    motivacion: 3,
    apoyo_familiar: 2,
    estres: 1,
    salud: 1,
    sueño: 6,
    tiempo_preparacion_meses: 5,
  };

  const sendRequest = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/predict`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
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

  useEffect(() => {
    sendRequest();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🎓 Predicción de Ingreso a la Universidad
        </h1>

        {loading && (
          <p className="text-center text-blue-600 font-medium">Cargando...</p>
        )}

        {!loading && prediction !== null && (
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

        <button
          onClick={sendRequest}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition mt-4"
        >
          🔄 Volver a predecir
        </button>
      </div>
    </div>
  );
}

export default App;

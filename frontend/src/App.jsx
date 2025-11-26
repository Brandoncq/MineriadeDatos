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

      const res = await fetch("http://64.225.126.210:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      setPrediction(json.prediction);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ▶️ Ejecutar una vez cuando carga la página
  useEffect(() => {
    sendRequest();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Predicción del Modelo</h1>

      {loading && <p>Cargando...</p>}

      {!loading && prediction !== null && (
        <p>
          Resultado: <strong>{prediction}</strong>
        </p>
      )}

      <button onClick={sendRequest} style={{ marginTop: 20 }}>
        Volver a predecir
      </button>
    </div>
  );
}

export default App;

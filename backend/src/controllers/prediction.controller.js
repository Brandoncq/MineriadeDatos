import { sendPrediction } from "../services/prediction.service.js";

export const predictIngreso = async (req, res) => {
  try {
    const result = await sendPrediction(req.body);
    return res.json(result);
  } catch (error) {
    // 🔍 ESTO ES VITAL PARA DEPURAR
    console.error("❌ ERROR EN EL BACKEND:");
    if (error.response) {
        // Python respondió con error (ej. 422 o 500)
        console.error(">> Python dice:", error.response.data);
        console.error(">> Status:", error.response.status);
    } else if (error.request) {
        // Python no respondió (está apagado o puerto incorrecto)
        console.error(">> No hubo respuesta de Python (¿Está corriendo en el puerto 5000?)");
    } else {
        console.error(">> Error de configuración:", error.message);
    }

    return res.status(500).json({ error: "Error al procesar predicción. Revisa la terminal del backend." });
  }
};
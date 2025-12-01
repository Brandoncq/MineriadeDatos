import { sendPrediction } from "../services/prediction.service.js";

export const predictIngreso = async (req, res) => {
  try {
    const result = await sendPrediction(req.body);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: "Error al procesar predicción." });
  }
};

import axios from "axios";
import { MODEL_URL } from "../config/env.js";

export const sendPrediction = async (data) => {
  const response = await axios.post(`${MODEL_URL}/predict`, data);
  return response.data;
};

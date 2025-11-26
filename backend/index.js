const express = require("express");
const app = express();

app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

// Ejemplo para llamar al modelo
app.post("/predict", async (req, res) => {
  try {
    const response = await fetch("http://model:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error llamando al modelo" });
  }
});

app.listen(3000, () => {
  console.log("Servidor Node corriendo en puerto 3000");
});

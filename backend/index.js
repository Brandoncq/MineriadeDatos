import app from "./src/app.js";
import { FRONTEND_URL } from "./src/config/env.js";

app.listen(3000, () => {
  console.log("Backend Node escuchando en http://localhost:3000", FRONTEND_URL);
});

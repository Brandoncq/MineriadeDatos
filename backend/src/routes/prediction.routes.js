import { Router } from "express";
import { predictIngreso } from "../controllers/prediction.controller.js";

const router = Router();

router.post("/", predictIngreso);

export default router;

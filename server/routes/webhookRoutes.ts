import { Router } from "express";
import { webhook } from "../controllers/webhookController.js";

const router = Router();

router.post('/', webhook);

export default router;
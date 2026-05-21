import { Router } from "express";
import { getAllPayments } from "../controllers/paymentsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get('/', protect, getAllPayments);

export default router;
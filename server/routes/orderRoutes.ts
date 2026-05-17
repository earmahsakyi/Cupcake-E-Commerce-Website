import { Router } from "express";
import { createOrder, getAllOrders, getOrderById } from "../controllers/orderController.js";
import { validateBody } from "../middleware/validate.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post(
    '/',
    validateBody(['customer_name', 'customer_phone', 'delivery_address', 'momo_network', 'items']),
    createOrder
    );

router.get('/', protect, getAllOrders);
router.get('/:id', getOrderById);

export default router;
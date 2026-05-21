import { Router } from "express";
import { sendSms, getSmsLogs } from "../controllers/smsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();

router.post('/send',validateBody(['order_id','phone','message','trigger_type']), protect, sendSms);
router.get('/', protect, getSmsLogs);

export default router;

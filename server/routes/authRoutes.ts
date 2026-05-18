import { Router } from "express";
import { registerUser,getLoginUser,resetPassword,requestOTP,unlockUser,forgotPassword,loginUser,logout } 
from "../controllers/authController.js";
import { validateBody } from "../middleware/validate.js";
import { protect } from "../middleware/authMiddleware.js";
import { checkKey } from "../middleware/checkSecretKey.js";
import { getClientIp } from "../middleware/getClientIp.js";
import { authLimiter, passwordResetLimiter } from "../middleware/rateLimiter.js";


const router = Router();
router.use(getClientIp);

router.post('/register', authLimiter, checkKey, validateBody(['name', 'email', 'password', 'secretKey']),registerUser);
router.post('/login', authLimiter, validateBody(['email', 'password']), loginUser);
router.post('/logout',logout);
router.get('/me', protect, getLoginUser);
router.post('/forgot-password', passwordResetLimiter, validateBody(['email']), forgotPassword);
router.post('/reset-password', passwordResetLimiter, validateBody(['email', 'token', 'newPassword']), resetPassword);
router.post('/request-otp', passwordResetLimiter, validateBody(['email']), requestOTP);
router.post('/unlock', passwordResetLimiter, checkKey, validateBody(['email', 'OTP', 'secretKey']), unlockUser);

export default router;
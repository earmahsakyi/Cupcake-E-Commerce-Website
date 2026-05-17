import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

// Helper function
const getRetryAfter = (req: Request) => {
  if (!req.rateLimit?.resetTime) return null;

  return Math.ceil(
    (req.rateLimit.resetTime.getTime() - Date.now()) / 1000
  );
};

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      msg: "Too many requests, please try again later.",
      retryAfter: getRetryAfter(req),
    });
  },
});

// Auth limiter
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,

  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      msg: "Too many login attempts. Please try again after 1 hour.",
      retryAfter: getRetryAfter(req),
    });
  },
});

// Password reset limiter
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      msg: "Too many password reset attempts. Please try again later.",
      retryAfter: getRetryAfter(req),
    });
  },
});

// Send message limiter
export const sendMessageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      msg: "Too many message attempts. Please try again later.",
      retryAfter: getRetryAfter(req),
    });
  },
});
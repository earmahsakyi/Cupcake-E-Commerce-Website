import { Response, Request, NextFunction } from "express";

export const getClientIp = (req: Request, res: Response, next: NextFunction) => {

    let ip: string  = 
    req.headers['cf-connecting-ip'] as string || // Cloudflare
    req.headers['x-real-ip'] as string || // Nginx proxy
    (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim()  || // Standard proxy
    req.socket?.remoteAddress ||
    'unknown';

      // Clean IPv6 localhost to IPv4
  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    ip = '127.0.0.1';
  }

  // Remove IPv6 prefix if present
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }

  req.clientIp  = ip;

  next();

}
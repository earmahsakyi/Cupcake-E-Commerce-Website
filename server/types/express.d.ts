declare namespace Express {
    interface Request {
        clientIp?: string;
        rateLimit?: {
            limit: number;
            remaining: number;
            resetTime?: Date;
        };
    }
}
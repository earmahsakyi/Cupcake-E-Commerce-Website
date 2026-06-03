import crypto from 'crypto';

export const generateOrderReference = (): string => {
    const date = new Date();
    const datePart = date.getFullYear().toString() +
                        String(date.getMonth() + 1).padStart(2,'0') +
                        String(date.getDate()).padStart(2,'0');

    const randomPart = Math.random().toString(36).substring(2,5).toUpperCase();
    return `CK-${datePart}-${randomPart}`;
};

export const pesewasToCedis = (pesewa: number):string => {

    return `GH₵ ${(pesewa / 100).toFixed(2)}`;
};

export const generateResetToken = async () => {
    const resetToken = crypto.randomBytes(3).toString('hex').toUpperCase();
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    return { resetToken, hashedToken}
} ;

export const normalisePhone = (phone: string): string => {
    const digits = phone.replace(/\D/g, ''); // strip +, spaces, dashes

    if (digits.startsWith('233')) {
        const local = digits.slice(3); // everything after 233
        // handles 2330XXXXXXXXX (user accidentally included the 0)
        if (local.startsWith('0')) {
            return local;
        }
        return '0' + local; 
    }

    return digits;
};

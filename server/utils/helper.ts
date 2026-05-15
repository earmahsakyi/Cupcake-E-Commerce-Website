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
export const sendOrderConfirmationSMS = 
async(phone: string,totalPesewas: number, customerName: string, reference: string)
: Promise<void> => {
    const formatted = '233' + phone.substring(1);
    const message = `Hi ${customerName}, your CupOcake order ${reference} has been confirmed! Total: GHS ${(totalPesewas / 100).toFixed(2)}. We'll notify you when it's on the way.`;

    const url = 'https://sms.arkesel.com/api/v2/sms/send';
    const content = {
        sender: process.env.ARKESEL_SENDER_ID,
        message: message,
        recipients: [formatted]

    }

    const response = await fetch(url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': String(process.env.ARKESEL_API_KEY)
            },
            body: JSON.stringify(content)
        }
    );

    const data: any =await  response.json();
    
    if(data.status !== 'success'){
        console.error('Failed to send SMS');
        return;
    }

    console.log('SMS sent successfully...')
    
}
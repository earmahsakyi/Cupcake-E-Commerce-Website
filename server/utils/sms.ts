export const sendOrderConfirmationSMS = async (
  phone: string,
  totalPesewas: number,
  customerName: string,
  reference: string
): Promise<void> => {
  try {
    const cleaned = phone.replace(/[\s\-\+]/g, '');
    const formatted = cleaned.startsWith('0')
      ? '233' + cleaned.substring(1)
      : cleaned.startsWith('233')
      ? cleaned
      : '233' + cleaned;

      console.log('Sending SMS to:', formatted); 

    const message = `Hi ${customerName}, your CupOcake order ${reference} has been confirmed! Total: GHS ${(totalPesewas / 100).toFixed(2)}. We'll notify you when it's on the way.`;

    const response = await fetch('https://sms.arkesel.com/api/v2/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': String(process.env.ARKESEL_API_KEY),
      },
      body: JSON.stringify({
        sender: process.env.ARKESEL_SENDER_ID,
        message,
        recipients: [formatted],
      }),
    });

    const data: any = await response.json();

    if (data.status !== 'success') {
      console.error('Failed to send SMS. Response:', JSON.stringify(data));
      return;
    }

    console.log('SMS sent successfully...');
  } catch (err) {
    // Log but don't throw — a failed SMS should never break the order
    console.error('SMS send error:', err);
  }
};

export const sendRawSMS = async (phone: string, message: string): Promise<void> => {
    try {
        // ✅ Strip spaces, dashes, plus signs first
        const cleaned = phone.replace(/[\s\-\+]/g, '');

        const formatted = cleaned.startsWith('0')
            ? '233' + cleaned.substring(1)
            : cleaned.startsWith('233')
            ? cleaned
            : '233' + cleaned;

        console.log('Sending SMS to:', formatted); 

        const response = await fetch('https://sms.arkesel.com/api/v2/sms/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': String(process.env.ARKESEL_API_KEY),
            },
            body: JSON.stringify({
                sender: process.env.ARKESEL_SENDER_ID,
                message,
                recipients: [formatted],
            }),
        });

        const data: any = await response.json();
        if (data.status !== 'success') {
            console.error('Failed to send SMS:', JSON.stringify(data));
        }
    } catch (err) {
        console.error('SMS send error:', err);
    }
};
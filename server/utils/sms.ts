export const sendOrderConfirmationSMS = async (
  phone: string,
  totalPesewas: number,
  customerName: string,
  reference: string
): Promise<void> => {
  try {
    const formatted = phone.startsWith('0')
      ? '233' + phone.substring(1)
      : phone.startsWith('233')
      ? phone
      : '233' + phone;

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
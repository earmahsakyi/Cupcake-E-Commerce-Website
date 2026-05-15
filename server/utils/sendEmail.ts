import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
}



export const sendEmail = async ({ to, subject, html}: SendEmailProps) => {
  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM as string,
      to,
      subject,
      html,
    });

    return data;
  } catch (error) {
    console.error(" Resend Email Error:", error);
    throw error;
  }
};

export default  sendEmail;

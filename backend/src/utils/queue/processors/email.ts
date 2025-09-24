import { Job } from 'bullmq';
import { sendEmail } from '../../email/resend';

interface EmailJobData {
  to: string;
  subject: string;
  html: string;
}

export const emailProcessor = async (job: Job<EmailJobData>) => {
  const { to, subject, html } = job.data;

  try {
    console.log(`📧 Processing email job ${job.id}: ${subject} to ${to}`);

    await sendEmail(to, subject, html);

    console.log(`✅ Email sent successfully: ${job.id}`);
    return { success: true, messageId: `email_${job.id}` };
  } catch (error) {
    console.error(`❌ Failed to send email ${job.id}:`, error);
    throw error;
  }
};

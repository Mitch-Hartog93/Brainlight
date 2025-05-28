import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, message, deviceInfo } = body;

    // Validate required fields
    if (!subject || !message) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Send email using Supabase Edge Function
    const { error } = await supabase.functions.invoke('send-email', {
      body: {
        to: 'mhartog.93@gmail.com',
        subject: `Brainlight Support: ${subject}`,
        message: `
Message: ${message}

Device Information:
${deviceInfo}
        `,
      },
    });

    if (error) {
      console.error('Error sending email:', error);
      return new Response('Failed to send message', { status: 500 });
    }

    return new Response('Message sent successfully', { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
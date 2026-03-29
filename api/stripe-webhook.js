import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const event = req.body;

  console.log('Stripe event received:', event.type);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_details?.email;

    console.log('Payment successful for:', email);

    const token = Math.random().toString(36).substring(2, 10);

    const { error } = await supabase.from('tokens').insert([
      {
        token,
        email,
        used: false
      }
    ]);

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save token' });
    }

    console.log('Token saved:', token);

    const tallyLink = `https://tally.so/r/xXQae5?token=${token}`;

    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: 'Sexual Wellbeing Report',
          email: 'info@centrersw.com'
        },
        to: [
          { email }
        ],
        subject: 'Complete your sexual wellbeing assessment',
        htmlContent: `
          <p>Thank you for your purchase.</p>
          <p>Please complete your assessment using the link below:</p>
          <p><a href="${tallyLink}">Start your assessment</a></p>
        `
      })
    });

    const brevoData = await brevoResponse.json();
    console.log('Brevo response:', brevoData);
  }

  return res.status(200).json({ received: true });
}

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

  if (session.metadata?.product !== 'sexual_wellbeing_report') {
    console.log('Ignoring unrelated payment');
    return res.status(200).json({ ignored: true });
  }

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
        subject: 'Your Sexual Wellbeing Assessment — next steps',
htmlContent: `
  
  <p>Thank you for taking this step toward understanding your sexual wellbeing.</p>
  <p>Your assessment is ready to complete. This is quite a comprehensive report and can take around 30 - 45 minutes to complete, so please make sure you have set some time aside before starting.</p>
  <p><a href="${tallyLink}">Begin your assessment</a></p>
  <p>Once you've finished, your personalised report will be sent to the email address provided.</p>
  <p>If you have any questions in the meantime, feel free to reach out at <a href="mailto:info@centrersw.com">info@centrersw.com</a></p>
  <p>Warm regards,<br>The Centre for Relational and Sexual Wellbeing Team</p>
`
      })
    });

    const brevoData = await brevoResponse.json();
    console.log('Brevo response:', brevoData);
  }

  return res.status(200).json({ received: true });
}

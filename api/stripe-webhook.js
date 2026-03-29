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

    const tallyLink = 'https://tally.so/r/xXQae5';

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

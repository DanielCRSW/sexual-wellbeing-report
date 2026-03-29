export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const event = req.body;

  // For now, just log it
  console.log('Stripe event received:', event.type);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const email = session.customer_details?.email;

    console.log('Payment successful for:', email);

    // Next step: send Tally link via Brevo
  }

  res.status(200).json({ received: true });
}

export const runtime = 'edge';

export async function POST(req: Request) {
  const STRIPE_SK = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SK) {
    return new Response(JSON.stringify({ error: 'Payment not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  const { origin } = new URL(req.url);

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(STRIPE_SK + ':')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'mode': 'payment',
      'line_items[0][price]': process.env.STRIPE_PRO_PRICE_ID || '',
      'line_items[0][quantity]': '1',
      'success_url': `${origin}?session_id={CHECKOUT_SESSION_ID}`,
      'cancel_url': origin,
    }).toString(),
  });

  const session = await res.json();
  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'Checkout failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify({ url: session.url }), { headers: { 'Content-Type': 'application/json' } });
}

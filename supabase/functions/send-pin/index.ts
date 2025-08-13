import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { email, pin } = await req.json();

  if (!email || !pin) {
    return new Response(JSON.stringify({ error: "Missing email or pin" }), { status: 400 });
  }

  // Send email using Supabase SMTP (configured in your project)
  const { data, error } = await fetch('https://api.supabase.io/v1/mailer/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''}`,
    },
    body: JSON.stringify({
      to: email,
      subject: 'Your Admin Login PIN',
      html: `<p>Your 6-digit admin login PIN is: <b>${pin}</b></p>`,
    }),
  }).then(res => res.json());

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
export async function onRequestPost(context) {
  try {
    // Captura os dados enviados pelo formulário
    const formData = await context.request.formData();
    const nome = formData.get('nome');
    const email = formData.get('_replyto'); // Usando o name definido no seu HTML
    const telefone = formData.get('telefone');
    const assunto = formData.get('assunto');
    const mensagem = formData.get('mensagem');
    const honeypot = formData.get('_gotcha');

    // Validação básica anti-spam (Honeypot)
    if (honeypot) {
      return new Response(JSON.stringify({ error: 'Spam detectado' }), { status: 400 });
    }

    // Requisição para a API do Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Contato Site <onboarding@resend.dev>', // No modo gratuito do Resend, você deve usar este remetente
        to: 'salutempsiplural@gmail.com', // O e-mail de destino do Instituto Salutem
        subject: `Novo contato pelo site: ${assunto}`,
        html: `
          <h2>Novo Contato via Site</h2>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Telefone:</strong> ${telefone || 'Não informado'}</p>
          <p><strong>Assunto:</strong> ${assunto}</p>
          <p><strong>Mensagem:</strong><br>${mensagem.replace(/\n/g, '<br>')}</p>
        `
      })
    });

    if (res.ok) {
      // Resposta de sucesso para o seu main.js capturar
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      const errorData = await res.json();
      return new Response(JSON.stringify({ error: errorData.message }), { status: 500 });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
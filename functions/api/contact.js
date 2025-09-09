export async function onRequestPost(context) {
  console.log('Contact form request received');
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle OPTIONS request for CORS
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    // Parse request body
    const body = await context.request.json();
    const {
      name,
      email,
      message
    } = body;

    // Validate input
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({
          error: '必須項目が入力されていません'
        }), {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Get API key from environment variable
    const RESEND_API_KEY = context.env.RESEND_API_KEY;
    console.log('RESEND_API_KEY exists:', !!RESEND_API_KEY);
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return new Response(
        JSON.stringify({
          error: 'サーバー設定エラー'
        }), {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Send email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@sendmail-hp.com', // Resendに登録したドメインのメールアドレス
        to: 'donot.say.lazy@gmail.com',
        subject: '【あいんぐらんぷ】お問い合わせ',
        reply_to: email,
        html: `
          <h2>お問い合わせを受信しました</h2>
          <p><strong>お名前:</strong> ${name}</p>
          <p><strong>メールアドレス:</strong> ${email}</p>
          <p><strong>メッセージ:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            このメールは「あいんぐらんぷ」のお問い合わせフォームから送信されました。
          </p>
        `,
        text: `
お問い合わせを受信しました

お名前: ${name}
メールアドレス: ${email}
メッセージ:
${message}

---
このメールは「あいんぐらんぷ」のお問い合わせフォームから送信されました。
        `,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('Resend API error:', resendData);
      return new Response(
        JSON.stringify({
          error: 'メール送信に失敗しました'
        }), {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'お問い合わせありがとうございます。確認次第ご連絡いたします。'
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({
        error: 'サーバーエラーが発生しました'
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

// Handle OPTIONS request for CORS preflight
export async function onRequestOptions(context) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
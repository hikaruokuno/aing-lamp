export async function onRequestPost(context) {
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
      phone,
      subject,
      message,
      website // ハニーポットフィールド
    } = body;

    // ハニーポットチェック（ボットはこのフィールドに入力してしまう）
    if (website) {
      console.log('Spam detected: honeypot field filled');
      return new Response(
        JSON.stringify({ success: true, message: 'お問い合わせありがとうございます。' }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

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
          <p><strong>電話番号:</strong> ${phone || 'なし'}</p>
          <p><strong>お問い合わせ種別:</strong> ${subject}</p>
          <p><strong>お問い合わせ内容:</strong></p>
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
電話番号: ${phone || 'なし'}
お問い合わせ種別: ${subject}
お問い合わせ内容:
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

    // お問い合わせ者への自動返信メール送信
    const autoReplyResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@sendmail-hp.com',
        to: email,
        subject: '【あいんぐらんぷ】お問い合わせありがとうございます',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #b91c1c;">お問い合わせありがとうございます</h2>
            <p>${name} 様</p>
            <p>
              この度は「あいんぐらんぷ」にお問い合わせいただき、誠にありがとうございます。<br>
              以下の内容でお問い合わせを承りました。
            </p>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>お名前:</strong> ${name}</p>
              <p><strong>メールアドレス:</strong> ${email}</p>
              <p><strong>電話番号:</strong> ${phone || 'なし'}</p>
              <p><strong>お問い合わせ種別:</strong> ${subject}</p>
              <p><strong>お問い合わせ内容:</strong></p>
              <p style="white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            <p>
              内容を確認の上、担当者より改めてご連絡させていただきます。<br>
              今しばらくお待ちくださいませ。
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 12px;">
              ※このメールは自動送信されています。<br>
              ※このメールに返信いただいても、お返事できませんのでご了承ください。
            </p>
            <p style="color: #6b7280; font-size: 12px;">
              あいんぐらんぷ<br>
              〒525-0054 滋賀県草津市東矢倉２丁目２０－２５<br>
              TEL: 090-9540-9004
            </p>
          </div>
        `,
        text: `
${name} 様

この度は「あいんぐらんぷ」にお問い合わせいただき、誠にありがとうございます。
以下の内容でお問い合わせを承りました。

------------------
お名前: ${name}
メールアドレス: ${email}
電話番号: ${phone || 'なし'}
お問い合わせ種別: ${subject}
お問い合わせ内容:
${message}
------------------

内容を確認の上、担当者より改めてご連絡させていただきます。
今しばらくお待ちくださいませ。

※このメールは自動送信されています。
※このメールに返信いただいても、お返事できませんのでご了承ください。

あいんぐらんぷ
〒525-0054 滋賀県草津市東矢倉２丁目２０－２５
TEL: 090-9540-9004
        `,
      }),
    });

    const autoReplyData = await autoReplyResponse.json();
    
    if (!autoReplyResponse.ok) {
      console.error('Auto-reply email failed:', autoReplyData);
      // 自動返信が失敗しても、管理者へのメールは送信済みなので成功として扱う
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
# メール送信機能のセットアップ手順

## 複数サイト運用の推奨構成

### 送信専用ドメインの活用
複数のWebサイトでメール送信機能を使う場合、以下の構成を推奨します：

1. **送信専用ドメインを1つ用意**
   - 例: `mail-sender.com`、`notify-system.com` など
   - このドメインのメールアドレスをResendに登録
   - 全サイトの送信処理をこのドメインから行う

2. **メール設定の工夫**
   ```javascript
   // 送信元は統一ドメイン
   from: 'noreply@your-sender.com'
   
   // 件名でサイトを識別
   subject: '【あいんぐらんぷ】お問い合わせ'
   
   // Reply-toで実際の返信先を指定
   reply_to: 'conomi.office.20@gmail.com'
   ```

3. **メリット**
   - Resend無料プラン（月3,000通）で複数サイト対応可能
   - ドメイン認証が1回で済む
   - 管理が一元化される
   - コストを最小限に抑えられる

## 1. Resendアカウントの設定

1. [Resend](https://resend.com)にアクセスしてアカウント作成
2. ダッシュボードから「API Keys」セクションへ移動
3. 「Create API Key」をクリックして新しいAPIキーを生成
4. APIキーをコピーして安全な場所に保存
5. 「Domains」セクションで送信専用ドメインを追加・認証

## 2. Cloudflare Workersの環境変数設定

1. [Cloudflare Dashboard](https://dash.cloudflare.com)にログイン
2. 「Workers & Pages」セクションへ移動
3. 「aing-lamp-contact」Workerを選択（初回デプロイ後）
4. 「Settings」→「Variables」タブを開く
5. 「Add variable」をクリック
6. 以下を設定：
   - Variable name: `RESEND_API_KEY`
   - Value: Resendで生成したAPIキー
7. 「Save and deploy」をクリック

## 3. Workersのデプロイ

```bash
# workers/contact-formディレクトリに移動
cd workers/contact-form

# 依存関係をインストール
npm install

# Cloudflareにログイン（初回のみ）
npx wrangler login

# Workerをデプロイ
npm run deploy
```

デプロイ後、表示されるWorkerのURLをコピー（例: https://aing-lamp-contact.your-subdomain.workers.dev）

## 4. フロントエンドの更新

script.jsファイルの159行目付近にあるWorkerのURLを更新してください。

## 5. Cloudflare Pagesへのデプロイ

変更をコミットしてプッシュすると、Cloudflare Pagesが自動的に更新されます。

## 6. テスト

1. ウェブサイトのお問い合わせフォームから送信テスト
2. conomi.office.20@gmail.com にメールが届くことを確認

## トラブルシューティング

- メールが届かない場合：
  1. Cloudflare DashboardでWorkerのログを確認
  2. ResendダッシュボードでAPI呼び出しの状態を確認
  3. 環境変数が正しく設定されているか確認

- CORSエラーが出る場合：
  1. WorkerのURLが正しいか確認
  2. httpsで始まるURLを使用しているか確認
# あいんぐらんぷ Webサイト

## 概要
「あいんぐらんぷ」は、手作りキャンドル・アルコールランプの販売と体験ができる、福祉と音楽と癒しの融合施設のWebサイトです。

## 技術スタック
- HTML5
- Tailwind CSS (CDN版)
- Vanilla JavaScript
- Font Awesome (アイコン)

## ファイル構成
```
aing-lamp/
├── index.html           # メインHTMLファイル
├── script.js           # JavaScriptファイル
├── implementation-plan.md # 実装計画書
├── CLAUDE.md           # Claude Code用ガイド
└── README.md           # このファイル
```

## 機能
- レスポンシブデザイン
- ハンバーガーメニュー（モバイル対応）
- スムーズスクロール
- スクロール時のヘッダー背景変更
- ギャラリーライトボックス
- フェードインアニメーション
- お問い合わせフォーム（※メール送信機能は今後実装予定）

## セクション構成
1. ヘッダー（固定ナビゲーション）
2. ヒーローセクション（メインビジュアル）
3. 私たちについて（事業紹介・6つの特徴）
4. ギャラリー
5. 体験ツアー詳細
6. ひだまりサロン（福祉事業所）
7. フッター（アクセス・SNSリンク）

## 開発環境での確認方法
1. `index.html`をブラウザで直接開く
2. または、簡易サーバーを使用：
   ```bash
   # Python 3の場合
   python -m http.server 8000
   
   # Node.jsのhttp-serverを使用する場合
   npx http-server
   ```

## デプロイ方法（Cloudflare Pages）
1. GitHubリポジトリにプッシュ
2. Cloudflare Pagesでプロジェクトを作成
3. GitHubリポジトリと連携
4. 自動デプロイ設定

## 今後の作業
- お問い合わせフォームのメール送信機能（Cloudflare Workers実装予定）
- 実際の画像の追加
- Google Maps埋め込み
- SEO最適化（メタタグの追加）
- アクセシビリティの向上

## メール送信機能の実装予定
Cloudflare Pagesでの運用のため、以下の方法で実装予定：
- Cloudflare Workers + Resend/SendGrid API
- または外部フォームサービス（Formspree等）の利用
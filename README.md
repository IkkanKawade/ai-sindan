# AI活用ニーズ調査システム

企業のAI活用課題をヒアリングし、AIが自動で最適な業務効率化提案を生成するWebアプリケーションです。

## 主な機能

### 1. アンケートフォーム
- 業種・従業員規模・課題ジャンルの入力
- 具体的な業務フローのヒアリング
- 予算・導入時期の確認
- 担当者情報の収集

### 2. AI分析・提案生成
- OpenAI GPT-4による課題分析
- 業務効率化の方向性提示
- 時間削減効果の試算
- 推奨ツール・実装方法の提案

### 3. 提案資料の自動生成
- 課題→解決案→開発スコープの構成
- PDF形式での提案書出力
- サービスメニューとの連動

### 4. 営業支援機能
- Slack/メール通知
- CRM連携（Salesforce、HubSpot対応）
- 顧客への自動返信メール

## 技術構成

- **フロントエンド**: Next.js 14, React, TypeScript, Tailwind CSS
- **バックエンド**: Next.js API Routes
- **AI**: OpenAI GPT-4
- **PDF生成**: @react-pdf/renderer
- **メール送信**: Nodemailer
- **フォーム管理**: React Hook Form
- **バリデーション**: Zod

## セットアップ

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
`.env.example`を`.env.local`にコピーして、必要な値を設定してください：

```bash
cp .env.example .env.local
```

主要な設定項目：
- `OPENAI_API_KEY`: OpenAI APIキー
- `SMTP_*`: メール送信設定
- `SLACK_WEBHOOK_URL`: Slack通知用Webhook URL

### 3. 開発サーバーの起動
```bash
npm run dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

## 使用方法

### お客様側の流れ
1. アンケートフォームに企業情報・課題を入力
2. AIによる自動分析を実行
3. 提案結果をオンラインで確認
4. PDF形式での提案書ダウンロード

### 営業担当者側の流れ
1. Slack/メールで新規調査完了の通知を受信
2. CRMに自動でリード情報が追加
3. 提案内容を確認して顧客フォロー

## 開発・カスタマイズ

### ファイル構成
```
src/
├── app/
│   ├── api/
│   │   ├── analyze/          # AI分析API
│   │   └── generate-pdf/     # PDF生成API
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── SurveyForm.tsx        # アンケートフォーム
│   └── ProposalResults.tsx   # 提案結果表示
├── lib/
│   └── notifications.ts      # 通知・CRM連携
└── types/
    └── index.ts              # TypeScript型定義
```

### AI提案のカスタマイズ
`src/app/api/analyze/route.ts`でプロンプトや分析ロジックを調整できます。

### UI/UXのカスタマイズ
Tailwind CSSを使用しているため、`src/components/`内のコンポーネントで簡単にスタイリングを変更できます。

### 通知システムの拡張
`src/lib/notifications.ts`で以下の機能を追加・カスタマイズできます：
- 異なるCRMシステムとの連携
- チャットツール（Teams、Discord等）への通知
- カスタムメールテンプレート

## 本番環境での運用

### 必要な外部サービス
1. **OpenAI API**: AI分析機能に必須
2. **SMTP サーバー**: メール通知用（Gmail、SendGrid等）
3. **Slack**: 営業チーム通知用（オプション）
4. **CRM**: リード管理用（オプション）

### セキュリティ考慮事項
- 顧客情報の適切な暗号化
- APIキーの安全な管理
- HTTPS通信の必須化
- 定期的なセキュリティ監査

### パフォーマンス最適化
- 画像・静的ファイルのCDN配信
- データベースクエリの最適化
- キャッシュ戦略の実装

## ライセンス

MIT License

## サポート

技術的な質問やサポートが必要な場合は、開発チームまでお問い合わせください。
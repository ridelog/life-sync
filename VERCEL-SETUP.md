# GitHub → Vercel 自動公開

GitHubの新しい非公開リポジトリ `life-sync` にこのディレクトリの内容を保存してください。
`node_modules`, `.next`, `dist`, `.env`, `.git`, 実ユーザーの添付/データは送信しません。

1. Vercelにログインして「Add New → Project」。
2. GitHub連携で `life-sync` へのアクセスを許可し、Import。
3. Framework Preset: Next.js。Root Directory: リポジトリのルート。
4. Install Command: `pnpm install --frozen-lockfile`。Build Command: `pnpm build`。Node.js: 22.x。
5. Supabase未接続なら環境変数なしで体験モードを公開できる。
6. 本番保存を使うときは `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` をVercelのEnvironment Variablesに設定し再デプロイ。秘密のservice_roleキーを入れない。
7. Production Branchを `main` にする。その後mainへのpushで自動公開される。他ブランチ/PRはプレビュー。

注意：GitHubの非公開設定と、Vercelの公開URLの閲覧制限は別です。現在の体験モードにはサンプルのみが含まれます。ユーザーの記録はSupabase認証とRLSで隔離する設計です。公開URLにアクセス制限が必要な場合はVercelのDeployment Protectionを設定してください。料金と利用条件は契約するプランで確認してください。

設定参考： https://vercel.com/docs/git/vercel-for-github

現在の状態：Next.jsの本番ビルド成功。GitHub保存とVercel公開はアカウント連携待ちで未実行です。Sitesは未公開で、Vercel用の設定に切り替えています。`.openai` のSites用設定はVercelでは使用しません。

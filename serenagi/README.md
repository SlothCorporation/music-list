# せれなぎ Song List

VTuber「せれなぎ」さんの歌枠で歌った曲を閲覧・検索できるアプリ。
GitHub Pages（静的ホスティング）+ Supabase。スマホ表示前提のUI。

## 機能（第1フェーズ）

- **歌枠**: 歌枠ごとに歌った曲（曲名 / 作者・Vo. / URL）を一覧
- **曲一覧**: 歌える曲を重複なし（distinct）で一覧
- **検索**: 曲名 / 作者・Vo. で検索
- **管理**: ログインして歌枠・曲を登録/削除（要 Supabase 認証）

> リクエスト機能（ステータス管理含む）は第2フェーズで追加予定。

## セットアップ

### 1. Supabase

1. [Supabase](https://supabase.com) でプロジェクトを作成
2. SQL Editor で `supabase/schema.sql` を実行（テーブル + RLS を作成）
3. Authentication > Users から管理者ユーザーを1人追加
   （Providers > Email の "Allow new users to sign up" はオフ推奨）
4. Project Settings > API から `URL` と `anon public` キーを控える

### 2. ローカル開発

```bash
cp .env.example .env.local   # URL と anon キーを記入
npm install
npm run dev
```

### 3. GitHub Pages へ公開

公開は `music-list` リポジトリ全体でまとめて行う（このディレクトリ単体ではない）。
公開URL: `https://slothcorporation.github.io/music-list/serenagi/`

- デプロイ設定・Secrets 登録・人の追加手順は **リポジトリ root の README** を参照
- このアプリのサブパスは `vite.config.js` の `base`（`/music-list/serenagi/`）で決まる

> anon キーはフロントに埋め込まれ公開されるが、RLS により書き込みは
> ログイン済みユーザーのみに制限されるため安全。

## データ構成

| テーブル | 役割 |
|---|---|
| `streams` | 歌枠（タイトル / URL / 配信日） |
| `songs` | 曲マスタ（曲名 / 作者・Vo.）= distinct の元 |
| `performances` | 歌枠×曲（どの枠で歌ったか + タイムスタンプURL） |

## 技術スタック

Vite + React / React Router (HashRouter) / Supabase

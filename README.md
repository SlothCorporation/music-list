# music-list

VTuber ごとの「歌える曲リスト」を、それぞれ独立したページとして公開するリポジトリ。
各アーティストはサブディレクトリ＝独立アプリとして同居する（root に振り分けページは置かない）。

```
music-list/
├── serenagi/      … せれなぎ さんのアプリ（Vite + React + Supabase）
│   └── …
├── .github/workflows/deploy.yml   … 全アプリをまとめてビルド & デプロイ
└── （今後: 別の人を足すなら新しいディレクトリを追加）
```

## 公開URL

| 人 | URL |
|---|---|
| serenagi | `https://slothcorporation.github.io/music-list/serenagi/` |

root（`/music-list/`）には index を置かないため 404 になる（意図的）。
各人へは直接サブパスのURLでアクセスする。

## 新しい人を追加する手順

1. `serenagi/` をコピーして新ディレクトリを作る（例: `newvtuber/`）
2. そのディレクトリの `vite.config.js` の `base` を `/music-list/newvtuber/` に変更
3. `.github/workflows/deploy.yml` の `APPS` にディレクトリ名を追加
   （例: `APPS: 'serenagi newvtuber'`）
4. push すると自動でビルド & デプロイ

## デプロイ設定（初回のみ）

1. リポジトリ Settings > Pages > Source を **GitHub Actions** に設定
2. Settings > Secrets and variables > Actions に Supabase の値を登録:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

> 各アプリのセットアップ（Supabase スキーマ等）は各ディレクトリの README を参照。

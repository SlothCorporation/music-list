-- せれなぎ歌枠アプリ スキーマ
-- Supabase ダッシュボード > SQL Editor に貼り付けて実行する。

-- ===== テーブル =====

-- 歌枠
create table if not exists public.streams (
  id          bigint generated always as identity primary key,
  title       text not null,
  url         text,                 -- 配信アーカイブのURL
  streamed_at date,                 -- 配信日
  created_at  timestamptz not null default now()
);

-- 曲マスタ（= 歌える曲の distinct 一覧の元）
create table if not exists public.songs (
  id         bigint generated always as identity primary key,
  title      text not null,
  artist     text not null default '',  -- 作者・Vo.（upsert を効かせるため not null）
  is_variant boolean not null default false,  -- ○○ver. などの派生版。歌える曲一覧(distinct)には出さない
  created_at timestamptz not null default now(),
  unique (title, artist)
);

-- 既存DB向け（schema 適用済みの環境で列だけ追加したい場合）
alter table public.songs add column if not exists is_variant boolean not null default false;

-- 歌枠 × 曲（その枠で歌った実績）
create table if not exists public.performances (
  id         bigint generated always as identity primary key,
  stream_id  bigint not null references public.streams(id) on delete cascade,
  song_id    bigint not null references public.songs(id) on delete cascade,
  url        text,                 -- タイムスタンプ付きリンクなど
  created_at timestamptz not null default now()
);

create index if not exists idx_performances_stream on public.performances(stream_id);
create index if not exists idx_performances_song   on public.performances(song_id);

-- ===== Row Level Security =====
alter table public.streams      enable row level security;
alter table public.songs        enable row level security;
alter table public.performances enable row level security;

-- 誰でも読める（公開閲覧）
create policy "public read streams"      on public.streams      for select using (true);
create policy "public read songs"        on public.songs        for select using (true);
create policy "public read performances" on public.performances for select using (true);

-- ログイン済みユーザーのみ書き込み可（管理画面用）
create policy "auth write streams"      on public.streams      for all to authenticated using (true) with check (true);
create policy "auth write songs"        on public.songs        for all to authenticated using (true) with check (true);
create policy "auth write performances" on public.performances for all to authenticated using (true) with check (true);

-- ===== 管理ユーザー =====
-- 管理者は Supabase ダッシュボード > Authentication > Users から手動で追加する。
-- （新規サインアップは無効にしておくと安全: Authentication > Providers > Email の
--   "Allow new users to sign up" をオフ）

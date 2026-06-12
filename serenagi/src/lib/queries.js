import { supabase } from './supabase'

// ---- 閲覧系（公開・読み取り専用） ----

// 機能1: 歌枠ごとに、その枠で歌った曲を取得
export async function fetchStreamsWithPerformances() {
  const { data, error } = await supabase
    .from('streams')
    .select(
      'id, title, url, streamed_at, performances(id, url, song:songs(id, title, artist))'
    )
    .order('streamed_at', { ascending: false, nullsFirst: false })
  if (error) throw error
  return data
}

// 機能2: 歌える曲を distinct で一覧（songs マスタがそのまま distinct）
export async function fetchSongs() {
  const { data, error } = await supabase
    .from('songs')
    .select('id, title, artist')
    .order('title')
  if (error) throw error
  return data
}

// 機能4: 曲名 / 作者・Vo. で検索
export async function searchSongs(keyword) {
  const kw = `%${keyword.trim()}%`
  const { data, error } = await supabase
    .from('songs')
    .select('id, title, artist')
    .or(`title.ilike.${kw},artist.ilike.${kw}`)
    .order('title')
  if (error) throw error
  return data
}

// ---- 管理系（要ログイン・書き込み） ----

export async function createStream({ title, url, streamed_at }) {
  const { data, error } = await supabase
    .from('streams')
    .insert({ title, url: url || null, streamed_at: streamed_at || null })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteStream(id) {
  const { error } = await supabase.from('streams').delete().eq('id', id)
  if (error) throw error
}

// 曲名+作者の組み合わせが既にあれば再利用、なければ作成（unique 制約で upsert）
export async function upsertSong({ title, artist }) {
  const { data, error } = await supabase
    .from('songs')
    .upsert({ title, artist: artist || '' }, { onConflict: 'title,artist' })
    .select()
    .single()
  if (error) throw error
  return data
}

// 歌枠に1曲ぶんの実績を追加（曲は upsert で確保してから紐付け）
export async function addPerformance({ stream_id, title, artist, url }) {
  const song = await upsertSong({ title, artist })
  const { data, error } = await supabase
    .from('performances')
    .insert({ stream_id, song_id: song.id, url: url || null })
    .select('id, url, song:songs(id, title, artist)')
    .single()
  if (error) throw error
  return data
}

export async function deletePerformance(id) {
  const { error } = await supabase.from('performances').delete().eq('id', id)
  if (error) throw error
}

// ---- 認証 ----

export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signOut() {
  await supabase.auth.signOut()
}

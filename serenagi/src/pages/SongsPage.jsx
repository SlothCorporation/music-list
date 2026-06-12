import { useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured } from '../lib/supabase'
import { fetchSongs } from '../lib/queries'
import NotConfigured from '../components/NotConfigured'

// 機能2: 歌える曲を distinct で一覧（曲名 / 作者・Vo.）
export default function SongsPage() {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    fetchSongs()
      .then(setSongs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return songs
    return songs.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        (s.artist || '').toLowerCase().includes(q)
    )
  }, [songs, filter])

  if (!isSupabaseConfigured) return <NotConfigured />
  if (loading) return <p className="state">読み込み中…</p>
  if (error) return <p className="state state--error">エラー: {error}</p>

  return (
    <div className="page">
      <h1 className="page__title">歌える曲一覧</h1>
      <div className="search-bar">
        <input
          className="input"
          type="search"
          placeholder="🔍 曲名・作者で検索"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <p className="count">{filtered.length} 曲</p>

      <ul className="song-list song-list--flat">
        {filtered.map((s) => (
          <li key={s.id} className="song-list__item">
            <div className="song-list__main">
              <span className="song-list__title">{s.title}</span>
              {s.artist && <span className="song-list__artist">{s.artist}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

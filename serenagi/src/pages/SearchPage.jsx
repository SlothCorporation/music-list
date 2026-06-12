import { useEffect, useState } from 'react'
import { isSupabaseConfigured } from '../lib/supabase'
import { searchSongs } from '../lib/queries'
import NotConfigured from '../components/NotConfigured'

// 機能4: 曲名 / 作者・Vo. で検索
export default function SearchPage() {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  // 入力が止まってから検索（デバウンス）
  useEffect(() => {
    if (!isSupabaseConfigured) return
    const q = keyword.trim()
    if (!q) {
      setResults([])
      setSearched(false)
      return
    }
    setLoading(true)
    const t = setTimeout(() => {
      searchSongs(q)
        .then((data) => {
          setResults(data)
          setError(null)
        })
        .catch((e) => setError(e.message))
        .finally(() => {
          setLoading(false)
          setSearched(true)
        })
    }, 300)
    return () => clearTimeout(t)
  }, [keyword])

  if (!isSupabaseConfigured) return <NotConfigured />

  return (
    <div className="page">
      <h1 className="page__title">検索</h1>
      <input
        className="input"
        type="search"
        placeholder="曲名 / 作者・Vo. で検索"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        autoFocus
      />

      {error && <p className="state state--error">エラー: {error}</p>}
      {loading && <p className="state">検索中…</p>}
      {!loading && searched && results.length === 0 && (
        <p className="state">該当する曲がありません。</p>
      )}

      {results.length > 0 && (
        <>
          <p className="count">{results.length} 件</p>
          <ul className="song-list song-list--flat">
            {results.map((s) => (
              <li key={s.id} className="song-list__item">
                <div className="song-list__main">
                  <span className="song-list__title">{s.title}</span>
                  {s.artist && (
                    <span className="song-list__artist">{s.artist}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

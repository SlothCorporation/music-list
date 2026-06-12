import { useEffect, useState } from 'react'
import { isSupabaseConfigured } from '../lib/supabase'
import { fetchStreamsWithPerformances } from '../lib/queries'
import NotConfigured from '../components/NotConfigured'

// 機能1: 歌枠ごとに歌った曲を一覧表示
export default function StreamsPage() {
  const [streams, setStreams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    fetchStreamsWithPerformances()
      .then(setStreams)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (!isSupabaseConfigured) return <NotConfigured />
  if (loading) return <p className="state">読み込み中…</p>
  if (error) return <p className="state state--error">エラー: {error}</p>
  if (streams.length === 0) return <p className="state">まだ歌枠が登録されていません。</p>

  return (
    <div className="page">
      <h1 className="page__title">歌枠ごとの楽曲</h1>
      {streams.map((s) => (
        <section key={s.id} className="card">
          <header className="card__head">
            <div>
              <h2 className="card__title">{s.title}</h2>
              {s.streamed_at && <p className="card__meta">{s.streamed_at}</p>}
            </div>
            {s.url && (
              <a className="link-btn" href={s.url} target="_blank" rel="noreferrer">
                配信を見る
              </a>
            )}
          </header>

          {s.performances.length === 0 ? (
            <p className="card__empty">登録された曲はまだありません。</p>
          ) : (
            <ul className="song-list">
              {s.performances.map((p) => (
                <li key={p.id} className="song-list__item">
                  <div className="song-list__main">
                    <span className="song-list__title">{p.song?.title}</span>
                    {p.song?.artist && (
                      <span className="song-list__artist">{p.song.artist}</span>
                    )}
                  </div>
                  {p.url && (
                    <a
                      className="song-list__link"
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="この曲のシーンを開く"
                    >
                      ▶
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  )
}

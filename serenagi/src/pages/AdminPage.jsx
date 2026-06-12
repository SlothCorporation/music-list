import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import {
  fetchStreamsWithPerformances,
  createStream,
  deleteStream,
  addPerformance,
  deletePerformance,
  updateSongVariant,
  signIn,
  signOut,
} from '../lib/queries'
import NotConfigured from '../components/NotConfigured'

// 機能5: 歌枠データの登録・編集（要ログイン）
export default function AdminPage() {
  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setReady(true)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setSession(s)
    )
    return () => sub.subscription.unsubscribe()
  }, [])

  if (!isSupabaseConfigured) return <NotConfigured />
  if (!ready) return <p className="state">読み込み中…</p>
  if (!session) return <LoginForm />
  return <AdminConsole onSignOut={signOut} email={session.user.email} />
}

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await signIn(email, password)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <h1 className="page__title">管理ログイン</h1>
      <form className="card form" onSubmit={handleSubmit}>
        <label className="form__label">
          メールアドレス
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="form__label">
          パスワード
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="state state--error">{error}</p>}
        <button className="btn btn--primary" type="submit" disabled={busy}>
          {busy ? 'ログイン中…' : 'ログイン'}
        </button>
      </form>
    </div>
  )
}

function AdminConsole({ onSignOut, email }) {
  const [streams, setStreams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 新規歌枠フォーム
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [date, setDate] = useState('')

  const [activeId, setActiveId] = useState(null) // 曲を追加中の歌枠

  async function reload() {
    try {
      const data = await fetchStreamsWithPerformances()
      setStreams(data)
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  async function handleCreateStream(e) {
    e.preventDefault()
    try {
      await createStream({ title, url, streamed_at: date })
      setTitle('')
      setUrl('')
      setDate('')
      await reload()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleDeleteStream(id) {
    if (!confirm('この歌枠と紐づく曲をすべて削除します。よろしいですか？')) return
    try {
      await deleteStream(id)
      await reload()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="page">
      <div className="admin-bar">
        <h1 className="page__title">管理画面</h1>
        <button className="btn" onClick={onSignOut}>
          ログアウト
        </button>
      </div>
      <p className="count">{email}</p>

      {error && <p className="state state--error">エラー: {error}</p>}

      <section className="card">
        <h2 className="card__title">歌枠を追加</h2>
        <form className="form" onSubmit={handleCreateStream}>
          <input
            className="input"
            placeholder="歌枠タイトル（必須）"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            className="input"
            placeholder="配信URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <input
            className="input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button className="btn btn--primary" type="submit">
            追加
          </button>
        </form>
      </section>

      {loading ? (
        <p className="state">読み込み中…</p>
      ) : (
        streams.map((s) => (
          <StreamEditor
            key={s.id}
            stream={s}
            active={activeId === s.id}
            onToggle={() => setActiveId(activeId === s.id ? null : s.id)}
            onDeleteStream={() => handleDeleteStream(s.id)}
            onChanged={reload}
            onError={setError}
          />
        ))
      )}
    </div>
  )
}

function StreamEditor({ stream, active, onToggle, onDeleteStream, onChanged, onError }) {
  const [songTitle, setSongTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [songUrl, setSongUrl] = useState('')
  const [isVariant, setIsVariant] = useState(false)

  async function handleAdd(e) {
    e.preventDefault()
    try {
      await addPerformance({
        stream_id: stream.id,
        title: songTitle,
        artist,
        url: songUrl,
        is_variant: isVariant,
      })
      setSongTitle('')
      setArtist('')
      setSongUrl('')
      setIsVariant(false)
      await onChanged()
    } catch (e) {
      onError(e.message)
    }
  }

  async function handleDeletePerf(id) {
    try {
      await deletePerformance(id)
      await onChanged()
    } catch (e) {
      onError(e.message)
    }
  }

  // 曲一覧に出す/出さない（派生版フラグ）を切り替える
  async function handleToggleVariant(songId, next) {
    try {
      await updateSongVariant(songId, next)
      await onChanged()
    } catch (e) {
      onError(e.message)
    }
  }

  return (
    <section className="card">
      <header className="card__head">
        <div>
          <h2 className="card__title">{stream.title}</h2>
          <p className="card__meta">
            {stream.streamed_at || '日付未設定'}・{stream.performances.length} 曲
          </p>
        </div>
        <div className="card__actions">
          <button className="btn" onClick={onToggle}>
            {active ? '閉じる' : '曲を編集'}
          </button>
          <button className="btn btn--danger" onClick={onDeleteStream}>
            削除
          </button>
        </div>
      </header>

      {active && (
        <>
          <ul className="song-list">
            {stream.performances.map((p) => (
              <li key={p.id} className="song-list__item">
                <div className="song-list__main">
                  <span className="song-list__title">{p.song?.title}</span>
                  {p.song?.artist && (
                    <span className="song-list__artist">{p.song.artist}</span>
                  )}
                </div>
                {p.song && (
                  <label className="song-list__variant" title="チェックすると「歌える曲一覧」に出さない（派生版）">
                    <input
                      type="checkbox"
                      checked={!!p.song.is_variant}
                      onChange={(e) =>
                        handleToggleVariant(p.song.id, e.target.checked)
                      }
                    />
                    一覧から除外
                  </label>
                )}
                <button
                  className="btn btn--danger btn--sm"
                  onClick={() => handleDeletePerf(p.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>

          <form className="form" onSubmit={handleAdd}>
            <input
              className="input"
              placeholder="曲名（必須）"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              required
            />
            <input
              className="input"
              placeholder="作者・Vo."
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            />
            <input
              className="input"
              placeholder="タイムスタンプURL（任意）"
              value={songUrl}
              onChange={(e) => setSongUrl(e.target.value)}
            />
            <label className="form__check" title="○○ver. などの派生版。チェックすると「歌える曲一覧」に出さない">
              <input
                type="checkbox"
                checked={isVariant}
                onChange={(e) => setIsVariant(e.target.checked)}
              />
              派生版（曲一覧に出さない）
            </label>
            <button className="btn btn--primary" type="submit">
              曲を追加
            </button>
          </form>
        </>
      )}
    </section>
  )
}

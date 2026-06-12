import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import Bubbles from './Bubbles'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

// 一般公開タブ。管理タブはログイン中のみ追加で表示する。
const publicTabs = [
  { to: '/songs', label: '曲一覧', icon: '🎵' },
  { to: '/streams', label: '歌枠', icon: '🎬' },
]
const adminTab = { to: '/admin', label: '管理', icon: '⚙️' }

// スマホライクなシェル: 画面中央に端末幅のフレーム、上にヘッダー、下にタブバー。
export default function Layout() {
  // ログイン中だけ管理タブを出す（一般の閲覧者には見せない）
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    if (!isSupabaseConfigured) return
    supabase.auth.getSession().then(({ data }) => setIsAdmin(!!data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setIsAdmin(!!s)
    )
    return () => sub.subscription.unsubscribe()
  }, [])

  const tabs = isAdmin ? [...publicTabs, adminTab] : publicTabs

  return (
    <div className="app-shell">
      <Bubbles />
      <header className="app-header">
        <span className="app-header__title">せれなぎの歌える曲リスト</span>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <nav className="tabbar">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              'tabbar__item' + (isActive ? ' tabbar__item--active' : '')
            }
          >
            <span className="tabbar__icon">{t.icon}</span>
            <span className="tabbar__label">{t.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

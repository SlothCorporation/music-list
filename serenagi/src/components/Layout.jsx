import { NavLink, Outlet } from 'react-router-dom'

const tabs = [
  { to: '/streams', label: '歌枠', icon: '🎬' },
  { to: '/songs', label: '曲一覧', icon: '🎵' },
  { to: '/search', label: '検索', icon: '🔍' },
  { to: '/admin', label: '管理', icon: '⚙️' },
]

// スマホライクなシェル: 画面中央に端末幅のフレーム、上にヘッダー、下にタブバー。
export default function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-header__title">せれなぎ Song List</span>
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

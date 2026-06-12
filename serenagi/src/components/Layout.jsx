import { NavLink, Outlet } from 'react-router-dom'
import Bubbles from './Bubbles'

const tabs = [
  { to: '/songs', label: '曲一覧', icon: '🎵' },
  { to: '/streams', label: '歌枠', icon: '🎬' },
  { to: '/admin', label: '管理', icon: '⚙️' },
]

// スマホライクなシェル: 画面中央に端末幅のフレーム、上にヘッダー、下にタブバー。
export default function Layout() {
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

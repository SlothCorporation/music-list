import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import StreamsPage from './pages/StreamsPage'
import SongsPage from './pages/SongsPage'
import SearchPage from './pages/SearchPage'
import AdminPage from './pages/AdminPage'

// GitHub Pages は SPA のパスフォールバックが無いため HashRouter を使う
// （/#/songs のような URL になり、リロードしても 404 にならない）。
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/streams" replace />} />
          <Route path="streams" element={<StreamsPage />} />
          <Route path="songs" element={<SongsPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/streams" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

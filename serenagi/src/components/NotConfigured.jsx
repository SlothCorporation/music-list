// Supabase 未設定時の案内（.env 未設定でも画面が見られるように）
export default function NotConfigured() {
  return (
    <div className="page">
      <div className="card notice">
        <h2 className="card__title">Supabase が未設定です</h2>
        <p className="notice__text">
          プロジェクト直下に <code>.env.local</code> を作り、
          <code>VITE_SUPABASE_URL</code> と <code>VITE_SUPABASE_ANON_KEY</code>{' '}
          を設定してください（<code>.env.example</code> を参照）。
        </p>
        <p className="notice__text">
          DB のテーブルは <code>supabase/schema.sql</code> を Supabase の SQL
          Editor で実行すると作成できます。
        </p>
      </div>
    </div>
  )
}

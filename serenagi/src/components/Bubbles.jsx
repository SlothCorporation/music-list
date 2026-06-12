import { useMemo } from 'react'

// 背景でぷくぷく昇る泡。装飾なので aria-hidden。
// マウント時に一度だけランダム生成して以降は固定（再レンダーで揺れ直さない）。
export default function Bubbles({ count = 16 }) {
  const bubbles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        key: i,
        left: Math.random() * 100, // %
        size: 8 + Math.random() * 26, // px
        duration: 8 + Math.random() * 10, // s
        delay: -Math.random() * 12, // s（負値で開始位置をばらけさせる）
        drift: (Math.random() - 0.5) * 50, // px（横揺れ）
      })),
    [count]
  )

  return (
    <div className="bubbles" aria-hidden="true">
      {bubbles.map((b) => (
        <span
          key={b.key}
          className="bubble"
          style={{
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            '--drift': `${b.drift}px`,
          }}
        />
      ))}
    </div>
  )
}

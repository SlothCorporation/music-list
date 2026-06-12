import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// music-list リポジトリ内のサブディレクトリとして公開する。
// 公開URL: https://slothcorporation.github.io/music-list/serenagi/
// → base は '/music-list/serenagi/'。カスタムドメインの場合は '/serenagi/' 等に調整。
export default defineConfig({
  base: '/music-list/serenagi/',
  plugins: [react()],
})

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/solid-start/plugin/vite'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'
import viteSolid from 'vite-plugin-solid'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  server: { port: 4000 },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  plugins: [tailwindcss(), tanstackStart(), nitro(), viteSolid({ ssr: true })],
})

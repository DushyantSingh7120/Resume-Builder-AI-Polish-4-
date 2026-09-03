import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import polishHandler from './api/polish.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env.GEMINI_API_KEY = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY
  process.env.GEMINI_MODEL = env.GEMINI_MODEL || process.env.GEMINI_MODEL || 'gemini-2.5-flash'

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-polish-dev-middleware',
        configureServer(server) {
          server.middlewares.use('/api/polish', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            let body = ''
            req.on('data', (chunk) => {
              body += chunk
            })
            req.on('end', async () => {
              try {
                req.body = JSON.parse(body || '{}')
              } catch {
                req.body = {}
              }

              const mockRes = {
                status(code) {
                  res.statusCode = code
                  return this
                },
                json(data) {
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(data))
                }
              }

              try {
                await polishHandler(req, mockRes)
              } catch (err) {
                console.error('Dev server API handler error:', err)
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: err.message }))
              }
            })
          })
        }
      }
    ]
  }
})

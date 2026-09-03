/**
 * Vercel Serverless Function: /api/polish
 * Handles server-side Gemini AI calls, per-user daily rate limiting, and global quota error handling
 */

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite"
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "resume-builder-ai-45a31"
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || "AIzaSyBKzHPCq1okBQfMh8rIIhaJGynLiUlsa-I"
const DAILY_POLISH_LIMIT = 30
const MAX_PROMPT_CHARS = 6000

const BASE_HONESTY_INSTRUCTION = `You are a professional resume editor.
CRITICAL CONSTRAINT: You must ONLY rephrase and polish the provided text to sound professional, impactful, and concise.
DO NOT invent, fabricate, or assume any facts, job titles, numbers, percentages, dates, tools, or achievements not present in the original text.
Return ONLY the polished text with no preamble, explanations, markdown code blocks, or conversational filler.`

/**
 * Check and increment daily rate limit in Firestore using authorized ID token
 * @param {string|null} userId 
 * @param {string|null} idToken
 * @returns {Promise<{allowed: boolean, reason?: string, count?: number, limit?: number}>}
 */
async function checkAndIncrementRateLimit(userId, idToken = null) {
  if (!userId) {
    return { allowed: true }
  }

  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  const docUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${userId}?key=${FIREBASE_API_KEY}`
  const headers = {
    'Content-Type': 'application/json',
    ...(idToken ? { 'Authorization': `Bearer ${idToken}` } : {})
  }

  try {
    const getRes = await fetch(docUrl, { headers })
    let currentCount = 0
    let lastDate = today

    if (getRes.ok) {
      const data = await getRes.json()
      const fields = data?.fields || {}
      lastDate = fields.lastPolishDate?.stringValue || today
      const storedCount = parseInt(fields.dailyPolishCount?.integerValue || '0', 10)

      if (lastDate === today) {
        currentCount = isNaN(storedCount) ? 0 : storedCount
      } else {
        currentCount = 0
      }
    } else if (getRes.status === 404) {
      currentCount = 0
    } else {
      const errText = await getRes.text().catch(() => '')
      console.warn('[Rate Limiter Warning] Firestore read error:', getRes.status, errText)
    }

    if (currentCount >= DAILY_POLISH_LIMIT) {
      return {
        allowed: false,
        reason: 'DAILY_LIMIT_EXCEEDED',
        count: currentCount,
        limit: DAILY_POLISH_LIMIT
      }
    }

    // Increment count for today
    const newCount = currentCount + 1
    const patchUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${userId}?updateMask.fieldPaths=dailyPolishCount&updateMask.fieldPaths=lastPolishDate&key=${FIREBASE_API_KEY}`

    const patchRes = await fetch(patchUrl, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        fields: {
          dailyPolishCount: { integerValue: String(newCount) },
          lastPolishDate: { stringValue: today }
        }
      })
    })

    if (!patchRes.ok) {
      const patchErrText = await patchRes.text().catch(() => '')
      console.warn('[Rate Limiter Warning] Firestore patch error:', patchRes.status, patchErrText)
    }

    return { allowed: true, count: newCount, limit: DAILY_POLISH_LIMIT }
  } catch (err) {
    console.error('[Rate Limiter Error]:', err)
    // Fail open if Firestore check encounters network issues
    return { allowed: true }
  }
}

/**
 * Verify Firebase Auth ID token and check emailVerified status
 * @param {string|null} idToken 
 * @returns {Promise<{verified: boolean, email?: string, uid?: string, error?: string}>}
 */
async function verifyUserEmail(idToken) {
  if (!idToken) {
    return { verified: false, error: 'Authentication required. Please sign in and verify your email.' }
  }

  const lookupUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`

  try {
    const res = await fetch(lookupUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      console.warn('[Serverless Auth Lookup Failed]:', errData)
      return { verified: false, error: 'Invalid or expired authentication session. Please sign in again.' }
    }

    const data = await res.json()
    const user = data?.users?.[0]
    if (!user) {
      return { verified: false, error: 'User account not found.' }
    }

    if (user.emailVerified !== true) {
      return { verified: false, email: user.email, uid: user.localId, error: 'EMAIL_NOT_VERIFIED' }
    }

    return { verified: true, email: user.email, uid: user.localId }
  } catch (err) {
    console.error('[Serverless Auth Verification Error]:', err)
    return { verified: false, error: 'Failed to verify authentication status.' }
  }
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('[API Polish Error]: Server-side GEMINI_API_KEY is not configured.')
    return res.status(500).json({
      error: 'AI Polish is temporarily unavailable. Server GEMINI_API_KEY environment variable is missing.'
    })
  }

  try {
    const { prompt, userId, idToken } = req.body || {}

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Missing prompt in request body.' })
    }

    if (prompt.length > MAX_PROMPT_CHARS) {
      return res.status(400).json({
        error: `Input is too long (${prompt.length} characters). Maximum allowed is ${MAX_PROMPT_CHARS} characters.`
      })
    }

    // 1. Enforce Server-Side Email Verification for Default (Gemini) provider
    const authCheck = await verifyUserEmail(idToken)
    if (!authCheck.verified) {
      return res.status(403).json({
        error: 'EMAIL_NOT_VERIFIED',
        message: 'Please verify your email address to use the Default Gemini AI polish, or switch to Puter.js.'
      })
    }

    const effectiveUserId = authCheck.uid || userId

    // 2. Enforce Server-Side Per-User Rate Limiting (using authorized ID token)
    const rateLimitCheck = await checkAndIncrementRateLimit(effectiveUserId, idToken)
    if (!rateLimitCheck.allowed && rateLimitCheck.reason === 'DAILY_LIMIT_EXCEEDED') {
      return res.status(429).json({
        error: 'DAILY_LIMIT_EXCEEDED',
        message: `You have reached your daily limit of ${DAILY_POLISH_LIMIT} AI polishes on the Default provider. Please try again tomorrow or switch to Puter.js (BYO account).`,
        limit: DAILY_POLISH_LIMIT
      })
    }

    // 3. Call Google Gemini API with system_instruction and 8.5s timeout protection
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8500)

    let response
    try {
      response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal,
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: BASE_HONESTY_INSTRUCTION }]
          },
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.25,
            maxOutputTokens: 1024
          }
        })
      })
    } catch (fetchErr) {
      if (fetchErr.name === 'AbortError') {
        return res.status(504).json({
          error: 'AI request timed out. Please try again with a shorter section.'
        })
      }
      throw fetchErr
    } finally {
      clearTimeout(timeoutId)
    }

    const data = await response.json()

    // 4. Handle Gemini's own 429 quota exhaustion specifically
    if (
      response.status === 429 ||
      data?.error?.code === 429 ||
      data?.error?.status === 'RESOURCE_EXHAUSTED' ||
      data?.error?.message?.toLowerCase().includes('quota') ||
      data?.error?.message?.toLowerCase().includes('rate limit')
    ) {
      console.warn('[Gemini 429 Global Quota]:', data)
      return res.status(429).json({
        error: 'GLOBAL_QUOTA_EXCEEDED',
        message: 'The shared Gemini free-tier AI quota is currently experiencing high volume. Please try again in a few moments or switch to Puter.js.'
      })
    }

    if (!response.ok) {
      console.error('[Serverless Gemini Error]:', data)
      const errorMsg = data?.error?.message || 'Gemini API call failed'
      const status = response.status || 500
      return res.status(status).json({ error: errorMsg, status })
    }

    const candidate = data.candidates?.[0]
    const text = candidate?.content?.parts?.[0]?.text

    if (!text) {
      return res.status(500).json({ error: 'No response text returned from AI model.' })
    }

    return res.status(200).json({
      result: text.trim(),
      usage: rateLimitCheck.count ? { count: rateLimitCheck.count, limit: rateLimitCheck.limit } : undefined
    })
  } catch (error) {
    console.error('[API Polish Server Error]:', error)
    return res.status(500).json({ error: error.message || 'Internal server error during AI polish.' })
  }
}

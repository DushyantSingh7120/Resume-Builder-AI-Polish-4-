import { BASE_HONESTY_INSTRUCTION } from './geminiService'

// Tracks the specific Firebase user UID that has completed Puter sign-in in this session
let activePuterSessionUid = null

/**
 * Check if the active signed-in user has connected Puter in this app session
 * @param {string|null} uid 
 * @returns {boolean}
 */
export function isPuterConnectedForUser(uid) {
  const userKey = uid || 'guest'
  return activePuterSessionUid === userKey
}

/**
 * Clear the in-memory Puter connection session on sign out
 */
export function clearPuterSession() {
  activePuterSessionUid = null
}

/**
 * Ensure Puter script is loaded and user has explicitly authenticated for their own account
 * @param {string|null} uid 
 * @returns {Promise<boolean>}
 */
export async function ensurePuterAuth(uid = null) {
  if (typeof window === 'undefined' || !window.puter) {
    throw new Error('Puter.js script is not loaded. Please refresh the page.')
  }

  const userKey = uid || 'guest'

  // Check if Puter already has an active signed-in session
  const isAlreadySignedIn = typeof window.puter.auth?.isSignedIn === 'function' && window.puter.auth.isSignedIn()

  // If not signed in or different user context, prompt sign-in
  if (!isAlreadySignedIn && activePuterSessionUid !== userKey) {
    await window.puter.auth.signIn()
  }
  activePuterSessionUid = userKey

  return true
}

/**
 * Call Puter.js AI chat endpoint
 * @param {string} prompt 
 * @param {string|null} uid
 * @returns {Promise<string>}
 */
export async function callPuterAI(prompt, uid = null) {
  await ensurePuterAuth(uid)

  try {
    const response = await window.puter.ai.chat(prompt, { stream: false })

    if (!response) {
      throw new Error('No response returned from Puter AI.')
    }

    if (response?.error) {
      const errorMsg = typeof response.error === 'string' ? response.error : (response.error.message || JSON.stringify(response.error))
      if (
        errorMsg.toLowerCase().includes('usage') ||
        errorMsg.toLowerCase().includes('limit') ||
        errorMsg.toLowerCase().includes('quota') ||
        errorMsg.toLowerCase().includes('allowance') ||
        errorMsg.toLowerCase().includes('delegate') ||
        errorMsg.toLowerCase().includes('400') ||
        errorMsg.toLowerCase().includes('429')
      ) {
        throw new Error('Your Puter AI usage limit was reached — try again later or switch to Default')
      }
      throw new Error(errorMsg)
    }

    let text = ''
    if (typeof response === 'string') {
      text = response
    } else if (response?.message?.content) {
      text = response.message.content
    } else if (response?.text) {
      text = response.text
    } else {
      text = String(response)
    }

    if (!text || !text.trim()) {
      throw new Error('Empty response received from Puter AI.')
    }

    return text.trim()
  } catch (err) {
    console.error('[Puter.js AI Error]:', err)
    const errMsg = err?.message || String(err)
    if (
      errMsg.toLowerCase().includes('usage') ||
      errMsg.toLowerCase().includes('limit') ||
      errMsg.toLowerCase().includes('quota') ||
      errMsg.toLowerCase().includes('allowance') ||
      errMsg.toLowerCase().includes('rate') ||
      errMsg.toLowerCase().includes('delegate') ||
      errMsg.toLowerCase().includes('400') ||
      errMsg.toLowerCase().includes('429') ||
      errMsg.toLowerCase().includes('insufficient')
    ) {
      throw new Error('Your Puter AI usage limit was reached — try again later or switch to Default', { cause: err })
    }
    throw err
  }
}

/**
 * Polish Personal Info / Summary using Puter
 * @param {string} currentSummary 
 * @param {string|null} uid
 * @returns {Promise<string>}
 */
export async function polishSummaryWithPuter(currentSummary, uid = null) {
  if (!currentSummary || !currentSummary.trim()) {
    throw new Error('Please enter some text in the summary before polishing.')
  }

  const prompt = `${BASE_HONESTY_INSTRUCTION}

Task: Polish this resume professional summary. Improve tone and clarity while strictly preserving all original facts.

Original Summary:
"${currentSummary}"

Polished Summary:`

  return await callPuterAI(prompt, uid)
}

/**
 * Polish Work Experience Description using Puter
 * @param {string} description 
 * @param {string} role 
 * @param {string} company 
 * @param {string|null} uid
 * @returns {Promise<string>}
 */
export async function polishExperienceWithPuter(description, role = '', company = '', uid = null) {
  if (!description || !description.trim()) {
    throw new Error('Please enter job description details before polishing.')
  }

  const prompt = `${BASE_HONESTY_INSTRUCTION}

Task: Polish the following work experience bullet points for the position "${role}" at "${company}".
Format the output as clean bullet points, each starting with "- ". Use strong action verbs. Do not invent any metrics or achievements not in the input.

Original Description:
${description}

Polished Bullet Points:`

  return await callPuterAI(prompt, uid)
}

/**
 * Polish Skills list using Puter
 * @param {string[]} skillsArray 
 * @param {string|null} uid
 * @returns {Promise<string[]>}
 */
export async function polishSkillsWithPuter(skillsArray, uid = null) {
  if (!skillsArray || skillsArray.length === 0) {
    throw new Error('Please add some skills before polishing.')
  }

  const prompt = `${BASE_HONESTY_INSTRUCTION}

Task: Clean and standardize the following list of skills into standardized industry terminology.
Do not add skills from unmentioned fields.
Return the result strictly as a comma-separated list of skills (e.g. "React, TypeScript, Tailwind CSS").

Original Skills:
${skillsArray.join(', ')}

Standardized Skills:`

  const result = await callPuterAI(prompt, uid)
  return result
    .split(/[,;\n]/)
    .map((s) => s.replace(/^[-•*\d.]+\s*/, '').trim())
    .filter((s) => {
      if (!s) return false
      const lower = s.toLowerCase()
      if (lower.startsWith('here ') || lower.startsWith('standardized') || lower.endsWith(':')) return false
      return s.length > 0 && s.length < 50
    })
}

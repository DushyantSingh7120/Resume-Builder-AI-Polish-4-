import { auth } from '../config/firebase'

export const BASE_HONESTY_INSTRUCTION = `You are a professional resume editor.
CRITICAL CONSTRAINT: You must ONLY rephrase and polish the provided text to sound professional, impactful, and concise.
DO NOT invent, fabricate, or assume any facts, job titles, numbers, percentages, dates, tools, or achievements not present in the original text.
Return ONLY the polished text with no preamble, explanations, markdown code blocks, or conversational filler.`

/**
 * Call the secure serverless /api/polish endpoint
 * @param {string} prompt 
 * @param {string|null} userId 
 * @returns {Promise<string>}
 */
export async function callGeminiAPI(prompt, userId = null) {
  let idToken = null
  if (auth.currentUser) {
    try {
      idToken = await auth.currentUser.getIdToken()
    } catch (tokenErr) {
      console.warn('[Gemini Service]: Could not get auth ID token:', tokenErr)
    }
  }

  const response = await fetch('/api/polish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt, userId, idToken })
  })

  const data = await response.json()

  if (!response.ok) {
    if (data?.error === 'EMAIL_NOT_VERIFIED' || response.status === 403) {
      const err = new Error(data.message || 'Please verify your email to use the free AI polish, or switch to Puter.js.')
      err.code = 'EMAIL_NOT_VERIFIED'
      throw err
    }

    if (data?.error === 'DAILY_LIMIT_EXCEEDED') {
      const err = new Error(data.message || 'Daily limit reached (30/30). Please try again tomorrow or switch to Puter.js.')
      err.code = 'DAILY_LIMIT_EXCEEDED'
      throw err
    }

    if (data?.error === 'GLOBAL_QUOTA_EXCEEDED' || response.status === 429) {
      const err = new Error(data.message || 'Gemini shared AI quota is currently busy. Please try again in a moment or switch to Puter.js.')
      err.code = 'GLOBAL_QUOTA_EXCEEDED'
      throw err
    }

    const errMsg = data?.error || data?.message || `AI polish request failed with status ${response.status}`
    throw new Error(errMsg)
  }

  if (!data?.result) {
    throw new Error('No polished text returned from server.')
  }

  return data.result
}

/**
 * Polish Personal Info / Professional Summary
 * @param {string} currentSummary 
 * @param {string|null} userId
 * @returns {Promise<string>}
 */
export async function polishSummary(currentSummary, userId = null) {
  if (!currentSummary || !currentSummary.trim()) {
    throw new Error('Please enter some text in the summary before polishing.')
  }

  const prompt = `${BASE_HONESTY_INSTRUCTION}

Task: Polish this resume professional summary. Improve tone and clarity while strictly preserving all original facts.

Original Summary:
"${currentSummary}"

Polished Summary:`

  return await callGeminiAPI(prompt, userId)
}

/**
 * Polish Work Experience Description
 * @param {string} description 
 * @param {string} role 
 * @param {string} company 
 * @param {string|null} userId
 * @returns {Promise<string>}
 */
export async function polishExperienceDescription(description, role = '', company = '', userId = null) {
  if (!description || !description.trim()) {
    throw new Error('Please enter job description details before polishing.')
  }

  const prompt = `${BASE_HONESTY_INSTRUCTION}

Task: Polish the following work experience bullet points for the position "${role}" at "${company}".
Format the output as clean bullet points, each starting with "- ". Use strong action verbs. Do not invent any metrics or achievements not in the input.

Original Description:
${description}

Polished Bullet Points:`

  return await callGeminiAPI(prompt, userId)
}

/**
 * Polish and standardize Skills list
 * @param {string[]} skillsArray 
 * @param {string|null} userId
 * @returns {Promise<string[]>}
 */
export async function polishSkills(skillsArray, userId = null) {
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

  const result = await callGeminiAPI(prompt, userId)
  return result
    .split(/[,,\n]/)
    .map((s) => s.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean)
}

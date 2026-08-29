import { BASE_HONESTY_INSTRUCTION } from './geminiService'

/**
 * Ensure Puter script is loaded and user is authenticated
 * @returns {Promise<boolean>}
 */
export async function ensurePuterAuth() {
  if (typeof window === 'undefined' || !window.puter) {
    throw new Error('Puter.js script is not loaded. Please refresh the page.')
  }

  // Check if already signed in
  const signedIn = window.puter.auth.isSignedIn()
  if (!signedIn) {
    console.log('[Puter.js]: Prompting user sign-in popup...')
    await window.puter.auth.signIn()
  }

  return true
}

/**
 * Call Puter.js AI chat endpoint
 * @param {string} prompt 
 * @returns {Promise<string>}
 */
export async function callPuterAI(prompt) {
  await ensurePuterAuth()

  console.log('[Puter.js AI]: Routing request via Puter account...')
  const response = await window.puter.ai.chat(prompt)

  // Log raw Puter response as required
  console.log('[Puter.js Raw Response]:', response)

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

  return text.trim()
}

/**
 * Polish Personal Info / Summary using Puter
 * @param {string} currentSummary 
 * @returns {Promise<string>}
 */
export async function polishSummaryWithPuter(currentSummary) {
  if (!currentSummary || !currentSummary.trim()) {
    throw new Error('Please enter some text in the summary before polishing.')
  }

  const prompt = `${BASE_HONESTY_INSTRUCTION}

Task: Polish this resume professional summary. Improve tone and clarity while strictly preserving all original facts.

Original Summary:
"${currentSummary}"

Polished Summary:`

  return await callPuterAI(prompt)
}

/**
 * Polish Work Experience Description using Puter
 * @param {string} description 
 * @param {string} role 
 * @param {string} company 
 * @returns {Promise<string>}
 */
export async function polishExperienceWithPuter(description, role = '', company = '') {
  if (!description || !description.trim()) {
    throw new Error('Please enter job description details before polishing.')
  }

  const prompt = `${BASE_HONESTY_INSTRUCTION}

Task: Polish the following work experience bullet points for the position "${role}" at "${company}".
Format the output as clean bullet points, each starting with "- ". Use strong action verbs. Do not invent any metrics or achievements not in the input.

Original Description:
${description}

Polished Bullet Points:`

  return await callPuterAI(prompt)
}

/**
 * Polish Skills list using Puter
 * @param {string[]} skillsArray 
 * @returns {Promise<string[]>}
 */
export async function polishSkillsWithPuter(skillsArray) {
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

  const result = await callPuterAI(prompt)
  return result
    .split(/[,,\n]/)
    .map((s) => s.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean)
}

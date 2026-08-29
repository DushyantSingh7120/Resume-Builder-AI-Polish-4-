import { GEMINI_MODEL, GEMINI_API_KEY } from '../config/aiConfig'

export const BASE_HONESTY_INSTRUCTION = `You are a professional resume editor.
CRITICAL CONSTRAINT: You must ONLY rephrase and polish the provided text to sound professional, impactful, and concise.
DO NOT invent, fabricate, or assume any facts, job titles, numbers, percentages, dates, tools, or achievements not present in the original text.
Return ONLY the polished text with no preamble, explanations, markdown code blocks, or conversational filler.`

/**
 * Call the Gemini API generateContent endpoint dynamically using GEMINI_MODEL
 * @param {string} prompt 
 * @returns {Promise<string>}
 */
export async function callGeminiAPI(prompt) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || GEMINI_API_KEY

  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
    throw new Error('Gemini API key is not configured. Please check your environment or src/config/aiConfig.js')
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1000
      }
    })
  })

  const data = await response.json()
  // Retain raw API console logging
  console.log('[Gemini API Raw Response]:', data)

  if (!response.ok) {
    const errMsg = data?.error?.message || `Gemini API request failed with status ${response.status}`
    throw new Error(errMsg)
  }

  const outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!outputText) {
    throw new Error('No generated text received from Gemini API.')
  }

  return outputText.trim()
}

/**
 * Polish Personal Info / Professional Summary
 * @param {string} currentSummary 
 * @returns {Promise<string>}
 */
export async function polishSummary(currentSummary) {
  if (!currentSummary || !currentSummary.trim()) {
    throw new Error('Please enter some text in the summary before polishing.')
  }

  const prompt = `${BASE_HONESTY_INSTRUCTION}

Task: Polish this resume professional summary. Improve tone and clarity while strictly preserving all original facts.

Original Summary:
"${currentSummary}"

Polished Summary:`

  return await callGeminiAPI(prompt)
}

/**
 * Polish Work Experience Description
 * @param {string} description 
 * @param {string} role 
 * @param {string} company 
 * @returns {Promise<string>}
 */
export async function polishExperienceDescription(description, role = '', company = '') {
  if (!description || !description.trim()) {
    throw new Error('Please enter job description details before polishing.')
  }

  const prompt = `${BASE_HONESTY_INSTRUCTION}

Task: Polish the following work experience bullet points for the position "${role}" at "${company}".
Format the output as clean bullet points, each starting with "- ". Use strong action verbs. Do not invent any metrics or achievements not in the input.

Original Description:
${description}

Polished Bullet Points:`

  return await callGeminiAPI(prompt)
}

/**
 * Polish and standardize Skills list
 * @param {string[]} skillsArray 
 * @returns {Promise<string[]>}
 */
export async function polishSkills(skillsArray) {
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

  const result = await callGeminiAPI(prompt)
  return result
    .split(/[,,\n]/)
    .map((s) => s.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean)
}

import * as geminiService from './geminiService'
import * as puterService from './puterService'

/**
 * Route summary polish through active provider
 */
export async function polishSummary(currentSummary, provider = 'default') {
  if (provider === 'puter') {
    console.log('[AI Dispatcher]: Polishing with PUTER. Gemini API will NOT fire.')
    return await puterService.polishSummaryWithPuter(currentSummary)
  }
  console.log('[AI Dispatcher]: Polishing with DEFAULT (Gemini).')
  return await geminiService.polishSummary(currentSummary)
}

/**
 * Route experience polish through active provider
 */
export async function polishExperienceDescription(description, role = '', company = '', provider = 'default') {
  if (provider === 'puter') {
    console.log('[AI Dispatcher]: Polishing with PUTER. Gemini API will NOT fire.')
    return await puterService.polishExperienceWithPuter(description, role, company)
  }
  console.log('[AI Dispatcher]: Polishing with DEFAULT (Gemini).')
  return await geminiService.polishExperienceDescription(description, role, company)
}

/**
 * Route skills polish through active provider
 */
export async function polishSkills(skillsArray, provider = 'default') {
  if (provider === 'puter') {
    console.log('[AI Dispatcher]: Polishing with PUTER. Gemini API will NOT fire.')
    return await puterService.polishSkillsWithPuter(skillsArray)
  }
  console.log('[AI Dispatcher]: Polishing with DEFAULT (Gemini).')
  return await geminiService.polishSkills(skillsArray)
}

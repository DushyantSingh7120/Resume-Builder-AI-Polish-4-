import * as geminiService from './geminiService'
import * as puterService from './puterService'

/**
 * Route summary polish through active provider
 */
export async function polishSummary(currentSummary, provider = 'default', uid = null) {
  if (provider === 'puter') {
    return await puterService.polishSummaryWithPuter(currentSummary, uid)
  }
  return await geminiService.polishSummary(currentSummary, uid)
}

/**
 * Route experience polish through active provider
 */
export async function polishExperienceDescription(description, role = '', company = '', provider = 'default', uid = null) {
  if (provider === 'puter') {
    return await puterService.polishExperienceWithPuter(description, role, company, uid)
  }
  return await geminiService.polishExperienceDescription(description, role, company, uid)
}

/**
 * Route skills polish through active provider
 */
export async function polishSkills(skillsArray, provider = 'default', uid = null) {
  if (provider === 'puter') {
    return await puterService.polishSkillsWithPuter(skillsArray, uid)
  }
  return await geminiService.polishSkills(skillsArray, uid)
}

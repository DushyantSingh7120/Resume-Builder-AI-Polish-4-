import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'

export const DEFAULT_EMPTY_RESUME = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    summary: ''
  },
  experience: [
    {
      id: 'exp-1',
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: '',
      degree: '',
      startDate: '',
      endDate: ''
    }
  ],
  skills: [],
  aiProvider: 'default'
}

export const SAMPLE_RESUME = {
  personalInfo: {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    summary: 'Experienced Product Designer with 5+ years specializing in complex enterprise tools and design systems. Track record of improving user retention and standardizing design workflows across cross-functional engineering teams.'
  },
  experience: [
    {
      id: 'exp-1',
      company: 'TechVision Solutions',
      role: 'Senior Product Designer',
      startDate: '2020-01',
      endDate: '',
      current: true,
      description: '- Spearheaded comprehensive redesign of core platform, improving user retention by 25%.\n- Established and maintained design system used by 40+ engineers.\n- Mentored junior designers and facilitated cross-functional product workshops.'
    },
    {
      id: 'exp-2',
      company: 'Creative Minds Agency',
      role: 'UX/UI Designer',
      startDate: '2016-06',
      endDate: '2019-12',
      current: false,
      description: '- Delivered tailored, accessible e-commerce experiences for multiple Fortune 500 clients.\n- Conducted user research, usability testing, and persona development.'
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'California College of the Arts',
      degree: 'BFA in Interaction Design',
      startDate: '2012-08',
      endDate: '2016-05'
    }
  ],
  skills: [
    'User Research',
    'Figma',
    'Design Systems',
    'Prototyping',
    'Interaction Architecture',
    'Tailwind CSS',
    'React'
  ],
  aiProvider: 'default'
}

/**
 * Fetch a user's resume from Firestore
 * @param {string} uid 
 * @returns {Promise<object|null>}
 */
export async function loadResumeFromFirestore(uid) {
  if (!uid) return null
  const userDocRef = doc(db, 'users', uid)
  const docSnap = await getDoc(userDocRef)
  if (docSnap.exists() && docSnap.data()?.resume) {
    return docSnap.data().resume
  }
  return null
}

/**
 * Save a user's resume to Firestore
 * @param {string} uid 
 * @param {object} resumeData 
 * @returns {Promise<void>}
 */
export async function saveResumeToFirestore(uid, resumeData) {
  if (!uid) throw new Error('User must be logged in to save.')
  const userDocRef = doc(db, 'users', uid)
  await setDoc(
    userDocRef,
    {
      resume: {
        ...resumeData,
        updatedAt: serverTimestamp()
      }
    },
    { merge: true }
  )
}

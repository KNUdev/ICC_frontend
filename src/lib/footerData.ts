export const footerNavigation = [
  { key: 'home', link: '/' },
  { key: 'serviceRequest', link: '/service-request' },
  { key: 'history', link: '/history' },
  { key: 'photoGallery', link: '/photo-gallery' },
  { key: 'staff', link: '/staff' },
  { key: 'cic', link: '/cic' },
  { key: 'documents', link: '/documents' },
  { key: 'faq', link: '/faq' },
] as const

export const institutionLinks = [
  { key: 'geologyInst', link: 'https://geo.knu.ua/' },
  { key: 'militaryInst', link: 'https://military.knu.ua/' },
  { key: 'securityInst', link: 'https://www.igov.gov.ua/' },
  { key: 'postgraduateInst', link: 'https://ippo.knu.ua/' },
  { key: 'scientificInst', link: 'https://www.science.knu.ua/' },
] as const

export const facultyLinks = [
  { key: 'geographyFac', link: 'https://geo.knu.ua/' },
  { key: 'economiscFac', link: 'https://econom.knu.ua/' },
  { key: 'historyFac', link: 'https://history.knu.ua/' },
  { key: 'mechmathFac', link: 'https://mmf.knu.ua/' },
  { key: 'infotechFac', link: 'https://it.knu.ua/' },
] as const

export const contactInfo = {
  email: 'info@icc.knu.ua',
  phone: '+380(44)339-12-34',
  socialMedia: {
    instagram: 'https://instagram.com/knu_ua',
    facebook: 'https://facebook.com/knu.ua',
    linkedin: 'https://linkedin.com/school/knu-ua',
  },
} as const

export type FooterNavigationItem = (typeof footerNavigation)[number]
export type InstitutionLink = (typeof institutionLinks)[number]
export type FacultyLink = (typeof facultyLinks)[number]

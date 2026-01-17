import PlaceholderImage from '@/assets/image/photo-gallery/image.png'

export const PAGES = {
  HOME: '/',
  SERVICE_REQUEST: '/#formApplication',
  PHOTO_GALLERY: '/photo-gallery',
  HISTORY: '/history',
  STAFF: '/staff',
  CLUSTER: 'http://cluster.univ.kiev.ua/ukr/',
  FAQ: '/#faq',
}

export const INSTITUTION_LINKS = {
  MILITARY: 'https://mil.knu.ua/',
  SECURITY: 'https://institute.do.gov.ua/',
  POSTGRADUATE: 'https://ipe.knu.ua/',
  GEOLOGY: 'https://geo.knu.ua/',
  JOURNALISM: 'https://journ.knu.ua/',
  HIGHTECH: 'https://iht.knu.ua/',
  INTRELATIONS: 'https://www.iir.edu.ua/',
  LAW: 'https://law.knu.ua/',
  PHILOLOGY: 'https://philology.knu.ua/',
  CIVILADMIN: 'https://ipacs.knu.ua/',
  MEDICINE: 'https://biomed.knu.ua/',
}

export const FACULTY_LINKS = {
  GEOGRAPHY: 'https://geo.knu.ua/',
  ECONOMICS: 'https://econom.knu.ua/',
  HISTORY: 'http://www.history.univ.kiev.ua/',
  MECHMATH: 'https://mechmat.knu.ua/',
  INFOTECH: 'https://fit.knu.ua/',
  CYBERNETICS: 'https://csc.knu.ua/en/',
  PSYCHOLOGY: 'https://psy.knu.ua/',
  RADIOPHYSICS: 'https://rex.knu.ua/',
  SOCIOLOGY: 'https://sociology.knu.ua/',
  PHYSICS: 'https://phys.knu.ua/',
  PHILOSOPHY: 'https://www.philosophy.knu.ua/',
  CHEMISTRY: 'https://chem.knu.ua/',
}

export const SECTORS = {
  1: {
    en: 'Humanitarian',
    uk: 'Гуманітарний',
  },
  2: {
    en: 'Natural Sciences',
    uk: 'Природничий',
  },
  3: {
    en: 'Social Sciences',
    uk: 'Соціальний',
  },
  4: {
    en: 'Technical',
    uk: 'Технічний',
  },
}

export const SPECIALTIES = {
  1: {
    en: 'Computer Science',
    uk: 'Інформатика',
  },
  2: {
    en: 'Law',
    uk: 'Право',
  },
  3: {
    en: 'Economics',
    uk: 'Економіка',
  },
  4: {
    en: 'Psychology',
    uk: 'Психологія',
  },
}

export const EMPLOYEES = [
  {
    id: '1d87b3e3-44a7-4915-ac13-33180ed448ff',
    name: {
      firstName: 'Ivan',
      middleName: 'Ivanovich',
      lastName: 'Ivanov',
    },
    email: 'ivan@knu.ua',
    phoneNumber: '380960222321',
    createdAt: '2026-01-16T14:36:00.863Z',
    updatedAt: '2026-01-16T14:36:00.863Z',
    salaryInUAH: 18000,
    isStudent: true,
    avatarUrl: PlaceholderImage,
    contractEndDate: '2026-05-16',
    workHours: {
      startTime: '09:00:00',
      endTime: '18:00:00',
    },
    role: 'COMMON_USER',
    specialty: {
      id: '1',
    },
    sector: {
      id: '1',
    },
  },
  {
    id: '2d87b3e3-44a7-4915-ac13-33180ed448ff',
    name: {
      firstName: 'Petro',
      middleName: 'Petrovich',
      lastName: 'Petrov',
    },
    email: 'petro@knu.ua',
    phoneNumber: '380960222322',
    createdAt: '2026-01-16T14:36:00.863Z',
    updatedAt: '2026-01-16T14:36:00.863Z',
    salaryInUAH: 20000,
    isStudent: false,
    avatarUrl: PlaceholderImage,
    contractEndDate: '2026-05-16',
    workHours: {
      startTime: '10:00:00',
      endTime: '19:00:00',
    },
    role: 'COMMON_USER',
    specialty: {
      id: '2',
    },
    sector: {
      id: '2',
    },
  },
]

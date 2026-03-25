import PlaceholderImage from '@/assets/image/photo-gallery/image.png'

export const PAGES = {
	HOME: '/',
	SERVICE_REQUEST: '/#formApplication',
	HISTORY: '/history',
	STAFF: '/staff',
	CONTACTS: '/contacts',
	CLUSTER: 'http://cluster.univ.kiev.ua/ukr/',
	FAQ: '/#faq',
	DOCUMENTS: '/documents',
	RESOURCES: '/resources',
	NOC: '/noc',
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
		en: 'Administration',
		uk: 'Адміністрація',
	},
	2: {
		en: 'Network Technologies Sector',
		uk: 'Сектор мережевих технологій',
	},
	3: {
		en: 'New Technologies Implementation Sector',
		uk: 'Сектор впровадження нових технологій',
	},
	4: {
		en: 'Educational Process Automation Sector',
		uk: 'Сектор автоматизації навчального процесу',
	},
	5: {
		en: 'User Support Bureau',
		uk: 'Бюро підтримки користувачів',
	},
	6: {
		en: 'Site Information Support',
		uk: 'Інформаційна підтримка сайту',
	},
}

export const SPECIALTIES = {
	1: {
		en: 'Head',
		uk: 'Керівник',
	},
	2: {
		en: 'Engineer',
		uk: 'Інженер',
	},
	3: {
		en: 'Specialist',
		uk: 'Спеціаліст',
	},
}

export const EMPLOYEES = [
	{
		id: '1',
		name: {
			firstName: 'Юрій',
			middleName: 'Володимирович',
			lastName: 'Бойко',
		},
		email: 'icc@knu.ua',
		phoneNumber: '521-35-14',
		createdAt: '2026-01-01T00:00:00.000Z',
		updatedAt: '2026-01-01T00:00:00.000Z',
		salaryInUAH: 0,
		isStudent: false,
		avatarUrl: PlaceholderImage,
		contractEndDate: '2030-01-01',
		workHours: {
			startTime: '09:00:00',
			endTime: '18:00:00',
		},
		role: 'HEAD_MANAGER',
		specialty: {
			id: '1',
		},
		sector: {
			id: '1',
		},
	},
	{
		id: '2',
		name: {
			firstName: 'Олександр',
			middleName: 'Францович',
			lastName: 'Борецький',
		},
		email: 'icc@knu.ua',
		phoneNumber: '22-55',
		createdAt: '2026-01-01T00:00:00.000Z',
		updatedAt: '2026-01-01T00:00:00.000Z',
		salaryInUAH: 0,
		isStudent: false,
		avatarUrl: PlaceholderImage,
		contractEndDate: '2030-01-01',
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
		id: '3',
		name: {
			firstName: 'Віталій',
			middleName: 'Анатолійович',
			lastName: 'Мар’яновський',
		},
		email: 'icc@knu.ua',
		phoneNumber: '521-33-47',
		createdAt: '2026-01-01T00:00:00.000Z',
		updatedAt: '2026-01-01T00:00:00.000Z',
		salaryInUAH: 0,
		isStudent: false,
		avatarUrl: PlaceholderImage,
		contractEndDate: '2030-01-01',
		workHours: {
			startTime: '09:00:00',
			endTime: '18:00:00',
		},
		role: 'COMMON_USER',
		specialty: {
			id: '1',
		},
		sector: {
			id: '2',
		},
	},
	{
		id: '4',
		name: {
			firstName: 'Сергій',
			middleName: 'Петрович',
			lastName: 'Загороднюк',
		},
		email: 'icc@knu.ua',
		phoneNumber: '521-32-88',
		createdAt: '2026-01-01T00:00:00.000Z',
		updatedAt: '2026-01-01T00:00:00.000Z',
		salaryInUAH: 0,
		isStudent: false,
		avatarUrl: PlaceholderImage,
		contractEndDate: '2030-01-01',
		workHours: {
			startTime: '09:00:00',
			endTime: '18:00:00',
		},
		role: 'COMMON_USER',
		specialty: {
			id: '1',
		},
		sector: {
			id: '3',
		},
	},
	{
		id: '5',
		name: {
			firstName: 'Тетяна',
			middleName: 'Василівна',
			lastName: 'Смелянська',
		},
		email: 'icc@knu.ua',
		phoneNumber: '521-33-56',
		createdAt: '2026-01-01T00:00:00.000Z',
		updatedAt: '2026-01-01T00:00:00.000Z',
		salaryInUAH: 0,
		isStudent: false,
		avatarUrl: PlaceholderImage,
		contractEndDate: '2030-01-01',
		workHours: {
			startTime: '09:00:00',
			endTime: '18:00:00',
		},
		role: 'COMMON_USER',
		specialty: {
			id: '1',
		},
		sector: {
			id: '4',
		},
	},
	{
		id: '6',
		name: {
			firstName: 'Світлана',
			middleName: 'Дмитрівна',
			lastName: 'Морозова',
		},
		email: 'icc@knu.ua',
		phoneNumber: '521-33-07',
		createdAt: '2026-01-01T00:00:00.000Z',
		updatedAt: '2026-01-01T00:00:00.000Z',
		salaryInUAH: 0,
		isStudent: false,
		avatarUrl: PlaceholderImage,
		contractEndDate: '2030-01-01',
		workHours: {
			startTime: '09:00:00',
			endTime: '18:00:00',
		},
		role: 'COMMON_USER',
		specialty: {
			id: '1',
		},
		sector: {
			id: '5',
		},
	},
	{
		id: '7',
		name: {
			firstName: 'Тетяна',
			middleName: 'Володимирівна',
			lastName: 'Лаканцева',
		},
		email: 'icc@knu.ua',
		phoneNumber: '521-32-94',
		createdAt: '2026-01-01T00:00:00.000Z',
		updatedAt: '2026-01-01T00:00:00.000Z',
		salaryInUAH: 0,
		isStudent: false,
		avatarUrl: PlaceholderImage,
		contractEndDate: '2030-01-01',
		workHours: {
			startTime: '09:00:00',
			endTime: '18:00:00',
		},
		role: 'COMMON_USER',
		specialty: {
			id: '3',
		},
		sector: {
			id: '6',
		},
	},
]

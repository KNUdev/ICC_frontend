import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'ICC - Information and Computing Center'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: { locale: string } }) {
  const { locale } = await params
  
  const isUk = locale === 'uk'
  
  const title = isUk 
    ? 'Інформаційно-обчислювальний центр' 
    : 'Information and Computing Center'
    
  const subtitle = isUk
    ? 'Київського національного університету імені Тараса Шевченка'
    : 'of Taras Shevchenko National University of Kyiv'
    
  const cta = isUk ? 'Відвідайте наш сайт' : 'Visit our website'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f6f6f6',
          padding: '40px 80px',
        }}
      >
        {/* Background Decoration */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(255, 82, 94, 0.05)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(255, 82, 94, 0.03)',
          }}
        />

        {/* Logo */}
        <div style={{ display: 'flex', marginBottom: '40px' }}>
          <svg width="140" height="76" viewBox="0 0 70 38" fill="none">
            <path d="M41.6935 31.9694V0.391666H50.7985V23.669H60.895V0.391666H70V31.9694H41.6935ZM61.4134 37.6083L65.9208 31.9694H60.895V23.669H70V37.6083H61.4134Z" fill="#FF525E"/>
            <path d="M0 31.9694V0.391666H9.01481V31.9694H0Z" fill="#FF525E"/>
            <path d="M30.425 31.9694H11.2685V22.9472H30.425V31.9694Z" fill="#FF525E"/>
            <path d="M39.4398 9.41389H11.2685V0.391666H39.4398V9.41389Z" fill="#FF525E"/>
            <path d="M11.2685 22.9472V0.391666L20.2833 0.391666V22.9472H11.2685Z" fill="#FF525E"/>
            <path d="M30.425 31.9694V9.41389H39.4398V31.9694H30.425Z" fill="#FF525E"/>
          </svg>
        </div>

        {/* Text Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '64px',
              fontWeight: 900,
              color: '#FF525E',
              marginBottom: '16px',
              textTransform: 'uppercase',
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '32px',
              color: '#4f4f4f',
              marginBottom: '48px',
              maxWidth: '900px',
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Call to Action */}
        <div
          style={{
            display: 'flex',
            padding: '16px 40px',
            backgroundColor: '#FF525E',
            color: 'white',
            borderRadius: '12px',
            fontSize: '28px',
            fontWeight: 700,
            boxShadow: '0 4px 14px 0 rgba(255, 82, 94, 0.39)',
          }}
        >
          {cta}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

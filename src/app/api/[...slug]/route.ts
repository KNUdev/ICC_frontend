import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NGROK_API_URL

async function handleRequest(
  req: NextRequest,
  context: { params: Promise<{ slug: string[] }> },
) {
  const params = await context.params

  if (!API_URL) {
    return NextResponse.json(
      { error: 'NGROK_API_URL is not defined in .env.local' },
      { status: 500 },
    )
  }

  const path = params.slug.join('/')
  const fullApiUrl = `${API_URL}/${path}${req.nextUrl.search}`

  console.log(`[PROXY] Forwarding ${req.method} to: ${fullApiUrl}`)

  try {
    const apiResponse = await fetch(fullApiUrl, {
      method: req.method,
      headers: {
        'Content-Type': req.headers.get('Content-Type') || 'application/json',
      },
      body: req.body,
      cache: 'no-store',
    })

    return new NextResponse(apiResponse.body, {
      status: apiResponse.status,
      statusText: apiResponse.statusText,
      headers: apiResponse.headers,
    })
  } catch (error) {
    console.error('[PROXY ERROR]', error)
    return NextResponse.json({ error: 'Proxy failed' }, { status: 502 })
  }
}

export {
  handleRequest as DELETE,
  handleRequest as GET,
  handleRequest as PATCH,
  handleRequest as POST,
  handleRequest as PUT,
}

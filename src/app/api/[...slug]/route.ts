import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_NGROK_API_URL

async function handler(
  req: NextRequest,
  { params }: { params: { slug: string[] } },
) {
  if (!API_URL) {
    return NextResponse.json(
      { error: 'API URL not configured' },
      { status: 500 },
    )
  }

  const path = params.slug.join('/')

  const fullApiUrl = `${API_URL}/${path}${req.nextUrl.search}`

  try {
    const apiResponse = await fetch(fullApiUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: req.body,
    })

    const data = await apiResponse.json()

    return NextResponse.json(data, { status: apiResponse.status })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Error forwarding request to API' },
      { status: 502 },
    )
  }
}

export {
  handler as DELETE,
  handler as GET,
  handler as PATCH,
  handler as POST,
  handler as PUT,
}

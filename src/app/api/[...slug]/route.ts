// src/app/api/[...slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NGROK_API_URL

// --- Общая логика вынесена в отдельную функцию ---
async function handleRequest(
  req: NextRequest,
  context: { params: { slug: string[] } },
) {
  const { params } = context

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
      // duplex - это поле нужно для передачи body в fetch в Node.js >= 18
      // --- ИСПРАВЛЕНИЕ ЗДЕСЬ ---
      // @ts-ignore заменяем на @ts-expect-error
      // @ts-expect-error
      duplex: 'half',
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

// --- Явный экспорт для каждого HTTP-метода ---
export async function GET(
  req: NextRequest,
  context: { params: { slug: string[] } },
) {
  return handleRequest(req, context)
}

export async function POST(
  req: NextRequest,
  context: { params: { slug: string[] } },
) {
  return handleRequest(req, context)
}

export async function PUT(
  req: NextRequest,
  context: { params: { slug: string[] } },
) {
  return handleRequest(req, context)
}

export async function DELETE(
  req: NextRequest,
  context: { params: { slug: string[] } },
) {
  return handleRequest(req, context)
}

export async function PATCH(
  req: NextRequest,
  context: { params: { slug: string[] } },
) {
  return handleRequest(req, context)
}

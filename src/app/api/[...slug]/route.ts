// src/app/api/[...slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'

// Тип для второго аргумента, чтобы TypeScript был счастлив
type TContext = {
  params: {
    slug: string[]
  }
}

export async function GET(request: NextRequest, context: TContext) {
  const { params } = context
  const slug = params.slug.join('/')

  return NextResponse.json({
    message: 'Test successful!',
    receivedSlug: slug,
  })
}

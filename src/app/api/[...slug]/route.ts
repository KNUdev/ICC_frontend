// app/api/proxy/[...slug]/route.ts

import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NGROK_API_URL

async function handler(
  req: NextRequest,
  // --- ИСПРАВЛЕНИЕ ЗДЕСЬ ---
  // Принимаем весь объект 'context' как второй аргумент
  context: { params: { slug: string[] } },
) {
  // Достаем params из context уже внутри функции
  const { params } = context
  // -------------------------

  if (!API_URL) {
    return NextResponse.json(
      { error: 'API URL not configured in .env.local' },
      { status: 500 },
    )
  }

  // 1. Собираем путь из slug
  const path = params.slug.join('/')

  // 2. Добавляем query-параметры (например, ?limit=10)
  const fullApiUrl = `${API_URL}/${path}${req.nextUrl.search}`

  console.log(`Proxying request to: ${fullApiUrl}`) // Полезный лог для отладки

  try {
    // 3. Делаем запрос на ваш Spring Boot бэкенд
    const apiResponse = await fetch(fullApiUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        // Если вам нужно передавать заголовок авторизации, раскомментируйте:
        // 'Authorization': req.headers.get('Authorization') || '',
      },
      // Для GET/HEAD запросов тело должно быть null
      body: req.method === 'GET' || req.method === 'HEAD' ? null : req.body,
      // Важно для Next.js 13+, чтобы избежать излишнего кеширования
      cache: 'no-store',
    })

    // 4. Проверяем, удалось ли API вернуть JSON
    const contentType = apiResponse.headers.get('content-type')
    let data
    if (contentType && contentType.indexOf('application/json') !== -1) {
      data = await apiResponse.json()
    } else {
      // Если ответ не JSON, возвращаем как текст (например, для ошибок)
      data = await apiResponse.text()
    }

    // 5. Отправляем ответ обратно на фронтенд
    return NextResponse.json(data, { status: apiResponse.status })
  } catch (error) {
    console.error('[API PROXY ERROR]', error)
    return NextResponse.json(
      { error: 'Error forwarding request to API' },
      { status: 502 }, // 502 Bad Gateway
    )
  }
}

// Экспортируем исправленный хендлер для всех методов
export {
  handler as DELETE,
  handler as GET,
  handler as PATCH,
  handler as POST,
  handler as PUT,
}

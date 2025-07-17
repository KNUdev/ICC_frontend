import { Client } from 'minio'
import { NextRequest, NextResponse } from 'next/server'

const minioClient = new Client({
  endPoint: process.env.NEXT_PUBLIC_MINIO_ENDPOINT as string,
  port: Number(process.env.NEXT_PUBLIC_MINIO_PORT),
  accessKey: process.env.NEXT_PUBLIC_MINIO_ACCESS_KEY as string,
  secretKey: process.env.NEXT_PUBLIC_MINIO_SECRET_KEY as string,
  useSSL: process.env.NEXT_PUBLIC_MINIO_USE_SSL === 'true',
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bucket = process.env.NEXT_PUBLIC_MINIO_BUCKET_NAME as string

    const exists = await minioClient.bucketExists(bucket)
    if (!exists) {
      await minioClient.makeBucket(bucket)
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    await minioClient.putObject(bucket, file.name, buffer, buffer.length, {
      'Content-Type': file.type || 'application/octet-stream',
    })

    return NextResponse.json({ message: 'File uploaded!' })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

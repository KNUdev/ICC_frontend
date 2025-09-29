export default function netlifyImageLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }

  const params = new URLSearchParams()
  params.set('w', width.toString())
  if (quality) {
    params.set('q', quality.toString())
  }

  return `/.netlify/images?url=${encodeURIComponent(src)}&${params.toString()}`
}

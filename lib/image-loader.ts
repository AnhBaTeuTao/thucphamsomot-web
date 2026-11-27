// Custom next/image loader. Vercel's free Image Optimization quota (5,000
// transformations/month) ran out in 10/2026, so nothing goes through
// /_next/image any more:
// - Both local site images under /public and remote images are returned
//   directly at full native resolution so zooming (50%–100%) stays crisp.
type LoaderParams = { src: string; width: number; quality?: number };

export default function imageLoader({ src }: LoaderParams): string {
  return src;
}

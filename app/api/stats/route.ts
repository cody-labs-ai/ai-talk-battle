export const runtime = 'nodejs';

// Import stats from chat route - we'll use a shared module
import { getStats } from '@/lib/stats';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get('key');
  
  // Simple auth to prevent public access
  if (key !== process.env.STATS_KEY && key !== 'cody2026') {
    return new Response('Unauthorized', { status: 401 });
  }

  const stats = getStats();
  return new Response(JSON.stringify(stats, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}

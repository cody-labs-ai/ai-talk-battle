// Simple in-memory analytics (resets on redeploy)
const stats = {
  totalRequests: 0,
  uniqueIPs: new Set<string>(),
  startedAt: new Date().toISOString(),
  battles: 0, // incremented when round 1 message 1 is sent
};

export function trackRequest(ip: string, isFirstMessage: boolean) {
  stats.totalRequests++;
  stats.uniqueIPs.add(ip);
  if (isFirstMessage) stats.battles++;
}

export function getStats() {
  return {
    totalRequests: stats.totalRequests,
    uniqueUsers: stats.uniqueIPs.size,
    battles: stats.battles,
    startedAt: stats.startedAt,
    uptime: Math.round((Date.now() - new Date(stats.startedAt).getTime()) / 60000) + ' minutes',
  };
}

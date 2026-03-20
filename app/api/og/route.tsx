import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #0f172a 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🔥</div>
          <div style={{ fontSize: '48px', fontWeight: 900, color: 'white', display: 'flex', alignItems: 'center' }}>
            <span style={{ background: 'linear-gradient(90deg, #f97316, #ef4444)', backgroundClip: 'text', color: 'transparent' }}>VS</span>
          </div>
          <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>❄️</div>
        </div>
        <div style={{ fontSize: '64px', fontWeight: 900, color: 'white', letterSpacing: '-2px', marginBottom: '16px', display: 'flex' }}>
          AI TALK BATTLE
        </div>
        <div style={{ fontSize: '24px', color: 'rgba(255,255,255,0.6)', maxWidth: '600px', textAlign: 'center', lineHeight: 1.4, display: 'flex' }}>
          Pick two AI characters. Give them a topic. Watch them battle it out.
        </div>
        <div style={{ marginTop: '32px', padding: '12px 32px', borderRadius: '999px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', fontSize: '18px', display: 'flex' }}>
          ⚔️ Free to play
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

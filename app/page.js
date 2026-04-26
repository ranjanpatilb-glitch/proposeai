import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <nav>
        <div className="nav-logo">Propose<span>AI</span></div>
        <div className="nav-links">
          <Link href="/auth" className="btn btn-ghost btn-sm">Log in</Link>
          <Link href="/auth?mode=signup" className="btn btn-primary btn-sm">Start free trial</Link>
        </div>
      </nav>

      <div style={{ textAlign: 'center', padding: '100px 40px 80px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(201,242,100,0.1)', border: '1px solid rgba(201,242,100,0.25)', color: 'var(--accent)', padding: '5px 14px', borderRadius: 100, fontSize: 13, marginBottom: 32 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }}></span>
          AI-powered proposals in under 60 seconds
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px,6vw,72px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 20 }}>
          Win clients with proposals that <span style={{ color: 'var(--accent)' }}>actually</span> convert
        </h1>
        <p style={{ fontSize: 18, color: 'var(--muted)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Stop spending hours writing proposals. ProposeAI generates personalized, professional proposals in seconds.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth?mode=signup" className="btn btn-primary">Generate your first proposal →</Link>
          <Link href="/pricing" className="btn">See pricing</Link>
        </div>
        <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 60, flexWrap: 'wrap' }}>
          {[['4.2hrs', 'saved per proposal'], ['68%', 'higher win rate'], ['2,400+', 'agencies use ProposeAI']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'var(--accent)' }}>{num}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 40px 80px' }}>
        <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 }}>Features</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, marginBottom: 40 }}>Everything you need to win more clients</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 2, border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          {[
            ['⚡', 'AI generation in seconds', 'Fill in a short form. Get a full, personalized proposal instantly.'],
            ['🎨', 'Your brand, your style', 'Upload your logo, set brand colors — every PDF looks like you.'],
            ['✍️', 'Edit any section', 'Not happy with a section? Regenerate it or edit it directly.'],
            ['📊', 'Proposal analytics', 'Know when your proposal is opened and which sections they read.'],
            ['✅', 'E-signatures', 'Clients sign directly in the browser. No printing, no scanning.'],
            ['🔗', 'CRM integrations', 'Connects with HubSpot, Notion, and more.'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background: 'var(--surface)', padding: 28 }}>
              <div style={{ fontSize: 24, marginBottom: 16 }}>{icon}</div>
              <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: 48, color: 'var(--muted)', fontSize: 13, borderTop: '1px solid var(--border)' }}>
        © 2025 ProposeAI · Built with Claude API ·{' '}
        <Link href="/pricing" style={{ color: 'var(--accent)' }}>Pricing</Link>
      </div>
    </div>
  )
}

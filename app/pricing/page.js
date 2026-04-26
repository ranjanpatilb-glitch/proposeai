'use client'
import { useState } from 'react'
import Link from 'next/link'

function BetaPopup({ plan, onClose }) {
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function submit() {
    if (!feedback.trim()) return
    // Save feedback to Supabase or just log for now
    console.log('Feedback for plan', plan, ':', feedback)
    setSubmitted(true)
    setTimeout(onClose, 2000)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 40, maxWidth: 460, width: '100%', textAlign: 'center' }}>
        {submitted ? (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🙏</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Thanks for your feedback!</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>We'll be in touch when paid plans launch.</p>
          </>
        ) : (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>It's completely free right now!</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
              ProposeAI is <strong style={{ color: 'var(--accent)' }}>free for everyone</strong> during our beta. No credit card, no limits. Just sign up and start generating proposals!
              <br /><br />
              We'd love to hear your thoughts — what would make you pay for this?
            </p>
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="e.g. I'd pay for it if it had e-signatures, or if proposals could be sent directly from the app..."
              style={{ width: '100%', minHeight: 100, padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 13, lineHeight: 1.6, resize: 'vertical', marginBottom: 16, boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary btn-full" onClick={submit} disabled={!feedback.trim()}>Send feedback</button>
              <button className="btn btn-full" onClick={onClose}>Maybe later</button>
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 16 }}>
              <Link href="/auth?mode=signup" style={{ color: 'var(--accent)' }}>Sign up free →</Link> and start using ProposeAI today.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

const PLANS = [
  {
    key: 'solo', name: 'Solo', price: 39, desc: 'Perfect for freelancers sending a handful of proposals each month.',
    features: ['5 proposals/month', '3 templates', 'PDF export', 'Basic branding'],
  },
  {
    key: 'pro', name: 'Pro', price: 99, featured: true, desc: 'For growing agencies that need unlimited proposals and advanced features.',
    features: ['Unlimited proposals', 'Brand kit (logo, fonts)', 'Proposal analytics', 'E-signatures', 'Priority support'],
  },
  {
    key: 'team', name: 'Team', price: 249, desc: 'For agencies with multiple team members and white-label needs.',
    features: ['Everything in Pro', '5 team seats', 'White-label PDFs', 'CRM integrations', 'Onboarding call'],
  },
]

export default function Pricing() {
  const [loading, setLoading] = useState(null)
  const [betaPlan, setBetaPlan] = useState(null)

  async function checkout(plan) {
    setBetaPlan(plan)
  }

  return (
    <div>
      {betaPlan && <BetaPopup plan={betaPlan} onClose={() => setBetaPlan(null)} />}
      <nav>
        <Link href="/" className="nav-logo">Propose<span>AI</span></Link>
        <div className="nav-links">
          <Link href="/auth" className="btn btn-ghost btn-sm">Log in</Link>
          <Link href="/auth?mode=signup" className="btn btn-primary btn-sm">Start free trial</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 }}>Pricing</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 700, marginBottom: 16 }}>Simple, honest pricing</h1>
        <p style={{ fontSize: 18, color: 'var(--muted)', marginBottom: 60 }}>14-day free trial on all plans. No credit card required to start.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
          {PLANS.map(plan => (
            <div key={plan.key} className={`card ${plan.featured ? 'card-featured' : ''}`} style={{ textAlign: 'left' }}>
              {plan.featured && <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent)', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Most popular</div>}
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>{plan.name}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700, marginBottom: 4 }}>
                ${plan.price}<span style={{ fontSize: 16, fontWeight: 400, color: 'var(--muted)' }}>/mo</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: '8px 0 20px', lineHeight: 1.5 }}>{plan.desc}</p>
              <ul style={{ listStyle: 'none', marginBottom: 24 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ fontSize: 13, padding: '6px 0', borderTop: '1px solid var(--border)', color: 'var(--muted)', display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--accent)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className={`btn ${plan.featured ? 'btn-primary' : ''} btn-full`} onClick={() => checkout(plan.key)}>
                Get started
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 60, padding: 32, background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'left' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>What does it actually cost to run?</h3>
          <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7 }}>
            The AI that generates proposals uses the Anthropic API. Each proposal costs roughly $0.01–$0.03 to generate.
            At 100 proposals per month, your API cost is approximately $2–$3 total. Hosting, database, and email are all free.
            Your biggest cost is Stripe's 2.9% processing fee — which only applies when you're already earning revenue.
          </p>
        </div>
      </div>
    </div>
  )
}

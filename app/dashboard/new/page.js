'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../../lib/supabase'

const STEPS = [
  { title: 'About your client', sub: 'Tell us who you\'re sending this proposal to.' },
  { title: 'Project details', sub: 'What are you delivering and what does it cost?' },
  { title: 'About you', sub: 'Help us write a convincing bio section.' },
  { title: 'Style & generate', sub: 'Choose your tone, then generate.' },
]

const TONES = [
  { value: 'professional', label: 'Professional', desc: 'Confident and polished. The safe choice for most clients.' },
  { value: 'conversational', label: 'Conversational', desc: 'Warm and human. Great for startups and small business.' },
  { value: 'formal', label: 'Formal', desc: 'Corporate and precise. Best for legal or enterprise clients.' },
  { value: 'bold', label: 'Bold', desc: 'Punchy and confident. Makes big claims. Great for startups.' },
]

export default function NewProposal() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tone, setTone] = useState('professional')
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({
    clientName: '', clientContact: '', clientIndustry: '', projectGoal: '', clientPainPoints: '',
    projectType: '', keyDeliverables: '', timeline: '', budget: '',
    agencyName: '', agencyBio: '', additionalNotes: '',
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/auth'); return }
      setUser(user)
      setForm(f => ({ ...f, agencyName: user.user_metadata?.agency || '' }))
    })
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function validate() {
    const checks = [
      () => form.clientName && form.clientContact && form.clientIndustry && form.projectGoal,
      () => form.projectType && form.keyDeliverables && form.timeline && form.budget,
      () => form.agencyName,
      () => true,
    ]
    if (!checks[step]()) { setError('Please fill in all required fields'); return false }
    setError(''); return true
  }

  function next() { if (validate()) setStep(s => s + 1) }
  function prev() { setStep(s => s - 1); setError('') }

  async function generate() {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intake: { ...form, tone } }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')

      const { data: saved, error: dbErr } = await supabase.from('proposals').insert({
        user_id: user.id,
        intake: { ...form, tone },
        proposal: data.proposal,
        sent: false,
      }).select().single()

      if (dbErr) throw new Error(dbErr.message)
      router.push(`/proposal/${saved.id}`)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: 40 }}>
      <div className="spinner" style={{ marginBottom: 32 }}></div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Writing your proposal...</h2>
      <p style={{ color: 'var(--muted)' }}>ProposeAI is crafting a personalized proposal for <span style={{ color: 'var(--accent)' }}>{form.clientName}</span></p>
    </div>
  )

  return (
    <div>
      <nav>
        <div className="nav-logo">Propose<span>AI</span></div>
        <div className="nav-links">
          <Link href="/dashboard" className="btn btn-ghost btn-sm">Cancel</Link>
        </div>
      </nav>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px' }}>
        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i <= step ? 'var(--accent)' : 'var(--border2)', transition: 'background .3s' }}></div>
          ))}
        </div>
        <div style={{ marginBottom: 32 }}>
          <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 13, marginBottom: 16, textDecoration: 'none' }}>← Back to dashboard</Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 6 }}>{STEPS[step].title}</h1>
          <p style={{ color: 'var(--muted)', fontSize: 15 }}>{STEPS[step].sub}</p>
        </div>

        {/* Step 0: Client */}
        {step === 0 && (
          <div>
            <div className="form-row">
              <div className="form-group"><label>Client company name *</label><input type="text" placeholder="Acme Corp" value={form.clientName} onChange={e => set('clientName', e.target.value)} /></div>
              <div className="form-group"><label>Contact person *</label><input type="text" placeholder="Sarah Chen" value={form.clientContact} onChange={e => set('clientContact', e.target.value)} /></div>
            </div>
            <div className="form-group"><label>Client's industry *</label><input type="text" placeholder="e.g. E-commerce, SaaS, Healthcare, Legal" value={form.clientIndustry} onChange={e => set('clientIndustry', e.target.value)} /></div>
            <div className="form-group"><label>Client's primary goal *</label><textarea placeholder="e.g. Increase online sales by 40% and improve mobile experience" value={form.projectGoal} onChange={e => set('projectGoal', e.target.value)} /></div>
            <div className="form-group"><label>What pain points are they facing?</label><textarea placeholder="e.g. Website is slow and outdated, losing sales to competitors..." value={form.clientPainPoints} onChange={e => set('clientPainPoints', e.target.value)} /></div>
          </div>
        )}

        {/* Step 1: Project */}
        {step === 1 && (
          <div>
            <div className="form-group"><label>Type of project *</label><input type="text" placeholder="e.g. Website redesign, Brand identity, SEO campaign" value={form.projectType} onChange={e => set('projectType', e.target.value)} /></div>
            <div className="form-group"><label>Key deliverables *</label><textarea placeholder="List what you'll deliver, e.g: New Shopify store, Mobile design, 3 months support" value={form.keyDeliverables} onChange={e => set('keyDeliverables', e.target.value)} /></div>
            <div className="form-row">
              <div className="form-group"><label>Timeline *</label><input type="text" placeholder="e.g. 6 weeks, 3 months" value={form.timeline} onChange={e => set('timeline', e.target.value)} /></div>
              <div className="form-group"><label>Investment *</label><input type="text" placeholder="e.g. $8,500 or $5K–$10K" value={form.budget} onChange={e => set('budget', e.target.value)} /></div>
            </div>
          </div>
        )}

        {/* Step 2: About you */}
        {step === 2 && (
          <div>
            <div className="form-group"><label>Your agency / name *</label><input type="text" placeholder="Smith Creative Studio" value={form.agencyName} onChange={e => set('agencyName', e.target.value)} /></div>
            <div className="form-group"><label>Short bio (2–3 sentences)</label><textarea placeholder="e.g. We're a 4-person design studio that has helped 60+ e-commerce brands increase revenue through beautiful, conversion-focused websites." value={form.agencyBio} onChange={e => set('agencyBio', e.target.value)} /></div>
            <div className="form-group"><label>Extra context for AI (optional)</label><textarea placeholder="e.g. Client loves Notion's aesthetic. They have a $50K budget but we're quoting $12K. Emphasize long-term partnership." value={form.additionalNotes} onChange={e => set('additionalNotes', e.target.value)} /></div>
          </div>
        )}

        {/* Step 3: Tone */}
        {step === 3 && (
          <div>
            <div className="form-group">
              <label>Choose your proposal tone</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 6 }}>
                {TONES.map(t => (
                  <div key={t.value} onClick={() => setTone(t.value)} style={{ background: 'var(--bg)', border: `1px solid ${tone === t.value ? 'var(--accent)' : 'var(--border2)'}`, borderRadius: 8, padding: '10px 14px', cursor: 'pointer', background: tone === t.value ? 'rgba(201,242,100,0.06)' : 'var(--bg)' }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{t.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{t.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'rgba(201,242,100,0.06)', border: '1px solid rgba(201,242,100,0.2)', borderRadius: 8, padding: '14px 16px', fontSize: 13, color: 'var(--muted)', marginTop: 8 }}>
              Your Anthropic API key is configured on the server — no need to enter it here.
            </div>
          </div>
        )}

        {error && <div className="form-error" style={{ marginTop: 8 }}>{error}</div>}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
          {step > 0 ? <button className="btn btn-ghost" onClick={prev}>← Back</button> : <span></span>}
          {step < 3
            ? <button className="btn btn-primary" onClick={next}>Next step →</button>
            : <button className="btn btn-primary" onClick={generate}>✨ Generate proposal</button>
          }
        </div>
      </div>
    </div>
  )
}

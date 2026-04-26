'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../../lib/supabase'

export default function ProposalPage() {
  const router = useRouter()
  const { id } = useParams()
  const supabase = createClient()
  const [proposal, setProposal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [regenId, setRegenId] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => { loadProposal() }, [id])

  async function loadProposal() {
    const { data, error } = await supabase.from('proposals').select('*').eq('id', id).single()
    if (error || !data) { router.push('/dashboard'); return }
    setProposal(data)
    setLoading(false)
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function regenSection(section) {
    const instruction = prompt(`Regenerate "${section.title}" with any special instruction (or leave blank):`)
    if (instruction === null) return
    setRegenId(section.id)
    try {
      const res = await fetch('/api/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId: section.id, sectionTitle: section.title, intake: proposal.intake, instruction }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      const updated = { ...proposal, proposal: { ...proposal.proposal, sections: proposal.proposal.sections.map(s => s.id === section.id ? data.section : s) } }
      await supabase.from('proposals').update({ proposal: updated.proposal }).eq('id', id)
      setProposal(updated)
      showToast('Section regenerated!')
    } catch (err) {
      showToast(err.message, 'error')
    }
    setRegenId(null)
  }

  async function markSent() {
    await supabase.from('proposals').update({ sent: true }).eq('id', id)
    setProposal(p => ({ ...p, sent: true }))
    showToast('Marked as sent!')
  }

  function exportTxt() {
    const p = proposal.proposal
    const text = `PROPOSAL FOR ${proposal.intake.clientName.toUpperCase()}\n${proposal.intake.projectType}\n${'='.repeat(50)}\n\n` +
      p.sections.map(s => `${s.title.toUpperCase()}\n${'-'.repeat(30)}\n${s.content}\n`).join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `proposal-${proposal.intake.clientName.replace(/\s+/g, '-')}.txt`
    a.click(); URL.revokeObjectURL(url)
    showToast('Exported!')
  }

  function formatContent(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />')
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><div className="spinner"></div></div>

  const { intake, proposal: p } = proposal

  return (
    <div>
      <nav>
        <div className="nav-logo">Propose<span>AI</span></div>
        <div className="nav-links">
          <Link href="/dashboard" className="btn btn-ghost btn-sm">← Dashboard</Link>
          <button className="btn btn-sm" onClick={exportTxt}>⬇ Export</button>
          {!proposal.sent && <button className="btn btn-primary btn-sm" onClick={markSent}>Mark as sent</button>}
          {proposal.sent && <span className="badge badge-green">Sent</span>}
        </div>
      </nav>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 65px)' }}>
        {/* Section nav sidebar */}
        <div style={{ width: 240, background: 'var(--surface)', borderRight: '1px solid var(--border)', padding: 24, flexShrink: 0, overflowY: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>Sections</div>
          {p.sections.map(s => (
            <div key={s.id} onClick={() => document.getElementById('sec-' + s.id)?.scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '8px 10px', borderRadius: 8, fontSize: 13, color: 'var(--muted)', cursor: 'pointer', marginBottom: 2, transition: 'all .15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--text)' }}
              onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--muted)' }}>
              {s.title}
            </div>
          ))}
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link href="/dashboard/new" className="btn btn-sm btn-full" style={{ justifyContent: 'center' }}>+ New proposal</Link>
            <Link href="/dashboard" className="btn btn-ghost btn-sm btn-full" style={{ justifyContent: 'center' }}>← All proposals</Link>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: '40px', overflowY: 'auto', maxWidth: 800 }}>
          <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500, marginBottom: 6 }}>{intake.clientName}</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, marginBottom: 8 }}>{intake.projectType} Proposal</h1>
            <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 16 }}>✉ {p.subject}</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[['Timeline', intake.timeline], ['Investment', intake.budget], ['Read time', p.metadata?.estimatedReadTime || '3 min'], ['Tone', intake.tone]].map(([label, val]) => (
                <div key={label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', fontSize: 12 }}>
                  <strong style={{ display: 'block' }}>{val}</strong>
                  <span style={{ color: 'var(--muted)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {p.sections.map(s => (
            <div key={s.id} id={'sec-' + s.id} style={{ marginBottom: 40, scrollMarginTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>{s.title}</h2>
                <button onClick={() => regenSection(s)} disabled={regenId === s.id}
                  style={{ fontSize: 12, color: regenId === s.id ? 'var(--accent)' : 'var(--muted)', background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', transition: 'all .15s', whiteSpace: 'nowrap' }}>
                  {regenId === s.id ? '⟳ Regenerating...' : '↺ Regenerate'}
                </button>
              </div>
              <div style={{ fontSize: 15, color: 'rgba(240,237,232,0.85)', lineHeight: 1.75 }} dangerouslySetInnerHTML={{ __html: formatContent(s.content) }} />
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  )
}

'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../lib/supabase'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      setUser(user)
      const { data } = await supabase.from('proposals').select('*').order('created_at', { ascending: false })
      setProposals(data || [])
      setLoading(false)
    }
    load()
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  async function deleteProposal(id) {
    if (!confirm('Delete this proposal?')) return
    await supabase.from('proposals').delete().eq('id', id)
    setProposals(p => p.filter(x => x.id !== id))
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="spinner"></div>
    </div>
  )

  return (
    <div>
      <nav>
        <div className="nav-logo">Propose<span>AI</span></div>
        <div className="nav-links">
          <span style={{ fontSize: 13, color: 'var(--muted)', marginRight: 8 }}>{user?.user_metadata?.name || user?.email}</span>
          <Link href="/pricing" className="btn btn-ghost btn-sm">Upgrade</Link>
          <button className="btn btn-ghost btn-sm" onClick={logout}>Log out</button>
        </div>
      </nav>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 65px)' }}>
        {/* Sidebar */}
        <div style={{ width: 220, background: 'var(--surface)', borderRight: '1px solid var(--border)', padding: '24px 16px', flexShrink: 0 }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8, padding: '0 8px' }}>Workspace</div>
            {[['📄', 'Proposals', '/dashboard'], ['💳', 'Billing', '/pricing'], ['⚙️', 'Settings', '/dashboard?tab=settings']].map(([icon, label, href]) => (
              <Link key={label} href={href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, fontSize: 14, color: 'var(--muted)', transition: 'all .15s', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--text)' }}
                onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--muted)' }}>
                <span>{icon}</span> {label}
              </Link>
            ))}
          </div>
          <Link href="/dashboard/new" className="btn btn-primary btn-sm btn-full">+ New proposal</Link>
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700 }}>Your proposals</h1>
            <Link href="/dashboard/new" className="btn btn-primary btn-sm">+ New proposal</Link>
          </div>

          {proposals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 40px', color: 'var(--muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.4 }}>📄</div>
              <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--text)', marginBottom: 8 }}>No proposals yet</div>
              <div style={{ fontSize: 14, marginBottom: 24 }}>Create your first AI-generated proposal in under 60 seconds.</div>
              <Link href="/dashboard/new" className="btn btn-primary">+ Create proposal</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
              {proposals.map(p => (
                <div key={p.id} className="card" style={{ cursor: 'pointer', position: 'relative', transition: 'all .15s' }}
                  onClick={() => router.push(`/proposal/${p.id}`)}>
                  <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500, marginBottom: 6 }}>{p.intake?.clientName}</div>
                  <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8, lineHeight: 1.3 }}>{p.intake?.projectType} Proposal</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{p.intake?.timeline} · {p.intake?.budget}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{new Date(p.created_at).toLocaleDateString()}</div>
                  <span style={{ position: 'absolute', top: 16, right: 16, fontSize: 11, padding: '3px 8px', borderRadius: 100, fontWeight: 500, background: p.sent ? 'rgba(201,242,100,0.15)' : 'rgba(136,136,136,0.15)', color: p.sent ? 'var(--accent)' : 'var(--muted)' }}>
                    {p.sent ? 'Sent' : 'Draft'}
                  </span>
                  <button onClick={e => { e.stopPropagation(); deleteProposal(p.id) }}
                    style={{ position: 'absolute', bottom: 16, right: 16, fontSize: 11, background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

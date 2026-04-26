'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../lib/supabase'
 
function AuthContent() {
  const router = useRouter()
  const params = useSearchParams()
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '', name: '', agency: '' })
  const supabase = createClient()
 
  useEffect(() => {
    if (params.get('mode') === 'signup') setMode('signup')
  }, [params])
 
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
 
  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
  }
 
  async function handleSignup(e) {
    e.preventDefault()
    if (!form.name || !form.agency) { setError('Please fill in all fields'); return }
    setLoading(true); setError('')
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name, agency: form.agency } }
    })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
  }
 
  return (
    <div>
      <nav>
        <Link href="/" className="nav-logo">Propose<span>AI</span></Link>
        <div className="nav-links"></div>
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 65px)', padding: 40 }}>
        <div className="card" style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 28, textAlign: 'center' }}>
            Propose<span style={{ color: 'var(--accent)' }}>AI</span>
          </div>
 
          {mode === 'login' ? (
            <form onSubmit={handleLogin}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Welcome back</div>
              <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Log in to your account</div>
              <div className="form-group"><label>Email</label><input type="email" placeholder="you@agency.com" value={form.email} onChange={e => set('email', e.target.value)} required /></div>
              <div className="form-group"><label>Password</label><input type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} required /></div>
              {error && <div className="form-error">{error}</div>}
              <button className="btn btn-primary btn-full" style={{ marginTop: 8 }} disabled={loading}>{loading ? 'Logging in...' : 'Log in'}</button>
              <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', marginTop: 16 }}>
                Don't have an account? <span style={{ color: 'var(--accent)', cursor: 'pointer' }} onClick={() => setMode('signup')}>Sign up free</span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Start free trial</div>
              <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>14 days free — no credit card needed</div>
              <div className="form-row">
                <div className="form-group"><label>Your name</label><input type="text" placeholder="Jane Smith" value={form.name} onChange={e => set('name', e.target.value)} /></div>
                <div className="form-group"><label>Agency name</label><input type="text" placeholder="Studio Co." value={form.agency} onChange={e => set('agency', e.target.value)} /></div>
              </div>
              <div className="form-group"><label>Email</label><input type="email" placeholder="you@agency.com" value={form.email} onChange={e => set('email', e.target.value)} required /></div>
              <div className="form-group"><label>Password</label><input type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => set('password', e.target.value)} required /></div>
              {error && <div className="form-error">{error}</div>}
              <button className="btn btn-primary btn-full" style={{ marginTop: 8 }} disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button>
              <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', marginTop: 16 }}>
                Already have an account? <span style={{ color: 'var(--accent)', cursor: 'pointer' }} onClick={() => setMode('login')}>Log in</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
 
export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><div className="spinner"></div></div>}>
      <AuthContent />
    </Suspense>
  )
}

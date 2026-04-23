import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'

/**
 * Só renderiza `children` com sessão Supabase ativa. Caso contrário, redireciona para /login.
 */
function ProtectedRoute({ children }) {
  const location = useLocation()
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    let active = true

    async function ensureSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!active) return
      if (session) {
        setStatus('ok')
        return
      }
      setStatus('none')
    }

    ensureSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!active) return
        if (event === 'SIGNED_OUT' || !session) {
          setStatus('none')
        } else {
          setStatus('ok')
        }
      },
    )

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  if (status === 'checking') {
    return (
      <div className="lume-auth lume-auth--center">
        <div className="lume-panel lume-auth__card text-center" role="status">
          <p className="mb-0">A verificar sessão…</p>
        </div>
      </div>
    )
  }

  if (status === 'none') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute

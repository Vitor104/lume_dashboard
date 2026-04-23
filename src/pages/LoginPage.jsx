import { useCallback, useEffect, useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiBox } from 'react-icons/fi'
import { api } from '../services/api'
import { supabase } from '../services/supabaseClient'
import SignUpModal from '../components/modals/SignUpModal'

function LoginPage() {
  const baseId = useId()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [signUpOpen, setSignUpOpen] = useState(false)
  const [signUpGlobalSuccess, setSignUpGlobalSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const redirectIfSession = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      navigate('/', { replace: true })
    }
  }, [navigate])

  useEffect(() => {
    redirectIfSession()
  }, [redirectIfSession])

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await api.doLogin(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err?.message || 'Falha ao iniciar sessão.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="lume-auth">
      <div className="lume-auth__inner">
        <div className="lume-auth__header">
          <span className="lume-brand__mark lume-auth__mark" aria-hidden>
            <FiBox strokeWidth={2.2} />
          </span>
          <h1 className="lume-auth__title">Lume</h1>
          <p className="lume-auth__subtitle">Entre para aceder ao dashboard de stock.</p>
        </div>

        <div className="lume-panel lume-auth__card">
          {signUpGlobalSuccess ? (
            <div className="alert alert-success" role="status">
              <strong>Utilizador criado com sucesso.</strong>
              <span className="d-block small mt-1">
                Pode fazer login abaixo com o e-mail e a senha indicados. Se a confirmação de
                e-mail estiver ativa, verifique a caixa de entrada antes de entrar.
              </span>
            </div>
          ) : null}
          {error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleLogin} className="lume-auth__form">
            <div className="mb-3">
              <label className="form-label" htmlFor={`${baseId}-email`}>
                E-mail
              </label>
              <input
                id={`${baseId}-email`}
                className="form-control"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={submitting}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor={`${baseId}-pass`}>
                Senha
              </label>
              <input
                id={`${baseId}-pass`}
                className="form-control"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={submitting}
              />
            </div>
            <div className="d-grid gap-2">
              <button
                type="submit"
                className="btn btn-primary py-2"
                style={{ backgroundColor: 'var(--lume-orange)', borderColor: 'var(--lume-orange)' }}
                disabled={submitting}
              >
                {submitting ? 'A entrar…' : 'Entrar'}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setError('')
                  setSignUpOpen(true)
                }}
                disabled={submitting}
              >
                Criar nova conta
              </button>
            </div>
          </form>
        </div>

        <p className="lume-auth__footer text-center text-muted small mb-0">Lume · Acesso com sessão segura</p>
      </div>

      <SignUpModal
        show={signUpOpen}
        onClose={() => setSignUpOpen(false)}
        onSuccess={() => {
          setSignUpGlobalSuccess(true)
        }}
      />
    </div>
  )
}

export default LoginPage

import { useCallback, useEffect, useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiBox, FiEye, FiEyeOff, FiShield } from 'react-icons/fi'
import { api } from '../services/api'
import { supabase } from '../services/supabaseClient'
import SignUpModal from '../components/modals/SignUpModal'

function LoginPage() {
  const baseId = useId()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
      <div className="lume-auth__blobs" aria-hidden>
        <div className="lume-auth__blob lume-auth__blob--1" />
        <div className="lume-auth__blob lume-auth__blob--2" />
        <div className="lume-auth__blob lume-auth__blob--3" />
      </div>

      <div className="lume-auth__inner">
        <div className="lume-auth__header">
          <span className="lume-auth__mark" aria-hidden>
            <FiBox strokeWidth={2.2} />
          </span>
          <h1 className="lume-auth__title">Lume</h1>
          <p className="lume-auth__subtitle">
          Gerencie seu estoque com inteligência e previsibilidade.
          </p>
        </div>

        <div className="lume-auth__card">
          {signUpGlobalSuccess ? (
            <div className="alert alert-success mb-3" role="status">
              <strong>Usuário criado com sucesso.</strong>
              <span className="d-block small mt-1">
                Pode fazer login abaixo com o e-mail e a senha indicados.
              </span>
            </div>
          ) : null}
          {error ? (
            <div className="alert alert-danger mb-3" role="alert">
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
                placeholder="nome@empresa.com"
              />
            </div>
            <div className="mb-2">
              <label className="form-label" htmlFor={`${baseId}-pass`}>
                Senha
              </label>
              <div className="lume-auth__pass-wrap">
                <input
                  id={`${baseId}-pass`}
                  className="form-control"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={submitting}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="lume-auth__pass-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff aria-hidden /> : <FiEye aria-hidden />}
                </button>
              </div>
            </div>
            <a
              className="lume-auth__forgot"
              href="#recuperar"
              onClick={(e) => e.preventDefault()}
            >
              Esqueceu a senha?
            </a>

            <div className="d-grid gap-2 mt-3">
              <button
                type="submit"
                className="lume-auth__btn-primary"
                disabled={submitting}
              >
                {submitting ? 'A entrar…' : 'Entrar'}
              </button>
            </div>

            <div className="lume-auth__sep" aria-hidden>
              <span>ou</span>
            </div>

            <button
              type="button"
              className="lume-auth__btn-secondary"
              onClick={() => {
                setError('')
                setSignUpOpen(true)
              }}
              disabled={submitting}
            >
              Criar nova conta
            </button>
          </form>
        </div>

        <p className="lume-auth__footer mb-0">
          <FiShield aria-hidden />
          <span>
            <strong>Lume</strong>
            {' '}
            · Acesso com sessão segura
          </span>
        </p>
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

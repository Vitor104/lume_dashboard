import { useId, useState } from 'react'
import PropTypes from 'prop-types'
import { api } from '../../services/api'

function SignUpModal({ show, onClose, onSuccess }) {
  const baseId = useId()
  const [fullName, setFullName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function handleClose() {
    if (submitting) return
    setError('')
    onClose()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await api.createUser({
        fullName,
        businessName,
        email,
        password,
      })
      onSuccess()
      setFullName('')
      setBusinessName('')
      setEmail('')
      setPassword('')
      onClose()
    } catch (err) {
      setError(err?.message || 'Não foi possível criar a conta.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!show) return null

  return (
    <div
      className="modal show d-block"
      tabIndex={-1}
      role="dialog"
      aria-modal
      aria-labelledby={`${baseId}-signup-title`}
    >
      {/* Backdrop antes do diálogo: o diálogo precisa de z-index > 1050 do .modal-backdrop */}
      <div
        className="modal-backdrop show"
        aria-hidden
        onClick={handleClose}
      />
      <div
        className="modal-dialog modal-dialog-centered position-relative"
        style={{ zIndex: 1056 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow">
          <form onSubmit={handleSubmit}>
            <div className="modal-header border-0">
              <h1 id={`${baseId}-signup-title`} className="modal-title h5">
                Criar nova conta
              </h1>
              <button
                type="button"
                className="btn-close"
                aria-label="Fechar"
                onClick={handleClose}
                disabled={submitting}
              />
            </div>
            <div className="modal-body pt-0">
              {error ? (
                <div className="alert alert-danger py-2" role="alert">
                  {error}
                </div>
              ) : null}
              <div className="mb-3">
                <label className="form-label" htmlFor={`${baseId}-name`}>
                  Nome
                </label>
                <input
                  id={`${baseId}-name`}
                  className="form-control"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor={`${baseId}-business`}>
                  Nome do negócio
                </label>
                <input
                  id={`${baseId}-business`}
                  className="form-control"
                  type="text"
                  autoComplete="organization"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>
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
              <div className="mb-0">
                <label className="form-label" htmlFor={`${baseId}-pass`}>
                  Senha
                </label>
                <input
                  id={`${baseId}-pass`}
                  className="form-control"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={submitting}
                />
              </div>
            </div>
            <div className="modal-footer border-0">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleClose}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ backgroundColor: 'var(--lume-orange)', borderColor: 'var(--lume-orange)' }}
                disabled={submitting}
              >
                {submitting ? 'A criar…' : 'Criar conta'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

SignUpModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
}

export default SignUpModal

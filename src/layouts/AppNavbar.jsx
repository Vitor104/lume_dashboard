import { useEffect, useRef, useState } from 'react'
import { FiAlertTriangle, FiBell, FiBox, FiLogOut } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../hooks/useAppContext'
import { supabase } from '../services/supabaseClient'

function AppNavbar() {
  const navigate = useNavigate()
  const { alerts, user } = useAppContext()
  const criticalCount = alerts.filter((a) => a.level === 'danger').length
  const hasCritical = criticalCount > 0
  const hasWarningOnly = !hasCritical && alerts.some((a) => a.level === 'warning')

  const [bellOpen, setBellOpen] = useState(false)
  const bellWrapRef = useRef(null)

  useEffect(() => {
    if (!bellOpen) return undefined

    function handlePointerDown(event) {
      const el = bellWrapRef.current
      if (el && !el.contains(event.target)) {
        setBellOpen(false)
      }
    }

    function handleKey(event) {
      if (event.key === 'Escape') setBellOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKey)
    }
  }, [bellOpen])

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  return (
    <header className="lume-nav">
      <div className="lume-nav__inner">
        <div className="lume-brand">
          <span className="lume-brand__mark" aria-hidden>
            <FiBox strokeWidth={2.2} />
          </span>
          <div className="lume-brand__titles">
            <span className="lume-brand__name">Lume</span>
            <span className="lume-brand__subtitle" title={user?.business_name ?? undefined}>
              {user?.name ? `Olá, ${user.name.split(' ')[0]}` : 'Dashboard'}
            </span>
          </div>
        </div>

        <div className="lume-nav__badges">
          <div className="lume-nav__alerts-desktop">
            {criticalCount > 0 ? (
              <span className="lume-badge lume-badge--critical">
                <FiAlertTriangle aria-hidden />
                {criticalCount === 1 ? '1 alerta crítico' : `${criticalCount} alertas críticos`}
              </span>
            ) : (
              <span className="lume-badge lume-badge--critical-muted">
                <FiAlertTriangle aria-hidden />
                Nenhum alerta crítico
              </span>
            )}
          </div>

          <div className="lume-nav__alerts-mobile" ref={bellWrapRef}>
            <button
              type="button"
              className="lume-nav-bell"
              aria-expanded={bellOpen}
              aria-haspopup="dialog"
              aria-label="Alertas de stock"
              onClick={() => setBellOpen((o) => !o)}
            >
              <FiBell aria-hidden />
              {hasCritical ? (
                <span className="lume-nav-bell__dot lume-nav-bell__dot--crit" aria-hidden />
              ) : null}
              {hasWarningOnly ? (
                <span className="lume-nav-bell__dot lume-nav-bell__dot--warn" aria-hidden />
              ) : null}
            </button>
            {bellOpen ? (
              <div
                className="lume-nav-bell-panel"
                role="dialog"
                aria-label="Alertas de stock"
              >
                {alerts.length === 0 ? (
                  <p>Nenhum produto abaixo do stock mínimo.</p>
                ) : (
                  <>
                    <p className="lume-nav-bell-panel__title">Alertas</p>
                    {alerts.map((a) => (
                      <p
                        key={a.productId}
                        className={
                          a.level === 'danger'
                            ? 'lume-nav-bell-panel__item--crit'
                            : 'lume-nav-bell-panel__item--warn'
                        }
                      >
                        <strong>{a.productName}</strong>
                        {' — '}
                        {a.level === 'danger'
                          ? 'Stock crítico (abaixo de metade do mínimo).'
                          : 'Stock abaixo do mínimo definido.'}
                      </p>
                    ))}
                  </>
                )}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 lume-nav__badges"
            onClick={(e) => {
              e.preventDefault();
              alert("O toque funcionou!");
              handleSignOut();
            }}

            
            
          >
            <FiLogOut aria-hidden />
            Sair
          </button>
        </div>
      </div>
    </header>
  )
}

export default AppNavbar

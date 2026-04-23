import { FiAlertTriangle, FiBox, FiLogOut, FiWifi } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../hooks/useAppContext'
import { supabase } from '../services/supabaseClient'

function AppNavbar() {
  const navigate = useNavigate()
  const { alerts, user } = useAppContext()
  const criticalCount = alerts.filter((a) => a.level === 'danger').length

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
          <span className="lume-badge lume-badge--online">
            <FiWifi aria-hidden />
            Online
          </span>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
            onClick={handleSignOut}
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

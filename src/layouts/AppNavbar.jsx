import { FiWifi } from 'react-icons/fi'

function AppNavbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom">
      <div className="container">
        <span className="navbar-brand fw-semibold">
          <span className="text-primary me-2">Lume</span>
          Dashboard
        </span>

        <div className="d-flex align-items-center gap-2 ms-auto">
          <span className="badge text-bg-success d-inline-flex align-items-center gap-1">
            <FiWifi />
            Online
          </span>
        </div>
      </div>
    </nav>
  )
}

export default AppNavbar

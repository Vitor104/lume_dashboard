import PropTypes from 'prop-types'

function AlertList({ alerts }) {
  if (!alerts.length) {
    return (
      <div className="alert alert-success mb-4" role="alert">
        Estoque em dia. Nenhum alerta no momento.
      </div>
    )
  }

  return (
    <div className="d-grid gap-2 mb-4">
      {alerts.map((alert) => (
        <div key={alert.productId} className={`alert alert-${alert.level} mb-0`} role="alert">
          {alert.level === 'danger'
            ? `Estoque critico: ${alert.productName}`
            : `Estoque baixo: ${alert.productName}`}
        </div>
      ))}
    </div>
  )
}

AlertList.propTypes = {
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      productId: PropTypes.string.isRequired,
      productName: PropTypes.string.isRequired,
      level: PropTypes.oneOf(['danger', 'warning']).isRequired,
    }),
  ).isRequired,
}

export default AlertList

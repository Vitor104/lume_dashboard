import PropTypes from 'prop-types'
import { FiAlertTriangle } from 'react-icons/fi'

function AlertList({ alerts }) {
  if (!alerts.length) {
    return null
  }

  const critical = alerts.filter((a) => a.level === 'danger')
  const names = critical.length ? critical.map((a) => a.productName).join(', ') : alerts.map((a) => a.productName).join(', ')

  return (
    <div className="lume-banner" role="status">
      <FiAlertTriangle aria-hidden />
      <p>
        <strong>Mantenha os níveis de estoque.</strong>{' '}
        {critical.length > 0
          ? `Itens em situação crítica: ${names}.`
          : `Há produtos abaixo do mínimo: ${names}.`}
      </p>
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

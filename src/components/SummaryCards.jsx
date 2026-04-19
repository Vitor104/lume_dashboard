import PropTypes from 'prop-types'
import { FiAlertTriangle, FiLayers, FiShoppingCart } from 'react-icons/fi'
import { formatCurrency } from '../utils/formatters'

function SummaryCards({ totalSalesToday, itemsInShortage, totalStockValue }) {
  return (
    <div className="lume-summary-grid">
      <article className="lume-summary-card">
        <div className="lume-summary-card__head">
          <h3 className="lume-summary-card__title">Vendas hoje</h3>
          <span className="lume-summary-card__icon lume-summary-card__icon--orange" aria-hidden>
            <FiShoppingCart />
          </span>
        </div>
        <p className="lume-summary-card__value">{totalSalesToday}</p>
      </article>

      <article className="lume-summary-card">
        <div className="lume-summary-card__head">
          <h3 className="lume-summary-card__title">Itens em falta</h3>
          <span className="lume-summary-card__icon lume-summary-card__icon--danger" aria-hidden>
            <FiAlertTriangle />
          </span>
        </div>
        <p className="lume-summary-card__value">{itemsInShortage}</p>
      </article>

      <article className="lume-summary-card">
        <div className="lume-summary-card__head">
          <h3 className="lume-summary-card__title">Valor total em estoque</h3>
          <span className="lume-summary-card__icon lume-summary-card__icon--sage" aria-hidden>
            <FiLayers />
          </span>
        </div>
        <p className="lume-summary-card__value">{formatCurrency(totalStockValue)}</p>
      </article>
    </div>
  )
}

SummaryCards.propTypes = {
  totalSalesToday: PropTypes.number.isRequired,
  itemsInShortage: PropTypes.number.isRequired,
  totalStockValue: PropTypes.number.isRequired,
}

export default SummaryCards

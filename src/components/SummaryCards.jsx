import PropTypes from 'prop-types'
import { formatCurrency } from '../utils/formatters'

function SummaryCards({ totalSalesToday, itemsInShortage, totalStockValue }) {
  return (
    <div className="row g-3 mb-4">
      <div className="col-12 col-md-4">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <h3 className="h6 text-muted">Vendas hoje</h3>
            <p className="display-6 mb-0">{totalSalesToday}</p>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-4">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <h3 className="h6 text-muted">Itens em falta</h3>
            <p className="display-6 mb-0">{itemsInShortage}</p>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-4">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <h3 className="h6 text-muted">Valor total em estoque</h3>
            <p className="display-6 mb-0">{formatCurrency(totalStockValue)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

SummaryCards.propTypes = {
  totalSalesToday: PropTypes.number.isRequired,
  itemsInShortage: PropTypes.number.isRequired,
  totalStockValue: PropTypes.number.isRequired,
}

export default SummaryCards

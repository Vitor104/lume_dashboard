import PropTypes from 'prop-types'

function QuickActions({ onOpenSale, onOpenStock, onOpenProduct }) {
  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <h2 className="h5 mb-3">Acoes rapidas</h2>
        <div className="d-flex flex-wrap gap-2">
          <button type="button" className="btn btn-primary" onClick={onOpenSale}>
            + Venda
          </button>
          <button type="button" className="btn btn-outline-primary" onClick={onOpenStock}>
            + Entrada
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={onOpenProduct}>
            + Produto
          </button>
        </div>
      </div>
    </div>
  )
}

QuickActions.propTypes = {
  onOpenSale: PropTypes.func.isRequired,
  onOpenStock: PropTypes.func.isRequired,
  onOpenProduct: PropTypes.func.isRequired,
}

export default QuickActions

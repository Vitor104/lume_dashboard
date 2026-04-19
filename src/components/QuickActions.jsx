import PropTypes from 'prop-types'

function QuickActions({ onOpenSale, onOpenStock, onOpenProduct }) {
  return (
    <section aria-labelledby="quick-actions-title">
      <h2 id="quick-actions-title" className="lume-section-title">
        Ações rápidas
      </h2>
      <div className="lume-actions">
        <button type="button" className="lume-btn lume-btn--primary" onClick={onOpenSale}>
          <span className="lume-btn__plus" aria-hidden>
            +
          </span>
          Venda
        </button>
        <button type="button" className="lume-btn lume-btn--outline" onClick={onOpenStock}>
          <span className="lume-btn__plus" aria-hidden>
            +
          </span>
          Entrada
        </button>
        <button type="button" className="lume-btn lume-btn--outline" onClick={onOpenProduct}>
          <span className="lume-btn__plus" aria-hidden>
            +
          </span>
          Produto
        </button>
      </div>
    </section>
  )
}

QuickActions.propTypes = {
  onOpenSale: PropTypes.func.isRequired,
  onOpenStock: PropTypes.func.isRequired,
  onOpenProduct: PropTypes.func.isRequired,
}

export default QuickActions

import PropTypes from 'prop-types'

function StockTable({ products }) {
  return (
    <section className="lume-panel lume-stock" aria-labelledby="stock-title">
      <h2 id="stock-title" className="lume-panel__title">
        Estoque
      </h2>
      <div className="lume-table-wrap">
        <table className="lume-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Qtd atual</th>
              <th>Unidade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const isCritical = product.stock <= Math.max(1, Math.floor(product.minStockLimit / 2))
              const isWarning = product.stock <= product.minStockLimit
              const pillClass = isCritical ? 'lume-pill--crit' : isWarning ? 'lume-pill--warn' : 'lume-pill--ok'
              const statusLabel = isCritical ? 'Crítico' : isWarning ? 'Baixo' : 'OK'

              return (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.stock}</td>
                  <td>{product.unit}</td>
                  <td>
                    <span className={`lume-pill ${pillClass}`}>{statusLabel}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

StockTable.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      stock: PropTypes.number.isRequired,
      unit: PropTypes.string.isRequired,
      minStockLimit: PropTypes.number.isRequired,
    }),
  ).isRequired,
}

export default StockTable

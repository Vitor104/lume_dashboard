import PropTypes from 'prop-types'

function StockTable({ products }) {
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h2 className="h5 mb-3">Estoque</h2>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Qtd Atual</th>
                <th>Unidade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const isCritical = product.stock <= Math.max(1, Math.floor(product.minStockLimit / 2))
                const isWarning = product.stock <= product.minStockLimit
                const statusClass = isCritical ? 'danger' : isWarning ? 'warning' : 'success'
                const statusLabel = isCritical ? 'Critico' : isWarning ? 'Baixo' : 'OK'

                return (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.stock}</td>
                    <td>{product.unit}</td>
                    <td>
                      <span className={`badge text-bg-${statusClass}`}>{statusLabel}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
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

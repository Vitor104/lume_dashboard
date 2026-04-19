import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import { formatCurrency } from '../utils/formatters'

function RecentSales({ sales, products }) {
  const productMap = useMemo(
    () => Object.fromEntries(products.map((p) => [p.id, p])),
    [products],
  )

  const rows = useMemo(() => {
    return [...sales]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 12)
      .map((sale) => {
        const product = productMap[sale.productId]
        const unitPrice = product?.pricePerUnit || 0
        const amount = sale.quantity * unitPrice
        const time = new Date(sale.timestamp).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })
        return {
          id: sale.id,
          name: product?.name || 'Produto removido',
          time,
          amount,
        }
      })
  }, [sales, productMap])

  return (
    <section className="lume-panel lume-panel--recent" aria-labelledby="recent-sales-title">
      <header className="lume-panel__header lume-panel__header--split">
        <h2 id="recent-sales-title" className="lume-panel__title">
          Vendas recentes
        </h2>
        <span className="lume-panel__meta">Hoje</span>
      </header>

      {rows.length === 0 ? (
        <p className="lume-recent-empty">Nenhuma venda no período.</p>
      ) : (
        <ul className="lume-recent-list">
          {rows.map((row) => (
            <li key={row.id} className="lume-recent-row">
              <span className="lume-recent-row__icon" aria-hidden>
                <FiShoppingCart />
              </span>
              <div className="lume-recent-row__main">
                <span className="lume-recent-row__name">{row.name}</span>
                <span className="lume-recent-row__time">{row.time}</span>
              </div>
              <span className="lume-recent-row__amount">+{formatCurrency(row.amount)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

RecentSales.propTypes = {
  sales: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      productId: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      timestamp: PropTypes.number.isRequired,
    }),
  ).isRequired,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      pricePerUnit: PropTypes.number,
    }),
  ).isRequired,
}

export default RecentSales

import { useMemo, useState } from 'react'
import AlertList from '../components/AlertList'
import DashboardCharts from '../components/DashboardCharts'
import QuickActions from '../components/QuickActions'
import RecentSales from '../components/RecentSales'
import StockTable from '../components/StockTable'
import SummaryCards from '../components/SummaryCards'
import ProductModal from '../components/modals/ProductModal'
import SaleModal from '../components/modals/SaleModal'
import StockModal from '../components/modals/StockModal'
import { useAppContext } from '../hooks/useAppContext'
import { useDashboardCharts } from '../hooks/useDashboardCharts'
import { useDashboardStats } from '../hooks/useDashboardStats'
import AppNavbar from '../layouts/AppNavbar'

function DashboardPage() {
  const {
    products,
    sales,
    alerts,
    loading,
    loadError,
    registerSale,
    addStockEntry,
    addProduct,
    retryLoadData,
  } = useAppContext()

  const [modal, setModal] = useState(null)
  const stats = useDashboardStats(products, sales, alerts)
  const { salesByDay, topProducts } = useDashboardCharts(sales, products)

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [products],
  )

  if (loading) {
    return (
      <div className="lume-dashboard">
        <AppNavbar />
        <div className="lume-loading">
          <div className="lume-panel">Carregando dados iniciais…</div>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="lume-dashboard">
        <AppNavbar />
        <div className="lume-main">
          <div className="lume-container">
            <div className="lume-panel" role="alert">
              <h2 className="h5">Erro ao carregar</h2>
              <p className="text-muted mb-3">{loadError}</p>
              <button
                type="button"
                className="btn btn-primary"
                style={{ backgroundColor: 'var(--lume-orange)', borderColor: 'var(--lume-orange)' }}
                onClick={() => retryLoadData()}
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="lume-dashboard">
      <AppNavbar />

      <main className="lume-main">
        <div className="lume-container">
          <AlertList alerts={alerts} />

          <QuickActions
            onOpenSale={() => setModal('sale')}
            onOpenStock={() => setModal('stock')}
            onOpenProduct={() => setModal('product')}
          />

          <SummaryCards
            totalSalesToday={stats.totalSalesToday}
            itemsInShortage={stats.itemsInShortage}
            totalStockValue={stats.totalStockValue}
          />

          <DashboardCharts salesByDay={salesByDay} topProducts={topProducts} />

          <RecentSales sales={sales} products={products} />

          <StockTable products={sortedProducts} />
        </div>
      </main>

      <SaleModal
        show={modal === 'sale'}
        products={sortedProducts}
        onClose={() => setModal(null)}
        onSubmit={registerSale}
      />
      <StockModal
        show={modal === 'stock'}
        products={sortedProducts}
        onClose={() => setModal(null)}
        onSubmit={addStockEntry}
      />
      <ProductModal
        show={modal === 'product'}
        onClose={() => setModal(null)}
        onSubmit={addProduct}
      />
    </div>
  )
}

export default DashboardPage

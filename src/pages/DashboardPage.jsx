import { useMemo, useState } from 'react'
import AlertList from '../components/AlertList'
import QuickActions from '../components/QuickActions'
import StockTable from '../components/StockTable'
import SummaryCards from '../components/SummaryCards'
import ProductModal from '../components/modals/ProductModal'
import SaleModal from '../components/modals/SaleModal'
import StockModal from '../components/modals/StockModal'
import { useAppContext } from '../hooks/useAppContext'
import { useDashboardStats } from '../hooks/useDashboardStats'
import AppNavbar from '../layouts/AppNavbar'

function DashboardPage() {
  const {
    products,
    sales,
    alerts,
    loading,
    registerSale,
    addStockEntry,
    addProduct,
  } = useAppContext()

  const [modal, setModal] = useState(null)
  const stats = useDashboardStats(products, sales, alerts)

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [products],
  )

  if (loading) {
    return (
      <div className="container py-5">
        <div className="alert alert-info mb-0">Carregando dados iniciais...</div>
      </div>
    )
  }

  return (
    <>
      <AppNavbar />

      <main className="container py-4">
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

        <StockTable products={sortedProducts} />
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
    </>
  )
}

export default DashboardPage

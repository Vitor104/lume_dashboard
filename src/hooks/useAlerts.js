import { useMemo } from 'react'

export function useAlerts(products) {
  return useMemo(() => {
    return products
      .filter((product) => product.stock <= product.minStockLimit)
      .map((product) => ({
        productId: product.id,
        productName: product.name,
        level: product.stock <= Math.max(1, Math.floor(product.minStockLimit / 2))
          ? 'danger'
          : 'warning',
      }))
  }, [products])
}

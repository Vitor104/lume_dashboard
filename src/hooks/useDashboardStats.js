import { useMemo } from 'react'

export function useDashboardStats(products, sales, alerts) {
  return useMemo(() => {
    const today = new Date()
    const isSameDay = (time) => {
      const date = new Date(time)
      return (
        date.getDate() === today.getDate()
        && date.getMonth() === today.getMonth()
        && date.getFullYear() === today.getFullYear()
      )
    }

    const salesToday = sales.filter((sale) => isSameDay(sale.timestamp))
    const totalSalesToday = salesToday.reduce((acc, sale) => acc + sale.quantity, 0)
    const itemsInShortage = alerts.length
    const totalStockValue = products.reduce(
      (acc, product) => acc + product.stock * (product.pricePerUnit || 0),
      0,
    )

    return {
      totalSalesToday,
      itemsInShortage,
      totalStockValue,
    }
  }, [alerts.length, products, sales])
}

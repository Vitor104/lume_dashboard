import { useMemo } from 'react'

const PT_WEEKDAY_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function startOfDayMs(value) {
  const d = new Date(value)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function useDashboardCharts(sales, products) {
  return useMemo(() => {
    const productMap = Object.fromEntries(products.map((p) => [p.id, p]))
    const now = new Date()
    const dayBuckets = []

    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      dayBuckets.push({
        key: startOfDayMs(d),
        day: PT_WEEKDAY_SHORT[d.getDay()],
        vendas: 0,
      })
    }

    for (const sale of sales) {
      const key = startOfDayMs(sale.timestamp)
      const bucket = dayBuckets.find((b) => b.key === key)
      if (bucket) {
        bucket.vendas += sale.quantity
      }
    }

    const salesByProduct = {}
    for (const sale of sales) {
      salesByProduct[sale.productId] = (salesByProduct[sale.productId] || 0) + sale.quantity
    }

    const topProducts = Object.entries(salesByProduct)
      .map(([id, quantity]) => ({
        name: productMap[id]?.name || 'Desconhecido',
        quantity,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)

    return {
      salesByDay: dayBuckets.map(({ day, vendas }) => ({ day, vendas })),
      topProducts,
    }
  }, [sales, products])
}

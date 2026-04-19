import seed from '../data/seed.json'

const NETWORK_DELAY_MS = 350

const wait = (time = NETWORK_DELAY_MS) =>
  new Promise((resolve) => {
    setTimeout(resolve, time)
  })

export async function getInitialData() {
  await wait()

  return {
    products: structuredClone(seed.products),
    sales: structuredClone(seed.sales),
  }
}

export async function saveSale(saleData) {
  await wait()
  return { success: true, sale: { ...saleData } }
}

export async function updateProductStock(productId, newQty) {
  await wait()
  return { success: true, productId, stock: newQty }
}

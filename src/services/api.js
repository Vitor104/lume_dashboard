import { supabase } from './supabaseClient'

const NETWORK_DELAY_MS = 350

const wait = (time = NETWORK_DELAY_MS) =>
  new Promise((resolve) => {
    setTimeout(resolve, time)
  })

/**
 * Mapeia linha de `products` (Supabase) para o shape usado no dashboard.
 */
function mapProductRow(row) {
  return {
    id: row.id,
    name: row.name,
    stock: row.current_stock != null ? Number(row.current_stock) : 0,
    unit: row.unit ?? 'un',
    minStockLimit: row.min_stock_limit != null ? Number(row.min_stock_limit) : 0,
    pricePerUnit:
      row.price_per_unit != null
        ? Number(row.price_per_unit)
        : row.price != null
          ? Number(row.price)
          : 0,
  }
}

/**
 * Mapeia linha de `stock_movements` (venda) para o shape de `sales` no app.
 */
function mapSaleRow(row) {
  const created = row.created_at
  return {
    id: row.id,
    productId: row.product_id,
    quantity: Number(row.quantity) || 0,
    timestamp: created
      ? new Date(created).getTime()
      : Date.now(),
  }
}

/**
 * @param {string} err
 */
function getAuthErrorMessage(err) {
  if (!err) return 'Falha na autenticação.'
  const m = err.toString().toLowerCase()
  if (m.includes('invalid login')) return 'E-mail ou senha incorretos.'
  if (m.includes('email not confirmed')) return 'Confirme o e-mail antes de entrar.'
  if (m.includes('weak') || m.includes('password')) return 'Senha inválida ou fraca demais.'
  if (m.includes('user already registered')) return 'Já existe uma conta com este e-mail.'
  return err
}

/**
 * Login com e-mail e senha (session persistida pelo SDK no localStorage).
 * @param {string} email
 * @param {string} password
 */
export async function doLogin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })
  if (error) {
    const message = getAuthErrorMessage(error.message)
    const e = new Error(message)
    e.cause = error
    throw e
  }
  return data
}

/**
 * Criação de conta com metadados `full_name` e `business_name` no `user.data`.
 * @param {{ fullName: string, businessName: string, email: string, password: string }} param0
 */
export async function createUser({ fullName, businessName, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        full_name: fullName.trim(),
        business_name: businessName.trim(),
      },
    },
  })
  if (error) {
    const message = getAuthErrorMessage(error.message)
    const e = new Error(message)
    e.cause = error
    throw e
  }
  return data
}

/**
 * Carrega perfil, produtos e vendas (mov. tipo sale) do utilizador autenticado.
 * @returns {Promise<{ user: object, products: object[], sales: object[] } | null>}
 */
export async function loadCurrentUserData() {
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()
  if (userErr) throw userErr
  if (!user) return null

  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('full_name, business_name')
    .eq('id', user.id)
    .single()

  if (profileErr) throw profileErr

  const { data: productRows, error: productsErr } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', user.id)
    .order('name', { ascending: true })

  if (productsErr) throw productsErr

  const { data: saleRows, error: salesErr } = await supabase
    .from('stock_movements')
    .select('*')
    .eq('user_id', user.id)
    .eq('movement_type', 'sale')
    .order('created_at', { ascending: false })

  if (salesErr) throw salesErr

  const name =
    profile?.full_name?.trim() || user.user_metadata?.full_name || user.email || 'Utilizador'
  const businessName =
    profile?.business_name?.trim()
    || user.user_metadata?.business_name
    || 'Sem nome'

  return {
    user: {
      id: user.id,
      name,
      business_name: businessName,
    },
    products: (productRows ?? []).map(mapProductRow),
    sales: (saleRows ?? []).map(mapSaleRow),
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

export const api = {
  doLogin,
  createUser,
  loadCurrentUserData,
  saveSale,
  updateProductStock,
}

export default api

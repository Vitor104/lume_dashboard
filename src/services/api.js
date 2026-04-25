import { supabase } from './supabaseClient'

export const AUTH_REQUIRED = 'AUTH_REQUIRED'

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

function authRequiredError(message = 'Sessão inválida ou expirada. Inicie sessão novamente.') {
  const e = new Error(message)
  e.code = AUTH_REQUIRED
  return e
}

/**
 * Garante access token antes de chamadas REST a `products`.
 */
async function requireAccessToken() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error || !session?.access_token) {
    throw authRequiredError()
  }
  return session
}

/**
 * @param {unknown} err
 */
export function isAuthFailure(err) {
  if (!err || typeof err !== 'object') return false
  if ('code' in err && err.code === AUTH_REQUIRED) return true
  const cause = /** @type {{ status?: number }} */ (err).cause
  if (cause && typeof cause.status === 'number' && cause.status === 401) return true
  const status = /** @type {{ status?: number }} */ (err).status
  if (status === 401) return true
  const msg = 'message' in err && typeof err.message === 'string' ? err.message.toLowerCase() : ''
  if (msg && (msg.includes('jwt') || msg.includes('not authorized'))) return true
  return false
}

/**
 * Converte payload parcial (shape da app ou snake_case) para colunas `products`.
 * @param {Record<string, unknown>} partial
 */
function toProductUpdatePatch(partial) {
  /** @type {Record<string, unknown>} */
  const patch = {}
  if (partial.name !== undefined) patch.name = partial.name
  if (partial.unit !== undefined) patch.unit = partial.unit
  if (partial.current_stock !== undefined) {
    patch.current_stock = partial.current_stock
  } else if (partial.stock !== undefined) {
    patch.current_stock = partial.stock
  }
  if (partial.min_stock_limit !== undefined) {
    patch.min_stock_limit = partial.min_stock_limit
  } else if (partial.minStockLimit !== undefined) {
    patch.min_stock_limit = partial.minStockLimit
  }
  if (partial.price_per_unit !== undefined) {
    patch.price_per_unit = partial.price_per_unit
  } else if (partial.pricePerUnit !== undefined) {
    patch.price_per_unit = partial.pricePerUnit
  }
  return patch
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
 * Lista produtos do utilizador (RLS filtra pelo token). Ordem alfabética por nome.
 * @returns {Promise<ReturnType<typeof mapProductRow>[]>}
 */
export async function getProducts() {
  await requireAccessToken()
  const { data: productRows, error: productsErr } = await supabase
    .from('products')
    .select('*')
    .order('name', { ascending: true })

  if (productsErr) {
    const e = new Error(productsErr.message || 'Não foi possível listar produtos.')
    e.cause = productsErr
    if (productsErr.code === 'PGRST301' || /** @type {{ status?: number }} */ (productsErr).status === 401) {
      e.code = AUTH_REQUIRED
    }
    throw e
  }

  return (productRows ?? []).map(mapProductRow)
}

/**
 * Lista movimentações de venda (RLS filtra pelo token).
 * @returns {Promise<ReturnType<typeof mapSaleRow>[]>}
 */
export async function getSales() {
  await requireAccessToken()
  const { data: saleRows, error: salesErr } = await supabase
    .from('stock_movements')
    .select('*')
    .eq('movement_type', 'sale')
    .order('created_at', { ascending: false })

  if (salesErr) {
    const e = new Error(salesErr.message || 'Não foi possível listar vendas.')
    e.cause = salesErr
    if (salesErr.code === 'PGRST301' || /** @type {{ status?: number }} */ (salesErr).status === 401) {
      e.code = AUTH_REQUIRED
    }
    throw e
  }

  return (saleRows ?? []).map(mapSaleRow)
}

/**
 * @param {string} productId
 * @returns {Promise<ReturnType<typeof mapProductRow> | null>}
 */
export async function getProductById(productId) {
  await requireAccessToken()
  const { data, error } = await supabase.from('products').select('*').eq('id', productId).maybeSingle()

  if (error) {
    const e = new Error(error.message || 'Não foi possível carregar o produto.')
    e.cause = error
    if (/** @type {{ status?: number }} */ (error).status === 401) e.code = AUTH_REQUIRED
    throw e
  }

  return data ? mapProductRow(data) : null
}

/**
 * Regista venda ou reposição via RPC (histórico + `products.current_stock`).
 * @param {{ p_product_id: string, p_movement_type: 'sale' | 'restock', p_quantity: number }} payload
 */
export async function registerStockMovement(payload) {
  await requireAccessToken()
  const { p_product_id, p_movement_type, p_quantity } = payload
  if (!p_product_id) {
    throw new Error('p_product_id é obrigatório.')
  }
  if (p_movement_type !== 'sale' && p_movement_type !== 'restock') {
    throw new Error('p_movement_type deve ser "sale" ou "restock".')
  }
  const qty = Number(p_quantity)
  if (!Number.isFinite(qty) || qty <= 0) {
    throw new Error('p_quantity deve ser um número positivo.')
  }

  const { error } = await supabase.rpc('register_stock_movement', {
    p_product_id,
    p_movement_type,
    p_quantity: qty,
  })

  if (error) {
    const e = new Error(error.message || 'Não foi possível registar a movimentação.')
    e.cause = error
    const st = /** @type {{ status?: number }} */ (error).status
    if (st === 401) e.code = AUTH_REQUIRED
    throw e
  }
}

/**
 * @param {{ user_id: string, name: string, current_stock: number, unit: string, min_stock_limit: number, price_per_unit?: number }} payload
 */
export async function createProduct(payload) {
  await requireAccessToken()
  if (!payload?.user_id || !String(payload.user_id).trim()) {
    throw new Error('user_id é obrigatório.')
  }

  /** @type {Record<string, unknown>} */
  const row = {
    user_id: String(payload.user_id).trim(),
    name: String(payload.name).trim(),
    current_stock: Number(payload.current_stock),
    unit: String(payload.unit ?? 'un'),
    min_stock_limit: Number(payload.min_stock_limit),
  }
  if (payload.price_per_unit != null && !Number.isNaN(Number(payload.price_per_unit))) {
    row.price_per_unit = Number(payload.price_per_unit)
  }

  const { data, error } = await supabase.from('products').insert(row).select().single()

  if (error) {
    const e = new Error(error.message || 'Não foi possível criar o produto.')
    e.cause = error
    if (/** @type {{ status?: number }} */ (error).status === 401) e.code = AUTH_REQUIRED
    throw e
  }

  return mapProductRow(data)
}

/**
 * @param {string} id
 * @param {Record<string, unknown>} payload Campos alterados (shape app ou snake_case)
 */
export async function updateProduct(id, payload) {
  await requireAccessToken()
  const patch = toProductUpdatePatch(payload)
  if (Object.keys(patch).length === 0) {
    throw new Error('Nenhum campo para atualizar.')
  }

  const { data, error } = await supabase.from('products').update(patch).eq('id', id).select()

  if (error) {
    const e = new Error(error.message || 'Não foi possível atualizar o produto.')
    e.cause = error
    if (/** @type {{ status?: number }} */ (error).status === 401) e.code = AUTH_REQUIRED
    throw e
  }

  const rows = data ?? []
  if (rows.length === 0) {
    throw new Error('Produto não encontrado ou sem permissão para atualizar.')
  }

  return mapProductRow(rows[0])
}

/**
 * @param {string} id
 */
export async function deleteProduct(id) {
  await requireAccessToken()
  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) {
    const e = new Error(error.message || 'Não foi possível eliminar o produto.')
    e.cause = error
    if (/** @type {{ status?: number }} */ (error).status === 401) e.code = AUTH_REQUIRED
    throw e
  }
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

  const products = await getProducts()
  const sales = await getSales()

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
    products,
    sales,
  }
}

export const api = {
  doLogin,
  createUser,
  loadCurrentUserData,
  getProducts,
  getProductById,
  getSales,
  createProduct,
  updateProduct,
  deleteProduct,
  registerStockMovement,
}

export default api

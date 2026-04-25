import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from './AppContextInstance'
import { useAlerts } from '../hooks/useAlerts'
import { api, isAuthFailure } from '../services/api'

const initialState = {
  user: null,
  products: [],
  sales: [],
  loading: true,
  loadError: null,
}

function appReducer(state, action) {
  switch (action.type) {
    case 'LOADING_START':
      return {
        ...state,
        loading: true,
        loadError: null,
      }
    case 'INIT_DATA':
      return {
        ...state,
        user: action.payload.user,
        products: action.payload.products,
        sales: action.payload.sales,
        loadError: null,
        loading: false,
      }
    case 'LOAD_ERROR':
      return {
        ...state,
        user: null,
        products: [],
        sales: [],
        loadError: action.payload,
        loading: false,
      }
    case 'SET_SALES':
      return {
        ...state,
        sales: action.payload,
      }
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.payload],
      }
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload,
      }
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map((product) => (
          product.id === action.payload.id ? action.payload : product
        )),
      }
    case 'REMOVE_PRODUCT':
      return {
        ...state,
        products: state.products.filter((product) => product.id !== action.payload),
      }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(appReducer, initialState)
  const alerts = useAlerts(state.products)

  const redirectToLoginIfAuthError = useCallback(
    (err) => {
      if (isAuthFailure(err)) {
        navigate('/login', { replace: true })
        return true
      }
      return false
    },
    [navigate],
  )

  const loadData = useCallback(async () => {
    dispatch({ type: 'LOADING_START' })
    try {
      const data = await api.loadCurrentUserData()
      if (data) {
        dispatch({ type: 'INIT_DATA', payload: data })
      } else {
        navigate('/login', { replace: true })
      }
    } catch (err) {
      if (redirectToLoginIfAuthError(err)) {
        return
      }
      dispatch({
        type: 'LOAD_ERROR',
        payload: err?.message || 'Não foi possível carregar os dados.',
      })
    }
  }, [navigate, redirectToLoginIfAuthError])

  useEffect(() => {
    loadData()
  }, [loadData])

  const actions = useMemo(
    () => ({
      registerSale: async ({ productId, quantity }) => {
        const product = state.products.find((item) => item.id === productId)
        if (!product || quantity <= 0 || quantity > product.stock) {
          return { success: false, message: 'Quantidade de venda invalida.' }
        }

        try {
          await api.registerStockMovement({
            p_product_id: productId,
            p_movement_type: 'sale',
            p_quantity: quantity,
          })
          const updated = await api.getProductById(productId)
          const sales = await api.getSales()
          if (updated) {
            dispatch({ type: 'UPDATE_PRODUCT', payload: updated })
          }
          dispatch({ type: 'SET_SALES', payload: sales })
          return { success: true }
        } catch (err) {
          if (redirectToLoginIfAuthError(err)) {
            return { success: false, message: 'Sessão expirada.' }
          }
          return {
            success: false,
            message: err?.message || 'Não foi possível registar a venda.',
          }
        }
      },
      addStockEntry: async ({ productId, quantity }) => {
        const product = state.products.find((item) => item.id === productId)
        if (!product || quantity <= 0) {
          return { success: false, message: 'Entrada invalida.' }
        }

        try {
          await api.registerStockMovement({
            p_product_id: productId,
            p_movement_type: 'restock',
            p_quantity: quantity,
          })
          const updated = await api.getProductById(productId)
          if (updated) {
            dispatch({ type: 'UPDATE_PRODUCT', payload: updated })
          }
          return { success: true }
        } catch (err) {
          if (redirectToLoginIfAuthError(err)) {
            return { success: false, message: 'Sessão expirada.' }
          }
          return {
            success: false,
            message: err?.message || 'Não foi possível registar a entrada de stock.',
          }
        }
      },
      addProduct: async ({ name, unit, minStockLimit, stock, pricePerUnit }) => {
        const userId = state.user?.id
        if (!userId) {
          navigate('/login', { replace: true })
          return { success: false, message: 'Sessão inválida. Inicie sessão novamente.' }
        }

        try {
          const product = await api.createProduct({
            user_id: userId,
            name: name.trim(),
            current_stock: stock,
            unit,
            min_stock_limit: minStockLimit,
            price_per_unit: pricePerUnit,
          })
          dispatch({ type: 'ADD_PRODUCT', payload: product })
          return { success: true }
        } catch (err) {
          if (redirectToLoginIfAuthError(err)) {
            return { success: false, message: 'Sessão expirada.' }
          }
          return {
            success: false,
            message: err?.message || 'Não foi possível criar o produto.',
          }
        }
      },
      refreshProducts: async () => {
        try {
          const products = await api.getProducts()
          dispatch({ type: 'SET_PRODUCTS', payload: products })
          return { success: true }
        } catch (err) {
          if (redirectToLoginIfAuthError(err)) {
            return { success: false, message: 'Sessão expirada.' }
          }
          return {
            success: false,
            message: err?.message || 'Não foi possível atualizar a lista de produtos.',
          }
        }
      },
      updateProduct: async (id, partial) => {
        try {
          const product = await api.updateProduct(id, partial)
          dispatch({ type: 'UPDATE_PRODUCT', payload: product })
          return { success: true }
        } catch (err) {
          if (redirectToLoginIfAuthError(err)) {
            return { success: false, message: 'Sessão expirada.' }
          }
          return {
            success: false,
            message: err?.message || 'Não foi possível atualizar o produto.',
          }
        }
      },
      deleteProduct: async (id) => {
        try {
          await api.deleteProduct(id)
          dispatch({ type: 'REMOVE_PRODUCT', payload: id })
          return { success: true }
        } catch (err) {
          if (redirectToLoginIfAuthError(err)) {
            return { success: false, message: 'Sessão expirada.' }
          }
          return {
            success: false,
            message: err?.message || 'Não foi possível eliminar o produto.',
          }
        }
      },
      retryLoadData: loadData,
    }),
    [state.products, state.user?.id, loadData, navigate, redirectToLoginIfAuthError],
  )

  const value = useMemo(
    () => ({
      user: state.user,
      products: state.products,
      sales: state.sales,
      alerts,
      loading: state.loading,
      loadError: state.loadError,
      ...actions,
    }),
    [state.user, state.products, state.sales, alerts, state.loading, state.loadError, actions],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

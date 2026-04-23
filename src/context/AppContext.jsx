import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { AppContext } from './AppContextInstance'
import { useAlerts } from '../hooks/useAlerts'
import { api } from '../services/api'

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
    case 'ADD_SALE':
      return {
        ...state,
        products: state.products.map((product) => (
          product.id === action.payload.productId
            ? { ...product, stock: product.stock - action.payload.quantity }
            : product
        )),
        sales: [...state.sales, action.payload],
      }
    case 'ADD_STOCK_ENTRY':
      return {
        ...state,
        products: state.products.map((product) => (
          product.id === action.payload.productId
            ? { ...product, stock: product.stock + action.payload.quantity }
            : product
        )),
      }
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.payload],
      }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const alerts = useAlerts(state.products)

  const loadData = useCallback(async () => {
    dispatch({ type: 'LOADING_START' })
    try {
      const data = await api.loadCurrentUserData()
      if (data) {
        dispatch({ type: 'INIT_DATA', payload: data })
      } else {
        dispatch({
          type: 'LOAD_ERROR',
          payload: 'Sessão inválida ou expirada. Inicie sessão novamente.',
        })
      }
    } catch (err) {
      dispatch({
        type: 'LOAD_ERROR',
        payload: err?.message || 'Não foi possível carregar os dados.',
      })
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const actions = useMemo(
    () => ({
      registerSale: async ({ productId, quantity }) => {
        const sale = {
          id: uuidv4(),
          productId,
          quantity,
          timestamp: Date.now(),
        }

        const product = state.products.find((item) => item.id === productId)
        if (!product || quantity <= 0 || quantity > product.stock) {
          return { success: false, message: 'Quantidade de venda invalida.' }
        }

        await api.saveSale(sale)
        await api.updateProductStock(productId, product.stock - quantity)
        dispatch({ type: 'ADD_SALE', payload: sale })

        return { success: true }
      },
      addStockEntry: async ({ productId, quantity }) => {
        const product = state.products.find((item) => item.id === productId)
        if (!product || quantity <= 0) {
          return { success: false, message: 'Entrada invalida.' }
        }

        await api.updateProductStock(productId, product.stock + quantity)
        dispatch({ type: 'ADD_STOCK_ENTRY', payload: { productId, quantity } })

        return { success: true }
      },
      addProduct: ({ name, unit, minStockLimit, stock, pricePerUnit }) => {
        const product = {
          id: uuidv4(),
          name: name.trim(),
          unit,
          minStockLimit,
          stock,
          pricePerUnit,
        }

        dispatch({ type: 'ADD_PRODUCT', payload: product })
      },
      retryLoadData: loadData,
    }),
    [state.products, loadData],
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

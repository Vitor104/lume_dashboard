import PropTypes from 'prop-types'
import { useState } from 'react'

const initialForm = { productId: '', quantity: 1 }

function SaleModal({ show, products, onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm)

  if (!show) {
    return null
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await onSubmit({
      productId: form.productId,
      quantity: Number(form.quantity),
    })

    if (result.success) {
      setForm(initialForm)
      onClose()
    } else if (result.message) {
      window.alert(result.message)
    }
  }

  return (
    <>
      <div className="modal fade show d-block" id="saleModal" tabIndex="-1">
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleSubmit}>
            <div className="modal-header">
              <h2 className="modal-title fs-5">Registrar venda</h2>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body d-grid gap-3">
              <div>
                <label className="form-label">Produto</label>
                <select
                  className="form-select"
                  required
                  value={form.productId}
                  onChange={(event) => setForm((prev) => ({ ...prev, productId: event.target.value }))}
                >
                  <option value="">Selecione...</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.stock} {product.unit})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Quantidade</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={form.quantity}
                  onChange={(event) => setForm((prev) => ({ ...prev, quantity: event.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Salvar venda
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  )
}

SaleModal.propTypes = {
  show: PropTypes.bool.isRequired,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      stock: PropTypes.number.isRequired,
      unit: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default SaleModal

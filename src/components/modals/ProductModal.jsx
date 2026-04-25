import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

const initialForm = {
  name: '',
  unit: 'un',
  minStockLimit: 1,
  stock: 1,
  pricePerUnit: 0,
}

function ProductModal({ show, onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm)
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (show) {
      setSubmitError(null)
      setSubmitting(false)
    }
  }, [show])

  if (!show) {
    return null
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError(null)
    setSubmitting(true)

    try {
      const result = await onSubmit({
        name: form.name,
        unit: form.unit,
        minStockLimit: Number(form.minStockLimit),
        stock: Number(form.stock),
        pricePerUnit: Number(form.pricePerUnit),
      })

      if (result?.success) {
        setForm(initialForm)
        onClose()
      } else {
        setSubmitError(result?.message || 'Não foi possível guardar o produto.')
      }
    } catch (err) {
      setSubmitError(err?.message || 'Não foi possível guardar o produto.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="modal fade show d-block" id="productModal" tabIndex="-1">
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleSubmit}>
            <div className="modal-header">
              <h2 className="modal-title fs-5">Cadastrar produto</h2>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body d-grid gap-3">
              {submitError ? (
                <div className="alert alert-danger mb-0" role="alert">
                  {submitError}
                </div>
              ) : null}
              <div>
                <label className="form-label">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  required
                />
              </div>
              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label">Unidade</label>
                  <select
                    className="form-select"
                    value={form.unit}
                    onChange={(event) => setForm((prev) => ({ ...prev, unit: event.target.value }))}
                  >
                    <option value="kg">kg</option>
                    <option value="un">un</option>
                    <option value="ml">ml</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label">Limite minimo</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={form.minStockLimit}
                    onChange={(event) => setForm((prev) => ({ ...prev, minStockLimit: event.target.value }))}
                  />
                </div>
              </div>
              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label">Estoque inicial</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={form.stock}
                    onChange={(event) => setForm((prev) => ({ ...prev, stock: event.target.value }))}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Valor unitario (opcional)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-control"
                    value={form.pricePerUnit}
                    onChange={(event) => setForm((prev) => ({ ...prev, pricePerUnit: event.target.value }))}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'A guardar…' : 'Salvar produto'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  )
}

ProductModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default ProductModal

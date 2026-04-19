import PropTypes from 'prop-types'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const ORANGE = '#E67E45'
const SAGE = '#8BA88E'

function DashboardCharts({ salesByDay, topProducts }) {
  const maxBar = Math.max(1, ...topProducts.map((p) => p.quantity))

  return (
    <div className="lume-charts-grid">
      <section className="lume-panel lume-panel--chart" aria-labelledby="chart-sales-title">
        <header className="lume-panel__header">
          <h2 id="chart-sales-title" className="lume-panel__title">
            Vendas — últimos 7 dias
          </h2>
        </header>
        <div className="lume-chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesByDay} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="lumeSalesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ORANGE} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={ORANGE} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 6" vertical={false} stroke="#e8eaed" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#6b7c8c', fontSize: 12 }}
              />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6b7c8c', fontSize: 12 }} width={36} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #e8eaed',
                  boxShadow: '0 8px 24px rgba(44, 62, 80, 0.08)',
                }}
                formatter={(value) => [`${value} un.`, 'Vendas']}
              />
              <Area
                type="monotone"
                dataKey="vendas"
                stroke={ORANGE}
                strokeWidth={2.5}
                fill="url(#lumeSalesFill)"
                dot={{ r: 4, fill: '#fff', stroke: ORANGE, strokeWidth: 2 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="lume-panel lume-panel--chart" aria-labelledby="chart-top-title">
        <header className="lume-panel__header">
          <h2 id="chart-top-title" className="lume-panel__title">
            Top 5 produtos mais vendidos
          </h2>
        </header>
        <div className="lume-chart-wrap lume-chart-wrap--bars">
          {topProducts.length === 0 ? (
            <p className="lume-chart-empty">Nenhuma venda registrada ainda.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={topProducts}
                margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="2 6" horizontal={false} stroke="#e8eaed" />
                <XAxis type="number" domain={[0, maxBar]} tickLine={false} axisLine={false} tick={{ fill: '#6b7c8c', fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#2c3e50', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #e8eaed',
                    boxShadow: '0 8px 24px rgba(44, 62, 80, 0.08)',
                  }}
                  formatter={(value) => [`${value} un.`, 'Quantidade']}
                />
                <Bar dataKey="quantity" fill={SAGE} radius={[0, 8, 8, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>
    </div>
  )
}

DashboardCharts.propTypes = {
  salesByDay: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired,
      vendas: PropTypes.number.isRequired,
    }),
  ).isRequired,
  topProducts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
    }),
  ).isRequired,
}

export default DashboardCharts

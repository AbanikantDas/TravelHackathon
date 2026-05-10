import React from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { formatCurrency } from '../utils/helpers'

const PIE_COLORS  = ['#1B4D5C', '#C4703A', '#E8C97E', '#8B5CF6', '#10B981']
const BAR_COLOR   = '#C4703A'

/**
 * BudgetChart — reusable chart component used on BudgetPage and DashboardPage.
 *
 * Props:
 *   type        — 'pie' | 'bar'   (default: 'pie')
 *   data        — array of { name, value } objects
 *   height      — chart height in px (default: 220)
 *   currency    — prefix symbol (default: '₹')
 */
export default function BudgetChart({ type = 'pie', data = [], height = 220, currency = '₹' }) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-sm text-ink-muted"
        style={{ height }}
      >
        No data to display
      </div>
    )
  }

  if (type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            paddingAngle={3}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `${currency}${Number(v).toLocaleString('en-IN')}`} />
          <Legend iconType="circle" iconSize={8} />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  // bar chart
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#EDE8E0" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis
          tick={{ fontSize: 11 }}
          tickFormatter={(v) =>
            `${currency}${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`
          }
        />
        <Tooltip formatter={(v) => `${currency}${Number(v).toLocaleString('en-IN')}`} />
        <Bar dataKey="value" fill={BAR_COLOR} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

"use client"

import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export function AnalyticsPanel() {
  const engineUsageData = [
    { name: "Retrieval", value: 45, fill: "var(--color-chart-1)" },
    { name: "Calculator", value: 25, fill: "var(--color-chart-2)" },
    { name: "Explanation", value: 20, fill: "var(--color-chart-3)" },
    { name: "Rule-Based", value: 10, fill: "var(--color-chart-4)" },
  ]

  const routingAccuracyData = [
    { hour: "0:00", accuracy: 88 },
    { hour: "2:00", accuracy: 91 },
    { hour: "4:00", accuracy: 89 },
    { hour: "6:00", accuracy: 94 },
    { hour: "8:00", accuracy: 96 },
    { hour: "10:00", accuracy: 93 },
    { hour: "12:00", accuracy: 92 },
  ]

  const modelScoresData = [
    { model: "Intent Detection", score: 0.94 },
    { model: "Domain Classification", score: 0.91 },
    { model: "Safety Filter", score: 0.97 },
    { model: "Response Quality", score: 0.88 },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Engine Usage */}
        <Card className="bg-white dark:bg-slate-900 border border-border p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Engine Usage Stats</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={engineUsageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {engineUsageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Routing Accuracy */}
        <Card className="bg-white dark:bg-slate-900 border border-border p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Routing Accuracy (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={routingAccuracyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="hour" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-foreground)",
                }}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ fill: "var(--color-primary)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Model Scores */}
      <Card className="bg-white dark:bg-slate-900 border border-border p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Model Performance Scores</h3>
        <div className="space-y-4">
          {modelScoresData.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-foreground font-medium">{item.model}</span>
                <span className="text-sm font-semibold text-primary">{(item.score * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${item.score * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

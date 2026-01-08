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

import { useEffect, useState } from "react"

export function AnalyticsPanel() {
  const [feedbackStats, setFeedbackStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:8000/metrics/feedback")
      .then((res) => res.json())
      .then((data) => {
        setFeedbackStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Analytics</h2>

      <Card className="bg-white dark:bg-slate-900 border border-border p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">User Feedback Overview</h3>
        {loading ? (
          <div>Loading feedback analytics...</div>
        ) : feedbackStats ? (
          <div className="space-y-2">
            <div>Total Feedback: <b>{feedbackStats.count}</b></div>
            <div>👍 Helpful: <b>{feedbackStats.helpful}</b> &nbsp; | &nbsp; 👎 Not Helpful: <b>{feedbackStats.not_helpful}</b></div>
            <div className="mt-2">
              <b>By Engine:</b>
              <ul className="ml-4 list-disc">
                {Object.entries(feedbackStats.by_engine || {}).map(([engine, stats]: any) => (
                  <li key={engine}>{engine}: 👍 {stats[1] || 0}, 👎 {stats[0] || 0}</li>
                ))}
              </ul>
            </div>
            <div className="mt-2">
              <b>By Domain:</b>
              <ul className="ml-4 list-disc">
                {Object.entries(feedbackStats.by_domain || {}).map(([domain, stats]: any) => (
                  <li key={domain}>{domain}: 👍 {stats[1] || 0}, 👎 {stats[0] || 0}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div>No feedback data available.</div>
        )}
      </Card>
    </div>
  )
}

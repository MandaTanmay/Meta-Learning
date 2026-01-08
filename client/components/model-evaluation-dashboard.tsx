"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"

interface ModelMetrics {
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  confusionMatrix: number[][]
  lastEvaluated: string
  modelVersion: string
  datasetSize: number
  explanation: string
}

interface DashboardData {
  domainClassification: ModelMetrics
  intentClassification: ModelMetrics
  answerQuality: ModelMetrics
}

export function ModelEvaluationDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [domainRes, intentRes, qualityRes] = await Promise.all([
          fetch("http://localhost:8000/metrics/domain"),
          fetch("http://localhost:8000/metrics/intent"),
          fetch("http://localhost:8000/metrics/quality")
        ])
        const [domain, intent, quality] = await Promise.all([
          domainRes.json(),
          intentRes.json(),
          qualityRes.json()
        ])
        setData({
          domainClassification: {
            accuracy: domain.accuracy ?? 0,
            precision: domain.precision ?? 0,
            recall: domain.recall ?? 0,
            f1Score: domain.f1_score ?? 0,
            confusionMatrix: domain.confusion_matrix ?? [[0,0],[0,0]],
            lastEvaluated: domain.last_evaluated ?? "-",
            modelVersion: domain.model_version ?? "-",
            datasetSize: domain.dataset_size ?? 0,
            explanation: domain.explanation ?? "Domain classification metrics."
          },
          intentClassification: {
            accuracy: intent.accuracy ?? 0,
            precision: intent.precision ?? 0,
            recall: intent.recall ?? 0,
            f1Score: intent.f1_score ?? 0,
            confusionMatrix: intent.confusion_matrix ?? [[0,0],[0,0]],
            lastEvaluated: intent.last_evaluated ?? "-",
            modelVersion: intent.model_version ?? "-",
            datasetSize: intent.dataset_size ?? 0,
            explanation: intent.explanation ?? "Intent classification metrics."
          },
          answerQuality: {
            accuracy: quality.accuracy ?? 0,
            precision: quality.precision ?? 0,
            recall: quality.recall ?? 0,
            f1Score: quality.f1_score ?? 0,
            confusionMatrix: quality.confusion_matrix ?? [[0,0],[0,0]],
            lastEvaluated: quality.last_evaluated ?? "-",
            modelVersion: quality.model_version ?? "-",
            datasetSize: quality.dataset_size ?? 0,
            explanation: quality.explanation ?? "Answer quality metrics."
          }
        })
      } catch (error) {
        console.error("Failed to fetch model metrics:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMetrics()
  }, [])

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-slate-900 border border-border p-6">
        <div className="h-96 flex items-center justify-center text-muted-foreground">
          Loading model evaluation metrics...
        </div>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card className="bg-white dark:bg-slate-900 border border-border p-6">
        <div className="h-96 flex items-center justify-center text-muted-foreground">
          Unable to load metrics. Please try again later.
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-white dark:bg-slate-900 border border-border p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Model Evaluation & Performance</h2>
        <p className="text-sm text-muted-foreground">Machine Learning Model Metrics for Academic System</p>
      </div>

      <Tabs defaultValue="domain" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="domain">Domain Classification</TabsTrigger>
          <TabsTrigger value="intent">Intent Classification</TabsTrigger>
          <TabsTrigger value="quality">Answer Quality</TabsTrigger>
        </TabsList>

        {/* Domain Classification Tab */}
        <TabsContent value="domain" className="space-y-6">
          <ModelMetricsPanel metrics={data.domainClassification} />
        </TabsContent>

        {/* Intent Classification Tab */}
        <TabsContent value="intent" className="space-y-6">
          <ModelMetricsPanel metrics={data.intentClassification} />
        </TabsContent>

        {/* Answer Quality Tab */}
        <TabsContent value="quality" className="space-y-6">
          <ModelMetricsPanel metrics={data.answerQuality} />
        </TabsContent>
      </Tabs>
    </Card>
  )
}

function ModelMetricsPanel({ metrics }: { metrics: ModelMetrics }) {
  return (
    <div className="space-y-6">
      {/* Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          label="Accuracy"
          value={metrics.accuracy}
          tooltip="Percentage of correct predictions out of all predictions"
        />
        <MetricCard
          label="Precision"
          value={metrics.precision}
          tooltip="Ratio of true positives to all positive predictions"
        />
        <MetricCard label="Recall" value={metrics.recall} tooltip="Ratio of true positives to all actual positives" />
        <MetricCard label="F1-Score" value={metrics.f1Score} tooltip="Harmonic mean of precision and recall" />
      </div>

      {/* Accuracy Progress Bar */}
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-foreground">Overall Model Accuracy</label>
          <span className="text-lg font-bold text-primary">{Math.round(metrics.accuracy * 100)}%</span>
        </div>
        <Progress value={metrics.accuracy * 100} className="h-3" />
      </div>

      {/* Confusion Matrix */}
      <div className="bg-muted rounded-lg p-4">
        <h4 className="text-sm font-semibold text-foreground mb-4">Confusion Matrix</h4>
        <ConfusionMatrix matrix={metrics.confusionMatrix} />
      </div>

      {/* Explainable AI Section */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Explainable AI</h4>
        <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{metrics.explanation}</p>
      </div>

      {/* Model Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-muted rounded p-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Last Evaluated</p>
          <p className="text-foreground">{metrics.lastEvaluated}</p>
        </div>
        <div className="bg-muted rounded p-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Model Version</p>
          <p className="text-foreground">{metrics.modelVersion}</p>
        </div>
        <div className="bg-muted rounded p-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Dataset Size</p>
          <p className="text-foreground">{metrics.datasetSize.toLocaleString()} samples</p>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, tooltip }: { label: string; value: number; tooltip: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-muted rounded-lg p-4 cursor-help">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">{label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-primary">{Math.round(value * 100)}</span>
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-sm">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function ConfusionMatrix({ matrix }: { matrix: number[][] }) {
  const labels = ["Class A", "Class B", "Class C"]
  const maxValue = Math.max(...matrix.flat())

  const getIntensity = (value: number) => {
    const ratio = value / maxValue
    if (ratio > 0.8) return "bg-blue-600 text-white"
    if (ratio > 0.6) return "bg-blue-400 text-white"
    if (ratio > 0.4) return "bg-blue-200 text-foreground"
    return "bg-blue-100 text-foreground"
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="border border-border p-2 bg-muted text-foreground font-semibold">Actual \ Predicted</th>
            {labels.map((label) => (
              <th key={label} className="border border-border p-2 bg-muted text-foreground font-semibold">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, rowIdx) => (
            <tr key={rowIdx}>
              <td className="border border-border p-2 bg-muted text-foreground font-semibold">{labels[rowIdx]}</td>
              {row.map((value, colIdx) => (
                <td
                  key={colIdx}
                  className={`border border-border p-3 text-center font-semibold ${getIntensity(value)}`}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

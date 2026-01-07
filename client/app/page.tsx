"use client"

import { useState } from "react"
import { QueryInterface } from "@/components/query-interface"
import { ResponsePanel } from "@/components/response-panel"
import { CalculatorTab } from "@/components/calculator-tab"
import { AnalyticsPanel } from "@/components/analytics-panel"
import { Card } from "@/components/ui/card"
import { ModelEvaluationDashboard } from "@/components/model-evaluation-dashboard"

interface QueryResponse {
  answer: string
  domain: string
  intent: string
  engine: string
  confidence: number
  verified: boolean
  inScope: boolean
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"query" | "calculator" | "models">("query")
  const [response, setResponse] = useState<QueryResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [queryHistory, setQueryHistory] = useState<string[]>([])

  const handleQuery = async (query: string) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const mockResponse: QueryResponse = {
        answer: `Based on the curriculum standards, the answer to "${query}" involves understanding key concepts from the core material. The detailed explanation below breaks down the fundamental principles and their applications in academic context.`,
        domain: "Student Domain",
        intent: "Conceptual Understanding",
        engine: "Retrieval + Explanation",
        confidence: 0.94,
        verified: true,
        inScope: Math.random() > 0.3,
      }
      setResponse(mockResponse)
      setQueryHistory([query, ...queryHistory.slice(0, 4)])
      setIsLoading(false)
    }, 1200)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Academic Dashboard</h1>
              <p className="mt-1 text-sm text-muted-foreground">Meta-Learning AI Decision Support</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Controlled System</p>
              <p className="text-xs text-muted-foreground">Evidence-Based Responses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border bg-card sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("query")}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "query"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Query System
            </button>
            <button
              onClick={() => setActiveTab("calculator")}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "calculator"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              CGPA & Attendance Calculator
            </button>
            <button
              onClick={() => setActiveTab("models")}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "models"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Model Evaluation
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === "query" ? (
          <div className="space-y-8">
            {/* Query Interface */}
            <QueryInterface onQuery={handleQuery} isLoading={isLoading} />

            {/* Domain Indicator and Response */}
            {response && (
              <div className="space-y-6">
                {/* Domain Boundary Indicator */}
                <Card className="bg-white dark:bg-slate-900 border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-4 w-4 rounded-full ${response.inScope ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="font-semibold text-foreground">
                      {response.inScope ? "🟢 Student Domain" : "🔴 Outside Academic Scope"}
                    </span>
                    <span className="text-sm text-muted-foreground ml-auto">
                      {response.inScope
                        ? "Question aligns with academic curriculum"
                        : "Question may require external resources"}
                    </span>
                  </div>
                </Card>

                {/* Response Panel */}
                <ResponsePanel response={response} />
              </div>
            )}

            {/* Query History */}
            {queryHistory.length > 0 && (
              <Card className="bg-white dark:bg-slate-900 border border-border p-6">
                <h3 className="text-sm font-semibold text-foreground mb-3">Recent Queries</h3>
                <div className="space-y-2">
                  {queryHistory.map((query, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuery(query)}
                      className="block w-full text-left px-3 py-2 rounded text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </div>
        ) : activeTab === "calculator" ? (
          <CalculatorTab />
        ) : (
          <ModelEvaluationDashboard />
        )}

        {/* Analytics Panel */}
        <div className="mt-12">
          <AnalyticsPanel />
        </div>
      </div>
    </main>
  )
}

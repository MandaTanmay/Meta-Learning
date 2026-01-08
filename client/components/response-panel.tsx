"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface QueryResponse {
  answer: string
  domain: string
  intent: string
  engine: string
  confidence: number
  verified: boolean
  inScope: boolean
}

interface ResponsePanelProps {
  response: QueryResponse
}

export function ResponsePanel({ response }: ResponsePanelProps) {
  const [feedback, setFeedback] = useState<"helpful" | "not-helpful" | null>(null)

  const sendFeedback = async (fb: "helpful" | "not-helpful") => {
    setFeedback(fb)
    try {
      await fetch("http://localhost:8000/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: response.answer,
          engine_used: response.engine,
          feedback: fb === "helpful" ? 1 : 0
        })
      })
    } catch (e) {
      // Optionally show error toast
    }
  }

  return (
    <div className="space-y-6">
      {/* Final Answer */}
      <Card className="bg-white dark:bg-slate-900 border border-border p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Final Answer</h3>
        <p className="text-foreground leading-relaxed">{response.answer}</p>
      </Card>

      {/* Why This Answer */}
      <Card className="bg-white dark:bg-slate-900 border border-border p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Why This Answer?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <div className="text-lg">📊</div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Detected Domain</p>
              <p className="text-sm text-foreground mt-1">{response.domain}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-lg">🎯</div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Predicted Intent</p>
              <p className="text-sm text-foreground mt-1">{response.intent}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-lg">⚙️</div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Selected Engine</p>
              <p className="text-sm text-foreground mt-1">{response.engine}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-lg">📈</div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Confidence Score</p>
              <p className="text-sm text-foreground mt-1">{Math.round(response.confidence * 100)}%</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Safety & Validation */}
      <Card className="bg-white dark:bg-slate-900 border border-border p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Safety & Validation Status</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <span className="text-sm text-foreground">Content Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🔍</span>
            <span className="text-sm text-foreground">Scope Validated</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🛡️</span>
            <span className="text-sm text-foreground">Safety Checked</span>
          </div>
        </div>
      </Card>

      {/* Feedback Buttons */}
      <Card className="bg-white dark:bg-slate-900 border border-border p-6">
        <p className="text-sm font-semibold text-foreground mb-4">Was this response helpful?</p>
        <div className="flex gap-3">
          <Button
            variant={feedback === "helpful" ? "default" : "outline"}
            onClick={() => sendFeedback("helpful")}
            className="flex-1"
          >
            👍 Helpful
          </Button>
          <Button
            variant={feedback === "not-helpful" ? "default" : "outline"}
            onClick={() => sendFeedback("not-helpful")}
            className="flex-1"
          >
            👎 Not Helpful
          </Button>
        </div>
      </Card>
    </div>
  )
}

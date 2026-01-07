"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface QueryInterfaceProps {
  onQuery: (query: string) => void
  isLoading: boolean
}

export function QueryInterface({ onQuery, isLoading }: QueryInterfaceProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onQuery(query)
      setQuery("")
    }
  }

  return (
    <Card className="bg-white dark:bg-slate-900 border border-border p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="query" className="block text-sm font-semibold text-foreground">
          Ask Academic Question
        </label>
        <textarea
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your academic question here..."
          className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          rows={4}
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
        >
          {isLoading ? "Processing..." : "Submit Question"}
        </Button>
      </form>
    </Card>
  )
}

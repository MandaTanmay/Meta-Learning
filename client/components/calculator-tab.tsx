"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function CalculatorTab() {
  const [marks, setMarks] = useState("")
  const [credits, setCredits] = useState("")
  const [attendanceDays, setAttendanceDays] = useState("")
  const [totalDays, setTotalDays] = useState("")
  const [results, setResults] = useState<{
    cgpa: number
    attendance: number
  } | null>(null)

  const handleCalculate = () => {
    if (marks && credits && attendanceDays && totalDays) {
      const marksNum = Number.parseFloat(marks)
      const creditsNum = Number.parseFloat(credits)
      const attendancePercentage = (Number.parseFloat(attendanceDays) / Number.parseFloat(totalDays)) * 100

      // Simple CGPA calculation (4.0 scale)
      let cgpa = 0
      if (marksNum >= 90) cgpa = 4.0
      else if (marksNum >= 80) cgpa = 3.5
      else if (marksNum >= 70) cgpa = 3.0
      else if (marksNum >= 60) cgpa = 2.5
      else if (marksNum >= 50) cgpa = 2.0
      else cgpa = 0

      setResults({
        cgpa: Math.min(cgpa, 4.0),
        attendance: Math.min(attendancePercentage, 100),
      })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <Card className="bg-white dark:bg-slate-900 border border-border p-6 h-fit">
        <h3 className="text-lg font-semibold text-foreground mb-6">Calculator</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Marks / Score</label>
            <input
              type="number"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              placeholder="Enter marks (0-100)"
              className="w-full px-3 py-2 rounded border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Credits</label>
            <input
              type="number"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              placeholder="Enter credits"
              className="w-full px-3 py-2 rounded border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Attendance Days</label>
            <input
              type="number"
              value={attendanceDays}
              onChange={(e) => setAttendanceDays(e.target.value)}
              placeholder="Days present"
              className="w-full px-3 py-2 rounded border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Total Days</label>
            <input
              type="number"
              value={totalDays}
              onChange={(e) => setTotalDays(e.target.value)}
              placeholder="Total class days"
              className="w-full px-3 py-2 rounded border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button
            onClick={handleCalculate}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          >
            Calculate
          </Button>
        </div>
      </Card>

      {/* Results Section */}
      {results && (
        <Card className="bg-white dark:bg-slate-900 border border-border p-6 h-fit">
          <h3 className="text-lg font-semibold text-foreground mb-6">Results</h3>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase font-semibold mb-2">CGPA</p>
              <div className="text-4xl font-bold text-primary">{results.cgpa.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-2">4.0 scale</p>
            </div>
            <div className="border-t border-border pt-6">
              <p className="text-sm text-muted-foreground uppercase font-semibold mb-2">Attendance</p>
              <div className="text-4xl font-bold text-accent">{results.attendance.toFixed(1)}%</div>
              <div className="mt-4 w-full bg-muted rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all"
                  style={{ width: `${results.attendance}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

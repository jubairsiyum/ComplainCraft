import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { AlertCircle, Scale } from "lucide-react"
import type { LawSection } from "@/lib/consumerLaw"

interface Analysis {
  identifiedIssue: string
  extractedDetails: string
  violatedLaw: string
  potentialPenalty: string
  applicableSections?: LawSection[]
}

interface AnalysisCardProps {
  analysis: Analysis
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardTitle className="text-2xl">Complaint Analysis Summary (অভিযোগ বিশ্লেষণ সারাংশ)</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 p-4 bg-accent/50 rounded-lg">
            <h4 className="font-semibold text-base text-primary">Identified Issue:</h4>
            <p className="text-base">{analysis.identifiedIssue}</p>
          </div>
          <div className="space-y-2 p-4 bg-accent/50 rounded-lg">
            <h4 className="font-semibold text-base text-primary">Extracted Details:</h4>
            <p className="text-base">{analysis.extractedDetails}</p>
          </div>
          <div className="space-y-2 p-4 bg-accent/50 rounded-lg">
            <h4 className="font-semibold text-base text-primary">Violated Law:</h4>
            <p className="text-base">{analysis.violatedLaw}</p>
          </div>
          <div className="space-y-2 p-4 bg-accent/50 rounded-lg">
            <h4 className="font-semibold text-base text-primary">Potential Penalty:</h4>
            <p className="text-base">{analysis.potentialPenalty}</p>
          </div>
        </div>

        {/* Applicable Law Sections */}
        {analysis.applicableSections && analysis.applicableSections.length > 0 && (
          <div className="border-t pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Applicable Law Sections & Justice You Can Seek:</h3>
            </div>
            <div className="space-y-4">
              {analysis.applicableSections.map((section) => (
                <div key={section.section} className="border rounded-lg p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2 flex-1">
                      <h4 className="font-bold text-base text-red-900 dark:text-red-100">
                        Section {section.section} - ধারা {section.section}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        <strong>Offence:</strong> {section.offence}
                      </p>
                      <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                        <strong>Punishment / শাস্তি:</strong> {section.punishment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

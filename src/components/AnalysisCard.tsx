import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface Analysis {
  identifiedIssue: string
  extractedDetails: string
  violatedLaw: string
  potentialPenalty: string
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
      <CardContent className="pt-6">
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
      </CardContent>
    </Card>
  )
}

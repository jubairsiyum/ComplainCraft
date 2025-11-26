import { Loader2 } from "lucide-react"

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-8" role="status" aria-live="polite">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-3 text-lg text-muted-foreground">Analyzing...</span>
    </div>
  )
}

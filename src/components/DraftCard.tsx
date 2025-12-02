"use client";

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Check, Copy, Edit, Save, Printer, Download } from "lucide-react"

interface DraftCardProps {
  draft: string
}

export function DraftCard({ draft }: DraftCardProps) {
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedDraft, setEditedDraft] = useState(draft)

  const copyDraft = async () => {
    const textToCopy = isEditing ? editedDraft : draft
    
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const handleSaveEdit = () => {
    setIsEditing(false)
  }

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800')
    if (printWindow) {
      const content = isEditing ? editedDraft : draft
      printWindow.document.write('<html><head><title>Complaint Draft</title>')
      printWindow.document.write('<style>body { font-family: "Noto Sans Bengali", sans-serif; padding: 40px; line-height: 1.8; } pre { white-space: pre-wrap; font-family: inherit; }</style>')
      printWindow.document.write('</head><body>')
      printWindow.document.write('<pre>' + content + '</pre>')
      printWindow.document.write('</body></html>')
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleDownload = () => {
    const content = isEditing ? editedDraft : draft
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'complaint-draft.txt'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Your Formal Complaint Draft (আনুষ্ঠানিক অভিযোগপত্র)</CardTitle>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Textarea
          value={isEditing ? editedDraft : draft}
          onChange={(e) => setEditedDraft(e.target.value)}
          readOnly={!isEditing}
          className={`min-h-[300px] text-base leading-relaxed ${
            isEditing ? 'border-2 border-primary' : 'border-muted'
          }`}
          aria-label="Generated complaint draft"
        />
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 bg-muted/30">
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          {isEditing && (
            <Button 
              onClick={handleSaveEdit} 
              className="flex items-center gap-2 flex-1 sm:flex-none"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          )}
          
          <Button 
            onClick={copyDraft} 
            variant="outline" 
            className="flex items-center gap-2 flex-1 sm:flex-none"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Text
              </>
            )}
          </Button>

          <Button 
            onClick={handlePrint} 
            variant="outline"
            className="flex items-center gap-2 flex-1 sm:flex-none"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>

          <Button 
            onClick={handleDownload} 
            variant="outline"
            className="flex items-center gap-2 flex-1 sm:flex-none"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
        
        {copied && (
          <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1" role="status" aria-live="polite">
            <Check className="h-4 w-4" />
            Successfully copied to clipboard
          </span>
        )}
      </CardFooter>
    </Card>
  )
}

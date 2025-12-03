"use client";

import { useState } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Check, Copy, Edit, Save, Printer, Download, Eye, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { generateComplaintPDF } from "@/lib/pdfGenerator"
import type { ComplaintData } from "./ComplaintForm"

interface DraftCardProps {
  draft: string
  complaintData: ComplaintData
}

export function DraftCard({ draft, complaintData }: DraftCardProps) {
  const { data: session } = useSession()
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedDraft, setEditedDraft] = useState(draft)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [downloadingPDF, setDownloadingPDF] = useState(false)
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null)

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

  const handleDownload = async () => {
    try {
      setDownloadingPDF(true)
      
      // Fetch user profile for PDF generation
      let userInfo = undefined
      if (session?.user) {
        try {
          const response = await fetch('/api/user/profile')
          if (response.ok) {
            const data = await response.json()
            const user = data.user
            userInfo = {
              name: `${user.firstName} ${user.lastName}`,
              nid: user.nidNo,
              phone: user.phoneNumber,
              presentAddress: user.presentAddress
            }
          }
        } catch (error) {
          console.error('Failed to fetch user info:', error)
        }
      }

      // Generate PDF
      await generateComplaintPDF(complaintData, userInfo)
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setDownloadingPDF(false)
    }
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

          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="default"
                className="flex items-center gap-2 flex-1 sm:flex-none"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Complaint Preview (অভিযোগপত্র প্রিভিউ)</DialogTitle>
                <DialogDescription>
                  Review your complaint draft before downloading or printing.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {isEditing ? editedDraft : draft}
                  </pre>
                </div>
                {complaintData.images && complaintData.images.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Evidence Images ({complaintData.images.length})</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {complaintData.images.map((url, idx) => (
                        <button
                          key={idx}
                          onClick={() => setFullScreenImage(url)}
                          className="aspect-square rounded-lg overflow-hidden border hover:ring-2 hover:ring-primary transition-all cursor-pointer relative"
                        >
                          <Image
                            src={url}
                            alt={`Evidence ${idx + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Full-screen Image Viewer */}
          <Dialog open={!!fullScreenImage} onOpenChange={() => setFullScreenImage(null)}>
            <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden">
              <DialogTitle className="sr-only">Full Screen Image</DialogTitle>
              <div className="relative w-full h-full flex items-center justify-center bg-black/90 min-h-[95vh]">
                {fullScreenImage && (
                  <div className="relative w-full h-full">
                    <Image
                      src={fullScreenImage}
                      alt="Full screen view"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
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
            disabled={downloadingPDF}
          >
            {downloadingPDF ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
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

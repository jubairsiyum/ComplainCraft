"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  onUploadingChange?: (uploading: boolean) => void
  disabled?: boolean
}

export function ImageUpload({ images, onImagesChange, onUploadingChange, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([])

  const uploadToImgBB = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append("image", file)

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        return data.url
      } else {
        console.error("Failed to upload image")
        return null
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      return null
    }
  }

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)
    onUploadingChange?.(true)
    
    const fileNames = Array.from(files).map(f => f.name)
    setUploadingFiles(fileNames)
    
    const uploadedUrls: string[] = []

    // Dynamic import for compression library
    const imageCompression = (await import('browser-image-compression')).default

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Check if it's an image
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image file`)
        continue
      }

      try {
        let fileToUpload = file

        // Compress if larger than 5MB
        if (file.size > 5 * 1024 * 1024) {
          const options = {
            maxSizeMB: 5,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: file.type,
          }
          
          fileToUpload = await imageCompression(file, options)
        }

        const url = await uploadToImgBB(fileToUpload)
        if (url) {
          uploadedUrls.push(url)
        }
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error)
        alert(`Failed to process ${file.name}. Please try again.`)
      }
    }

    if (uploadedUrls.length > 0) {
      onImagesChange([...images, ...uploadedUrls])
    }

    setUploading(false)
    setUploadingFiles([])
    onUploadingChange?.(false)
  }, [images, onImagesChange, onUploadingChange])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (disabled) return

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [disabled, handleFiles]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      <Label className="text-base">
        Evidence Images (প্রমাণ চিত্র) <span className="text-muted-foreground text-sm">(Optional)</span>
      </Label>

      {/* Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="image-upload"
          className="hidden"
          multiple
          accept="image/*"
          onChange={handleChange}
          disabled={disabled || uploading}
        />

        <label
          htmlFor="image-upload"
          className={cn(
            "flex flex-col items-center gap-2 cursor-pointer",
            (disabled || uploading) && "cursor-not-allowed"
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading images...</p>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Drop images here or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports: JPG, PNG, GIF (Auto-compressed to 5MB)
                </p>
              </div>
            </>
          )}
        </label>
      </div>

      {/* Uploading Files Preview */}
      {uploadingFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {uploadingFiles.map((fileName, index) => (
            <div key={`uploading-${index}`} className="relative aspect-square rounded-lg overflow-hidden border bg-muted/50 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
              <p className="text-xs text-muted-foreground px-2 text-center truncate w-full">
                {fileName}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border bg-muted">
              <Image
                src={url}
                alt={`Evidence ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {images.length} image{images.length !== 1 ? "s" : ""} uploaded
        </p>
      )}
    </div>
  )
}

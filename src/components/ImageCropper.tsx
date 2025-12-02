"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import imageCompression from "browser-image-compression";

interface ImageCropperProps {
  open: boolean;
  onClose: () => void;
  onCropComplete: (croppedImage: string) => void;
  imageFile: File | null;
}

export function ImageCropper({ open, onClose, onCropComplete, imageFile }: ImageCropperProps) {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [processing, setProcessing] = useState(false);

  // Load image when dialog opens or imageFile changes
  useEffect(() => {
    if (imageFile && open) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || "");
      });
      reader.readAsDataURL(imageFile);
    } else {
      setImageSrc("");
    }
  }, [imageFile, open]);

  const getCroppedImg = useCallback(
    async (image: HTMLImageElement, crop: PixelCrop): Promise<Blob | null> => {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // Set canvas to 500x500
      canvas.width = 500;
      canvas.height = 500;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return null;
      }

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        500,
        500
      );

      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.9
        );
      });
    },
    []
  );

  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current) {
      return;
    }

    setProcessing(true);

    try {
      const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);

      if (!croppedBlob) {
        throw new Error("Failed to crop image");
      }

      // Compress image to under 500KB
      const compressedFile = await imageCompression(croppedBlob as File, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      });

      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        onCropComplete(base64data);
        onClose();
        setProcessing(false);
      };
    } catch (error) {
      console.error("Error processing image:", error);
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Crop Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {imageSrc && (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              circularCrop
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop preview"
                style={{ maxHeight: "400px", width: "auto" }}
              />
            </ReactCrop>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={processing}>
              Cancel
            </Button>
            <Button onClick={handleCropComplete} disabled={processing}>
              {processing ? "Processing..." : "Crop & Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useEffect, useState } from "react"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Combobox, ComboboxOption } from "./ui/combobox"
import { ImageUpload } from "./ImageUpload"

export interface ComplaintData {
  issueTypes: string[]
  shopName: string
  dateOfOccurrence: string
  productName: string
  amountPaid: string
  advertisedPrice: string
  expectedPrice: string
  actualPrice: string
  billAmount: string
  serviceType: string
  warrantyPeriod: string
  purchaseDate: string
  refundAmount: string
  damageDescription: string
  delayDuration: string
  unauthorizedCharge: string
  details: string
  images: string[]
}

interface ComplaintFormProps {
  data: ComplaintData
  onDataChange: (data: ComplaintData) => void
  onSubmit: () => void
  loading: boolean
}

const issueOptions = [
  { value: "overpricing", label: "Overpricing (অতিমূল্য)" },
  { value: "fraud", label: "Fraud (প্রতারণা)" },
  { value: "adulteration", label: "Adulteration (ভেজাল)" },
  { value: "misleading", label: "Misleading (ভ্রান্তিকর বিজ্ঞাপন)" },
  { value: "overcharging", label: "Overcharging (অতিরিক্ত বিল)" },
  { value: "negligence", label: "Negligence (অবহেলা)" },
  { value: "defective", label: "Defective (ত্রুটিযুক্ত পণ্য)" },
  { value: "harassment", label: "Harassment (হয়রানি)" },
  { value: "delay", label: "Delay (বিলম্ব)" },
  { value: "unauthorized", label: "Unauthorized (অননুমোদিত সেবা/চার্জ)" },
  { value: "warranty", label: "Warranty (ওয়ারেন্টি সংক্রান্ত সমস্যা)" },
  { value: "refund", label: "Refund (ফেরত না পাওয়া)" },
  { value: "damage", label: "Damage (ক্ষতিগ্রস্ত পণ্য)" },
  { value: "scam", label: "Scam (স্ক্যাম)" },
  { value: "violation", label: "Violation (আইন লঙ্ঘন সাধারণভাবে)" }
]

export function ComplaintForm({ 
  data,
  onDataChange, 
  onSubmit, 
  loading 
}: ComplaintFormProps) {
  const [shopOptions, setShopOptions] = useState<ComboboxOption[]>([])
  const [loadingShops, setLoadingShops] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)

  // Fetch previously complained shops
  useEffect(() => {
    const fetchShops = async () => {
      setLoadingShops(true)
      try {
        const response = await fetch("/api/shops")
        const result = await response.json()
        if (result.success && result.data) {
          const options: ComboboxOption[] = result.data.map((shop: any) => ({
            value: shop.shopName,
            label: `${shop.shopName} (${shop.complaintCount} complaint${shop.complaintCount > 1 ? 's' : ''})`
          }))
          setShopOptions(options)
        }
      } catch (error) {
        console.error("Error fetching shops:", error)
      } finally {
        setLoadingShops(false)
      }
    }
    fetchShops()
  }, [])

  const handleIssueToggle = (value: string) => {
    const newIssues = data.issueTypes.includes(value)
      ? data.issueTypes.filter(v => v !== value)
      : [...data.issueTypes, value]
    onDataChange({ ...data, issueTypes: newIssues })
  }

  const isFormValid = () => {
    return data.issueTypes.length > 0 && 
           data.shopName.trim() !== "" && 
           data.dateOfOccurrence !== "" &&
           data.details.trim() !== ""
  }

  // Determine which fields to show based on selected issues
  const showPriceFields = data.issueTypes.some(type => 
    ['overpricing', 'overcharging', 'misleading'].includes(type)
  )
  
  const showProductField = data.issueTypes.some(type => 
    ['overpricing', 'adulteration', 'defective', 'damage', 'warranty', 'scam'].includes(type)
  )
  
  const showBillAmount = data.issueTypes.includes('overcharging')
  
  const showServiceType = data.issueTypes.some(type => 
    ['negligence', 'harassment', 'delay', 'unauthorized'].includes(type)
  )
  
  const showWarrantyFields = data.issueTypes.includes('warranty')
  
  const showRefundFields = data.issueTypes.includes('refund')
  
  const showDamageFields = data.issueTypes.includes('damage')
  
  const showDelayFields = data.issueTypes.includes('delay')
  
  const showUnauthorizedFields = data.issueTypes.includes('unauthorized')

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="text-2xl flex items-center gap-2">
          <span>📝</span>
          File Your Complaint (আপনার অভিযোগ দাখিল করুন)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Issue Types */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Select Issue Type(s) (সমস্যার ধরন নির্বাচন করুন) *</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {issueOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={data.issueTypes.includes(option.value)}
                  onCheckedChange={() => handleIssueToggle(option.value)}
                  disabled={loading}
                />
                <label
                  htmlFor={option.value}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Shop Name */}
        <div className="space-y-2">
          <Label htmlFor="shopName" className="text-base">Shop/Company Name (দোকান/প্রতিষ্ঠানের নাম) *</Label>
          <Combobox
            options={shopOptions}
            value={data.shopName}
            onValueChange={(value) => onDataChange({ ...data, shopName: value })}
            placeholder={loadingShops ? "Loading shops..." : "Select or type shop name..."}
            searchPlaceholder="Search or type new shop name..."
            emptyMessage="No shops found."
            disabled={loading || loadingShops}
            className="text-base"
          />
          <p className="text-xs text-muted-foreground">
            Type to search previously complained shops or enter a new shop name
          </p>
        </div>

        {/* Date of Occurrence */}
        <div className="space-y-2">
          <Label htmlFor="dateOfOccurrence" className="text-base">Date of Occurrence (ঘটনার তারিখ) *</Label>
          <Input
            id="dateOfOccurrence"
            type="date"
            value={data.dateOfOccurrence}
            onChange={(e) => onDataChange({ ...data, dateOfOccurrence: e.target.value })}
            disabled={loading}
            className="text-base"
          />
        </div>

        {/* Dynamic Fields Based on Issue Type */}
        
        {/* Product/Service Name - shown for specific issues */}
        {showProductField && (
          <div className="space-y-2">
            <Label htmlFor="productName" className="text-base">
              Product/Service Name (পণ্য/সেবার নাম) *
            </Label>
            <Input
              id="productName"
              value={data.productName}
              onChange={(e) => onDataChange({ ...data, productName: e.target.value })}
              placeholder="e.g., Rice, Mobile Phone, etc."
              disabled={loading}
              className="text-base"
            />
          </div>
        )}

        {/* Service Type - for service-related issues */}
        {showServiceType && (
          <div className="space-y-2">
            <Label htmlFor="serviceType" className="text-base">
              Service Type (সেবার ধরন)
            </Label>
            <Input
              id="serviceType"
              value={data.serviceType}
              onChange={(e) => onDataChange({ ...data, serviceType: e.target.value })}
              placeholder="e.g., Internet, Electricity, Healthcare, etc."
              disabled={loading}
              className="text-base"
            />
          </div>
        )}

        {/* Price Fields - for overpricing, misleading */}
        {showPriceFields && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.issueTypes.includes('overpricing') && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="amountPaid" className="text-base">
                    Amount Paid (প্রদত্ত মূল্য) *
                  </Label>
                  <Input
                    id="amountPaid"
                    value={data.amountPaid}
                    onChange={(e) => onDataChange({ ...data, amountPaid: e.target.value })}
                    placeholder="e.g., 50 taka"
                    disabled={loading}
                    className="text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="advertisedPrice" className="text-base">
                    Advertised/Market Price (বিজ্ঞাপিত/বাজার মূল্য) *
                  </Label>
                  <Input
                    id="advertisedPrice"
                    value={data.advertisedPrice}
                    onChange={(e) => onDataChange({ ...data, advertisedPrice: e.target.value })}
                    placeholder="e.g., 45 taka"
                    disabled={loading}
                    className="text-base"
                  />
                </div>
              </>
            )}
            
            {data.issueTypes.includes('misleading') && !data.issueTypes.includes('overpricing') && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="advertisedPrice" className="text-base">
                    Advertised Price (বিজ্ঞাপিত মূল্য) *
                  </Label>
                  <Input
                    id="advertisedPrice"
                    value={data.advertisedPrice}
                    onChange={(e) => onDataChange({ ...data, advertisedPrice: e.target.value })}
                    placeholder="e.g., 1000 taka"
                    disabled={loading}
                    className="text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actualPrice" className="text-base">
                    Actual Price (প্রকৃত মূল্য) *
                  </Label>
                  <Input
                    id="actualPrice"
                    value={data.actualPrice}
                    onChange={(e) => onDataChange({ ...data, actualPrice: e.target.value })}
                    placeholder="e.g., 1500 taka"
                    disabled={loading}
                    className="text-base"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Bill Amount - for overcharging */}
        {showBillAmount && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expectedPrice" className="text-base">
                Expected Bill Amount (প্রত্যাশিত বিল) *
              </Label>
              <Input
                id="expectedPrice"
                value={data.expectedPrice}
                onChange={(e) => onDataChange({ ...data, expectedPrice: e.target.value })}
                placeholder="e.g., 500 taka"
                disabled={loading}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billAmount" className="text-base">
                Charged Bill Amount (আরোপিত বিল) *
              </Label>
              <Input
                id="billAmount"
                value={data.billAmount}
                onChange={(e) => onDataChange({ ...data, billAmount: e.target.value })}
                placeholder="e.g., 800 taka"
                disabled={loading}
                className="text-base"
              />
            </div>
          </div>
        )}

        {/* Warranty Fields */}
        {showWarrantyFields && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate" className="text-base">
                Purchase Date (ক্রয়ের তারিখ) *
              </Label>
              <Input
                id="purchaseDate"
                type="date"
                value={data.purchaseDate}
                onChange={(e) => onDataChange({ ...data, purchaseDate: e.target.value })}
                disabled={loading}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warrantyPeriod" className="text-base">
                Warranty Period (ওয়ারেন্টি মেয়াদ) *
              </Label>
              <Input
                id="warrantyPeriod"
                value={data.warrantyPeriod}
                onChange={(e) => onDataChange({ ...data, warrantyPeriod: e.target.value })}
                placeholder="e.g., 1 year, 6 months"
                disabled={loading}
                className="text-base"
              />
            </div>
          </div>
        )}

        {/* Refund Fields */}
        {showRefundFields && (
          <div className="space-y-2">
            <Label htmlFor="refundAmount" className="text-base">
              Refund Amount Expected (প্রত্যাশিত ফেরত অর্থ) *
            </Label>
            <Input
              id="refundAmount"
              value={data.refundAmount}
              onChange={(e) => onDataChange({ ...data, refundAmount: e.target.value })}
              placeholder="e.g., 5000 taka"
              disabled={loading}
              className="text-base"
            />
          </div>
        )}

        {/* Damage Description */}
        {showDamageFields && (
          <div className="space-y-2">
            <Label htmlFor="damageDescription" className="text-base">
              Damage Description (ক্ষতির বিবরণ) *
            </Label>
            <Textarea
              id="damageDescription"
              value={data.damageDescription}
              onChange={(e) => onDataChange({ ...data, damageDescription: e.target.value })}
              placeholder="পণ্যের ক্ষতির বিস্তারিত বর্ণনা দিন..."
              className="min-h-[80px] text-base"
              disabled={loading}
            />
          </div>
        )}

        {/* Delay Duration */}
        {showDelayFields && (
          <div className="space-y-2">
            <Label htmlFor="delayDuration" className="text-base">
              Delay Duration (বিলম্বের সময়কাল) *
            </Label>
            <Input
              id="delayDuration"
              value={data.delayDuration}
              onChange={(e) => onDataChange({ ...data, delayDuration: e.target.value })}
              placeholder="e.g., 2 weeks, 1 month"
              disabled={loading}
              className="text-base"
            />
          </div>
        )}

        {/* Unauthorized Charge */}
        {showUnauthorizedFields && (
          <div className="space-y-2">
            <Label htmlFor="unauthorizedCharge" className="text-base">
              Unauthorized Charge/Service (অননুমোদিত চার্জ/সেবা) *
            </Label>
            <Input
              id="unauthorizedCharge"
              value={data.unauthorizedCharge}
              onChange={(e) => onDataChange({ ...data, unauthorizedCharge: e.target.value })}
              placeholder="e.g., Hidden charges, unwanted service"
              disabled={loading}
              className="text-base"
            />
          </div>
        )}

        {/* Details */}
        <div className="space-y-2">
          <Label htmlFor="details" className="text-base">Additional Details (বিস্তারিত বিবরণ) *</Label>
          <Textarea
            id="details"
            value={data.details}
            onChange={(e) => onDataChange({ ...data, details: e.target.value })}
            placeholder="আপনার অভিযোগের বিস্তারিত বিবরণ এখানে লিখুন..."
            className="min-h-[120px] text-base"
            disabled={loading}
          />
        </div>

        {/* Image Upload */}
        <ImageUpload
          images={data.images}
          onImagesChange={(images) => onDataChange({ ...data, images })}
          onUploadingChange={setImageUploading}
          disabled={loading}
        />

        {/* Submit Button */}
        <Button
          onClick={onSubmit}
          disabled={!isFormValid() || loading || imageUploading}
          className="w-full sm:w-auto px-8"
          size="lg"
        >
          {imageUploading ? "Uploading Images..." : "Submit Complaint (অভিযোগ জমা দিন)"}
        </Button>
      </CardContent>
    </Card>
  )
}

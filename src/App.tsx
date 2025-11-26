import { useState } from "react"
import { Header } from "./components/Header"
import { Hero } from "./components/Hero"
import { Footer } from "./components/Footer"
import { ScrollToTop } from "./components/ScrollToTop"
import { ComplaintForm, type ComplaintData } from "./components/ComplaintForm"
import { AnalysisCard } from "./components/AnalysisCard"
import { DraftCard } from "./components/DraftCard"
import { Spinner } from "./components/Spinner"

interface Results {
  analysis: {
    identifiedIssue: string
    extractedDetails: string
    violatedLaw: string
    potentialPenalty: string
  }
  draft: string
}

function App() {
  const [complaintData, setComplaintData] = useState<ComplaintData>({
    issueTypes: [],
    shopName: "",
    dateOfOccurrence: "",
    productName: "",
    amountPaid: "",
    advertisedPrice: "",
    expectedPrice: "",
    actualPrice: "",
    billAmount: "",
    serviceType: "",
    warrantyPeriod: "",
    purchaseDate: "",
    refundAmount: "",
    damageDescription: "",
    delayDuration: "",
    unauthorizedCharge: "",
    details: ""
  })
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Results | null>(null)

  const handleSubmit = () => {
    setLoading(true)
    setResults(null)
    
    setTimeout(() => {
      // Generate dynamic results based on form data
      const issueLabels = complaintData.issueTypes.map(type => {
        const option = [
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
        ].find(o => o.value === type)
        return option?.label || type
      }).join(", ")

      const extractedDetails = `Company: '${complaintData.shopName}'${
        complaintData.productName ? `, Product: '${complaintData.productName}'` : ''
      }${
        complaintData.serviceType ? `, Service: '${complaintData.serviceType}'` : ''
      }${
        complaintData.amountPaid ? `, Amount Paid: '${complaintData.amountPaid}'` : ''
      }${
        complaintData.advertisedPrice ? `, Advertised Price: '${complaintData.advertisedPrice}'` : ''
      }${
        complaintData.billAmount ? `, Bill Amount: '${complaintData.billAmount}'` : ''
      }${
        complaintData.refundAmount ? `, Refund Amount: '${complaintData.refundAmount}'` : ''
      }, Date: '${complaintData.dateOfOccurrence}'`

      const draft = `বরাবর,
মহাপরিচালক,
জাতীয় ভোক্তা অধিকার সংরক্ষণ অধিদপ্তর

বিষয়: ${issueLabels} সংক্রান্ত অভিয়োগ

জনাব,
বিনীত নিবেদন এই যে, আমি [আপনার নাম], স্থায়ী ঠিকানা: [আপনার সম্পূর্ণ ঠিকানা], মোবাইল: [আপনার মোবাইল নম্বর], এই মর্মে আনুষ্ঠানিক অভিযোগ দাখিল করছি।

অভিযোগের বিবরণ:
প্রতিষ্ঠানের নাম: ${complaintData.shopName}
ঘটনার তারিখ: ${complaintData.dateOfOccurrence}${
  complaintData.productName ? `\nপণ্য: ${complaintData.productName}` : ''
}${
  complaintData.serviceType ? `\nসেবার ধরন: ${complaintData.serviceType}` : ''
}${
  complaintData.amountPaid ? `\nপ্রদত্ত মূল্য: ${complaintData.amountPaid}` : ''
}${
  complaintData.advertisedPrice ? `\nবিজ্ঞাপিত মূল্য: ${complaintData.advertisedPrice}` : ''
}${
  complaintData.actualPrice ? `\nপ্রকৃত মূল্য: ${complaintData.actualPrice}` : ''
}${
  complaintData.expectedPrice ? `\nপ্রত্যাশিত বিল: ${complaintData.expectedPrice}` : ''
}${
  complaintData.billAmount ? `\nআরোপিত বিল: ${complaintData.billAmount}` : ''
}${
  complaintData.purchaseDate ? `\nক্রয়ের তারিখ: ${complaintData.purchaseDate}` : ''
}${
  complaintData.warrantyPeriod ? `\nওয়ারেন্টি মেয়াদ: ${complaintData.warrantyPeriod}` : ''
}${
  complaintData.refundAmount ? `\nপ্রত্যাশিত ফেরত অর্থ: ${complaintData.refundAmount}` : ''
}${
  complaintData.delayDuration ? `\nবিলম্বের সময়কাল: ${complaintData.delayDuration}` : ''
}${
  complaintData.unauthorizedCharge ? `\nঅননুমোদিত চার্জ/সেবা: ${complaintData.unauthorizedCharge}` : ''
}

বিস্তারিত:
${complaintData.details}${
  complaintData.damageDescription ? `\n\nক্ষতির বিবরণ:\n${complaintData.damageDescription}` : ''
}

উপরোক্ত ঘটনায় ভোক্তা অধিকার সংরক্ষণ আইন, ২০০৯ এর ধারা লঙ্ঘিত হয়েছে বলে আমি মনে করি। এই বিষয়ে যথাযথ আইনানুগ ব্যবস্থা গ্রহণের জন্য বিনীত অনুরোধ করছি।

সংযুক্তি:
১. প্রাসঙ্গিক রশিদ/বিল (যদি থাকে)
২. ছবি/প্রমাণপত্র (যদি থাকে)

বিনীত নিবেদক,
[আপনার স্বাক্ষর]
[আপনার নাম]
[তারিখ]
[মোবাইল নম্বর]

সাক্ষী (যদি থাকে):
১. [সাক্ষীর নাম ও ঠিকানা]`

      setLoading(false)
      setResults({
        analysis: {
          identifiedIssue: issueLabels,
          extractedDetails: extractedDetails,
          violatedLaw: "Section 40, Consumer Rights Protection Act, 2009",
          potentialPenalty: "Imprisonment for up to one year, or a fine of up to 50,000 Taka, or both."
        },
        draft: draft
      })
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Hero />
        
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <ComplaintForm
              data={complaintData}
              onDataChange={setComplaintData}
              onSubmit={handleSubmit}
              loading={loading}
            />

            {loading && <Spinner />}

            {results && !loading && (
              <div 
                className="space-y-6" 
                role="region" 
                aria-live="polite"
                aria-label="Complaint analysis results"
              >
                <AnalysisCard analysis={results.analysis} />
                <DraftCard draft={results.draft} />
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default App

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, FileText, Download, Printer, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-indigo-50 to-background dark:from-indigo-950/30 dark:to-background py-16">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                  <BookOpen className="h-10 w-10" />
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                How to Use ComplainCraft
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A step-by-step guide to generating your consumer rights complaint
              </p>
            </div>
          </div>
        </section>

        {/* Quick Overview */}
        <section className="py-12">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-primary" />
                  Quick Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground">
                  ComplainCraft helps you create formal consumer rights complaints in just 3 simple steps. 
                  No legal knowledge required - just fill out the form with your complaint details, 
                  and we&apos;ll generate a professional complaint letter for you.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Step by Step Guide */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Step-by-Step Guide</h2>
            
            <div className="space-y-8">
              {/* Step 1 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      1
                    </div>
                    Select Your Issue Type
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Start by selecting what type of consumer rights violation you&apos;ve experienced. You can choose multiple types:
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Overpricing (অতিমূল্য)</strong> - When you&apos;re charged more than the maximum retail price</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Fraud (প্রতারণা)</strong> - Deceptive business practices or scams</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>Defective Products (ত্রুটিযুক্ত পণ্য)</strong> - Products that don&apos;t work properly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span><strong>And 12+ more types</strong> covering all common consumer issues</span>
                    </li>
                  </ul>
                  <p className="text-sm text-muted-foreground italic">
                    💡 Tip: The form will dynamically show relevant fields based on your selection!
                  </p>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      2
                    </div>
                    Fill in the Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Provide information about your complaint. Required fields include:
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Basic Information:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                        <li>• Shop/Company name</li>
                        <li>• Date of incident</li>
                        <li>• Product/Service name</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Issue-Specific Details:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                        <li>• Prices/amounts involved</li>
                        <li>• Warranty information (if applicable)</li>
                        <li>• Damage description (if applicable)</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2">Detailed Description:</p>
                    <p className="text-sm text-muted-foreground">
                      In the &quot;Details&quot; field, explain your complaint clearly. Include what happened, 
                      when it happened, and how it affected you. The more details you provide, 
                      the stronger your complaint will be.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      3
                    </div>
                    Generate and Submit
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Click &quot;Generate Complaint&quot; and wait a few seconds. ComplainCraft will:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Analyze your complaint</strong>
                        <p className="text-sm text-muted-foreground">Identify the specific issue, extract key details, and determine which laws were violated</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Generate a professional draft</strong>
                        <p className="text-sm text-muted-foreground">Create a formal complaint letter in Bengali following the official format</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Using the Generated Complaint */}
        <section className="py-12">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">Using Your Generated Complaint</h2>
            
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Once your complaint is generated, you can:</h3>
                  
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-semibold mb-2">Edit the Draft</h4>
                      <p className="text-sm text-muted-foreground">
                        Click &quot;Edit&quot; to customize the complaint letter with your personal information
                      </p>
                    </div>

                    <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <Download className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-semibold mb-2">Download as PDF</h4>
                      <p className="text-sm text-muted-foreground">
                        Save the complaint as a PDF file for submission
                      </p>
                    </div>

                    <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <Printer className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-semibold mb-2">Print</h4>
                      <p className="text-sm text-muted-foreground">
                        Print the complaint for physical submission
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                  <h4 className="font-semibold text-lg mb-3">Important: Complete Your Complaint</h4>
                  <p className="text-muted-foreground mb-4">
                    Before submitting, make sure to fill in the placeholder fields in the generated draft:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                    <li>• Replace [আপনার নাম] with your full name</li>
                    <li>• Replace [আপনার সম্পূর্ণ ঠিকানা] with your complete address</li>
                    <li>• Replace [আপনার মোবাইল নম্বর] with your mobile number</li>
                    <li>• Add your signature and date</li>
                    <li>• Attach any supporting documents (receipts, photos, etc.)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Where to Submit */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">Where to Submit Your Complaint</h2>
            
            <Card>
              <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground">
                  Submit your completed complaint to the <strong>National Consumer Rights Protection Directorate</strong>:
                </p>
                
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="font-semibold">জাতীয় ভোক্তা অধিকার সংরক্ষণ অধিদপ্তর</p>
                  <p className="text-sm text-muted-foreground">
                    Address: TCB Bhaban (7th Floor), 1 Kawran Bazar, Dhaka-1215
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Hotline: 109, 16430
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Email: info@dncrp.gov.bd
                  </p>
                </div>

                <p className="text-sm text-muted-foreground">
                  You can submit your complaint in person, by post, or through their online portal at 
                  <a href="http://www.dncrp.gov.bd" className="text-primary hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                    www.dncrp.gov.bd
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create your consumer rights complaint now and stand up for your rights!
            </p>
            <Link href="/">
              <Button size="lg" className="text-lg px-8">
                Start Creating Your Complaint
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, Download, Eye, Calendar, Building, 
  Package, DollarSign, AlertCircle, Loader2 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Complaint {
  _id?: string;
  issueTypes: string[];
  shopName: string;
  dateOfOccurrence: string;
  productName?: string;
  amountPaid?: string;
  details: string;
  draftText: string;
  submittedAt: Date;
}

export default function ComplaintsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchComplaints();
    }
  }, [status]);

  const fetchComplaints = async () => {
    try {
      const response = await fetch("/api/user/complaints");
      if (response.ok) {
        const data = await response.json();
        setComplaints(data.complaints || []);
      } else {
        setError("Failed to load complaints");
      }
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError("An error occurred while loading complaints");
    } finally {
      setLoading(false);
    }
  };

  const downloadComplaint = (complaint: Complaint) => {
    const blob = new Blob([complaint.draftText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `complaint-${complaint.shopName}-${new Date(complaint.submittedAt).toLocaleDateString()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getIssueLabel = (value: string): string => {
    const issueMap: { [key: string]: string } = {
      overpricing: "Overpricing (অতিমূল্য)",
      fraud: "Fraud (প্রতারণা)",
      adulteration: "Adulteration (ভেজাল)",
      misleading: "Misleading (ভ্রান্তিকর বিজ্ঞাপন)",
      overcharging: "Overcharging (অতিরিক্ত বিল)",
      negligence: "Negligence (অবহেলা)",
      defective: "Defective (ত্রুটিযুক্ত পণ্য)",
      harassment: "Harassment (হয়রানি)",
      delay: "Delay (বিলম্ব)",
      unauthorized: "Unauthorized (অননুমোদিত সেবা/চার্জ)",
      warranty: "Warranty (ওয়ারেন্টি সংক্রান্ত সমস্যা)",
      refund: "Refund (ফেরত না পাওয়া)",
      damage: "Damage (ক্ষতিগ্রস্ত পণ্য)",
      scam: "Scam (স্ক্যাম)",
      violation: "Violation (আইন লঙ্ঘন সাধারণভাবে)"
    };
    return issueMap[value] || value;
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Complaints</h1>
              <p className="text-muted-foreground mt-2">
                View and manage all your submitted complaints
              </p>
            </div>
            <Button onClick={() => router.push("/")} variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              New Complaint
            </Button>
          </div>

          {error && (
            <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {complaints.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No complaints yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start by submitting your first consumer complaint
                  </p>
                  <Button onClick={() => router.push("/")}>
                    Create New Complaint
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {complaints.map((complaint, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Building className="h-5 w-5" />
                          {complaint.shopName}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2">
                          {complaint.issueTypes.map((type, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            >
                              {getIssueLabel(type)}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(complaint.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Date of Occurrence</p>
                          <p className="font-medium">{complaint.dateOfOccurrence}</p>
                        </div>
                        {complaint.productName && (
                          <div>
                            <p className="text-sm text-muted-foreground">Product</p>
                            <p className="font-medium flex items-center gap-1">
                              <Package className="h-4 w-4" />
                              {complaint.productName}
                            </p>
                          </div>
                        )}
                        {complaint.amountPaid && (
                          <div>
                            <p className="text-sm text-muted-foreground">Amount Paid</p>
                            <p className="font-medium flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {complaint.amountPaid}
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Details</p>
                        <p className="text-sm line-clamp-2">{complaint.details}</p>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="default" size="sm" className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Complaint Draft - {complaint.shopName}</DialogTitle>
                              <DialogDescription>
                                Submitted on {new Date(complaint.submittedAt).toLocaleString()}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4 p-6 bg-white dark:bg-gray-900 rounded-lg border">
                              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                                {complaint.draftText}
                              </pre>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-2"
                          onClick={() => downloadComplaint(complaint)}
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

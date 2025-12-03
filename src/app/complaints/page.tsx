"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ImageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, Download, Eye, Calendar, Building, 
  Package, DollarSign, AlertCircle, Loader2, Trash2, Check, Edit 
} from "lucide-react";
import { generateComplaintPDF } from "@/lib/pdfGenerator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface Complaint {
  _id?: string;
  issueTypes: string[];
  shopName: string;
  dateOfOccurrence: string;
  productName?: string;
  amountPaid?: string;
  advertisedPrice?: string;
  expectedPrice?: string;
  actualPrice?: string;
  billAmount?: string;
  serviceType?: string;
  warrantyPeriod?: string;
  purchaseDate?: string;
  refundAmount?: string;
  damageDescription?: string;
  delayDuration?: string;
  unauthorizedCharge?: string;
  details: string;
  draftText: string;
  images?: string[];
  submittedAt: Date;
}

export default function ComplaintsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

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

  const downloadComplaint = async (complaint: Complaint, index: number) => {
    try {
      setDownloadingId(index)
      
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
      await generateComplaintPDF(complaint, userInfo)
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setDownloadingId(null)
    }
  };

  const deleteComplaint = async (complaintId: string | undefined) => {
    if (!complaintId) {
      alert('Cannot delete complaint: Invalid ID');
      return;
    }

    try {
      setDeletingId(complaintId);
      setDeleteSuccess(false);
      const response = await fetch(`/api/user/complaints/${complaintId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from local state
        setComplaints(complaints.filter(c => c._id !== complaintId));
        // Show success message
        setDeleteSuccess(true);
        setError('');
        // Hide success message after 3 seconds
        setTimeout(() => setDeleteSuccess(false), 3000);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete complaint');
      }
    } catch (error) {
      console.error('Error deleting complaint:', error);
      alert('Failed to delete complaint. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditComplaint = (complaint: Complaint) => {
    setEditingComplaint(complaint);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingComplaint || !editingComplaint._id) return;

    try {
      const response = await fetch(`/api/user/complaints/${editingComplaint._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingComplaint),
      });

      if (response.ok) {
        const data = await response.json();
        // Update local state
        setComplaints(complaints.map(c => 
          c._id === editingComplaint._id ? { ...editingComplaint, submittedAt: c.submittedAt } : c
        ));
        setEditDialogOpen(false);
        setEditingComplaint(null);
        setError('');
        // Show success briefly
        setDeleteSuccess(true);
        setTimeout(() => setDeleteSuccess(false), 3000);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update complaint');
      }
    } catch (error) {
      console.error('Error updating complaint:', error);
      alert('Failed to update complaint. Please try again.');
    }
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

          {deleteSuccess && (
            <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <Check className="h-5 w-5" />
                  <p>Complaint deleted successfully!</p>
                </div>
              </CardContent>
            </Card>
          )}

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
                            <div className="mt-4 space-y-4">
                              <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border">
                                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                                  {complaint.draftText}
                                </pre>
                              </div>
                              {complaint.images && complaint.images.length > 0 && (
                                <div className="space-y-2">
                                  <h3 className="font-semibold text-sm">Evidence Images ({complaint.images.length})</h3>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {complaint.images.map((url, idx) => (
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

                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-2"
                          onClick={() => downloadComplaint(complaint, index)}
                          disabled={downloadingId === index}
                        >
                          {downloadingId === index ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4" />
                              Download PDF
                            </>
                          )}
                        </Button>

                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-2"
                          onClick={() => handleEditComplaint(complaint)}
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="flex items-center gap-2"
                              disabled={deletingId === complaint._id}
                            >
                              {deletingId === complaint._id ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </>
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Complaint?</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this complaint for <strong>{complaint.shopName}</strong>? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="gap-2 sm:gap-0">
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button 
                                  variant="destructive"
                                  onClick={() => deleteComplaint(complaint._id)}
                                >
                                  Delete Complaint
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Edit Complaint Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Complaint</DialogTitle>
            <DialogDescription>
              Update your complaint details below
            </DialogDescription>
          </DialogHeader>
          {editingComplaint && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Shop/Company Name *</Label>
                <Input
                  value={editingComplaint.shopName}
                  onChange={(e) => setEditingComplaint({...editingComplaint, shopName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Date of Occurrence *</Label>
                <Input
                  type="date"
                  value={editingComplaint.dateOfOccurrence}
                  onChange={(e) => setEditingComplaint({...editingComplaint, dateOfOccurrence: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Product/Service Name</Label>
                <Input
                  value={editingComplaint.productName || ''}
                  onChange={(e) => setEditingComplaint({...editingComplaint, productName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Amount Paid</Label>
                <Input
                  value={editingComplaint.amountPaid || ''}
                  onChange={(e) => setEditingComplaint({...editingComplaint, amountPaid: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Details *</Label>
                <Textarea
                  value={editingComplaint.details}
                  onChange={(e) => setEditingComplaint({...editingComplaint, details: e.target.value})}
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Draft Text *</Label>
                <Textarea
                  value={editingComplaint.draftText}
                  onChange={(e) => setEditingComplaint({...editingComplaint, draftText: e.target.value})}
                  className="min-h-[200px]"
                />
              </div>

              <div className="space-y-2">
                <ImageUpload
                  images={editingComplaint.images || []}
                  onImagesChange={(newImages) => setEditingComplaint({...editingComplaint, images: newImages})}
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
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

      <Footer />
    </div>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ImageCropper } from "@/components/ImageCropper";
import { 
  User, Mail, Phone, IdCard, Calendar, MapPin, 
  Camera, Save, AlertCircle, CheckCircle, Loader2 
} from "lucide-react";

interface UserProfile {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  nidNo?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  presentAddress?: {
    street?: string;
    city?: string;
    district?: string;
    postalCode?: string;
  };
  permanentAddress?: {
    street?: string;
    city?: string;
    district?: string;
    postalCode?: string;
  };
  profilePicture?: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
      }
    } catch (error) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      setCropperOpen(true);
    }
  };

  const handleCropComplete = async (croppedImage: string) => {
    setUploadingImage(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", croppedImage);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const uploadData = await uploadResponse.json();

      // Update profile picture in MongoDB
      const updateResponse = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profilePicture: uploadData.url,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to save profile picture");
      }

      const updateData = await updateResponse.json();

      setProfile(updateData.user);
      setSuccess("Profile picture updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
      
      // Refresh the page to update session and header
      window.location.reload();
    } catch (error) {
      setError("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setProfile((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const handleAddressChange = (type: "presentAddress" | "permanentAddress", field: string, value: string) => {
    setProfile((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [type]: {
          ...prev[type],
          [field]: value,
        },
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground mt-2">Manage your personal information</p>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg flex items-start gap-2 mb-6">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg flex items-start gap-2 mb-6">
              <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{success}</p>
            </div>
          )}

          {/* Profile Picture */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.profilePicture} />
                  <AvatarFallback className="text-2xl">
                    {profile.firstName[0]}{profile.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    disabled={uploadingImage}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {uploadingImage ? "Uploading..." : "Change Picture"}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Square image, max 5MB. Will be resized to 500x500px
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    value={profile.email}
                    className="pl-10"
                    disabled
                  />
                </div>
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phoneNumber"
                      value={profile.phoneNumber || ""}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      placeholder="+880 1XXX-XXXXXX"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nidNo">NID Number</Label>
                  <div className="relative">
                    <IdCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="nidNo"
                      value={profile.nidNo || ""}
                      onChange={(e) => handleInputChange("nidNo", e.target.value)}
                      placeholder="Enter your NID number"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : ""}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Present Address */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Present Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="presentStreet">Street Address</Label>
                <Input
                  id="presentStreet"
                  value={profile.presentAddress?.street || ""}
                  onChange={(e) => handleAddressChange("presentAddress", "street", e.target.value)}
                  placeholder="House/Flat, Road, Area"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="presentCity">City</Label>
                  <Input
                    id="presentCity"
                    value={profile.presentAddress?.city || ""}
                    onChange={(e) => handleAddressChange("presentAddress", "city", e.target.value)}
                    placeholder="e.g., Dhaka"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="presentDistrict">District</Label>
                  <Input
                    id="presentDistrict"
                    value={profile.presentAddress?.district || ""}
                    onChange={(e) => handleAddressChange("presentAddress", "district", e.target.value)}
                    placeholder="e.g., Dhaka"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="presentPostalCode">Postal Code</Label>
                  <Input
                    id="presentPostalCode"
                    value={profile.presentAddress?.postalCode || ""}
                    onChange={(e) => handleAddressChange("presentAddress", "postalCode", e.target.value)}
                    placeholder="e.g., 1215"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permanent Address */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Permanent Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="permanentStreet">Street Address</Label>
                <Input
                  id="permanentStreet"
                  value={profile.permanentAddress?.street || ""}
                  onChange={(e) => handleAddressChange("permanentAddress", "street", e.target.value)}
                  placeholder="House/Flat, Road, Area"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="permanentCity">City</Label>
                  <Input
                    id="permanentCity"
                    value={profile.permanentAddress?.city || ""}
                    onChange={(e) => handleAddressChange("permanentAddress", "city", e.target.value)}
                    placeholder="e.g., Dhaka"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="permanentDistrict">District</Label>
                  <Input
                    id="permanentDistrict"
                    value={profile.permanentAddress?.district || ""}
                    onChange={(e) => handleAddressChange("permanentAddress", "district", e.target.value)}
                    placeholder="e.g., Dhaka"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="permanentPostalCode">Postal Code</Label>
                  <Input
                    id="permanentPostalCode"
                    value={profile.permanentAddress?.postalCode || ""}
                    onChange={(e) => handleAddressChange("permanentAddress", "postalCode", e.target.value)}
                    placeholder="e.g., 1215"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} size="lg" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </main>

      <Footer />

      {/* Image Cropper Dialog */}
      <ImageCropper
        open={cropperOpen}
        onClose={() => {
          setCropperOpen(false);
          setImageFile(null);
        }}
        onCropComplete={handleCropComplete}
        imageFile={imageFile}
      />
    </div>
  );
}

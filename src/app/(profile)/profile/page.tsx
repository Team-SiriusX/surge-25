"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Loader2, X, Plus, Github, Linkedin, Globe, GraduationCap, Phone, Mail, FileText, User, Calendar, Book, Target, Heart, Link as LinkIcon, CheckCircle2, Edit3, Save, TrendingUp, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/lib/uploadthing";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: string;
  bio: string | null;
  skills: string[];
  interests: string[];
  resume: string | null;
  phone: string | null;
  linkedIn: string | null;
  github: string | null;
  portfolio: string | null;
  university: string | null;
  major: string | null;
  graduationYear: number | null;
  profileScore: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    phone: "",
    linkedIn: "",
    github: "",
    portfolio: "",
    university: "",
    major: "",
    graduationYear: null as number | null,
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/sign-in");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile/me");
      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
        setFormData({
          name: data.user.name || "",
          bio: data.user.bio || "",
          phone: data.user.phone || "",
          linkedIn: data.user.linkedIn || "",
          github: data.user.github || "",
          portfolio: data.user.portfolio || "",
          university: data.user.university || "",
          major: data.user.major || "",
          graduationYear: data.user.graduationYear || null,
        });
        setSkills(data.user.skills || []);
        setInterests(data.user.interests || []);
        setImagePreview(data.user.image);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load profile";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          skills,
          interests,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      } else {
        // Properly extract error message
        const errorMessage = typeof data.error === 'string' 
          ? data.error 
          : data.error?.message || data.message || "Failed to update profile";
        toast.error(errorMessage);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setImagePreview(base64);

      try {
        const response = await fetch("/api/profile/avatar", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });

        if (response.ok) {
          toast.success("Avatar updated successfully");
          fetchProfile();
        } else {
          toast.error("Failed to update avatar");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update avatar";
        toast.error(message);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUploadComplete = async (url: string) => {
    try {
      const response = await fetch("/api/profile/avatar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: url }),
      });

      if (response.ok) {
        toast.success("Avatar updated successfully");
        setImagePreview(url);
        fetchProfile();
      } else {
        toast.error("Failed to update avatar");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update avatar";
      toast.error(message);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const response = await fetch("/api/profile/avatar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: "" }),
      });

      if (response.ok) {
        toast.success("Avatar removed successfully");
        setImagePreview(null);
        fetchProfile();
      } else {
        toast.error("Failed to remove avatar");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to remove avatar";
      toast.error(message);
    }
  };

  const handleResumeUploadComplete = async (url: string) => {
    try {
      const response = await fetch("/api/profile/resume", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: url }),
      });

      if (response.ok) {
        toast.success("Resume uploaded successfully");
        fetchProfile();
      } else {
        toast.error("Failed to upload resume");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload resume";
      toast.error(message);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  // Calculate individual field completion scores
  const getFieldScores = () => {
    const fields = [
      { name: "Name", filled: !!profile?.name, points: 8 },
      { name: "Email", filled: !!profile?.email, points: 8 },
      { name: "Avatar", filled: !!profile?.image, points: 8 },
      { name: "Bio", filled: !!profile?.bio, points: 8 },
      { name: "Phone", filled: !!profile?.phone, points: 8 },
      { name: "Skills", filled: (profile?.skills?.length || 0) > 0, points: 8 },
      { name: "Interests", filled: (profile?.interests?.length || 0) > 0, points: 7 },
      { name: "Resume", filled: !!profile?.resume, points: 8 },
      { name: "LinkedIn", filled: !!profile?.linkedIn, points: 7 },
      { name: "GitHub", filled: !!profile?.github, points: 7 },
      { name: "Portfolio", filled: !!profile?.portfolio, points: 7 },
      { name: "University", filled: !!profile?.university, points: 8 },
      { name: "Major", filled: !!profile?.major, points: 8 },
      { name: "Graduation Year", filled: !!profile?.graduationYear, points: 8 },
    ];
    return fields;
  };

  if (loading || isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 via-background to-background">
      {/* Minimal Header Banner */}
      <div className="relative h-32 bg-gradient-to-r from-primary/5 via-primary/3 to-secondary/5 border-b border-border/50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      <div className="container mx-auto px-6 pb-16 max-w-7xl">
        {/* Profile Header */}
        <div className="-mt-20 mb-8">
          <Card className="border-border/50 bg-card backdrop-blur-sm shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Avatar */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Avatar className="relative w-32 h-32 border-2 border-border shadow-xl rounded-2xl">
                    <AvatarImage src={imagePreview || ""} alt={profile.name} className="object-cover" />
                    <AvatarFallback className="text-4xl font-semibold bg-gradient-to-br from-primary to-secondary text-white rounded-2xl">
                      {profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {imagePreview && (
                    <button
                      onClick={handleRemoveAvatar}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-background border-2 border-border rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-destructive hover:border-destructive hover:text-white transition-all duration-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {profile.emailVerified && (
                    <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center border-3 border-card shadow-lg">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2 truncate">
                        {profile.name}
                      </h1>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-4 h-4" />
                          {profile.email}
                        </span>
                        {profile.emailVerified && (
                          <Badge variant="secondary" className="gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Verified
                          </Badge>
                        )}
                        {profile.role && (
                          <Badge variant="outline" className="capitalize">
                            {profile.role}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {!isEditing ? (
                        <Button
                          onClick={() => setIsEditing(true)}
                          variant="default"
                          className="gap-2"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="gap-2"
                          >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsEditing(false);
                              fetchProfile();
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {profile.bio && (
                    <p className="text-muted-foreground leading-relaxed mb-4 max-w-3xl">
                      {profile.bio}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-2">
                    {profile.university && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 text-sm">
                        <GraduationCap className="w-4 h-4 text-primary" />
                        <span>{profile.university}</span>
                      </div>
                    )}
                    {profile.major && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 text-sm">
                        <Book className="w-4 h-4 text-primary" />
                        <span>{profile.major}</span>
                      </div>
                    )}
                    {profile.graduationYear && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 text-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{profile.graduationYear}</span>
                      </div>
                    )}
                    {profile.phone && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 text-sm">
                        <Phone className="w-4 h-4 text-primary" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  {(profile.linkedIn || profile.github || profile.portfolio) && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                      {profile.linkedIn && (
                        <a
                          href={profile.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-lg bg-[#0077B5]/10 hover:bg-[#0077B5] text-[#0077B5] hover:text-white flex items-center justify-center transition-all"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {profile.github && (
                        <a
                          href={profile.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-lg bg-foreground/10 hover:bg-foreground text-foreground hover:text-background flex items-center justify-center transition-all"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {profile.portfolio && (
                        <a
                          href={profile.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground flex items-center justify-center transition-all"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Upload Section */}
                <div className="flex flex-col gap-3 items-center">
                  <UploadButton
                    endpoint="avatarUploader"
                    onClientUploadComplete={(res) => {
                      if (res?.[0]?.url) {
                        handleAvatarUploadComplete(res[0].url);
                      }
                    }}
                    onUploadError={(error: Error) => {
                      toast.error(`Upload failed: ${error.message}`);
                    }}
                    appearance={{
                      button: "ut-ready:bg-primary/10 ut-uploading:cursor-not-allowed bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 text-xs rounded-lg border border-primary/20 font-medium transition-all",
                      allowedContent: "hidden",
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Score */}
        <Card className="mb-8 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Profile Strength</h3>
                  <p className="text-sm text-muted-foreground">
                    {profile.profileScore === 100 
                      ? "Complete profile" 
                      : `${Math.ceil((100 - profile.profileScore) / 7)} ${Math.ceil((100 - profile.profileScore) / 7) === 1 ? 'field' : 'fields'} remaining`
                    }
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-foreground">{profile.profileScore}</div>
                <div className="text-xs text-muted-foreground font-medium">out of 100</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-6">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary transition-all duration-1000"
                style={{ width: `${profile.profileScore}%` }}
              />
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {getFieldScores().map((field) => (
                <div
                  key={field.name}
                  className={`flex items-center justify-between p-2.5 rounded-lg text-xs transition-all ${
                    field.filled
                      ? "bg-emerald-500/10 border border-emerald-500/20"
                      : "bg-muted/30 border border-border/50"
                  }`}
                >
                  <span className={`font-medium ${field.filled ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                    {field.name}
                  </span>
                  <div className={`flex items-center justify-center w-7 h-7 rounded-md text-xs font-semibold ${
                    field.filled ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground/60"
                  }`}>
                    {field.filled ? <CheckCircle2 className="w-4 h-4" /> : field.points}
                  </div>
                </div>
              ))}
            </div>

            {profile.profileScore !== 100 && (
              <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-sm text-center">
                  Complete your profile to increase visibility by <strong>{100 - profile.profileScore}%</strong>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <style jsx>{`
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes shine {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>

        {/* Personal Information */}
        <Card className="mb-6 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Personal Information</CardTitle>
                <CardDescription className="text-sm">Manage your personal details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="flex-1"
                    />
                  ) : (
                    <span className="text-sm">{profile.name}</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{profile.email}</span>
                  {profile.emailVerified && (
                    <Badge variant="secondary" className="text-xs gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1234567890"
                      className="flex-1"
                    />
                  ) : (
                    <span className="text-sm">{profile.phone || "Not provided"}</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="university" className="text-sm font-medium">University</Label>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      id="university"
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                      placeholder="University name"
                      className="flex-1"
                    />
                  ) : (
                    <span className="text-sm">{profile.university || "Not provided"}</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="major" className="text-sm font-medium">Major</Label>
                <div className="flex items-center gap-2">
                  <Book className="w-4 h-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      id="major"
                      value={formData.major}
                      onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                      placeholder="Computer Science"
                      className="flex-1"
                    />
                  ) : (
                    <span className="text-sm">{profile.major || "Not provided"}</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="graduationYear" className="text-sm font-medium">Graduation Year</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      id="graduationYear"
                      type="number"
                      value={formData.graduationYear || ""}
                      onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value ? parseInt(e.target.value) : null })}
                      placeholder="2025"
                      min="2020"
                      max="2050"
                      className="flex-1"
                    />
                  ) : (
                    <span className="text-sm">{profile.graduationYear || "Not provided"}</span>
                  )}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                {isEditing ? (
                  <>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      maxLength={500}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {formData.bio.length}/500 characters
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">{profile.bio || "No bio provided"}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Skills */}
      <Card className="mb-6 border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Skills</CardTitle>
              <CardDescription className="text-sm">Add your technical and soft skills</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isEditing && (
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Enter a skill"
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                />
                <Button onClick={addSkill} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="px-3 py-1">
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
              {skills.length === 0 && (
                <p className="text-sm text-muted-foreground">No skills added yet</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interests */}
      <Card className="mb-6 border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Interests</CardTitle>
              <CardDescription className="text-sm">Share your interests and hobbies</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isEditing && (
              <div className="flex gap-2">
                <Input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Enter an interest"
                  onKeyPress={(e) => e.key === "Enter" && addInterest()}
                />
                <Button onClick={addInterest} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <Badge key={interest} variant="outline" className="px-3 py-1">
                  {interest}
                  {isEditing && (
                    <button
                      onClick={() => removeInterest(interest)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
              {interests.length === 0 && (
                <p className="text-sm text-muted-foreground">No interests added yet</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resume */}
      <Card className="mb-6 border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Resume</CardTitle>
              <CardDescription className="text-sm">Upload your resume (PDF, Max 8MB)</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile.resume && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <FileText className="w-5 h-5 text-primary" />
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex-1"
                >
                  View Current Resume
                </a>
              </div>
            )}
            <UploadButton
              endpoint="resumeUploader"
              onClientUploadComplete={(res) => {
                if (res?.[0]?.url) {
                  handleResumeUploadComplete(res[0].url);
                }
              }}
              onUploadError={(error: Error) => {
                toast.error(`Upload failed: ${error.message}`);
              }}
              appearance={{
                button: "ut-ready:bg-primary ut-uploading:cursor-not-allowed ut-uploading:bg-primary/50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm rounded-md",
                allowedContent: "text-xs text-muted-foreground",
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="mb-6 border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Social Links</CardTitle>
              <CardDescription className="text-sm">Connect your social profiles</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="linkedIn">LinkedIn</Label>
            <div className="flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-muted-foreground" />
              {isEditing ? (
                <Input
                  id="linkedIn"
                  value={formData.linkedIn}
                  onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              ) : (
                <span className="text-sm">
                  {profile.linkedIn ? (
                    <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {profile.linkedIn}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4 text-muted-foreground" />
              {isEditing ? (
                <Input
                  id="github"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  placeholder="https://github.com/yourusername"
                />
              ) : (
                <span className="text-sm">
                  {profile.github ? (
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {profile.github}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolio">Portfolio</Label>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              {isEditing ? (
                <Input
                  id="portfolio"
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  placeholder="https://yourportfolio.com"
                />
              ) : (
                <span className="text-sm">
                  {profile.portfolio ? (
                    <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {profile.portfolio}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

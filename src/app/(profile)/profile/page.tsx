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
import { Loader2, X, Plus, Github, Linkedin, Globe, GraduationCap, Phone, Mail, FileText } from "lucide-react";
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
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Profile Score Card */}
      <Card className="mb-6 border-2 hover:border-primary/50 transition-all duration-300 overflow-hidden bg-gradient-to-br from-card to-card/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h3 className="text-base font-semibold">Profile Completeness</h3>
                <p className="text-xs text-muted-foreground">
                  {profile.profileScore === 100 
                    ? "Perfect! Your profile is complete" 
                    : `${Math.ceil((100 - profile.profileScore) / 7)} fields remaining`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span 
                className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient"
                style={{
                  backgroundSize: '200% 200%',
                  animation: 'gradient 3s ease infinite',
                }}
              >
                {profile.profileScore}
              </span>
              <span className="text-sm text-muted-foreground font-medium">%</span>
            </div>
          </div>
          
          <div className="relative mb-4">
            {/* Background track */}
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              {/* Animated progress fill */}
              <div 
                className="h-full bg-gradient-to-r from-primary via-secondary to-primary transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ 
                  width: `${profile.profileScore}%`,
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s infinite linear',
                }}
              >
                {/* Shine effect */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  style={{
                    animation: 'shine 2s infinite linear',
                  }}
                />
              </div>
            </div>
            {/* Percentage markers */}
            <div className="absolute top-5 left-0 right-0 flex justify-between text-[10px] text-muted-foreground px-1">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Field breakdown */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {getFieldScores().map((field, index) => (
              <div
                key={field.name}
                className={`group relative flex flex-col p-2.5 rounded-lg text-xs transition-all duration-300 hover:scale-105 ${
                  field.filled
                    ? "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/20 border border-green-200 dark:border-green-800"
                    : "bg-gradient-to-br from-muted/30 to-muted/60 border border-border hover:border-primary/30 hover:from-primary/5 hover:to-primary/10"
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className={`font-medium truncate text-[11px] ${
                    field.filled ? "text-green-700 dark:text-green-400" : "text-muted-foreground"
                  }`}>
                    {field.name}
                  </span>
                  <div className={`flex items-center justify-center min-w-[32px] h-6 rounded-md text-[10px] font-bold transition-all ${
                    field.filled 
                      ? "bg-green-500 text-white shadow-sm" 
                      : "bg-muted text-muted-foreground/60 group-hover:bg-primary/10 group-hover:text-primary"
                  }`}>
                    {field.filled ? `✓ ${field.points}` : field.points}
                  </div>
                </div>
                {field.filled && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 animate-pulse rounded-lg pointer-events-none" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
            <p className="text-xs text-center font-medium">
              {profile.profileScore === 100 
                ? "🎉 Amazing! Your profile stands out to recruiters and collaborators" 
                : `💡 Complete your profile to increase visibility by ${100 - profile.profileScore}%`
              }
            </p>
          </div>
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

      {/* Avatar and Basic Info */}
      <Card className="mb-6 border hover:border-primary/30 transition-all duration-300">
        <CardHeader className="border-b bg-gradient-to-r from-muted/30 to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-sm">📸</span>
            </div>
            <div>
              <CardTitle className="text-base">Profile Picture</CardTitle>
              <CardDescription className="text-xs">Upload your profile picture (Max 4MB)</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Avatar className="w-28 h-28 border-4 border-muted ring-2 ring-primary/10 transition-all duration-300 group-hover:ring-primary/30">
                <AvatarImage src={imagePreview || ""} alt={profile.name} className="object-cover" />
                <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary via-secondary to-primary text-white">
                  {profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              {imagePreview && (
                <button
                  onClick={handleRemoveAvatar}
                  className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-br from-destructive to-destructive/80 text-white rounded-full flex items-center justify-center hover:scale-110 hover:rotate-90 transition-all duration-300 shadow-lg hover:shadow-xl"
                  title="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center border-2 border-card shadow-md">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
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
                  button: "ut-ready:bg-primary ut-uploading:cursor-not-allowed ut-uploading:bg-primary/50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm rounded-md",
                  allowedContent: "text-xs text-muted-foreground",
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="mb-6 border hover:border-primary/30 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-gradient-to-r from-muted/30 to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
            <div>
              <CardTitle className="text-base">Personal Information</CardTitle>
              <CardDescription className="text-xs">Update your personal details</CardDescription>
            </div>
          </div>
          {!isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              ✏️ Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  fetchProfile();
                }}
                className="hover:bg-muted"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveProfile} 
                disabled={saving}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "💾 Save"}
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                ) : (
                  <span>{profile.name}</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{profile.email}</span>
                {profile.emailVerified && (
                  <Badge variant="secondary" className="text-xs">Verified</Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1234567890"
                  />
                ) : (
                  <span>{profile.phone || "Not provided"}</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                {isEditing ? (
                  <Input
                    id="university"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    placeholder="University name"
                  />
                ) : (
                  <span>{profile.university || "Not provided"}</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="major">Major</Label>
              {isEditing ? (
                <Input
                  id="major"
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  placeholder="Computer Science"
                />
              ) : (
                <span>{profile.major || "Not provided"}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="graduationYear">Graduation Year</Label>
              {isEditing ? (
                <Input
                  id="graduationYear"
                  type="number"
                  value={formData.graduationYear || ""}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value ? parseInt(e.target.value) : null })}
                  placeholder="2025"
                  min="2020"
                  max="2050"
                />
              ) : (
                <span>{profile.graduationYear || "Not provided"}</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={4}
                maxLength={500}
              />
            ) : (
              <p className="text-sm text-muted-foreground">{profile.bio || "No bio provided"}</p>
            )}
            {isEditing && (
              <p className="text-xs text-muted-foreground text-right">
                {formData.bio.length}/500 characters
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="mb-6 border hover:border-primary/30 transition-all duration-300">
        <CardHeader className="border-b bg-gradient-to-r from-muted/30 to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-sm">🎯</span>
            </div>
            <div>
              <CardTitle className="text-base">Skills</CardTitle>
              <CardDescription className="text-xs">Add your technical and soft skills</CardDescription>
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
      <Card className="mb-6 border hover:border-primary/30 transition-all duration-300">
        <CardHeader className="border-b bg-gradient-to-r from-muted/30 to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-sm">❤️</span>
            </div>
            <div>
              <CardTitle className="text-base">Interests</CardTitle>
              <CardDescription className="text-xs">Share your interests and hobbies</CardDescription>
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

      {/* Social Links */}
      <Card className="mb-6 border hover:border-primary/30 transition-all duration-300">
        <CardHeader className="border-b bg-gradient-to-r from-muted/30 to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-sm">📄</span>
            </div>
            <div>
              <CardTitle className="text-base">Resume</CardTitle>
              <CardDescription className="text-xs">Upload your resume (PDF, Max 8MB)</CardDescription>
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
      <Card className="mb-6 border hover:border-primary/30 transition-all duration-300">
        <CardHeader className="border-b bg-gradient-to-r from-muted/30 to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-sm">🔗</span>
            </div>
            <div>
              <CardTitle className="text-base">Social Links</CardTitle>
              <CardDescription className="text-xs">Connect your social profiles</CardDescription>
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
  );
}

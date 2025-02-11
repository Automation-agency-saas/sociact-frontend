import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { platformConfig } from "@/lib/config/tools";
import {
  CheckCircle2,
  PencilIcon,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Upload,
  Camera,
  Loader2,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Link as LinkIcon,
  Plus,
  Globe,
  Sparkles,
  Users,
  UserPlus,
  MessageSquare,
  Heart,
  User,
  Link2,
  FileText,
  Image,
  Search,
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "react-hot-toast";
import { authApi } from "@/lib/services/auth";
import { Label } from "@/components/ui/label";
import { RefreshCcw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ToolLayout } from "@/components/tool-page/ToolLayout";

// Add this new component for the animated stats
const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="flex flex-col items-center justify-center p-4 rounded-xl bg-card border"
  >
    <Icon className="w-6 h-6 mb-2 text-primary" />
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </motion.div>
);

export function Profile() {
  const { user, setUser } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [activeCategory, setActiveCategory] = useState<null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [editedUser, setEditedUser] = useState({
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
    picture: user?.picture || "",
    socials: user?.socials || {
      instagram: "",
      twitter: "",
      youtube: "",
      linkedin: "",
      website: "",
    },
  });

  useEffect(() => {
    if (user) {
      setEditedUser({
        name: user.name || "",
        username: user.username || "",
        bio: user.bio || "",
        picture: user.picture || "",
        socials: user.socials || {
          instagram: "",
          twitter: "",
          youtube: "",
          linkedin: "",
          website: "",
        },
      });
    }
  }, [user]);

  const coverImages = [
    "https://images.unsplash.com/photo-1738447429433-69e3ecd0bdd0?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1738463791783-b61514add113?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1525340581945-d5e2b09641c4?q=80&w=2865&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1686727989799-4c5d3b4846fb?q=80&w=3131&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      nextImage();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentImageIndex]);

  const nextImage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev + 1) % coverImages.length);
      setIsTransitioning(false);
    }, 300);
  };

  const previousImage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prev) =>
        prev === 0 ? coverImages.length - 1 : prev - 1
      );
      setIsTransitioning(false);
    }, 300);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const response = await authApi.updateProfile({
        name: editedUser.name,
        username: editedUser.username,
        bio: editedUser.bio,
        picture: editedUser.picture,
      });

      setUser(response.user);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditedUser({
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
      picture: user?.picture || "",
      socials: user?.socials || {
        instagram: "",
        twitter: "",
        youtube: "",
        linkedin: "",
        website: "",
      },
    });
    setIsEditing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const loadingToast = toast.loading("Uploading image...");

      try {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("key", "b4b4f053e22c4701836955e55c3e1e7d");

        const response = await fetch("https://api.imgbb.com/1/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          setEditedUser((prev) => ({
            ...prev,
            picture: data.data.url,
          }));
          toast.success("Image uploaded successfully!");
        } else {
          throw new Error(data.error?.message || "Failed to upload image");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image. Please try again.");
      } finally {
        toast.dismiss(loadingToast);
      }
    }
  };

  const handleRandomAvatar = () => {
    const styles = [
      "adventurer",
      "avataaars",
      "big-ears",
      "bottts",
      "pixel-art",
    ];
    const style = styles[Math.floor(Math.random() * styles.length)];
    const seed = Math.random().toString(36).substring(7);
    const newAvatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;

    setEditedUser((prev) => ({
      ...prev,
      picture: newAvatarUrl,
    }));
    toast.success("Random avatar generated!");
  };

  const handleDashboardClick = () => {
    setActiveCategory(null);
  };

  const toggleCategory = (category: any) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  // Mocked connection status - will be replaced with real data
  const connections = {
    youtube: false,
    instagram: true,
    twitter: false,
    linkedin: true,
    facebook: false,
  };

  return (
    <ToolLayout>
      {/* Hero Section with Animated Cover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[280px] w-full overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-in-out"
          style={{
            backgroundImage: `url(${coverImages[currentImageIndex]})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-transparent" />

        {/* Profile Header - Floating Card */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-12 transform -translate-x-1/2 translate-y-1/2 w-full max-w-[1000px]"
        >
          <Card className="p-6 backdrop-blur-sm bg-card/80 border-none shadow-2xl">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Picture */}
              <motion.div whileHover={{ scale: 1.05 }} className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-background shadow-xl overflow-hidden">
                  <img
                    src={
                      isEditing
                        ? editedUser.picture
                        : user?.picture ||
                          `https://ui-avatars.com/api/?name=${user?.name}`
                    }
                    alt={user?.name}
                    className="w-full h-full object-cover"
                  />
                  {isEditing && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <Camera className="w-6 h-6 text-white" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Profile Picture</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-40 h-40 rounded-full border-4 border-muted overflow-hidden">
                              <img
                                src={
                                  editedUser.picture ||
                                  `https://ui-avatars.com/api/?name=${editedUser.name}`
                                }
                                alt={editedUser.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Label
                                      htmlFor="picture"
                                      className="cursor-pointer inline-flex items-center justify-center rounded-md px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                                    >
                                      <Upload className="w-4 h-4 mr-2" />
                                      Upload
                                      <input
                                        id="picture"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                      />
                                    </Label>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Upload a new photo</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      onClick={handleRandomAvatar}
                                      className="gap-2"
                                    >
                                      <RefreshCcw className="w-4 h-4" />
                                      Random
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Generate random avatar</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-4">
                            {[
                              "adventurer",
                              "avataaars",
                              "big-ears",
                              "bottts",
                              "pixel-art",
                              "fun-emoji",
                              "thumbs",
                              "initials",
                            ].map((style) => (
                              <Button
                                key={style}
                                variant="outline"
                                className="p-0 aspect-square"
                                onClick={() => {
                                  const seed = Math.random()
                                    .toString(36)
                                    .substring(7);
                                  setEditedUser((prev) => ({
                                    ...prev,
                                    picture: `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`,
                                  }));
                                  toast.success("Avatar style updated!");
                                }}
                              >
                                <img
                                  src={`https://api.dicebear.com/7.x/${style}/svg?seed=${style}`}
                                  alt={style}
                                  className="w-full h-full p-2"
                                />
                              </Button>
                            ))}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </motion.div>
              </motion.div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={editedUser.name}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, name: e.target.value })
                      }
                      placeholder="Name"
                      className="text-lg font-bold"
                    />
                    <Input
                      value={editedUser.username}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          username: e.target.value,
                        })
                      }
                      placeholder="Username"
                      className="text-muted-foreground"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold mb-1">{user?.name}</h1>
                    <p className="text-muted-foreground">@{user?.username}</p>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 justify-center md:justify-start">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="relative overflow-hidden"
                      >
                        {isSubmitting ? (
                          <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          />
                        ) : null}
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                        )}
                        Save Changes
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleEdit}
                      variant="outline"
                      className="group"
                    >
                      <motion.div whileHover={{ rotate: 180 }} className="mr-2">
                        <Pencil className="w-4 h-4" />
                      </motion.div>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
      {/* Main Content */}
      <div className="max-w-[1000px] mx-auto px-4 mt-4">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <StatCard icon={Image} label="Thumbnails Generated" value="24" />
          <StatCard icon={FileText} label="Scripts Created" value="18" />
          <StatCard
            icon={MessageSquare}
            label="Comments Automated"
            value="342"
          />
          <StatCard icon={Search} label="SEO Optimizations" value="56" />
        </motion.div>

        {/* Tabs Section */}
        <Tabs defaultValue="about" className="mt-8">
          <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
            <TabsTrigger
              value="about"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
            >
              About
            </TabsTrigger>
            <TabsTrigger
              value="social"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
            >
              Social
            </TabsTrigger>
            <TabsTrigger
              value="connected"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
            >
              Connected
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-6 space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                About
              </h2>
              {isEditing ? (
                <Textarea
                  value={editedUser.bio}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, bio: e.target.value })
                  }
                  placeholder="Tell us about yourself..."
                  className="min-h-[100px] resize-none"
                />
              ) : (
                <p className="text-muted-foreground leading-relaxed">
                  {user?.bio || "No bio added yet."}
                </p>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Activity Overview
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-purple-500/10">
                      <Image className="w-4 h-4 text-purple-500" />
                    </div>
                    <span className="text-sm">Latest Thumbnail</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    2 hours ago
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-blue-500/10">
                      <FileText className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="text-sm">Latest Script</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    5 hours ago
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-green-500/10">
                      <MessageSquare className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="text-sm">Latest Comment</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    1 day ago
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-orange-500/10">
                      <Search className="w-4 h-4 text-orange-500" />
                    </div>
                    <span className="text-sm">Latest SEO</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    2 days ago
                  </span>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Social Links
                </h2>
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="text-primary hover:text-primary/80"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Links
                  </Button>
                )}
              </div>

              <motion.div layout className="grid gap-4">
                {/* Social Links */}
                {Object.entries({
                  instagram: {
                    icon: Instagram,
                    color: "text-pink-500",
                    bg: "bg-pink-500/10",
                  },
                  twitter: {
                    icon: Twitter,
                    color: "text-blue-500",
                    bg: "bg-blue-500/10",
                  },
                  youtube: {
                    icon: Youtube,
                    color: "text-red-500",
                    bg: "bg-red-500/10",
                  },
                  linkedin: {
                    icon: Linkedin,
                    color: "text-blue-600",
                    bg: "bg-blue-600/10",
                  },
                  website: {
                    icon: Globe,
                    color: "text-gray-500",
                    bg: "bg-gray-500/10",
                  },
                }).map(([platform, { icon: Icon, color, bg }]) => (
                  <motion.div
                    key={platform}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="group"
                  >
                    <HoverCard>
                      <HoverCardTrigger>
                        <div
                          className={`flex items-center gap-4 p-4 rounded-lg border bg-card/50 backdrop-blur-sm transition-colors hover:bg-accent/5`}
                        >
                          <div className={`p-2 rounded-md ${bg}`}>
                            <Icon className={`w-5 h-5 ${color}`} />
                          </div>
                          {isEditing ? (
                            <Input
                              value={editedUser.socials[platform]}
                              onChange={(e) =>
                                setEditedUser((prev) => ({
                                  ...prev,
                                  socials: {
                                    ...prev.socials,
                                    [platform]: e.target.value,
                                  },
                                }))
                              }
                              placeholder={`${
                                platform.charAt(0).toUpperCase() +
                                platform.slice(1)
                              } profile URL`}
                              className="flex-1"
                            />
                          ) : (
                            <div className="flex items-center justify-between flex-1">
                              <span className="text-sm text-muted-foreground">
                                {editedUser.socials[platform] || "Not added"}
                              </span>
                              {editedUser.socials[platform] && (
                                <motion.a
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  href={editedUser.socials[platform]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`${color} opacity-0 group-hover:opacity-100 transition-opacity`}
                                >
                                  <LinkIcon className="w-4 h-4" />
                                </motion.a>
                              )}
                            </div>
                          )}
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <div className="flex justify-between space-x-4">
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">
                              {platform.charAt(0).toUpperCase() +
                                platform.slice(1)}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Connect your {platform} profile to share your
                              content
                            </p>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </motion.div>
                ))}
              </motion.div>
            </Card>
          </TabsContent>

          <TabsContent value="connected" className="mt-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Link2 className="w-5 h-5" />
                Connected Accounts
              </h2>
              <motion.div layout className="grid gap-4">
                {Object.entries(platformConfig).map(([platform, config]) => {
                  if (platform === "all") return null;
                  const isConnected =
                    connections[platform as keyof typeof connections];

                  return (
                    <motion.div
                      key={platform}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-md ${
                            config.bgColor || "bg-accent/10"
                          }`}
                        >
                          <config.icon className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <div>
                          <p className="font-medium">{config.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {isConnected ? (
                              <Badge variant="success" className="mt-1">
                                Connected
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="mt-1">
                                Not connected
                              </Badge>
                            )}
                          </p>
                        </div>
                      </div>
                      {isConnected ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Button variant="default" size="sm">
                          Connect
                        </Button>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
}

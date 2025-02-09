import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { platformConfig } from '@/lib/config/tools';
import { CheckCircle2, PencilIcon, Pencil, ChevronLeft, ChevronRight } from 'lucide-react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

export function Profile() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [activeCategory, setActiveCategory] = useState<null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const coverImages = [
    "https://images.unsplash.com/photo-1738447429433-69e3ecd0bdd0?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1738463791783-b61514add113?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1525340581945-d5e2b09641c4?q=80&w=2865&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1686727989799-4c5d3b4846fb?q=80&w=3131&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ];

  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
    email: user?.email || '',
  });

  useEffect(() => {
    const timer = setInterval(() => {
      nextImage();
    }, 5000); // Change image every 5 seconds

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

  // Mocked connection status - will be replaced with real data
  const connections = {
    youtube: false,
    instagram: true,
    twitter: false,
    linkedin: true,
    facebook: false,
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser({
      name: user?.name || '',
      username: user?.username || '',
      bio: user?.bio || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  const handleDashboardClick = () => {
    setActiveCategory(null);
  };

  const toggleCategory = (category: any) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeCategory={activeCategory}
        toggleCategory={toggleCategory}
        handleDashboardClick={handleDashboardClick}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {/* Cover Image Slideshow */}
          <div className="relative h-[240px] w-full group">
            <div 
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-300 ease-in-out ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
              style={{ backgroundImage: `url(${coverImages[currentImageIndex]})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            
            {/* Navigation Arrows */}
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40"
                onClick={previousImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {coverImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentImageIndex === index 
                      ? 'bg-white w-4' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setCurrentImageIndex(index);
                      setIsTransitioning(false);
                    }, 300);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Profile Content */}
          <div className="max-w-[1000px] mx-auto px-4 relative z-10">
            {/* Profile Header */}
            <div className="flex flex-col items-center -mt-20 mb-8">
              <div className="w-32 h-32 rounded-full border-4 border-background shadow-lg overflow-hidden mb-4">
                <img
                  src={user?.picture || `https://ui-avatars.com/api/?name=${user?.name}`}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing ? (
                <div className="space-y-3 w-full max-w-sm">
                  <Input
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    placeholder="Name"
                    className="text-center"
                  />
                  <Input
                    value={editedUser.username}
                    onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                    placeholder="Username"
                    className="text-center"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <h1 className="text-2xl font-bold mb-1">{user?.name}</h1>
                  <p className="text-muted-foreground">@{user?.username}</p>
                </div>
              )}
              <Button 
                onClick={isEditing ? handleSave : handleEdit}
                variant="outline"
                size="sm"
                className="mt-4"
              >
                {isEditing ? (
                  "Save Changes"
                ) : (
                  <>
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>

            {/* Bio Section */}
            <Card className="p-6 mb-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-3">About</h2>
              {isEditing ? (
                <Textarea
                  value={editedUser.bio}
                  onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-muted-foreground">
                  {user?.bio || "No bio added yet."}
                </p>
              )}
            </Card>

            {/* Social Connections */}
            <Card className="p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Connected Accounts</h2>
              <div className="grid gap-4">
                {Object.entries(platformConfig).map(([platform, config]) => {
                  if (platform === 'all') return null;
                  const isConnected = connections[platform as keyof typeof connections];

                  return (
                    <div 
                      key={platform} 
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-md bg-accent/10`}>
                          <config.icon className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <div>
                          <p className="font-medium">{config.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {isConnected ? "Connected" : "Not connected"}
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
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
} 
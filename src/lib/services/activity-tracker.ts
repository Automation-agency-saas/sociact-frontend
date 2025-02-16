interface Activity {
  id: string;
  type: 'thumbnail' | 'script' | 'comment' | 'seo';
  timestamp: string;
  details: {
    title?: string;
    description?: string;
    status?: string;
    score?: number;
  };
}

interface UserStats {
  thumbnails: number;
  scripts: number;
  comments: number;
  seo: number;
}

interface UserSocials {
  instagram: string;
  twitter: string;
  youtube: string;
  linkedin: string;
  website: string;
}

const STORAGE_KEYS = {
  ACTIVITIES: 'user_activities',
  STATS: 'user_stats',
  SOCIALS: 'user_socials'
};

export const activityTracker = {
  // Track new activity
  trackActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => {
    const activities = activityTracker.getActivities();
    const newActivity = {
      ...activity,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };

    // Update activities
    activities.unshift(newActivity);
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities.slice(0, 20)));

    // Update stats
    const stats = activityTracker.getStats();
    stats[`${activity.type}s`]++;
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));

    return newActivity;
  },

  // Get all activities
  getActivities: (): Activity[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return stored ? JSON.parse(stored) : [];
  },

  // Get user stats
  getStats: (): UserStats => {
    const stored = localStorage.getItem(STORAGE_KEYS.STATS);
    return stored ? JSON.parse(stored) : {
      thumbnails: 0,
      scripts: 0,
      comments: 0,
      seo: 0
    };
  },

  // Get latest activity by type
  getLatestActivity: (type: Activity['type']): Activity | null => {
    const activities = activityTracker.getActivities();
    return activities.find(activity => activity.type === type) || null;
  },

  // Save user socials
  saveSocials: (socials: UserSocials) => {
    localStorage.setItem(STORAGE_KEYS.SOCIALS, JSON.stringify(socials));
  },

  // Get user socials
  getSocials: (): UserSocials => {
    const stored = localStorage.getItem(STORAGE_KEYS.SOCIALS);
    return stored ? JSON.parse(stored) : {
      instagram: '',
      twitter: '',
      youtube: '',
      linkedin: '',
      website: ''
    };
  }
}; 
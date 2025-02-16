export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  picture?: string;
  socials?: {
    instagram: string;
    twitter: string;
    youtube: string;
    linkedin: string;
    website: string;
  };
  // ... any other existing fields
} 
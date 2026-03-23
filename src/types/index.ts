export interface User {
  id: string;
  name: string;
  email: string;
  role: 'job_seeker' | 'recruiter';
  avatar?: string;
  phone?: string;
  address?: string;
  birthday?: string;
  education?: string;
  experience?: string;
  skills: string[];
  bio?: string;
  company_name?: string;
  company_description?: string;
  created_at?: string;
}

export interface Job {
  id: string;
  recruiter_id: string;
  title: string;
  company: string;
  description: string;
  requirements: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  currency: string;
  job_type: 'Full-Time' | 'Part-Time' | 'Contract' | 'Freelance' | 'Remote';
  category: string;
  is_promoted: number;
  is_active: number;
  views: number;
  created_at: string;
  recruiter_name?: string;
  recruiter_avatar?: string;
  recruiter_email?: string;
  recruiter_phone?: string;
  company_description?: string;
  application_count?: number;
}

export interface JobApplication {
  id: string;
  job_id: string;
  applicant_id: string;
  cover_letter?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';
  created_at: string;
  title?: string;
  company?: string;
  location?: string;
  job_type?: string;
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  // recruiter view
  name?: string;
  email?: string;
  phone?: string;
  education?: string;
  experience?: string;
  skills?: string[];
  avatar?: string;
}

export interface MarketplaceListing {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  condition: 'new' | 'like_new' | 'good' | 'fair';
  location: string;
  images: string[];
  phone?: string;
  is_active: number;
  is_promoted: number;
  views: number;
  created_at: string;
  seller_name?: string;
  seller_avatar?: string;
  seller_phone?: string;
  seller_email?: string;
}

export interface MatchProfile {
  id: string;
  user_id: string;
  age?: number;
  gender?: string;
  bio?: string;
  interests: string[];
  preferred_area?: string;
  preferred_age_min: number;
  preferred_age_max: number;
  preferred_education?: string;
  preferred_work_field?: string;
  is_active: number;
  photos: string[];
  created_at: string;
  // joined
  name?: string;
  email?: string;
  education?: string;
  experience?: string;
  skills?: string[];
  avatar?: string;
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  match_name: string;
  match_avatar?: string;
  match_user_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender_name: string;
  sender_avatar?: string;
}

export interface Review {
  id: string;
  reviewer_id: string;
  reviewed_id: string;
  rating: number;
  comment?: string;
  context?: string;
  created_at: string;
  reviewer_name: string;
  reviewer_avatar?: string;
}

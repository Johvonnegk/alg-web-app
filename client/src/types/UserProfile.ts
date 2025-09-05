export interface UserProfile {
  role_id: number;
  user_id?: string;
  fname: string;
  lname: string;
  email: string;
  address: string;
  birthday: string;
  phone: string;
  profile_icon?: string;
  created_at: string;
  confirmed?: string;
}
